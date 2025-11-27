import React, { useState } from "react";
import {
  getSystemNotifications,
  getSystemNotificationsTotalNumber,
} from "../../api/services/systemNotificationService";
import SystemNotificationsPage from "../../components/SystemNotifications/SystemNotificationsPage";
import {
  SystemNotification,
  SystemNotificationCount,
} from "../../types/systemNotification.type";

interface SystemNotificationsContainerProps {
  showSystemNotifications: boolean;
  setShowSystemNotifications: (showSystemNotifications: boolean) => void;
  setHovered: (hovered: boolean) => void;
  anchorEl: Element | null;
}

const SystemNotificationsContainer: React.FC<
  SystemNotificationsContainerProps
> = ({
  showSystemNotifications,
  setShowSystemNotifications,
  setHovered,
  anchorEl,
}) => {
  const [messages, setMessages] = useState<SystemNotification[]>([]);
  const [pagingPage, setPagingPage] = useState(1);
  const [pagingLimit, setPagingLimit] = useState(25);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [numberOfNotifications, setNumberOfNotifications] =
    useState<SystemNotificationCount>({} as SystemNotificationCount);

  const loadSystemNotifications = (filter: string) => {
    setIsLoading(true);
    getSystemNotifications(pagingPage, pagingLimit, filter).then((resp) => {
      setTotalResults(resp.data.totalResults);
      setMessages(resp.data.list);
      getSystemNotificationsTotalNumber().then((resp) => {
        setNumberOfNotifications(resp.data);
      });
      setIsLoading(false);
    });
  };

  const onPagingLimitChange = (limit: number) => {
    setPagingPage(1);
    setPagingLimit(limit);
  };
  return (
    <SystemNotificationsPage
      messages={messages}
      setMessages={setMessages}
      onPagingLimitChange={onPagingLimitChange}
      pagingPage={pagingPage}
      setPagingPage={setPagingPage}
      pagingLimit={pagingLimit}
      setPagingLimit={setPagingLimit}
      totalResults={totalResults}
      showSystemNotifications={showSystemNotifications}
      setShowSystemNotifications={setShowSystemNotifications}
      loadSystemNotifications={loadSystemNotifications}
      setHovered={setHovered}
      isLoading={isLoading}
      numberOfNotifications={numberOfNotifications}
      setNumberOfNotifications={setNumberOfNotifications}
      anchorEl={anchorEl}
    />
  );
};

export default SystemNotificationsContainer;
