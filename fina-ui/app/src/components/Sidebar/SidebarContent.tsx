import React, { memo, useRef, useState } from "react";
import MainMenu from "./MainMenu";
import {
  StyledDrawer,
  StyledMainMenuBox,
  StyledMenuContainer,
  StyledTopHeader,
} from "./sidebar-jss";
import { IconButton } from "@mui/material";
import BottomMenu from "./BottomMenu";
import Divider from "@mui/material/Divider";
import menuLink from "../../api/ui/menuLink";
import PushPinIcon from "@mui/icons-material/PushPin";
import { grey } from "@mui/material/colors";
import { useTheme } from "@mui/material/styles";
import { getCommunicatorMenus } from "../../api/ui/menu";
import { MainMenuItem } from "../../types/mainMenu.type";
import { Config } from "../../types/config.type";

interface SidebarContentProps {
  userAttr: { avatar: string; name: Record<string, string> };
  dataMenu: MainMenuItem[];
  config: Config;
  openLocked: boolean;
  setOpenLocked: (open: boolean) => void;
  onMenuClick: (item: MainMenuItem) => void;
}

function SidebarContent(props: SidebarContentProps) {
  const { dataMenu, userAttr, config, openLocked, setOpenLocked, onMenuClick } =
    props;
  const refSidebar = useRef(null);
  const [isHovered, setHovered] = useState(false);
  const theme = useTheme();

  return (
    <StyledDrawer id={"app_sidebar"} _openLocked={openLocked || isHovered}>
      <StyledMenuContainer
        display={"flex"}
        height={"100%"}
        flexDirection={"column"}
        id="sidebar"
        ref={refSidebar}
      >
        <StyledTopHeader>
          <a href={`#${menuLink.dashboard}`}>
            <img
              src={process.env.PUBLIC_URL + "/images/fina-menu-logo.png"}
              alt="fina-logo"
            />
          </a>
          <IconButton
            onClick={() => {
              setOpenLocked(!openLocked);
            }}
            sx={{
              border: "inherit",
              background: "inherit",
              "&:hover": { backgroundColor: " rgba(0, 0, 0, 0.05)" },
            }}
          >
            <PushPinIcon
              sx={{
                color: !openLocked ? grey[200] : theme.palette.secondary.main,
              }}
              style={{ transform: openLocked ? "rotate(45deg)" : "" }}
            />
          </IconButton>
        </StyledTopHeader>
        <Divider sx={{ backgroundColor: "#4F5863" }} />
        <StyledMainMenuBox>
          <MainMenu dataMenu={dataMenu} onMenuClick={onMenuClick} />
        </StyledMainMenuBox>
        <Divider sx={{ backgroundColor: "#4F5863" }} />
        <div style={{ paddingTop: "20px" }}>
          <BottomMenu
            dataMenu={getCommunicatorMenus(config)}
            config={config}
            userAttr={userAttr}
            setHovered={setHovered}
            onBottomMenuClick={onMenuClick}
          />
        </div>
      </StyledMenuContainer>
    </StyledDrawer>
  );
}

export default memo(SidebarContent);
