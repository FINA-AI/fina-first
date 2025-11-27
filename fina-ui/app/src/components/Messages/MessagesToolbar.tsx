import SearchField from "../common/Field/SearchField";
import { Box, Divider, IconButton, Menu, Typography } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import PrimaryBtn from "../common/Button/PrimaryBtn";
import SendIcon from "@mui/icons-material/Send";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import MessagesFilter from "./MessagesFilter/MessagesFilter";
import MarkChatReadIcon from "@mui/icons-material/MarkChatRead";
import Tooltip from "../common/Tooltip/Tooltip";
import ConfirmModal from "../common/Modal/ConfirmModal";
import { SaveIcon } from "../../api/ui/icons/SaveIcon";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import useConfig from "../../hoc/config/useConfig";
import { PERMISSIONS } from "../../api/permissions";
import { styled } from "@mui/material/styles";
import { markTypes } from "../../util/appUtil";
import { UIEventType } from "../../types/common.type";
import {
  MessageFilterRecipientType,
  MessageFilterType,
  RootMessageType,
} from "../../types/messages.type";
import { CommFilterType } from "../../types/communicator.common.type";
import isArray from "lodash/isArray";

interface MessagesToolbarProps {
  activeSecondaryToolbar: boolean;
  setFilterValue: (value: string) => void;
  onFilterChange: (filterObj: MessageFilterType) => void;
  onMarkAllReadMessages: () => void;
  setActiveMessage: (message: RootMessageType | null) => void;
  setPagingPage: (page: number) => void;
  onCreateButtonClick(): void;
}

const StyledToolbar = styled(Box)({
  display: "flex",
  alignItems: "center",
  width: "100%",
  justifyContent: "space-between",
});

const StyledTypography = styled(Typography)({
  fontSize: 12,
  fontWeight: 500,
  paddingRight: 8,
});

const StyledFilterContainer = styled(IconButton)({
  margin: "0px 7px",
  padding: "4px",
  border: "none",
  background: "none",
});

const StyledFilterIcon = styled(FilterListIcon)({
  width: "20px",
  height: "20px",
});

const StyledActiveFilter = styled("div")({
  background: "#FF4128",
  width: "4px",
  height: "4px",
  borderRadius: "34px",
  position: "absolute",
  right: "0px",
  top: "1px",
});

const StyledMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    boxShadow:
      theme.palette.mode === "dark" && "0px 22px 70px 4px rgba(0, 0, 0, 0.56)",
    "& ul": {
      padding: "0px",
    },
  },
}));

const StyledChatReadIcon = styled(MarkChatReadIcon)(({ theme }) => ({
  width: "16px",
  height: "16px",
  color: theme.palette.primary.main,
}));

