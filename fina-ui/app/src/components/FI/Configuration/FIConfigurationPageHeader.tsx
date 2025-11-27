import { Box } from "@mui/material";
import TabNavigation from "../../common/Navigation/TabNavigation";
import React, { memo } from "react";

type FIConfigurationPageHeaderProps = {
  FIConfigurationTabsArray: string[];
  tabName: string;
  onTabClickFunction: (tabName: string) => void;
};

const FIConfigurationPageHeader: React.FC<FIConfigurationPageHeaderProps> = ({
  FIConfigurationTabsArray,
  tabName,
  onTabClickFunction,
}) => {
  return (
    <>
      <Box mt={"20px"}>
        <TabNavigation
          tabs={FIConfigurationTabsArray}
          activeTabName={tabName}
          onTabClickFunction={onTabClickFunction}
          scrollButtonsShow={true}
        />
      </Box>
    </>
  );
};

export default memo(FIConfigurationPageHeader);
