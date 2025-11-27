import { Box, IconButton } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import PrimaryBtn from "../common/Button/PrimaryBtn";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteForm from "../common/Delete/DeleteForm";
import CEMSInspectionFIter from "./CEMSInspectionFIter";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import TableCustomizationButton from "../common/Button/TableCustomizationButton";
import { CEMS_INSPECTION_TABLE_KEY } from "../../api/TableCustomizationKeys";
import SecondaryToolbar from "../common/Toolbar/SecondaryToolbar";
import { styled } from "@mui/material/styles";

const StyledToolbar = styled(Box)(({ secondToolBarOpen }) => ({
  display: "flex",
  justifyContent: "flex-end",
  boxSizing: "border-box",
  padding: secondToolBarOpen ? 0 : "6px 11px 10px 8px",
  alignItems: "center",
  borderTopLeftRadius: "8px",
  borderTopRightRadius: "8px",
}));

const StyledAddBtnBox = styled(Box)({
  order: 2,
  alignItems: "center",
  marginLeft: 8,
  display: "flex",
});

const StyledAddIconSpan = styled("span")({
  marginLeft: 5,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const StyledExportIconButton = styled(IconButton)(({ theme }) => ({
  borderRadius: "96px",
  width: "28px",
  height: "28px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.mode === "dark" ? "#2D3747" : "#F5F7FA",
  marginRight: "15px",
}));

const CEMSHeader = ({
  selectedRows,
  setSelectedRows,
  onDeleteFunction,
  onExport,
  addNewFunction,
  onFilterClickFunc,
  columns,
  setColumns,
}) => {
  let secondToolBarOpen = selectedRows.length > 1;
  const { t } = useTranslation();

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isSingleDeleteConfirmOpen, setIsSingleDeleteConfirmOpen] =
    useState(false);

  return (
    <StyledToolbar secondToolBarOpen={secondToolBarOpen}>
      {secondToolBarOpen ? (
        <SecondaryToolbar
          onDeleteButtonClick={() => {
            setIsDeleteConfirmOpen(true);
          }}
          onCancelClick={() => {
            setSelectedRows([]);
          }}
          selectedItemsCount={selectedRows.length}
        >
          <StyledExportIconButton>
            <DownloadIcon
              fontSize={"18px"}
              onClick={() => {
                onExport();
              }}
            />
          </StyledExportIconButton>
        </SecondaryToolbar>
      ) : (
        <>
          <Box display={"flex"} alignItems={"center"}>
            <span style={{ paddingRight: "8px" }}>
              <TableCustomizationButton
                columns={columns}
                setColumns={setColumns}
                hasColumnFreeze={true}
                tableKey={CEMS_INSPECTION_TABLE_KEY}
              />
            </span>
            <IconButton
              onClick={() => {
                setIsSingleDeleteConfirmOpen(true);
              }}
              style={{
                opacity: !(selectedRows && selectedRows.length > 0) ? 0.7 : 1,
                marginLeft: "5px",
                transition: "0.3",
              }}
              disabled={!(selectedRows && selectedRows.length > 0)}
            >
              <DeleteRoundedIcon fontSize={"small"} />
            </IconButton>
            <IconButton
              onClick={() => {
                onExport();
              }}
              style={{
                opacity: !(selectedRows && selectedRows.length > 0) ? 0.6 : 1,
                marginLeft: "5px",
                transition: "0.3",
              }}
              disabled={!(selectedRows && selectedRows.length > 0)}
            >
              <DownloadRoundedIcon fontSize={"small"} />
            </IconButton>
          </Box>

          <StyledAddBtnBox>
            <PrimaryBtn
              children={
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  {t("addNew")}
                  <StyledAddIconSpan>
                    <AddIcon />
                  </StyledAddIconSpan>
                </Box>
              }
              onClick={() => addNewFunction()}
            />
            <CEMSInspectionFIter onFilterClickFunc={onFilterClickFunc} />
          </StyledAddBtnBox>
        </>
      )}

      <DeleteForm
        headerText={t("delete")}
        bodyText={t("deleteWarning")}
        additionalBodyText={t("inspections")}
        isDeleteModalOpen={isDeleteConfirmOpen}
        setIsDeleteModalOpen={setIsDeleteConfirmOpen}
        onDelete={() => {
          onDeleteFunction(selectedRows.map((item) => item.id));
          setSelectedRows([]);
          setIsDeleteConfirmOpen(false);
        }}
        showConfirm={false}
      />

      <DeleteForm
        headerText={t("delete")}
        bodyText={t("deleteWarning")}
        additionalBodyText={t("inspection") + "?"}
        isDeleteModalOpen={isSingleDeleteConfirmOpen}
        setIsDeleteModalOpen={setIsSingleDeleteConfirmOpen}
        onDelete={() => {
          onDeleteFunction(selectedRows.map((item) => item.id));
          setSelectedRows([]);
          setIsSingleDeleteConfirmOpen(false);
        }}
        showConfirm={false}
      />
    </StyledToolbar>
  );
};

CEMSHeader.propTypes = {
  selectedRows: PropTypes.array.isRequired,
  setSelectedRows: PropTypes.func.isRequired,
  onDeleteFunction: PropTypes.func.isRequired,
  currInspection: PropTypes.object,
  onExport: PropTypes.func,
  addNewFunction: PropTypes.func,
  onFilterClickFunc: PropTypes.func,
  columns: PropTypes.array,
  setColumns: PropTypes.func,
};

export default CEMSHeader;
