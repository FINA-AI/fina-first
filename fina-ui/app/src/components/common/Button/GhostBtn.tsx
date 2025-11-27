import React, { FC, ReactNode } from "react";
import { Button } from "@mui/material";
import Tooltip from "../Tooltip/Tooltip";
import { styled } from "@mui/system";
import { UIEventType } from "../../../types/common.type";

interface GhostBtnProps {
  children?: ReactNode;
  disabled?: any;
  onClick: (e: UIEventType) => void;
  style?: any;
  tooltipText?: string;
  defaultLineHeight?: boolean;
  width?: number | string;
  height?: number;
  hidden?: boolean;
  fontSize?: number;
  borderRadius?: number;
  padding?: string;
  endIcon?: ReactNode;
  startIcon?: ReactNode;
  sx?: object;
}

interface ButtonProps {
  width?: number | string;
  height?: number;
  hidden?: boolean;
  fontSize?: number;
  _borderRadius?: number;
  padding?: string;
  _defaultLineHeight?: boolean;
  endIcon?: React.ReactNode;
  startIcon?: React.ReactNode;
}

const StyledButton = styled(Button, {
  shouldForwardProp: (prop: string) => !prop.startsWith("_"),
})<ButtonProps>(
  ({
    theme,
    width,
    height,
    hidden,
    fontSize,
    _borderRadius,
    _defaultLineHeight,
    padding,
  }) => ({
    borderRadius: _borderRadius
      ? `${_borderRadius}px`
      : (theme as any).btn.borderRadius,
    lineHeight: _defaultLineHeight ? "" : (theme as any).btn.lineHeight,
    padding: padding ?? "8px 16px",
    fontSize: fontSize ? `${fontSize}px` : (theme as any).btn.fontSize,
    border: `1px solid ${
      theme.palette.mode === "light" ? "#D0D5DD" : "#3C4D68"
    }`,
    fontWeight: 500,
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textTransform: "capitalize",
    display: hidden ? "none" : "",
    width: width ? width : "fit-content",
    height: `${height}px`,
    ...(theme as any).ghostBtn,
    "& .MuiSvgIcon-root": {
      width: (theme as any).icon.iconWidth,
      height: (theme as any).icon.iconHeight,
      [theme.breakpoints.between(900, 1300)]: {
        width: "1rem !important",
        height: "1rem !important",
      },
    },
    [theme.breakpoints.between(900, 1300)]: {
      fontSize: "0.75rem !important",
      padding: "0.5rem !important",
    },
    "& .MuiButton-startIcon": {
      marginRight: "5px",
    },
    "& .MuiButton-endIcon": {
      marginLeft: "5px ",
    },
  })
);

const GhostBtn: FC<GhostBtnProps> = ({
  children,
  width,
  height = 32,
  hidden,
  disabled,
  fontSize,
  borderRadius = 4,
  padding,
  defaultLineHeight = false,
  tooltipText = "",
  ...props
}) => {
  return (
    <Tooltip title={tooltipText}>
      <span>
        <StyledButton
          width={width}
          height={height}
          hidden={hidden}
          fontSize={fontSize}
          _borderRadius={borderRadius}
          _defaultLineHeight={defaultLineHeight}
          padding={padding}
          variant="outlined"
          disabled={disabled}
          {...props}
        >
          <span
            style={{
              display: "flex",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              maxWidth: "100%",
            }}
          >
            {children}
          </span>
        </StyledButton>
      </span>
    </Tooltip>
  );
};

export default GhostBtn;
