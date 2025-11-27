import { Box } from "@mui/system";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import { IconButton } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import Dropdown from "../../common/Button/Dropdown";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import DownloadIcon from "@mui/icons-material/Download";
import PropTypes from "prop-types";
import DeleteForm from "../../common/Delete/DeleteForm";
import { useHistory, useParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "../../common/Tooltip/Tooltip";
import TableCustomizationButton from "../../common/Button/TableCustomizationButton";
import { CEMS_RECOMMENDATION_TABLE_KEY } from "../../../api/TableCustomizationKeys";
import { CEMS_BASE_PATH } from "../CEMSRouter";
import SecondaryToolbar from "../../common/Toolbar/SecondaryToolbar";
import { styled } from "@mui/material/styles";

const StyledRoot = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  borderBottom: theme.palette.borderColor,
  padding: 10,
}));

const StyledSecHeaderWrapper = styled(Box, {
  shouldForwardProp: (props) => props !== "selectedRows",
})(({ selectedRows }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: selectedRows.length > 1 ? "0 0 0 10px" : "10px",
}));

const StyledIconButton = styled(IconButton)({
  transition: "0.3s",
  marginLeft: "5px",
});

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

const StyledExportContainer = styled(Box)(({ theme }) => ({
  borderRadius: "96px",
  width: "32px",
  height: "32px",
  background: theme.palette.primary.main,
  border: theme.palette.borderColor,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: "10px",
}));

const StyledBackButtonBox = styled(Box)(({ theme }) => ({
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

const StyledLeftArrowIcon = styled(ArrowBackIosNewRoundedIcon)(({ theme }) => ({
  color: theme.palette.mode === "light" ? "#8695B1" : "#FFFFFF",
  width: "13px !important",
  height: "13px !important",
}));

const StyledBankName = styled("span")(({ theme }) => ({
  color: theme.palette.textColor,
  marginRight: "5px",
}));

const StyledBankCode = styled("span")(({ theme }) => ({
  color: theme.palette.mode === "light" ? "#8695B1" : "#b1c1df",
}));

const StyledExportIcon = styled(DownloadIcon)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#2D3747" : "#F5F7FA",
  fontSize: 18,
}));

const StyledAddNewSpan = styled("span")({
  marginLeft: 5,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const CEMSRecommendationsHeader = ({
  columns,
  setColumns,
  selectedRows,
  setSelectedRows,
  deleteRecommendationHandler,
  filter,
  setFilter,
  inspection,
  onExport,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  let { inspectionId } = useParams();

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isSingleDeleteConfirmOpen, setIsSingleDeleteConfirmOpen] =
    useState(false);

  const typeElements = [
    { name: t("all"), key: 1 },
    { name: t("RECOMMENDATION"), key: 2, val: "RECOMMENDATION" },
    { name: t("order"), key: 3, val: "DECISION" },
  ];

  return (
    <>
      <StyledRoot>
        <Box display={"flex"}>
          <StyledBackButtonBox
            onClick={() => {
              history.push(`/${CEMS_BASE_PATH}/inspection/${inspectionId}`);
            }}
          >
            <StyledLeftArrowIcon />
          </StyledBackButtonBox>
          <Tooltip
            title={`${inspection?.fi?.name} ${inspection?.fi?.code}`}
            arrow={false}
          >
            <StyledBankNameBox>
              <StyledBankName>{inspection?.fi?.name}</StyledBankName>
              <StyledBankCode>{inspection?.fi?.code}</StyledBankCode>
            </StyledBankNameBox>
          </Tooltip>
        </Box>
        <Box>
          <span style={{ paddingRight: "8px" }}>
            <TableCustomizationButton
              columns={columns}
              setColumns={setColumns}
              hasColumnFreeze={true}
              tableKey={CEMS_RECOMMENDATION_TABLE_KEY}
            />
          </span>
          <PrimaryBtn
            children={
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                {t("addNew")}
                <StyledAddNewSpan>
                  <AddIcon />
                </StyledAddNewSpan>
              </Box>
            }
            onClick={() => {
              history.push(
                `/${CEMS_BASE_PATH}/inspection/${inspectionId}/recommendation/0`
              );
            }}
          />
        </Box>
      </StyledRoot>
      <StyledSecHeaderWrapper selectedRows={selectedRows}>
        <Dropdown
          dropdownData={typeElements}
          selectedType={
            !filter.type
              ? { name: t("all"), key: 1 }
              : typeElements.find((element) => {
                  return element.val === filter.type;
                })
          }
          setSelection={(element) => {
            setFilter({ ...filter, type: element.val });
          }}
          width={"200px"}
        />
        {selectedRows.length > 1 ? (
          <SecondaryToolbar
            selectedItemsCount={selectedRows.length}
            onDeleteButtonClick={() => {
              setIsDeleteConfirmOpen(true);
            }}
            onCancelClick={() => {
              setSelectedRows([]);
            }}
          >
            <StyledExportContainer>
              <StyledExportIcon
                onClick={() => {
                  onExport();
                }}
              />
            </StyledExportContainer>
          </SecondaryToolbar>
        ) : (
          <Box display={"flex"}>
            <StyledIconButton
              onClick={() => {
                if (selectedRows.length === 1) {
                  setIsSingleDeleteConfirmOpen(true);
                }
              }}
              style={{
                opacity: !(selectedRows && selectedRows.length > 0) ? 0.7 : 1,
              }}
              disabled={!(selectedRows && selectedRows.length > 0)}
            >
              <DeleteRoundedIcon sx={{ color: "#8695B1" }} fontSize={"small"} />
            </StyledIconButton>
            <StyledIconButton
              onClick={() => {
                onExport();
              }}
              style={{
                opacity: !(selectedRows && selectedRows.length > 0) ? 0.7 : 1,
              }}
              disabled={!(selectedRows && selectedRows.length > 0)}
            >
              <DownloadRoundedIcon
                sx={{ color: "#8695B1" }}
                fontSize={"small"}
              />
            </StyledIconButton>
          </Box>
        )}
      </StyledSecHeaderWrapper>
      <DeleteForm
        headerText={t("delete")}
        bodyText={t("deleteWarning")}
        additionalBodyText={t("recommendation") + "s" + "?"}
        isDeleteModalOpen={isDeleteConfirmOpen}
        setIsDeleteModalOpen={setIsDeleteConfirmOpen}
        onDelete={() => {
          setSelectedRows([]);
          deleteRecommendationHandler(selectedRows.map((item) => item.id));
          setIsDeleteConfirmOpen(false);
        }}
        showConfirm={false}
      />
      <DeleteForm
        headerText={t("delete")}
        bodyText={t("deleteWarning")}
        additionalBodyText={t("recommendation") + "?"}
        isDeleteModalOpen={isSingleDeleteConfirmOpen}
        setIsDeleteModalOpen={setIsSingleDeleteConfirmOpen}
        onDelete={() => {
          deleteRecommendationHandler([selectedRows[0].id]);
          setSelectedRows([]);
          setIsSingleDeleteConfirmOpen(false);
        }}
        showConfirm={false}
      />
    </>
  );
};

CEMSRecommendationsHeader.propTypes = {
  selectedRows: PropTypes.array,
  setSelectedRows: PropTypes.func,
  deleteRecommendationHandler: PropTypes.func,
  filter: PropTypes.object,
  setFilter: PropTypes.func,
  inspection: PropTypes.object,
  onExport: PropTypes.func,
  columns: PropTypes.array,
  setColumns: PropTypes.func,
};

export default CEMSRecommendationsHeader;
