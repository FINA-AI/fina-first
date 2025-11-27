import MessagesToolbar from "./MessagesToolbar";
import { Box } from "@mui/system";
import { Grid } from "@mui/material";
import MessageCard from "./MessageCard";
import React, { useState } from "react";
import Paging from "../common/Paging/Paging";
import { useTranslation } from "react-i18next";
import GhostBtn from "../common/Button/GhostBtn";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  deleteMessages,
  loadRootMessageRecipientUserIds,
  saveMessage,
  sendSavedMessage,
} from "../../api/services/messagesService";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { useSnackbar } from "notistack";
import CommunicatorCardSkeleton from "./CommunicatorCardSkeleton";
import MessagesAndNotificationsReviewModal from "./Modals/MessagesAndNotificationsReviewModal";
import MessagesCreateModal from "./Modals/MessagesCreateModal";
import { styled } from "@mui/material/styles";
import { MessageFilterType, RootMessageType } from "../../types/messages.type";
import { UIEventType } from "../../types/common.type";
import { CommReviewModalType } from "../../types/communicator.common.type";

interface MessagesMainGridProps {
  setActiveMessage: (message: RootMessageType | null) => void;
  activeMessage: RootMessageType | null;
  setLoadingMask: (loading: boolean) => void;
  messages: RootMessageType[];
  messagesLength: number;
  pagingPage: number;
  setPagingPage: (page: number) => void;
  pagingLimit: number;
  setPagingLimit: (limit: number) => void;
  setFilterValue: (value: string) => void;
  loading: boolean;
  gridContainerRef: any;
  loadMessagesFunction(filterObj?: MessageFilterType): void;
  onMarkAllReadMessages(): void;
  onFilterChange(filterObj: MessageFilterType): void;
  closeMessageUserCard(): void;
}

const StyledRoot = styled(Box)(({ theme }) => ({
  boxSizing: "border-box",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: (theme as any).palette.paperBackground,
  borderRadius: "inherit",
}));

const StyledMainGridWrapper = styled(Grid)({
  height: "100%",
  padding: "4px 8px 12px 8px",
  overflow: "auto",
});

const StyledToolbar = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  borderBottom: (theme as any).palette.borderColor,
  width: "100%",
}));

const StyledToolbarContent = styled(Box)({
  padding: "12px 16px",
  display: "flex",
  alignItems: "center",
  width: "100%",
});

const StyledPagination = styled(Box)(({ theme }) => ({
  ...(theme as any).pagePaging({ size: "default" }),
}));

const StyledSecondaryToolbarAndItemText = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
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
}));

const StyledSecondaryToolbarItemSelected = styled(Box)({
  color: "#FFFFFF",
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "40px",
  textTransform: "capitalize",
});

const StyledCancel = styled("span")({
  cursor: "pointer",
  fontWeight: 500,
  fontSize: "12px",
  lineHeight: "18px",
  textTransform: "capitalize",
  borderLeft: "1px solid #FFFFFF",
  padding: "5px 12px",
  color: "#FFFFFF",
});

