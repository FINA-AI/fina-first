import { IconButton } from "@mui/material";
import Tooltip from "../Tooltip/Tooltip";
import React from "react";
import { styled } from "@mui/system";

interface ActionBtnProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  rowIndex?: number;
  children: React.ReactNode;
  color?: string;
  tooltipTitle?: string;
  transform?: string;
  buttonName?: string;
}

interface IconButtonProps {
  props: {
    color?: string;
    transform?: string;
  };
}

const StyledIconButton = styled(IconButton)<IconButtonProps>(
  ({ theme, props }) => ({
    margin: 5,
    backgroundColor:
      theme.palette.mode === "dark" ? "rgba(43,55,72,0.79)" : "#FFFFFF",
    height: 32,
    width: 32,
    border: "0.5px solid rgba(104, 122, 158, 0.08)",
    "& .MuiSvgIcon-root": {
      fontSize: 21,
      cursor: "pointer",
      color:
        theme.palette.mode === "light"
          ? props.color || "#98a0b1"
          : props.color || "#98A0B1FF",
      transform: props.transform || "",
    },
  })
);

const ActionBtn: React.FC<ActionBtnProps> = ({
  onClick,
  children,
  color,
  tooltipTitle,
  transform,
  buttonName = "action",
  rowIndex,
}) => {
  const btnClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    onClick(event);
  };
  return (
    <Tooltip title={tooltipTitle || ""}>
      <StyledIconButton
        props={{ color: color, transform: transform }}
        edge="start"
        onClick={btnClick}
        size="large"
        data-testid={buttonName + "-button-" + rowIndex}
      >
        {children}
      </StyledIconButton>
    </Tooltip>
  );
};

export default ActionBtn;
