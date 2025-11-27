import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import {
  getNotificationUsers,
  loadRecipientsData,
} from "../../api/services/notificationService";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { useTranslation } from "react-i18next";
import NotificationRecipientGrid from "../../components/Notifications/NotificationUserGrid/NotificationRecipientGrid";
import { TypeFiltersType } from "../../components/Notifications/NotificationsPage";
import { RootNotificationType } from "../../types/notifications.type";
import { RecipientFilterType } from "../../types/messages.type";

interface NotificationRecipientsContainerProps {
  selectedNotification: RootNotificationType | null;
  loadingMask: boolean;
  setLoadingMask: (loading: boolean) => void;
  typeFilters: TypeFiltersType;
  setSelectedNotification: (notification: RootNotificationType | null) => void;
}

const NotificationRecipientsContainer: React.FC<
  NotificationRecipientsContainerProps
> = ({
  selectedNotification,
  loadingMask,
  setLoadingMask,
  typeFilters,
  setSelectedNotification,
}) => {
  const { openErrorWindow } = useErrorWindow();
  const { t } = useTranslation();

  const [users, setUsers] = useState([]);
  const [usersLength, setUsersLength] = useState(0);
  const [pagingPage, setPagingPage] = useState(1);
  const [pagingLimit, setPagingLimit] = useState(25);
  const [recipientData, setRecipientData] = useState([]);
  const [selectedItem, setSelectedItem] = useState();
  const [filterObj, setFilterObj] = useState({});

  useEffect(() => {
    if (pagingPage > 1) {
      setPagingPage(1);
    } else {
      initData(filterObj);
    }
  }, [selectedNotification]);

  useEffect(() => {
    initData(filterObj);
  }, [pagingPage, pagingLimit]);

  useEffect(() => {
    setUsers([]);
  }, [typeFilters]);

  useEffect(() => {
    if (selectedNotification) {
      initRecipientData();
    } else {
      clearRecipientData();
    }
  }, [selectedNotification?.id]);

  const closeCardFunction = () => {
    setSelectedNotification(null);
  };

  const clearRecipientData = () => {
    setUsers([]);
    setUsersLength(0);
    setFilterObj({});
    setPagingPage(1);
  };

  const initData = (recipientFilter: RecipientFilterType) => {
    if (selectedNotification) {
      const filter = recipientFilter ?? typeFilters;
      setFilterObj(filter);
      getNotificationUsers(
        selectedNotification.id,
        pagingPage,
        pagingLimit,
        filter
      )
        .then((res) => {
          let data = res.data;
          if (data) {
            setUsers(data.list);
            setUsersLength(data["totalResults"]);
            setLoadingMask(false);
          }
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
        });
    }
  };

  const onPagingLimitChange = (limit: number) => {
    setPagingPage(1);
    setPagingLimit(limit);
  };

  const initRecipientData = async () => {
    try {
      const res = await loadRecipientsData(selectedNotification?.id);
      setRecipientData(res.data);
    } catch (err) {
      openErrorWindow(err, t("error"), true);
    }
  };

  return (
    <Box width={"100%"} height={"100%"}>
      <NotificationRecipientGrid
        onPagingLimitChange={onPagingLimitChange}
        setPage={setPagingPage}
        pagingLimit={pagingLimit}
        page={pagingPage}
        dataLength={usersLength}
        data={users}
        loading={loadingMask}
        initData={initData}
        recipients={recipientData}
        selectedRootMessage={selectedNotification}
        setSelectedItem={setSelectedItem}
        selectedItem={selectedItem}
        closeCardFunction={closeCardFunction}
      />
    </Box>
  );
};

export default NotificationRecipientsContainer;
