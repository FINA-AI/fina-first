import { Box } from "@mui/system";
import { Grid } from "@mui/material";
import React, { memo } from "react";
import { Route, Switch } from "react-router-dom";
import UserFileSpaceMainContainer from "../../containers/UserFileSpaceContainer/UserFileSpaceMain/UserFileSpaceMainContainer";
import UserFileSpaceItemContainer from "../../containers/UserFileSpaceContainer/UserFileSpaceItem/UserFileSpaceItemContainer";

const UserFileSpacePage = () => {
  return (
    <Box sx={(theme: any) => ({ ...theme.mainLayout })}>
      <Grid container height={"100%"}>
        <Grid
          xs={12}
          item
          sx={(theme: any) => ({
            background: theme.palette.bodyBackgroundColor,
            borderRadius: "8px",
            height: "100%",
          })}
        >
          <Switch>
            <Route path={`/userfilespace/:userFileName`}>
              <UserFileSpaceItemContainer />
            </Route>
            <Route exact>
              <UserFileSpaceMainContainer />
            </Route>
          </Switch>
        </Grid>
      </Grid>
    </Box>
  );
};

export default memo(UserFileSpacePage);
