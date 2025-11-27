import { Button } from "@mui/material";
import Tooltip from "../Tooltip/Tooltip";
import React from "react";
import { styled } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";

interface DeleteBtnProps {
  children: React.ReactNode;
  title?: string;
  width?: number;
  onClick?: () => void;
  disabled?: boolean;
  endIcon?: React.ReactNode;
}

const StyledButton = styled(Button)<{ width?: number }>(({ width, theme }) => ({
  borderRadius: "4px",
  padding: "7px 16px",
  background: "#FF4128",
  color: "#FFFFFF",
  border: "1px solid #FF4128",
  height: "32px",
  "&:hover": {
    background:
      "linear-gradient(0deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05)), #FF4128;",
    border: "1px solid #FF4128",
  },
  "&:disabled": {
    opacity: "45%",
    color: "#FFFFFF",
  },
  "& .MuiSvgIcon-root": {
    width: (theme as any).icon.iconWidth,
    height: (theme as any).icon.iconHeight,
    [theme.breakpoints.between(900, 1300)]: {
      width: "1rem !important",
      height: "1rem !important",
    },
  },
  textTransform: "none",
  width: width ? `${width}px` : "",
  "& .MuiButton-endIcon": {
    marginLeft: "5px ",
  },
}));

const DeleteBtn: React.FC<DeleteBtnProps> = ({
  children,
  title,
  width,
  ...props
}) => {
  return (
    <Tooltip title={title || ""}>
      <StyledButton
        width={width}
        variant="outlined"
        {...props}
        endIcon={<DeleteIcon />}
      >
        <span
          style={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            maxWidth: "100%",
            lineHeight: "normal",
          }}
        >
          {children}
        </span>
      </StyledButton>
    </Tooltip>
  );
};

export default DeleteBtn;
