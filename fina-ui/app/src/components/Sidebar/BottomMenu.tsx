import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useSnackbar } from "notistack";
import { PERMISSIONS } from "../../api/permissions";
import { countUnreadMessages } from "../../api/services/messagesService";
import { bindActionCreators } from "@reduxjs/toolkit";
import { updateUnreadMessageCounterAction } from "../../redux/actions/messagesActions";
import BottomMItem from "./BottomMenuItem";
import LangChooserItem from "./LangChooserItem";
import UserMenuItem from "./UserMenuItem";
import { useTranslation } from "react-i18next";
import menuLink from "../../api/ui/menuLink";
import { MainMenuItem } from "../../types/mainMenu.type";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Config } from "../../types/config.type";

interface BottomMenuProps extends RouteComponentProps {
  userAttr: { avatar: string; name: Record<string, string> };
  dataMenu: MainMenuItem[];
  config: Config;
  newMessageCounter: number;
  unreadMessageCount: number;
  onBottomMenuClick: (item: MainMenuItem) => void;
  setHovered: (hovered: boolean) => void;
  setUnreadMessageCount: (count: number) => void;
}

const BottomMenu: React.FC<BottomMenuProps> = ({
  config,
  userAttr,
  newMessageCounter = 0,
  unreadMessageCount,
  setHovered,
  setUnreadMessageCount,
  dataMenu,
  onBottomMenuClick,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  useEffect(() => {
    let permission = config.permissions.find(
      (permission: string) =>
        permission === PERMISSIONS.COMMUNICATOR_MESSAGES_REVIEW
    );
    if (permission) {
      countUnreadMessages().then((res) => {
        setUnreadMessageCount(res.data);
      });
    }
  }, [newMessageCounter]);

  useEffect(() => {
    if (newMessageCounter > 0) {
      enqueueSnackbar("New Message Received", {
        variant: "success",
      });
    }
  }, [newMessageCounter]);

  return (
    <div style={{ paddingBottom: "20px" }}>
      {dataMenu.map((menu) => {
        return (
          <BottomMItem
            text={t(menu.key)}
            link={menu.link}
            Icon={menu.icon}
            onClick={() => onBottomMenuClick(menu)}
            {...(menu.link === menuLink.messages
              ? {
                  title: t(menu.key),
                  badgeTooltip: t("unreadMessages", {
                    unreadMessageCount: unreadMessageCount,
                  }),
                  badgeContent:
                    unreadMessageCount > 0
                      ? unreadMessageCount
                      : config.newMessages,
                  hideTooltip: unreadMessageCount <= 9,
                }
              : {})}
          />
        );
      })}
      <LangChooserItem setHovered={setHovered} />
      <UserMenuItem
        setHovered={setHovered}
        config={config}
        userAttr={userAttr}
      />
    </div>
  );
};

const reducer = "messages";

const communicatorWebsocket = "communicatorWebsocket";
const mapStateToProps = (state: any) => ({
  unreadMessageCount: state.getIn([reducer, "unreadMessageCount"]),
  newMessageCounter: state.getIn([communicatorWebsocket, "communicator"])[
    "newMessageCounter"
  ],
});

const mapDispatchToProps = (dispatch: any) => ({
  setUnreadMessageCount: bindActionCreators(
    updateUnreadMessageCounterAction,
    dispatch
  ),
});

const LeftUserMenuWrapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(BottomMenu);

export default withRouter(LeftUserMenuWrapped);
