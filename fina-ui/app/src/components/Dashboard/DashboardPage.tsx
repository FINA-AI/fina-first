import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import DashboardContainer from "../../containers/Dashboard/DashboardContainer";
import DashboardItemContainer from "../../containers/Dashboard/DashboardItemContainer";
import React, { memo, useEffect, useRef } from "react";
import { MenuItem } from "../../types/menu.type";
import { DashletType } from "../../types/dashboard.type";

interface DashboardPageProps {
  menuItem: MenuItem;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ menuItem }) => {
  const location = useLocation();
  const dashboardPath = "/dashboard";

  const dashboardContainerRef = useRef<any>(null);

  useEffect(() => {
    const paths = location?.pathname;
    if (paths?.includes("/dashboard/dashletlist")) {
      if (menuItem) {
        menuItem.subLink = "/dashboard/dashletlist";
      }
    } else if (paths === dashboardPath) {
      if (menuItem) {
        menuItem.subLink = null;
      }
    }
  }, [location, menuItem]);

  const onDashletEdit = (data: DashletType) => {
    if (
      dashboardContainerRef.current &&
      dashboardContainerRef.current.HandleUpdateDashboardDashlet
    ) {
      dashboardContainerRef.current.HandleUpdateDashboardDashlet(data);
    }
  };

  return (
    <>
      <Box
        width={"100%"}
        height={"100%"}
        hidden={location.pathname !== "/dashboard/dashletlist"}
      >
        <DashboardItemContainer onDashletEdit={onDashletEdit} />
      </Box>
      <Box
        width={"100%"}
        height={"100%"}
        hidden={location.pathname !== dashboardPath}
      >
        <DashboardContainer ref={dashboardContainerRef} />
      </Box>
    </>
  );
};

export default memo(DashboardPage);
