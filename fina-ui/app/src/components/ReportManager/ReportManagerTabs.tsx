import { Tab } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import React from "react";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/system";
import { Link, useLocation } from "react-router-dom";
import { PERMISSIONS } from "../../api/permissions";
import useConfig from "../../hoc/config/useConfig";
import { styled } from "@mui/material/styles";

const StyledTabsBox = styled(Box)(({ theme }) => ({
  "& .MuiButtonBase-root": {
    fontWeight: 600,
    fontSize: 14,
    lineHeight: "21px",
    textTransform: "capitalize",
    color: theme.palette.mode === "dark" ? "#FFFFFF" : "#2C3644",
    opacity: "0.8",
    background: "inherit",
  },
  "& .Mui-selected": {
    opacity: "1",
    color: theme.palette.primary.main,
  },
}));

const ReportManagerTabs = () => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();
  const location = useLocation();
  const paths = location?.pathname.split("/");

  return (
    <StyledTabsBox>
      <Tabs value={paths[paths.length - 1]} data-testid={"report-manager-tabs"}>
        <Tab
          label={t("reportingManager")}
          value={"reports"}
          component={Link}
          to={"/reports"}
          data-testid="report-manager"
        />
        {hasPermission(PERMISSIONS.FINA_REPORT_SCHEDULE_MANAGER_REVIEW) && (
          <Tab
            label={t("reportingScheduleManager")}
            value={"reportingschedulemanager"}
            component={Link}
            to={"/reports/reportingschedulemanager"}
            data-testid="report-schedule-manager"
          />
        )}
        {hasPermission(PERMISSIONS.FINA_STORED_REPORT_VIEW) && (
          <Tab
            label={t("storedReportManager")}
            value={"storedreportmanager"}
            component={Link}
            to={"/reports/storedreportmanager"}
            data-testid="stored-report-manager"
          />
        )}
      </Tabs>
    </StyledTabsBox>
  );
};

export default ReportManagerTabs;
