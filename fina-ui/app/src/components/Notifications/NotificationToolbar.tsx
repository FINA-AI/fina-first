import { Box, IconButton, Menu, Typography } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import PrimaryBtn from "../common/Button/PrimaryBtn";
import SendIcon from "@mui/icons-material/Send";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import NotificationFilter from "./NotificationFilter/NotificationFilter";
import useConfig from "../../hoc/config/useConfig";
import { PERMISSIONS } from "../../api/permissions";
import { styled } from "@mui/material/styles";
import { UIEventType } from "../../types/common.type";
import {
  NotificationFilterType,
  RootNotificationType,
} from "../../types/notifications.type";
import { TypeFiltersType } from "./NotificationsPage";
import isArray from "lodash/isArray";
import { CommFilterType } from "../../types/communicator.common.type";

interface NotificationToolbarProps {
  onCreateButtonClick: () => void;
  activeSecondaryToolbar: boolean;
  onFilterChange: (filters: NotificationFilterType | {}) => void;
  typeFilters: TypeFiltersType;
  setTypeFilters: React.Dispatch<React.SetStateAction<TypeFiltersType>>;
  setSelectedNotification: (notification: RootNotificationType | null) => void;
}

const StyledToolbar = styled(Box)({
  display: "flex",
  alignItems: "center",
  width: "100%",
  justifyContent: "space-between",
});

const StyledAddNewText = styled(Typography)({
  fontSize: 12,
  fontWeight: 500,
  paddingRight: "10px",
  minWidth: "max-content",
});

const StyledSplitter = styled(Box)(({ theme }) => ({
  height: 24,
  width: 2,
  backgroundColor: theme.palette.mode === "light" ? "#EAEBF0" : "#6a78a0",
  marginLeft: 0,
  marginRight: 10,
}));

const StyledFilterIndicator = styled(Box)({
  background: "#FF4128",
  width: "4px",
  height: "4px",
  borderRadius: "34px",
  position: "absolute",
  right: "0px",
  top: "1px",
});

const StyledNotificationFilterTypes = styled(Box)(
  ({ theme }: { theme: any }) => ({
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    color: theme.palette.textColor,
    "&.selectedType": {
      color: theme.palette.primary.main,
      borderBottom: `1px solid ${theme.palette.primary.main}`,
    },
  })
);

const NotificationToolbar: React.FC<NotificationToolbarProps> = ({
  onCreateButtonClick,
  activeSecondaryToolbar,
  onFilterChange,
  typeFilters,
  setTypeFilters,
  setSelectedNotification,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();

  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const openFilter = Boolean(anchorEl);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [filtersData, setFiltersData] = useState<NotificationFilterType>(
    {} as NotificationFilterType
  );

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

  const getNotificationFilterType = () => {
    return {
      notificationFilterType: typeFilters.personal
        ? "DEFAULT"
        : typeFilters.system
        ? "SYSTEM"
        : "ALL",
    };
  };

  const onFilterClick = (filterData: CommFilterType) => {
    setIsFilterActive(Object.keys(filterData).length !== 0);
    let result = {
      ...filterData,
      authors: filterData.author
        ? filterData.author.map((u) => u.id).join(",")
        : "",
      recipients:
        isArray(filterData.recipients) && filterData.recipients
          ? filterData.recipients.map((u: any) => u.id).join(",")
          : [],
      ...getNotificationFilterType(),
    };

    delete result["author"];
    removeNullOrUndefinedEmpty(result);

    let hasAttachment = Boolean(result["hasAttachment"]);
    hasAttachment
      ? (result["hasAttachments"] = true)
      : delete result["hasAttachment"];

    delete result["hasAttachment"];
    onFilterChange(result);
    setFiltersData({ ...filterData } as NotificationFilterType);
    setSelectedNotification(null);
  };

  const onNotificationTypeChange = (value: string) => {
    let result = {
      ...filtersData,
      authors:
        isArray(filtersData.author) && filtersData.author
          ? filtersData.author.map((u) => u.id).join(",")
          : "",
      recipients:
        isArray(filtersData.recipients) && filtersData.recipients
          ? filtersData.recipients.map((u: any) => u.id)
          : [],
      notificationFilterType: value,
    };
    removeNullOrUndefinedEmpty(result);
    delete result["author"];

    onFilterChange(result);
  };

  const handleFilterOpen = (e: UIEventType) => {
    setAnchorEl(e.currentTarget);
  };
  const handleFilterClose = () => {
    setAnchorEl(null);
    if (Object.keys(filtersData).length === 0) setIsFilterActive(false);
  };

  return (
    <StyledToolbar data-testid={"notification-toolbar"}>
      <Box
        width={"100%"}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Box display={"flex"}>
          <StyledNotificationFilterTypes
            className={typeFilters.all ? "selectedType" : ""}
            mr={"15px"}
            onClick={() => {
              setTypeFilters({ all: true, personal: false, system: false });
              onNotificationTypeChange("ALL");
            }}
            data-testid={"all-tab"}
          >
            {t("all")}
          </StyledNotificationFilterTypes>
          <StyledNotificationFilterTypes
            className={typeFilters.personal ? "selectedType" : ""}
            mr={"15px"}
            onClick={() => {
              setTypeFilters({ all: false, personal: true, system: false });
              onNotificationTypeChange("DEFAULT");
            }}
            data-testid={"personal-tab"}
          >
            {t("personal")}
          </StyledNotificationFilterTypes>
          <StyledNotificationFilterTypes
            className={typeFilters.system ? "selectedType" : ""}
            onClick={() => {
              setTypeFilters({ all: false, personal: false, system: true });
              onNotificationTypeChange("SYSTEM");
            }}
            data-testid={"system-tab"}
          >
            {t("system")}
          </StyledNotificationFilterTypes>
        </Box>
        <Box display={"flex"} alignItems={"center"} style={{ paddingLeft: 10 }}>
          <IconButton
            onClick={handleFilterOpen}
            sx={{ padding: "4px" }}
            data-testid={"filter-icon-button"}
          >
            <StyledFilterIndicator
              visibility={isFilterActive ? "visible" : "hidden"}
            />
            <FilterListIcon fontSize="small" style={{ color: "#98A7BC" }} />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={openFilter}
            onClose={handleFilterClose}
          >
            <NotificationFilter
              handleFilterClose={handleFilterClose}
              onFilterClick={onFilterClick}
              onFilterChange={onFilterChange}
              filtersData={filtersData}
              setFiltersData={setFiltersData}
              setSelectedNotification={setSelectedNotification}
              notificationFilterType={getNotificationFilterType()}
            />
          </Menu>
        </Box>
      </Box>
      {hasPermission(PERMISSIONS.FINA_COMMUNICATOR_NOTIFICATIONS_AMEND) &&
        !activeSecondaryToolbar && (
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            paddingLeft={"10px"}
          >
            <StyledSplitter />
            <PrimaryBtn
              onClick={onCreateButtonClick}
              data-testid={"create-message-button"}
            >
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <StyledAddNewText>{t("addNew")}</StyledAddNewText>
                <SendIcon />
              </Box>
            </PrimaryBtn>
          </Box>
        )}
    </StyledToolbar>
  );
};

export default NotificationToolbar;
