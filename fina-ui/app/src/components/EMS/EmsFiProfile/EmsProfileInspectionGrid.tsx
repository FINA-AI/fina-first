import { useTranslation } from "react-i18next";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { Box, darken, lighten } from "@mui/system";
import { IconButton, Tooltip } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import PreviewIcon from "@mui/icons-material/Preview";
import RemoveIcon from "@mui/icons-material/Remove";
import HistoryIcon from "@mui/icons-material/History";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import React, { useRef, useState } from "react";
import Paging from "../../common/Paging/Paging";
import GridTable from "../../common/Grid/GridTable";
import { GridColumnType } from "../../../types/common.type";
import EmsEntityHistoryContainer from "../../../containers/Ems/EmsProfile/EmsEntityHistoryContainer";
import EmsProfileInspectionModal from "./EmsProfileInspectionModal";
import DeleteForm from "../../common/Delete/DeleteForm";
import {
  EmsFiProfileInspectionType,
  InspectorDataType,
} from "../../../types/emsFiProfile.type";
import { FiType } from "../../../types/fi.type";
import {
  EmsInspectionType,
  InspectionColumnData,
} from "../../../types/inspection.type";
import TableCustomizationButton from "../../common/Button/TableCustomizationButton";
import { EMS_PROFILE_INSPECTIONS_TABLE_KEY } from "../../../api/TableCustomizationKeys";
import { loadInspectionStatus } from "../../../api/services/ems/emsInspectionService";
import { styled, useTheme } from "@mui/material/styles";
import useConfig from "../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../api/permissions";

interface EmsProfileInspectionGridGrid {
  setPagingPage: React.Dispatch<React.SetStateAction<any>>;
  setPagingLimit: React.Dispatch<React.SetStateAction<any>>;
  rowsLen: number;
  loading: boolean;
  rows: any[];
  pagingLimit: number;
  pagingPage: number;
  columns: GridColumnType[];
  resizerRef: React.RefObject<HTMLDivElement>;
  inspectionRef: React.RefObject<HTMLDivElement>;
  selectedInspectionRow: any;
  setSelectedInspectionRow: React.Dispatch<React.SetStateAction<any>>;
  fis: FiType[];
  statusTypes: string[];
  onRefresh: () => void;
  saveProfileInspection: (
    data: EmsFiProfileInspectionType,
    payLoad: FormData | null
  ) => Promise<void>;
  deleteInspectionHandler: (id: number) => void;
  inspectionColumns: InspectionColumnData[] | null;
  inspectors: InspectorDataType[];
  inspectionTypes: EmsInspectionType[];
  setRows: (data: EmsFiProfileInspectionType[]) => void;
  setColumns: React.Dispatch<React.SetStateAction<GridColumnType[]>>;
  onInspectionExport: () => void;
  orderRowByHeader: (cellName: string, arrowDirection: string) => void;
}

const StyledRoot = styled(Box)({
  height: "100%",
  width: "100%",
  display: "flex",
  minWidth: "0px",
  minHeight: "0px",
  flexDirection: "column",
  boxSizing: "border-box",
  transition: "width 0.3s ease-in-out, background-color 0.3s ease-in-out",
});

const StyledHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: "9px",
  backgroundColor:
    theme.palette.mode === "dark" ? "rgb(102, 108, 137)" : "#157fcc",
  width: "100%",
  minWidth: "0px",
  minHeight: "40px",
  boxSizing: "border-box",
}));

const StyledIconButtonsBox = styled(Box)(({ theme }: any) => ({
  "& .MuiButtonBase-root": {
    padding: "2px",
    border: `1px solid ${
      theme.palette.mode === "dark" ? "#495F80" : "#10629e"
    } !important`,
    borderRadius: "4px",
    marginRight: "5px",
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.primary.main : "#178ee5",
    "&.Mui-disabled": {
      background:
        theme.palette.mode === "dark"
          ? darken(theme.palette.secondary.main, 0.2)
          : "#1478c2 !important ",
      "& .MuiSvgIcon-root": {
        color: "rgba(149,194,230,255)",
      },
    },
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark" ? theme.palette.primary.main : "#178ee5",
    },
  },
  "& .MuiSvgIcon-root": {
    width: "16px",
    height: "16px",
    color: "#FFF",
  },
}));

const StyledVerticalMenu = styled("span")({
  writingMode: "vertical-rl",
  transformOrigin: "bottom",
  color: "#FFF",
  letterSpacing: "1px",
  fontSize: "15px",
  marginTop: "10px",
});

const StyledBody = styled(Box)({
  display: "flex",
  boxSizing: "border-box",
  alignItems: "center",
  justifyContent: "center",
});

const StyledPagingBox = styled(Box)(({ theme }: any) => ({
  ...theme.pagePaging({ size: "small" }),
  background: theme.palette.paperBackground,
}));

