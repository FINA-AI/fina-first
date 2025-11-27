import { Box } from "@mui/system";
import { Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import TextField from "../../common/Field/TextField";
import Select from "../../common/Field/Select";
import DatePicker from "../../common/Field/DatePicker";
import { loadDecisionMakingBodyCatalog } from "../../../api/services/CEMSSanctionService";
import CEMSMeasureOfInfluenceField from "./CEMSMeasureOfInfluenceField";
import CEMSanctionRegulation from "./CEMSanctionRegulation";
import CEMSSanctionEmployeeList from "./CEMSSanctionEmployeeList";
import CEMSMeasureOfReasonsField from "./CEMSMeasureOfReasonsField";
import CEMSStatusListField from "./CEMSStatusListField";
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
    borderColor:
      theme.palette.mode === "light"
        ? isEditMode
          ? ""
          : "#DFDFDF !important"
        : isEditMode
        ? ""
        : "#3C4D68",
  },
});

const StyledStatusHeaderText = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === "light" ? "#2C3644" : "#8695B1",
  fontWeight: 600,
  fontSize: 17,
}));

const StyledDashborderBox = styled(Box)(({ theme }) => ({
  borderBottom: `1px dashed ${
    theme.palette.mode === "dark" ? "#8d9299" : "#EAEBF0"
  }`,
  paddingBottom: 15,
  paddingTop: "20px",
}));

const StyledSubTitle = styled(Typography)({
  color: "#2C3644",
  fontWeight: 500,
  fontSize: 11,
});

const StyledGridContainer = styled(Grid)(({ theme, isEditMode }) => ({
  ...commonRootStyles(theme, isEditMode),
}));

const StyledBoxContainer = styled(Grid)(({ theme, isEditMode }) => ({
  ...commonRootStyles(theme, isEditMode),
  borderBottom: `1px dashed ${
    theme.palette.mode === "dark" ? "#8d9299" : "#EAEBF0"
  }`,
  paddingBottom: "15px",
}));

