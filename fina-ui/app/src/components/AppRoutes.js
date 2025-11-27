import React, { Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import menuLink from "../api/ui/menuLink";
import DashboardPage from "./Dashboard/DashboardPage";
import PeriodTypesContainer from "../containers/PeriodType/PeriodTypesContainer";
import SettingsContainer from "../containers/Settings/SettingsContainer";
import ConfigurationRouter from "./FI/ConfigurationRouter";
import CatalogMainContainer from "./Catalog/CatalogMainContainer";
import ActiveUsersContainer from "../containers/Activeusers/ActiveUsersContainer";
import ReturnDefinitionsContainer from "../containers/ReturnDefinitions/ReturnDefinitionsContainer";
import ToolsContainer from "../containers/Tools/ToolsContainer";
import CalendarContainer from "../containers/Calendar/CalendarContainer";
import SurveyContainer from "../containers/SurveyContainer";
import ReportManageRouter from "./ReportManager/ReportManageRouter";
import MessagesRouter from "./Messages/MessagesRouter";
import CEMSRouter from "./CEMS/CEMSRouter";
import PropTypes from "prop-types";
import { getMenus } from "../api/ui/menu";
import { Box } from "@mui/material";
import EmsRouter from "./EMS/EmsRouter";
import ImportManagerPage from "./ImportManager/ImportManagerPage";
import ReturnManagerTabPanel from "./ReturnManager/ReturnManagerTabPanel";
import Iframe from "./Iframe";
import MatrixRouter from "./Matrix/MatrixRouter";

const AppRoutes = ({ config }) => {
  const renderMenuItem = (menuLink, component) => {
    const permittedMenus = config.menu;
    const menuItem = getMenus(permittedMenus).find(
      (mi) => mi.link === menuLink
    );

    const hasPermission =
      menuItem?.permissions.length === 0 ||
      config.permissions.some((cs) => menuItem.permissions.includes(cs));

    if (menuItem.iframeSrc && menuItem.iframeSrc.trim().length > 0) {
      return (
        <Iframe
          src={`${window.location.origin}/fina-app/${menuItem.iframeSrc}`}
          title={menuItem.key}
          key={menuItem.link}
        />
      );
    }
    return hasPermission ? component : <>No Permission</>;
  };

  const FI = React.lazy(() => import("./FI/FIRouter"));
  const UserManager = React.lazy(() =>
    import("./UserManagement/UserManagerRouter")
  );
  const Notification = React.lazy(() =>
    import("../containers/Notifications/NotificationsContainer")
  );
  const MDT = React.lazy(() => import("../containers/MDT/MDTContainer"));
  const ConnectedCompanies = React.lazy(() =>
    import("../containers/ConnectedCompanies/ConnectedCompaniesContainer")
  );
  const Schedules = React.lazy(() =>
    import("../containers/Schedules/SchedulesContainer")
  );
  const ComparisonRules = React.lazy(() =>
    import("../containers/ComparisonsRules/ComparisonsRulesContainer")
  );
  const PeriodDefinitions = React.lazy(() =>
    import("./PeriodDefinition/PeriodDefinitionPage")
  );
  const ReturnCreationSchedule = React.lazy(() =>
    import("./ReturnCreationSchedule/ReturnCreationScheduleRouter")
  );

  const LegislativeDocument = React.lazy(() =>
    import("../containers/LegislativeDocument/LegislativeDocumentContainer")
  );
  const UserFileSpace = React.lazy(() =>
    import("./UserFileSpace/UserFileSpacePage")
  );
  const FAQ = React.lazy(() => import("../containers/FAQ/FAQContainer"));
  const Bundles = React.lazy(() =>
    import("../containers/Bundles/BundlesContainer")
  );
  const About = React.lazy(() => import("../containers/About/AboutContainer"));
  return (
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
      <Switch>
        <Route path={menuLink.dashboard} render={() => <DashboardPage />} />
        <Route
          path={menuLink.catalog}
          render={() =>
            renderMenuItem(
              menuLink.catalog,
              <CatalogMainContainer config={config} />
            )
          }
        />
        <Route
          path={menuLink.survey}
          render={() => renderMenuItem(menuLink.survey, <SurveyContainer />)}
        />
        <Route
          path={menuLink.activeUsers}
          render={() =>
            renderMenuItem(menuLink.activeUsers, <ActiveUsersContainer />)
          }
        />
        <Route
          path={menuLink.fi}
          render={() => renderMenuItem(menuLink.fi, <FI config={config} />)}
        />
        <Route
          path={menuLink.configuration}
          render={() =>
            renderMenuItem(
              menuLink.configuration,
              <ConfigurationRouter config={config} />
            )
          }
        />
        <Route
          path={menuLink.calendar}
          render={() =>
            renderMenuItem(menuLink.calendar, <CalendarContainer />)
          }
        />
        <Route
          path={menuLink.userManagement}
          render={() =>
            renderMenuItem(
              menuLink.userManagement,
              <UserManager config={config} />
            )
          }
        />
        <Route path={menuLink.messages} render={() => <MessagesRouter />} />
        <Route
          path={menuLink.settings}
          render={() =>
            renderMenuItem(menuLink.settings, <SettingsContainer />)
          }
        />
        <Route path={menuLink.notification} render={() => <Notification />} />
        <Route
          path={menuLink.mdt}
          render={() => renderMenuItem(menuLink.mdt, <MDT />)}
        />
        <Route
          path={menuLink.returnManager}
          render={() =>
            renderMenuItem(
              menuLink.returnManager,
              <ReturnManagerTabPanel config={config} />
            )
          }
        />
        <Route
          path={menuLink.returndefinitions}
          render={() =>
            renderMenuItem(
              menuLink.returndefinitions,
              <ReturnDefinitionsContainer />
            )
          }
        />
        <Route
          path={menuLink.connectedCompanies}
          render={() => <ConnectedCompanies />}
        />
        <Route
          path={menuLink.schedules}
          render={() => renderMenuItem(menuLink.schedules, <Schedules />)}
        />
        <Route
          path={menuLink.comparisons}
          render={() =>
            renderMenuItem(menuLink.comparisons, <ComparisonRules />)
          }
        />
        <Route
          path={menuLink.perioddefinitions}
          render={() =>
            renderMenuItem(menuLink.perioddefinitions, <PeriodDefinitions />)
          }
        />
        <Route
          path={menuLink.periodtypes}
          render={() => <PeriodTypesContainer />}
        />
        <Route
          path={menuLink.ems}
          render={() => {
            return renderMenuItem(menuLink.ems, <EmsRouter />);
          }}
        />
        <Route
          path={menuLink.cems}
          render={() => renderMenuItem(menuLink.cems, <CEMSRouter />)}
        />
        <Route
          path={menuLink.importmanager}
          render={() =>
            renderMenuItem(menuLink.importmanager, <ImportManagerPage />)
          }
        />
        <Route
          path={menuLink.reports}
          render={() =>
            renderMenuItem(menuLink.reports, <ReportManageRouter />)
          }
        />
        <Route
          path={menuLink.returncreationschedule}
          render={() =>
            renderMenuItem(
              menuLink.returncreationschedule,
              <ReturnCreationSchedule />
            )
          }
        />
        <Route
          path={menuLink.tools}
          render={() => renderMenuItem(menuLink.tools, <ToolsContainer />)}
        />
        <Route
          path={menuLink.legislativeDocument}
          render={() =>
            renderMenuItem(
              menuLink.legislativeDocument,
              <LegislativeDocument />
            )
          }
        />
        <Route
          path={menuLink.userFileSpace}
          render={() =>
            renderMenuItem(menuLink.userFileSpace, <UserFileSpace />)
          }
        />
        <Route
          path={menuLink.faq}
          render={() => renderMenuItem(menuLink.faq, <FAQ />)}
        />
        <Route
          path={menuLink.matrix}
          render={() => renderMenuItem(menuLink.bundles, <MatrixRouter />)}
        />
        <Route
          path={menuLink.bundles}
          render={() => renderMenuItem(menuLink.bundles, <Bundles />)}
        />
        <Route
          path={menuLink.first}
          render={() => renderMenuItem(menuLink.first)}
        />
        <Route
          path={menuLink.firstDashboard}
          render={() => renderMenuItem(menuLink.firstDashboard)}
        />
        <Route
          path={menuLink.documentManagement}
          render={() => renderMenuItem(menuLink.documentManagement)}
        />
        <Route path={menuLink.about} render={() => <About />} />
        <Redirect to={menuLink.dashboard} />
      </Switch>
    </Suspense>
  );
};

AppRoutes.propTypes = {
  config: PropTypes.object,
};
export default AppRoutes;
