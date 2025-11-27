import React from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import ListItem, { ListItemBaseProps } from "@mui/material/ListItem";
import useConfig from "../../../hoc/config/useConfig";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";

interface MenuItem {
  name: string;
  route: string;
  icon: React.ReactNode;
}

interface EmsMenuProps {
  menu: MenuItem[];
}

interface ListItemProps extends ListItemBaseProps {
  exact?: boolean;
  to?: string;
  component?: React.ComponentType<any>;
}

const StyledListItem = styled(ListItem)<ListItemProps>(({ theme }: any) => ({
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  "& .MuiSvgIcon-root": {
    color: "rgb(176, 176, 176)",
  },
  padding: "0px",
  color: "rgba(0, 0, 0, 0.87)",
  "&.active": {
    backgroundColor: theme.palette.action.select,
  },
}));

const StyledListItemContent = styled(Box)(({ theme }) => ({
  height: "15px",
  padding: 5,
  display: "flex",
  fontSize: "13px",
  alignItems: "center",
  cursor: "pointer",
  marginLeft: "20px",
  width: "100%",
  overflow: "hidden",
  "& .MuiSvgIcon-root": {
    width: "20px",
    height: "20px",
    marginRight: "8px",
    color: theme.palette.mode === "dark" ? "#FFFFFF" : "#b0b0b0",
  },
}));

const StyledListItemTitle = styled(Box)(({ theme }: any) => ({
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  lineBreak: "anywhere",
  color: theme.palette.textColor,
}));

const LinkBtn = React.forwardRef(function LinkBtn(props: any, ref) {
  return <NavLink to={props.to} {...props} innerRef={ref} />;
});

const EmsMenu: React.FC<EmsMenuProps> = ({ menu }) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();

  const GetListItem = (item: any, index: number) => {
    return (
      <StyledListItem
        key={index.toString()}
        exact={false}
        component={LinkBtn}
        to={item.link}
        data-testid={item.name}
      >
        <StyledListItemContent>
          {item.icon}
          <StyledListItemTitle>{t(item.name)}</StyledListItemTitle>
        </StyledListItemContent>
      </StyledListItem>
    );
  };

  return (
    <div data-testid={"menu-container"}>
      {menu.map((item: any, index: number) => {
        return item?.permission
          ? hasPermission(item.permission) && GetListItem(item, index)
          : GetListItem(item, index);
      })}
    </div>
  );
};

export default EmsMenu;
