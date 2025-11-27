import { Box } from "@mui/system";
import { Grid, IconButton, Paper, Slide, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import TableChartIcon from "@mui/icons-material/TableChart";
import VirtualTreeGrid from "../common/TreeGrid/VirtualTreeGrid";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import MainGridSkeleton from "../FI/Skeleton/GridSkeleton/MainGridSkeleton";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import ReportDetailsTable from "./ReportDetailsTable";
import { getStoredReportRowInfo } from "../../api/services/reportService";
import { BASE_REST_URL, getLanguage } from "../../util/appUtil";
import DeleteIcon from "@mui/icons-material/Delete";
import FilePrintField, {
  PrintFieldOptions,
} from "../common/Field/FilePrintField";
import ActionBtn from "../common/Button/ActionBtn";
import DeleteForm from "../common/Delete/DeleteForm";
import useConfig from "../../hoc/config/useConfig";
import { PERMISSIONS } from "../../api/permissions";
import CustomAutoComplete from "../common/Field/CustomAutoComplete";
import { styled } from "@mui/material/styles";
import { LanguageType, TreeGridColumnType } from "../../types/common.type";
import {
  StoredReport,
  StoredReportGridData,
  StoredRootReport,
} from "../../types/report.type";
import { DeleteModal } from "../../containers/ReportManager/StoredReportManagerContainer";

export interface StoredReportManagerPageProps {
  columns: TreeGridColumnType[];
  storedReports: StoredRootReport[];
  loading: boolean;
  setDeleteModal: (modal: DeleteModal) => void;
  deleteModal: DeleteModal;
  allStoredReports: StoredReport[];
  languages: LanguageType[];
  onRefresh: VoidFunction;
  deleteStoredReportFunc(storedReport: StoredRootReport): void;
  fetchTreeData(
    node: StoredRootReport,
    sortObj: any
  ): Promise<StoredRootReport[]>;
}

const StyledRoot = styled(Paper)(({ theme }: { theme: any }) => ({
  height: "100%",
  width: `700px`,
  position: "absolute",
  top: 0,
  right: 0,
  zIndex: theme.zIndex.modal,
  borderLeft: theme.palette.borderColor,
  background: theme.palette.paperBackground,
}));

const StyledToolbar = styled(Box)(({ theme }: { theme: any }) => ({
  padding: "12px 24px",
  maxHeight: theme.toolbar.height,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  borderTopLeftRadius: "4px",
  borderTopRightRadius: "4px",
  backgroundColor: theme.palette.paperBackground,
}));

const StyledInfoBarHeader = styled(Box)(({ theme }: { theme: any }) => ({
  padding: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottom: theme.palette.borderColor,
  borderTop: theme.palette.borderColor,
}));

const StyledIconButton = styled(IconButton)(({ theme }: { theme: any }) => ({
  height: 32,
  width: 32,
  borderRadius: 50,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "& .MuiSvgIcon-root": {
    ...theme.smallIcon,
  },
}));

const StyledGridContainer = styled(Grid)({
  marginTop: "0px",
  paddingTop: "0px",
  position: "relative",
  overflow: "hidden",
  display: "flex",
  height: "100%",
});

const StoredReportManagerPage: React.FC<StoredReportManagerPageProps> = ({
  columns,
  loading,
  fetchTreeData,
  storedReports,
  setDeleteModal,
  deleteModal,
  deleteStoredReportFunc,
  allStoredReports,
  languages,
  onRefresh,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();
  const [rootData, setRootData] = useState<StoredRootReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<StoredRootReport>();
  const [isDetailPageOpen, setIsDetailPageOpen] = useState(false);
  const [gridData, setGridData] = useState<StoredReportGridData[]>([]);
  const [loadingMask, setLoadingMask] = useState(false);
  const [expandPath, setExpandPath] = useState<number[]>([]);
  const containerRef = React.useRef(null);

  const currentLanguage = languages.find((l) => l.code === getLanguage());

  useEffect(() => {
    const data: StoredRootReport[] = storedReports.map((rep) => {
      return { ...rep, leaf: !rep.folder, level: !rep.level ? 0 : rep.level };
    });
    setRootData(data);
  }, [storedReports]);

  const handleReview = (type: string) => {
    if (selectedReport) {
      window.open(
        BASE_REST_URL +
          `/report/stored/review/${selectedReport.reportId}/${type}/${selectedReport.hashcode}/${selectedReport.langId}/?reportName=${selectedReport.reportName}`,
        "_blank"
      );
    }
  };

  const loadInfo = (reportId: number, hashCode: number) => {
    setLoadingMask(true);
    getStoredReportRowInfo(reportId, hashCode)
      .then((res) => {
        const data = { ...res.data, dimension: res.data.iterators };
        let diminsionArray = data.dimension.map(
          (item: StoredReportGridData) => {
            return { ...item, status: "dimension", value: item.values };
          }
        );
        let parametersArray = data.parameters.map(
          (item: StoredReportGridData) => {
            return { ...item, status: "parameters", value: item.values };
          }
        );
        setGridData([...parametersArray, ...diminsionArray]);
      })
      .catch(() => {})
      .finally(() => setLoadingMask(false));
  };

  const getDisplayOptions = () => {
    if (selectedReport && selectedReport.excelTemplate) {
      const filtered = PrintFieldOptions.filter((pf) => pf.type === "XLSX");
      return filtered;
    }

    return PrintFieldOptions;
  };

  let actionButtons = (row: StoredRootReport, index: number) => {
    if (
      hasPermission(PERMISSIONS.FINA_STORED_REPORT_DELETE) &&
      row.parentId !== 0
    ) {
      return (
        <ActionBtn
          onClick={() => setDeleteModal({ isOpen: true, data: row })}
          children={<DeleteIcon />}
          color={"#FF735A"}
          rowIndex={index}
          buttonName={"delete"}
        />
      );
    }
  };

  const handleNodeOrOptionClick = (node: StoredRootReport) => {
    if (!node.folder) {
      setIsDetailPageOpen(true);
      loadInfo(node.reportId, node.hashcode);
    }
    setSelectedReport({
      ...node,
      excelTemplate: node.reportType === "EXCEL",
    });
  };

  const generateId = (report: StoredRootReport) => {
    let result = report.reportId;
    if (currentLanguage) {
      result = 31 * result + currentLanguage?.id;
      result = 31 * result + report.hashcode;
    }
    return result;
  };

  const handleExpandPath = (report: StoredRootReport) => {
    setExpandPath([report.parentId, generateId(report)]);
  };

  const orderRowByHeader = (cellName: string, arrowDirection: string) => {
    let sortDirection = arrowDirection === "up" ? 1 : -1;

    setGridData((prevData) =>
      [...prevData].sort((a: any, b: any) => {
        let valueA =
          cellName === "values" ? a.values.join("") ?? "" : a[cellName] ?? "";
        let valueB =
          cellName === "values" ? b.values.join("") ?? "" : b[cellName] ?? "";

        return (valueA > valueB ? 1 : valueA < valueB ? -1 : 0) * sortDirection;
      })
    );
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      width={"100%"}
      height={"100%"}
    >
      <StyledToolbar>
        <Box display={"flex"} justifyContent={"space-between"} width={"100%"}>
          <Box />
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <StyledIconButton
              onClick={() => onRefresh()}
              data-testid={"refresh-button"}
            >
              <RefreshIcon fontSize={"small"} />
            </StyledIconButton>
            <FilePrintField
              label={t("review")}
              icon={<TableChartIcon style={{ marginRight: 4 }} />}
              handleClick={handleReview}
              style={{
                marginRight: "8px",
              }}
              isDisabled={() => {
                return selectedReport ? selectedReport.folder : true;
              }}
              displayOptions={getDisplayOptions()}
              buttonProps={{
                "data-testid": "review-button",
              }}
            />
          </Box>
        </Box>
      </StyledToolbar>
      <StyledGridContainer>
        <Grid sx={{ paddingTop: "0px", height: "100%", width: "100%" }}>
          {loading ? (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <MainGridSkeleton columns={columns} />
            </Box>
          ) : (
            <Box
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <Box sx={{ width: "400px", padding: "6px 24px" }}>
                <CustomAutoComplete
                  data={allStoredReports}
                  onChange={(node) => {
                    if (node) {
                      handleNodeOrOptionClick(node);
                      handleExpandPath(node);
                    }
                  }}
                  valueFieldName={"id"}
                  displayFieldFunction={(r) => `${r.code} - ${r.description}`}
                />
              </Box>
              <Paper sx={{ width: "100%", height: "100%", boxShadow: "none" }}>
                <VirtualTreeGrid
                  idProperty={"generatedId"}
                  columns={columns}
                  data={rootData}
                  loadChildrenFunction={fetchTreeData}
                  actionButtons={actionButtons}
                  onRowClickFunction={handleNodeOrOptionClick}
                  expandPath={expandPath.length !== 0 ? expandPath : []}
                />
              </Paper>
            </Box>
          )}
          <Paper
            sx={{ width: "100%", height: "100%", boxShadow: "none" }}
            // position={"relative"}
          >
            <Slide
              direction="left"
              in={isDetailPageOpen}
              container={containerRef.current}
              timeout={600}
            >
              <StyledRoot>
                <StyledInfoBarHeader>
                  <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                    {selectedReport?.reportCode || selectedReport?.code}
                  </Typography>
                  <IconButton
                    onClick={() => {
                      setIsDetailPageOpen(false);
                    }}
                  >
                    <ClearRoundedIcon fontSize={"small"} />
                  </IconButton>
                </StyledInfoBarHeader>
                <ReportDetailsTable
                  gridData={gridData}
                  setGridData={setGridData}
                  orderRowByHeader={orderRowByHeader}
                  editable={false}
                  loading={loadingMask}
                />
              </StyledRoot>
            </Slide>
          </Paper>
        </Grid>
      </StyledGridContainer>
      {deleteModal?.isOpen && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={t("storedreport")}
          isDeleteModalOpen={deleteModal?.isOpen}
          setIsDeleteModalOpen={() =>
            setDeleteModal({ isOpen: false, data: null })
          }
          onDelete={() => {
            if (deleteModal.data) deleteStoredReportFunc(deleteModal?.data);
          }}
          showConfirm={false}
        />
      )}
    </Box>
  );
};

export default StoredReportManagerPage;
