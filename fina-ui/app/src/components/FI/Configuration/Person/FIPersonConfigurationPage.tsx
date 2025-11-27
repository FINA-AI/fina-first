import { Box, Grid } from "@mui/material";
import { Route, Switch } from "react-router-dom";
import FIPersonConfigurationItemContainer from "../../../../containers/FI/Configuration/PhysicalPerson/FIPersonConfigurationItemContainer";
import FIPersonConfigurationContainer from "../../../../containers/FI/Configuration/PhysicalPerson/FIPersonConfigurationContainer";
import menuLink from "../../../../api/ui/menuLink";
import React from "react";

interface FIPersonConfigurationPageProps {
  tabName: string;
}

const FIPersonConfigurationPage: React.FC<FIPersonConfigurationPageProps> = ({
  tabName,
}) => {
  return (
    <Box height={"100%"}>
      <Grid container height={"100%"}>
        <Grid xs={12} item height={"100%"}>
          <Switch>
            <Route path={`${menuLink.configuration}/${tabName}/:personItemId/`}>
              <FIPersonConfigurationItemContainer tabName={tabName} />
            </Route>
            <Route exact>
              <FIPersonConfigurationContainer tabName={tabName} />
            </Route>
          </Switch>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FIPersonConfigurationPage;
