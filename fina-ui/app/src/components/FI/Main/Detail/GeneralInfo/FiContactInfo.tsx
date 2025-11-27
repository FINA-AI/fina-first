import { Box, Grid, Typography } from "@mui/material";
import FiInput from "../../../Common/FiInput";
import MailIcon from "@mui/icons-material/Mail";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DesktopMacIcon from "@mui/icons-material/DesktopMac";
import PhoneIcon from "@mui/icons-material/Phone";
import { useTranslation } from "react-i18next";
import useConfig from "../../../../../hoc/config/useConfig";
import { validateEmail } from "../../../../../util/component/validationUtil";
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { FiDataType } from "../../../../../types/fi.type";
import { FaxIcon } from "../../../../../api/ui/icons/FaxIcon";
import { UserCheckedIcon } from "../../../../../api/ui/icons/UserCheckedIcon";

interface FiContactInfoProps {
  fi: FiDataType;
  editMode: boolean;
  onValueChange: (value: any, field: string, isValid?: boolean) => void;
}

const StyledText = styled(Typography)(({ theme }: { theme: any }) => ({
  fontWeight: 500,
  fontSize: "14px",
  lineHeight: "150%",
  textTransform: "capitalize",
  color: theme.palette.textColor,
  marginTop: "8px",
}));

const FiContactInfo: React.FC<FiContactInfoProps> = ({
  fi,
  editMode = false,
  onValueChange,
}) => {
  const { t } = useTranslation();
  const { config } = useConfig();
  const [validationInfo, setValidationInfo] = useState<{ email: boolean }>({
    email: true,
  });

  useEffect(() => {
    if (editMode) {
      setValidationInfo((prev) => ({ ...prev, email: true }));
    }
  }, [editMode]);

  const Header = () => {
    return (
      <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
        <StyledText>{t("contactInfo")}</StyledText>
      </Box>
    );
  };

  return (
    <Box display={"flex"} width={"100%"} flexDirection={"column"}>
      <Header />
      <Grid container>
        <Grid item p={"4px"} xs={3}>
          <FiInput
            title={t("phone")}
            value={fi.phone}
            name={"phone"}
            icon={<PhoneIcon />}
            editMode={editMode}
            onValueChange={onValueChange}
            width={"100%"}
          />
        </Grid>
        <Grid item xs={3} p={"4px"}>
          <FiInput
            title={t("email")}
            name={"email"}
            value={fi.email}
            icon={<MailIcon />}
            editMode={editMode}
            onValueChange={(val, field) => {
              let isValid = validateEmail(config, val);
              setValidationInfo({ ...validationInfo, email: isValid });
              onValueChange(val, field, isValid);
            }}
            width={"100%"}
            error={!validationInfo.email}
            errorText={
              editMode && !validationInfo.email ? t("invalidemail") : undefined
            }
          />
        </Grid>
        <Grid item xs={3} p={"4px"}>
          <FiInput
            title={t("representative")}
            name={"representativePerson"}
            value={fi.representativePerson}
            icon={<UserCheckedIcon />}
            editMode={editMode}
            onValueChange={onValueChange}
            width={"100%"}
            pattern={/^$|^[^\d]+$/}
          />
        </Grid>
        <Grid item xs={3} p={"4px"}>
          <FiInput
            title={t("webSite")}
            name={"webSite"}
            value={fi.webSite}
            icon={<DesktopMacIcon />}
            editMode={editMode}
            onValueChange={onValueChange}
            width={"100%"}
          />
        </Grid>
        <Grid item xs={3} p={"4px"}>
          <FiInput
            title={t("address")}
            name={"addressString"}
            value={fi.addressString}
            icon={<LocationOnIcon />}
            editMode={editMode}
            onValueChange={onValueChange}
            width={"100%"}
          />
        </Grid>
        <Grid item xs={3} p={"4px"}>
          <FiInput
            title={t("fax")}
            name={"fax"}
            value={fi.fax}
            icon={<FaxIcon />}
            editMode={editMode}
            onValueChange={onValueChange}
            width={"100%"}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default FiContactInfo;
