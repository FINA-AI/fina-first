import React, { useEffect } from "react";
import { Box } from "@mui/material";
import Paging from "../../common/Paging/Paging";
import withLoading from "../../../hoc/withLoading";
import CommunicatorRecipientGridToolbar from "../../Communicator/recipient/grid/toolbar/CommunicatorRecipientGridToolbar";
import CommunicatorRecipientGrid from "../../Communicator/recipient/grid/CommunicatorRecipientGrid";
import NotificationRecipientCard from "./NotificationRecipientCard";
import ClearIcon from "@mui/icons-material/Clear";
import { useTranslation } from "react-i18next";
import { EmptyNotificationRecipient } from "../../../api/ui/icons/EmptyNotificationRecipient";
import { styled } from "@mui/material/styles";
import {
  NotificationRecipientType,
  RootNotificationType,
} from "../../../types/notifications.type";
import {
  RecipientFilterType,
  RecipientType,
  RootMessageType,
} from "../../../types/messages.type";
import { CommRecipientType } from "../../../types/communicator.common.type";

export interface NotificationRecipientsGridProps {
  closeCardFunction: () => void;
  onPagingLimitChange: (limit: number) => void;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  dataLength: number;
  page: number;
  pagingLimit: number;
  setSelectedRecipient: (item: CommRecipientType) => void;
  data: NotificationRecipientType[];
  selectedRootMessage: RootMessageType | RootNotificationType;
  recipients: RecipientType[];
  initData: (filters?: RecipientFilterType) => void;
  setSelectedItem: (item: CommRecipientType) => void;
}

const StyledRoot = styled(Box)(({ theme }) => ({
  boxSizing: "border-box",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  "& .Mui-expanded": {
    margin: "0px !important",
  },
  backgroundColor: (theme as any).palette.paperBackground,
  borderRadius: "4px",
}));

const StyledPagination = styled(Box)(({ theme }) => ({
  ...(theme as any).pagePaging({ size: "default" }),
}));

const NotificationRecipientsGrid: React.FC<NotificationRecipientsGridProps> = ({
  closeCardFunction,
  onPagingLimitChange,
  setPage,
  dataLength,
  page,
  pagingLimit,
  setSelectedRecipient,
  data,
  selectedRootMessage,
  recipients,
  initData,
  setSelectedItem,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    setSelectedItem(null);
  }, [selectedRootMessage]);

  const ToolbarActionButtons = () => {
    return (
      <ClearIcon
        onClick={() => {
          closeCardFunction();
        }}
        style={{ marginLeft: "8px" }}
        data-testid={"clear-icon"}
      />
    );
  };

  return (
    <StyledRoot data-testid={"notification-recipient-thread"}>
      <CommunicatorRecipientGridToolbar
        dataLength={dataLength}
        initData={initData}
        selectedRootMessage={selectedRootMessage}
        setSelectedItem={setSelectedItem}
        setSelectedRecipient={setSelectedRecipient}
        setPage={setPage}
        recipients={recipients}
        toolbarActionButtons={<ToolbarActionButtons />}
      />
      <CommunicatorRecipientGrid
        dataLength={dataLength}
        recipients={data}
        setSelectedRecipient={setSelectedRecipient}
        setSelectedItem={setSelectedItem}
        RecipientCardComponent={NotificationRecipientCard}
        emptyGridMainText={t("emptyNotificationRecipients")}
        emptyGridAdditionalText={t("selectCardToSeeNotificationRecipients")}
        EmptyGridIcon={EmptyNotificationRecipient}
      />
      <StyledPagination>
        {dataLength !== 0 && (
          <Paging
            onRowsPerPageChange={(number) => onPagingLimitChange(number)}
            onPageChange={(number) => setPage(number)}
            totalNumOfRows={dataLength}
            initialPage={page}
            initialRowsPerPage={pagingLimit}
          />
        )}
      </StyledPagination>
    </StyledRoot>
  );
};

export default withLoading(NotificationRecipientsGrid);