const MessagesMainGrid: React.FC<MessagesMainGridProps> = ({
  activeMessage,
  setActiveMessage,
  setLoadingMask,
  messages,
  messagesLength,
  pagingPage,
  setPagingPage,
  pagingLimit,
  setPagingLimit,
  setFilterValue,
  loadMessagesFunction,
  loading,
  onFilterChange,
  onMarkAllReadMessages,
  gridContainerRef,
  closeMessageUserCard,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<number[]>([]);
  const { openErrorWindow } = useErrorWindow();
  const [recipients, setRecipients] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const [editMode, setEditMode] = useState(false);
  const [reviewModal, setReviewModal] = useState<CommReviewModalType>({
    open: false,
    message: null,
    files: [],
  });

  const onPagingLimitChange = (limit: number) => {
    setPagingPage(1);
    setPagingLimit(limit);
  };

  const onMessageEdit = (messageData: RootMessageType) => {
    if (messageData.id !== activeMessage?.id) {
      loadRecipientUserIds(messageData.id);
      setActiveMessage(messageData);
    }

    setOpen(true);
    setEditMode(true);
  };
  const onCreateButtonClick = () => {
    setOpen(true);
    setEditMode(false);
  };

  const onMessageClick = (event: UIEventType, data: RootMessageType) => {
    if (activeMessage && activeMessage.id === data.id) {
      return;
    }

    setLoadingMask(true);
    if (event.ctrlKey || event.metaKey) {
      if (selectedMessages.includes(data.id)) {
        setSelectedMessages([...selectedMessages.filter((m) => m !== data.id)]);
      } else {
        setSelectedMessages([...selectedMessages, data.id]);
      }
    } else {
      loadRecipientUserIds(data.id);
      setActiveMessage(data);
    }
  };

  const loadRecipientUserIds = (messageId: number) => {
    loadRootMessageRecipientUserIds(messageId).then((resp) => {
      setRecipients(resp.data);
    });
  };

  const onSelectedMessageCancel = () => {
    setSelectedMessages([]);
  };

  const onSelectedMessageDelete = (data?: number[]) => {
    deleteMessages(data ? data : selectedMessages)
      .then(() => {
        closeMessageUserCard();

        if (!data) {
          setSelectedMessages([]);
        } else {
          if (selectedMessages.includes(data[0])) {
            setSelectedMessages([
              ...selectedMessages.filter((message) => message !== data[0]),
            ]);
          }
        }
        enqueueSnackbar(t("deleted"), { variant: "success" });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => {
        loadMessagesFunction();
      });
  };

  const getScrollPosition = (e: any) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      //api call here
    }
  };

  const onMessageSave = async (formData: FormData) => {
    const resp = await saveMessage(formData);
    setPagingPage(1);
    if (resp.data.id === activeMessage?.id) {
      loadRecipientUserIds(resp.data.id);
      setActiveMessage({ ...resp.data });
    }

    loadMessagesFunction();
    return resp;
  };

  const onSavedMessageSend = (messageId: number) => {
    sendSavedMessage(messageId)
      .then(() => loadMessagesFunction())
      .then(() => {
        const selected = messages.find((m) => m.id === messageId);
        if (!selected) return;

        setActiveMessage({ ...selected });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  let selectedMessagesLength = selectedMessages.length;

  return (
    <StyledRoot data-testid={"messages-main-thread"}>
      <StyledToolbar>
        <StyledToolbarContent>
          <MessagesToolbar
            onCreateButtonClick={onCreateButtonClick}
            activeSecondaryToolbar={selectedMessagesLength > 1}
            setFilterValue={setFilterValue}
            onFilterChange={onFilterChange}
            onMarkAllReadMessages={onMarkAllReadMessages}
            setActiveMessage={setActiveMessage}
            setPagingPage={setPagingPage}
          />
        </StyledToolbarContent>
        {selectedMessagesLength > 1 && (
          <StyledSecondaryToolbarAndItemText>
            <StyledSecondaryToolbarItemSelected
              style={{ minWidth: "fit-content" }}
            >
              {t("selectedItemsFi", { itemsLength: selectedMessagesLength })}
            </StyledSecondaryToolbarItemSelected>
            <GhostBtn
              onClick={() => onSelectedMessageDelete()}
              style={{ marginLeft: "10px", marginRight: "10px", minWidth: 120 }}
              children={
                <>
                  {t("DELETE_ALL")}
                  <DeleteIcon style={{ marginLeft: "8px" }} />
                </>
              }
            />
            <StyledCancel onClick={() => onSelectedMessageCancel()}>
              {t("cancel")}
            </StyledCancel>
          </StyledSecondaryToolbarAndItemText>
        )}
      </StyledToolbar>
      <StyledMainGridWrapper
        container
        onScroll={getScrollPosition}
        ref={gridContainerRef}
      >
        <Grid item xs={12} data-testid={"messages-grid"}>
          {loading ? (
            <CommunicatorCardSkeleton />
          ) : (
            messages.map((item, index) => {
              return (
                <MessageCard
                  key={index}
                  data={item}
                  index={index}
                  onMessageClick={onMessageClick}
                  isSelected={selectedMessages.includes(item.id)}
                  onSelectedMessageDelete={onSelectedMessageDelete}
                  onMessageEdit={onMessageEdit}
                  activeMessage={activeMessage}
                  setReviewModal={setReviewModal}
                  onMessageSend={onSavedMessageSend}
                />
              );
            })
          )}
        </Grid>
      </StyledMainGridWrapper>
      <StyledPagination>
        <Paging
          onRowsPerPageChange={(limit) => onPagingLimitChange(limit)}
          onPageChange={(number) => setPagingPage(number)}
          totalNumOfRows={messagesLength}
          initialPage={pagingPage}
          initialRowsPerPage={pagingLimit}
        />
      </StyledPagination>
      {open && (
        <MessagesCreateModal
          open={open}
          onClose={() => {
            setOpen(false);
            setEditMode(false);
          }}
          saveMessage={onMessageSave}
          selectedItem={editMode ? activeMessage : null}
          recipients={editMode ? recipients : []}
          isNotification={false}
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

export default MessagesMainGrid;
