import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import React from "react";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PrimaryBtn from "../common/Button/PrimaryBtn";
import { useTranslation } from "react-i18next";
import GhostBtn from "../common/Button/GhostBtn";
import TableChartIcon from "@mui/icons-material/TableChart";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VirtualTreeGrid from "../common/TreeGrid/VirtualTreeGrid";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MainGridSkeleton from "../FI/Skeleton/GridSkeleton/MainGridSkeleton";
import withLoading from "../../hoc/withLoading";
import ReportScheduleManagerReview from "./ReportScheduleManagerReview";
import { styled } from "@mui/material/styles";
import { TreeGridColumnType, UIEventType } from "../../types/common.type";
import { ScheduleReport } from "../../types/report.type";

interface ReportScheduleManagerPageProps {
  columnHeader: TreeGridColumnType[];
  fetchDataTree: VoidFunction;
  reportSchedules: ScheduleReport[];
  loadingSkeleton: boolean;
  anchorEl: Element | null;
  setAnchorEl: (el: Element | null) => void;
  selectedReport: ScheduleReport;
  setSelectedReport: (report: ScheduleReport) => void;
  onRunClick(reports: ScheduleReport[]): void;
  handleClickReview(type: string): void;
}

const StyledToolbar = styled(Box)(({ theme }: { theme: any }) => ({
  padding: "12px 24px",
  maxHeight: theme.toolbar.height,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  borderTopLeftRadius: "4px",
  borderTopRightRadius: "4px",
  borderBottom: theme.palette.borderColor,
  backgroundColor: theme.palette.paperBackground,
}));

const StyledReview = styled(Typography)({
  fontWeight: 500,
  fontSize: 12,
  lineHeight: "16px",
  marginLeft: 8,
  marginRight: 5,
});

const ReportScheduleManagerPage: React.FC<ReportScheduleManagerPageProps> = ({
  columnHeader,
  fetchDataTree,
  reportSchedules,
  loadingSkeleton,
  anchorEl,
  setAnchorEl,
  handleClickReview,
  selectedReport,
  setSelectedReport,
  onRunClick,
}) => {
  const { t } = useTranslation();

  const treeIcons = {
    expandedIcon: () => {
      return (
        <FolderIcon
          style={{
            color: "#2962FF",
          }}
        />
      );
    },
    folder: () => {
      return (
        <FolderOpenIcon
          style={{
            color: "#AEB8CB",
          }}
        />
      );
    },
    leaf: () => {
      return <AssignmentIcon style={{ color: "#1c7483" }} />;
    },
  };

  const runFunction = () => {
    if (!selectedReport.leaf && selectedReport?.children) {
      onRunClick(selectedReport.children);
    } else {
      return onRunClick([selectedReport]);
    }
  };

  const ReviewHandleClick = (event: UIEventType) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Box
      display={"flex"}
      width={"100%"}
      height={"100%"}
      flexDirection={"column"}
    >
      <StyledToolbar>
        <Box display={"flex"} justifyContent={"space-between"} width={"100%"}>
          <Box />
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <GhostBtn
              onClick={ReviewHandleClick}
              disabled={!selectedReport || selectedReport.parentId === 0}
              data-testid={"review-button"}
              children={
                <Box display={"flex"} alignItems={"center"}>
                  <TableChartIcon />
                  <StyledReview>{t("review")}</StyledReview>
                  <ExpandMoreIcon />
                </Box>
              }
            />
            <PrimaryBtn
              onClick={() => {
                runFunction();
              }}
              disabled={!selectedReport}
              data-testid={"run-button"}
            >
              <Box
                display={"flex"}
                alignItems={"center"}
                alignContent={"center"}
              >
                <Typography ml={"5px"} fontSize={12} marginRight={"5px"}>
                  {t("run")}
                </Typography>
                <PlayCircleIcon style={{ marginLeft: "8px" }} />
              </Box>
            </PrimaryBtn>
          </Box>
        </Box>
      </StyledToolbar>
      <Box height={"100%"} display={"flex"} flex={1}>
        {loadingSkeleton ? (
          <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <MainGridSkeleton columns={columnHeader} />
          </Box>
        ) : (
          <VirtualTreeGrid
            columns={columnHeader}
            data={reportSchedules}
            loadChildrenFunction={fetchDataTree}
            treeIcons={treeIcons}
            onRowClickFunction={(row: ScheduleReport) => {
              setSelectedReport(row);
            }}
          />
        )}
      </Box>
      <ReportScheduleManagerReview
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        handleClickReview={handleClickReview}
      />
    </Box>
  );
};

export default withLoading(ReportScheduleManagerPage);
