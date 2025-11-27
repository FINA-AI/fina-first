import ReportScheduleManagerPage from "../../components/ReportManager/ReportScheduleManagerPage";
import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  loadReportSchedules,
  reportScheduleRun,
} from "../../api/services/reportService";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import useConfig from "../../hoc/config/useConfig";
import { BASE_REST_URL, getFormattedDateValue } from "../../util/appUtil";
import { connect } from "react-redux";
import webSocket from "../../api/websocket/webSocket";
import { useSnackbar } from "notistack";
import { useTheme } from "@mui/material/styles";
import { LanguageType } from "../../types/common.type";
import { ScheduleReport } from "../../types/report.type";

const ReportScheduleManagerContainer = ({
  languages,
}: {
  languages: LanguageType[];
}) => {
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();
  const { openErrorWindow } = useErrorWindow();
  const theme = useTheme();
  const [loadingSkeleton, setLoadingSkeleton] = useState(true);
  const [reportSchedules, setReportSchedules] = useState<ScheduleReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<ScheduleReport>();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [processedReports, setProcessedReports] = useState<any>([]);

  const { enqueueSnackbar } = useSnackbar();

  const getStatusColumn = (status: string) => {
    let statusLabel = t(status);
    let statusBgColor = "green";
    let statusColor = "white";
    switch (status) {
      case "STATUS_SCHEDULED":
        statusBgColor = theme.palette.mode === "dark" ? "#DC6803" : "#eabd4a";
        statusColor = theme.palette.mode === "dark" ? "#FEF0C7" : "#FFF";
        break;
      case "STATUS_PROCESSING":
        statusBgColor = theme.palette.mode === "dark" ? "#B2DDFF" : "#29dfff";
        statusColor = theme.palette.mode === "dark" ? "#1849A9" : "#FFF";
        break;
      case "STATUS_DONE":
        statusBgColor = theme.palette.mode === "dark" ? "#079455" : "#79ecb2";
        statusColor = theme.palette.mode === "dark" ? "#ABEFC6" : "#FFF";
        break;
      case "STATUS_ERROR":
        statusBgColor = theme.palette.mode === "dark" ? "#B42318" : "#de0f0f";
        statusColor = theme.palette.mode === "dark" ? "#FEE4E2" : "#FFF";
        break;
    }

    return (
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        style={{
          fontWeight: 500,
          backgroundColor: statusBgColor,
          borderRadius: 4,
          color: statusColor,
        }}
      >
        {statusLabel}
      </Box>
    );
  };

  const columnHeader = [
    {
      title: t("reportName"),
      dataIndex: "reportName",
      width: 350,
      renderer: (value: string) => {
        return (
          <Box
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {value}
          </Box>
        );
      },
    },
    {
      title: t("reportCode"),
      dataIndex: "reportCode",
      flex: 1,
      renderer: (value: string) => {
        return (
          <Box
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {value}
          </Box>
        );
      },
    },
    {
      title: t("scheduledTime"),
      dataIndex: "onDemand",
      flex: 1,
      renderer: (value: string, row: ScheduleReport) => {
        return (
          <Box display={"flex"} alignItems={"center"}>
            {row.scheduleTime && !value
              ? getFormattedDateValue(row.scheduleTime, getDateFormat(true))
              : value
              ? t("onDemand")
              : "-"}
          </Box>
        );
      },
    },
    {
      title: t("status"),
      dataIndex: "status",
      flex: 1,
      renderer: (value: string, row: ScheduleReport) => {
        if (row.level === 0) {
          return <></>;
        }
        return getStatusColumn(value);
      },
    },
    {
      title: t("user"),
      dataIndex: "userName",
      flex: 1,
      renderer: (value: string) => {
        return (
          <Box display={"flex"} alignItems={"center"}>
            {value}
          </Box>
        );
      },
    },
    {
      title: t("language"),
      dataIndex: "langId",
      flex: 1,
      renderer: (value: number) => {
        return (
          <Box display={"flex"} alignItems={"center"}>
            {languages.map((language) => {
              if (language.id === value) {
                return language.name;
              }
            })}
          </Box>
        );
      },
    },

    {
      title: t("fileLocation"),
      dataIndex: "fileStorageLocation",
      flex: 1,
      renderer: (value: string) => {
        return (
          <Box display={"flex"} alignItems={"center"}>
            {value}
          </Box>
        );
      },
    },
    {
      title: t("repositoryFolder"),
      dataIndex: "repositoryFolderName",
      flex: 1,
      renderer: (value: string) => {
        return (
          <Box display={"flex"} alignItems={"center"}>
            {value}
          </Box>
        );
      },
    },
    {
      title: t("notificationMails"),
      dataIndex: "notificationMails",
      flex: 1,
      renderer: (value: string) => {
        return (
          <Box display={"flex"} alignItems={"center"}>
            {value}
          </Box>
        );
      },
    },
  ];

  useEffect(() => {
    initReports();
    initWebsocket();
  }, []);

  useEffect(() => {
    const processedReport: any = processedReports[0];
    if (processedReport) {
      updateReportStatus(
        [{ reportId: processedReport.reportId }] as ScheduleReport[],
        processedReport.status
      );

      enqueueSnackbar(t(`reportprocessed`), {
        variant: "success",
      });
    }
  }, [processedReports]);

  const initWebsocket = () => {
    webSocket("ws/reportSchedule", (message: any) => {
      const reportMessage = JSON.parse(message);
      setProcessedReports([reportMessage]);
    });
  };

  const initReports = async () => {
    await loadReportSchedules()
      .then((res) => {
        let arr: ScheduleReport[] = res.data.map((parent: ScheduleReport) => {
          return {
            ...parent,
            id: parent.reportId,
            level: 0,
            leaf: !parent.folder,
          };
        });
        setLoadingSkeleton(false);

        const getChildrenFromParentRecursive = (parent: ScheduleReport) => {
          if (parent.children) {
            parent.children.forEach((child) => {
              child.id = child.generatedId;
              child.level = parent.level + 1;
              child.leaf = !child.folder;
              getChildrenFromParentRecursive(child);
            });
          }
        };

        arr.forEach((parent) => {
          getChildrenFromParentRecursive(parent);
        });

        setReportSchedules(arr);
      })
      .catch((e) => {
        openErrorWindow(e, t("error"), true);
      });
  };

  const fetchDataTree = () => {
    return reportSchedules;
  };

  const handleClickReview = (type: string) => {
    if (selectedReport) {
      window.open(
        BASE_REST_URL +
          `/report/schedule/review/${selectedReport.reportId}/${type}/${selectedReport.hashcode}/${selectedReport.langId}?reportName=${selectedReport.reportName}`,
        "_blank"
      );
    }
  };

  const updateReportStatus = (reports: ScheduleReport[], status: string) => {
    const reportIDs = reports.map((r) => r.reportId);
    reportSchedules.forEach((rs) => {
      const foundRecords = (rs?.children ?? []).filter(
        (child) => reportIDs.indexOf(child.id) >= 0
      );
      if (foundRecords) {
        foundRecords.forEach((r) => (r.status = status));
      }
    });

    setReportSchedules([...reportSchedules]);
  };

  const runScheduledReport = (reports: ScheduleReport[]) => {
    reportScheduleRun(reports).catch((error) => {
      updateReportStatus(reports, "STATUS_ERROR");

      enqueueSnackbar(error, {
        variant: "error",
      });
    });
    updateReportStatus(reports, "STATUS_PROCESSING");
  };

  return (
    <ReportScheduleManagerPage
      columnHeader={columnHeader}
      loadingSkeleton={loadingSkeleton}
      fetchDataTree={fetchDataTree}
      reportSchedules={reportSchedules}
      anchorEl={anchorEl}
      setAnchorEl={setAnchorEl}
      handleClickReview={handleClickReview}
      selectedReport={selectedReport}
      setSelectedReport={setSelectedReport}
      onRunClick={runScheduledReport}
    />
  );
};

const languageReducer = "language";
const mapStateToProps = (state: any) => ({
  languages: state.getIn([languageReducer, "languages"]),
});

export default connect(mapStateToProps)(
  React.memo(ReportScheduleManagerContainer)
);
