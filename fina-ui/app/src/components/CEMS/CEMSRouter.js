import { Box } from "@mui/material";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import CEMSInspectionContainer from "../../containers/CEMS/CEMSInspectionContainer";
import CEMSRecommendationsContainer from "../../containers/CEMS/CEMSRecommendationsContainer";
import CEMSBreadcrumb from "./CEMSBreadcrumb";
import React from "react";
import CEMSInspectionDetailsContainer from "../../containers/CEMS/CEMSInspectionDetailsContainer";
import CEMSRecommendationsDetailContainer from "../../containers/CEMS/CEMSRecommendationsDetailContainer";
import CEMSSanctionContainer from "../../containers/CEMS/CEMSSanctionContainer";
import CEMSSanctionDetailContainer from "../../containers/CEMS/CEMSSanctionDetailContainer";
import menuLink from "../../api/ui/menuLink";
import { styled } from "@mui/material/styles";

const StyleMainLayout = styled(Box)(({ theme }) => ({
  padding: "16px",
  backgroundColor: theme.bodyBackgroundColor,
  height: "100%",
  boxSizing: "border-box",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
}));

const StyleInnerLayout = styled(Box)(({ theme }) => ({
  backgroundColor: theme.bodyBackgroundColor,
  height: "100%",
  boxSizing: "border-box",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
}));

export const CEMS_BASE_PATH = "cems";
const CEMSRouter = () => {
  let path = "/cems";
  const location = useLocation();

  const INSPECTION_ROUTE = "inspection";
  const RECOMMENDATION_ROUTE = "recommendation";
  const SANCTION_ROUTE = "sanction";
  return (
    <StyleMainLayout>
      <Switch>
        <Route
          path={`${path}/${INSPECTION_ROUTE}`}
          component={CEMSInspectionContainer}
          exact
        />
        <Route path={`${path}/${INSPECTION_ROUTE}/:inspectionId`}>
          <StyleInnerLayout>
            <CEMSBreadcrumb />
            <Route
              path={`${path}/${INSPECTION_ROUTE}/:inspectionId`}
              component={CEMSInspectionDetailsContainer}
              exact
            />
            <Route
              path={`${path}/${INSPECTION_ROUTE}/:inspectionId/${RECOMMENDATION_ROUTE}`}
              component={CEMSRecommendationsContainer}
              exact
            />
            <Route
              path={`${path}/${INSPECTION_ROUTE}/:inspectionId/${SANCTION_ROUTE}`}
              component={CEMSSanctionContainer}
              exact
            />
            <Route
              path={`${path}/${INSPECTION_ROUTE}/:inspectionId/${RECOMMENDATION_ROUTE}/:recommendationId`}
              component={CEMSRecommendationsDetailContainer}
              exact
            />
            <Route
              path={`${path}/${INSPECTION_ROUTE}/:inspectionId/${SANCTION_ROUTE}/:sanctionId`}
              component={CEMSSanctionDetailContainer}
              exact
            />
          </StyleInnerLayout>
        </Route>
        {location.pathname === menuLink.cems && (
          <Redirect to={`/${CEMS_BASE_PATH}/inspection`} />
        )}
      </Switch>
    </StyleMainLayout>
  );
};

export default CEMSRouter;
