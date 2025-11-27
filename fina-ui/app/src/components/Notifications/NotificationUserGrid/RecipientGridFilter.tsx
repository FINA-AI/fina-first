import { Box, Grid } from "@mui/material";
import TagField from "../../common/Field/TagField";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import CustomAutoComplete from "../../common/Field/CustomAutoComplete";
import {
  RecipientFilterType,
  RecipientType,
} from "../../../types/messages.type";
import TextButton from "../../common/Button/TextButton";
import { styled } from "@mui/material/styles";
import { CommRecipientType } from "../../../types/communicator.common.type";

interface RecipientGridFilterProps {
  recipients: CommRecipientType[];
  initData: (filters: RecipientFilterType) => void;
  filters: RecipientFilterType;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  handleFilterClose: () => void;
  setFilters: React.Dispatch<React.SetStateAction<RecipientFilterType>>;
  setIsFilterActive: React.Dispatch<React.SetStateAction<boolean>>;
  onSelectedRecipientChange: (val: RecipientType | null) => void;
  setSelectedItem: React.Dispatch<React.SetStateAction<any>>;
}

const StyledRoot = styled(Grid)(({ theme }: any) => ({
  padding: "8px 16px",
  borderBottom: theme.palette.borderColor,
}));

const RecipientGridFilter: FC<RecipientGridFilterProps> = ({
  recipients, //recipientsType
  initData,
  setPage,
  handleFilterClose,
  setFilters,
  filters,
  setIsFilterActive,
  onSelectedRecipientChange,
  setSelectedItem,
}) => {
  const { t } = useTranslation();
  const [selectedStatuses, setSelectedStatuses] = useState(
    filters.statuses ?? []
  );
  const [selectedRecipient, setSelectedRecipient] = useState<{
    login?: string;
    description?: string;
  }>(recipients.find((item) => item?.id === filters.recipients) ?? {});

  return (
    <Box data-testid={"recipient-filter-menu"}>
      <StyledRoot container width={650} height={"100%"}>
        <Grid item xs={12}>
          <CustomAutoComplete
            label={t("recipient")}
            data={recipients ? (recipients as any) : ([] as any)}
            onChange={(val) => {
              setFilters({ ...filters, recipients: val.id });
              setSelectedRecipient(val);
              // setItem(val);
            }}
            selectedItem={selectedRecipient}
            displayFieldName={"description"}
            secondaryDisplayFieldLabel={t("login")}
            secondaryDisplayFieldName={"login"}
            valueFieldName={"id"}
            onClear={() => {
              if (selectedRecipient?.login) {
                setSelectedRecipient({});
                setFilters({ ...filters, recipients: undefined });
              }
            }}
          />
        </Grid>
        <Grid item xs={12} pt={"8px"} mb={"16px"}>
          <TagField
            label={t("status")}
            selectedValues={selectedStatuses}
            data={[
              { key: "READ", value: t("read") },
              { key: "SENT", value: t("sent") },
              { key: "PENDING", value: t("pending") },
              { key: "RECEIVED", value: t("received") },
              { key: "REJECTED", value: t("rejected") },
            ]}
            chipWidth={100}
            onChange={(val) => {
              setSelectedStatuses(val);
              setFilters({ ...filters, statuses: val });
            }}
          />
        </Grid>
      </StyledRoot>
      <Box
        padding={"10px 12px 8px 12px"}
        justifyContent={"space-between"}
        display={"flex"}
        gap={"8px"}
      >
        {Object.keys(filters).length > 0 ? (
          <Grid item xs={1}>
            <TextButton
              disabled={false}
              onClick={() => {
                setSelectedItem(null);
                onSelectedRecipientChange(null);
                handleFilterClose();
                let newFilters = {
                  ...filters,
                  statuses: [],
                  recipients: undefined,
                };
                setFilters(newFilters);
                initData(newFilters);
                setIsFilterActive(false);
              }}
            >
              {t("clearAll")}
            </TextButton>
          </Grid>
        ) : (
          <span />
        )}
        <PrimaryBtn
          onClick={() => {
            onSelectedRecipientChange(null);
            setSelectedItem(null);
            if (!filters.recipients && !filters.statuses) {
              setIsFilterActive(false);
            } else {
              setIsFilterActive(Object.keys(filters).length > 0);
            }
            initData(filters);
            setPage(1);
            handleFilterClose();
          }}
          data-testid={"filter-button"}
        >
          {t("filter")}
        </PrimaryBtn>
      </Box>
    </Box>
  );
};

export default RecipientGridFilter;
