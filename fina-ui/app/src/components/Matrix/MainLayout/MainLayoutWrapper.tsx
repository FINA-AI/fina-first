import React, { FC, ReactNode } from "react";
import { Box } from "@mui/material";
import styled from "@mui/system/styled";

const StyledRoot = styled(Box)(({ theme }: any) => ({
  ...theme.page,
  boxSizing: "border-box",
  borderRadius: "8px",
  display: "flex",
  width: "100%",
}));

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayoutWrapper: FC<MainLayoutProps> = ({ children }) => {
  return <StyledRoot>{children}</StyledRoot>;
};

export default MainLayoutWrapper;
