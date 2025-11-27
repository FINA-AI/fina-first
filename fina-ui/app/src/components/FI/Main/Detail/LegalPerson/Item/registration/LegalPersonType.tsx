import { Box, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import LegalFormTypeAutoComplete from "../../../../../Common/AutoComplete/LegalFormTypeAutoComplete";
import React from "react";
import EconomicEntityTypeAutoComplete from "../../../../../Common/AutoComplete/EconomicEntityTypeAutoComplete";
import EquityFormTypeAutoComplete from "../../../../../Common/AutoComplete/EquityFormTypeAutoComplete";
import ManagementFormTypeAutoComplete from "../../../../../Common/AutoComplete/ManagementFormTypeAutoComplete";
import { styled } from "@mui/material/styles";
import { LegalPersonDataType } from "../../../../../../../types/legalPerson.type";

const StyledRoot = styled(Box)({
  paddingTop: 20,
  display: "flex",
  flexDirection: "column",
  width: "100%",
});

const StyledTypography = styled(Typography)(({ theme }: any) => ({
  marginBottom: 14,
  fontWeight: 600,
  fontSize: 13,
  color: theme.palette.textColor,
  lineHeight: "20px",
}));

const StyledPersonTypeInfoBox = styled(Typography)(({ theme }) => ({
  width: 350,
  color: theme.palette.mode === "light" ? "#8695B1" : "#dde5f1",
}));

const StyledFieldValue = styled(Typography)(({ theme }: any) => ({
  fontSize: 12,
  fontWeight: 400,
  lineHeight: "20px",
  color: theme.palette.textColor,
}));

const StyledFieldName = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === "light" ? "#596D89" : "#d8e3ea",
  fontWeight: 500,
  fontSize: 11,
  lineHeight: "12px",
  marginBottom: 2,
}));

interface LegalPersonTypeProps {
  selectedPerson: LegalPersonDataType;
  setSelectedPerson: (val: LegalPersonDataType) => void;
  editable: boolean;
  disabled: boolean;
}

const LegalPersonType: React.FC<LegalPersonTypeProps> = ({
  selectedPerson,
  setSelectedPerson,
  editable,
  disabled,
}) => {
  const { t } = useTranslation();

  const setValue = (key: string, value: any) => {
    const tmp = { ...selectedPerson };
    tmp.metaInfo = {
      ...selectedPerson.metaInfo,
      [key]: value,
    };
    setSelectedPerson(tmp);
  };

  const getValue = (key: string) => {
    if (
      selectedPerson &&
      selectedPerson.metaInfo &&
      selectedPerson.metaInfo[key]
    ) {
      return selectedPerson.metaInfo[key]["description"];
    }

    return null;
  };

  return (
    <StyledRoot>
      <Box width={"100%"}>
        <StyledTypography>{t("legalPersonType")}</StyledTypography>
      </Box>
      <Grid item container xs={12} display={"flex"}>
        <Grid
          item
          xs={12}
          md={6}
          lg={3}
          sx={{ display: "flex", paddingRight: "10px" }}
        >
          {!editable ? (
            <StyledPersonTypeInfoBox>
              <StyledFieldName>{t("legalForm")}</StyledFieldName>
              <StyledFieldValue>{getValue("businessEntity")}</StyledFieldValue>
            </StyledPersonTypeInfoBox>
          ) : (
            <Box width={"100%"}>
              <LegalFormTypeAutoComplete
                selectedItem={selectedPerson?.metaInfo?.businessEntity}
                onChange={(value) => {
                  setValue("businessEntity", value);
                }}
                onClear={() => setValue("businessEntity", null)}
                disabled={disabled}
              />
            </Box>
          )}
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          lg={3}
          sx={{ display: "flex", paddingRight: "10px" }}
        >
          {!editable ? (
            <StyledPersonTypeInfoBox>
              <StyledFieldName>{t("legalEntityStatus")}</StyledFieldName>
              <StyledFieldValue>{getValue("economicEntity")}</StyledFieldValue>
            </StyledPersonTypeInfoBox>
          ) : (
            <Box width={"100%"}>
              <EconomicEntityTypeAutoComplete
                disabled={disabled}
                selectedItem={selectedPerson?.metaInfo?.economicEntity}
                onChange={(value) => {
                  setValue("economicEntity", value);
                }}
                onClear={() => setValue("economicEntity", null)}
              />
            </Box>
          )}
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          lg={3}
          sx={{ display: "flex", paddingRight: "10px" }}
        >
          {!editable ? (
            <StyledPersonTypeInfoBox>
              <StyledFieldName>{t("equityForm")}</StyledFieldName>
              <StyledFieldValue>{getValue("equityForm")}</StyledFieldValue>
            </StyledPersonTypeInfoBox>
          ) : (
            <Box width={"100%"}>
              <EquityFormTypeAutoComplete
                disabled={disabled}
                selectedItem={selectedPerson?.metaInfo?.equityForm}
                onChange={(value) => {
                  setValue("equityForm", value);
                }}
                onClear={() => setValue("equityForm", null)}
              />
            </Box>
          )}
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          lg={3}
          sx={{
            padding: "0px",
            paddingRight: "10px",
          }}
        >
          {!editable ? (
            <StyledPersonTypeInfoBox>
              <StyledFieldName>{t("managementForm")}</StyledFieldName>
              <StyledFieldValue>{getValue("managementForm")}</StyledFieldValue>
            </StyledPersonTypeInfoBox>
          ) : (
            <Box width={"100%"}>
              <ManagementFormTypeAutoComplete
                disabled={disabled}
                selectedItem={selectedPerson?.metaInfo?.managementForm}
                onChange={(value) => {
                  setValue("managementForm", value);
                }}
                onClear={() => setValue("managementForm", null)}
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </StyledRoot>
  );
};

export default LegalPersonType;
