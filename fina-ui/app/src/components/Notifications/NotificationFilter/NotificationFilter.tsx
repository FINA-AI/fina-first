import Divider from "@mui/material/Divider";
import { Box } from "@mui/system";
import Grid from "@mui/material/Grid";
import { useTranslation } from "react-i18next";
import { Chip } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import FilterChip from "../../common/Chip/FilterChip";
import CloseIcon from "@mui/icons-material/Close";
import TextButton from "../../common/Button/TextButton";
import FilteredDataDisplay from "../../Messages/MessagesFilter/FilteredDataDisplay";
import FilterFooterButtons from "../../Messages/MessagesFilter/FilterFooterButtons";
import NotificationsFilterBody from "./NotificaionsFilterBody";
import { styled } from "@mui/material/styles";
import isEmpty from "lodash/isEmpty";
import {
  NotificationFilterType,
  RootNotificationType,
} from "../../../types/notifications.type";
import { CommFilterType } from "../../../types/communicator.common.type";

interface NotificationFilterProps {
  handleFilterClose: () => void;
  filtersData: NotificationFilterType;
  setFiltersData: React.Dispatch<React.SetStateAction<NotificationFilterType>>;
  onFilterChange: (filters: NotificationFilterType | {}) => void;
  setSelectedNotification: (notification: RootNotificationType | null) => void;
  onFilterClick: (filters: CommFilterType) => void;
  notificationFilterType: { notificationFilterType: string };
}

export type NotificationFilterValue =
  NotificationFilterType[keyof NotificationFilterType];

const StyledFilterChip = styled(Chip)(({ theme }) => ({
  marginInline: "5px",
  fontWeight: 500,
  fontSize: "12px",
  lineHeight: "16px",
  height: "24px",
  "&.active": {
    color: theme.palette.mode === "dark" ? "#344258" : "#F9FAFB",
    backgroundColor: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: `${theme.palette.secondary.main} !important`,
    },
  },
}));

const StyledHeader = styled(Box)(({ theme }) => ({
  fontSize: "13px",
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#2C3644",
  lineHeight: "150%",
  fontWeight: 600,
  paddingLeft: "12px",
  paddingRight: "12px",
}));

const NotificationFilter: React.FC<NotificationFilterProps> = ({
  handleFilterClose,
  onFilterClick,
  filtersData,
  setFiltersData,
  onFilterChange,
  setSelectedNotification,
  notificationFilterType,
}) => {
  const { t } = useTranslation();

  const notificationStatusList = [
    {
      label: "created",
      value: "CREATED",
    },
    {
      label: "published",
      value: "PUBLISHED",
    },
  ];

  const [filters, setFilters] = useState<NotificationFilterType>(
    {} as NotificationFilterType
  );

  useEffect(() => {
    setFilters({ ...filtersData } as NotificationFilterType);
  }, []);

  const clearEmptyChipHandler = (key: string) => {
    let filter: any = { ...filters };
    delete filter[key];
    setFilters({ ...filter });
  };

  const clear = () => {
    setFilters({} as NotificationFilterType);
    setFiltersData({} as NotificationFilterType);
    onFilterChange({ ...notificationFilterType });
    setSelectedNotification(null);
  };

  const deleteChip = (key: any) => {
    let filter: any = { ...filters };
    delete filter[key[0]];
    setFilters({ ...filter });
  };

  const setValue = (
    key: keyof NotificationFilterType,
    value: NotificationFilterValue
  ) => {
    let filter: any = { ...filters };
    filter[key] = value;
    setFilters({ ...filter });
    if (value === "") {
      clearEmptyChipHandler(key);
    }
  };

  const filtersLength = useMemo(() => {
    return Object.keys(filters).length;
  }, [filters]);

  let filteredVisibleData = () => {
    let result: [string, string][] = [];
    for (let o of Object.entries(filters)) {
      if (o[0] !== "author" && o[0] !== "recipients" && o[0] !== "fis") {
        result.push(o);
      }
    }
    return result.slice(0, 3).map((filterItem, index) => {
      return (
        <FilterChip
          key={index}
          chipKey={filterItem?.[0]}
          data={filterItem}
          maxWidth={"60px"}
          icon={
            <CloseIcon
              sx={{ color: "#9AA7BE", fontSize: 15 }}
              onClick={() => deleteChip(filterItem)}
            />
          }
        />
      );
    });
  };

  let filteredHiddenData = () => {
    let result: any = [];
    for (let o of Object.entries(filters)) {
      if (o[0] !== "author" && o[0] !== "recipients" && o[0] !== "fis") {
        result.push(o);
      }
    }

    return (
      result.length > 3 && (
        <FilteredDataDisplay result={result} deleteChip={deleteChip} />
      )
    );
  };

  const getFilterItemChip = (
    key: keyof NotificationFilterType,
    label: string
  ) => {
    return (
      <StyledFilterChip
        label={label}
        variant="outlined"
        className={filters[key] ? "active" : ""}
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
      />
    );
  };

  return (
    <Box width={600} data-testid={"notification-filter-menu"}>
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
          handleFilterClose={handleFilterClose}
          onFilterClick={onFilterClick}
        />
      </StyledHeader>
      <Divider color={"#EAEBF0"} />
      <Grid
        container
        columnSpacing={{ xs: 1 }}
        margin={"0px !important"}
        alignItems={"center"}
      >
        <Grid
          item
          xs={10}
          display={"flex"}
          flexDirection={"row"}
          height={"44px"}
          alignItems={"center"}
          paddingLeft={"10px !important"}
          data-testid={"filtered-chips-wrapper"}
        >
          {filteredVisibleData()}
          {filteredHiddenData()}
        </Grid>
        {filtersLength > 0 && (
          <Grid item xs={1}>
            <TextButton onClick={clear} data-testid={"clear-all-button"}>
              {t("clearAll")}
            </TextButton>
          </Grid>
        )}
      </Grid>
      <Divider color={"#EAEBF0"} />
      {!isEmpty(filters) && <Divider color={"#EAEBF0"} />}
      <Box padding={"16px"}>
        <Grid container columnSpacing={{ xs: 1 }} padding={"0px !important"}>
          <NotificationsFilterBody
            setValue={setValue}
            filters={filters}
            notificationStatusList={notificationStatusList}
          />
          <Grid item xs={12} padding={"12px 0px 0px 0px !important"}>
            {getFilterItemChip("hasAttachment", t("hasAttachment"))}
          </Grid>
        </Grid>
      </Box>
      <Divider color={"#EAEBF0"} />
    </Box>
  );
};

export default NotificationFilter;
