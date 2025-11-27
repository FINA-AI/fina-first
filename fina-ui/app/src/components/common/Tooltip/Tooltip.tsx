import { Box, Tooltip as MuiTooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { ReactElement, useCallback } from "react";
import { TooltipProps as MuiTooltipProps } from "@mui/material/Tooltip";

interface TooltipProps extends MuiTooltipProps {
  title: string | ReactElement;
}

const StyledBox = styled(Box)(({}) => ({
  maxHeight: "400px",
  overflow: "auto",
  lineBreak: "anywhere",
  paddingRight: "6px",
  "&::-webkit-scrollbar": {
    backgroundColor: "#2A3341",
  },
}));

const Tooltip: React.FC<TooltipProps> = ({ children, title, ...props }) => {
  const isTooltipHidden = useCallback(() => {
    if (title) {
      if (typeof title === "object") {
        return Object.keys(title).length !== 0;
      } else {
        return title && title.length > 0;
      }
    }
  }, [title]);

  if (!isTooltipHidden()) {
    return <>{children}</>;
  }

  return (
    <MuiTooltip title={<StyledBox>{title}</StyledBox>} {...props}>
      {children}
    </MuiTooltip>
  );
};

export default Tooltip;
