import { Grid } from "@mui/material";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import React, { PropsWithChildren } from "react";

const StyledRoot = styled(Grid)(({ theme }) => ({
  padding: 4,
  cursor: "pointer",
  "& .MuiTypography-root": {
    textOverflow: "ellipsis!important",
    overflow: "hidden!important",
    display: "-webkit-box",
    "-webkit-box-orient": "vertical",
    "-webkit-line-clamp": "3",
    wordBreak: "break-all",
    color: (theme as any).palette.secondaryTextColor,
  },
}));

const StyledPaper = styled(Paper)(({ theme }: any) => ({
  backgroundColor:
    theme.palette.mode === "light" ? "#FFFFFF" : "#344258 !important",
  height: "120px",
  padding: "12px 16px",
  ...theme.configResponsiveCard,
}));

const ConfigLicenseCard: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <StyledRoot item xs={3}>
      <StyledPaper>{children}</StyledPaper>
    </StyledRoot>
  );
};

export default ConfigLicenseCard;
