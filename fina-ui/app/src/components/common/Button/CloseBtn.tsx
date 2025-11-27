import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import React from "react";
import { styled } from "@mui/system";

interface CloseBtnProps {
  onClick: () => void;
  size?: string;
  style?: React.CSSProperties;
}

interface IconButtonProps {
  _size: string;
}

const StyledIconButton = styled(IconButton)<IconButtonProps>(
  ({ theme, _size }) => ({
    float: "right",
    color: theme.palette.mode === "dark" ? "#5D789A" : theme.palette.grey[500],
    padding: 0,
    background: "inherit",
    border: "unset",
    "& .MuiSvgIcon-root": {
      padding: "2px !important",
      height: _size === "small" ? (theme as any).smallIcon.height : 20,
      width: _size === "small" ? (theme as any).smallIcon.width : 20,
    },
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255,255,255, 0.05)"
          : "rgba(80,80,80, 0.05)",
    },
  })
);

const CloseBtn: React.FC<CloseBtnProps> = ({
  onClick,
  size = "small",
  style,
}) => {
  return (
    <StyledIconButton
      _size={size}
      onClick={onClick}
      style={style}
      data-testid={"closeBtn"}
    >
      <CloseIcon />
    </StyledIconButton>
  );
};

export default CloseBtn;
