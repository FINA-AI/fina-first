import StoredReportManagerPage from "../../components/ReportManager/StoredReportManagerPage";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { useTranslation } from "react-i18next";
import { getFormattedDateValue } from "../../util/appUtil";
import useConfig from "../../hoc/config/useConfig";
import {
  deleteStoredReport,
  getAllStoredReports,
  getStoredReportChildren,
  getStoredReportParents,
} from "../../api/services/reportService";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { LanguageType, TreeGridColumnType } from "../../types/common.type";
import { StoredReport, StoredRootReport } from "../../types/report.type";

export interface DeleteModal {
  isOpen: boolean;
  data: StoredRootReport | null;
}

const StoredReportManagerContainer = ({
  languages = [],
}: {
  languages: LanguageType[];
}) => {
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();
  const { openErrorWindow } = useErrorWindow();
  const [loading, setLoading] = useState(true);
  const [storedReports, setStoredReports] = useState<StoredRootReport[]>([]);
  const [allStoredReports, setAllStoredReports] = useState<StoredReport[]>([]);
  const [deleteModal, setDeleteModal] = useState<DeleteModal>(
    {} as DeleteModal
  );

  useEffect(() => {
    initStoredReports();
    loadAllStoredReports();
  }, []);

  const columns: TreeGridColumnType[] = [
    {
      title: t("reportName"),
      dataIndex: "reportName",
      flex: 0.4,
      renderer: (
        value: string,
        row: StoredRootReport,
        index: number,
        expanded: boolean
      ) => {
        return (
          <Box display={"flex"} alignItems={"center"}>
            {row.folder && (
              <>
                {expanded ? (
                  <FolderIcon style={{ color: "#2962FF", paddingLeft: 5 }} />
                ) : (
                  <FolderOpenIcon
                    style={{ color: "#AEB8CB", paddingLeft: 5 }}
                  />
                )}
              </>
            )}
            {!row.folder && (
              <AssignmentIcon style={{ color: "#1c7483", paddingLeft: 5 }} />
            )}
            <div style={{ paddingLeft: 5 }}>{value}</div>
          </Box>
        );
      },
    },
    {
      title: t("reportCode"),
      dataIndex: "reportCode",
      flex: 0.3,
      renderer: (value: number) => {
        return (
          <Box display={"flex"} alignItems={"center"}>
            {value}
          </Box>
        );
      },
    },
    {
      title: t("storeDate"),
      dataIndex: "scheduleTime",
      sortable: true,
      flex: 0.3,
      renderer: (value: number) => {
        return getFormattedDateValue(value, getDateFormat(false));
      },
    },
    {
      title: t("storeUser"),
      dataIndex: "userName",
      flex: 0.3,
      renderer: (value: number) => {
        return (
          <Box display={"flex"} alignItems={"center"}>
            {value}
          </Box>
        );
      },
    },
    {
      title: t("language"),
      dataIndex: "language",
      flex: 0.3,
      renderer: (value: number) => {
        return (
          <Box display={"flex"} alignItems={"center"}>
            {value}
          </Box>
        );
      },
    },
  ];

  const initStoredReports = async () => {
    getStoredReportParents()
      .then((res) => {
        setStoredReports(
          res.data.map((row: StoredRootReport) => {
            let res = {
              ...row,
              id: row["reportId"],
              level: 0,
            };
            delete res.children;
            return res;
          })
        );
      })
      .catch((err) => openErrorWindow(err, t("error"), true))
      .finally(() => {
        setLoading(false);
      });
  };

  const loadAllStoredReports = () => {
    getAllStoredReports()
      .then((res) => {
        let modifyData = [
          ...res.data.map((row: StoredRootReport, index: number) => {
            return { ...row, id: index };
          }),
        ];
        setAllStoredReports(modifyData);
      })
      .catch((err) => openErrorWindow(err, t("error"), true));
  };

  const fetchTreeData = async (node: StoredRootReport, sortObj: any) => {
    let sortDirection =
      sortObj.direction === "up"
        ? "asc"
        : sortObj.direction === "down"
        ? "desc"
        : "desc";
    let result: StoredRootReport[] = [];
    await getStoredReportChildren(node.id, "storeDate", sortDirection).then(
      (res) => {
        result = res.data.map((row: StoredRootReport) => {
          let res = {
            ...row,
            leaf: !row.folder,
            level: node.level + 1,
            language: languages.find(
              (lan) => lan.id === (row.langId ? row.langId : 1)
            )?.name,
          };
          delete res.children;
          return res;
        });
      }
    );
    const targetItem = storedReports.find((item) => item.id === node.id);

    if (targetItem) {
      targetItem.children = result;
      targetItem.expanded = true;
    }

    return result;
  };

  const deleteStoredReportFunc = (storedReport: StoredRootReport) => {
    deleteStoredReport(
      storedReport.reportId,
      storedReport.langId,
      storedReport.hashcode
    )
      .then(() => {
        setStoredReports(
          storedReports.map((parent) => {
            if (parent.id === storedReport.parentId) {
              return {
                ...parent,
                children: (parent?.children ?? [])
                  .filter((item) => item.hashcode !== storedReport.hashcode)
                  .map((child) => ({
                    ...child,
                    level: 1,
                    leaf: true,
                  })),
              };
            }
            return parent;
          })
        );

        setDeleteModal({ isOpen: false, data: null });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
        setDeleteModal({ isOpen: false, data: null });
      });
  };

  const onRefresh = () => {
    initStoredReports();
  };

  return (
    <StoredReportManagerPage
      columns={columns}
      loading={loading}
      fetchTreeData={fetchTreeData}
      storedReports={storedReports}
      setDeleteModal={setDeleteModal}
      deleteModal={deleteModal}
      deleteStoredReportFunc={deleteStoredReportFunc}
      allStoredReports={allStoredReports}
      languages={languages}
      onRefresh={onRefresh}
    />
  );
};

const languageReducer = "language";
const mapStateToProps = (state: any) => ({
  languages: state.getIn([languageReducer, "languages"]),
});

StoredReportManagerContainer.propTypes = {
  languages: PropTypes.array,
};

export default connect(mapStateToProps)(
  React.memo(StoredReportManagerContainer)
);
