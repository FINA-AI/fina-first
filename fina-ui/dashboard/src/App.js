import React from "react";
import { applyMiddleware, createStore } from "redux";
import { Provider } from "react-redux";
import { Container } from "@sencha/ext-react-modern";
import logger from "redux-logger";
import thunk from "redux-thunk";

import { reducer } from "./store/reducer";
import { BASE_REST_URL } from "./AppUtil";
import MainDashboardRouter from "./routers/MainDashboardRouter";
import { loadConfiguration } from "./store/actions";
import "./locale/i18n";

const App = () => {
  const initExtOverrides = () => {
    window["Ext"].draw.Container.prototype.applyDownloadServerUrl = () => {
      return `${BASE_REST_URL}/dashboard/download/chart`;
    };
  };

  initExtOverrides();

  const store = createStore(reducer, applyMiddleware(thunk, logger));
  store.dispatch(loadConfiguration());

  return (
    <Provider store={store}>
      <Container viewport="true" fullscreen layout="fit">
        <MainDashboardRouter />
      </Container>
    </Provider>
  );
};

export default App;
