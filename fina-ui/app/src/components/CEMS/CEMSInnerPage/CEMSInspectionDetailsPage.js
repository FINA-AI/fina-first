import { Box } from "@mui/system";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import PropTypes from "prop-types";
import MenuItem from "@mui/material/MenuItem";
import ChromeReaderModeIcon from "@mui/icons-material/ChromeReaderMode";
import EditIcon from "@mui/icons-material/Edit";
import { useTranslation } from "react-i18next";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Select, Typography } from "@mui/material";
import GhostBtn from "../../common/Button/GhostBtn";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import DoneIcon from "@mui/icons-material/Done";
import ConfirmModal from "../../common/Modal/ConfirmModal";
import { SaveIcon } from "../../../api/ui/icons/SaveIcon";
import React, { useState } from "react";
import CEMSInspectionDetailsPageMainInfo from "./CEMSInspectionDetailsPageMainInfo";
import FIChooserSelect from "../../FI/FIChooserSelect";
import CEMSInspectionDetailsPageInfo from "./CEMSInspectionDetailsPageInfo";
import { useHistory } from "react-router-dom";
import DeleteForm from "../../common/Delete/DeleteForm";
import PreviewIcon from "@mui/icons-material/Preview";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import Tooltip from "../../common/Tooltip/Tooltip";
import GavelIcon from "@mui/icons-material/Gavel";
import { CEMS_BASE_PATH } from "../CEMSRouter";
import { styled } from "@mui/material/styles";
import { CancelIcon } from "../../../api/ui/icons/CancelIcon";

const StyledRootBox = styled(Box, {
  shouldForwardProp: (props) => props !== "editMode",
})(({ theme, editMode }) => ({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  background: theme.palette.paperBackground,
  paddingBottom: 100,
  boxSizing: "border-box",
  borderRadius: 8,
  minHeight: 1,
  "& .Mui-disabled": {
    opacity: editMode ? "0.5 !important" : 1,
  },
  "& .MuiOutlinedInput-root ": {
    "& .Mui-disabled": {
      "-webkit-text-fill-color": editMode
        ? ""
        : `${theme.palette.labelColor} !important`,
    },
  },
  "& .MuiInputLabel-root": {
    color: "#98A7BC",
  },
}));

const commonPhaseIconStyles = (theme, phase) => ({
  color:
    theme.palette.mode === "light"
      ? phase === 1
        ? "#8695B1"
        : "#84628B"
      : phase === 1
      ? "#FFF"
      : "#84628B",
  marginRight: 5,
  fontSize: 20,
});

const StyledAvTimerIcon = styled(AvTimerIcon)(({ theme, phase }) => ({
  ...commonPhaseIconStyles(theme, phase),
}));

const StyledPreviewIcon = styled(PreviewIcon)(({ theme, phase }) => ({
  ...commonPhaseIconStyles(theme, phase),
}));

