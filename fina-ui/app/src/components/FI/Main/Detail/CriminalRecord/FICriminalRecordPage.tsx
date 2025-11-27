import { Box, Grid } from "@mui/material";
import { Route, Switch } from "react-router-dom";
import FICriminalRecordContainer from "../../../../../containers/FI/Main/CriminalRecord/FICriminalRecordContainer";
import { styled } from "@mui/material/styles";
import React from "react";

const StyledTable = styled(Grid)(({ theme }: any) => ({
  background: theme.palette.paperBackground,
  borderRadius: "8px",
  height: "100%",
  paddingBottom: 70,
}));

interface FICriminalRecordPageProps {
  tabName: string;
  fiId: number;
}

const FICriminalRecordPage: React.FC<FICriminalRecordPageProps> = ({
  tabName,
  fiId,
}) => {
  return (
    <Box height={"100%"}>
      <Grid container height={"100%"}>
        <StyledTable xs={12} item>
          <Switch>
            <Route path={`/fi/:id/${tabName}/:legalPersonItemId/`}></Route>
            <Route exact>
              <FICriminalRecordContainer tabName={tabName} fiId={fiId} />
            </Route>
          </Switch>
        </StyledTable>
      </Grid>
    </Box>
  );
};

export default FICriminalRecordPage;
