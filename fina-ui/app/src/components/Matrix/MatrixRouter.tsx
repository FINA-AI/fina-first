import React, { memo } from "react";
import { Box } from "@mui/material";
import { Route, Switch } from "react-router-dom";
import MatrixBreadCrumb from "./MatrixBreadcrumbs";
import MainLayoutWrapper from "./MainLayout/MainLayoutWrapper";
import menuLink from "../../../src/api/ui/menuLink";
import MainMatrixContainer from "../../containers/Matrix/MainMatrixContainer";
import SubMatrixOptionsContainer from "../../containers/Matrix/SubMatrixOptionsContainer";
import SubMatrixContainer from "../../containers/Matrix/SubMatrixContainer";
import SubMatrixReturnDetailsContainer from "../../containers/Matrix/SubMatrixReturnDetailsContainer";

import { styled } from "@mui/system";

const StyledMainLayout = styled(Box)({
  padding: "20px 16px",
  width: "100%",
  boxSizing: "border-box",
  overflow: "hidden",
  height: "100%",
  display: "flex",
  flexDirection: "column",
});

const MatrixRouter = () => {
  const configurationPath = menuLink.matrix;

  return (
    <StyledMainLayout>
      <MainLayoutWrapper>
        <MatrixBreadCrumb />
        <Switch>
          <Route
            path={`${configurationPath}/:matrixId/:subMatrixId/:tableId`}
            component={SubMatrixReturnDetailsContainer}
          />
          <Route
            path={`${configurationPath}/:matrixId/:subMatrixId`}
            component={SubMatrixOptionsContainer}
          />
          <Route
            path={`${configurationPath}/:matrixId`}
            component={SubMatrixContainer}
          />
          <Route
            exact
            path={`${configurationPath}`}
            component={MainMatrixContainer}
          />
        </Switch>
      </MainLayoutWrapper>
    </StyledMainLayout>
  );
};

export default memo(MatrixRouter);
