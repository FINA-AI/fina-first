import PropTypes from "prop-types";
import { Box } from "@mui/system";
import { Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import TextField from "../../common/Field/TextField";
import DatePicker from "../../common/Field/DatePicker";
import UserAndGroupVirtualizedSelect from "../../UserManagement/UserAndGroupVirtualizedSelect";
import NumberField from "../../common/Field/NumberField";
import { styled } from "@mui/material/styles";

const StyledRootBox = styled(Box, {
  shouldForwardProp: (props) => props !== "editMode",
})(({ theme, editMode }) => ({
  width: "100%",
  display: "flex",
  padding: "20px 0px 0px",
  flexDirection: "column",
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
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor:
      theme.palette.mode === "light"
        ? editMode
          ? ""
          : "#DFDFDF !important"
        : editMode
        ? ""
        : "#3C4D68",
  },
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  paddingBottom: "15px",
  fontSize: "14px",
  lineHeight: "150%",
  color: theme.palette.textColor,
  fontWeight: 600,
}));

const StyledContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  paddingBottom: "20px",
  borderBottom: `1px dashed ${
    theme.palette.mode === "dark" ? "#8d9299" : "#EAEBF0"
  }`,
}));

const StyledInputContainer = styled(Box)({
  padding: "9px 9px",
});

