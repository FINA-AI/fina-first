import { Box, styled } from "@mui/system";
import { ListItem, ListItemText } from "@mui/material";

export const drawerWidth = 240;
export const drawerWidthMinimized = 180;

export const StyledDrawer = styled("div")<{ _openLocked: boolean }>(
  ({ theme, _openLocked }: { theme: any; _openLocked: boolean }) => ({
    height: "100%",
    position: "relative",
    width: _openLocked ? "240px !important" : theme.spacing(9),
    [theme.breakpoints.between(900, 1300)]: {
      width: _openLocked
        ? `${drawerWidthMinimized}px !important`
        : theme.spacing(7),
    },
    // position: "absolute",
    overflowX: "hidden",
    backgroundColor:
      theme.palette.type === "dark"
        ? "#2B3748!important"
        : theme.palette.background.paper,
    transition: theme.transitions.create(["width", "background-color"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    "& .user": {
      justifyContent: "flex-start",
    },
    "& .bigAvatar": {
      width: 40,
      height: 40,
    },
    "& nav": {
      display: "none",
    },
    "&:hover": {
      transition: "width 0.3s ease-in-out 0.3s",
      width: `${drawerWidth}px !important`,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[6],
      "& nav": {
        display: "block",
      },
      [theme.breakpoints.between(900, 1300)]: {
        width: `${drawerWidthMinimized}px !important`,
      },
    },
    "&:not(:hover)": {
      transition: "width 0.2s ease-in-out 0.2s",
    },
    "& .brand": {
      display: "none",
    },
    "& .profile": {
      flexDirection: "row",
      top: theme.spacing(6),
      padding: theme.spacing(0.5),
      textAlign: "left",
      "& button": {
        width: "auto",
      },
    },
    "& .avatar": {
      marginRight: theme.spacing(3),
    },
  })
);

export const StyledMenuContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#2C3644",
  height: "100%",
  width: drawerWidth,
  [theme.breakpoints.between(900, 1300)]: {
    width: `${drawerWidthMinimized}px !important`,
  },
  position: "relative",
}));
export const StyledTopHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  minHeight: "40px",
  alignItems: "center",
  paddingLeft: "15px",
  [theme.breakpoints.between(900, 1300)]: {
    width: `${drawerWidthMinimized}px !important`,
    paddingLeft: "5px",
  },
  justifyContent: "space-between",
}));
export const StyledMainMenuBox = styled(Box)(() => ({
  scrollbarWidth: "none",
  "&::-webkit-scrollbar-thumb": {
    background: "#ffffff",
  },
  "&::-webkit-scrollbar": {
    backgroundColor: "#8695B1",
    width: 4,
  },
  height: "100%",
  overflow: "auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  overflowX: "hidden",
}));

export const StyledListItem = styled(ListItem)<{
  component?: any;
  to?: string;
}>(({ theme }) => ({
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
  paddingLeft: theme.spacing(3),
  [theme.breakpoints.between(900, 1300)]: {
    width: `${drawerWidthMinimized}px !important`,
    paddingLeft: theme.spacing(2),
  },
  "&.active": {
    backgroundColor: theme.palette.primary.main,
  },
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark" ? "#344258" : "rgba(255,255,255,0.51)",
  },
  "&.Mui-selected": {
    "&:before": {
      content: "''",
      position: "absolute",
      bottom: 0,
      left: 0,
      width: theme.spacing(1),
      height: "100%",
      display: "block",
    },
    "& $primary": {
      color: "#FFFFFF",
    },
    "& $icon svg": {
      fill: "#FFFFFF",
    },
    "& $icon": {
      color: "#FFFFFF",
    },
    backgroundColor: theme.palette.primary.main,
  },
}));

export const StyledMain = styled("main")<{ _openLocked: boolean }>(
  ({ theme, _openLocked }) => ({
    width: "100%",
    // padding: theme.spacing(2),
    overflow: "hidden",
    marginLeft: _openLocked ? `${drawerWidth}px !important` : 70,
    height: "100%",
    [theme.breakpoints.between(900, 1300)]: {
      marginLeft: _openLocked ? `${drawerWidthMinimized}px !important` : 50,
    },
  })
);

export const StyledListItemText = styled(ListItemText)(() => ({
  "& .MuiListItemText-primary": {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: "#FFFFFF",
    // fontSize: 12,
    fontWeight: 400,
  },
}));
