import { Box, Grid } from "@mui/material";
import { Route, Switch } from "react-router-dom";
import FILegalPersonContainer from "../../../../../containers/FI/Main/LegalPerson/FILegalPersonContainer";
import FILegalPersonItemContainer from "../../../../../containers/FI/Main/LegalPerson/FILegalPersonItemContainer";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { LegalPersonDataType } from "../../../../../types/legalPerson.type";

const StyledTable = styled(Grid)(({ theme }: any) => ({
  background: theme.palette.paperBackground,
  borderRadius: "8px",
  height: "100%",
}));

interface FILegalPersonPageProps {
  tabName: string;
  fiId: number;
}

const FILegalPersonPage: React.FC<FILegalPersonPageProps> = ({
  tabName,
  fiId,
}) => {
  const [originalSelectedPerson, setOriginalSelectedPerson] =
    useState<LegalPersonDataType>();

  const [isEdit, setIsEdit] = useState<boolean>(false);
  return (
    <Box height={"100%"}>
      <Grid container height={"100%"}>
        <StyledTable xs={12} item>
          <Switch>
            <Route path={`/fi/:id/${tabName}/:legalPersonItemId/`}>
              <FILegalPersonItemContainer
                tabName={tabName}
                originalSelectedPerson={originalSelectedPerson}
                setOriginalSelectedPerson={setOriginalSelectedPerson}
                isEdit={isEdit}
                setIsEdit={setIsEdit}
                fiId={fiId}
              />
            </Route>
            <Route exact>
              <FILegalPersonContainer
                tabName={tabName}
                setOriginalSelectedPerson={setOriginalSelectedPerson}
                setIsEdit={setIsEdit}
                fiId={fiId}
              />
            </Route>
          </Switch>
        </StyledTable>
      </Grid>
    </Box>
  );
};

export default FILegalPersonPage;
