import React, { useEffect, useState } from "react";
import { Box, IconButton } from "@mui/material";
import Paging from "../../common/Paging/Paging";
import withLoading from "../../../hoc/withLoading";
import CommunicatorRecipientGridToolbar from "../../Communicator/recipient/grid/toolbar/CommunicatorRecipientGridToolbar";
import CommunicatorRecipientGrid from "../../Communicator/recipient/grid/CommunicatorRecipientGrid";
import ConfirmModal from "../../common/Modal/ConfirmModal";
import { EmptyMessagesRecipient } from "../../../api/ui/icons/EmptyMessagesRecipient";
import { useTranslation } from "react-i18next";
import ClearIcon from "@mui/icons-material/Clear";
import MarkChatReadIcon from "@mui/icons-material/MarkChatRead";
import Tooltip from "../../common/Tooltip/Tooltip";
import { styled } from "@mui/material/styles";
import MessageRecipientCard from "./MessageRecipientCard";
import {
  RecipientFilterType,
  RecipientType,
} from "../../../types/messages.type";
import {
  CommRecipientType,
  CommSelectedRoot,
} from "../../../types/communicator.common.type";
import { SaveIcon } from "../../../api/ui/icons/SaveIcon";

export interface MessageRecipientsGridProps {
  closeCardFunction: VoidFunction;
  onPagingLimitChange: (limit: number) => void;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  dataLength: number;
  page: number;
  pagingLimit: number;
  setSelectedRecipient: (recipient: CommRecipientType) => void;
  data: CommRecipientType[];
  onClearRecipients: VoidFunction;
  selectedRootMessage: CommSelectedRoot;
  recipients: CommRecipientType[];
  setFilteredRecipient: (recipients: RecipientType[] | null) => void;
  selectedItem: RecipientType | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<CommRecipientType>>;
  initData: (filters?: RecipientFilterType) => void;
  onMarkAllReadThreads(): void;
  onRecipientMessageSelect(recipient: CommRecipientType): void;
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
}));

const StyledPagination = styled(Box)(({ theme }) => ({
  ...(theme as any).pagePaging({ size: "default" }),
}));

const StyledChatReadIcon = styled(MarkChatReadIcon)(({ theme }) => ({
  fontSize: "medium",
  color: `${theme.palette.primary.main} !important`,
}));

const MessageRecipientsGrid: React.FC<MessageRecipientsGridProps> = ({
  closeCardFunction,
  onPagingLimitChange,
  setPage,
  dataLength,
  page,
  pagingLimit,
  setSelectedRecipient,
  data,
  onClearRecipients,
  onRecipientMessageSelect,
  onMarkAllReadThreads,
  selectedRootMessage,
  recipients,
  initData,
  selectedItem,
  setSelectedItem,
}) => {
  const [openMarkAllReadModal, setOpenMarkAllReadModal] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setSelectedItem(null);
  }, [selectedRootMessage]);

  const ToolbarActionButtons = () => {
    return (
      <>
        <Tooltip title={t("markallthreadsasread")}>
          <span>
            <IconButton
              disabled={dataLength === 0}
              style={{ marginLeft: 5, border: "none" }}
              onClick={() => setOpenMarkAllReadModal(true)}
              data-testid={"mark-icon-button"}
            >
              <StyledChatReadIcon />
            </IconButton>
          </span>
        </Tooltip>
        <ClearIcon
          onClick={() => {
            closeCardFunction();
            onClearRecipients();
          }}
          style={{ marginLeft: "8px" }}
          data-testid={"clear-icon"}
        />
      </>
    );
  };

  return (
    <StyledRoot data-testid={"message-recipient-thread"}>
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
        RecipientCardComponent={MessageRecipientCard}
        selectedItemId={selectedItem?.id}
        onItemSelect={onRecipientMessageSelect}
        emptyGridMainText={t("EmptyMessagesRecipient")}
        emptyGridAdditionalText={t("selectCardToSeeMessageRecipients")}
        EmptyGridIcon={EmptyMessagesRecipient}
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
      {openMarkAllReadModal && (
        <ConfirmModal
          isOpen={openMarkAllReadModal}
          setIsOpen={setOpenMarkAllReadModal}
          onConfirm={() => {
            setOpenMarkAllReadModal(false);
            onMarkAllReadThreads();
          }}
          headerText={t("markallmessagesasread")}
          bodyText={`${t("markbodytext")} ?`}
          confirmBtnTitle={"yes"}
          cancelBtnTitle={"no"}
          icon={<SaveIcon />}
        />
      )}
    </StyledRoot>
  );
};

export default withLoading(MessageRecipientsGrid);
