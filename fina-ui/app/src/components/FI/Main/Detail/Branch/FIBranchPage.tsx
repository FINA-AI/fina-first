import { Box, Grid } from "@mui/material";
import FIBranchContainer from "../../../../../containers/FI/Main/Branch/FIBranchContainer";
import React, { useRef } from "react";
import { styled } from "@mui/material/styles";

const StyledTable = styled(Grid)({
  height: "100%",
  background: "#FFFFFF",
  borderRadius: "8px",
});

interface FIBranchPageProps {
  fiId: number;
}

const FIBranchPage: React.FC<FIBranchPageProps> = ({ fiId }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  return (
    <Box ref={ref} height="100%">
      <Grid container height={"100%"}>
        <StyledTable xs={12} item>
          <FIBranchContainer pageRef={ref} fiId={fiId} />
        </StyledTable>
      </Grid>
    </Box>
  );
};

export default FIBranchPage;
