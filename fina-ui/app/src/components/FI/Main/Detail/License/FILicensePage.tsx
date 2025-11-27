import { Box, Grid } from "@mui/material";
import { Route, Switch } from "react-router-dom";
import FILicenseContainer from "../../../../../containers/FI/Main/License/FILicenseContainer";
import FILicenseItemContainer from "../../../../../containers/FI/Main/License/FILicenseItemContainer";
import React from "react";

interface FILicensePageProps {
  tabName: string;
  fiId: number;
}

const FILicensePage: React.FC<FILicensePageProps> = ({ tabName, fiId }) => {
  return (
    <Box sx={{ height: "100%", borderRadius: "4px" }}>
      <Grid container height={"100%"}>
        <Grid xs={12} item height={"100%"}>
          <Switch>
            <Route path={`/fi/:id/${tabName}/:licenseItemId/`}>
              <FILicenseItemContainer tabName={tabName} />
            </Route>
            <Route exact>
              <FILicenseContainer tabName={tabName} fiId={fiId} />
            </Route>
          </Switch>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FILicensePage;
