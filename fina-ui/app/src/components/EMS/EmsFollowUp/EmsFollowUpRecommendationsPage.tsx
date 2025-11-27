import { Box } from "@mui/system";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import CachedRoundedIcon from "@mui/icons-material/CachedRounded";
import GhostBtn from "../../common/Button/GhostBtn";
import GridTable from "../../common/Grid/GridTable";
import Paging from "../../common/Paging/Paging";
import { FollowUpRecommendationType } from "../../../types/followUp.type";
import { GridColumnType } from "../../../types/common.type";
import ActionBtn from "../../common/Button/ActionBtn";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EmsFollowUpRecommendationModal from "./EmsFollowUpRecommendationModal";
import DeleteForm from "../../common/Delete/DeleteForm";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import TableCustomizationButton from "../../common/Button/TableCustomizationButton";
import { EMS_FOLLOW_UP_RECOMMENDATIONS_TABLE_KEY } from "../../../api/TableCustomizationKeys";
import { Typography } from "@mui/material";
import useConfig from "../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../api/permissions";
import { styled } from "@mui/material/styles";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

interface EmsFollowUpRecommendationsProps {
  setPagingPage: React.Dispatch<React.SetStateAction<number>>;
  setPagingLimit: React.Dispatch<React.SetStateAction<number>>;
  rowsLen: number;
  loading: boolean;
  rows: FollowUpRecommendationType[];
  setRows: (data: FollowUpRecommendationType[]) => void;
  pagingLimit: number;
  pagingPage: number;
  columns: GridColumnType[];
  init: () => void;
  currRecommendation: FollowUpRecommendationType | null;
  setCurrRecommendation: (value: FollowUpRecommendationType | null) => void;
  saveRecommendation: (
    data: FollowUpRecommendationType,
    setOpenModal: SetState<boolean>,
    setErrorFields: SetState<{ [k: string]: boolean }>
  ) => void;
  deleteRecommendation: () => void;
  selectedRowId: number | null;
  setColumns: React.Dispatch<React.SetStateAction<GridColumnType[]>>;
}

const StyledRoot = styled(Box)(({ theme }: any) => ({
  height: "100%",
  width: "100%",
  minWidth: "0px",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.paperBackground,
}));

const StyledHeader = styled(Box)(({ theme }: any) => ({
  display: "flex",
  justifyContent: "space-between",
  backgroundColor:
    theme.palette.mode === "dark" ? "rgb(102, 108, 137)" : "#157fcc",
  width: "100%",
  minWidth: "0px",
}));

const StyledHeaderItem = styled(Box)(({ theme }: any) => ({
  display: "flex",
  width: "100%",
  alignItems: "center",
  "& .MuiButton-root": {
    marginRight: "10px",
    "&:disabled": {
      opacity: "0.7 !important",
      backgroundColor: "unset !important",
    },
  },
  margin: 9,
  "& .MuiSvgIcon-root": {
    color: theme.palette.mode === "dark" ? "#2D3747" : "#F5F7FA",
  },
}));

const StyledBody = styled(Box)(({ theme }: any) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  backgroundColor: theme.palette.paperBackground,
  paddingTop: 0,
  overflow: "hidden",
}));

const StyledHeaderText = styled(Typography)(({ theme }: any) => ({
  color: theme.palette.mode === "light" ? "#F5F7FA" : "#2D3747",
  maxWidth: "80px",
}));

const StyledPagingBox = styled(Box)(({ theme }: any) => ({
  ...theme.pagePaging({ size: "small" }),
}));

const EmsFollowUpRecommendationsPage: React.FC<
  EmsFollowUpRecommendationsProps
> = ({
  columns,
  pagingPage,
  setPagingPage,
  pagingLimit,
  setPagingLimit,
  rowsLen,
  rows,
  setRows,
  loading,
  init,
  currRecommendation,
  setCurrRecommendation,
  saveRecommendation,
  deleteRecommendation,
  selectedRowId,
  setColumns,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();

  const [openModal, setOpenModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  let actionButtons = (row: any, index: number) => {
    return (
      <>
        {hasPermission(PERMISSIONS.EMS_FOLLOWUP_AMEND) && (
          <ActionBtn
            onClick={() => {
              setOpenModal(true);
              setCurrRecommendation(row);
            }}
            children={<EditIcon style={{ color: "rgb(117, 137, 165)" }} />}
            rowIndex={index}
            buttonName={"edit"}
          />
        )}

        {hasPermission(PERMISSIONS.EMS_FOLLOWUP_DELETE) && (
          <ActionBtn
            onClick={() => {
              setShowDeleteModal(true);
              setCurrRecommendation(row);
            }}
            children={<DeleteIcon style={{ color: "#FF735A" }} />}
            rowIndex={index}
            buttonName={"delete"}
          />
        )}
      </>
    );
  };

  return (
    <StyledRoot data-testid={"follow-up-recommendations-grid"}>
      <StyledHeader data-testid={"header"}>
        <StyledHeaderItem style={{ color: "#FFF" }}>
          <FlashOnIcon />
          <StyledHeaderText style={{ marginLeft: "5px" }}>
            {t("recommendations")}
          </StyledHeaderText>
        </StyledHeaderItem>
        <StyledHeaderItem justifyContent={"flex-end"} marginRight={"10px"}>
          {hasPermission(PERMISSIONS.EMS_FOLLOWUP_AMEND) && (
            <GhostBtn
              onClick={() => {
                setCurrRecommendation(null);
                setOpenModal(true);
              }}
              disabled={!selectedRowId}
              startIcon={<AddRoundedIcon />}
              data-testid={"add-button"}
            >
              <StyledHeaderText noWrap>{t("add")}</StyledHeaderText>
            </GhostBtn>
          )}
          <GhostBtn
            onClick={() => init()}
            disabled={!selectedRowId}
            startIcon={<CachedRoundedIcon />}
            data-testid={"refresh-button"}
          >
            <StyledHeaderText noWrap>{t("refresh")}</StyledHeaderText>
          </GhostBtn>
          <span
            style={{
              paddingRight: "8px",
            }}
          >
            <TableCustomizationButton
              hideLabel={true}
              showTooltip={true}
              columns={columns}
              setColumns={setColumns}
              isDefault={false}
              hasColumnFreeze={true}
              tableKey={EMS_FOLLOW_UP_RECOMMENDATIONS_TABLE_KEY}
            />
          </span>
        </StyledHeaderItem>
      </StyledHeader>
      <StyledBody height={"100%"}>
        <GridTable
          columns={columns}
          rows={rows}
          setRows={setRows}
          singleRowSelect={true}
          loading={loading}
          actionButtons={actionButtons}
          size={"small"}
        />
      </StyledBody>

      <StyledPagingBox>
        <Paging
          onRowsPerPageChange={(number: number) => setPagingLimit(number)}
          onPageChange={(number: number) => setPagingPage(number)}
          totalNumOfRows={rowsLen}
          initialPage={pagingPage}
          initialRowsPerPage={pagingLimit}
          isMini={false}
          size={"small"}
        />
      </StyledPagingBox>
      {openModal && (
        <EmsFollowUpRecommendationModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          currRecommendation={currRecommendation}
          saveRecommendation={saveRecommendation}
        />
      )}
      {showDeleteModal && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deletewarning")}
          additionalBodyText={t("recommendation")}
          isDeleteModalOpen={showDeleteModal}
          setIsDeleteModalOpen={setShowDeleteModal}
          onDelete={() => {
            setShowDeleteModal(false);
            deleteRecommendation();
          }}
        />
      )}
    </StyledRoot>
  );
};

export default EmsFollowUpRecommendationsPage;
