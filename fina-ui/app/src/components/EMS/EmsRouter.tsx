import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import React from "react";
import EmsProfileContainer from "../../containers/Ems/EmsProfile/EmsProfileContainer";
import EmsInspectionTypeContainer from "../../containers/Ems/EmsInspectionTypeContainer";
import EmsSanctionTypeContainer from "../../containers/Ems/EmsSanctionTypeContainer";
import EmsFineTypeContainer from "../../containers/Ems/EmsFineTypeContainer";
import EmsInspectionColumnContainer from "../../containers/Ems/EmsInspectionColumnContainer";
import EmsRecommendationContainer from "../../containers/Ems/EmsRecommendationContainer";
import EmsMainLayoutWrapper from "./EmsLayout/EmsMainLayoutWrapper";
import EmsFIleConfigLayoutWrapper from "./EmsFileConfiguration/EmsFIleConfigLayoutWrapper";
import EmsFollowUpPage from "./EmsFollowUp/EmsFollowUpPage";
import EmsFileImportContainer from "../../containers/Ems/EmsFileImportContainer";
import useConfig from "../../hoc/config/useConfig";
import { PERMISSIONS } from "../../api/permissions";

const EMS_BASE_PATH = "ems";
const PROFILE_ROUTE = "profile";
const INSPECTION_TYPE_ROUTE = "inspectionType";
const SANCTION_TYPE_ROUTE = "sanctionandrecommendation";
const FINE_TYPE_ROUTE = "fine";
const INSPECTION_COLUMNS_ROUTE = "inspectionColumn";
const RECOMMENDATION_ROUTE = "recommendations";
const FILE_CONFIG_ROUTE = "fileConfig";
const FILE_IMPORT_ROUTE = "importFile";
const FOLLOWUP_ROUTE = "followup";

const EmsRouter = () => {
  const { hasPermission } = useConfig();
  let path = "/ems";
  const location = useLocation();

  const getAllowedRoute = (permission: string, routePath: string) => {
    return hasPermission(permission) ? `${path}/${routePath}` : "/";
  };

  return (
    <EmsMainLayoutWrapper>
      <Switch>
        <Route
          path={`${path}/${PROFILE_ROUTE}`}
          component={EmsProfileContainer}
          exact
        />
        <Route
          path={getAllowedRoute(
            PERMISSIONS.EMS_INSPECTION_TYPE_REVIEW,
            INSPECTION_TYPE_ROUTE
          )}
          component={EmsInspectionTypeContainer}
          exact
        />
        <Route
          path={getAllowedRoute(
            PERMISSIONS.EMS_SANCTION_AND_RECOMMENDATION_REVIEW,
            SANCTION_TYPE_ROUTE
          )}
          component={EmsSanctionTypeContainer}
          exact
        />
        <Route
          path={getAllowedRoute(
            PERMISSIONS.EMS_FINE_TYPES_REVIEW,
            FINE_TYPE_ROUTE
          )}
          component={EmsFineTypeContainer}
          exact
        />
        <Route
          path={getAllowedRoute(
            PERMISSIONS.EMS_INSPECTION_COLUMNS_REVIEW,
            INSPECTION_COLUMNS_ROUTE
          )}
          component={EmsInspectionColumnContainer}
          exact
        />
        <Route
          path={getAllowedRoute(
            PERMISSIONS.EMS_RECOMMENDATION_REVIEW,
            RECOMMENDATION_ROUTE
          )}
          component={EmsRecommendationContainer}
          exact
        />
        <Route
          path={getAllowedRoute(
            PERMISSIONS.EMS_FILE_CONFIGURATION_REVIEW,
            FILE_CONFIG_ROUTE
          )}
          component={EmsFIleConfigLayoutWrapper}
          exact
        />
        <Route
          path={getAllowedRoute(
            PERMISSIONS.EMS_IMPORT_FILE_REVIEW,
            FILE_IMPORT_ROUTE
          )}
          component={EmsFileImportContainer}
          exact
        />
        <Route
          path={getAllowedRoute(
            PERMISSIONS.EMS_FOLLOWUP_REVIEW,
            FOLLOWUP_ROUTE
          )}
          component={EmsFollowUpPage}
          exact
        />
        {location.pathname === path && (
          <Redirect to={`/${EMS_BASE_PATH}/${PROFILE_ROUTE}`} />
        )}
      </Switch>
    </EmsMainLayoutWrapper>
  );
};

export default EmsRouter;
