import { Box, Grid } from "@mui/material";
import TextField from "../../../../common/Field/TextField";
import CustomAutoComplete from "../../../../common/Field/CustomAutoComplete";
import GhostBtn from "../../../../common/Button/GhostBtn";
import PrimaryBtn from "../../../../common/Button/PrimaryBtn";
import CheckIcon from "@mui/icons-material/Check";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { loadFirstLevel } from "../../../../../api/services/regionService";
import useErrorWindow from "../../../../../hoc/ErrorWindow/useErrorWindow";
import Select from "../../../../common/Field/Select";
import { physicalPersonResidentStatus } from "../../FiConfigurationConstants";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { ConfigPhysicalPersonDataType } from "../../../../../types/physicalPerson.type";

const StyledFooter = styled(Box)(({ theme }: any) => ({
  padding: 10,
  paddingRight: 20,
  ...theme.modalFooter,
}));

interface Props {
  closeModal: () => void;
  onSave: (person: ConfigPhysicalPersonDataType) => void;
}

const FIPersonConfigurationForm: React.FC<Props> = ({ closeModal, onSave }) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const [countries, setCountries] = useState([]);
  const [personItem, setPersonItem] = useState<any>({
    name: "",
    identificationNumber: "",
    passportNumber: "",
    residentStatus: "",
    citizenship: null,
    status: "ACTIVE",
  });

  const [errorFields, setErrorFields] = useState<
    Partial<Record<keyof ConfigPhysicalPersonDataType, boolean>>
  >({
    name: false,
    identificationNumber: false,
    passportNumber: false,
    residentStatus: false,
    citizenship: false,
  });

  const onSaveFunc = () => {
    const isAnyValueFalse = Object.values(personItem).some(
      (value) => value === null || value === ""
    );

    if (isAnyValueFalse) {
      const errors = {} as Record<keyof ConfigPhysicalPersonDataType, boolean>;
      (
        Object.keys(personItem) as (keyof ConfigPhysicalPersonDataType)[]
      ).forEach((key) => {
        errors[key] = !Boolean(personItem[key]);
      });
      setErrorFields(errors);
    } else {
      onSave(personItem);
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

  const onChangeValue = <K extends keyof ConfigPhysicalPersonDataType>(
    key: K,
    value: ConfigPhysicalPersonDataType[K]
  ) => {
    setPersonItem((prev: any) => ({ ...prev, [key]: value }));
    setErrorFields((prev) => ({
      ...prev,
      [key]: !Boolean(value),
    }));
  };

  const fields: { key: keyof ConfigPhysicalPersonDataType; label: string }[] = [
    { key: "name", label: t("personCreateName") },
    { key: "identificationNumber", label: t("Id") },
    { key: "passportNumber", label: t("passportNumber") },
    { key: "citizenship", label: t("citizenship") },
    { key: "residentStatus", label: t("legalStatus") },
  ];

  const renderTextField = (field: {
    key: keyof ConfigPhysicalPersonDataType;
    label: string;
  }) => {
    switch (field.key) {
      case "citizenship":
        return (
          <Grid item key={field.key}>
            <CustomAutoComplete
              label={t("personCreateCitizenship")}
              data={countries}
              displayFieldName={"name"}
              valueFieldName={"id"}
              selectedItem={personItem.citizenship}
              onChange={(value) => onChangeValue("citizenship", value)}
              size={"default"}
              isError={
                personItem.citizenship ? false : errorFields["citizenship"]
              }
            />
          </Grid>
        );
      case "residentStatus":
        return (
          <Grid item key={field.key}>
            <Select
              size={"default"}
              label={field.label}
              data={physicalPersonResidentStatus()}
              value={personItem.residentStatus}
              onChange={(value) => {
                onChangeValue("residentStatus", value);
              }}
              isError={
                personItem.residentStatus
                  ? false
                  : errorFields["residentStatus"]
              }
              data-testid={"residentStatus"}
            />
          </Grid>
        );

      default:
        return (
          <Grid item key={field.key}>
            <TextField
              fieldName={field.key}
              label={field.label}
              value={personItem[field.key] as string}
              onChange={(value: string) =>
                onChangeValue(field.key, value as string)
              }
              size={"default"}
              isError={personItem[field.key] ? false : errorFields[field.key]}
              pattern={
                field.key === "identificationNumber" ? /^\d*$/ : undefined
              }
            />
          </Grid>
        );
    }
  };

  return (
    <>
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-between"}
        component={Paper}
      >
        <Box display={"flex"} flex={1}>
          <Grid container spacing={2} direction={"column"} padding="30px">
            {fields.map(renderTextField)}
          </Grid>
        </Box>
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
          style={{ height: "32px" }}
          data-testId={"saveBtn"}
          onClick={() => {
            onSaveFunc();
          }}
          endIcon={
            <CheckIcon
              sx={{
                width: 16,
                height: 14,
              }}
            />
          }
        >
          {t("save")}
        </PrimaryBtn>
      </StyledFooter>
    </>
  );
};

export default FIPersonConfigurationForm;
