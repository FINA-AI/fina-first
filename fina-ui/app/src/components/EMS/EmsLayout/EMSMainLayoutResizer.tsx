import React from "react";
import { styled } from "@mui/material/styles";
import { lighten } from "@mui/system";
import { Box } from "@mui/material";

interface EMSMainLayoutResizerProps {
  isMouseDownRef: React.MutableRefObject<boolean>;
  resizerRef: React.RefObject<HTMLDivElement>;
  menuRef: React.RefObject<HTMLDivElement>;
  mainContainerRef: React.RefObject<HTMLDivElement>;
  resizerContainerRef?: React.RefObject<HTMLDivElement>;
  minWidth?: number;
  position?: "left" | "right";
  setIsMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const StyledRoot = styled(Box)<{ _position: string }>(
  ({ theme, _position }) => ({
    height: "100%",
    minWidth: "8px",
    backgroundColor:
      _position !== "left"
        ? theme.palette.mode === "dark"
          ? " rgb(102, 108, 137)"
          : "#FFF"
        : theme.palette.mode === "dark"
        ? "rgb(102, 108, 137)"
        : "#3892D4",
    cursor: "col-resize",
    border: `1px solid ${
      theme.palette.mode === "dark"
        ? lighten(theme.palette.primary.main, 0.5)
        : "#157fcc"
    }`,
  })
);

const StyledResizer = styled(Box)(({ theme }) => ({
  display: "none",
  height: "100%",
  minWidth: "8px",
  backgroundColor:
    theme.palette.mode === "dark"
      ? lighten(theme.palette.primary.main, 0.5)
      : "#c2c2c2",
  cursor: "col-resize",
  position: "fixed",
  zIndex: theme.zIndex.modal + 1,
}));

const StyledIconBox = styled(Box)({
  "&:hover": {
    cursor: "pointer",
  },
});

const EMSMainLayoutResizer: React.FC<EMSMainLayoutResizerProps> = ({
  isMouseDownRef,
  resizerRef,
  menuRef,
  mainContainerRef,
  minWidth,
  position = "left",
  setIsMenuOpen,
  resizerContainerRef,
}) => {
  const handleMouseDown = () => {
    isMouseDownRef.current = true;
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
    if (resizerRef.current && mainContainerRef.current && menuRef.current) {
      const mainContainerRect =
        mainContainerRef.current.getBoundingClientRect();
      const resizerRect = resizerRef.current.getBoundingClientRect();

      if (resizerRect.left !== 0) {
        let leftContainerWidth =
          menuRef.current.getBoundingClientRect().left -
          (mainContainerRect.width -
            menuRef.current.getBoundingClientRect().width);

        let xPosition =
          position === "left"
            ? resizerRect.left - mainContainerRect.left
            : mainContainerRect.width - (resizerRect.left - leftContainerWidth);

        if (menuRef.current) {
          let width = minWidth && minWidth > xPosition ? minWidth : xPosition;
          menuRef.current.style.minWidth = `${width}px`;
          menuRef.current.style.width = `${width}px`;
          menuRef.current.style.flex = `0`;
        }
        resizerRef.current.style.display = "none";
      }
    }
  };

  return (
    <>
      <StyledRoot
        _position={position}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        id="resizer_Root"
        ref={resizerContainerRef}
      >
        {position === "right" && (
          <StyledIconBox
            onClick={() => {
              setIsMenuOpen && setIsMenuOpen(false);
            }}
          ></StyledIconBox>
        )}
      </StyledRoot>
      <StyledResizer ref={resizerRef} onMouseUp={handleMouseUp} />
    </>
  );
};

export default EMSMainLayoutResizer;
