import { Box, Grid } from "@mui/material";
import FIPhysicalPersonContainer from "../../../../../containers/FI/Main/PhysicalPerson/FIPhysicalPersonContainer";
import { Route, Switch } from "react-router-dom";
import FIPhysicalPersonItemContainer from "../../../../../containers/FI/Main/PhysicalPerson/FIPhysicalPersonItemContainer";
import { styled } from "@mui/material/styles";
import React from "react";

const StyledRoot = styled(Box)(({ theme }: any) => ({
  background: theme.palette.paperBackground,
  borderRadius: "8px",
  height: "100%",
}));

interface FIPhysicalPersonPageProps {
  tabName: string;
  fiId: number;
}

const FIPhysicalPersonPage: React.FC<FIPhysicalPersonPageProps> = ({
  tabName,
  fiId,
}) => {
  return (
    <StyledRoot>
      <Grid container height={"100%"}>
        <Grid xs={12} item height={"100%"}>
          <Switch>
            <Route path={`/fi/:id/${tabName}/:personItemId/`}>
              <FIPhysicalPersonItemContainer tabName={tabName} fiId={fiId} />
            </Route>
            <Route exact>
              <FIPhysicalPersonContainer tabName={tabName} fiId={fiId} />
            </Route>
          </Switch>
        </Grid>
      </Grid>
    </StyledRoot>
  );
};

export default FIPhysicalPersonPage;
