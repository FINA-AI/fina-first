import React, { useState } from "react";
import TextField from "../../common/Field/TextField";
import GhostBtn from "../../common/Button/GhostBtn";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useTranslation } from "react-i18next";
import { Box, Grid } from "@mui/material";
import CustomAutoComplete from "../../common/Field/CustomAutoComplete";
import LegalFormTypeAutoComplete from "../../FI/Common/AutoComplete/LegalFormTypeAutoComplete";
import EconomicEntityTypeAutoComplete from "../../FI/Common/AutoComplete/EconomicEntityTypeAutoComplete";
import EquityFormTypeAutoComplete from "../../FI/Common/AutoComplete/EquityFormTypeAutoComplete";
import ManagementFormTypeAutoComplete from "../../FI/Common/AutoComplete/ManagementFormTypeAutoComplete";
import { legalPersonResidentStatus } from "../../FI/Configuration/FiConfigurationConstants";
import { styled } from "@mui/material/styles";
import { CountryDataTypes } from "../../../types/common.type";

interface FILegalPersonCreateFormProps {
  onCancel: VoidFunction;
  countryData: CountryDataTypes[];
  onSave(legalPerson: any): void;
}

const StyledRoot = styled(Box)(({ theme }: any) => ({
  borderTop: theme.palette.borderColor,
}));

const StyledFooter = styled(Box)(({ theme }: any) => ({
  borderTop: theme.palette.borderColor,
  padding: "10px",
  paddingRight: "20px",
}));

const FILegalPersonCreateForm: React.FC<FILegalPersonCreateFormProps> = ({
  onSave,
  onCancel,
  countryData,
}) => {
  const { t } = useTranslation();

  const [legalPerson, setLegalPerson] = useState<any>({
    name: "",
    registrationNumber: null,
    identificationNumber: null,
    country: {},
    metaInfo: null,
    residentStatus: {},
    isError: {},
  });

  const setValue = (key: string, value: any) => {
    setLegalPerson({
      ...legalPerson,
      [key]: value,
    });
  };

  const getErrorObjectByKey = (key: string) => {
    return {
      isError: legalPerson.isError[key],
    };
  };

  return (
    <StyledRoot
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"space-between"}
    >
      <Box display={"flex"} flex={1}>
        <Grid container spacing={2} direction={"column"} padding={"20px"}>
          <Grid item>
            <TextField
              label={t("personCreateName")}
              value={legalPerson.name}
              {...getErrorObjectByKey("name")}
              onChange={(value: string) => setValue("name", value)}
              size={"default"}
            />
          </Grid>
          <Grid item>
            <TextField
              label={t("personCreateId")}
              value={legalPerson.identificationNumber || ""}
              {...getErrorObjectByKey("registrationNumber")}
              onChange={(value: string) =>
                setValue("identificationNumber", value)
              }
              size={"default"}
            />
          </Grid>
          <Grid item>
            <TextField
              label={t("branchFieldregistrationNumber")}
              value={legalPerson.registrationNumber || ""}
              {...getErrorObjectByKey("registrationNumber")}
              onChange={(value: string) =>
                setValue("registrationNumber", value)
              }
              size={"default"}
            />
          </Grid>
          <Grid item>
            <CustomAutoComplete
              label={t("country") + "*"}
              data={countryData as any}
              displayFieldName={"name"}
              valueFieldName={"code"}
              selectedItem={legalPerson.country}
              onChange={(value) => setValue("country", value)}
              size={"default"}
            />
          </Grid>
          <Grid item>
            <LegalFormTypeAutoComplete
              selectedItem={legalPerson.metaInfo?.businessEntity}
              onChange={(value) =>
                setValue("metaInfo", {
                  ...legalPerson.metaInfo,
                  businessEntity: value,
                })
              }
              {...getErrorObjectByKey("businessEntity")}
            />
          </Grid>
          <Grid item>
            <EconomicEntityTypeAutoComplete
              selectedItem={legalPerson.metaInfo?.economicEntity}
              {...getErrorObjectByKey("economicEntity")}
              onChange={(value) =>
                setValue("metaInfo", {
                  ...legalPerson.metaInfo,
                  economicEntity: value,
                })
              }
            />
          </Grid>
          <Grid item>
            <EquityFormTypeAutoComplete
              selectedItem={legalPerson.metaInfo?.equityForm}
              {...getErrorObjectByKey("equityForm")}
              onChange={(value) =>
                setValue("metaInfo", {
                  ...legalPerson.metaInfo,
                  equityForm: value,
                })
              }
            />
          </Grid>
          <Grid item>
            <ManagementFormTypeAutoComplete
              selectedItem={legalPerson.metaInfo?.managementForm}
              {...getErrorObjectByKey("managementForm")}
              onChange={(value) =>
                setValue("metaInfo", {
                  ...legalPerson.metaInfo,
                  managementForm: value,
                })
              }
            />
          </Grid>
          <Grid item>
            <CustomAutoComplete
              label={t("personCreateResidentStatus")}
              displayFieldName={"label"}
              valueFieldName={"value"}
              {...getErrorObjectByKey("residentStatus")}
              data={legalPersonResidentStatus() as any}
              onChange={(value) => setValue("residentStatus", value)}
              size={"default"}
            />
          </Grid>
        </Grid>
      </Box>
      <StyledFooter display={"flex"} justifyContent={"flex-end"}>
        <GhostBtn onClick={onCancel}>{t("cancel")}</GhostBtn>
        &#160;&#160;
        <PrimaryBtn
          onClick={() => onSave(legalPerson)}
          endIcon={<DoneAllIcon sx={{ width: 16, height: 14 }} />}
          children={<>Save</>}
        />
      </StyledFooter>
    </StyledRoot>
  );
};

export default FILegalPersonCreateForm;
