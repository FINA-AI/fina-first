import { Backdrop, CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { styled } from "@mui/material/styles";

const StyledBackdrop = styled(Backdrop)(({ theme }: any) => ({
  zIndex: theme.zIndex.drawer - 1,
  position: "absolute",
  "&.MuiBackdrop-root": {
    backgroundColor: theme.palette.primary.darkerLightColor,
  },
}));

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgb(240, 240, 245,.2)"
      : "rgb(240, 240, 245,.9)",
}));

const StyledMessageBox = styled(Box)(({ theme }: any) => ({
  paddingLeft: 15,
  color: theme.palette.primary.main,
}));

interface SimpleLoadMaskProps {
  loading: boolean;
  message?: string;
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";
}

const SimpleLoadMask: React.FC<SimpleLoadMaskProps> = ({
  loading,
  message = "",
  color = "primary",
}) => {
  return loading ? (
    <StyledBackdrop open={loading} id={"backdrop"}>
      <StyledBox
        borderRadius={"8px"}
        padding={"10px 20px"}
        display={"flex"}
        flexDirection={"row"}
        alignItems={"center"}
      >
        <CircularProgress color={color} />
        {message && <StyledMessageBox>{message}</StyledMessageBox>}
      </StyledBox>
    </StyledBackdrop>
  ) : null;
};

export default SimpleLoadMask;
