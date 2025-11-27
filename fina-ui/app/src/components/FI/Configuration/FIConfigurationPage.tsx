import FIConfigurationPageHeader from "./FIConfigurationPageHeader";
import { FiConfigurationTabs } from "../fiTabs";
import { Box, Paper } from "@mui/material";
import FiBreadcrumb from "../Common/FiBreadcrumb";
import { useHistory } from "react-router-dom";
import menuLink from "../../../api/ui/menuLink";
import { memo, ReactNode, useCallback, useMemo } from "react";

type FIConfigurationPageProps = {
  tabName?: string;
  children: ReactNode;
  onBreadCrubmNavigationClick?: () => void;
  entityId?: string;
};

const FIConfigurationPage = ({
  tabName = FiConfigurationTabs.FITYPE,
  children,
  onBreadCrubmNavigationClick,
}: FIConfigurationPageProps) => {
  const history = useHistory();
  const onTabClickFunction = useCallback((element: string) => {
    history.push(`${menuLink.configuration}/${element}`);
  }, []);

  const tabs = useMemo(() => Object.values(FiConfigurationTabs), []);

  return (
    <Box display={"flex"} flex={1} flexDirection={"column"} height={"100%"}>
      <Box>
        <FiBreadcrumb
          name={"configuration"}
          tabName={""}
          mainPageName={"configuration"}
          onBreadCrubmNavigationClick={onBreadCrubmNavigationClick}
        />
        <FIConfigurationPageHeader
          FIConfigurationTabsArray={tabs}
          tabName={tabName}
          onTabClickFunction={onTabClickFunction}
        />
      </Box>
      <Box
        display={"flex"}
        flex={1}
        height={"100%"}
        mt={"20px"}
        style={{
          overflow: "hidden",
          borderRadius: "2px",
        }}
      >
        <Paper
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          {children}
        </Paper>
      </Box>
    </Box>
  );
};

export default memo(FIConfigurationPage);
