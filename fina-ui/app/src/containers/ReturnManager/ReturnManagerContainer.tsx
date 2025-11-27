import ReturnManagerPage, {
  DeleteConfirmType,
} from "../../components/ReturnManager/ReturnManagerPage";
import {
  changedReturnStatusService,
  deleteReturnService,
  getReturnDefinitions,
  getReturnPackages,
  getReturnPackagesChildren,
  getReturnTypes,
  saveReturnAs,
} from "../../api/services/returnsService";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import {
  FilterTypes,
  getFormattedDateValue,
  NumOfRowsPerPage,
} from "../../util/appUtil";
import { getVersions } from "../../api/services/versionsService";
import useConfig from "../../hoc/config/useConfig";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { Box, lighten, styled } from "@mui/system";
import ReturnManagerVersionCell from "../../components/ReturnManager/ReturnManagerVersionCell";
import { saveAndProcessReturn } from "../../api/services/manualInputService";
import { useSnackbar, VariantType } from "notistack";
import { returnManagerConstants } from "../../components/ReturnManager/ReturnManagerConstants";
import ReturnDefinitionFilter from "../../components/common/Filter/ReturnDefinitionFilter";
import FiFilter from "../../components/common/Filter/FIFilter";
import { loadFiTree } from "../../api/services/fi/fiService";
import { connect } from "react-redux";
import ReturnTypeAutocompleteFilter from "../../components/common/Filter/ReturnTypeAutocompleteFilter";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import { Return } from "../../types/return.type";
import {
  FilterType,
  TreeGridColumnType,
  TreeState,
} from "../../types/common.type";
import {
  ReturnDefinitionType,
  ReturnType,
} from "../../types/returnDefinition.type";
import { FiType } from "../../types/fi.type";
import { ReturnVersion } from "../../types/importManager.type";
import { MiTable } from "../../types/manualInput.type";
import { loadCurrentUserReturnVersions } from "../../api/services/userManagerService";
import { ProcessedResult, ReturnStatus } from "../../types/returnManager.type";
import ReturnProcessResultModal from "../../components/ReturnManager/ReturnProcessResultModal";

export interface StateType {
  columns: TreeGridColumnType[];
  filtersApiPayload: FilterType;
  loadAllDataSwitchEnabled: boolean;
  uiFilters: FilterType;
}

const StyledSpan = styled("span")({
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
});

export const getStatusColumnStyle = (status: string) => {
  let result = { background: "", color: "" };
  switch (status) {
    case ReturnStatus.STATUS_SCHEDULED:
      result.color = "#596D89";
      break;
    case ReturnStatus.STATUS_CREATED:
    case ReturnStatus.STATUS_AMENDED:
      result.color = "#2962FF";
      break;
    case ReturnStatus.STATUS_IMPORTED:
      result.color = "#035164";
      break;
    case ReturnStatus.STATUS_PROCESSED:
      result.color = "#1c7483";
      break;
    case ReturnStatus.STATUS_VALIDATED:
      result.color = "#596D89";
      break;
    case ReturnStatus.STATUS_RESETED:
      result.color = "#929496";
      break;
    case ReturnStatus.STATUS_ACCEPTED:
      result.color = "#289E20";
      break;
    case ReturnStatus.STATUS_REJECTED:
    case ReturnStatus.STATUS_ERRORS:
      result.color = "#FF4128";
      break;
    case ReturnStatus.STATUS_LOADED:
    case ReturnStatus.STATUS_QUEUED:
      result.color = "#FF8D00";
      break;
    default:
      result.color = "#596D89";
      break;
  }
  result.background = lighten(result.color, 0.8);

  return result;
};

