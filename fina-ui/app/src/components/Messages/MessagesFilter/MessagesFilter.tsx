import Divider from "@mui/material/Divider";
import { Box } from "@mui/system";
import Grid from "@mui/material/Grid";
import { useTranslation } from "react-i18next";
import { Chip } from "@mui/material";
import React, { useEffect, useState } from "react";
import FilterFooterButtons from "./FilterFooterButtons";
import FilterChipDisplay from "./FilterChipDisplay";
import MessagesFilterBody from "./MessagesFilterBody";
import { styled, useTheme } from "@mui/material/styles";
import useConfig from "../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../api/permissions";
import {
  MessageFilterType,
  RootMessageType,
} from "../../../types/messages.type";
import { FilterType } from "../../../types/common.type";
import { CommFilterType } from "../../../types/communicator.common.type";

interface MessagesFilterProps {
  handleFilterClose: () => void;
  onFilterClick: (filters: CommFilterType) => void;
  filtersData: MessageFilterType;
  setFiltersData: React.Dispatch<React.SetStateAction<MessageFilterType>>;
  onFilterChange: (filterObj: MessageFilterType) => void;
  setIsFilterActive: (value: boolean) => void;
  setActiveMessage: (obj: RootMessageType | null) => void;
}

export type MessageFilterValue = MessageFilterType[keyof MessageFilterType];

const StyledHeader = styled(Box)({
  fontSize: "13px",
  color: "#2C3644",
  lineHeight: "150%",
  fontWeight: 600,
  paddingLeft: "12px",
  paddingRight: "12px",
});

const StyledChips = styled(Chip)({
  marginInline: "5px",
  fontWeight: 500,
  fontSize: "12px",
  lineHeight: "16px",
  height: "24px",
});

const MessagesFilter: React.FC<MessagesFilterProps> = ({
  handleFilterClose,
  onFilterClick,
  filtersData,
  setFiltersData,
  onFilterChange,
  setIsFilterActive,
  setActiveMessage,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();

  const theme = useTheme();

  const [filters, setFilters] = useState<MessageFilterType>(
    {} as MessageFilterType
  );

  const messageStatusList = [
    {
      label: t("created"),
      value: "CREATED",
    },
    {
      label: t("outbox"),
      value: "OUTBOX",
    },
    {
      label: t("inbox"),
      value: "INBOX",
    },
    {
      label: t("rejected"),
      value: "REJECTED",
    },
  ];

  useEffect(() => {
    setFilters({ ...filtersData });
  }, [filtersData]);

  const clearEmptyChipHandler = (key: keyof MessageFilterType) => {
    let filter: MessageFilterType = { ...filters };
    delete filter[key];
    setFilters({ ...filter });
  };

  const setValue = (
    key: keyof MessageFilterType,
    value: MessageFilterValue
  ) => {
    let filter: FilterType = { ...filters };
    filter[key] = value;
    setFilters({ ...filter } as MessageFilterType);
    if (value === "") {
      clearEmptyChipHandler(key);
    }
  };

  const getFilterItemChip = (key: keyof MessageFilterType, label: string) => {
    return (
      <StyledChips
        label={label}
        variant="outlined"
        onClick={() => {
          if (filters[key]) {
            let newFilters = { ...filters };
            delete newFilters[key];
            setFilters({ ...newFilters });
          } else {
            setValue(key, label);
          }
        }}
        data-testid={key + "-chip"}
        style={{
          color: filters[key]
            ? theme.palette.mode === "dark"
              ? "#1F2532"
              : "#FFFFFF"
            : "",
          backgroundColor: filters[key] ? theme.palette.primary.main : "",
        }}
      />
    );
  };

  return (
    <Box
      width={800}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          setTimeout(() => {
            handleFilterClose();
          }, 200);
          onFilterClick(filters);
        }
      }}
      data-testid={"messages-filter-menu"}
    >
      <StyledHeader
        display={"flex"}
        flexDirection={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        data-testid={"header"}
      >
        {t("filter")}
        <FilterFooterButtons
          filters={filters}
          onFilterClick={onFilterClick}
          handleFilterClose={handleFilterClose}
        />
      </StyledHeader>
      <Divider color={"#EAEBF0"} />
      <FilterChipDisplay
        setFilters={setFilters}
        setFiltersData={setFiltersData}
        filters={filters}
        onFilterChange={onFilterChange}
        setIsFilterActive={setIsFilterActive}
        setActiveMessage={setActiveMessage}
      />
      <Divider color={"#EAEBF0"} />
      {Object.keys(filters).length > 0 && <Divider color="#EAEBF0" />}
      <Box padding={"16px"}>
        <Grid container columnSpacing={{ xs: 1 }} padding={"0px !important"}>
          <MessagesFilterBody
            filters={filters}
            setValue={setValue}
            messageStatuses={messageStatusList}
          />
          <Grid
            item
            xs={12}
            padding={"12px 0px 0px 0px !important"}
            data-testid={"chips-wrapper"}
          >
            {hasPermission(PERMISSIONS.FINA_COMMUNICATOR_BOOKMARK_REVIEW) &&
              getFilterItemChip("bookmarked", t("bookmarked"))}
            {getFilterItemChip("important", t("important"))}
            {getFilterItemChip("notReplied", t("notReplied"))}
            {getFilterItemChip("ignoredReply", t("ignoredreply"))}
            {getFilterItemChip("hasAttachments", t("attachments"))}
          </Grid>
        </Grid>
      </Box>
      <Divider color={"#EAEBF0"} />
    </Box>
  );
};

export default MessagesFilter;