const MessagesToolbar: React.FC<MessagesToolbarProps> = ({
  onCreateButtonClick,
  activeSecondaryToolbar,
  setFilterValue,
  onFilterChange,
  onMarkAllReadMessages,
  setActiveMessage,
  setPagingPage,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();

  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const openFilter = Boolean(anchorEl);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [filtersData, setFiltersData] = useState<MessageFilterType>(
    {} as MessageFilterType
  );
  const [openMarkAllReadModal, setOpenMarkAllReadModal] = useState(false);

  const removeNullOrUndefinedEmpty = (obj: any) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (!value) {
          delete obj[key];
        }
      }
    }
  };

  const onFilterClick = (filters: CommFilterType) => {
    const filterData = filters as MessageFilterType;
    const isActive =
      (filterData?.author && filterData.author.length !== 0) ||
      (filterData?.recipients && filterData.recipients.length !== 0) ||
      (filterData?.fis && filterData.fis.length !== 0) ||
      filterData?.notReplied ||
      filterData?.hasAttachments ||
      filterData?.important ||
      filterData?.bookmarked ||
      filterData?.ignoredReply ||
      filterData?.title ||
      filterData?.dateBefore ||
      filterData?.dateAfter ||
      filterData?.status ||
      filterData?.contains;
    setIsFilterActive(!!isActive);

    const { bookmarked, important, ...restFilterData } = filterData;

    let result: MessageFilterType = {
      ...restFilterData,
      authors: filterData.author
        ? filterData.author.map((u) => u.id).join(",")
        : "",
      recipients: isArray(filterData.recipients)
        ? filterData.recipients.map((u) => u.id).join(",")
        : ([] as MessageFilterRecipientType[]),
      fis:
        isArray(filterData.fis) && filterData.fis.length > 0
          ? filterData.fis.map((fi) => fi.id).join(",")
          : [],
      markType: [],
    };
    delete result["author"];
    removeNullOrUndefinedEmpty(result);

    let hasAttachment = Boolean(result["hasAttachment"]);
    hasAttachment
      ? (result["hasAttachments"] = true)
      : delete result["hasAttachment"];

    let notReplied = Boolean(result["notReplied"]);
    notReplied ? (result["notReplied"] = true) : delete result["notReplied"];

    let isBookMarked = Boolean(bookmarked);
    isBookMarked && result.markType.push(markTypes.bookmark);

    let isImportant = Boolean(important);
    isImportant && result.markType.push(markTypes.important);

    let ignoredReply = Boolean(result["ignoredReply"]);
    ignoredReply
      ? (result["ignoredReply"] = true)
      : delete result["ignoredReply"];

    let hasAttachments = Boolean(result["hasAttachments"]);
    hasAttachments
      ? (result["hasAttachments"] = true)
      : delete result["hasAttachments"];

    let unread = Boolean(result["unread"]);
    unread ? (result["unread"] = true) : delete result["unread"];

    delete result["hasAttachment"];
    onFilterChange(result);
    setFiltersData({ ...filterData } as MessageFilterType);
    setActiveMessage(null);
  };

  const handleFilterOpen = (e: UIEventType) => {
    setAnchorEl(e.currentTarget);
  };
  const handleFilterClose = () => {
    setAnchorEl(null);

    // setIsFilterActive(Object.keys(filtersData).length !== 0);
  };

  const onFilterClearButtonClick = () => {
    onFilterClick({} as MessageFilterType);
    setActiveMessage(null);
  };

  const handleSearchActions = (searchVal: string) => {
    setFilterValue(searchVal);
    setActiveMessage(null);
    setPagingPage(1);
  };

  return (
    <StyledToolbar data-testid={"messages-toolbar"}>
      <Box
        width={"100%"}
        maxWidth={"400px"}
        display={"flex"}
        alignItems={"center"}
      >
        <div style={{ minWidth: 130 }}>
          <SearchField
            withFilterButton={false}
            onFilterClick={handleSearchActions}
            onClear={() => handleSearchActions("")}
            onFilterChange={(val) => {
              if (val != null && val.trim().length === 0) {
                handleSearchActions("");
              }
            }}
          />
        </div>

        <StyledFilterContainer
          onClick={handleFilterOpen}
          data-testid={"filter-menu-button"}
        >
          {isFilterActive ? <StyledActiveFilter /> : <div />}
          <StyledFilterIcon fontSize="small" />
        </StyledFilterContainer>
        <Tooltip title={t("clearAll")}>
          <span>
            <StyledFilterContainer
              onClick={onFilterClearButtonClick}
              disabled={!isFilterActive}
              style={{
                marginRight: "10px",
              }}
              data-testid={"clear-all-button"}
            >
              <FilterAltOffIcon
                fontSize="small"
                style={{ width: "18px", height: "18px" }}
              />
            </StyledFilterContainer>
          </span>
        </Tooltip>

        <Divider orientation="vertical" variant="middle" flexItem />
        <Tooltip title={t("markallmessagesasread")}>
          <span>
            <IconButton
              onClick={() => setOpenMarkAllReadModal(true)}
              style={{
                marginLeft: "10px",
                border: "none",
              }}
              data-testid={"mark-all-iconButton"}
            >
              <StyledChatReadIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
      {!activeSecondaryToolbar && (
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <StyledMenu
            anchorEl={anchorEl}
            open={openFilter}
            onClose={handleFilterClose}
          >
            <MessagesFilter
              handleFilterClose={handleFilterClose}
              onFilterClick={onFilterClick}
              filtersData={filtersData}
              setFiltersData={setFiltersData}
              onFilterChange={onFilterChange}
              setIsFilterActive={setIsFilterActive}
              setActiveMessage={setActiveMessage}
            />
          </StyledMenu>
          {hasPermission(PERMISSIONS.FINA_COMMUNICATOR_MESSAGES_AMEND) && (
            <PrimaryBtn
              onClick={onCreateButtonClick}
              data-testid={"create-message-button"}
            >
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <StyledTypography>{t("message")}</StyledTypography>
                <SendIcon />
              </Box>
            </PrimaryBtn>
          )}
        </Box>
      )}
      {openMarkAllReadModal && (
        <ConfirmModal
          isOpen={openMarkAllReadModal}
          setIsOpen={setOpenMarkAllReadModal}
          onConfirm={() => {
            setOpenMarkAllReadModal(false);
            onMarkAllReadMessages();
          }}
          headerText={t("markallmessagesasread")}
          bodyText={`${t("markbodytext")} ?`}
          confirmBtnTitle={"yes"}
          cancelBtnTitle={"no"}
          icon={<SaveIcon />}
        />
      )}
    </StyledToolbar>
  );
};

export default MessagesToolbar;
