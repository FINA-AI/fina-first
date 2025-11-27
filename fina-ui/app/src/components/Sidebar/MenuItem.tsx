import { Badge, Chip, Icon, ListItemButton, ListItemIcon } from "@mui/material";
import React, { memo } from "react";
import SidebarLabel from "./SidebarLabel";
import { getLanguage } from "../../util/appUtil";
import { styled } from "@mui/system";
import { drawerWidthMinimized } from "./sidebar-jss";
import { MainMenuItem } from "../../types/mainMenu.type";
import { UIEventType } from "../../types/common.type";

interface MenuItemProps {
  item: MainMenuItem;
  isSelected: boolean;
  isOpened: boolean;
  MenuIcon?: React.ElementType;
  handleMenuClick(event: UIEventType, item: MainMenuItem): void;
}

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
  paddingLeft: theme.spacing(3),
  [theme.breakpoints.between(900, 1300)]: {
    width: `${drawerWidthMinimized}px !important`,
    paddingLeft: theme.spacing(2),
  },
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark" ? "#344258" : "rgba(255,255,255,0.51)",
  },
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  color: "white",
  [theme.breakpoints.between(900, 1300)]: {
    minWidth: "40px",
    color: "white",
  },
}));

const MenuItem: React.FC<MenuItemProps> = ({
  item,
  isSelected,
  handleMenuClick,
  isOpened = false,
  MenuIcon,
}) => {
  const langCode = getLanguage();

  return (
    <StyledListItemButton
      key={item.key}
      data-testid={`menu_${item.key}`}
      autoFocus={isSelected}
      selected={isSelected}
      onClick={(event) => handleMenuClick(event, item)}
    >
      {MenuIcon && (
        <StyledListItemIcon>
          <Badge
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: "#5cdbf1",
                color: "#5cdbf1",
              },
            }}
            variant="dot"
            invisible={isOpened}
          >
            <Icon>
              <MenuIcon />
            </Icon>
          </Badge>
        </StyledListItemIcon>
      )}
      <SidebarLabel item={item} langCode={langCode} />
      {item.badge && (
        <Chip
          color="primary"
          label={item.badge}
          sx={{
            fontSize: "0.6rem",
          }}
        />
      )}
    </StyledListItemButton>
  );
};

export default memo(MenuItem);
