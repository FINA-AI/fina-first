import Grid from "@mui/material/Grid";
import TextField from "../../common/Field/TextField";
import UserAndGroupVirtualizedSelect from "../../UserManagement/UserAndGroupVirtualizedSelect";
import Select from "../../common/Field/Select";
import DatePicker from "../../common/Field/DatePicker";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { NotificationFilterType } from "../../../types/notifications.type";
import { NotificationFilterValue } from "./NotificationFilter";
import { UserAndGroup } from "../../../types/user.type";

interface notificationStatusListType {
  label: string;
  value: string;
}

interface FNotificationsFilterBodyProps {
  filters: NotificationFilterType;
  notificationStatusList: notificationStatusListType[];
  setValue(
    key: keyof NotificationFilterType,
    value: NotificationFilterValue
  ): void;
}

const NotificationsFilterBody: FC<FNotificationsFilterBodyProps> = ({
  setValue,
  filters,
  notificationStatusList,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Grid item xs={6} paddingRight={"6px"}>
        <TextField
          onChange={(value: string) => {
            setValue("title", value);
          }}
          label={t("title")}
          size={"default"}
          value={filters["title"]}
          fieldName={"title"}
        />
      </Grid>
      <Grid
        item
        xs={6}
        paddingLeft={"6px"}
        data-testid="authors-select-container"
      >
        <UserAndGroupVirtualizedSelect
          label={t("author")}
          size={"default"}
          setSelectedUsers={(users: UserAndGroup[]) => {
            setValue("author", users);
          }}
          selectedUsers={filters.author}
          width={280}
        />
      </Grid>
      <Grid item xs={6} paddingRight={"6px"} marginTop={"20px"}>
        <TextField
          onChange={(value: string) => {
            setValue("contains", value);
          }}
          label={t("hasWords")}
          size={"default"}
          value={filters["contains"]}
          fieldName={"has-words"}
        />
      </Grid>
      <Grid
        item
        xs={6}
        paddingLeft={"6px"}
        marginTop={"20px"}
        data-testid="recipients-select-container"
      >
        <UserAndGroupVirtualizedSelect
          label={t("recipients")}
          size={"default"}
          setSelectedUsers={(users: UserAndGroup[]) => {
            setValue("recipients", users);
          }}
          selectedUsers={filters.recipients}
          width={280}
          onlyExternals={true}
        />
      </Grid>
      <Grid item xs={6} paddingRight={"6px"} marginTop={"20px"}>
        <TextField
          onChange={(value: string) => {
            setValue("content", value);
          }}
          label={t("content")}
          size={"default"}
          value={filters.content}
          fieldName={"content"}
        />
      </Grid>
      <Grid item xs={6} paddingLeft={"6px"} marginTop={"20px"}>
        <Select
          size={"default"}
          label={t("status")}
          data={notificationStatusList}
          onChange={(value) => {
            setValue("status", value);
          }}
          value={filters["status"]}
        />
      </Grid>
      <Grid item xs={6} paddingRight={"6px"} marginTop={"20px"}>
        <DatePicker
          size={"default"}
          label={t("dateAfter")}
          onChange={(value) => {
            setValue("dateAfter", value.getTime());
          }}
          value={filters["dateAfter"] ? filters["dateAfter"] : null}
          data-testid={"date-after"}
        />
      </Grid>
      <Grid item xs={6} paddingLeft={"6px"} marginTop={"20px"}>
        <DatePicker
          size={"default"}
          label={t("dateBefore")}
          onChange={(value) => {
            setValue("dateBefore", value.getTime());
          }}
          value={filters?.dateBefore ?? null}
          data-testid={"date-before"}
        />
      </Grid>
    </>
  );
};
export default NotificationsFilterBody;