const StyledPhaseItem = styled(Typography)(({ theme, phase }) => ({
  color:
    theme.palette.mode === "light"
      ? phase === 1
        ? "#8695B1"
        : "#84628B"
      : phase === 1
      ? "#FFF"
      : "#84628B",
  fontWeight: 500,
  fontSize: 12,
  minWidth: 50,
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

const StyledRecommendationBox = styled(Box)(({ theme }) => ({
  borderRadius: "4px",
  border: `1px solid ${theme.palette.primary.main}`,
  width: "260px",
  padding: "8px 16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "15px",
  cursor: "pointer",
}));

const StyledMenuItem = styled(MenuItem)({
  padding: "4px",
  width: "100%",
});

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

const StyledRecommendationIconSpan = styled("span")(({ theme }) => ({
  display: "flex",
  "& .MuiSvgIcon-root": {
    color: `${theme.palette.primary.main}`,
    width: "20px",
    height: "20px",
    marginRight: "5px",
  },
}));

const StyledDeleteIconButton = styled(IconButton)({
  marginLeft: "7px",
  "& .MuiSvgIcon-root": {
    color: "#8695B1",
  },
});

const StyledSanctionText = styled(Typography)(({ theme }) => ({
  color: `${theme.palette.primary.main}`,
  fontWeight: "12px",
  lineHeight: "16px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  lineBreak: "anywhere",
}));

const StyledSanctionBox = styled(Box)(({ theme }) => ({
  borderRadius: "4px",
  border: `1px solid ${theme.palette.primary.main}`,
  padding: "8px 16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "15px",
  cursor: "pointer",
}));

const StyledRecommendationText = styled("span")(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: "12px",
  lineHeight: "16px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  lineBreak: "anywhere",
}));

const StyledBackBtnBox = styled(Box)(({ theme }) => ({
  width: "40px",
  height: "40px",
  background: theme.palette.mode === "light" ? "#F0F4FF" : "#58677a",
  borderRadius: "4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
}));

const StyledHeader = styled(Box)({
  height: "40px",
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "row",
});

const StyledMainBox = styled(Box)({
  padding: "0px 16px 16px 16px",
  overflowY: "auto",
  paddingBottom: 20,
  height: "100%",
  minHeight: 1,
});

const StyledBankName = styled("span")(({ theme }) => ({
  color: theme.palette.textColor,
  marginRight: "5px",
}));

const StyledSanctionIconSpan = styled("span")(({ theme }) => ({
  display: "flex",
  "& .MuiSvgIcon-root": {
    color: `${theme.palette.primary.main}`,
    width: "20px",
    height: "20px",
    marginRight: "5px",
  },
}));

const StyledMainHeader = styled(Box)(({ theme }) => ({
  padding: 16,
  boxShadow: `0.8px 7px 30px -3px ${
    theme.palette.mode === "light" ? "#eaebf0" : "#455062"
  } `,
}));

const StyledPhaseContainer = styled(Box, {
  shouldForwardProp: (props) => props !== "phase",
})(({ theme, phase }) => ({
  backgroundColor:
    theme.palette.mode === "light"
      ? phase === 1
        ? "#EAEBF0"
        : "#EFEAF0"
      : phase === 1
      ? "#344258"
      : "#344258",
  borderRadius: 4,
  padding: "8px 16px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginRight: 10,
  boxSizing: "border-box",
  height: 35,
}));

const StyledSelect = styled(Select)(({ theme, phase }) => ({
  paddingLeft: "0px",
  backgroundColor:
    theme.palette.mode === "light"
      ? phase === 1
        ? "#EAEBF0"
        : "#EFEAF0"
      : phase === 1
      ? "#344258"
      : "#344258",
  margin: "4px 8px 4px 4px",
  border: "0px",
  "& .MuiSelect-select": {
    width: "110px",
    height: "32px",
    borderRadius: "4px",
    padding: "4px 8px 4px 4px",
    fontSize: "11px",
    lineHeight: "16px",
    fontWeight: 400,
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    padding: "0px",
    border: "0px",
  },
  "& .css-1pn378y-MuiSvgIcon-root-MuiSelect-icon": {
    color: "rgb(152, 167, 188)",
  },
}));

const CEMSInspectionDetailsPage = ({
  data,
  onCancelClick,
  onSaveClick,
  fis,
  onChangeInspectionData,
  onDeleteFunction,
  editMode,
  setEditMode,
  phase,
  setPhase,
}) => {
  const { t } = useTranslation();
  const [saveModal, setSaveModal] = useState(false);
  const [cancelModel, setCancelModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const history = useHistory();

  const finishEditing = () => {
    onChangeInspectionData("phase", phase);
  };
  const onSaveFunction = async () => {
    finishEditing();
    onSaveClick();
    setSaveModal(false);
  };

  const openInspectionPage = () => {
    history.push(`/${CEMS_BASE_PATH}/inspection`);
  };

  const openPage = (page) => {
    history.push(`/${CEMS_BASE_PATH}/inspection/${data.id}/${page}`);
  };

  const SanctionButton = () => {
    return (
      <StyledSanctionBox onClick={() => openPage("sanction")}>
        <StyledSanctionIconSpan>
          <GavelIcon />
        </StyledSanctionIconSpan>
        <StyledSanctionText>{t("sanctions")}</StyledSanctionText>
      </StyledSanctionBox>
    );
  };

  return (
    <StyledRootBox editMode={editMode}>
      {data && (
        <Box height={"100%"}>
          <StyledMainHeader>
            {editMode ? (
              <StyledHeader>
                <Box display={"flex"} justifyContent={"flex-start"}>
                  <FIChooserSelect
                    onChange={(value) => {
                      onChangeInspectionData("fi", value && value[0]);
                    }}
                    label={t("name")}
                    checkedRows={
                      data && data.fi ? [{ ...data.fi, level: 1 }] : []
                    }
                    data={fis}
                    singleSelect={true}
                    isDisabled={phase === 2}
                  />
                </Box>
                <Box
                  display={"flex"}
                  justifyContent={"flex-end"}
                  alignItems={"center"}
                >
                  <StyledSelect
                    phase={phase}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select-standard"
                    value={phase}
                    onChange={(event) => {
                      setPhase(event.target.value, editMode);
                    }}
                  >
                    <StyledMenuItem value={1}>
                      <StyledAvTimerIcon phase={phase} />
                      <StyledPhaseItem phase={phase}>
                        {t("phase") + " " + "1"}
                      </StyledPhaseItem>
                    </StyledMenuItem>
                    <StyledMenuItem value={2}>
                      <StyledPreviewIcon phase={phase} />
                      <StyledPhaseItem phase={phase}>
                        {t("phase") + " " + "2"}
                      </StyledPhaseItem>
                    </StyledMenuItem>
                  </StyledSelect>
                  <Box display={"flex"} gap={"10px"}>
                    <GhostBtn
                      onClick={() => setCancelModal(true)}
                      style={{ marginRight: "5px" }}
                      height={32}
                    >
                      {t("cancel")}
                    </GhostBtn>
                  </Box>
                  <PrimaryBtn
                    onClick={() => setSaveModal(true)}
                    style={{
                      width: "100%",
                      background: "#289E20",
                      height: "32px",
                    }}
                    endIcon={<DoneIcon />}
                  >
                    {t("save")}
                  </PrimaryBtn>
                </Box>
              </StyledHeader>
            ) : (
              <StyledHeader>
                <Box display={"flex"} width={"100%"}>
                  <StyledBackBtnBox onClick={() => openInspectionPage()}>
                    <KeyboardArrowLeftIcon />
                  </StyledBackBtnBox>
                  <Tooltip
                    title={`${data.fi?.name} ${data.fi?.code}`}
                    arrow={false}
                  >
                    <StyledBankBox>
                      <StyledBankName>{data.fi?.name}</StyledBankName>
                      <span style={{ color: "#8695B1" }}>{data.fi?.code}</span>
                    </StyledBankBox>
                  </Tooltip>
                </Box>
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  width={"100%"}
                  justifyContent={"end"}
                >
                  <StyledPhaseContainer
                    phase={phase}
                    display={"flex"}
                    flexDirection={"row"}
                  >
                    {phase === 1 ? (
                      <StyledAvTimerIcon phase={phase} />
                    ) : (
                      <StyledPreviewIcon phase={phase} />
                    )}
                    <StyledPhaseItem phase={phase}>
                      {t("phase") + " " + phase}
                    </StyledPhaseItem>
                  </StyledPhaseContainer>
                  <Box display={"flex"} flexDirection={"row"} gap={"10px"}>
                    <SanctionButton />
                    <StyledRecommendationBox
                      onClick={() => openPage("recommendation")}
                    >
                      <StyledRecommendationIconSpan>
                        <ChromeReaderModeIcon />
                      </StyledRecommendationIconSpan>
                      <StyledRecommendationText>
                        {`${t("recommendations")} / ${t("order")}`}
                      </StyledRecommendationText>
                    </StyledRecommendationBox>
                  </Box>
                  <StyledEditBtnBox onClick={() => setEditMode(true)}>
                    <span>{t("edit")}</span>
                    <span>
                      <EditIcon />
                    </span>
                  </StyledEditBtnBox>
                  <StyledDeleteIconButton
                    size="small"
                    component="span"
                    onClick={() => setDeleteModal(true)}
                  >
                    <DeleteIcon />
                  </StyledDeleteIconButton>
                </Box>
              </StyledHeader>
            )}
          </StyledMainHeader>
          <StyledMainBox>
            <CEMSInspectionDetailsPageMainInfo
              editMode={editMode}
              onChangeInspectionData={onChangeInspectionData}
              data={data}
              phase={phase}
            />
            <CEMSInspectionDetailsPageInfo
              editMode={editMode}
              onChangeInspectionData={onChangeInspectionData}
              data={data}
              phase={phase}
            />
          </StyledMainBox>
        </Box>
      )}
      {cancelModel && (
        <ConfirmModal
          isOpen={cancelModel}
          setIsOpen={setCancelModal}
          onConfirm={() => {
            setPhase(data.phase);
            setCancelModal(false);
            setEditMode(false);
            onCancelClick();
          }}
          confirmBtnTitle={t("confirm")}
          headerText={t("cancel")}
          bodyText={t("cancelBodyText")}
          additionalBodyText={t("changes")}
          icon={<CancelIcon />}
        />
      )}
      {saveModal && (
        <ConfirmModal
          isOpen={saveModal}
          setIsOpen={setSaveModal}
          onConfirm={onSaveFunction}
          confirmBtnTitle={t("save")}
          headerText={t("saveHeaderText")}
          bodyText={t("saveBodyText")}
          icon={<SaveIcon />}
          saveButtonColor={"#289E20"}
        />
      )}
      {deleteModal && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={t("inspection")}
          isDeleteModalOpen={deleteModal}
          setIsDeleteModalOpen={setDeleteModal}
          onDelete={() => {
            onDeleteFunction();
            setDeleteModal(false);
          }}
          showConfirm={false}
        />
      )}
    </StyledRootBox>
  );
};

CEMSInspectionDetailsPage.propTypes = {
  data: PropTypes.object,
  onCancelClick: PropTypes.func,
  onSaveClick: PropTypes.func,
  fis: PropTypes.array,
  onChangeInspectionData: PropTypes.any,
  onDeleteFunction: PropTypes.func,
  editMode: PropTypes.bool,
  setEditMode: PropTypes.func,
  phase: PropTypes.any,
  setPhase: PropTypes.func,
};

export default CEMSInspectionDetailsPage;
