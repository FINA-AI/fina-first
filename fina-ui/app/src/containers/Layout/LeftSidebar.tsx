import React, {
  Fragment,
  Suspense,
  useCallback,
  useEffect,
  useState,
} from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Box } from "@mui/material";
import { connect } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import { setOpenSidebar } from "../../redux/actions/sidebarActions";
import { Route, Switch, useLocation } from "react-router-dom";
import menuLink from "../../api/ui/menuLink";
import DashboardPage from "../../components/Dashboard/DashboardPage";
import TabManagerMain from "./TabManagerMain";
import { StyledMain } from "../../components/Sidebar/sidebar-jss";
import { dashboardMenuitem } from "../../api/ui/menu";
import { MainMenuItem, MainTabItem } from "../../types/mainMenu.type";
import { Config } from "../../types/config.type";

interface LeftSidebarLayoutProps {
  config: Config;
  dataMenu: MainMenuItem[];
  userAttr: { avatar: string; name: Record<string, string> };
  openLocked: boolean;
  setOpenLocked: (open: boolean) => void;
}

function LeftSidebarLayout(props: LeftSidebarLayoutProps) {
  const { userAttr, config, dataMenu, openLocked, setOpenLocked } = props;
  const location = useLocation();

  useEffect(() => {
    if (!location.pathname.startsWith(menuLink.dashboard)) {
      const item = dataMenu.find((dm) => location.pathname.startsWith(dm.link));
      if (item) {
        setTabs([
          ...tabs,
          { path: item.link, component: item.component, item: item },
        ]);
      }
    }
  }, [dataMenu]);

  const [tabs, setTabs] = useState<Partial<MainTabItem>[]>([
    {
      path: "/dashboard",
      component: DashboardPage,
      key: "dashboard",
      item: dashboardMenuitem,
    },
  ]);

  const onMenuClick = useCallback(
    (item: MainMenuItem) => {
      setTabs((prevState) => {
        if (!prevState.find((t) => t.path === item.link)) {
          return [
            ...prevState,
            { path: item.link, component: item.component, item: item },
          ];
        } else {
          return [...prevState];
        }
      });
    },
    [tabs]
  );

  const ConnectedCompanies = React.lazy(
    () =>
      import("../../containers/ConnectedCompanies/ConnectedCompaniesContainer")
  );

  return (
    <Fragment>
      <Sidebar
        dataMenu={dataMenu}
        userAttr={userAttr}
        config={config}
        openLocked={openLocked}
        setOpenLocked={setOpenLocked}
        onMenuClick={onMenuClick}
      />
      <StyledMain _openLocked={openLocked} id="mainContent">
        <Suspense
          fallback={
            <div
              style={{
                height: "100vh",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box flex={1} justifyContent={"center"} display={"flex"}>
                <img
                  src={process.env.PUBLIC_URL + "/images/spinner.gif"}
                  alt="spinner"
                />
              </Box>
            </div>
          }
        >
          <section
            style={{
              height: "100%",
            }}
          >
            {/*{openedMenu.map((tab) => {*/}
            {/*  return (*/}
            {/*    <div*/}
            {/*      id={tab.key}*/}
            {/*      style={{*/}
            {/*        height: "100%",*/}
            {/*        display: tab.isActive ? "block" : "none",*/}
            {/*      }}*/}
            {/*    >*/}
            {/*      <tab.component />*/}
            {/*    </div>*/}
            {/*  );*/}
            {/*})}*/}

            {/*<Fade in={true} {...{ timeout: 0 }}>*/}
            {/*</Fade>*/}
            <Switch>
              <Route
                path={menuLink.connectedCompanies}
                render={() => <ConnectedCompanies />}
              />
              <Route
                path={`/*`}
                render={() => {
                  return (
                    <TabManagerMain
                      tabs={tabs}
                      setTabs={setTabs}
                      dataMenu={dataMenu}
                      config={config}
                    />
                  );
                }}
              />
            </Switch>

            {/*</Route>*/}
          </section>
        </Suspense>
      </StyledMain>
    </Fragment>
  );
}

const mapStateToProps = (state: any) => ({
  openLocked: state.getIn(["openSidebar", "isOpen"]),
});

const mapDispatchToProps = (dispatch: any) => ({
  setOpenLocked: bindActionCreators(setOpenSidebar, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(LeftSidebarLayout);
