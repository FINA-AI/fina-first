import NotificationsPage from "../../components/Notifications/NotificationsPage";
import {
  deleteNotification,
  loadNotifications,
  publishNotifications,
} from "../../api/services/notificationService";
import { useEffect, useRef, useState } from "react";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { getFormattedDateValue } from "../../util/appUtil";
import {
  NotificationFilterType,
  RootNotificationType,
} from "../../types/notifications.type";

const NotificationsContainer = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { openErrorWindow } = useErrorWindow();
  const [data, setData] = useState<RootNotificationType[]>([]);
  const [notificationsLength, setNotificationsLength] = useState(0);
  const [selectedNotification, setSelectedNotification] =
    useState<RootNotificationType | null>(null);
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>(
    []
  );
  const [pagingPage, setPagingPage] = useState(1);
  const [pagingLimit, setPagingLimit] = useState(25);
  const filterDataRef = useRef({});
  const gridContainerRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initNotifications();
  }, [pagingPage, pagingLimit]);

  const onPagingLimitChange = (limit: number) => {
    setPagingPage(1);
    setPagingLimit(limit);
  };

  const initNotifications = async (filter?: NotificationFilterType | {}) => {
    setLoading(true);
    let filterData = { ...filterDataRef.current } as NotificationFilterType;

    if (filterData["dateAfter"]) {
      filterData["dateAfter"] = getFormattedDateValue(
        filterData["dateAfter"],
        "dd/MM/yyyy"
      );
    }

    if (filterData["dateBefore"]) {
      filterData["dateBefore"] = getFormattedDateValue(
        filterData["dateBefore"],
        "dd/MM/yyyy"
      );
    }

    const res = await loadNotifications(
      pagingPage,
      pagingLimit,
      filter ?? filterData
    );
    const data = res.data;
    if (data) {
      const arr: RootNotificationType[] = [];
      data.list.map((item: RootNotificationType) => {
        const newObj = { ...item };
        delete newObj.publishDate;
        newObj.sendDate = item.publishDate;
        arr.push(newObj);
        return newObj;
      });
      setData(arr);
      setNotificationsLength(data.totalResults ? data.totalResults : 0);
      if (gridContainerRef.current) {
        gridContainerRef.current.scrollTo(0, 0);
      }
    }
    setLoading(false);
  };

  const notificationDeleteHandler = (notificationId?: number[]) => {
    deleteNotification(notificationId ? notificationId : selectedNotifications)
      .then(() => {
        setSelectedNotification(null);

        if (!notificationId) {
          setSelectedNotifications([]);
        } else {
          const findNotification = data.find((n) => n.id === notificationId[0]);
          if (
            findNotification &&
            selectedNotifications.includes(findNotification.id)
          ) {
            setSelectedNotifications([
              ...selectedNotifications.filter(
                (message) => message !== findNotification.id
              ),
            ]);
          }
        }
        enqueueSnackbar(t("deleted"), { variant: "success" });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => {
        initNotifications();
      });
  };

  const notificationPublishHandler = (data: RootNotificationType) => {
    publishNotifications([data.id])
      .then(() => {
        initNotifications();
        data.status = "PUBLISHED";
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const onFilterChange = (filter: NotificationFilterType = {}) => {
    if (filter["dateAfter"]) {
      filter["dateAfter"] = getFormattedDateValue(
        filter["dateAfter"],
        "dd/MM/yyyy"
      );
    }

    if (filter["dateBefore"]) {
      filter["dateBefore"] = getFormattedDateValue(
        filter["dateBefore"],
        "dd/MM/yyyy"
      );
    }
    filterDataRef.current = { ...filter };
    if (pagingPage === 1) {
      initNotifications(filter);
    }
    setPagingPage(1);
  };

  return (
    <NotificationsPage
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
      gridContainerRef={gridContainerRef}
      loading={loading}
    />
  );
};

export default NotificationsContainer;
