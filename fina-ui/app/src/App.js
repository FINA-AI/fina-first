import ApplicationContainer from "./containers/ApplicationContainer";
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import createReducer from "./redux/reducer";
import "./locale/i18n";
import ThemeWrapper from "./containers/App/ThemeWrapper";
import ConfigProvider from "./hoc/config/ConfigProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import ErrorWindowProvider from "./hoc/ErrorWindow/ErrorWindowProvider";
import { configureStore } from "@reduxjs/toolkit";
import { logger } from "redux-logger/src";
import thunk from "redux-thunk";
import { loadConfiguration } from "./redux/actions/configActions";
import { loadLanguages } from "./redux/actions/languageActions";

const preloadState = {};
export const store = configureStore({
  reducer: createReducer(),
  middleware: [thunk, logger],
  preloadState,
});
const App = () => {
  useEffect(() => {
    store.dispatch(loadConfiguration);
    store.dispatch(loadLanguages);
  }, []);

  return (
    <Provider store={store}>
      <ThemeWrapper>
        <ConfigProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <ErrorWindowProvider>
              <ApplicationContainer />
            </ErrorWindowProvider>
          </LocalizationProvider>
        </ConfigProvider>
      </ThemeWrapper>
    </Provider>
  );
};

export default App;
