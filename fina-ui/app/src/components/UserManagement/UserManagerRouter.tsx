import { Box, Typography } from "@mui/material";
import { Route, useLocation } from "react-router-dom";
import UserManagerContainer from "../../containers/UserManager/UserManagerContainer";
import UserManagerGroupsContainer from "../../containers/UserManager/UserManagerGroupsContainer";
import UserManagerGroupsItemContainer from "../../containers/UserManager/UserManagerGroupsItemContainer";
import UserManagerItemContainer from "../../containers/UserManager/UserManagerItemContainer";
import React, { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import menuLink from "../../api/ui/menuLink";
import { styled } from "@mui/system";
import { MainMenuItem } from "../../types/mainMenu.type";
import { Config } from "../../types/config.type";
import { Group } from "../../types/group.type";

interface UserManagerRouterProps {
  config: Config;
  menuItem: MainMenuItem;
}

const StyledMainBox = styled(Box)(({ theme }: any) => ({
  ...theme.mainLayout,
}));

const StyledTitleTypography = styled(Typography)(({ theme }: any) => ({
  ...theme.pageTitle,
}));

const StyledContainerWrapper = styled(Box)(({ hidden }) => ({
  ...(!hidden && {
    display: "flex",
    height: "100%",
    overflow: "hidden",
  }),
}));

const UserManagerRouter: React.FC<UserManagerRouterProps> = ({
  config,
  menuItem,
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [groups, setGroups] = useState<Group[]>([]);

  const userManagerPath = menuLink.userManagement;

  const getBasePathparams = () => {
    const path = menuItem.subLink;
    const regex =
      /^\/usermanager(?:\/([^\/]+))?(?:\/([^\/]+))?(?:\/([^\/]+))?$/;

    const match = path?.match(regex);

    if (match) {
      return {
        page: match[1] || "users",
        userId: match[2],
        tabName: match[2],
      };
    }
    return null;
  };

  const getInnerPathParams = () => {
    const path = menuItem.subLink; // Example path

    if (!path) return;

    if (/^\/usermanager\/([^\/]+)\/([^\/]+)(?:\/([^\/]+))?$/.test(path)) {
      const match = path.match(
        /^\/usermanager\/([^\/]+)\/([^\/]+)(?:\/([^\/]+))?$/
      );
      const param1 = match?.[1];
      const param2 = match?.[2];
      const param3 = match?.[3];

      return { page: param1, entityId: param2, tabName: param3 };
    }
    return null;
  };

  const getComponent = () => {
    if (location.pathname.startsWith(userManagerPath + "/")) {
      menuItem.subLink = location.pathname;
    } else if (location.pathname.startsWith(userManagerPath)) {
      menuItem.subLink = undefined;
    }

    if (menuItem.subLink) {
      const params = getInnerPathParams();
      if (params?.entityId && Number(params?.entityId) >= -1) {
        switch (params.page) {
          case "users":
            return (
              <UserManagerItemContainer
                config={config}
                userId={params.entityId}
                tabName={params.tabName}
              />
            );
          case "groups":
            return (
              <UserManagerGroupsItemContainer
                groupId={params.entityId}
                tabName={params.tabName}
                setGroups={setGroups}
                groups={groups}
              />
            );
        }
      }
    }

    return null;
  };

  const getBaseComponent = () => {
    if (location.pathname.startsWith(userManagerPath)) {
      menuItem.subLink = location.pathname;
    }
    const params = getBasePathparams();

    if (!params) {
      return null;
    }

    const isHiddenGroup = params.page !== `groups`;
    const isHiddenUser = params.page !== `users`;

    return (
      <Box
        display={"flex"}
        flexDirection={"column"}
        width={"100%"}
        height={"100%"}
      >
        <StyledTitleTypography>{t("userManagement")}</StyledTitleTypography>
        <StyledContainerWrapper hidden={isHiddenUser}>
          <UserManagerContainer />
        </StyledContainerWrapper>
        <StyledContainerWrapper hidden={isHiddenGroup}>
          <UserManagerGroupsContainer setGroups={setGroups} groups={groups} />
        </StyledContainerWrapper>
      </Box>
    );
  };

  const isHidden = () => {
    const hidden = !(
      location.pathname === userManagerPath ||
      location.pathname === `${userManagerPath}/users` ||
      location.pathname === `${userManagerPath}/groups`
    );
    return hidden;
  };

  return (
    <StyledMainBox display={"flex"} flexDirection={"column"} height={"100%"}>
      <Route path={`/*`}>{getComponent()}</Route>
      <Box width={"100%"} height={"100%"} hidden={isHidden()}>
        {getBaseComponent()}
      </Box>
    </StyledMainBox>
  );
};

export default memo(UserManagerRouter);
