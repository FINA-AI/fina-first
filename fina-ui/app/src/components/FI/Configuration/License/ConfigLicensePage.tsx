import { Box, Grid } from "@mui/material";
import { Route, Switch } from "react-router-dom";
import ConfigLicenseContainer from "../../../../containers/FI/Configuration/License/ConfigLicenseContainer";
import ConfigLicenseItemContainer from "../../../../containers/FI/Configuration/License/ConfigLicenseItemContainer";
import menuLink from "../../../../api/ui/menuLink";
import { memo } from "react";

const ConfigLicensePage = () => {
  return (
    <Box sx={{ height: "100%", background: "#FFFFFF", borderRadius: "8px" }}>
      <Grid container height={"100%"}>
        <Grid
          xs={12}
          item
          sx={{
            paddingBottom: "55px",
            height: "100%",
          }}
        >
          <Switch>
            <Route path={`${menuLink.configuration}/license/:id/`}>
              <ConfigLicenseItemContainer />
            </Route>
            <Route exact>
              <ConfigLicenseContainer />
            </Route>
          </Switch>
        </Grid>
      </Grid>
    </Box>
  );
};

export default memo(ConfigLicensePage);
