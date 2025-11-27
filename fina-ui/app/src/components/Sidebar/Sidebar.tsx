import React, { Fragment } from "react";
import SidebarContent from "./SidebarContent";
import Drawer from "@mui/material/Drawer";
import { styled } from "@mui/system";
import { MainMenuItem } from "../../types/mainMenu.type";
import { Config } from "../../types/config.type";

interface SidebarProps {
  userAttr: { avatar: string; name: Record<string, string> };
  dataMenu: MainMenuItem[];
  config: Config;
  openLocked: boolean;
  setOpenLocked: (open: boolean) => void;
  onMenuClick: (item: MainMenuItem) => void;
}

const StyledDrawer = styled(Drawer)(({ theme }: { theme: any }) => ({
  zIndex: theme.zIndex.drawer,
}));

function Sidebar(props: SidebarProps) {
  const { dataMenu, userAttr, config, openLocked, setOpenLocked, onMenuClick } =
    props;

  return (
    <Fragment>
      <StyledDrawer variant="permanent" anchor={"left"} open={false}>
        <SidebarContent
          dataMenu={dataMenu}
          userAttr={userAttr}
          config={config}
          openLocked={openLocked}
          setOpenLocked={setOpenLocked}
          onMenuClick={onMenuClick}
        />
      </StyledDrawer>
    </Fragment>
  );
}

export default Sidebar;
