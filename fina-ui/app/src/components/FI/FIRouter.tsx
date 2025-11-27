import { Box } from "@mui/material";
import React, { FC, memo, ReactNode, useCallback, useState } from "react";
import FIContainer from "../../containers/FI/FIContainer";
import { Route, useLocation } from "react-router-dom";
import FIBranchPage from "./Main/Detail/Branch/FIBranchPage";
import FIManagementPage from "./Main/Detail/Management/FIManagementPage";
import FIBeneficiaryPage from "./Main/Detail/Beneficiary/FIBeneficiaryPage";
import FIPhysicalPersonPage from "./Main/Detail/Person/FIPhysicalPersonPage";
import FILegalPersonPage from "./Main/Detail/LegalPerson/FILegalPersonPage";
import FIDetailPage from "./Main/Detail/FIDetailPage";
import FIGeneralPage from "./Main/Detail/GeneralInfo/FIGeneralPage";
import FILicensePage from "./Main/Detail/License/FILicensePage";
import OtherShareContainer from "../../containers/FI/Main/OtherShare/OtherShareContainer";
import FICriminalRecordPage from "./Main/Detail/CriminalRecord/FICriminalRecordPage";
import FIStructureContainer from "../../containers/FI/Main/FIStructure/FIStructureContainer";
import PermittedUserContainer from "../../containers/FI/Main/PermittedUserContainer/PermittedUserContainer";
import { FITabs } from "./fiTabs";
import menuLink from "../../api/ui/menuLink";
import { styled } from "@mui/material/styles";
import { MainMenuItem } from "../../types/mainMenu.type";

const StyledMainLayout = styled(Box)(({ theme }: any) => ({
  ...theme.mainLayout,
}));

interface FIRouterProps {
  menuItem: MainMenuItem;
}

interface PathParams {
  fiId: number;
  tabName: string;
  itemId?: string;
  param4?: string;
}

const FIRouter: FC<FIRouterProps> = ({ menuItem }) => {
  const [fiSeeMore, setFISeeMore] = useState(false);
  const fiPath = menuLink.fi;
  const location = useLocation();

  const getPathParams = (): PathParams | null => {
    const path = menuItem.subLink; // Example path

    if (
      path &&
      /^\/fi\/([^\/]+)\/([^\/]+)(?:\/([^\/]+))?(?:\/([^\/]+))?$/.test(path)
    ) {
      const match = path.match(
        /^\/fi\/([^\/]+)\/([^\/]+)(?:\/([^\/]+))?(?:\/([^\/]+))?$/
      );
      if (match) {
        const [, param1, param2, param3, param4] = match;
        return {
          fiId: Number(param1),
          tabName: param2,
          itemId: param3,
          param4,
        };
      }
    }
    return null;
  };

  const onBreadCrubmNavigationClick = useCallback(() => {
    menuItem.subLink = undefined;
    menuItem.link = fiPath;
  }, []);

  const wrapContent = (
    fiId: number,
    tabName: string,
    CMP: ReactNode
  ): ReactNode => {
    return (
      <FIDetailPage
        fiSeeMore={fiSeeMore}
        setFISeeMore={setFISeeMore}
        tabName={tabName}
        fiId={fiId}
        onBreadCrubmNavigationClick={onBreadCrubmNavigationClick}
      >
        {CMP}
      </FIDetailPage>
    );
  };

  const getComponent = () => {
    if (location.pathname.startsWith(fiPath + "/")) {
      menuItem.subLink = location.pathname;
    } else if (location.pathname.startsWith(fiPath)) {
      menuItem.subLink = undefined;
    }

    if (menuItem.subLink) {
      const params = getPathParams();
      if (!params) {
        return null;
      }
      switch (params.tabName) {
        case FITabs.GENERAL:
          return wrapContent(
            params.fiId,
            params.tabName,
            <FIGeneralPage key={FITabs.GENERAL} />
          );

        case FITabs.LICENSE:
          return wrapContent(
            params.fiId,
            params.tabName,
            <FILicensePage tabName={FITabs.LICENSE} fiId={params.fiId} />
          );

        case FITabs.BRANCH:
          return wrapContent(
            params.fiId,
            params.tabName,
            <FIBranchPage fiId={params.fiId} />
          );

        case FITabs.MANAGEMENT:
          return wrapContent(
            params.fiId,
            params.tabName,
            <FIManagementPage tabName={FITabs.MANAGEMENT} fiId={params.fiId} />
          );

        case FITabs.BENEFICIARY:
          return wrapContent(
            params.fiId,
            params.tabName,
            <FIBeneficiaryPage
              tabName={FITabs.BENEFICIARY}
              fiId={params.fiId}
            />
          );
        case FITabs.PHYSYCALPERSON:
          return wrapContent(
            params.fiId,
            params.tabName,
            <FIPhysicalPersonPage
              tabName={FITabs.PHYSYCALPERSON}
              fiId={params.fiId}
            />
          );

        case FITabs.LEGALPERSON:
          return wrapContent(
            params.fiId,
            params.tabName,
            <FILegalPersonPage
              tabName={FITabs.LEGALPERSON}
              fiId={params.fiId}
            />
          );
        case FITabs.CRIMINALRECORD:
          return wrapContent(
            params.fiId,
            params.tabName,
            <FICriminalRecordPage
              tabName={FITabs.CRIMINALRECORD}
              fiId={params.fiId}
            />
          );

        case FITabs.FISTRUCTURE:
          return wrapContent(
            params.fiId,
            params.tabName,
            <FIStructureContainer fiId={params.fiId} />
          );
        case FITabs.PERMITTEDUSER:
          return wrapContent(
            params.fiId,
            params.tabName,
            <PermittedUserContainer
              fiId={params.fiId}
              clearFiSubLink={onBreadCrubmNavigationClick}
            />
          );

        case FITabs.OTHERSHARE:
          return wrapContent(
            params.fiId,
            params.tabName,
            <OtherShareContainer fiId={params.fiId} />
          );
      }
    }
    return null;
  };

  return (
    <StyledMainLayout>
      <Route path={`/*`}>{getComponent()}</Route>
      <Box width={"100%"} height={"100%"} hidden={location.pathname !== fiPath}>
        <FIContainer />
      </Box>
    </StyledMainLayout>
  );
};

export default memo(FIRouter);
