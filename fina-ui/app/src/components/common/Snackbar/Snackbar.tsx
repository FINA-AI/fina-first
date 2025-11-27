import { SnackbarProvider, SnackbarProviderProps } from "notistack";
import { connect } from "react-redux";
import React from "react";
import { useTheme } from "@mui/material/styles";
import { GlobalStyles } from "@mui/material";

interface SnackbarProps extends SnackbarProviderProps {
  isSidebarOpen: boolean;
}

const SnackBar: React.FC<SnackbarProps> = ({ children, isSidebarOpen }) => {
  const theme = useTheme();

  const styles = {
    "& .SnackbarContent-root": {
      fontWeight: "500 !important",
      fontSize: "14px !important",
      lineHeight: "20px !important",
      padding: "10px 16px !important",
      maxWidth: "500px !important",
      maxHeight: "56px !important",
      display: "flex !important",
      alignItems: "flex-start !important",
    },
    "& .SnackbarItem-variantError": {
      backgroundColor: "#FF4128 !important",
    },
    "& .SnackbarItem-wrappedRoot": {
      left: `${isSidebarOpen ? "235px" : "65px"} !important`,
      zIndex: `${theme.zIndex.modal + 1} !important`,
    },
    "& .SnackbarItem-message": {
      display: "block !important",
      textOverflow: "ellipsis !important",
      whiteSpace: "nowrap !important",
      overflow: "hidden !important",
      padding: "6px 0px !important",
      "& svg": {
        position: "relative !important",
        top: "4px !important",
      },
    },
  };

  return (
    <>
      <GlobalStyles styles={styles} />
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        autoHideDuration={2000}
      >
        {children}
      </SnackbarProvider>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  isSidebarOpen: state.getIn(["openSidebar", "isOpen"]),
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(SnackBar);
