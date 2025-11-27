import * as React from "react";
import { ReactElement } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import SystemNotificationsDetails from "./SystemNotificationsDetails";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import { sendText } from "../../redux/actions/notificationWebsocketActions";
import { CircularProgress, Tooltip } from "@mui/material";
import { EmptyMessagesRecipient } from "../../api/ui/icons/EmptyMessagesRecipient";
import { styled } from "@mui/system";
import {
  SystemNotification,
  SystemNotificationCount,
} from "../../types/systemNotification.type";

interface SystemNotificationsToolbarProps {
  messages: SystemNotification[];
  setMessages: (messages: SystemNotification[]) => void;
  pagingLimit: number;
  pagingPage: number;
  numberOfNotifications: SystemNotificationCount;
  setNumberOfNotifications: (notCount: SystemNotificationCount) => void;
  unreadNotificationCount: number;
  setPagingPage: (page: number) => void;
  isLoading: boolean;
  isExpand: boolean;
  sendReadText: (value: string) => void;

  loadSystemNotifications(filter: string): void;
}

const StyledMarkAllAsReadText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "isExpand",
})<{ isExpand: boolean }>(({ isExpand }) => ({
  cursor: "pointer",
  fontSize: 11,
  fontWeight: 500,
  color: "#2962FF",
  marginRight: "16px",
  alignItems: "end",
  paddingBottom: "8px",
  minWidth: "100px",
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
  maxWidth: isExpand ? "200px" : "30px",
}));

const StyledCircularProgBox = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
});

const StyledEmptyRecipientTitle = styled(Typography)({
  fontWeight: 600,
  fontSize: "14px",
  lineHeight: "160%",
  textTransform: "capitalize",
  maxWidth: "300px",
  textAlign: "center",
  marginTop: "20px",
  marginBottom: "10px",
});

const StyledHeader = styled(Box)(({ theme }) => ({
  background: theme.palette.paperBackground,
  borderBottom: theme.palette.borderColor,
  display: "flex",
  justifyContent: "space-between",
  height: "40px",
  paddingLeft: "12px",
}));

const SystemNotificationsToolbar: React.FC<SystemNotificationsToolbarProps> = ({
  loadSystemNotifications,
  messages,
  setMessages,
  pagingLimit,
  pagingPage,
  setNumberOfNotifications,
  numberOfNotifications,
  sendReadText,
  unreadNotificationCount,
  setPagingPage,
  isLoading,
  isExpand,
}) => {
  const { t } = useTranslation();
  const [type, setType] = React.useState<number>(0);
  const prevUnreadNotificationsCountRef = React.useRef(0);

  React.useEffect(() => {
    if (unreadNotificationCount >= prevUnreadNotificationsCountRef.current) {
      switch (type) {
        case 0:
          loadSystemNotifications("ALL");
          break;
        case 1:
          loadSystemNotifications("READ");
          break;
        case 2:
          loadSystemNotifications("UNREAD");
          break;
        default:
          break;
      }
    }
    prevUnreadNotificationsCountRef.current = unreadNotificationCount;
  }, [unreadNotificationCount, pagingLimit, pagingPage]);

  const handleChange = (event: any, type: number) => {
    setType(type);
  };

  const handleTabClick = (type: string) => {
    setPagingPage(1);
    loadSystemNotifications(type);
  };

  const markAsAllReadFunc = () => {
    if (numberOfNotifications.UNREAD !== 0) {
      sendReadText("ALL");
      numberOfNotifications.READ = numberOfNotifications.ALL;
      numberOfNotifications.UNREAD = 0;
      setNumberOfNotifications({ ...numberOfNotifications });

      messages.map((message) => {
        if (type !== 2) {
          if (message.datetimeRead === null) {
            message.datetimeRead = 1;
            setMessages([...messages, message]);
          }
        } else {
          setMessages([]);
        }
      });
    }
  };

  const EmptySystemNotifications = () => {
    const { t } = useTranslation();

    return (
      <Box
        display={"flex"}
        width={"100%"}
        height={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"column"}
      >
        <EmptyMessagesRecipient />
        <StyledEmptyRecipientTitle>
          {t("emptySystemNotifications")}
        </StyledEmptyRecipientTitle>
      </Box>
    );
  };

  const TabPanel = (props: {
    children: ReactElement;
    index: number;
    value: number;
  }) => {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        style={{ height: "100%" }}
      >
        {value === index && (
          <Box sx={{ p: 0, height: "100%" }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  };

  const a11yProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <StyledHeader data-testid={"header"}>
        <Tabs
          value={type}
          onChange={handleChange}
          aria-label="basic tabs example"
          sx={{
            "& .MuiTab-root": {
              fontWeight: 500,
              fontSize: "11px",
              lineHeight: "12px",
              textTransform: "none",
              minWidth: "39px",
              backgroundColor: "inherit",
            },
            minHeight: "40px",
          }}
        >
          <Tab
            onClick={() => handleTabClick("ALL")}
            label={`${t("all")} (${
              numberOfNotifications.ALL > 0 ? numberOfNotifications.ALL : 0
            }) `}
            {...a11yProps(0)}
            data-testid={"all-tab"}
          />

          <Tab
            onClick={() => handleTabClick("READ")}
            label={`${t("read")} (${
              numberOfNotifications.READ > 0 ? numberOfNotifications.READ : 0
            }) `}
            {...a11yProps(1)}
            data-testid={"read-tab"}
          />
          <Tab
            onClick={() => handleTabClick("UNREAD")}
            label={`${t("unread")} (${
              numberOfNotifications.UNREAD > 0
                ? numberOfNotifications.UNREAD
                : 0
            }) `}
            {...a11yProps(2)}
            data-testid={"unread-tab"}
          />
        </Tabs>
        <Box display={"flex"} alignItems={"end"}>
          <Tooltip
            title={t("markAllasRead")}
            PopperProps={{
              sx: (theme: any) => ({
                zIndex: theme.general.maxZIndex + 3,
              }),
            }}
          >
            <StyledMarkAllAsReadText
              isExpand={isExpand}
              onClick={() => {
                markAsAllReadFunc();
              }}
              data-testid={"mark-all-as-read"}
            >
              {t("markAllasRead")}
            </StyledMarkAllAsReadText>
          </Tooltip>
        </Box>
      </StyledHeader>
      {isLoading ? (
        <StyledCircularProgBox>
          <CircularProgress />
        </StyledCircularProgBox>
      ) : messages.length === 0 ? (
        <EmptySystemNotifications />
      ) : (
        <Box height={isExpand ? "540px" : "340px"} overflow={"auto"}>
          <TabPanel value={type} index={0}>
            <Box height={"100px"}>
              <SystemNotificationsDetails
                messages={messages}
                setMessages={setMessages}
                numberOfNotifications={numberOfNotifications}
                setNumberOfNotifications={setNumberOfNotifications}
                type={type}
              />
            </Box>
          </TabPanel>
          <TabPanel value={type} index={1}>
            <SystemNotificationsDetails
              messages={messages}
              setMessages={setMessages}
              numberOfNotifications={numberOfNotifications}
              setNumberOfNotifications={setNumberOfNotifications}
              type={type}
            />
          </TabPanel>
          <TabPanel value={type} index={2}>
            <SystemNotificationsDetails
              messages={messages}
              setMessages={setMessages}
              numberOfNotifications={numberOfNotifications}
              setNumberOfNotifications={setNumberOfNotifications}
              type={type}
            />
          </TabPanel>
        </Box>
      )}
    </Box>
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
  sendReadText: bindActionCreators(sendText, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SystemNotificationsToolbar);
