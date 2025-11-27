import { alpha, darken } from "@mui/material/styles";
import { styled } from "@mui/system";
import { Paper, Switch } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import React from "react";

const panelWidth = 360;

export const StyledThemeChooser = styled("aside")<{ _visible: boolean }>(
  ({ theme, _visible }) => ({
    color: theme.palette.text.primary,
    height: "100%",
    position: "fixed",
    top: 0,
    right: 0,
    zIndex: 999999991,
    transition: "width ease 0.2s",
    width: _visible ? panelWidth : 0,
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    "& .toggleButton": {
      left: -56,
      borderRadius: "50% 0 0 50%",
      boxShadow: "-3px 0px 4px 0px rgba(80,80,80, 0.2)",
    },
  })
);

export const StyledSlideDiv = styled("div")(({ theme }) => ({
  height: "100%",
  backgroundColor:
    theme.palette.mode === "dark"
      ? darken("#2B3748", 0.3)
      : alpha(theme.palette.background.default, 0.95),
  boxShadow: "0px 5px 10px 1px rgba(80,80,80, 0.2)",
  [theme.breakpoints.up("sm")]: {
    width: panelWidth,
  },
  "& > div": {
    height: "100%",
    "& > div": {
      height: "100%",
    },
  },
}));

export const StyledSettingsWrapper = styled("section")(({ theme }) => ({
  overflowY: "auto",
  overflowX: "hidden",
  height: "100%",
  position: "relative",
  maxWidth: "100%",
  padding: `0 ${theme.spacing(1)}`,
}));

export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: `${theme.spacing(1.5)} 0`,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgb(43, 55, 72)"
      : darken(theme.palette.background.default, 0.05),
}));

export const StyledFormGroup = styled(FormGroup)(() => ({
  width: "100%",
  flexDirection: "row",
  "& > span": {
    lineHeight: "50px",
  },
}));

export const StyledSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-track": {
    backgroundColor: theme.palette.secondary.main,
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.secondary.main,
  },
}));

export const StyledThemeLabel = styled(FormLabel)<{
  component: React.ElementType;
}>(({ theme }) => ({
  color: `${theme.palette.text.secondary} !important`,
}));

export const StyledCloseButton = styled("div")(({ theme }) => ({
  height: 30,
  width: 50,
  float: "right",
  marginTop: -30,
  marginRight: 21,
  color: `${theme.palette.text.secondary} !important`,
}));

export const StyledFormLabel = styled(FormLabel)<{
  component?: React.ElementType;
}>(({ theme }) => ({
  color: `${theme.palette.text.secondary} !important`,
  paddingTop: 2,
  textTransform: "capitalize",
}));

export const StyledThemeField = styled(FormControlLabel)(() => ({
  width: "33.33%",
  margin: 0,
}));
