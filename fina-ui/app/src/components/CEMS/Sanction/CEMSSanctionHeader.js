import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Box } from "@mui/system";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import Tooltip from "../../common/Tooltip/Tooltip";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import AddIcon from "@mui/icons-material/Add";
import DeleteForm from "../../common/Delete/DeleteForm";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { Grid, IconButton } from "@mui/material";
import TableCustomizationButton from "../../common/Button/TableCustomizationButton";
import { CEMS_SANCTION_TABLE_KEY } from "../../../api/TableCustomizationKeys";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import DownloadIcon from "@mui/icons-material/Download";
import { CEMS_BASE_PATH } from "../CEMSRouter";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import SecondaryToolbar from "../../common/Toolbar/SecondaryToolbar";
import { styled } from "@mui/material/styles";

const StyledRootBox = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  borderBottom: "1px solid #EAEBF0",
  padding: 10,
});

const StyledAddIconSpan = styled("span")({
  marginLeft: 5,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const StyledBackButton = styled(Box)(({ theme }) => ({
  height: 40,
  width: 40,
  background: theme.palette.mode === "light" ? "#F0F4FF" : "#58677a",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 4,
  "&:hover": {
    backgroundColor: "#D4E0FF",
  },
  transition: "0.3s",
  cursor: "pointer",
}));

const StyledBankNameBox = styled(Box)(({ theme }) => ({
  width: "335px",
  borderRadius: "4px",
  background: theme.palette.mode === "light" ? "#F0F4FF" : "#58677a",
  padding: "8px 24px",
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "24px",
  textTransform: "capitalize",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  marginLeft: "5px",
  marginRight: "10px",
  lineBreak: "anywhere",
}));

const StyledExportIcon = styled(IconButton)(({ theme }) => ({
  borderRadius: "96px",
  width: "32px",
  height: "32px",
  background: theme.palette.primary.main,
  border: theme.palette.borderColor,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: "15px",
}));

const StyledDownloadIcon = styled(DownloadIcon)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#2D3747" : "#F5F7FA",
  fontSize: 18,
}));

const StyledLeftArrowIcon = styled(ArrowBackIosNewRoundedIcon)(({ theme }) => ({
  color: theme.palette.mode === "light" ? "#8695B1" : "#FFFFFF",
  width: "13px !important",
  height: "13px !important",
}));

const StyledBankNameText = styled("span")(({ theme }) => ({
  color: theme.palette.textColor,
  marginRight: "5px",
}));

const StyledBankCodeText = styled("span")(({ theme }) => ({
  color: theme.palette.mode === "light" ? "#8695B1" : "#b1c1df",
}));

const CEMSSanctionHeader = ({
  selectedRows,
  setSelectedRows,
  deleteHandler,
  inspection,
  columns,
  setColumns,
  onExport,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const getDeleteToolbar = () => {
    return (
      <Box display={"flex"} justifyContent={"flex-end"}>
        <SecondaryToolbar
          onDeleteButtonClick={() => {
            setIsDeleteConfirmOpen(true);
          }}
          onCancelClick={() => {
            setSelectedRows([]);
          }}
          selectedItemsCount={selectedRows.length}
        >
          <StyledExportIcon>
            <StyledDownloadIcon onClick={onExport} />
          </StyledExportIcon>
        </SecondaryToolbar>
      </Box>
    );
  };

  return (
    <>
      {selectedRows.length <= 1 ? (
        <StyledRootBox>
          <Box display={"flex"}>
            <StyledBackButton
              onClick={() => {
                history.push(`/${CEMS_BASE_PATH}/inspection/${inspection.id}`);
              }}
            >
              <StyledLeftArrowIcon />
            </StyledBackButton>
            <Tooltip
              title={`${inspection?.fi?.name} ${inspection?.fi?.code}`}
              arrow={false}
            >
              <StyledBankNameBox>
                <StyledBankNameText>{inspection?.fi?.name}</StyledBankNameText>
                <StyledBankCodeText>{inspection?.fi?.code}</StyledBankCodeText>
              </StyledBankNameBox>
            </Tooltip>
          </Box>
          <Box>
            <Grid container spacing={2}>
              <Grid item>
                <IconButton
                  onClick={() => {
                    setIsDeleteConfirmOpen(true);
                  }}
                  style={{
                    marginLeft: "5px",
                    opacity: !(selectedRows && selectedRows.length > 0)
                      ? 0.6
                      : 1,
                  }}
                  disabled={!(selectedRows && selectedRows.length > 0)}
                >
                  <DeleteRoundedIcon
                    style={{ color: "#8695B1" }}
                    fontSize={"small"}
                  />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton style={{ marginLeft: "5px" }} onClick={onExport}>
                  <DownloadRoundedIcon
                    style={{ color: "#8695B1" }}
                    fontSize={"small"}
                  />
                </IconButton>
              </Grid>
              <Grid item>
                <span>
                  <TableCustomizationButton
                    columns={columns}
                    setColumns={setColumns}
                    hasColumnFreeze={true}
                    tableKey={CEMS_SANCTION_TABLE_KEY}
                  />
                </span>
              </Grid>
              <Grid item>
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
                  onClick={() => {
                    history.push(
                      `/${CEMS_BASE_PATH}/inspection/${inspection.id}/sanction/0`
                    );
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </StyledRootBox>
      ) : (
        getDeleteToolbar()
      )}
      <DeleteForm
        headerText={t("delete")}
        bodyText={t("deleteWarning")}
        additionalBodyText={t(
          `${
            selectedRows && selectedRows.length > 1 ? "sanctions" : "sanction"
          }`
        )}
        isDeleteModalOpen={isDeleteConfirmOpen}
        setIsDeleteModalOpen={setIsDeleteConfirmOpen}
        onDelete={() => {
          setSelectedRows([]);
          deleteHandler(selectedRows.map((item) => item.id));
          setIsDeleteConfirmOpen(false);
        }}
        showConfirm={false}
      />
    </>
  );
};

CEMSSanctionHeader.propTypes = {
  selectedRows: PropTypes.array,
  setSelectedRows: PropTypes.func,
  deleteHandler: PropTypes.func,
  inspection: PropTypes.object,
  onExport: PropTypes.func,
  columns: PropTypes.array,
  setColumns: PropTypes.func,
};

export default CEMSSanctionHeader;