const CEMSSanctionDetailsInfo = ({
  data,
  // setData,
  isEditMode,
  originalData,
  onChangeData,
}) => {
  const { t } = useTranslation();

  const [decisionMakingCatalog, setDecisionMakingBodyCatalogData] = useState(
    []
  );

  useEffect(() => {
    loadDecisionMakingCatalog();
  }, []);

  const loadDecisionMakingCatalog = async () => {
    const catalog = await loadDecisionMakingBodyCatalog();
    setDecisionMakingBodyCatalogData(catalog.data);
  };

  return (
    <>
      <Box sx={{ paddingTop: "20px" }}>
        <StyledGridContainer container spacing={2}>
          <Grid xs={3} item>
            <Select
              disabled={!isEditMode}
              size={"default"}
              onChange={(value) => {
                onChangeData({ organizationType: value });
              }}
              value={data.organizationType}
              data={[
                { label: t("COMMERCIAL_BANK"), value: "COMMERCIAL_BANK" },
                { label: t("OTHER_LEGAL_PERSON"), value: "OTHER_LEGAL_PERSON" },
                {
                  label: t("OTHER_PHYSICAL_PERSON"),
                  value: "OTHER_PHYSICAL_PERSON",
                },
              ]}
              label={t("organizationType")}
            />
          </Grid>
          <Grid xs={3} item>
            <TextField
              isDisabled={!isEditMode}
              label={t("subjectLegalName")}
              value={data.subjectLegalName}
              size={"default"}
              onChange={(value) => {
                onChangeData({ subjectLegalName: value });
              }}
            />
          </Grid>
          <Grid xs={3} item>
            <TextField
              isDisabled={!isEditMode}
              label={t("subjectID")}
              value={data.subjectID}
              size={"default"}
              onChange={(value) => {
                onChangeData({ subjectID: value });
              }}
            />
          </Grid>
          <Grid xs={3} item>
            <TextField
              isDisabled={!isEditMode}
              label={t("licenseNumber")}
              value={data.licenseNumber}
              size={"default"}
              onChange={(value) => {
                onChangeData({ licenseNumber: value });
              }}
            />
          </Grid>
        </StyledGridContainer>
      </Box>
      <Box sx={{ paddingTop: "20px" }}>
        <StyledGridContainer container spacing={2}>
          <Grid item xs={3}>
            <TextField
              isDisabled={!isEditMode}
              label={t("address")}
              value={data.address}
              size={"default"}
              onChange={(value) => {
                onChangeData({ address: value });
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              isDisabled={!isEditMode}
              label={t("registrationLetterNumber")}
              value={data.registrationLetterNumber}
              size={"default"}
              onChange={(value) => {
                onChangeData({ registrationLetterNumber: value });
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              isDisabled={!isEditMode}
              label={t("sanctionNote")}
              value={data.sanctionNote}
              onChange={(value) => {
                onChangeData({ sanctionNote: value });
              }}
              multiline
              rows={4}
              height={120}
            />
          </Grid>
        </StyledGridContainer>
      </Box>
      <Box>
        <Box display={"flex"} alignItems={"center"}>
          <StyledStatusHeaderText>
            {t("cemsActionGroupTitle")}
          </StyledStatusHeaderText>
        </Box>
        <Box paddingTop={"20px"}>
          <CEMSMeasureOfInfluenceField
            editMode={isEditMode}
            originalData={originalData}
            onChange={(values) => {
              onChangeData({
                measureOfInfluence: values,
              });
            }}
          />
        </Box>
      </Box>
      <Box style={{ paddingTop: 20 }}>
        <Box display={"flex"} alignItems={"center"}>
          <StyledStatusHeaderText>
            {t("cemsActionInfoGroupTitle")}
          </StyledStatusHeaderText>
        </Box>
        <StyledGridContainer container spacing={2} pt={"20px"}>
          <Grid xs={3} item>
            <Select
              disabled={!isEditMode}
              size={"default"}
              onChange={(value) => {
                onChangeData({ decisionMakingBodyCatalog: { key: value } });
              }}
              value={data.decisionMakingBodyCatalog?.key}
              data={decisionMakingCatalog.map((d) => {
                return { label: d.value, value: d.key };
              })}
              label={t("decisionMakingBodyCatalog")}
            />
          </Grid>
          <Grid item xs={3}>
            <DatePicker
              isDisabled={!isEditMode}
              label={t("actionDate")}
              value={data?.actionDate}
              onChange={(val) => {
                onChangeData({ actionDate: val });
              }}
              size={"default"}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              isDisabled={!isEditMode}
              label={t("documentNumber")}
              value={data.documentNumber}
              size={"default"}
              onChange={(value) => {
                onChangeData({ documentNumber: value });
              }}
            />
          </Grid>
        </StyledGridContainer>
        <StyledDashborderBox>
          <StyledGridContainer container spacing={2}>
            <Grid item xs={3}>
              <DatePicker
                isDisabled={!isEditMode}
                label={t("executionPeriod")}
                value={data?.executionPeriod}
                onChange={(val) => {
                  onChangeData({ executionPeriod: val });
                }}
                size={"default"}
              />
            </Grid>
            <Grid item xs={3}>
              <DatePicker
                isDisabled={!isEditMode}
                label={t("validityPeriodFrom")}
                value={data?.validityPeriodFrom}
                onChange={(val) => {
                  onChangeData({ validityPeriodFrom: val });
                }}
                size={"default"}
              />
            </Grid>
            <Grid item xs={3}>
              <DatePicker
                isDisabled={!isEditMode}
                label={t("validityPeriodTo")}
                value={data?.validityPeriodTo}
                onChange={(val) => {
                  onChangeData({ validityPeriodTo: val });
                }}
                size={"default"}
              />
            </Grid>
          </StyledGridContainer>
        </StyledDashborderBox>
        <Box display={"flex"} alignItems={"center"}>
          <StyledStatusHeaderText textTransfer={"none"}>
            {t("cemsMeasureInfoGroupTitle")}
          </StyledStatusHeaderText>
        </Box>
        <Box>
          <Box paddingTop={"20px"}>
            <CEMSMeasureOfReasonsField
              editMode={isEditMode}
              originalData={originalData}
              onChange={(values) => {
                onChangeData({
                  measureReasonCatalog: values,
                });
              }}
            />
          </Box>
        </Box>
        <StyledBoxContainer>
          <CEMSanctionRegulation
            regulations={originalData.regulations.sort((a, b) => b.id - a.id)}
            editMode={isEditMode}
            onChangeData={(values) => {
              onChangeData({ regulations: values });
            }}
          />
        </StyledBoxContainer>
        <StyledBoxContainer>
          <CEMSSanctionEmployeeList
            employees={originalData.sanctionedEmployees.sort(
              (a, b) => b.id - a.id
            )}
            editMode={isEditMode}
            onChangeData={(values) => {
              onChangeData({ sanctionedEmployees: values });
            }}
          />
        </StyledBoxContainer>
        <Box>
          <Box display={"flex"} alignItems={"center"} paddingTop={"20px"}>
            <StyledStatusHeaderText>
              {t("cemsactionInfo")}
            </StyledStatusHeaderText>
          </Box>
          <Box paddingTop={"20px"}>
            <StyledSubTitle>{t("initialCourtDecision")}</StyledSubTitle>
            <StyledGridContainer container spacing={2} pt={"15px"}>
              <Grid xs={3} item>
                <DatePicker
                  isDisabled={!isEditMode}
                  label={t("initialCourtAppealDate")}
                  value={data?.initialCourtAppealDate}
                  onChange={(val) => {
                    onChangeData({ initialCourtAppealDate: val });
                  }}
                  size={"default"}
                />
              </Grid>
              <Grid item xs={9}>
                <TextField
                  isDisabled={!isEditMode}
                  label={t("cemscourtDecision")}
                  value={data.initialCourtAppealDecision}
                  onChange={(value) => {
                    onChangeData({ initialCourtAppealDecision: value });
                  }}
                  multiline
                  rows={4}
                  height={120}
                />
              </Grid>
            </StyledGridContainer>
          </Box>
          <Box paddingTop={"20px"}>
            <StyledSubTitle>{t("finalCourtDecision")}</StyledSubTitle>
            <StyledGridContainer container spacing={2} pt={"15px"}>
              <Grid xs={3} item>
                <DatePicker
                  isDisabled={!isEditMode}
                  label={t("initialCourtAppealDate")}
                  value={data.finalCourtAppealDate}
                  onChange={(val) => {
                    onChangeData({ finalCourtAppealDate: val });
                  }}
                  size={"default"}
                />
              </Grid>
              <Grid item xs={9}>
                <TextField
                  isDisabled={!isEditMode}
                  label={t("cemscourtDecision")}
                  value={data.courtDecision}
                  onChange={(value) => {
                    onChangeData({ courtDecision: value });
                  }}
                  multiline
                  rows={4}
                  height={120}
                />
              </Grid>
            </StyledGridContainer>
          </Box>
        </Box>
        <StyledDashborderBox>
          <Grid container>
            <Grid item xs={12}>
              <CEMSStatusListField
                data={data}
                onStatusClick={(status) => {
                  onChangeData({ status: { key: status.key } });
                }}
                isEditMode={isEditMode}
              />
            </Grid>
          </Grid>
        </StyledDashborderBox>
        <StyledBoxContainer sx={{ paddingTop: "20px" }}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <TextField
                isDisabled={!isEditMode}
                label={t("responsiblePersonNames")}
                value={data.responsiblePersonNames}
                size={"default"}
                onChange={(value) => {
                  onChangeData({ responsiblePersonNames: value });
                }}
              />
            </Grid>
            <Grid item xs={9}>
              <TextField
                isDisabled={!isEditMode}
                label={t("note")}
                value={data.note}
                size={"default"}
                onChange={(value) => {
                  onChangeData({ note: value });
                }}
                multiline
                rows={4}
                height={120}
              />
            </Grid>
          </Grid>
        </StyledBoxContainer>
      </Box>
    </>
  );
};

CEMSSanctionDetailsInfo.propTypes = {
  data: PropTypes.object,
  setData: PropTypes.func,
  isEditMode: PropTypes.bool,
  originalData: PropTypes.object,
  updateChild: PropTypes.func,
  onChangeData: PropTypes.func,
};

export default CEMSSanctionDetailsInfo;
