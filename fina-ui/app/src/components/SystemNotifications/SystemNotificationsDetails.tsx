import { Divider, Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import { bindActionCreators } from "@reduxjs/toolkit";
import { connect } from "react-redux";
import { sendText } from "../../redux/actions/notificationWebsocketActions";

import {
  getDefaultDateFormat,
  getFormattedDateTimeValue,
} from "../../util/appUtil";
import {
  SystemNotification,
  SystemNotificationCount,
} from "../../types/systemNotification.type";
import React from "react";

interface SystemNotificationsDetailsProps {
  messages: SystemNotification[];
  setMessages: (messages: SystemNotification[]) => void;
  numberOfNotifications: SystemNotificationCount;
  setNumberOfNotifications: (notCount: SystemNotificationCount) => void;
  sendReadText: (id: number) => void;
  type: number;
}

const StyledRoot = styled(Box)({
  display: "flex",
  flexDirection: "column",
  padding: "12px 16px",
  cursor: "pointer",
});

const StyledDetails = styled(Typography)({
  display: "flex",
  fontSize: 11,
  lineHeight: "12px",
  fontWeight: 500,
  color: "#98A7BC",
});

const StyledActiveChat = styled(Box)({
  background: "#FF4128",
  width: "6px",
  height: "6px",
  borderRadius: "100px",
  marginTop: "4px",
  marginRight: "8px",
});

const StyledMessage = styled(Typography)(({ theme }) => ({
  fontSize: 11,
  lineHeight: "16px",
  fontWeight: 400,
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#2C3644",
  paddingBottom: "8px",
  width: "100%",
}));

const SystemNotificationsDetails: React.FC<SystemNotificationsDetailsProps> = ({
  messages,
  setMessages,
  numberOfNotifications,
  setNumberOfNotifications,
  sendReadText,
  type,
}) => {
  const getMinutesAgo = (notificationTime: any) => {
    const currentTime: any = new Date();
    const timeDiff = Math.floor((currentTime - notificationTime) / (1000 * 60));

    if (timeDiff < 60) {
      return `${timeDiff} minutes ago | `;
    } else if (timeDiff < 1440) {
      const hours = Math.floor(timeDiff / 60);
      return `${hours} hour${hours > 1 ? "s" : ""} ago | `;
    }
  };

  const handleNotificationClick = (
    messageId: number,
    message: SystemNotification
  ) => {
    if (message.datetimeRead === null) {
      sendReadText(messageId);
      if (type !== 2) {
        message.datetimeRead = 1;
      } else {
        const updatedMessages = messages.filter((msg) => msg.id !== messageId);
        setMessages(updatedMessages);
      }
      if (numberOfNotifications.UNREAD !== 0) {
        numberOfNotifications.UNREAD = numberOfNotifications.UNREAD - 1;
        numberOfNotifications.READ = numberOfNotifications.READ + 1;
        setNumberOfNotifications({ ...numberOfNotifications });
      }
    }
  };

  return (
    <>
      {messages?.map((message) => (
        <>
          <StyledRoot
            onClick={() => {
              handleNotificationClick(message.id, message);
            }}
          >
            <Box display={"flex"} justifyContent={"flex-start"}>
              {!message.datetimeRead && <StyledActiveChat />}
              <StyledMessage
                dangerouslySetInnerHTML={{ __html: message.notification }}
              />
            </Box>
            <Box display={"flex"} justifyContent={"flex-end"}>
              <StyledDetails paddingRight={"3px"}>
                {getMinutesAgo(new Date(message.datetimeAdded))}
              </StyledDetails>
              <StyledDetails>
                {getFormattedDateTimeValue(
                  message.datetimeAdded,
                  getDefaultDateFormat()
                )}
              </StyledDetails>
            </Box>
          </StyledRoot>
          <Divider
            sx={(theme: any) => ({
              color: theme.palette.borderColor,
              marginTop: "8px",
            })}
          />
        </>
      ))}
    </>
  );
};

const mapStateToProps = () => ({});
const mapDispatchToProps = (dispatch: any) => ({
  sendReadText: bindActionCreators(sendText, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SystemNotificationsDetails);
