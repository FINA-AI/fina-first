import { Box, Grid } from "@mui/material";
import TextField from "../../../../common/Field/TextField";
import { useTranslation } from "react-i18next";
import GhostBtn from "../../../../common/Button/GhostBtn";
import PrimaryBtn from "../../../../common/Button/PrimaryBtn";
import React, { useEffect, useState } from "react";
import CurrencyMultiValueField from "../../../../common/Field/CurrencyMultiValueField";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import { styled } from "@mui/material/styles";
import { LicenseType } from "../../../../../types/fi.type";

const StyledFooter = styled(Box)(({ theme }: any) => ({
  padding: "8px 12px",
  marginTop: 4,
  ...theme.modalFooter,
}));

export interface CurrencyItem {
  value: string;
  text: string;
}

interface Props {
  modalCloseHandler: () => void;
  addLicenseHandler: (data: any, defaultData?: any) => void;
  isBankOperation?: boolean;
  defaultData?: any;
  isEdit?: boolean;
  currentLicense?: LicenseType;
}

const ConfigLicenseCreate: React.FC<Props> = ({
  modalCloseHandler,
  addLicenseHandler,
  isBankOperation = false,
  defaultData = null,
  isEdit = false,
  currentLicense,
}) => {
  const { t } = useTranslation();
  const [disabled, setDisabled] = useState(true);
  const [code, setCode] = useState<string>(currentLicense?.code || "");
  const [name, setName] = useState<string>(currentLicense?.name || "");
  const [currencies, setCurrencies] = useState<CurrencyItem[]>([]);

  useEffect(() => {
    if (defaultData && isEdit) {
      setName(defaultData.name ? defaultData.name : defaultData.description);
      setCode(defaultData.code);
      let currencies = [];
      if (defaultData.foreignCurrency)
        currencies.push({
          value: "foreignCurrency",
          text: t("foreignCurrency"),
        });

      if (defaultData.nationalCurrency)
        currencies.push({
          value: "nationalCurrency",
          text: t("nationalCurrency"),
        });

      setCurrencies([...currencies]);
    }
  }, [defaultData]);

  useEffect(() => {
    setDisabled(!(name?.trim() && code?.trim()));
  }, [code, name]);

  let data = {
    code,
    name,
    currencies,
    id: isEdit ? currentLicense?.id : 0,
    operations: currentLicense?.operations,
  };

  return (
    <Box
      display={"flex"}
      justifyContent={"space-between"}
      flexDirection={"column"}
      pt={"2px"}
    >
      <Box display={"flex"} flex={1}>
        <Grid container direction={"column"} padding={"8px"}>
          <Grid item p={"4px"}>
            <TextField
              fieldName={"code"}
              label={t("code")}
              value={code}
              onChange={(value: string) => setCode(value)}
              size={"default"}
            />
          </Grid>
          {isBankOperation && (
            <Grid item p={"4px"}>
              <CurrencyMultiValueField
                onChange={(data) => setCurrencies(data)}
                defaultValues={currencies}
              />
            </Grid>
          )}
          <Grid item p={"4px"}>
            <TextField
              fieldName={"name"}
              label={t("name")}
              value={name}
              height={100}
              onChange={(value: string) => setName(value)}
              multiline={true}
              rows={5}
            />
          </Grid>
        </Grid>
      </Box>
      <StyledFooter display={"flex"} justifyContent={"flex-end"}>
        <GhostBtn onClick={modalCloseHandler} style={{ marginRight: "10px" }}>
          {t("cancel")}
        </GhostBtn>
        <PrimaryBtn
          onClick={() => {
            addLicenseHandler(data, defaultData);
            modalCloseHandler();
          }}
          backgroundColor={"#2962FF"}
          disabled={disabled}
          endIcon={<DoneRoundedIcon sx={{ width: 16, height: 14 }} />}
        >
          {t("save")}
        </PrimaryBtn>
      </StyledFooter>
    </Box>
  );
};

export default ConfigLicenseCreate;
