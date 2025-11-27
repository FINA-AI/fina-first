import { Box } from "@mui/system";
import GhostBtn from "../../common/Button/GhostBtn";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import DoneIcon from "@mui/icons-material/Done";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import DeleteForm from "../../common/Delete/DeleteForm";
import Tooltip from "../../common/Tooltip/Tooltip";
import { CEMS_BASE_PATH } from "../CEMSRouter";
import { styled } from "@mui/material/styles";

const StyledRootBox = styled(Box)(({ theme, isEditMode }) => ({
  padding: "16px 16px 16px 16px",
  "& .MuiOutlinedInput-root ": {
    "& .Mui-disabled": {
      "& .Mui-disabled": {
        "-webkit-text-fill-color": isEditMode
          ? ""
          : `${theme.palette.labelColor} !important`,
      },
    },
  },
  "& .MuiInputLabel-root": {
    color: "#98A7BC",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: isEditMode ? "" : "#DFDFDF !important",
  },
  boxShadow: `0.8px 7px 30px -3px ${
    theme.palette.mode === "light" ? "#eaebf0" : "#455062"
  } `,
}));

const StyledBankBox = styled(Box)(({ theme }) => ({
  width: "335px",
  borderRadius: "4px",
  background: theme.palette.mode === "light" ? "#F0F4FF" : "#58677a",
  padding: "8px 24px",
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "24px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  marginLeft: "5px",
  marginRight: "10px",
  lineBreak: "anywhere",
}));

const StyledLeftArrowIcon = styled(ArrowBackIosNewRoundedIcon)(({ theme }) => ({
  color: theme.palette.mode === "light" ? "#8695B1" : "#FFFFFF",
  width: "13px !important",
  height: "13px !important",
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
    backgroundColor: theme.palette.mode === "light" ? "#D4E0FF" : "#494f58",
  },
  transition: "0.3s",
  cursor: "pointer",
}));

const StyledEditBtnBox = styled(Box)(({ theme }) => ({
  marginLeft: "10px",
  height: "17px",
  borderRadius: "4px",
  background: theme.palette.primary.main,
  padding: "8px 16px",
  width: "fit-content",
  cursor: "pointer",
  color: "#FFFFFF",
  fontWeight: 500,
  fontSize: "14px",
  lineHeight: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& .MuiSvgIcon-root": {
    width: "20px",
    height: "20px",
    marginLeft: "10px",
  },
}));

const StyledHeader = styled(Box)({
  height: "40px",
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "row",
});

const StyledBankName = styled("span")(({ theme }) => ({
  color: theme.palette.textColor,
  marginRight: "5px",
}));

const StyledDeleteIconButton = styled(IconButton)({
  marginLeft: "7px",
  "& .MuiSvgIcon-root": {
    color: "#8695B1",
  },
});

const StyledBankCode = styled("span")({
  color: "#8695B1",
  fontWeight: 400,
});

const CEMSSanctionInnerPageHeader = ({
  isEditMode,
  setIsEditMode,
  setIsCancelModalOpen,
  setIsSaveModalOpen,
  onDelete,
  fi,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  let { inspectionId } = useParams();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  return (
    <StyledRootBox>
      <StyledHeader>
        <Box display={"flex"}>
          <StyledBackButtonBox
            onClick={() => {
              history.push(
                `/${CEMS_BASE_PATH}/inspection/${inspectionId}/sanction`
              );
            }}
          >
            <StyledLeftArrowIcon fontSize={"small"} />
          </StyledBackButtonBox>
          <Tooltip title={`${fi?.name} ${fi?.code}`} arrow={false}>
            <StyledBankBox>
              <StyledBankName>{fi?.name}</StyledBankName>
              <StyledBankCode>{fi?.code}</StyledBankCode>
            </StyledBankBox>
          </Tooltip>
        </Box>
        {isEditMode ? (
          <Box display={"flex"}>
            <GhostBtn
              onClick={() => setIsCancelModalOpen(true)}
              style={{ marginRight: "5px" }}
              height={32}
            >
              {t("cancel")}
            </GhostBtn>
            <PrimaryBtn
              onClick={() => {
                setIsSaveModalOpen(true);
              }}
              style={{ background: "#289E20", height: "32px" }}
              endIcon={<DoneIcon />}
            >
              {t("save")}
            </PrimaryBtn>
          </Box>
        ) : (
          <Box display={"flex"} alignItems={"center"}>
            <StyledEditBtnBox onClick={() => setIsEditMode(true)}>
              <span>{t("edit")}</span>
              <span>
                <EditIcon />
              </span>
            </StyledEditBtnBox>
            <StyledDeleteIconButton
              size="small"
              component="span"
              onClick={() => {
                setDeleteModalOpen(true);
              }}
            >
              <DeleteIcon />
            </StyledDeleteIconButton>
          </Box>
        )}
      </StyledHeader>
      {deleteModalOpen && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={t("sanction") + "?"}
          isDeleteModalOpen={deleteModalOpen}
          setIsDeleteModalOpen={setDeleteModalOpen}
          onDelete={onDelete}
          showConfirm={false}
        />
      )}
    </StyledRootBox>
  );
};

CEMSSanctionInnerPageHeader.propTypes = {
  isEditMode: PropTypes.bool,
  setIsEditMode: PropTypes.func,
  setIsCancelModalOpen: PropTypes.func,
  setIsSaveModalOpen: PropTypes.func,
  onDelete: PropTypes.func,
  fi: PropTypes.object,
};

export default CEMSSanctionInnerPageHeader;
