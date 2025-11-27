import { Route, Switch } from "react-router-dom";
import { Box } from "@mui/material";
import React from "react";
import ReturnCreationScheduleContainer from "../../containers/ReturnCreationSchedule/ReturnCreationScheduleContainer";
import ReturnCreationScheduleBreadcrumb from "./ReturnCreationScheduleBreadcrumb";
import ReturnCreationScheduleDetailContainer from "../../containers/ReturnCreationSchedule/ReturnCreationScheduleDetailContainer";
import { styled } from "@mui/material/styles";

const StyledMainLayout = styled(Box)({
  height: "100%",
  boxSizing: "border-box",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
});

const StyledInnerLayout = styled(Box)({
  height: "100%",
  boxSizing: "border-box",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  padding: "16px",
});

const ReturnCreationScheduleRouter = () => {
  const RETURN_CREATION_ROUTE = "/returncreationschedule";

  return (
    <StyledMainLayout>
      <Switch>
        <Route
          path={RETURN_CREATION_ROUTE}
          component={ReturnCreationScheduleContainer}
          exact
        />
        <Route path={`${RETURN_CREATION_ROUTE}/:returncreationId`}>
          <StyledInnerLayout>
            <ReturnCreationScheduleBreadcrumb />
            <Route
              path={`${RETURN_CREATION_ROUTE}/:returncreationId`}
              component={ReturnCreationScheduleDetailContainer}
              exact
            />
          </StyledInnerLayout>
        </Route>
        {/*<Redirect to={RETURN_CREATION_ROUTE} />*/}
      </Switch>
    </StyledMainLayout>
  );
};

export default ReturnCreationScheduleRouter;
