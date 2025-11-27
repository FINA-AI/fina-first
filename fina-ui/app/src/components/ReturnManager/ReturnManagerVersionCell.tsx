import { Box } from "@mui/system";
import React from "react";
import { styled } from "@mui/material/styles";

const StyledRoot = styled(Box)(({ theme }) => ({
  padding: "4px 12px",
  background: theme.palette.mode === "light" ? "#EAEBF0" : "#445669",
  width: "100%",
  boxSizing: "border-box",
  border: 2,
  fontWeight: 500,
  fontSize: 12,
  lineHeight: "16px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
  color: theme.palette.mode === "dark" ? "#ABBACE" : "",
}));

const ReturnManagerVersionCell = ({ value }: { value: string }) => {
  return <StyledRoot data-testid={"version-code"}>{value}</StyledRoot>;
};

export default ReturnManagerVersionCell;
