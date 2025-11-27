import {
  ClickAwayListener,
  IconButton,
  ListItemText,
  Popper,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import React, { useEffect, useState } from "react";
import ListItemIcon from "@mui/material/ListItemIcon";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ChatIcon from "@mui/icons-material/Chat";
import LogoutIcon from "@mui/icons-material/Logout";
import { Box, styled } from "@mui/system";
import ChangePasswordModal from "./ChangePasswordModal";
import SystemNotificationsContainer from "../../containers/SystemNotifications/SystemNotificationsContainer";
import { getNewSystemNotificationCount } from "../../api/services/systemNotificationService";
import { connect } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import { setUnreadNotificationCount } from "../../redux/actions/notificationWebsocketActions";
import { PERMISSIONS } from "../../api/permissions";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import LogoutModal from "./LogoutModal";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import { showThemeEditorAction } from "../../redux/actions/uiActions";
import { UIEventType, UserAuthTypeEnum } from "../../types/common.type";
import { Config } from "../../types/config.type";

interface ProfileMenuProps {
  setHovered: (hovered: boolean) => void;
  config: Config;
  unreadNotificationCount: number;
  setUnreadNotificationCount: (count: number) => void;
  changeThemeEditorVisibility: (visibility: boolean) => void;
}
const StyledPopper = styled(Popper)<{ onClose: any }>(({ theme }: any) => ({
  boxShadow:
    theme.palette.mode === "dark"
      ? "0px 0px 10px 2px rgb(21 23 27 / 90%)"
      : "rgba(80, 80, 80, 0.2) 0px 5px 5px -3px, rgba(80, 80, 80, 0.14) 0px 8px 10px 1px, rgba(80, 80, 80, 0.12) 0px 3px 14px 2px",
  backgroundColor: theme.palette.paperBackground,
  zIndex: theme.zIndex.modal + 2,
  inset: "auto auto -50px 105px !important",
  borderRadius: "6px",
}));

const StyledProfileMenuItem = styled(Box)(({ theme }) => ({
  margin: "8px 8px",
  display: "flex",
  flexDirection: "row",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.buttons.secondary.hover,
  },
  "& .MuiListItemIcon-root": {
    alignItems: "center",
  },
}));

const StyledIconButton = styled(IconButton)(() => ({
  border: "inherit",
  background: "inherit",
  "&:hover": { backgroundColor: " rgba(0, 0, 0, 0.05)" },
}));

const StyledActiveChat = styled("div")(() => ({
  background: "#FF4128",
  width: "4px",
  height: "4px",
  borderRadius: "34px",
  position: "absolute",
  right: "5px",
  top: "5px",
}));

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  setHovered,
  config,
  unreadNotificationCount,
  setUnreadNotificationCount,
  changeThemeEditorVisibility,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
  const [showPasswordModal, setShowPasswordModal] = React.useState(false);
  const [showSystemNotifications, setShowSystemNotifications] = useState(false);
  const prevUnreadNotificationsCountRef = React.useRef(0);
  const chatIconRef = React.useRef(null);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const open = Boolean(anchorEl);

  const hideChangePassword =
    config.authenticationType === UserAuthTypeEnum.LDAP ||
    config.authenticationType === UserAuthTypeEnum.MIXED;

  useEffect(() => {
    let permission = config.permissions.find(
      (permission: string) => permission === PERMISSIONS.FINA_NOTIFICATIONS
    );
    if (permission) {
      getNewSystemNotificationCount().then((resp) => {
        setUnreadNotificationCount(resp.data);
        prevUnreadNotificationsCountRef.current = resp.data;
      });
    }
  }, []);

  React.useEffect(() => {
    if (unreadNotificationCount > prevUnreadNotificationsCountRef.current) {
      enqueueSnackbar(t("newNotificationReceived"), {
        variant: "success",
      });
    }
    prevUnreadNotificationsCountRef.current = unreadNotificationCount;
  }, [unreadNotificationCount]);

  const handleClick = (event: UIEventType) => {
    setAnchorEl(event.currentTarget);
    setHovered(true);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setHovered(false);
  };

  const handleLogoutClick = () => {
    setOpenLogoutModal(true);
  };

  const ThemeButton = () => {
    return (
      <StyledProfileMenuItem
        onClick={() => {
          changeThemeEditorVisibility(true);
          handleClose();
        }}
      >
        <ListItemIcon>
          <PaletteOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary={"Theme Mode"} />
      </StyledProfileMenuItem>
    );
  };

  const CustomPopover = () => {
    return (
      <ClickAwayListener onClickAway={handleClose}>
        <StyledPopper
          id={"basic-menu"}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
        >
          <ThemeButton />
          {!hideChangePassword && (
            <StyledProfileMenuItem
              onClick={() => {
                setShowPasswordModal(true);
                handleClose();
              }}
            >
              <ListItemIcon>
                <LockOpenIcon />
              </ListItemIcon>
              <ListItemText primary={"Change Password"} />
            </StyledProfileMenuItem>
          )}
          <StyledProfileMenuItem
            onClick={() => {
              handleClose();
              handleLogoutClick();
            }}
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary={"Logout"} />
          </StyledProfileMenuItem>
        </StyledPopper>
      </ClickAwayListener>
    );
  };

  return (
    <>
      <Box display={"flex"} flexDirection={"row"}>
        {config.permissions.find(
          (permission: string) => permission === PERMISSIONS.FINA_NOTIFICATIONS
        ) && (
          <>
            <StyledIconButton
              ref={chatIconRef}
              color="primary"
              aria-label="chat"
              onClick={() => {
                setHovered(true);
                setShowSystemNotifications(true);
              }}
            >
              {unreadNotificationCount > 0 && <StyledActiveChat />}
              <ChatIcon fontSize={"small"} style={{ color: "#FFFFFF" }} />
            </StyledIconButton>
            <SystemNotificationsContainer
              anchorEl={chatIconRef.current}
              setHovered={setHovered}
              showSystemNotifications={showSystemNotifications}
              setShowSystemNotifications={setShowSystemNotifications}
            />
          </>
        )}

        <StyledIconButton
          color="primary"
          aria-label="upload picture"
          onClick={handleClick}
        >
          <ArrowDropDownIcon fontSize={"small"} style={{ color: "#ffffff" }} />
        </StyledIconButton>
        <CustomPopover />

        <ChangePasswordModal
          showPasswordModal={showPasswordModal}
          setShowPasswordModal={setShowPasswordModal}
        />
      </Box>
      {openLogoutModal && (
        <LogoutModal
          setOpenLogoutModal={setOpenLogoutModal}
          openLogoutModal={openLogoutModal}
          modalContent={"areusurelogout"}
        />
      )}
    </>
  );
};

const notificationWebsocketReducer = "notificationWebSocket";
const mapStateToProps = (state: any) => ({
  unreadNotificationCount: state.getIn([
    notificationWebsocketReducer,
    "unreadNotificationCount",
  ]),
});

const mapDispatchToProps = (dispatch: any) => ({
  setUnreadNotificationCount: bindActionCreators(
    setUnreadNotificationCount,
    dispatch
  ),
  changeThemeEditorVisibility: bindActionCreators(
    showThemeEditorAction,
    dispatch
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileMenu);
