import Grid from "@mui/material/Grid";
import TextField from "../../common/Field/TextField";
import UserAndGroupVirtualizedSelect from "../../UserManagement/UserAndGroupVirtualizedSelect";
import Select from "../../common/Field/Select";
import DatePicker from "../../common/Field/DatePicker";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { MessageFilterType } from "../../../types/messages.type";
import FIChooserSelect from "../../FI/FIChooserSelect";
import { MessageFilterValue } from "./MessagesFilter";
import isArray from "lodash/isArray";
import { UserAndGroup } from "../../../types/user.type";

interface FilterBodyProps {
  setValue: (key: keyof MessageFilterType, value: MessageFilterValue) => void;
  filters: MessageFilterType;
  messageStatuses: { label: string; value: string }[];
}

const MessagesFilterBody: FC<FilterBodyProps> = ({
  setValue,
  filters,
  messageStatuses,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Grid item xs={6} paddingRight={"6px"}>
        <TextField
          onChange={(value: string) => {
            setValue("title", value);
          }}
          label={t("rootmessage")}
          size={"default"}
          value={filters["title"]}
          fieldName={"root-message"}
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
          onlyExternals={true}
        />
      </Grid>
      <Grid item xs={6} paddingRight={"6px"} marginTop={"20px"}>
        <FIChooserSelect
          label={t("fi")}
          width={"100%"}
          checkedRows={isArray(filters.fis) ? filters.fis : []}
          onChange={(fis) => {
            setValue("fis", fis);
          }}
        />
      </Grid>
      <Grid item xs={6} paddingLeft={"6px"} marginTop={"20px"}>
        <Select
          size={"default"}
          label={t("status")}
          data={messageStatuses ?? []}
          onChange={(value) => {
            setValue("status", value);
          }}
          value={filters["status"]}
          data-testid={"status-select"}
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
          data-testid={"dateAfter"}
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
          data-testid={"dateBefore"}
        />
      </Grid>
    </>
  );
};

export default MessagesFilterBody;
