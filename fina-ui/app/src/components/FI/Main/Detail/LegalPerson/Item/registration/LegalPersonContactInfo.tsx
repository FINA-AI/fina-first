import { Box, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import TextField from "../../../../../../common/Field/TextField";
import FiRegionSelect from "../../../../../Common/FiRegion/FiRegionSelect";
import { styled } from "@mui/material/styles";
import { LegalPersonDataType } from "../../../../../../../types/legalPerson.type";
import React from "react";
import { CountryDataTypes } from "../../../../../../../types/common.type";
import { ContactInfoDataType } from "../../../../../../../types/fi.type";

const StyledRoot = styled(Box)({
  paddingTop: 20,
  flexDirection: "column",
  width: "100%",
  marginBottom: 24,
});

const StyledContactInfoInputBox = styled(Box)(({ theme }) => ({
  color: theme.palette.mode === "light" ? "#8695B1" : "#dde5f1",
}));

const StyledTypography = styled(Typography)(({ theme }: any) => ({
  marginBottom: 14,
  fontWeight: 600,
  fontSize: 13,
  color: theme.palette.textColor,
  lineHeight: "20px",
}));

const StyledFieldName = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === "light" ? "#596D89" : "#d8e3ea",
  fontWeight: 500,
  fontSize: 11,
  lineHeight: "12px",
  marginBottom: 2,
}));

const StyledFieldValue = styled(Typography)(({ theme }: any) => ({
  fontSize: 12,
  fontWeight: 400,
  lineHeight: "20px",
  color: theme.palette.textColor,
}));

interface LegalPersonContactInfoProps {
  selectedPerson: LegalPersonDataType;
  setSelectedPerson: (val: LegalPersonDataType) => void;
  editable: boolean;
  legalPersonData: LegalPersonDataType;
}

const LegalPersonContactInfo: React.FC<LegalPersonContactInfoProps> = ({
  selectedPerson,
  setSelectedPerson,
  editable,
  legalPersonData,
}) => {
  const { t } = useTranslation();

  const regionChange = (value: CountryDataTypes) => {
    setSelectedPerson({
      ...selectedPerson,
      contactInfo: {
        ...selectedPerson.contactInfo,
        id: selectedPerson.contactInfo?.id || 0,
        citizenship: value,
        address: selectedPerson.contactInfo?.address || "",
        phone: selectedPerson.contactInfo?.phone || "",
        webSite: selectedPerson.contactInfo?.webSite || "",
      },
    });
  };

  const getEmptyContactInfo = (): ContactInfoDataType => ({
    id: 0,
    address: "",
    phone: "",
    webSite: "",
    citizenship: { id: 0, name: "" } as CountryDataTypes,
  });

  return (
    <StyledRoot display={"flex"}>
      <Box width={"100%"}>
        <StyledTypography>{t("contactInfo")}</StyledTypography>
      </Box>
      <Grid container item xs={12}>
        <Grid item xs={12} md={6} lg={3} pr={"10px"} display={"flex"}>
          {!editable ? (
            <StyledContactInfoInputBox>
              <StyledFieldName>{t("branchFieldregion")}</StyledFieldName>
              <StyledFieldValue>
                {selectedPerson.contactInfo?.citizenship?.name}
              </StyledFieldValue>
            </StyledContactInfoInputBox>
          ) : (
            <Box width={"100%"}>
              <FiRegionSelect
                selectedItem={selectedPerson.contactInfo?.citizenship ?? null}
                onChange={(val) => {
                  if (val) regionChange(val);
                }}
                size={"default"}
              />
            </Box>
          )}
        </Grid>
        <Grid item xs={12} md={6} lg={3} pr={"10px"}>
          {!editable ? (
            <StyledContactInfoInputBox>
              <StyledFieldName>{t("branchFieldaddress")}</StyledFieldName>
              <StyledFieldValue>
                {selectedPerson.contactInfo?.address}
              </StyledFieldValue>
            </StyledContactInfoInputBox>
          ) : (
            <TextField
              size={"default"}
              label={t("address")}
              value={selectedPerson.contactInfo?.address}
              border={4}
              onChange={(value: string) => {
                if (!legalPersonData.contactInfo) {
                  legalPersonData.contactInfo = getEmptyContactInfo();
                }

                legalPersonData.contactInfo.address = value;
                legalPersonData.contactInfo.id =
                  selectedPerson.contactInfo?.id ?? 0;
              }}
              fieldName={"address"}
            />
          )}
        </Grid>
        <Grid item xs={12} md={6} lg={3} pr={"10px"}>
          {!editable ? (
            <StyledContactInfoInputBox>
              <StyledFieldName>{t("branchFieldphone")}</StyledFieldName>
              <StyledFieldValue>
                {selectedPerson.contactInfo?.phone}
              </StyledFieldValue>
            </StyledContactInfoInputBox>
          ) : (
            <TextField
              size={"default"}
              label={t("phone")}
              value={selectedPerson.contactInfo?.phone}
              border={4}
              onChange={(value: string) => {
                if (!legalPersonData.contactInfo) {
                  legalPersonData.contactInfo = getEmptyContactInfo();
                }

                legalPersonData.contactInfo.phone = value;
                legalPersonData.contactInfo.id =
                  selectedPerson.contactInfo?.id ?? 0;
              }}
              fieldName={"phone"}
            />
          )}
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          lg={3}
          sx={{ padding: "0px", paddingRight: "10px" }}
        >
          {!editable ? (
            <StyledContactInfoInputBox>
              <StyledFieldName>{t("web")}</StyledFieldName>
              <StyledFieldValue>
                {selectedPerson.contactInfo?.webSite}
              </StyledFieldValue>
            </StyledContactInfoInputBox>
          ) : (
            <TextField
              size="default"
              label={t("web")}
              value={selectedPerson.contactInfo?.webSite}
              border={4}
              onChange={(value: string) => {
                if (!legalPersonData.contactInfo) {
                  legalPersonData.contactInfo = getEmptyContactInfo();
                }

                legalPersonData.contactInfo.webSite = value;
                legalPersonData.contactInfo.id =
                  selectedPerson.contactInfo?.id ?? 0;
              }}
              fieldName={"web"}
            />
          )}
        </Grid>
      </Grid>
    </StyledRoot>
  );
};

export default LegalPersonContactInfo;
