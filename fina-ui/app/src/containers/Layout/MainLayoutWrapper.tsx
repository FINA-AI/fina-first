import React, { ReactElement, useEffect, useMemo, useState } from "react";
import dummy from "../../api/dummy/dummyContents";
import LeftSidebarLayout from "./LeftSidebar";
import { Box } from "@mui/material";
import { useHistory } from "react-router-dom";
import { getCommunicatorMenus, getMenus } from "../../api/ui/menu";
import ChangePasswordModal from "../../components/Sidebar/ChangePasswordModal";
import { StyledMainLayout } from "./mainLayoutStyles-jss";
import { MainMenuItem } from "../../types/mainMenu.type";
import { Config } from "../../types/config.type";

interface MainLayoutWrapperProps {
  children?: ReactElement;
  config: Config;
  isConfigLoading: boolean;
  configLoadingError: boolean;
  hideMenu: boolean;
}

function MainLayoutWrapper(props: MainLayoutWrapperProps) {
  const { children, config, isConfigLoading, configLoadingError, hideMenu } =
    props;
  const [menu, setMenu] = useState<MainMenuItem[]>([]);
  useEffect(() => {
    const menu: MainMenuItem[] = [
      ...getMenus(config.menu),
      ...getCommunicatorMenus(config),
    ];
    setMenu(menu);
  }, [config]);

  const history = useHistory();

  const profile = useMemo(
    () => ({
      avatar: dummy.user.avatar,
      name: config?.userNameDescriptions,
    }),
    [config.userNameDescriptions]
  );

  useEffect(() => {
    // Execute all arguments when page changes
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0);
    });

    return () => {
      unlisten();
    };
  }, [history]);

  const getInitialComponent = () => {
    if (isConfigLoading) {
      return (
        <div
          style={{
            height: "100vh",
          }}
        >
          <Box flex={1}>
            <img
              src={process.env.PUBLIC_URL + "/images/spinner.gif"}
              alt="spinner"
              style={{
                position: "fixed",
                top: "calc(50% - 100px)",
                left: "calc(50% - 100px)",
              }}
            />
          </Box>
        </div>
      );
    }
    //error page
    if (configLoadingError) {
      return <div>Error TODO</div>;
    }

    //change password window
    if (config && config.changePassword) {
      return (
        <ChangePasswordModal
          closable={true}
          showPasswordModal={true}
          setShowPasswordModal={() => {}}
          onAfterPasswordChange={() => {
            window.location.reload();
          }}
        />
      );
    }

    if (hideMenu) {
      return <>{children}</>;
    }

    //return main layout
    return (
      <StyledMainLayout>
        <LeftSidebarLayout
          dataMenu={menu}
          userAttr={profile}
          config={config}
        ></LeftSidebarLayout>
      </StyledMainLayout>
    );
  };

  return getInitialComponent();
}

export default MainLayoutWrapper;
