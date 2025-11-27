import { Switch } from "@mui/material";
import React from "react";
import { styled } from "@mui/system";

interface SwitchBtnProps {
  onClick: () => void;
  checked?: boolean;
  size?: string;
  props?: any;
}

const StyledSwitch = styled(Switch)<{ _size?: string }>(({ theme, _size }) => ({
  width: _size === "small" ? "30px" : "40px",
  height: _size === "small" ? "18px" : "18px",
  padding: 0,
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: "14px",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 4,
    "&.Mui-checked": {
      transform: _size === "small" ? "translateX(10px)" : "translateX(16px)",
      color: "#FFFFFF",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: _size === "small" ? "10px" : "16px",
    height: _size === "small" ? "10px" : "16px",
    borderRadius: "50%",
  },
  "& .MuiSwitch-track": {
    borderRadius: 16,
    opacity: 1,
    backgroundColor: theme.palette.secondary.light,
    boxSizing: "border-box",
  },
}));

const SwitchBtn: React.FC<SwitchBtnProps> = ({
  onClick,
  checked,
  size,
  ...props
}) => {
  return (
    <StyledSwitch _size={size} onClick={onClick} checked={checked} {...props} />
  );
};

export default SwitchBtn;
