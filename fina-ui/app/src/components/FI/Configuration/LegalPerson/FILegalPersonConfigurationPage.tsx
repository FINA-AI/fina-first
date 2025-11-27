import { Box, Grid } from "@mui/material";
import { Route, Switch } from "react-router-dom";
import FILegalPersonConfigurationContainer from "../../../../containers/FI/Configuration/LegalPerson/FILegalPersonConfigurationContainer";
import FILegalPersonConfigurationItemContainer from "../../../../containers/FI/Configuration/LegalPerson/FILegalPersonConfigurationItemContainer";
import menuLink from "../../../../api/ui/menuLink";
import React from "react";

interface FILegalPersonConfigurationPageProps {
  tabName: string;
}

const FILegalPersonConfigurationPage: React.FC<
  FILegalPersonConfigurationPageProps
> = ({ tabName }) => {
  return (
    <Box height={"100%"}>
      <Grid container height={"100%"}>
        <Grid xs={12} item height={"100%"}>
          <Switch>
            <Route
              path={`${menuLink.configuration}/${tabName}/:legalPersonId/`}
            >
              <FILegalPersonConfigurationItemContainer tabName={tabName} />
            </Route>
            <Route exact>
              <FILegalPersonConfigurationContainer />
            </Route>
          </Switch>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FILegalPersonConfigurationPage;
