import TextField from "../../common/Field/TextField";
import { useTranslation } from "react-i18next";
import Grid from "@mui/material/Grid";
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { CatalogCreateGeneral } from "../../../types/catalog.type";

interface CatalogCreateGeneralInfoProps {
  isDisabled: boolean;
  generalInfoDataRef: CatalogCreateGeneral;
  activeStep: number;
  initialGeneralInfoItem: Partial<CatalogCreateGeneral>;
  onGeneralInfoDataChange(key: string, value: string): void;
}

const StyledRoot = styled(Grid)({
  padding: "28px 16px 16px 32px",
  overflow: "hidden",
  "& .MuiGrid-item": {
    padding: "0px",
    display: "flex",
    alignItems: "flex-start",
  },
  "& .MuiFormControl-root": {
    width: "100%",
  },
});

const StyledGridItem = styled(Grid)({
  marginTop: "12px",
});

const CatalogCreateGeneralInfo: React.FC<CatalogCreateGeneralInfoProps> = ({
  isDisabled,
  generalInfoDataRef,
  onGeneralInfoDataChange,
  activeStep,
  initialGeneralInfoItem,
}) => {
  const { t } = useTranslation();
  const [generalInfoItem, setGeneralInfoItem] = useState(
    initialGeneralInfoItem
  );
  const [isCodeValid, setIsCodeValid] = useState(false);

  useEffect(() => {
    if (activeStep !== 0) {
      setIsCodeValid(!Boolean(generalInfoItem.code));
    }
    setGeneralInfoItem({ ...generalInfoDataRef });
  }, [activeStep, isDisabled]);

  const setValue = (key: string, value: string) => {
    onGeneralInfoDataChange(key, value);
  };

  const codeValidator = (value: string) => {
    setIsCodeValid(!value || value.trim().length === 0);
  };

  return (
    <StyledRoot
      container
      direction={"row"}
      spacing={2}
      data-testid={"general-info-container"}
    >
      <Grid xs={12} item key={"code"}>
        <TextField
          label={t("catalogCode")}
          value={generalInfoItem.code}
          onChange={(value: string) => {
            codeValidator(value);
            setValue("code", value);
          }}
          isDisabled={isDisabled}
          size={"default"}
          isError={isCodeValid}
          fieldName={"code"}
        />
      </Grid>
      <StyledGridItem xs={12} item key={"name"}>
        <TextField
          label={t("name")}
          value={generalInfoItem.name}
          onChange={(value: string) => setValue("name", value)}
          isError={false}
          size={"default"}
          fieldName={"name"}
        />
      </StyledGridItem>
      <StyledGridItem xs={12} item key={"abbreviation"}>
        <TextField
          label={t("abbreviation")}
          value={generalInfoItem.abbreviation}
          onChange={(value: string) => setValue("abbreviation", value)}
          isError={false}
          size={"default"}
          fieldName={"abbreviation"}
        />
      </StyledGridItem>
      <StyledGridItem xs={12} item key={"catalogNumber"}>
        <TextField
          label={t("catalogNumber")}
          value={generalInfoItem.number}
          onChange={(value: string) => setValue("number", value)}
          isError={false}
          size={"default"}
          fieldName={"catalog-number"}
        />
      </StyledGridItem>
      <StyledGridItem xs={12} item key={"source"}>
        <TextField
          label={t("source")}
          value={generalInfoItem.source}
          onChange={(value: string) => setValue("source", value)}
          isError={false}
          size={"default"}
          fieldName={"source"}
        />
      </StyledGridItem>
    </StyledRoot>
  );
};

export default CatalogCreateGeneralInfo;
