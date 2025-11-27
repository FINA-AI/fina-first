import React, { memo, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { ListItemText } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import useConfig from "../../hoc/config/useConfig";
import MenuItem from "./MenuItem";
import { MainMenuItem } from "../../types/mainMenu.type";
import { UIEventType } from "../../types/common.type";

interface MainMenuProps {
  dataMenu: MainMenuItem[];
  onMenuClick: (item: MainMenuItem) => void;
}

function MainMenu(props: MainMenuProps) {
  let location = useLocation();

  const { dataMenu = [], onMenuClick } = props;
  const { config }: any = useConfig();

  const { t } = useTranslation();
  const [openedMenu, setOpenedMenu] = useState(["dashboard"]);
  const history = useHistory();

  useEffect(() => {
    const menuKey = location.pathname.split("/")[1];
    if (openedMenu.indexOf(menuKey) < 0) {
      setOpenedMenu([...openedMenu, menuKey]);
    }
  }, []);

  const handleOpenMenu = useCallback(
    (event: UIEventType, item: MainMenuItem) => {
      history.push(item.subLink ? item.subLink : item.link);
      onMenuClick(item);
      setOpenedMenu((prevState) => {
        if (openedMenu.indexOf(item.key) < 0) {
          return [...prevState, item.key];
        } else {
          return prevState;
        }
      });
    },
    []
  );

  const isSelected = (item: MainMenuItem) => {
    return "/" + location.pathname.split("/")[1] === item.link;
  };

  const getMenus = (menuArray: MainMenuItem[]) => {
    return menuArray
      .filter(
        (m) =>
          m.permissions.length === 0 ||
          (m.permissions.some((item) => config.permissions.includes(item)) &&
            !m?.hidden)
      )
      .map((item) => {
        if (item.groupSeparator && item.name) {
          return (
            <ListItem key={item.key}>
              <ListItemText primary={t(item.name)} />
            </ListItem>
          );
        }

        if (item.link) {
          return (
            <MenuItem
              key={item.key}
              item={item}
              isSelected={isSelected(item)}
              handleMenuClick={handleOpenMenu}
              isOpened={openedMenu.indexOf(item.key) < 0}
              MenuIcon={item.icon}
            />
          );
        }
        return null;
      });
  };

  return <div>{getMenus(dataMenu)}</div>;
}

export default memo(MainMenu);
