import ReportManagerPage from "../../components/ReportManager/ReportManagerPage/ReportManagerPage";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  addReport,
  loadReports,
  loadReportTree,
  moveDown,
  moveReport,
  moveUp,
  reportDelete,
} from "../../api/services/reportService";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import {
  getStateFromLocalStorage,
  setStateToLocalStorage,
} from "../../api/ui/localStorageHelper";
import SimpleLoadMask from "../../components/common/SimpleLoadMask";
import { Report } from "../../types/report.type";
import { useSnackbar } from "notistack";

export interface DeleteModal {
  isOpen: boolean;
  data: Report | null;
}

const ReportManagerContainer = () => {
  const { t } = useTranslation();
  const treeKey = "reportManagerTreeCustomization";
  const { openErrorWindow } = useErrorWindow();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<DeleteModal>();
  const [data, setData] = useState<Report[]>([]);
  const [loadMask, setLoadMask] = useState(false);
  const [treeDataFull, setTreeDataFull] = useState<Report[]>([]);

  const columns = [
    {
      title: t("code"),
      dataIndex: "code",
      flex: 1,
    },
    {
      title: t("name"),
      dataIndex: "description",
      flex: 2,
      renderer: (value: string) => {
        return value;
      },
    },
  ];

  useEffect(() => {
    initData();
    loadFullTreeData();
  }, []);

  const initData = (type?: string, hideEmptyFolder?: boolean) => {
    const reportManagerState = getStateFromLocalStorage()[treeKey];
    const expandedRowIds = reportManagerState?.["expandedRowIds"];

    if (reportManagerState && expandedRowIds?.length > 0) {
      loadData(
        expandedRowIds,
        type,
        reportManagerState?.["hideEmptyFolders"] ?? hideEmptyFolder ?? true
      );
    } else {
      setData([
        {
          id: 0,
          parentId: -1,
          expanded: false,
          level: 0,
          leaf: false,
          code: "Reports",
          description: "Root",
        },
      ] as Report[]);
      setLoading(false);
      setLoadMask(false);
    }
  };

  const loadData = async (
    defaultExpandedRowIds: number[],
    type?: string,
    hide?: boolean
  ) => {
    loadReports(0, type, hide)
      .then((res) => {
        let result: Report[] = [
          {
            id: 0,
            parentId: -1,
            expanded: true,
            level: 0,
            leaf: false,
            code: "Reports",
            description: "Root",
            children: res.data.map((item: Report) => {
              return {
                ...item,
                level: 1,
                leaf: item.type !== 1,
                expanded: false,
              };
            }),
          },
        ] as Report[];

        createDataConfiguration(result, defaultExpandedRowIds, hide);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
        setLoading(false);
        setLoadMask(false);
      });
  };

  const loadFullTreeData = () => {
    loadReportTree().then((res) => {
      let reportsArr = [
        {
          id: 0,
          parentId: -1,
          expanded: false,
          level: 0,
          leaf: false,
          code: "Reports",
          description: "Root",
        },
      ];
      for (let report of res.data) {
        reportsArr.push(report.parent);
        for (let child of report.children) {
          child.leaf = child.type === 2;
          reportsArr.push(child);
        }
      }
      setTreeDataFull(reportsArr as Report[]);
    });
  };

  const findParentAndAddChildren = (
    data: Report[],
    parentId: number,
    children: Report[]
  ) => {
    for (let item of data) {
      if (item.id === parentId) {
        item.expanded = true;
        item.children = children.map((row) => {
          return {
            ...row,
            level: item.level + 1,
            leaf: row.type !== 1,
          };
        });
        return true;
      } else if (item.children && item.children.length > 0) {
        if (findParentAndAddChildren(item.children, parentId, children)) {
          return true;
        }
      }
    }
    return false;
  };

  const createDataConfiguration = async (
    data: Report[],
    defaultExpandedRowIds: number[],
    hide?: boolean
  ) => {
    for (let id of defaultExpandedRowIds) {
      if (id !== 0) {
        let result = await getReportChildrenById(id, hide);
        // Add children to their respective parent in the data
        findParentAndAddChildren(data, id, result.data);
      }
    }

    setLoading(false);
    setLoadMask(false);
    setData([...data]);
  };

  const getReportChildrenById = async (id: number, hide?: boolean) => {
    return await loadReports(id, undefined, hide);
  };

  const getChildren = async (row: Report) => {
    const reportManagerState = getStateFromLocalStorage()[treeKey];

    let res = await loadReports(
      row.id,
      undefined,
      reportManagerState?.["hideEmptyFolders"] ?? true
    );

    let children = res.data.map((item: Report) => {
      return {
        ...item,
        level: row.level + 1,
        leaf: item.type !== 1,
        expanded: false,
      };
    });

    const getChildrenByParent = (parent: Report) => {
      if (parent.children) {
        parent.children.forEach((child) => {
          if (child.id === row.id) {
            child.children = children;
          } else {
            getChildrenByParent(child);
          }
        });
      }
    };

    data.forEach((item) => {
      if (item.id === row.id) {
        item.children = children;
      } else {
        getChildrenByParent(item);
      }
    });

    return children;
  };

  const onPasteFunction = (sourceRow: Report, destinationRow: Report) => {
    //ignore paste in same folder and in leaf
    if (sourceRow.parentId === destinationRow.id || destinationRow.leaf) {
      return;
    }
    setLoadMask(true);

    moveReport(sourceRow.id, destinationRow.id)
      .then((resp) => {
        sourceRow.sequence = resp.data.sequence;
        initData();
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const refreshFunction = () => {
    initData();
  };

  const hideEmptyFoldersFunc = () => {
    initData(undefined, true);
  };

  const showFoldersFunc = () => {
    initData(undefined, false);
  };

  const deleteReport = (reportId: number[]) => {
    reportDelete(reportId)
      .then(() => {
        let arr: Report[] = [];
        let targetRow = deleteModal?.data;
        if (targetRow) {
          if (targetRow.parentId === -1) {
            arr = data.filter((row) => row.id !== targetRow?.id);
          } else {
            data
              .filter((f) => f.level === 0)
              .forEach((mainRow) => {
                let newRow = { ...mainRow };
                const findChildrenRecursive = (child: Report) => {
                  if (child.children) {
                    let children = [];
                    for (let item of child.children) {
                      if (
                        item.id !== targetRow?.id &&
                        item.parentId !== targetRow?.id
                      ) {
                        children.push(item);
                        findChildrenRecursive(item);
                      }
                    }
                    child.children = children;
                  }
                };
                findChildrenRecursive(newRow);
                arr.push(newRow);
              });
          }
          setData(arr);
        }
        setDeleteModal({ isOpen: false, data: null });
        enqueueSnackbar(t("deleted"), { variant: "success" });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
        setDeleteModal({ isOpen: false, data: null });
      });
  };

  const onSaveFunction = (report: Report, selectedReport: Report) => {
    addReport(report)
      .then((res) => {
        if (report.id === 0) {
          if (selectedReport.expanded && selectedReport.children) {
            selectedReport.children.push({
              ...res.data,
              level: report.level + 1,
              leaf: report.leaf,
            });
          }
        }
        setData([...data]);
        enqueueSnackbar(t(report.id ? "edited" : "addNewItem"), {
          variant: "success",
        });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const onRowExpandChange = (expanded: boolean, row: Report) => {
    const reportManagerState = getStateFromLocalStorage()[treeKey];

    if (reportManagerState && reportManagerState?.["expandedRowIds"]) {
      if (!expanded && row.id === 0) {
        setStateToLocalStorage(treeKey, {
          ...reportManagerState,
          expandedRowIds: [],
        });
      } else {
        let arr: number[] = reportManagerState?.["expandedRowIds"];
        if (expanded) {
          arr.push(row.id);
        } else {
          arr = arr.filter((item) => item !== row.id);
        }

        setStateToLocalStorage(treeKey, {
          ...reportManagerState,
          expandedRowIds: arr,
        });
      }
    } else {
      setStateToLocalStorage(treeKey, {
        ...reportManagerState,
        expandedRowIds: [row.id],
      });
    }
  };

  const moveUpReport = async (selectedNode: Report) => {
    setLoadMask(true);
    await moveUp(selectedNode);
    initData();
  };
  const moveDownReport = async (selectedNode: Report) => {
    setLoadMask(true);
    await moveDown(selectedNode);
    initData();
  };

  return (
    <>
      <ReportManagerPage
        columns={columns}
        loading={loading}
        data={data}
        getChildren={getChildren}
        onPasteFunction={onPasteFunction}
        refreshFunction={refreshFunction}
        deleteReport={deleteReport}
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        onSaveFunction={onSaveFunction}
        onRowExpandChange={onRowExpandChange}
        hideEmptyFoldersFunc={hideEmptyFoldersFunc}
        showFoldersFunc={showFoldersFunc}
        onMoveUp={moveUpReport}
        onMoveDown={moveDownReport}
        treeDataFull={treeDataFull}
        treeKey={treeKey}
      />
      {loadMask && (
        <SimpleLoadMask
          loading={true}
          message={"Working Please Wait..."}
          color={"primary"}
        />
      )}
    </>
  );
};

export default React.memo(ReportManagerContainer);