const StyledExpandIconBox = styled(Box)(({ theme }) => ({
  marginRight: "5px",
  "& .MuiButtonBase-root": {
    padding: "0px",
    backgroundColor:
      theme.palette.mode === "dark"
        ? lighten(theme.palette.primary.main, 0.2)
        : "#c2ddf2",
    marginRight: "5px",
  },
  "& .MuiSvgIcon-root": {
    width: "20px",
    height: "20px",
    color: theme.palette.mode === "dark" ? "#FFF" : "#157fcc",
  },
}));

const EmsProfileInspectionGrid: React.FC<EmsProfileInspectionGridGrid> = ({
  rows,
  setRows,
  rowsLen,
  setPagingLimit,
  setPagingPage,
  loading,
  pagingLimit,
  pagingPage,
  columns,
  resizerRef,
  inspectionRef,
  selectedInspectionRow,
  setSelectedInspectionRow,
  fis,
  statusTypes,
  onRefresh,
  saveProfileInspection,
  deleteInspectionHandler,
  inspectionColumns,
  inspectors,
  inspectionTypes,
  setColumns,
  onInspectionExport,
  orderRowByHeader,
}: EmsProfileInspectionGridGrid) => {
  const theme: any = useTheme();
  const { t } = useTranslation();

  const [expanded, setExpanded] = useState(true);
  const selectedRowRef = useRef<{
    id: number;
  }>({ id: 0 });
  const currentContainerWidth = useRef<number>(0);

  const onPagingLimitChange = (limit: number): void => {
    setPagingPage(1);
    setPagingLimit(limit);
  };
  const historyLoadFunction = (
    page: number,
    limit: number,
    entityId: number
  ) => {
    return loadInspectionStatus(page, limit, entityId);
  };

  const onExpand = (): void => {
    setExpanded(false);
    if (resizerRef.current) {
      resizerRef.current.style.display = "none";
    }
    if (inspectionRef.current && currentContainerWidth) {
      currentContainerWidth.current = Math.round(
        inspectionRef.current.getBoundingClientRect().width
      );
      inspectionRef.current.style.flex = "0";
      inspectionRef.current.style.width = "30px";
      inspectionRef.current.style.minWidth = "30px";
    }
  };

  const onCollapse = () => {
    setExpanded(true);
    if (resizerRef.current && inspectionRef.current) {
      resizerRef.current.style.display = "block";
      inspectionRef.current.style.flex = `2`;
    }
  };

  const onRowSetter = (row: EmsFiProfileInspectionType): object => {
    let style = {
      background:
        "linear-gradient(180deg, rgba(255, 249, 196, 0.66) 97%, #EAEBF0) !important",
    };
    if (row && row.syncronized) {
      return style;
    }
    return {};
  };

  const ToolbarButtons = () => {
    const { hasPermission } = useConfig();
    const hasAmendPermission = hasPermission(PERMISSIONS.EMS_INSPECTION_AMEND);
    const hasDeletePermission = hasPermission(
      PERMISSIONS.EMS_INSPECTION_DELETE
    );

    const [inspectionModal, setInspectionModal] = useState({
      viewMode: false,
      isOpen: false,
      editMode: false,
    });
    const [openModal, setOpenModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    return (
      <StyledIconButtonsBox>
        {hasAmendPermission && (
          <>
            <Tooltip title={t("add")}>
              <IconButton
                onClick={() => {
                  setInspectionModal({
                    viewMode: false,
                    isOpen: true,
                    editMode: false,
                  });
                }}
                sx={{
                  "&:hover": {
                    background: `${theme.palette.primary.secondary} !important`,
                  },
                }}
                size="large"
                data-testid={"create-button"}
              >
                <AddCircleIcon />
              </IconButton>
            </Tooltip>
            <IconButton
              onClick={() => {
                setInspectionModal({
                  viewMode: false,
                  isOpen: true,
                  editMode: true,
                });
              }}
              size="large"
              disabled={
                !selectedInspectionRow || selectedInspectionRow.syncronized
              }
              data-testid={"edit-button"}
            >
              <Tooltip title={t("edit")}>
                <EditIcon />
              </Tooltip>
            </IconButton>
          </>
        )}
        <IconButton
          onClick={() => {
            setInspectionModal({
              viewMode: true,
              isOpen: true,
              editMode: false,
            });
          }}
          size="large"
          disabled={!selectedInspectionRow}
          data-testid={"review-button"}
        >
          <Tooltip title={t("review")}>
            <PreviewIcon />
          </Tooltip>
        </IconButton>

        {hasDeletePermission && (
          <IconButton
            onClick={() => setShowDeleteModal(true)}
            size="large"
            disabled={
              !selectedInspectionRow || selectedInspectionRow.syncronized
            }
            data-testid={"delete-button"}
          >
            <Tooltip title={t("delete")}>
              <RemoveIcon />
            </Tooltip>
          </IconButton>
        )}

        <IconButton
          onClick={() => setOpenModal(true)}
          size="large"
          disabled={!Boolean(selectedInspectionRow)}
          data-testid={"status-history-button"}
        >
          <Tooltip title={t("viewSelectedInspectionStatusHistory")}>
            <HistoryIcon />
          </Tooltip>
        </IconButton>

        {hasAmendPermission && (
          <IconButton
            onClick={onInspectionExport}
            size="large"
            data-testid={"export-button"}
          >
            <Tooltip title={t("export")}>
              <CloudDownloadIcon />
            </Tooltip>
          </IconButton>
        )}

        <Tooltip title={t("refresh")}>
          <IconButton
            onClick={() => onRefresh()}
            size="large"
            data-testid={"refresh-button"}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        <span style={{ paddingRight: "8px" }}>
          <TableCustomizationButton
            hideLabel={true}
            showTooltip={true}
            columns={columns}
            setColumns={setColumns}
            isDefault={false}
            hasColumnFreeze={true}
            tableKey={EMS_PROFILE_INSPECTIONS_TABLE_KEY}
            iconButton={true}
          />
        </span>

        {inspectionModal.isOpen && (
          <EmsProfileInspectionModal
            inspectionModal={inspectionModal}
            setInspectionModal={setInspectionModal}
            fis={fis}
            selectedInspectionRow={
              inspectionModal.editMode || inspectionModal.viewMode
                ? selectedInspectionRow
                : null
            }
            statusTypes={statusTypes}
            saveProfileInspection={saveProfileInspection}
            inspectionColumns={inspectionColumns}
            inspectors={inspectors}
            inspectionTypes={inspectionTypes}
          />
        )}
        {openModal && selectedRowRef.current && (
          <EmsEntityHistoryContainer
            openModal={openModal}
            setOpenModal={setOpenModal}
            entityId={selectedRowRef.current.id}
            loadFunction={historyLoadFunction}
          />
        )}

        {showDeleteModal && (
          <DeleteForm
            headerText={t("delete")}
            bodyText={t("deleteWarning")}
            additionalBodyText={t("inspection")}
            isDeleteModalOpen={showDeleteModal}
            setIsDeleteModalOpen={setShowDeleteModal}
            onDelete={() => {
              deleteInspectionHandler(selectedInspectionRow.id);
              setShowDeleteModal(false);
            }}
          />
        )}
      </StyledIconButtonsBox>
    );
  };

  return (
    <StyledRoot
      style={{
        width: expanded ? "100%" : "30px",
        backgroundColor: expanded
          ? "inherit"
          : theme.palette.mode === "dark"
          ? "rgb(102, 108, 137)"
          : "#157fcc",
      }}
      data-testid={"inspections-grid"}
    >
      {expanded ? (
        <>
          <StyledHeader data-testid={"header"}>
            <Box display={"flex"} style={{ color: "#FFF" }}>
              <EventAvailableIcon />
              <span style={{ marginLeft: "5px" }}>{t("inspections")}</span>
            </Box>
            <Box display={"flex"} data-testid={"toolbar"}>
              <StyledExpandIconBox>
                <IconButton
                  onClick={() => onExpand()}
                  data-testid={"expand-toggle-button"}
                >
                  <KeyboardArrowLeftIcon />
                </IconButton>
              </StyledExpandIconBox>
              <ToolbarButtons />
            </Box>
          </StyledHeader>
          <StyledBody height={"100%"} minHeight={"0px"}>
            <GridTable
              columns={columns}
              rows={rows}
              singleRowSelect={true}
              rowOnClick={(row: any, deselect: any) => {
                if (deselect) {
                  setSelectedInspectionRow(null);
                } else {
                  selectedRowRef.current = { id: row.id };
                  setSelectedInspectionRow(row);
                }
              }}
              selectedRows={
                selectedInspectionRow ? [selectedInspectionRow] : []
              }
              loading={loading}
              rowStyleSetter={onRowSetter}
              size={"small"}
              setRows={setRows}
              orderRowByHeader={orderRowByHeader}
            />
          </StyledBody>
          <StyledPagingBox>
            <Paging
              onRowsPerPageChange={(number: number) =>
                onPagingLimitChange(number)
              }
              onPageChange={(number: number) => setPagingPage(number)}
              totalNumOfRows={rowsLen}
              initialPage={pagingPage}
              initialRowsPerPage={pagingLimit}
              isMini={false}
              size={"small"}
            />
          </StyledPagingBox>
        </>
      ) : (
        <StyledExpandIconBox>
          <Box
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            marginTop={"10px"}
          >
            <IconButton onClick={() => onCollapse()} style={{ margin: "0px" }}>
              <KeyboardArrowRightIcon />
            </IconButton>
            <StyledVerticalMenu>{t("inspections")}</StyledVerticalMenu>
          </Box>
        </StyledExpandIconBox>
      )}
    </StyledRoot>
  );
};

export default EmsProfileInspectionGrid;
