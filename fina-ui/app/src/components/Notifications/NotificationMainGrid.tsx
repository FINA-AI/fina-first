import { Box } from "@mui/system";
import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import Paging from "../common/Paging/Paging";
import { useTranslation } from "react-i18next";
import GhostBtn from "../common/Button/GhostBtn";
import DeleteIcon from "@mui/icons-material/Delete";
import NotificationToolbar from "./NotificationToolbar";
import MessagesCreateModal from "../Messages/Modals/MessagesCreateModal";
import {
  loadNotificationRecipientUserIds,
  sendNotifications,
} from "../../api/services/notificationService";
import MessagesAndNotificationsReviewModal from "../Messages/Modals/MessagesAndNotificationsReviewModal";
import NotificationCard from "./NotificationUserGrid/NotificationCard";
import CommunicatorCardSkeleton from "../Messages/CommunicatorCardSkeleton";
import { styled } from "@mui/material/styles";
import {
  NotificationFilterType,
  RootNotificationType,
} from "../../types/notifications.type";
import { TypeFiltersType } from "./NotificationsPage";
import { CommReviewModalType } from "../../types/communicator.common.type";

export interface NotificationMainGridProps {
  data: RootNotificationType[];
  notificationDeleteHandler: (ids?: number[]) => void;
  setSelectedNotification: (notification: RootNotificationType | null) => void;
  selectedNotification: RootNotificationType | null;
  notificationPublishHandler: (data: RootNotificationType) => void;
  selectedNotifications: number[];
  setSelectedNotifications: (notificationIds: number[]) => void;
  notificationsLength: number;
  onPagingLimitChange: (limit: number) => void;
  setPagingPage: (page: number) => void;
  pagingPage: number;
  pagingLimit: number;
  initNotifications: () => void;
  onFilterChange: (filters: NotificationFilterType | {}) => void;
  setLoadingMask: (loading: boolean) => void;
  typeFilters: TypeFiltersType;
  setTypeFilters: React.Dispatch<React.SetStateAction<TypeFiltersType>>;
  gridContainerRef: any;
  loading: boolean;
}

const StyledRoot = styled(Box)(({ theme }) => ({
  boxSizing: "border-box",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: (theme as any).palette.paperBackground,
  borderRadius: "inherit",
}));

const StyledToolbar = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  borderBottom: (theme as any).palette.borderColor,
  width: "100%",
}));

const StyledToolbarContent = styled(Box)({
  padding: "10px 24px",
  display: "flex",
  alignItems: "center",
  width: "100%",
});

const StyledPagePagination = styled(Box)(({ theme }) => ({
  ...(theme as any).pagePaging({ size: "default" }),
}));

const StyledSecondaryToolbar = styled(Box)({
  backgroundColor: "#2962FF",
  maxWidth: "300px",
  display: "flex",
  height: "100%",
  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.08)",
  borderRadius: "8px 8px 0px 8px",
  justifyContent: "center",
  alignItems: "center",
  padding: "0px 20px 0px 20px",
  fontWeight: 600,
  fontSize: "14px",
  lineHeight: "32px",
  textTransform: "capitalize",
});

const StyledDivider = styled(Box)({
  minHeight: "30px",
  minWidth: "2px",
  display: "inline-block",
  background: "#FFFFFF",
  margin: "0 10px 0 10px",
});

const StyledCancel = styled("span")({
  fontWeight: 500,
  fontSize: "12px",
  lineHeight: "18px",
  textTransform: "capitalize",
  cursor: "pointer",
});

