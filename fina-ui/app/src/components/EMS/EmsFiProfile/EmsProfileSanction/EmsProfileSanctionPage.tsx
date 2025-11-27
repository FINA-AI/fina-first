import React, { useEffect, useState } from "react";
import { Box, darken } from "@mui/system";
import { IconButton, Tooltip } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import PreviewIcon from "@mui/icons-material/Preview";
import RemoveIcon from "@mui/icons-material/Remove";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useTranslation } from "react-i18next";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import GridTable from "../../../common/Grid/GridTable";
import { GridColumnType } from "../../../../types/common.type";
import Paging from "../../../common/Paging/Paging";
import EmsProfileSanctionModal from "./EmsProfileSanctionModal";
import EmsEntityHistoryContainer from "../../../../containers/Ems/EmsProfile/EmsEntityHistoryContainer";
import DeleteForm from "../../../common/Delete/DeleteForm";
import { EmsFiProfileSanctionType } from "../../../../types/emsFiProfile.type";
import TableCustomizationButton from "../../../common/Button/TableCustomizationButton";
import { EMS_PROFILE_SANCTIONS_AND_RECOMMENDATIONS_TABLE_KEY } from "../../../../api/TableCustomizationKeys";
import { SanctionDataType } from "../../../../types/sanction.type";
import { loadSanctionStatuses } from "../../../../api/services/ems/emsSanctionService";
import useConfig from "../../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../../api/permissions";
import { styled } from "@mui/material/styles";

interface EmsProfileSanctionPageProps {
  columns: GridColumnType[];
  setCurrSanction: React.Dispatch<React.SetStateAction<any>>;
  rows: any[];
  loading: boolean;
  setRowPerPage: (number: number) => void;
  setActivePage: (number: number) => void;
  pagingPage: number;
  initialRowsPerPage: number;
  rowsLen: number;
  onRefresh: () => void;
  sanctionTypes: SanctionDataType[];
  currSanction?: EmsFiProfileSanctionType;
  sanctionTypeStatuses: string[];
  fineStatusses: string[];
  submitSanction: (data: any, payload: FormData | null) => void;
  deleteProfileSanction: (id: number) => void;
  fiCode: string;
  inspectionId: number | null;
  setColumns: React.Dispatch<React.SetStateAction<GridColumnType[]>>;
  additionalColumns: GridColumnType[];
  setRows: React.Dispatch<React.SetStateAction<any[]>>;
  orderRowByHeader: (cellName: string, arrowDirection: string) => void;
}

const StyledRoot = styled(Box)(({ theme }: any) => ({
  height: "100%",
  width: "100%",
  boxSizing: "border-box",
  marginTopBottom: "20px",
  overflow: "hidden",
  backgroundColor: theme.palette.paperBackground,
  minHeight: "0px",
}));

