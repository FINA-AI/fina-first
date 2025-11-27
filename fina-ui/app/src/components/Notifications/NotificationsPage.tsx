import { Box } from "@mui/system";
import { Grid, Paper, Typography } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import NotificationMainGrid from "./NotificationMainGrid";
import NotificationRecipientsContainer from "../../containers/Notifications/NotificationRecipientsContainer";
import { styled } from "@mui/material/styles";
import {
  NotificationFilterType,
  RootNotificationType,
} from "../../types/notifications.type";

export interface NotificationPageProps {
  data: RootNotificationType[];
  notificationDeleteHandler: (ids?: number[]) => void;
  setSelectedNotification: (notification: RootNotificationType | null) => void;
  selectedNotification: RootNotificationType | null;
  notificationPublishHandler: (notification: RootNotificationType) => void;
  selectedNotifications: number[];
  setSelectedNotifications: (ids: number[]) => void;
  notificationsLength: number;
  onPagingLimitChange: (limit: number) => void;
  setPagingPage: (page: number) => void;
  pagingPage: number;
  pagingLimit: number;
  initNotifications: () => void;
  onFilterChange: (filters: NotificationFilterType | {}) => void;
  gridContainerRef: any;
  loading: boolean;
}

export type TypeFiltersType = {
  all: boolean;
  personal: boolean;
  system: boolean;
};

const StyledMainLayout = styled(Box)(({ theme }) => ({
  ...(theme as any).mainLayout,
}));

const StyledHeaderText = styled(Typography)(({ theme }) => ({
  ...(theme as any).pageTitle,
}));

const StyledRoot = styled(Box)({
  height: "100%",
  boxSizing: "border-box",
  display: "flex",
  width: "100%",
  flexDirection: "column",
});

const StyledPaper = styled(Paper)({
  width: "100%",
  height: "100%",
  boxShadow: "none",
  borderRadius: "4px",
});

const StyledGridContainer = styled(Grid)(({ theme }) => ({
  boxSizing: "border-box",
  marginTop: 0,
  paddingTop: 0,
  overflow: "hidden",
  borderRadius: (theme as any).rounded.smallRadius,
  height: "100%",
}));

const StyledGridItem = styled(Grid)({
  paddingTop: 0,
  height: "100%",
  overflow: "hidden",
  flex: 0,
  transition: "400ms",
});

const NotificationsPage: React.FC<NotificationPageProps> = ({
  data,
  notificationDeleteHandler,
  setSelectedNotification,
  selectedNotification,
  notificationPublishHandler,
  selectedNotifications,
  setSelectedNotifications,
  notificationsLength,
  onPagingLimitChange,
  setPagingPage,
  pagingPage,
  pagingLimit,
  initNotifications,
  onFilterChange,
  gridContainerRef,
  loading,
}) => {
  const { t } = useTranslation();
  const [loadingMask, setLoadingMask] = useState(false);
  const [typeFilters, setTypeFilters] = useState<TypeFiltersType>({
    all: true,
    personal: false,
    system: false,
  });

  return (
    <StyledMainLayout display={"flex"} flexDirection={"column"} height={"100%"}>
      <StyledRoot>
        <StyledHeaderText>{t("notifications")}</StyledHeaderText>
        <StyledGridContainer
          container
          spacing={1}
          height={"100%"}
          direction={"row"}
          xs={12}
          item
        >
          <StyledGridItem item style={{ flex: 6 }}>
            <StyledPaper
              sx={{ borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}
            >
              <NotificationMainGrid
                data={data}
                notificationDeleteHandler={notificationDeleteHandler}
                setSelectedNotification={setSelectedNotification}
                selectedNotification={selectedNotification}
                notificationPublishHandler={notificationPublishHandler}
                selectedNotifications={selectedNotifications}
                setSelectedNotifications={setSelectedNotifications}
                notificationsLength={notificationsLength}
                onPagingLimitChange={onPagingLimitChange}
                setPagingPage={setPagingPage}
                pagingPage={pagingPage}
                pagingLimit={pagingLimit}
                initNotifications={initNotifications}
                onFilterChange={onFilterChange}
                setLoadingMask={setLoadingMask}
                typeFilters={typeFilters}
                setTypeFilters={setTypeFilters}
                gridContainerRef={gridContainerRef}
                loading={loading}
              />
            </StyledPaper>
          </StyledGridItem>
          <StyledGridItem item style={{ flex: 6 }}>
            <StyledPaper sx={{ borderTopRightRadius: 8 }}>
              <Box style={{ width: "100%", height: "100%" }}>
                <NotificationRecipientsContainer
                  selectedNotification={selectedNotification}
                  loadingMask={loadingMask}
                  setLoadingMask={setLoadingMask}
                  typeFilters={typeFilters}
                  setSelectedNotification={setSelectedNotification}
                />
              </Box>
            </StyledPaper>
          </StyledGridItem>
        </StyledGridContainer>
      </StyledRoot>
    </StyledMainLayout>
  );
};

export default NotificationsPage;
