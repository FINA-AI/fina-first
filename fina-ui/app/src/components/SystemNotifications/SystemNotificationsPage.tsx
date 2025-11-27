import { Box, styled } from "@mui/system";
import { useTranslation } from "react-i18next";
import { IconButton, Popover, Typography } from "@mui/material";
import SystemNotificationsToolbar from "./SystemNotificationsToolbar";
import CloseBtn from "../common/Button/CloseBtn";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import Paging from "../common/Paging/Paging";
import React, { useState } from "react";
import {
  SystemNotification,
  SystemNotificationCount,
} from "../../types/systemNotification.type";

interface SystemNotificationsPageProps {
  showSystemNotifications: boolean;
  setShowSystemNotifications: (showSystemNotifications: boolean) => void;
  messages: SystemNotification[];
  setMessages: (messages: SystemNotification[]) => void;
  pagingPage: number;
  pagingLimit: number;
  setPagingPage: (page: number) => void;
  setPagingLimit: (limit: number) => void;
  totalResults: number;
  setHovered: (hovered: boolean) => void;
  isLoading: boolean;
  numberOfNotifications: SystemNotificationCount;
  setNumberOfNotifications: (notCount: SystemNotificationCount) => void;
  anchorEl: Element | null;
  loadSystemNotifications(filter: string): void;
  onPagingLimitChange(limit: number): void;
}

const StyledPopover = styled(Popover)(({ theme }: { theme: any }) => ({
  zIndex: theme.general.maxZIndex + 2,
  position: "absolute",
  background: "rgba(0,0,0, 0.5)",
}));

const commonStyles = {
  "& .MuiSvgIcon-root": {
    width: "18px",
    height: "18px",
    fontSize: "18px",
  },
  width: "18px",
  height: "18px",
};

const StyledUnfoldLessIcon = styled(UnfoldLessIcon)({
  ...commonStyles,
});

const StyledUnfoldMoreIcon = styled(UnfoldMoreIcon)({
  ...commonStyles,
});

const StyledHeader = styled(Box)(({ theme }: { theme: any }) => ({
  ...theme.modalHeader,
  borderBottom: "none",
  display: "flex",
  alignItems: "center",
}));

const StyledTitleWrapper = styled(Typography)({
  width: "100%",
  fontWeight: "600",
  fontSize: "13px",
  lineHeight: "20px",
  textTransform: "capitalize",
});

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  transform: "rotate(-45deg)",
  color: "#9AA7BE",
  padding: "1px",
  top: "0.51px",
  width: "18px",
  height: "18px",
  background: "inherit",
  border: "inherit",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255, 0.05)"
        : "rgba(80,80,80, 0.05)",
    borderRadius: "12px",
  },
}));

const StyledFooter = styled(Box)(({ theme }) => ({
  padding: "8px 0px",
  background: theme.palette.paperBackground,
}));

const StyledContentBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isExpand",
})<{ isExpand: boolean }>(({ theme, isExpand }) => ({
  width: "480px",
  height: "480px",
  borderRadius: 4,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  background: theme.palette.mode === "dark" ? "#253143" : "#FFFFFF",
  ...(isExpand && {
    width: "680px !important",
    height: "680px !important",
  }),
}));

const SystemNotificationsPage: React.FC<SystemNotificationsPageProps> = ({
  showSystemNotifications,
  setShowSystemNotifications,
  messages,
  setMessages,
  pagingPage,
  setPagingPage,
  pagingLimit,
  onPagingLimitChange,
  totalResults,
  loadSystemNotifications,
  setHovered,
  isLoading,
  numberOfNotifications,
  setNumberOfNotifications,
  anchorEl,
}) => {
  const { t } = useTranslation();
  const [isExpand, setIsExpand] = useState(false);

  const handleClosePopover = () => {
    setHovered(false);
    setShowSystemNotifications(false);
  };

  return (
    <>
      <StyledPopover
        anchorEl={anchorEl}
        open={showSystemNotifications}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        PaperProps={{
          style: {
            overflow: "hidden",
          },
        }}
      >
        <StyledContentBox
          isExpand={isExpand}
          data-testid={"system-notification"}
        >
          <StyledHeader flex={0}>
            <StyledTitleWrapper>{t("systemNotifications")}</StyledTitleWrapper>
            <Box
              sx={{ display: "flex", alignItems: "center", marginLeft: "auto" }}
            >
              {isExpand ? (
                <StyledIconButton
                  onClick={() => {
                    setIsExpand(false);
                  }}
                >
                  <StyledUnfoldLessIcon />
                </StyledIconButton>
              ) : (
                <StyledIconButton
                  onClick={() => {
                    setIsExpand(true);
                  }}
                >
                  <StyledUnfoldMoreIcon />
                </StyledIconButton>
              )}
              <CloseBtn onClick={handleClosePopover} />
            </Box>
          </StyledHeader>

          <Box
            display={"flex"}
            justifyContent={"space-between"}
            flexDirection={"column"}
            height={"100%"}
          >
            <SystemNotificationsToolbar
              loadSystemNotifications={loadSystemNotifications}
              messages={messages}
              setMessages={setMessages}
              numberOfNotifications={numberOfNotifications}
              setNumberOfNotifications={setNumberOfNotifications}
              setPagingPage={setPagingPage}
              isLoading={isLoading}
              isExpand={isExpand}
              pagingPage={pagingPage}
              pagingLimit={pagingLimit}
            />
            <StyledFooter>
              {messages.length > 0 && (
                <Paging
                  isMini={true}
                  totalNumOfRows={totalResults}
                  initialPage={pagingPage}
                  onRowsPerPageChange={(number) => onPagingLimitChange(number)}
                  onPageChange={(number) => setPagingPage(number)}
                  initialRowsPerPage={pagingLimit}
                />
              )}
            </StyledFooter>
          </Box>
        </StyledContentBox>
      </StyledPopover>
    </>
  );
};

export default SystemNotificationsPage;