const CEMSInspectionDetailsPageInfo = ({
  editMode,
  data,
  onChangeInspectionData,
  phase,
}) => {
  const { t } = useTranslation();
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (data.reportingYearInspection && data.reportingYearInspection.manager) {
      setSelectedUser({
        ...data.reportingYearInspection.manager,
      });
    }
  }, [data]);

  return (
    <StyledRootBox editMode={editMode}>
      <StyledContainer>
        <StyledTitle>{t("termsOfVerification")}</StyledTitle>
        <Grid container>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInputContainer>
              <DatePicker
                disableToolbar={true}
                value={data.startDate ? data.startDate : null}
                size={"default"}
                label={t("startDate")}
                onChange={(value) => {
                  onChangeInspectionData(
                    "startDate",
                    value ? value.getTime().toString() : ""
                  );
                }}
                isDisabled={!editMode || phase === 2}
              />
            </StyledInputContainer>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInputContainer>
              <DatePicker
                disableToolbar={true}
                value={data.endDate}
                size={"default"}
                label={t("expectedEndDate")}
                onChange={(value) => {
                  onChangeInspectionData(
                    "endDate",
                    value ? value.getTime().toString() : ""
                  );
                }}
                isDisabled={!editMode || phase === 2}
              />
            </StyledInputContainer>
          </Grid>
        </Grid>
      </StyledContainer>
      <StyledContainer marginTop={"20px"}>
        <Grid container>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInputContainer>
              <TextField
                border={4}
                size={"small"}
                isDisabled={!editMode || phase === 2}
                value={data.info}
                fieldName={""}
                label={t("informationAboutTheProgressOfTheInspection")}
                isError={false}
                multiline={true}
                rows={2}
                onChange={(value) => {
                  onChangeInspectionData("info", value);
                }}
              />
            </StyledInputContainer>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInputContainer>
              <TextField
                border={4}
                size={"small"}
                isDisabled={!editMode || phase === 1}
                value={data.purpose}
                fieldName={""}
                label={t("purposeOfTheInspection")}
                isError={false}
                multiline={true}
                rows={2}
                onChange={(value) => {
                  onChangeInspectionData("purpose", value);
                }}
              />
            </StyledInputContainer>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInputContainer>
              <TextField
                border={4}
                size={"small"}
                isDisabled={!editMode || phase === 2}
                value={data.foundation}
                fieldName={""}
                label={t("groundsForHoldingTheCPU")}
                isError={false}
                multiline={true}
                rows={2}
                onChange={(value) => {
                  onChangeInspectionData("foundation", value);
                }}
              />
            </StyledInputContainer>
          </Grid>
        </Grid>
      </StyledContainer>
      <StyledContainer marginTop={"20px"}>
        <Grid container>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInputContainer>
              <DatePicker
                disableToolbar={true}
                value={data.lastInspectionDate}
                size={"default"}
                label={t("dateOfLastInspection")}
                onChange={(value) => {
                  onChangeInspectionData(
                    "lastInspectionDate",
                    value ? value.getTime().toString() : ""
                  );
                }}
                isDisabled={!editMode || phase === 1}
              />
            </StyledInputContainer>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInputContainer>
              <DatePicker
                value={data.ongoingInspectionDate}
                size={"default"}
                label={t("currentInspectionDate")}
                onChange={(value) => {
                  onChangeInspectionData(
                    "ongoingInspectionDate",
                    value ? value.getTime().toString() : ""
                  );
                }}
                isDisabled={!editMode || phase === 1}
              />
            </StyledInputContainer>
          </Grid>
        </Grid>
      </StyledContainer>
      <StyledContainer marginTop={"20px"}>
        <StyledTitle>{t("reportingYearChecks")}</StyledTitle>
        <Grid container>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInputContainer>
              <DatePicker
                border={4}
                disableToolbar={true}
                value={
                  data.reportingYearInspection &&
                  data.reportingYearInspection.startDate
                }
                size={"default"}
                label={t("startDate")}
                onChange={(value) => {
                  {
                    let reportingYearInspection = {
                      startDate: value ? value.getTime().toString() : "",
                    };

                    onChangeInspectionData(
                      "reportingYearInspection",
                      reportingYearInspection
                    );
                  }
                }}
                isDisabled={!editMode || phase === 1}
              />
            </StyledInputContainer>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInputContainer>
              <DatePicker
                border={4}
                disableToolbar={true}
                value={
                  data.reportingYearInspection &&
                  data.reportingYearInspection.endDate
                }
                size={"default"}
                label={t("endDate")}
                onChange={(value) => {
                  let reportingYearInspection = {
                    endDate: value ? value.getTime().toString() : "",
                  };

                  onChangeInspectionData(
                    "reportingYearInspection",
                    reportingYearInspection
                  );
                }}
                isDisabled={!editMode || phase === 1}
              />
            </StyledInputContainer>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInputContainer>
              {editMode ? (
                <UserAndGroupVirtualizedSelect
                  label={t("fullNameOfTheHeadOfTheInspection")}
                  selectedUsers={selectedUser ? [selectedUser] : []}
                  setSelectedUsers={(value) => {
                    let val =
                      typeof value === "object" && value.id
                        ? { ...value }
                        : null;
                    setSelectedUser(val);
                    let reportingYearInspection = {
                      manager: val,
                    };
                    onChangeInspectionData(
                      "reportingYearInspection",
                      reportingYearInspection
                    );
                  }}
                  size={"default"}
                  singleSelect={true}
                  disabled={phase === 1}
                />
              ) : (
                <TextField
                  border={4}
                  size={"default"}
                  isDisabled={true}
                  value={selectedUser?.login}
                  label={t("fullNameOfTheHeadOfTheInspection")}
                  onChange={() => {}}
                />
              )}
            </StyledInputContainer>
          </Grid>
        </Grid>
      </StyledContainer>
      <StyledContainer marginTop={"20px"}>
        <Grid container>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInputContainer>
              <DatePicker
                border={4}
                disableToolbar={true}
                value={data.metaInfo && data.metaInfo.preliminaryDiscussionDate}
                size={"default"}
                label={t(
                  "preliminarydiscussionoftheresultsoftheInspectionwiththeBank"
                )}
                onChange={(value) => {
                  let metaInfo = {
                    preliminaryDiscussionDate: value
                      ? value.getTime().toString()
                      : "",
                  };
                  onChangeInspectionData("metaInfo", metaInfo);
                }}
                isDisabled={!editMode || phase === 1}
                enableTooltip={true}
              />
            </StyledInputContainer>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInputContainer>
              <DatePicker
                border={4}
                disableToolbar={true}
                value={data.metaInfo && data.metaInfo.finalDiscussionDate}
                size={"default"}
                label={t(
                  "dateOfTheFinalDiscussionOfTheResultsOfTheInspectionWithTheBank"
                )}
                onChange={(value) => {
                  let metaInfo = {
                    finalDiscussionDate: value
                      ? value.getTime().toString()
                      : "",
                  };
                  onChangeInspectionData("metaInfo", metaInfo);
                }}
                isDisabled={!editMode || phase === 1}
                enableTooltip={true}
              />
            </StyledInputContainer>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInputContainer>
              <DatePicker
                border={4}
                disableToolbar={true}
                value={data.metaInfo && data.metaInfo.reportSentDate}
                size={"default"}
                label={t("dateOfSendingTheReportToTheBank")}
                onChange={(value) => {
                  let metaInfos = {
                    reportSentDate: value ? value.getTime().toString() : "",
                  };
                  onChangeInspectionData("metaInfo", metaInfos);
                }}
                isDisabled={!editMode || phase === 1}
              />
            </StyledInputContainer>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={9}>
            <StyledInputContainer>
              <TextField
                border={4}
                size={"small"}
                isDisabled={!editMode || phase === 1}
                value={data.metaInfo && data.metaInfo.problemDescription}
                fieldName={""}
                label={t("briefDescriptionOfTheIdentifiedProblems")}
                isError={false}
                multiline={true}
                rows={2}
                onChange={(value) => {
                  let metaInfo = {
                    problemDescription: value,
                  };
                  onChangeInspectionData("metaInfo", metaInfo);
                }}
              />
            </StyledInputContainer>
          </Grid>
        </Grid>
      </StyledContainer>
      <Box marginTop={"20px"} width={"100%"}>
        <StyledTitle>{t("numberOfOrders")}</StyledTitle>
        <Grid container>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInputContainer>
              <NumberField
                size={"default"}
                border={4}
                isDisabled={!editMode || phase === 1}
                value={data.metaInfo && data.metaInfo.numberOfOrders}
                format={"#,##0.##########"}
                label={t("totalNumberOfOrders")}
                onChange={(value) => {
                  let metaInfo = {
                    numberOfOrders: value,
                  };
                  onChangeInspectionData("metaInfo", metaInfo);
                }}
              />
            </StyledInputContainer>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInputContainer>
              <NumberField
                size={"default"}
                border={4}
                isDisabled={!editMode || phase === 1}
                value={data.metaInfo && data.metaInfo.numberOfOrdersAML}
                format={"#,##0.##########"}
                label={t("totalNumberOfOrdersFromAML")}
                onChange={(value) => {
                  let metaInfo = {
                    numberOfOrdersAML: value,
                  };
                  onChangeInspectionData("metaInfo", metaInfo);
                }}
              />
            </StyledInputContainer>
          </Grid>
        </Grid>
      </Box>
    </StyledRootBox>
  );
};

CEMSInspectionDetailsPageInfo.propTypes = {
  editMode: PropTypes.bool,
  data: PropTypes.object,
  onChangeInspectionData: PropTypes.func,
  phase: PropTypes.number,
};

export default CEMSInspectionDetailsPageInfo;
