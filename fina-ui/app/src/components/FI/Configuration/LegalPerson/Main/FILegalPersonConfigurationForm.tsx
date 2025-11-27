import { useTranslation } from "react-i18next";
import { loadFirstLevel } from "../../../../../api/services/regionService";
import { Box, Grid } from "@mui/material";
import TextField from "../../../../common/Field/TextField";
import CustomAutoComplete from "../../../../common/Field/CustomAutoComplete";
import GhostBtn from "../../../../common/Button/GhostBtn";
import PrimaryBtn from "../../../../common/Button/PrimaryBtn";
import CheckIcon from "@mui/icons-material/Check";
import React, { useEffect, useState } from "react";
import useErrorWindow from "../../../../../hoc/ErrorWindow/useErrorWindow";
import Select from "../../../../common/Field/Select";
import { legalPersonResidentStatus } from "../../FiConfigurationConstants";
import { styled } from "@mui/material/styles";
import { LegalPersonDataType } from "../../../../../types/legalPerson.type";
import { CountryDataTypes } from "../../../../../types/common.type";

const StyledFooter = styled(Box)(({ theme }: any) => ({
  padding: 10,
  paddingRight: 20,
  ...theme.modalFooter,
}));

const noSpecialCharacters = /^[\p{L}\p{N}]*$/u;

interface ErrorFieldsType {
  name: boolean;
  identificationNumber: boolean;
  country: boolean;
  status: boolean;
  residentStatus: boolean;
}

interface Props {
  closeModal: () => void;
  onSave: (data: LegalPersonDataType) => void;
}

const FILegalPersonConfigurationForm: React.FC<Props> = ({
  closeModal,
  onSave,
}) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const [countries, setCountries] = useState<CountryDataTypes[]>([]);
  const [legalPerson, setLegalPerson] = useState<LegalPersonDataType>({
    name: "",
    identificationNumber: "",
    country: null,
    id: 0,
    nameStrId: 0,
    criminalRecords: [],
    beneficiaries: [],
    shares: [],
    managers: [],
    bank: false,
    fiId: 0,
    fiLegalPersonId: 0,
    connectionTypes: [],
    status: "",
    residentStatus: "",
  });
  const [errorFields, setErrorFields] = useState<ErrorFieldsType>({
    name: false,
    identificationNumber: false,
    country: false,
    status: false,
    residentStatus: false,
  });

  const onSaveFunc = () => {
    let isAnyFieldEmpty = Object.entries(legalPerson).some(([key, value]) => {
      if (key === "country") return !value;
      return value === "";
    });

    if (isAnyFieldEmpty) {
      const updatedErrors: ErrorFieldsType = {
        name: !legalPerson.name,
        identificationNumber: !legalPerson.identificationNumber,
        country: !legalPerson.country,
        status: !legalPerson.status,
        residentStatus: !legalPerson.residentStatus,
      };
      setErrorFields(updatedErrors);
    } else {
      onSave(legalPerson);
    }
  };

  const initCountries = async () => {
    await loadFirstLevel()
      .then((resp) => {
        setCountries(resp.data);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  useEffect(() => {
    initCountries();
  }, []);

  const onChangeValue = <K extends keyof LegalPersonDataType>(
    key: K,
    value: LegalPersonDataType[K]
  ) => {
    setLegalPerson((prev) => ({ ...prev, [key]: value }));
    setErrorFields((prev) => ({ ...prev, [key]: !Boolean(value) }));
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"space-between"}
    >
      <Box display={"flex"} flex={1}>
        <Grid container spacing={2} direction={"column"} padding={"30px"}>
          <Grid item>
            <TextField
              label={t("personCreateName")}
              fieldName={"personCreateName"}
              value={legalPerson.name}
              onChange={(value: string) => onChangeValue("name", value)}
              size={"default"}
              isError={legalPerson["name"] ? false : errorFields["name"]}
            />
          </Grid>
          <Grid item>
            <TextField
              label={t("Id")}
              fieldName={"id"}
              value={legalPerson.identificationNumber}
              onChange={(value: string) =>
                onChangeValue("identificationNumber", value)
              }
              size={"default"}
              isError={
                legalPerson["identificationNumber"]
                  ? false
                  : errorFields["identificationNumber"]
              }
              pattern={noSpecialCharacters}
            />
          </Grid>
          <Grid item>
            <CustomAutoComplete
              label={t("country")}
              data={countries}
              displayFieldName={"name"}
              valueFieldName={"id"}
              onChange={(value) => onChangeValue("country", value)}
              size={"default"}
              isError={!legalPerson.country && errorFields.country}
            />
          </Grid>
          <Grid item>
            <Select
              data-testid={"statusSelect"}
              size={"default"}
              onChange={(value) => onChangeValue("status", value)}
              value={legalPerson.status}
              data={[
                { label: t("active"), value: "ACTIVE" },
                { label: t("inactive"), value: "INACTIVE" },
              ]}
              label={t("status")}
              isError={legalPerson["status"] ? false : errorFields["status"]}
            />
          </Grid>
          <Grid item>
            <Select
              datat-testid={"residentStatusSelect"}
              size={"default"}
              label={t("legalStatus")}
              data={legalPersonResidentStatus()}
              value={legalPerson.residentStatus}
              onChange={(value) => {
                onChangeValue("residentStatus", value);
              }}
              isError={
                legalPerson.residentStatus
                  ? false
                  : errorFields["residentStatus"]
              }
            />
          </Grid>
        </Grid>
      </Box>
      <StyledFooter
        display={"flex"}
        justifyContent={"flex-end"}
        alignItems={"center"}
      >
        <GhostBtn onClick={closeModal} data-testid={"cancelBtn"}>
          {t("cancel")}
        </GhostBtn>
        &#160;&#160;
        <PrimaryBtn
          data-testid={"saveBtn"}
          style={{ height: "32px" }}
          onClick={() => {
            onSaveFunc();
          }}
          endIcon={<CheckIcon sx={{ width: 16, height: 14 }} />}
        >
          {t("save")}
        </PrimaryBtn>
      </StyledFooter>
    </Box>
  );
};

export default FILegalPersonConfigurationForm;
