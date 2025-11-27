import { useTranslation } from "react-i18next";
import TextField from "../../common/Field/TextField";
import { Box, Grid } from "@mui/material";
import GhostBtn from "../../common/Button/GhostBtn";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import React, { useState } from "react";
import CustomAutoComplete from "../../common/Field/CustomAutoComplete";
import { styled } from "@mui/material/styles";
import { CountryDataTypes } from "../../../types/common.type";
import { Person } from "./PersonCreateContainer";
import isEmpty from "lodash/isEmpty";
import { ResidentStatusOptionEnum } from "../../../types/fi.type";

interface PersonCreateFormProps {
  onCancel: VoidFunction;
  countries: CountryDataTypes[];
  onSave(personItem: Person, setPersonItem: (person: Person) => void): void;
}

const StyledRoot = styled(Box)(({ theme }: any) => ({
  borderTop: theme.palette.borderColor,
}));

const StyledFooter = styled(Box)(({ theme }: any) => ({
  borderTop: theme.palette.borderColor,
  padding: 10,
  paddingRight: 20,
}));

const PersonCreateForm: React.FC<PersonCreateFormProps> = ({
  onCancel,
  onSave,
  countries,
}) => {
  const { t } = useTranslation();
  const [personItem, setPersonItem] = useState<Person>({
    name: "",
    personalId: "",
    passportNumber: "",
    residentStatus: {},
    citizenship: {} as CountryDataTypes,
    isError: {} as any,
  });

  const setValue = (key: string, value: any) => {
    personItem.isError[key] = isEmpty(value);

    setPersonItem({
      ...personItem,
      [key]: value,
    });
  };

  const getErrorObjectByKey = (key: string) => {
    return {
      isError: personItem.isError[key],
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
              label={t("personCreateId") + " *"}
              value={personItem.personalId}
              {...getErrorObjectByKey("personalId")}
              onChange={(value: string) => setValue("personalId", value)}
              size={"default"}
            />
          </Grid>
          <Grid item>
            <TextField
              label={t("personCreateName") + "*"}
              value={personItem.name}
              {...getErrorObjectByKey("name")}
              onChange={(value: string) => setValue("name", value)}
              size={"default"}
            />
          </Grid>
          <Grid item>
            <TextField
              label={t("personCreatePassportNumber")}
              value={personItem.passportNumber}
              onChange={(value: string) => setValue("passportNumber", value)}
              size={"default"}
              {...getErrorObjectByKey("passportNumber")}
            />
          </Grid>
          <Grid item>
            <CustomAutoComplete
              label={t("personCreateResidentStatus") + " *"}
              data={
                [
                  {
                    key: ResidentStatusOptionEnum.PHYSICAL_PERSONS_RESIDENT,
                    label: t(
                      ResidentStatusOptionEnum.PHYSICAL_PERSONS_RESIDENT
                    ),
                  },
                  {
                    key: ResidentStatusOptionEnum.PHYSICAL_PERSONS_NO_RESIDENT,
                    label: t(
                      ResidentStatusOptionEnum.PHYSICAL_PERSONS_NO_RESIDENT
                    ),
                  },
                  {
                    key: ResidentStatusOptionEnum.SOLE_PROPRIETOR_RESIDENT,
                    label: t(ResidentStatusOptionEnum.SOLE_PROPRIETOR_RESIDENT),
                  },
                  {
                    key: ResidentStatusOptionEnum.SOLE_PROPRIETOR_NO_RESIDENT,
                    label: t(
                      ResidentStatusOptionEnum.SOLE_PROPRIETOR_NO_RESIDENT
                    ),
                  },
                ] as any
              }
              size={"default"}
              displayFieldName={"label"}
              valueFieldName={"key"}
              selectedItem={personItem.residentStatus}
              {...getErrorObjectByKey("residentStatus")}
              onChange={(value) => {
                setValue("residentStatus", value);
              }}
              onClear={() => setValue("residentStatus", "")}
            />
          </Grid>
          <Grid item>
            <CustomAutoComplete
              label={t("personCreateCitizenship")}
              data={countries}
              displayFieldName={"name"}
              valueFieldName={"id"}
              selectedItem={personItem.citizenship}
              onChange={(value) => setValue("citizenship", value)}
              size={"default"}
              onClear={() => setValue("citizenship", "")}
              {...getErrorObjectByKey("citizenship")}
            />
          </Grid>
        </Grid>
      </Box>
      <StyledFooter display={"flex"} justifyContent={"flex-end"}>
        <GhostBtn onClick={onCancel}>{t("cancel")}</GhostBtn>
        &#160;&#160;
        <PrimaryBtn
          onClick={() => onSave(personItem, setPersonItem)}
          endIcon={<DoneAllIcon sx={{ width: 16, height: 14 }} />}
          children={<>Save</>}
        />
      </StyledFooter>
    </StyledRoot>
  );
};

export default PersonCreateForm;
