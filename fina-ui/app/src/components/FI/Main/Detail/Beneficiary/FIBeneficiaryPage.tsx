import { Box, Grid } from "@mui/material";
import { Route, Switch } from "react-router-dom";
import FIBeneficiaryItemContainer from "../../../../../containers/FI/Main/Beneficiary/FIBeneficiaryItemContainer";
import FIBeneficiaryContainer from "../../../../../containers/FI/Main/Beneficiary/FIBeneficiaryContainer";
import { styled } from "@mui/material/styles";
import React from "react";

const StyledTable = styled(Grid)(({ theme }: any) => ({
  background: theme.palette.paperBackground,
  borderRadius: "8px",
  height: "100%",
}));

interface FIBeneficiaryPageProps {
  tabName: string;
  fiId: number;
}

const FIBeneficiaryPage: React.FC<FIBeneficiaryPageProps> = ({
  tabName,
  fiId,
}) => {
  return (
    <Box height={"100%"}>
      <Grid container height={"100%"}>
        <StyledTable xs={12} item>
          <Switch>
            <Route path={`/fi/:id/${tabName}/:beneficiaryItemId/`}>
              <FIBeneficiaryItemContainer tabName={tabName} />
            </Route>
            <Route exact>
              <FIBeneficiaryContainer tabName={tabName} fiId={fiId} />
            </Route>
          </Switch>
        </StyledTable>
      </Grid>
    </Box>
  );
};

export default FIBeneficiaryPage;
