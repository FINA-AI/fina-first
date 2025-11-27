import { Box } from "@mui/material";
import withLoading from "../../hoc/withLoading";
import { styled } from "@mui/material/styles";
import React, { ReactNode } from "react";

interface ContentWrapperProps {
  children: ReactNode;
  setScrollElement: (el: HTMLElement) => void;
}

const StyledWrapper = styled(Box)(({ theme }: { theme: any }) => ({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  color: theme.palette.textColor,
  fontWeight: 500,
  fontSize: "12px",
  lineHeight: "20px",
  background: theme.palette.paperBackground,
  overflow: "auto",
  "&::-webkit-scrollbar-thumb": {
    background: "#8695B1",
  },
  "&::-webkit-scrollbar": {
    backgroundColor: "#EAEBF0",
    width: "0.7em",
    height: "0.7em",
  },
}));

const ContentWrapper: React.FC<ContentWrapperProps> = ({
  children,
  setScrollElement,
}) => {
  return <StyledWrapper ref={setScrollElement}>{children}</StyledWrapper>;
};

export default withLoading(ContentWrapper);
