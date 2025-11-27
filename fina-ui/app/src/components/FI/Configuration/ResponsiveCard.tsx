import { Grid } from "@mui/material";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import React, { ReactNode } from "react";

const StyledPaper = styled(Paper)(({ theme }: any) => ({
  height: "140px",
  ...theme.configResponsiveCard,
}));

type ResponsiveCardProps = {
  children?: ReactNode;
};

const ResponsiveCard: React.FC<ResponsiveCardProps> = ({ children }) => {
  return (
    <Grid item xs={3} padding={"4px"} sx={{ cursor: "pointer" }}>
      <StyledPaper>{children}</StyledPaper>
    </Grid>
  );
};

export default ResponsiveCard;