const NotificationMainGrid: React.FC<NotificationMainGridProps> = ({
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
  setLoadingMask,
  typeFilters,
  setTypeFilters,
  gridContainerRef,
  loading,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [recipients, setRecipients] = useState([]);
  const [reviewModal, setReviewModal] = useState<CommReviewModalType>({
    open: false,
    message: null,
    files: [],
  });

  useEffect(() => {
    setSelectedNotification(null);
  }, [typeFilters]);

  const loadRecipientUserIds = (notificationId: number) => {
    loadNotificationRecipientUserIds(notificationId).then((resp) => {
      setRecipients(resp.data);
    });
  };

  const onNotificationEdit = (notification: RootNotificationType) => {
    if (notification.id !== selectedNotification?.id) {
      loadRecipientUserIds(notification.id);
      setSelectedNotification(notification);
    }

    setOpen(true);
    setEditMode(true);
  };
  const onCreateButtonClick = () => {
    setOpen(true);
    setEditMode(false);
  };

  const onNotificationClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    data: RootNotificationType
  ) => {
    if (selectedNotification && selectedNotification.id === data.id) {
      return;
    }

    setLoadingMask(true);
    if (event.ctrlKey || event.metaKey) {
      if (selectedNotifications.includes(data.id)) {
        setSelectedNotifications([
          ...selectedNotifications.filter((m) => m !== data.id),
        ]);
      } else {
        setSelectedNotifications([...selectedNotifications, data.id]);
      }
    } else {
      loadRecipientUserIds(data.id);
      setSelectedNotification(data);
    }
  };

  const onSelectedMessageCancel = () => {
    setSelectedNotifications([]);
  };

  const onSaveNotification = async (formData: FormData) => {
    const resp = await sendNotifications(formData);
    setPagingPage(1);
    if (resp.data.id === selectedNotification?.id) {
      loadRecipientUserIds(resp.data.id);
      setSelectedNotification({ ...resp.data });
    }
    initNotifications();
    return resp;
  };

  let selectedNotificationsLength = selectedNotifications.length;

  return (
    <StyledRoot data-testid={"notification-main-thread"}>
      <StyledToolbar>
        <StyledToolbarContent>
          <NotificationToolbar
            onCreateButtonClick={onCreateButtonClick}
            activeSecondaryToolbar={selectedNotificationsLength > 1}
            setSelectedNotification={setSelectedNotification}
            onFilterChange={onFilterChange}
            typeFilters={typeFilters}
            setTypeFilters={setTypeFilters}
          />
        </StyledToolbarContent>
        {selectedNotificationsLength > 1 && (
          <StyledSecondaryToolbar>
            <span style={{ minWidth: "fit-content" }}>
              {t("selectedItemsFi", {
                itemsLength: selectedNotificationsLength,
              })}
            </span>
            <GhostBtn
              onClick={() => notificationDeleteHandler()}
              height={32}
              style={{ marginLeft: "10px" }}
              children={
                <>
                  {t("delete")}
                  <DeleteIcon />
                </>
              }
            />
            <StyledDivider />
            <StyledCancel onClick={() => onSelectedMessageCancel()}>
              {t("cancel")}
            </StyledCancel>
          </StyledSecondaryToolbar>
        )}
      </StyledToolbar>
      <Grid
        container
        ref={gridContainerRef}
        sx={{ height: "100%", padding: "4px 8px", overflow: "auto" }}
      >
        <Grid item xs={12} data-testid={"notification-grid"}>
          {loading ? (
            <CommunicatorCardSkeleton />
          ) : (
            data.map((item, index) => (
              <NotificationCard
                key={index}
                index={index}
                onNotificationClick={onNotificationClick}
                isSelected={selectedNotification?.id === item?.id}
                onSelectedNotificationDelete={notificationDeleteHandler}
                onNotificationEdit={onNotificationEdit}
                publishHandler={notificationPublishHandler}
                activeNotification={selectedNotification}
                setReviewModal={setReviewModal}
                notification={item}
              />
            ))
          )}
        </Grid>
      </Grid>
      <StyledPagePagination>
        <Paging
          onRowsPerPageChange={(limit) => onPagingLimitChange(limit)}
          onPageChange={(number) => setPagingPage(number)}
          totalNumOfRows={notificationsLength}
          initialPage={pagingPage}
          initialRowsPerPage={pagingLimit}
        />
      </StyledPagePagination>
      {open && (
        <MessagesCreateModal
          open={open}
          onClose={() => {
            setOpen(false);
            setEditMode(false);
          }}
          saveMessage={onSaveNotification}
          selectedItem={editMode ? selectedNotification : null}
          recipients={editMode ? recipients : []}
          isNotification={true}
        />
      )}
      {reviewModal.open && (
        <MessagesAndNotificationsReviewModal
          setReviewModal={setReviewModal}
          reviewModal={reviewModal}
        />
      )}
    </StyledRoot>
  );
};

export default NotificationMainGrid;