const StyledHeader = styled(Box)(({ theme }: any) => ({
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

const StyledIconButtonBox = styled(Box)(({ theme }: any) => ({
  "& .MuiButtonBase-root": {
    padding: "2px",
    border: "1px solid #10629e !important",
    borderRadius: "4px",
    marginRight: "5px",
    background:
      theme.palette.mode === "dark" ? theme.palette.primary.main : "#178ee5",
    "&.Mui-disabled": {
      background:
        theme.palette.mode === "dark"
          ? darken(theme.palette.secondary.main, 0.2)
          : "#1478c2 !important",
      "& .MuiSvgIcon-root": {
        color: "rgba(149,194,230,255)",
      },
    },
  },
  "& .MuiSvgIcon-root": {
    width: "16px",
    height: "16px",
    color: "#FFF",
    "&:hover": {
      background:
        theme.palette.mode === "dark" ? theme.palette.primary.main : "#178ee5",
    },
  },
}));

const StyledBody = styled(Box)({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  paddingTop: 0,
  overflow: "hidden",
});

const StyledPagingBox = styled(Box)(({ theme }: any) => ({
  ...theme.pagePaging({ size: "small" }),
}));

const EmsProfileSanctionPage: React.FC<EmsProfileSanctionPageProps> = ({
  columns,
  setCurrSanction,
  rows,
  setRows,
  loading,
  setRowPerPage,
  setActivePage,
  pagingPage,
  initialRowsPerPage,
  rowsLen,
  onRefresh,
  sanctionTypes,
  currSanction,
  sanctionTypeStatuses,
  fineStatusses,
  submitSanction,
  deleteProfileSanction,
  fiCode,
  inspectionId,
  setColumns,
  additionalColumns,
  orderRowByHeader,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();
  const hasAmendPermission = hasPermission(PERMISSIONS.EMS_INSPECTION_AMEND);
  const hasDeletePermission = hasPermission(PERMISSIONS.EMS_INSPECTION_DELETE);

  const [showAddModal, setShowAddModal] = useState({
    isShow: false,
    viewMode: false,
    editMode: false,
  });
  const [history, setHistory] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    setCurrSanction(null);
  }, [inspectionId]);

  const historyLoadFunction = (
    page: number,
    limit: number,
    entityId: number
  ) => {
    return loadSanctionStatuses(page, limit, entityId);
  };
  return (
    <StyledRoot display={"flex"} flexDirection={"column"}>
      <StyledHeader>
        <Box display={"flex"} style={{ color: "#FFF" }}>
          <FlashOnIcon />
          <span style={{ marginLeft: "5px" }}>
            {t("sanctions")} / {t("recommendations")}
          </span>
        </Box>
        <Box display={"flex"}>
          <StyledIconButtonBox>
            {hasAmendPermission && (
              <>
                <Tooltip title={t("add")}>
                  <IconButton
                    onClick={() => {
                      setCurrSanction(null);
                      setShowAddModal({
                        ...showAddModal,
                        isShow: true,
                        editMode: false,
                      });
                    }}
                    size="large"
                    disabled={!inspectionId}
                    data-testid={"add-button"}
                  >
                    <AddCircleIcon />
                  </IconButton>
                </Tooltip>

                <IconButton
                  onClick={() => {
                    setShowAddModal({
                      ...showAddModal,
                      isShow: true,
                      editMode: true,
                    });
                  }}
                  size="large"
                  disabled={!currSanction}
                  data-testid={"edit-button"}
                >
                  <Tooltip title={t("edit")}>
                    <EditIcon />
                  </Tooltip>
                </IconButton>
              </>
            )}

            <IconButton
              onClick={() =>
                setShowAddModal({
                  viewMode: true,
                  isShow: true,
                  editMode: false,
                })
              }
              size="large"
              disabled={!currSanction}
              data-testid={"review-button"}
            >
              <Tooltip title={t("review")}>
                <PreviewIcon />
              </Tooltip>
            </IconButton>

            {hasDeletePermission && (
              <IconButton
                onClick={() => setDeleteModal(true)}
                size="large"
                disabled={!currSanction}
                data-testid={"delete-button"}
              >
                <Tooltip title={t("delete")}>
                  <RemoveIcon />
                </Tooltip>
              </IconButton>
            )}

            <IconButton
              onClick={() => setHistory(true)}
              size="large"
              disabled={!currSanction}
              data-testid={"status-history-button"}
            >
              <Tooltip title={t("viewSelectedInspectionStatusHistory")}>
                <FormatListBulletedIcon />
              </Tooltip>
            </IconButton>

            <Tooltip title={t("refresh")}>
              <IconButton
                onClick={() => onRefresh()}
                size="large"
                disabled={!inspectionId}
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
                tableKey={EMS_PROFILE_SANCTIONS_AND_RECOMMENDATIONS_TABLE_KEY}
                iconButton={true}
              />
            </span>
          </StyledIconButtonBox>
        </Box>
      </StyledHeader>

      <StyledBody height={"100%"}>
        <GridTable
          size={"small"}
          columns={columns}
          rows={rows}
          setRows={setRows}
          loading={loading}
          selectedRows={currSanction ? [currSanction] : []}
          rowOnClick={(row: any, deselect: any) => {
            if (deselect) {
              setCurrSanction(null);
            } else {
              setCurrSanction({ ...row });
            }
          }}
          orderRowByHeader={orderRowByHeader}
        />
      </StyledBody>

      <StyledPagingBox>
        <Paging
          onRowsPerPageChange={(number: number) => setRowPerPage(number)}
          onPageChange={(number: number) => setActivePage(number)}
          totalNumOfRows={rowsLen}
          initialPage={pagingPage}
          initialRowsPerPage={initialRowsPerPage}
          isMini={false}
          size={"small"}
        />
      </StyledPagingBox>

      {showAddModal.isShow && (
        <EmsProfileSanctionModal
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
          sanctionTypes={sanctionTypes}
          currSanction={
            showAddModal.editMode || showAddModal.viewMode
              ? currSanction
              : undefined
          }
          sanctionTypeStatuses={sanctionTypeStatuses}
          fineStatusses={fineStatusses}
          submitSanction={submitSanction}
          fiCode={fiCode}
        />
      )}

      {history && currSanction && (
        <EmsEntityHistoryContainer
          openModal={history}
          setOpenModal={setHistory}
          entityId={currSanction.id}
          additionalColumns={additionalColumns}
          loadFunction={historyLoadFunction}
        />
      )}

      {deleteModal && currSanction && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={t("sanction")}
          isDeleteModalOpen={deleteModal}
          setIsDeleteModalOpen={setDeleteModal}
          onDelete={() => {
            setDeleteModal(false);
            deleteProfileSanction(currSanction.id);
          }}
        />
      )}
    </StyledRoot>
  );
};

export default EmsProfileSanctionPage;
