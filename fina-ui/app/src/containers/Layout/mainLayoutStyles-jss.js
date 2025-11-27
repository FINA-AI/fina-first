import { styled } from "@mui/system";

const appFrame = {
  display: "flex",
  width: "100%",
  height: "100%",
  zIndex: 1,
  overflow: "hidden",
};

export const StyledMainLayout = styled("div")(({ theme }) => ({
  background: theme.bodyBackgroundColor,
  color: theme.palette.text.primary,
  height: "100%",
  ...appFrame,
  flexDirection: "row",
  mode: theme.palette.mode === "dark" ? "dark-mode" : "light-mode",
}));
