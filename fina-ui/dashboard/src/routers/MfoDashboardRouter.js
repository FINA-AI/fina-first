import React from "react";
import {Route, Switch, useRouteMatch} from "react-router-dom";
import {Container} from "@sencha/ext-react-modern";
import ProfitabilityScreen from "../screens/dashboard/categories/ProfitabilityScreen";
import AssetsScreen from "../screens/dashboard/categories/AssetsScreen";
import MfoHeader from "../screens/dashboard/MfoHeader";
import CapitalsScreen from "../screens/dashboard/categories/CapitalsScreen";
import LiquiditiesScreen from "../screens/dashboard/categories/LiquiditiesScreen";
import {connect} from "react-redux";
import Loading from "../components/Loading";
import {useTranslation} from "react-i18next";

const Ext = window["Ext"];

const MfoDashboardRouter = ({configuration}) => {
    let {path, url} = useRouteMatch();
    const { t } = useTranslation();

    if (!configuration || configuration.processing) {
        return (
            <Container scrollable>
                <Loading/>
            </Container>
        )
    } else if (configuration.fail) {
        Ext.toast(t("ConfigurationCouldNotBeLoaded"));
    }

  return (
    <Container scrollable>
      <MfoHeader url={url} />

      <Switch>
        <Route path={`${path}/assets`} render={() => <AssetsScreen />} exact />
        <Route
          path={`${path}/liquidities`}
          render={() => <LiquiditiesScreen />}
        />
        <Route path={`${path}/profitability`} component={ProfitabilityScreen} />
        <Route
          path={`${path}/capitals`}
          render={() => <CapitalsScreen />}
          exact
        />
      </Switch>
    </Container>
  );
};

const mapStateToProps = (state) => ({
    configuration: state.configuration,
});

export default connect(mapStateToProps)(MfoDashboardRouter);
