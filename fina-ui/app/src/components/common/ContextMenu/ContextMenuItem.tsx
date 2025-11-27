import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import React, { ReactElement } from "react";
import { styled } from "@mui/material/styles";

interface ContextMenuItemProps {
  icon: ReactElement;
  name: string;
  onClick: () => void;
  disabled: boolean;
}

const StyledMenuItem = styled(MenuItem)(() => ({
  backgroundColor: "",
  pointerEvents: "all",
}));

const ContextMenuItem: React.FC<ContextMenuItemProps> = ({
  icon,
  name,
  onClick,
  disabled,
}) => {
  return (
    <StyledMenuItem
      disabled={disabled}
      onClick={() => !disabled && onClick()}
      data-testid={name}
    >
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText>{name}</ListItemText>
    </StyledMenuItem>
  );
};

export default ContextMenuItem;