const ReturnManagerContainer = ({ state }: { state: StateType }) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const { getDateFormat } = useConfig();
  const { enqueueSnackbar } = useSnackbar();

  const [treeState, setTreeState] = useState<TreeState<Return[]>>({
    treeData: [],
    columns: [],
  });
  const [data, setData] = useState<Return[]>([]);
  const [loadingMask, setLoadingMask] = useState(false);
  const [loadingSkeleton, setLoadingSkeleton] = useState(true);
  const [activePage, setActivePage] = useState(1);
  const [pagingLimit, setPagingLimit] = useState(
    NumOfRowsPerPage.INITIAL_ROWS_PER_PAGE
  );
  const [returnVersions, setReturnVersions] = useState<ReturnVersion[]>([]);
  const [currUserReturnVersions, setCurrUserReturnVersions] = useState<
    ReturnVersion[]
  >([]);
  const [selectedRows, setSelectedRows] = useState<Return[]>([]);
  const [returns, setReturns] = useState([]);
  const [fiData, setFiData] = useState([]);
  const [filteredData, setFilteredData] = useState<FilterType>({
    loadAllPeriodData: !!state?.loadAllDataSwitchEnabled,
    ...(state?.filtersApiPayload ?? {}),
  });
  const [returnTypes, setReturnTypes] = useState<ReturnType[]>([]);
  const dataChildren = useRef<{ id: string; children: Return[] }[]>([]);
  const [expandAll, setExpandAll] = useState(false);
  const defaultExpandedRowsIdsRef = useRef<(string | number)[]>([]);

  const [sortField, setSortField] = useState<{ [key: string]: string } | null>(
    null
  );
  const [processResult, setProcessResult] = useState<ProcessedResult[]>([]);

  const theme = useTheme();

  const getStateFilterValue = (key: string) => state?.uiFilters?.[key] || null;

  let columnsHeader: TreeGridColumnType[] = [
    {
      dataIndex: "name",
      title: t("name"),
      flex: 3,
      minWidth: 250,
      hideSort: true,
      renderer: (value: string, row: Return) => {
        return (
          <Box display={"flex"} alignItems={"center"}>
            {row.leaf ? (
              <>
                <InsertDriveFileIcon
                  style={{
                    color: theme.palette.primary.main,
                    marginRight: "16px",
                  }}
                />
                <StyledSpan data-testid={"definition-code"}>
                  {row.definitionCode}
                </StyledSpan>
              </>
            ) : (
              <>
                <FolderIcon style={{ color: "#FDB022", marginRight: "16px" }} />
                <StyledSpan data-testid={"definition-label"}>
                  {row.label}
                </StyledSpan>
              </>
            )}
          </Box>
        );
      },
    },
    {
      dataIndex: "fromDate",
      title: t("from"),
      flex: 1,
      filter: {
        type: FilterTypes.datePicker,
        name: "periodFromDate",
        value: getStateFilterValue("periodFromDate"),
      },
      hideCopy: true,
      renderer: (value: string) =>
        getFormattedDateValue(value, getDateFormat(true)),
    },
    {
      dataIndex: "toDate",
      title: t("to"),
      flex: 1,
      hideCopy: true,
      filter: {
        type: FilterTypes.datePicker,
        name: "periodToDate",
        value: getStateFilterValue("periodToDate"),
      },
      renderer: (value: string) =>
        getFormattedDateValue(value, getDateFormat(true)),
    },
    {
      dataIndex: "definitionDescription",
      title: t("returnDefinition"),
      flex: 1,
      hideSort: true,
      filter: {
        type: FilterTypes.fis,
        name: "definitionId",
        value: getStateFilterValue("definitionId"),
        renderFilter: (
          columnsFilter: FilterType[],
          onFilterClick: (result: ReturnDefinitionType | {}) => void,
          onClear: VoidFunction
        ) => {
          return (
            <ReturnDefinitionFilter
              onClickFunction={onFilterClick}
              data={returns}
              label={t("returnDefinition")}
              closeFilter={onClear}
              defaultValue={
                columnsFilter.find((el) => el.name === "definitionId")?.value
              }
              loading={false}
              singleSelect={true}
              isGrid={false}
            />
          );
        },
      },
    },
    {
      dataIndex: "returnTypeCode",
      title: t("returnType"),
      flex: 1,
      minWidth: 130,
      filter: {
        type: FilterTypes.fis,
        name: "returnTypeId",
        value: getStateFilterValue("returnTypeId"),
        renderFilter: (
          columnsFilter: FilterType[],
          onFilterClick: (result: ReturnType | {}) => void,
          onClear: VoidFunction,
          value: ReturnType
        ) => {
          return (
            <ReturnTypeAutocompleteFilter
              onClickFunction={onFilterClick}
              data={returnTypes}
              label={t("returnTypes")}
              defaultValue={value}
              closeFilter={onClear}
            />
          );
        },
      },
    },
    {
      dataIndex: "fiDescription",
      title: t("fiName"),
      flex: 1,
      hideSort: true,
      filter: {
        type: FilterTypes.string,
        name: "fiIds",
        value: getStateFilterValue("fiIds"),
        renderFilter: (
          columnsFilter: FilterType[],
          onFilterClick: (result: FiType | {}) => void,
          onClear: VoidFunction
        ) => {
          return (
            <FiFilter
              label={t("fiName")}
              onClickFunction={onFilterClick}
              defaultValue={
                columnsFilter.find((el) => el.name === "fiIds")?.value
              }
              closeFilter={onClear}
              data={fiData}
            />
          );
        },
      },
    },
    {
      dataIndex: "versionCode",
      flex: 1,
      title: t("version"),
      filter: {
        type: FilterTypes.list,
        name: "returnVersionId",
        value: getStateFilterValue("returnVersionId"),
        filterArray: returnVersions.map((item) => ({
          label: item.code,
          value: item.id,
        })),
      },
      renderer: (value: string) => {
        return <ReturnManagerVersionCell value={value} />;
      },
    },
    {
      dataIndex: "statusDate",
      title: t("statusDate"),
      flex: 1,
      hideCopy: true,
      hideSort: true,
      renderer: (value: string) =>
        getFormattedDateValue(value, getDateFormat(true)),
    },
    {
      dataIndex: "status",
      title: t("status"),
      flex: 1,
      hideSort: true,
      filter: {
        type: FilterTypes.list,
        name: "returnProcessStatus",
        value: getStateFilterValue("returnProcessStatus"),
        filterArray: returnManagerConstants,
      },
      renderer: (value: string, row: Return) => {
        return (
          row.leaf && (
            <Box
              padding={"4px 12px"}
              fontSize={"12px"}
              fontWeight={500}
              lineHeight={"16px"}
              style={getStatusColumnStyle(value)}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              borderRadius={"4px"}
              data-testid={"process-status"}
            >
              {t(value)}
            </Box>
          )
        );
      },
    },
  ];

  const [columns, setColumns] = useState<TreeGridColumnType[]>([]);

  useEffect(() => {
    loadReturnVersionData();
    loadCurrUserReturnVersions();
    getReturns();
    getFis();
    loadReturnTypes();
  }, []);

  useEffect(() => {
    init();
    setSelectedRows([]);
    dataChildren.current = [];
    setExpandAll(false);
  }, [pagingLimit, activePage, filteredData, sortField]);

  useEffect(() => {
    defaultExpandedRowsIdsRef.current = expandAll
      ? data.map((row) => row.id)
      : [];
  }, [expandAll]);

  useEffect(() => {
    if (state?.columns?.length) {
      let newCols: TreeGridColumnType[] = [];
      for (let item of state.columns) {
        let headerCell = columnsHeader.find(
          (el) => item.dataIndex === el.dataIndex
        );
        if (headerCell) {
          headerCell.hidden = item.hidden;
          headerCell.fixed = item.fixed;
          newCols.push(headerCell);
        }
      }
      setColumns(newCols);
    } else {
      setColumns(columnsHeader);
    }
  }, [t, returns, fiData, state]);

  const rowSelectHandler = (row: Return, rows: Return[]) => {
    setSelectedRows(rows.sort((a, b) => a?.index - b?.index));
  };

  const loadReturnVersionData = () => {
    getVersions(false).then((resp) => {
      setReturnVersions(resp.data);
    });
  };

  const loadCurrUserReturnVersions = () => {
    loadCurrentUserReturnVersions().then((resp) => {
      setCurrUserReturnVersions(resp.data);
    });
  };

  const loadReturnTypes = () => {
    getReturnTypes()
      .then((res) => {
        setReturnTypes(res.data);
      })
      .catch((e) => {
        openErrorWindow(e, t("error"), true);
      });
  };

  const getReturns = () => {
    getReturnDefinitions()
      .then((resp) => {
        setReturns(resp.data);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const getFis = () => {
    loadFiTree()
      .then((res) => {
        setFiData(res.data);
      })
      .catch((error) => enqueueSnackbar(error, { variant: "error" }));
  };

  const init = () => {
    setLoadingMask(true);
    const source = axios.CancelToken.source();

    getReturnPackages(
      activePage,
      pagingLimit,
      filteredData,
      source.token,
      sortField as {}
    )
      .then(async (resp) => {
        const updatedData = await Promise.all(
          resp.data.list.map(async (row: Return) => {
            let id = `${row.label}${row.periodId}`;
            let rowChildren = dataChildren.current.find(
              (item: any) => item.id === row.label
            );
            let children;
            if (rowChildren) {
              children = await getChildren(row, filteredData);
            }
            return {
              ...row,
              id: id,
              parentRowId: 0,
              children: children || null,
            };
          })
        );
        setData(updatedData);
      })
      .catch((error) => {
        openErrorWindow(error, t("error"), true);
      })
      .finally(() => {
        setLoadingSkeleton(false);
        setLoadingMask(false);
      });
  };

  const getChildren = async (row: Return, filteredData: FilterType) => {
    let res: Return[] = [];
    if (row) {
      const resp = await getReturnPackagesChildren(
        row.fiId,
        row.periodId,
        row.returnTypeId,
        row.versionId,
        filteredData
      );
      res = resp.data.map((item: Return) => {
        return {
          ...item,
          leaf: true,
          parentRowId: `${row.label}${row.periodId}`,
        };
      });
      row.children = res;
      let obj = { id: `${row.label}${row.periodId}`, children: res };
      dataChildren.current = [
        ...dataChildren.current.filter((item: any) => item.label !== row.label),
        obj,
      ];
    }
    return res;
  };

  const onPagingLimitChange = (limit: number) => {
    setActivePage(1);
    setPagingLimit(limit);
  };

  const saveAsClickHandler = async (
    selectedReturns: Return[],
    versionId: number | string,
    note: string
  ) => {
    await saveReturnAs({
      returnModels: selectedReturns,
      versionId,
      note,
    });

    const selectedReturn = selectedReturns[0];
    await updateParentNodeChildren(selectedReturn.parentRowId);

    const rootNode =
      data.find(
        (root) =>
          root.fiId === selectedReturn.fiId &&
          root.periodId === selectedReturn.periodId &&
          root.returnTypeId === selectedReturn.returnTypeId
      ) || ({} as Return);

    const version =
      returnVersions.find((v) => v.id === Number(versionId)) ||
      ({} as ReturnVersion);

    const baseLabel = rootNode.id.toString().split(" ").slice(0, 4).join(" ");
    const label = `${baseLabel} ${version.code}`;
    const id = `${label}${rootNode.periodId}`;

    const newEntry = {
      ...rootNode,
      children: null,
      level: 0,
      versionId: Number(versionId),
      versionCode: version.code,
      id,
      label,
    };

    const selectedRootIndex = treeState.treeData.findIndex(
      (node) => node.id === rootNode.id
    );

    if (selectedRootIndex === -1) return;

    setTreeState((prev) => {
      const updatedTreeData = [...prev.treeData];

      const newEntryIndex = updatedTreeData.findIndex(
        (node) => node.id === newEntry.id
      );

      if (newEntryIndex !== -1) {
        updatedTreeData[newEntryIndex] = newEntry;
        data[newEntryIndex] = newEntry;
      } else {
        updatedTreeData.splice(selectedRootIndex, 0, newEntry);
        data.unshift(newEntry);
      }

      return {
        ...prev,
        treeData: updatedTreeData,
      };
    });
  };

  const onSaveActionStatusHandler = async (
    selectedReturns: Return[],
    returnStatus: string,
    note: string
  ) => {
    const selectedReturn = selectedReturns[0];

    const returns = selectedReturn?.children
      ? selectedReturn.children
      : selectedReturns;

    await changedReturnStatusService({
      returnModels: returns,
      status: returnStatus,
      note: note,
    });

    const parentRowId =
      selectedReturn.group && selectedReturn.children?.length
        ? selectedReturn.children[0].parentRowId
        : selectedReturn.parentRowId;

    await updateParentNodeChildren(parentRowId);
  };

  const deleteReturnHandler = (
    selectedReturn: Return,
    setIsDeleteConfirmOpen: (info: DeleteConfirmType) => void
  ) => {
    if (selectedReturn.group) {
      selectedReturn.id = 0;
      delete selectedReturn.children;
    }

    const isChildNodeSelected = !selectedReturn.group;
    const parentNodeId = isChildNodeSelected ? selectedReturn.parentRowId : 0;

    deleteReturnService(selectedReturn)
      .then(async () => {
        enqueueSnackbar(t("deleted"), {
          variant: "success",
        });
        const parentNode =
          data.find((item) => item.id === parentNodeId) || ({} as Return);
        if (
          isChildNodeSelected &&
          parentNode?.children &&
          parentNode?.children.length > 1
        ) {
          await updateParentNodeChildren(parentNodeId);
        } else {
          setTreeState({
            ...treeState,
            treeData: treeState.treeData.filter(
              (node) => node.id !== parentNodeId
            ),
          });
        }
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), false);
      })
      .finally(() =>
        setIsDeleteConfirmOpen({ isOpen: false, row: null, loading: true })
      );
  };

  const prepareReturnData = (tables: MiTable[]) => {
    return tables.map((table) => ({
      ...table,
      rows: table.rows.map((row) => ({
        ...row,
        rowItems: row.rowItems.map((row) => ({
          ...row,
          listElementValues: [],
        })),
      })),
    }));
  };

  const saveAndProcessHandler = async (
    tables: MiTable[],
    returnId: number,
    versionId: number,
    noteValue: string,
    parentRowId: number
  ) => {
    const updatedData = prepareReturnData(tables);

    let response;
    try {
      response = await saveAndProcessReturn(
        updatedData,
        returnId,
        versionId,
        noteValue
      );
    } catch (error) {
      console.error(error);
      openErrorWindow(error);
      return false;
    }

    let snackBarVariant = "success";
    let snackbarText = "Return Submitted";
    const processResult = response.data;

    await updateParentNodeChildren(parentRowId);

    const result: Map<string, ProcessedResult> = new Map(
      Object.entries(processResult)
    );

    const processNotes: ProcessedResult[] = Array.from(result.values());
    const hasErrors = processNotes.some(
      (pr) => pr.status !== ReturnStatus.STATUS_PROCESSED
    );

    const currentReturnProcessResult = result.get(returnId.toString());

    if (
      currentReturnProcessResult &&
      currentReturnProcessResult.status !== ReturnStatus.STATUS_PROCESSED
    ) {
      const error = {
        response: {
          data: {
            message: currentReturnProcessResult.processNote,
          },
        },
      };
      openErrorWindow(error);
      return false;
    } else {
      enqueueSnackbar(snackbarText, {
        variant: snackBarVariant as VariantType,
      });
    }

    setProcessResult(hasErrors ? processNotes : []);

    return true;
  };

  const updateParentNodeChildren = async (parentNodeId: number) => {
    const parentNode = data.find((item) => item.id === parentNodeId);

    if (!parentNode) return;

    const fetchedChildren = await getChildren(parentNode, filteredData);

    setTreeState({
      ...treeState,
      treeData: [
        ...treeState.treeData.map((row) =>
          row.id === parentNodeId ? { ...row, children: fetchedChildren } : row
        ),
      ],
    });
    const selectedFilteredRows = fetchedChildren.filter((item) =>
      selectedRows.some((row) => row.id === item.id)
    );
    setSelectedRows(selectedFilteredRows);
  };

  const onSortClick = (sortField: string, sortDirection: string) => {
    setSortField({
      sortField,
      sortDirection: sortDirection === "up" ? "asc" : "desc",
    });
  };

  return (
    <>
      <ReturnManagerPage
        state={state}
        treeState={treeState}
        setTreeState={setTreeState}
        data={data}
        loadingMask={loadingMask}
        loadingSkeleton={loadingSkeleton}
        setRowPerPage={onPagingLimitChange}
        pagingPage={activePage}
        setActivePage={setActivePage}
        columns={columns}
        setColumns={setColumns}
        returnVersions={returnVersions}
        currUserReturnVersions={currUserReturnVersions}
        saveAsClickHandler={saveAsClickHandler}
        setSelectedRows={setSelectedRows}
        selectedRows={selectedRows}
        rowSelectHandler={rowSelectHandler}
        saveAndProcessHandler={saveAndProcessHandler}
        getChildren={getChildren}
        init={init}
        onSaveActionStatusHandler={onSaveActionStatusHandler}
        deleteReturnHandler={deleteReturnHandler}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        dataChildren={dataChildren}
        expandAll={expandAll}
        setExpandAll={setExpandAll}
        definitions={returns}
        returnTypes={returnTypes}
        defaultExpandedRowsIds={defaultExpandedRowsIdsRef.current}
        orderRowByHeader={onSortClick}
      />
      {processResult.length > 0 && (
        <ReturnProcessResultModal
          title={"Process Result (Includes Dependent Returns)"}
          onClose={() => {
            setProcessResult([]);
          }}
          data={processResult}
          isOpen={true}
        />
      )}
    </>
  );
};

const mapStateToProps = (state: any) => ({
  state: state.getIn(["state", "returnManagerTableCustomization"]),
});

const dispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  dispatchToProps
)(ReturnManagerContainer);
