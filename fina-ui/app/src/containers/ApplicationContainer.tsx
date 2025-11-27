import React from "react";
import { connect } from "react-redux";
import { HashRouter as Router } from "react-router-dom";
import "../App.css";
import SnackBar from "../components/common/Snackbar/Snackbar";
import { ErrorBoundary } from "react-error-boundary";
import MainLayoutWrapper from "./Layout/MainLayoutWrapper";
import ErrorFallback from "../components/Error/ErrorFallback";
import { Config } from "../types/config.type";

interface ApplicationContainerProps {
  config: Config;
  isConfigLoading: boolean;
  configLoadingError: boolean;
}

const ApplicationContainer: React.FC<ApplicationContainerProps> = ({
  config,
  isConfigLoading,
  configLoadingError,
}) => {
  const ignoreLeftSidebarMenu = false;

  const [retryCount, setRetryCount] = React.useState(0);

  return (
    <Router hashType={"noslash"}>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        resetKeys={[retryCount]}
        onReset={() => {
          setRetryCount(retryCount + 1);
        }}
      >
        <SnackBar>
          <MainLayoutWrapper
            hideMenu={ignoreLeftSidebarMenu}
            configLoadingError={configLoadingError}
            isConfigLoading={isConfigLoading}
            config={config}
          />
        </SnackBar>
      </ErrorBoundary>
    </Router>
  );
};

const configReducer = "config";
const mapStateToProps = (state: any) => ({
  config: state.getIn([configReducer, "config"]),
  isConfigLoading: state.getIn([configReducer, "isLoading"]),
  configLoadingError: state.getIn([configReducer, "error"]),
  ...state,
});

const mapDispatchToProps = () => ({});

const areStatePropsEqual = (
  prev: ApplicationContainerProps,
  next: ApplicationContainerProps
) => {
  return (
    prev.config === next.config && prev.isConfigLoading === next.isConfigLoading
  );
};

export default connect(mapStateToProps, mapDispatchToProps, null, {
  areStatePropsEqual,
})(ApplicationContainer);
