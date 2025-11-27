import React, { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import StoreIcon from "@mui/icons-material/Store";
import FiberSmartRecordIcon from "@mui/icons-material/FiberSmartRecord";
import SpatialAudioOffIcon from "@mui/icons-material/SpatialAudioOff";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import FiInput from "../../../Common/FiInput";
import LegalFormTypeAutoComplete from "../../../Common/AutoComplete/LegalFormTypeAutoComplete";
import EconomicEntityTypeAutoComplete from "../../../Common/AutoComplete/EconomicEntityTypeAutoComplete";
import EquityFormTypeAutoComplete from "../../../Common/AutoComplete/EquityFormTypeAutoComplete";
import ManagementFormTypeAutoComplete from "../../../Common/AutoComplete/ManagementFormTypeAutoComplete";

import { AdditionalInfoType } from "../../../../../types/fi.type";
import { LegalFormIcon } from "../../../../../api/ui/icons/LegalFormIcon";

const StyledText = styled(Typography)(({ theme }: { theme: any }) => ({
  fontWeight: 500,
  fontSize: "14px",
  lineHeight: "150%",
  textTransform: "capitalize",
  color: theme.palette.textColor,
  marginTop: "8px",
}));

interface FiLegalTypeInfoProps {
  additionalInfo: AdditionalInfoType;
  editMode: boolean;
  onValueChange: (
    value: AdditionalInfoType,
    name: string,
    valid?: boolean
  ) => void;
}

const FiLegalTypeInfo: React.FC<FiLegalTypeInfoProps> = ({
  additionalInfo,
  editMode,
  onValueChange,
}) => {
  const { t } = useTranslation();

  const [legalTypeInfo, setLegalTypeInfo] = useState(additionalInfo);

  useEffect(() => {
    setLegalTypeInfo(additionalInfo);
  }, [additionalInfo]);

  const changeAdditionalInfo = (value: any, name: string, valid?: boolean) => {
    const newInfo = {
      ...legalTypeInfo,
      [name]: value,
    };
    setLegalTypeInfo(newInfo);
    onValueChange(newInfo, "additionalInfo", valid);
  };

  const handleBusinessEntityChange = (
    value: any,
    name: string,
    valid?: boolean
  ) => {
    changeAdditionalInfo(value, name, valid);
    onValueChange(value?.code ?? "", "legalForm", valid);
  };

  const Header = () => {
    return (
      <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
        <StyledText>{t("legalPersonType")}</StyledText>
      </Box>
    );
  };

  return (
    <Box display={"flex"} width={"100%"} flexDirection={"column"}>
      <Header />
      <Grid container>
        <Grid item p={"4px"} xs={3}>
          <FiInput
            title={t("legalForm")}
            value={t(additionalInfo?.businessEntity?.code ?? "")}
            name={"businessEntity"}
            icon={<LegalFormIcon />}
            editMode={editMode}
            onValueChange={handleBusinessEntityChange}
            component={
              <LegalFormTypeAutoComplete
                size={"small"}
                hideLabel={true}
                selectedItem={
                  legalTypeInfo?.businessEntity
                    ? {
                        ...legalTypeInfo.businessEntity,
                        description: t(legalTypeInfo.businessEntity.code),
                      }
                    : null
                }
                onChange={(value) => {
                  handleBusinessEntityChange(
                    value,
                    "businessEntity",
                    !(value === null)
                  );
                }}
                onClear={() => {
                  handleBusinessEntityChange(null, "businessEntity", true);
                }}
                allowInvalidInputSelection
              />
            }
            width="100%"
          />
        </Grid>
        <Grid item p="4px" xs={3}>
          <FiInput
            title={t("legalEntityStatus")}
            name={"economicEntity"}
            value={t(additionalInfo?.economicEntity?.code ?? "")}
            icon={<FiberSmartRecordIcon />}
            editMode={editMode}
            onValueChange={changeAdditionalInfo}
            component={
              <EconomicEntityTypeAutoComplete
                size={"small"}
                hideLabel={true}
                selectedItem={
                  legalTypeInfo?.economicEntity
                    ? {
                        ...legalTypeInfo.economicEntity,
                        description: t(legalTypeInfo.economicEntity.code),
                      }
                    : null
                }
                onChange={(value) => {
                  changeAdditionalInfo(
                    value,
                    "economicEntity",
                    !(value === null)
                  );
                }}
                onClear={() => {
                  changeAdditionalInfo(null, "economicEntity", true);
                }}
                allowInvalidInputSelection
              />
            }
            width={"100%"}
          />
        </Grid>
        <Grid item p={"4px"} xs={3}>
          <FiInput
            title={t("equityForm")}
            name={"equityForm"}
            value={t(additionalInfo?.equityForm?.code ?? "")}
            icon={<StoreIcon />}
            editMode={editMode}
            onValueChange={changeAdditionalInfo}
            component={
              <EquityFormTypeAutoComplete
                size="small"
                hideLabel
                selectedItem={
                  legalTypeInfo?.equityForm
                    ? {
                        ...legalTypeInfo.equityForm,
                        description: t(legalTypeInfo.equityForm.code),
                      }
                    : null
                }
                onChange={(value) => {
                  changeAdditionalInfo(value, "equityForm", !(value === null));
                }}
                onClear={() => {
                  changeAdditionalInfo(null, "equityForm", true);
                }}
                allowInvalidInputSelection
              />
            }
            width={"100%"}
          />
        </Grid>
        <Grid item p={"4px"} xs={3}>
          <FiInput
            title={t("managementForm")}
            name={"managementForm"}
            value={t(additionalInfo?.managementForm?.code ?? "")}
            icon={<SpatialAudioOffIcon />}
            editMode={editMode}
            onValueChange={changeAdditionalInfo}
            component={
              <ManagementFormTypeAutoComplete
                size="small"
                hideLabel
                selectedItem={
                  legalTypeInfo?.managementForm
                    ? {
                        ...legalTypeInfo.managementForm,
                        description: t(legalTypeInfo.managementForm.code),
                      }
                    : null
                }
                onChange={(value) => {
                  changeAdditionalInfo(
                    value,
                    "managementForm",
                    !(value === null)
                  );
                }}
                onClear={() => {
                  changeAdditionalInfo(null, "managementForm", true);
                }}
                allowInvalidInputSelection
              />
            }
            width={"100%"}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default FiLegalTypeInfo;
