import TextField from "../../../../common/Field/TextField";
import { useTranslation } from "react-i18next";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import React from "react";

interface BranchInfoItemType {
  code: string;
  name: string;
  isError: {
    code: boolean;
    name: boolean;
    [key: string]: boolean;
  };
}

interface FiConfigurationCreateBreanchInfoProps {
  branchInfoItem: {
    code: string;
    name: string;
    isError: Record<string, boolean>;
    [key: string]: any;
  };
  setBranchInfoItem: (item: any) => void;
  isDisabled?: boolean;
}

const FiConfigurationCreateBreanchInfo: React.FC<
  FiConfigurationCreateBreanchInfoProps
> = ({
  branchInfoItem = {
    code: "",
    name: "",
    isError: {
      code: false,
      name: false,
    },
  },
  setBranchInfoItem,
  isDisabled = false,
}) => {
  const { t } = useTranslation();

  const setValue = (key: keyof BranchInfoItemType, value: string) => {
    const updatedErrors = {
      ...branchInfoItem.isError,
      [key]: !value || value.trim().length === 0,
    };

    setBranchInfoItem({
      ...branchInfoItem,
      [key]: value,
      isError: updatedErrors,
    });
  };

  const getErrorObjectByKey = (key: keyof BranchInfoItemType) => {
    return {
      isError: branchInfoItem.isError[key],
    };
  };

  return (
    <Grid container spacing={0}>
      <Box flex={1} padding={"0px 16px"}>
        <Grid xs={12} item key={"code"} paddingTop={"14px"}>
          <TextField
            label={t("catalogCode") + "*"}
            value={branchInfoItem.code}
            {...getErrorObjectByKey("code")}
            onChange={(value: string) => setValue("code", value)}
            isDisabled={isDisabled}
            size={"default"}
            pattern={/^[\x00-\x7F]*$/}
            fieldName={"code"}
          />
        </Grid>
        <Grid xs={12} item key={"name"} pb={"20px"} pt={"14px"}>
          <TextField
            label={t("name") + "*"}
            value={branchInfoItem.name}
            {...getErrorObjectByKey("name")}
            onChange={(value: string) => setValue("name", value)}
            isDisabled={isDisabled}
            size={"default"}
            fieldName={"name"}
          />
        </Grid>
      </Box>
    </Grid>
  );
};

export default FiConfigurationCreateBreanchInfo;
