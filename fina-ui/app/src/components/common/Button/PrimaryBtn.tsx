import { Button } from "@mui/material";
import React from "react";
import Tooltip from "../Tooltip/Tooltip";
import { Box, styled } from "@mui/system";
import { UIEventType } from "../../../types/common.type";

interface PrimaryBtnProps {
  onClick: (event: UIEventType) => void;
  children?: React.ReactNode;
  disabled?: boolean;
  hidden?: boolean;
  fontSize?: number;
  backgroundColor?: string;
  border?: string;
  style?: object;
  tooltipText?: string;
  height?: string | number;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  variant?: any;
  color?: any;
}

const StyledRoot = styled(Button)<any>(({ theme }) => ({
  borderRadius: theme.btn.borderRadius,
  fontFamily: "Inter",
  fontStyle: "normal",
  padding: "8px 16px",
  lineHeight: theme.btn.lineHeight,
  whiteSpace: "nowrap",
  height: "32px",
  ...theme.primaryBtn,
  fontWeight: 500,
  textTransform: "capitalize",
  "& .MuiSvgIcon-root": {
    width: theme.icon.iconWidth,
    height: theme.icon.iconHeight,
    [theme.breakpoints.between(900, 1300)]: {
      width: "1rem !important",
      height: "1rem !important",
    },
  },
  [theme.breakpoints.between(900, 1300)]: {
    fontSize: "0.75rem !important",
    padding: "0.5rem !important",
  },
}));

const PrimaryBtn: React.FC<PrimaryBtnProps> = ({
  children,
  hidden,
  style,
  tooltipText = "",
  ...props
}) => {
  return hidden ? null : (
    <Tooltip title={tooltipText && tooltipText}>
      <StyledRoot {...props} style={style}>
        <Box
          component="span"
          sx={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            maxWidth: "100%",
          }}
        >
          {children}
        </Box>
      </StyledRoot>
    </Tooltip>
  );
};

export default PrimaryBtn;
