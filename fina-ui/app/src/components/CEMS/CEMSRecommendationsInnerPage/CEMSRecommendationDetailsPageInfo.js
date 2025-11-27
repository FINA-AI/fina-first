import { Box } from "@mui/system";
import CEMSRecommendationsResponsiblePerson from "./CEMSRecommendationsResponsiblePerson";
import { Grid, IconButton, Typography } from "@mui/material";
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import FiInput from "../../FI/Common/FiInput";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import { FieldType } from "../../FI/util/FiUtil";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import NumberField from "../../common/Field/NumberField";
import DatePicker from "../../common/Field/DatePicker";
import TextField from "../../common/Field/TextField";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import ClosableModal from "../../common/Modal/ClosableModal";
import CEMSRecommendationsDetailHistory from "./CEMSRecommendationsDetailHistory";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import CEMSRecommendationDetailStatusField from "./CEMSRecommendationDetailStatusField";
import { styled } from "@mui/material/styles";

const commonRootStyles = (theme, isEditMode) => ({
  "& .MuiOutlinedInput-root ": {
    "& .Mui-disabled": {
      "-webkit-text-fill-color": isEditMode
        ? ""
        : `${theme.palette.labelColor} !important`,
    },
  },
  "& .MuiInputLabel-root": {
    color: "#98A7BC",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: isEditMode
      ? ""
      : `${theme.palette.mode === "dark" ? "#3C4D68" : "#EAEBF0"} !important`,
  },
});

const StyledRootGrid = styled(Grid)(({ theme, isEditMode }) => ({
  ...commonRootStyles(theme, isEditMode),
}));

const StyledRootBox = styled(Box)(({ theme, isEditMode }) => ({
  ...commonRootStyles(theme, isEditMode),
  borderBottom: `1px dashed ${
    theme.palette.mode === "dark" ? "#8d9299" : "#EAEBF0"
  }`,
  paddingBottom: "15px",
  paddingTop: "20px",
}));

const StyledModalBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  padding: 10,
  maxHeight: 430,
});

const StyledDotDivider = styled("span")(({ theme }) => ({
  height: 8,
  width: 8,
  backgroundColor: theme.palette.mode === "dark" ? "#8695B1" : "#D9D9D9",
  borderRadius: "50%",
  marginLeft: 10,
  marginRight: 5,
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  border: theme.palette.borderColor,
  "&:hover": {
    backgroundColor: theme.palette.mode === "light" ? "#F0F4FF" : "#494f58",
  },
  transition: "0.3s",
  marginLeft: 5,
}));

const StyledStatusHeaderText = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === "light" ? "#2C3644" : "#8695B1",
  fontWeight: 600,
  fontSize: 17,
}));

const StyledDashBorderBox = styled(Box)(({ theme }) => ({
  borderBottom: `1px dashed ${
    theme.palette.mode === "dark" ? "#8d9299" : "#EAEBF0"
  }`,
  paddingBottom: "15px",
  paddingTop: "20px",
}));

