import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Zoom,
} from "@mui/material";
import GhostBtn from "../common/Button/GhostBtn";
import { Box } from "@mui/system";
import PrimaryBtn from "../common/Button/PrimaryBtn";
import PropTypes from "prop-types";
import { forwardRef, useState } from "react";

const Transition = forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} timeout={500} />;
});

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const [open] = useState(true);

  const downloadErrorLog = (error) => {
    const filename = "errorLog.txt";
    const errObj = {
      routeHash: window.location.hash,
      error: error.stack,
    };

    const blob = new Blob([JSON.stringify(errObj)], {
      type: "text/plain",
    });

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );
    }
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={resetErrorBoundary}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{"Unexpected Error"}</DialogTitle>
      <DialogContent style={{ overflow: "hidden", overflowWrap: "break-word" }}>
        <div role="alert">
          <p>Something went wrong:</p>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            please click on try again button bellow, if it does not help
            download error log and contact system administrator...
          </pre>
        </div>
      </DialogContent>
      <DialogActions
        style={{
          background: "inherit",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <GhostBtn
          onClick={() => {
            downloadErrorLog(error);
          }}
        >
          Download Log
        </GhostBtn>
        <Box display={"flex"}>
          <PrimaryBtn onClick={resetErrorBoundary}>Try again</PrimaryBtn>
          <div style={{ marginLeft: 5 }}>
            <GhostBtn onClick={resetErrorBoundary}>Close</GhostBtn>
          </div>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

ErrorFallback.propTypes = {
  error: PropTypes.any,
  resetErrorBoundary: PropTypes.any,
};
export default ErrorFallback;
