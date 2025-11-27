import React from "react";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";

interface EmsFollowUpResizerProps {
  isMouseDownRef: React.MutableRefObject<boolean>;
  resizerRef: React.RefObject<HTMLDivElement>;
  menuRef: React.RefObject<HTMLDivElement>;
}

const StyledRoot = styled(Box)({
  height: "100%",
  minWidth: "8px",
  backgroundColor: "#3892D4",
  cursor: "col-resize",
});

const StyledResizer = styled(Box)(({ theme }: any) => ({
  display: "none",
  height: "100%",
  minWidth: "8px",
  backgroundColor: "#c2c2c2",
  cursor: "col-resize",
  position: "fixed",
  zIndex: theme.zIndex.modal + 1,
}));

const EmsFollowUpResizer: React.FC<EmsFollowUpResizerProps> = ({
  isMouseDownRef,
  resizerRef,
  menuRef,
}) => {
  const handleMouseDown = () => {
    isMouseDownRef.current = true;
  };

  const handleMouseUp = (event: React.MouseEvent) => {
    isMouseDownRef.current = false;
    if (resizerRef.current) {
      let xPosition = resizerRef.current.getBoundingClientRect().right;
      if (menuRef.current && event.clientX === xPosition) {
        let width = xPosition > 150 ? xPosition - 70 : 150;
        menuRef.current.style.minWidth = `${width}px`;
        menuRef.current.style.width = `${width}px`;
      }
      resizerRef.current.style.display = "none";
    }
  };

  return (
    <>
      <StyledRoot
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        id="resizer_Root"
      />
      <StyledResizer ref={resizerRef} onMouseUp={handleMouseUp} />
    </>
  );
};

export default EmsFollowUpResizer;