const CEMSRecommendationDetailsPageInfo = ({
  data,
  setData,
  isEditMode,
  emsRecommendationDetails,
  updateChild,
  onChangeEmsRecommendationDetails,
  getRecommendationHistory,
  recommendationHistory,
}) => {
  const { t } = useTranslation();

  const [isModalHistoryOpen, setIsModalHistoryOpen] = useState(false);

  const typeValues = [
    { label: t("recommendation"), value: "RECOMMENDATION" },
    { label: t("order"), value: "DECISION" },
  ];

  return (
    <>
      <Box paddingTop={"20px"}>
        <StyledRootGrid container spacing={2} isEditMode={isEditMode}>
          <Grid xs={3} item>
            <FiInput
              title={t("type")}
              name={"type"}
              value={data?.type}
              icon={<FlagRoundedIcon />}
              editMode={isEditMode}
              width={"100%"}
              onValueChange={(value) =>
                onChangeEmsRecommendationDetails({ type: value })
              }
              inputTypeProp={{
                inputType: FieldType.LIST,
                listData: typeValues,
              }}
            />
          </Grid>
          <Grid xs={3} item>
            <FiInput
              title={t("numberOfOutGoingCoverLetters")}
              name={"type"}
              value={data?.letterInfo}
              icon={<CodeRoundedIcon />}
              editMode={isEditMode}
              width={"100%"}
              onValueChange={(value) => {
                onChangeEmsRecommendationDetails({ letterInfo: value });
              }}
            />
          </Grid>
          <Grid xs={3} item>
            <FiInput
              title={t("dateOfOutGoingCoverLetter")}
              name={"type"}
              value={data?.letterDate}
              icon={<DescriptionRoundedIcon />}
              editMode={isEditMode}
              width={"100%"}
              onValueChange={(value) => {
                onChangeEmsRecommendationDetails({ letterDate: value });
              }}
              inputTypeProp={{
                inputType: FieldType.DATE,
              }}
            />
          </Grid>
          <Grid xs={3} item>
            <FiInput
              title={t("inspectionDate")}
              name={"type"}
              value={data?.creationDate}
              icon={<FactCheckRoundedIcon />}
              editMode={isEditMode}
              width={"100%"}
              onValueChange={(value) => {
                onChangeEmsRecommendationDetails({
                  creationDate: value,
                });
              }}
              inputTypeProp={{
                inputType: FieldType.DATE,
              }}
            />
          </Grid>
        </StyledRootGrid>
      </Box>
      <Box paddingTop={"20px"}>
        <StyledRootGrid container spacing={2} isEditMode={isEditMode}>
          <Grid item xs={6}>
            <NumberField
              value={data?.number}
              isDisabled={!isEditMode}
              label={t("number")}
              size={"default"}
              onChange={(val) => {
                onChangeEmsRecommendationDetails({ number: val });
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <DatePicker
              isDisabled={!isEditMode}
              label={t("executionPeriod")}
              value={data?.executionPeriod}
              onChange={(val) => {
                onChangeEmsRecommendationDetails({ executionPeriod: val });
              }}
              size={"default"}
            />
          </Grid>
        </StyledRootGrid>
      </Box>
      <StyledRootBox isEditMode={isEditMode}>
        <Grid container>
          <Grid item xs={12}>
            <TextField
              isDisabled={!isEditMode}
              label={t("ordersContent")}
              value={data?.orderContent}
              onChange={(val) => {
                onChangeEmsRecommendationDetails({ orderContent: val });
              }}
              multiline={true}
              rows={2}
              height={70}
            />
          </Grid>
        </Grid>
      </StyledRootBox>
      <Box style={{ paddingTop: 20 }}>
        <Box display={"flex"} alignItems={"center"}>
          <StyledStatusHeaderText>
            {t("deadlineOfInspection")}
          </StyledStatusHeaderText>
          <StyledDotDivider />
          <StyledIconButton
            onClick={() => {
              getRecommendationHistory();
              setIsModalHistoryOpen(true);
            }}
          >
            <HistoryRoundedIcon
              sx={{ color: "#8695B1" }}
              style={{ fontSize: 14 }}
              fontSize={"small"}
            />
          </StyledIconButton>
        </Box>
        <StyledRootGrid
          container
          spacing={2}
          pt={"20px"}
          isEditMode={isEditMode}
        >
          <Grid xs={6} item>
            <TextField
              isDisabled={!isEditMode}
              label={t("banksMeasureFullfilOrder")}
              value={data?.fiActions}
              onChange={(val) => {
                onChangeEmsRecommendationDetails({ fiActions: val });
              }}
              multiline={true}
              rows={4}
              height={100}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              isDisabled={!isEditMode}
              label={t("note")}
              value={data?.note}
              onChange={(val) => {
                onChangeEmsRecommendationDetails({ note: val });
              }}
              rows={4}
              multiline={true}
              height={100}
            />
          </Grid>
        </StyledRootGrid>
        <StyledDashBorderBox>
          <Grid container>
            <Grid item xs={12}>
              <CEMSRecommendationDetailStatusField
                data={data}
                setData={setData}
                onChangeEmsRecommendationDetails={
                  onChangeEmsRecommendationDetails
                }
                isEditMode={isEditMode}
              />
            </Grid>
          </Grid>
        </StyledDashBorderBox>
      </Box>
      <Box paddingTop={"20px"}>
        <StyledStatusHeaderText>
          {t("responsiblePersonFromBank")}
        </StyledStatusHeaderText>
        <CEMSRecommendationsResponsiblePerson
          emsRecommendationDetails={emsRecommendationDetails}
          isEditMode={isEditMode}
          data={data}
          setData={setData}
          updateChild={updateChild}
          onChangeEmsRecommendationDetails={onChangeEmsRecommendationDetails}
        />
      </Box>
      <ClosableModal
        onClose={() => {
          setIsModalHistoryOpen(false);
        }}
        open={isModalHistoryOpen}
        title={t("changeHistory")}
        width={780}
      >
        <StyledModalBox>
          <CEMSRecommendationsDetailHistory data={recommendationHistory} />
          <div style={{ display: "flex", justifyContent: "end" }}>
            <PrimaryBtn
              onClick={() => {
                setIsModalHistoryOpen(false);
              }}
            >
              <Typography> {t("done")} </Typography>
            </PrimaryBtn>
          </div>
        </StyledModalBox>
      </ClosableModal>
    </>
  );
};

CEMSRecommendationDetailsPageInfo.propTypes = {
  data: PropTypes.object,
  setData: PropTypes.func,
  isEditMode: PropTypes.bool,
  emsRecommendationDetails: PropTypes.object,
  updateChild: PropTypes.func,
  onChangeEmsRecommendationDetails: PropTypes.func,
  getRecommendationHistory: PropTypes.func,
  recommendationHistory: PropTypes.array,
};

export default CEMSRecommendationDetailsPageInfo;
