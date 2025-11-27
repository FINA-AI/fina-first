import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { Container } from "@sencha/ext-react-modern";
import React from "react";
import MfoDashboard from "../screens/MfoDashboard";
import OtherDashboard from "../screens/OtherDashboard";
import PageNotFound from "../components/PageNotFound";

const MainDashboardRouter = () => {
  return (
    <Router>
      <Container scrollable>
        <Switch>
          <Route path="/mfo" render={() => <MfoDashboard />} />
          <Route path="/other" render={() => <OtherDashboard />} />
          <Route component={PageNotFound} />
        </Switch>
      </Container>
    </Router>
  );
};

export default MainDashboardRouter;
