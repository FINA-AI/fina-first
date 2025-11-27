import TextField from "../../../../common/Field/TextField";
import { useTranslation } from "react-i18next";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import React from "react";
import { ManagementInfoItemType } from "./FiConfigurationCreateManagementContainer";

interface FiConfigurationCreateManagementInfoProps {
  managementInfoItem: ManagementInfoItemType;
  setManagementInfoItem: (item: ManagementInfoItemType) => void;
  isDisabled?: boolean;
}

const FiConfigurationCreateManagementInfo: React.FC<
  FiConfigurationCreateManagementInfoProps
> = ({
  managementInfoItem = {
    code: "",
    name: "",
    isError: {},
  },
  setManagementInfoItem,
  isDisabled = false,
}) => {
  const { t } = useTranslation();

  const setValue = (
    key: keyof Omit<ManagementInfoItemType, "isError">,
    value: string
  ) => {
    const isInvalid = !value || value.trim().length === 0;

    setManagementInfoItem({
      ...managementInfoItem,
      [key]: value,
      isError: {
        ...managementInfoItem.isError,
        [key]: isInvalid,
      },
      version: managementInfoItem.version ?? 0,
      id: managementInfoItem.id ?? 0,
    });
  };

  const getErrorObjectByKey = (
    key: keyof Omit<ManagementInfoItemType, "isError">
  ) => {
    return {
      isError:
        (managementInfoItem.isError as Record<string, any>)?.[key] ?? false,
    };
  };

  return (
    <Grid container spacing={0}>
      <Box flex={1} padding={"0px 16px"}>
        <Grid xs={12} item key={"code"} pt={"14px"}>
          <TextField
            label={t("catalogCode") + "*"}
            value={managementInfoItem.code}
            fieldName={"code"}
            {...getErrorObjectByKey("code")}
            onChange={(value: string) => setValue("code", value)}
            isDisabled={isDisabled}
            size={"default"}
          />
        </Grid>
        <Grid xs={12} item key={"name"} pt={"14px"}>
          <TextField
            label={t("name") + "*"}
            value={managementInfoItem.name}
            fieldName={"name"}
            {...getErrorObjectByKey("name")}
            onChange={(value: string) => setValue("name", value)}
            isDisabled={isDisabled}
            size={"default"}
          />
        </Grid>
      </Box>
    </Grid>
  );
};

export default FiConfigurationCreateManagementInfo;
