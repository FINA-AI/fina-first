import { Box, Tab, Tabs, tabsClasses } from "@mui/material";
import { DashboardType } from "../../types/dashboard.type";
import React, { SetStateAction } from "react";
import Tooltip from "../common/Tooltip/Tooltip";

interface DashboardTabPanelProps {
  dashboards: DashboardType[];
  onSelectDashboard: (dashboard: DashboardType) => void;
  activeTab: number;
  setActiveTab: React.Dispatch<SetStateAction<number>>;
}

const DashboardTabPanel: React.FC<DashboardTabPanelProps> = ({
  dashboards,
  onSelectDashboard,
  activeTab,
  setActiveTab,
}) => {
  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setActiveTab(Number(newValue));
  };

  return (
    <Box sx={{ minWidth: 200 }}>
      <Tabs
        value={activeTab}
        onChange={handleChange}
        variant="scrollable"
        allowScrollButtonsMobile
        sx={{
          [`& .${tabsClasses.scrollButtons}`]: {
            "&.Mui-disabled": { opacity: 0.3 },
          },
          "& .MuiTab-root": {
            backgroundColor: "inherit",
          },
        }}
        data-testid={"dashboard-tab-panel"}
      >
        {dashboards.map((dashboard, index) => (
          <Tooltip key={index} title={dashboard.code} arrow>
            <Tab
              label={dashboard.name}
              onClick={() => onSelectDashboard(dashboard)}
              sx={{ minWidth: 65 }}
              data-testid={"tab-" + index}
            />
          </Tooltip>
        ))}
      </Tabs>
    </Box>
  );
};

export default DashboardTabPanel;
