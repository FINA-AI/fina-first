import { Box, Grid } from "@mui/material";
import { Route, Switch } from "react-router-dom";
import FIManagementContainer from "../../../../../containers/FI/Main/Management/FIManagementContainer";
import FIManagementItemContainer from "../../../../../containers/FI/Main/Management/FIManagementItemContainer";
import React, { useRef } from "react";
import { styled } from "@mui/material/styles";

const StyledContent = styled(Grid)(({ theme }: any) => ({
  background: theme.palette.paperBackground,
  borderRadius: "8px",
  height: "100%",
}));

interface FIManagementPageProps {
  tabName: string;
  fiId: number;
}

const FIManagementPage: React.FC<FIManagementPageProps> = ({
  tabName,
  fiId,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  return (
    <Box ref={ref} height={"100%"}>
      <Grid container height={"100%"}>
        <StyledContent xs={12} item>
          <Switch>
            <Route
              path={`/fi/:id/${tabName}/:managementTypeId/:managementItemId/`}
            >
              <FIManagementItemContainer tabName={tabName} />
            </Route>
            <Route exact>
              <FIManagementContainer
                tabName={tabName}
                pageRef={ref}
                fiId={fiId}
              />
            </Route>
          </Switch>
        </StyledContent>
      </Grid>
    </Box>
  );
};

export default FIManagementPage;
