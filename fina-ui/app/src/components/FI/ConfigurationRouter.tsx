import { Box } from "@mui/material";
import React, { memo, ReactNode, useCallback } from "react";
import { useLocation } from "react-router-dom";
import menuLink from "../../api/ui/menuLink";
import { FiConfigurationTabs } from "./fiTabs";
import FIConfigurationPage from "./Configuration/FIConfigurationPage";
import FIBranchConfigurationContainer from "../../containers/FI/Configuration/Branch/FIBranchConfigurationContainer";
import FIPersonConfigurationPage from "./Configuration/Person/FIPersonConfigurationPage";
import FILegalPersonConfigurationPage from "./Configuration/LegalPerson/FILegalPersonConfigurationPage";
import ConfigLicensePage from "./Configuration/License/ConfigLicensePage";
import RegionalStructureContainer from "../../containers/FI/Configuration/RegionalStructure/RegionalStructureContainer";
import FITypeConfigContainer from "../../containers/FI/Configuration/FiType/FITypeConfigContainer";
import FIStructureConfigurationContainer from "../../containers/FI/Configuration/FiStructure/FIStructureConfigurationContainer";
import FIManagementConfigurationContainer from "../../containers/FI/Configuration/Management/FIManagementConfigurationContainer";
import { styled } from "@mui/material/styles";
import { MainMenuItem } from "../../types/mainMenu.type";

const StyledMainLayout = styled(Box)(({ theme }: any) => ({
  ...theme.mainLayout,
}));

interface ConfigurationRouterProps {
  menuItem: MainMenuItem;
}

interface PathParams {
  tabName: string;
  entityId?: string;
  fiId?: string;
}

const ConfigurationRouter: React.FC<ConfigurationRouterProps> = ({
  menuItem,
}) => {
  const configurationPath = menuLink.configuration;
  const location = useLocation();

  const getPathParams = (): PathParams | null => {
    const path = menuItem.subLink;

    const regex = /^\/configuration\/([^\/]+)(?:\/([^\/]+))?$/;
    const match = path?.match(regex);

    if (match) {
      return {
        tabName: match[1],
        entityId: match[2],
        fiId: match[2], // optional: some cases expect fiId
      };
    }
    return null;
  };

  const onBreadCrubmNavigationClick = useCallback((): void => {
    menuItem.subLink = undefined;
    menuItem.link = configurationPath;
  }, []);

  const wrapContent = (
    CMP: ReactNode,
    tabName: string,
    entityId?: string
  ): JSX.Element => {
    return (
      <FIConfigurationPage
        tabName={tabName}
        entityId={entityId}
        onBreadCrubmNavigationClick={onBreadCrubmNavigationClick}
      >
        {CMP}
      </FIConfigurationPage>
    );
  };

  const getComponent = (): JSX.Element | null => {
    if (location.pathname.startsWith(configurationPath + "/")) {
      menuItem.subLink = location.pathname;
    }

    if (menuItem.subLink) {
      const params = getPathParams();
      if (!params) {
        return null;
      }
      switch (params.tabName.toLowerCase()) {
        case FiConfigurationTabs.FITYPE:
          return wrapContent(
            <FITypeConfigContainer />,
            params.tabName,
            params.entityId
          );
        case FiConfigurationTabs.BRANCH:
          return wrapContent(
            <FIBranchConfigurationContainer />,
            params.tabName,
            params.entityId
          );

        case FiConfigurationTabs.PHYSYCALPERSON:
          return wrapContent(
            <FIPersonConfigurationPage
              tabName={FiConfigurationTabs.PHYSYCALPERSON}
            />,
            params.tabName,
            params.entityId
          );

        case FiConfigurationTabs.LEGALPERSON:
          return wrapContent(
            <FILegalPersonConfigurationPage
              tabName={FiConfigurationTabs.LEGALPERSON}
            />,
            params.tabName,
            params.entityId
          );

        case FiConfigurationTabs.MANAGEMENT:
          return wrapContent(
            <FIManagementConfigurationContainer />,
            params.tabName,
            params.entityId
          );
        case FiConfigurationTabs.LICENSE:
          return wrapContent(
            <ConfigLicensePage />,
            params.tabName,
            params.entityId
          );
        case FiConfigurationTabs.REGIONALSTRUCTURE:
          return wrapContent(
            <RegionalStructureContainer />,
            params.tabName,
            params.entityId
          );
        case FiConfigurationTabs.FISTRUCTURE:
          return wrapContent(
            <FIStructureConfigurationContainer />,
            params.tabName,
            params.entityId
          );
      }
    }
    return wrapContent(<FITypeConfigContainer />, FiConfigurationTabs.FITYPE);
  };

  return <StyledMainLayout>{getComponent()}</StyledMainLayout>;
};

export default memo(ConfigurationRouter);
