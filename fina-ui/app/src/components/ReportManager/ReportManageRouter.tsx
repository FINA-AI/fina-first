import { Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import React, { memo, useEffect, useState } from "react";
import ReportManagerContainer from "../../containers/ReportManager/ReportManagerContainer";
import StoredReportManagerContainer from "../../containers/ReportManager/StoredReportManagerContainer";
import ReportScheduleManagerContainer from "../../containers/ReportManager/ReportScheduleManagerContainer";
import { useLocation } from "react-router-dom";
import ReportManagerTabs from "./ReportManagerTabs";
import useConfig from "../../hoc/config/useConfig";
import { PERMISSIONS } from "../../api/permissions";
import { styled } from "@mui/material/styles";

const StyledContentContainer = styled(Grid)(({ theme }) => ({
  backgroundColor: (theme as any).palette.paperBackground,
  borderRadius: "8px",
  height: "100%",
  boxSizing: "border-box",
  paddingBottom: 45,
}));

const StyledTitleContainer = styled(Grid)({
  borderRadius: "8px",
  height: "100%",
  boxSizing: "border-box",
  paddingTop: "8px",
  paddingBottom: "14px",
});

const StyledMainTitleText = styled(Typography)(({ theme }) => ({
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "24px",
  color: (theme as any).palette.textColor,
  display: "inline",
}));

const ReportManageRouter = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { hasPermission } = useConfig();

  const [hasReportManagerRendered, setHasReportManagerRendered] =
    useState(false);
  const [
    hasReportScheduleManagerRendered,
    setHasReportScheduleManagerRendered,
  ] = useState(false);
  const [hasStoredReportManagerRendered, setHasStoredReportManagerRendered] =
    useState(false);

  useEffect(() => {
    if (location.pathname === "/reports") {
      setHasReportManagerRendered(true);
    }
    if (location.pathname === "/reports/reportingschedulemanager") {
      setHasReportScheduleManagerRendered(true);
    }
    if (location.pathname === "/reports/storedreportmanager") {
      setHasStoredReportManagerRendered(true);
    }
  }, [location.pathname]);

  return (
    <Box
      sx={(theme) => ({
        ...(theme as any).mainLayout,
      })}
    >
      <Grid
        container
        spacing={0}
        overflow={"hidden"}
        height={"100%"}
        borderRadius={"4px"}
      >
        <Grid item xs={12}>
          <StyledTitleContainer item xs={12}>
            <StyledMainTitleText>{t("reporting")}</StyledMainTitleText>
          </StyledTitleContainer>
        </Grid>
        <StyledContentContainer item xs={12}>
          <Box sx={{ position: "absolute", marginLeft: "24px", zIndex: 1 }}>
            <ReportManagerTabs />
          </Box>
          <div
            style={{
              display: location.pathname === "/reports" ? "block" : "none",
              height: "100%",
            }}
          >
            {hasReportManagerRendered && <ReportManagerContainer />}
          </div>
          <div
            style={{
              height: "100%",
              display:
                location.pathname === "/reports/reportingschedulemanager"
                  ? "block"
                  : "none",
            }}
          >
            {hasPermission(PERMISSIONS.FINA_REPORT_SCHEDULE_MANAGER_REVIEW) &&
              hasReportScheduleManagerRendered && (
                <ReportScheduleManagerContainer />
              )}
          </div>
          <div
            style={{
              height: "100%",
              display:
                location.pathname === "/reports/storedreportmanager"
                  ? "block"
                  : "none",
            }}
          >
            {hasPermission(PERMISSIONS.FINA_STORED_REPORT_VIEW) &&
              hasStoredReportManagerRendered && (
                <StoredReportManagerContainer />
              )}
          </div>
        </StyledContentContainer>
      </Grid>
    </Box>
  );
};

export default memo(ReportManageRouter);
