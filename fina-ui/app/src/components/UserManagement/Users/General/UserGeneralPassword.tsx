import { Box, Grid, Typography } from "@mui/material";
import FiInput from "../../../FI/Common/FiInput";
import LockIcon from "@mui/icons-material/Lock";
import MailIcon from "@mui/icons-material/Mail";
import { FieldType } from "../../../FI/util/FiUtil";
import React, { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  UserType,
  UserTypeEnum,
  UserTypeWithUIProps,
} from "../../../../types/user.type";
import { styled } from "@mui/system";

interface UserGeneralPasswordProps {
  editMode: boolean;
  currUser: Partial<UserTypeWithUIProps>;
  disableFunction: () => boolean;
  formValidationHelper: any;
  userCreationType?: UserTypeEnum;
  setUserData(object: Partial<UserType>): void;
  validatePasswordMatch(match: boolean): void;
}

const StyledTitle = styled(Typography)(() => ({
  fontWeight: 600,
  fontSize: 13,
  lineHeight: "20px",
  marginLeft: 6,
}));

const UserGeneralPassword: React.FC<UserGeneralPasswordProps> = ({
  editMode,
  currUser,
  setUserData,
  disableFunction,
  validatePasswordMatch,
  formValidationHelper,
  userCreationType,
}) => {
  const { t } = useTranslation();
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);

  const [passwordInfo, setPasswordInfo] = useState({
    password: "",
    repeatPassword: "",
  });

  useEffect(() => {
    if (userCreationType && userCreationType === UserTypeEnum.LDAP_USER) {
      setUserData({ ...currUser, password: "" });
      setPasswordInfo({ password: "", repeatPassword: "" });
      setIsValidPassword(true);
      setPasswordsMatch(true);
    }
  }, [userCreationType]);

  useEffect(() => {
    if (userCreationType && userCreationType !== UserTypeEnum.LDAP_USER) {
      const passMatch = passwordInfo.password === passwordInfo.repeatPassword;
      setPasswordsMatch(passMatch);
      validatePasswordMatch(passMatch);
      setIsValidPassword(formValidationHelper.isPasswordValid);
    }
  }, [editMode, passwordInfo]);

  const isError = () => {
    if (!editMode) {
      return false;
    }
    if (userCreationType === UserTypeEnum.LDAP_USER) {
      return false;
    }
    return !isValidPassword || !passwordsMatch;
  };

  return (
    <Box padding={"12px"}>
      <StyledTitle> {t("password")} </StyledTitle>
      <Grid
        container
        item
        xs={12}
        wrap={"wrap"}
        direction={"row"}
        paddingTop={"12px"}
      >
        <Grid item xl={4} md={4} sm={6} xs={12} padding={"4px"}>
          <FiInput
            title={t("password")}
            name={"password"}
            tooltip={true}
            value={editMode ? passwordInfo.password : "********"}
            icon={editMode ? <LockIcon /> : <MailIcon />}
            readOnly={disableFunction()}
            disabled={disableFunction()}
            editMode={editMode}
            required={
              currUser.id === 0 && userCreationType !== UserTypeEnum.LDAP_USER
            }
            onValueChange={(value) => {
              setPasswordInfo({ ...passwordInfo, password: value });
              setUserData({
                password: value,
                passwordChanged: true,
              });
            }}
            width={"auto"}
            inputTypeProp={{
              inputType: FieldType.PASSWORD,
            }}
            error={isError()}
            fieldValidationFunction={(val) => {
              if (userCreationType !== UserTypeEnum.LDAP_USER) {
                return formValidationHelper.validatePassword(currUser, val);
              }
            }}
            tooltipText={t(formValidationHelper?.getValidationMessageI18nKey())}
          />
        </Grid>
        <Grid item xl={4} md={4} sm={6} xs={12} padding={"4px"}>
          <FiInput
            title={t("confirmPassword")}
            name={"confirmPassword"}
            value={editMode ? passwordInfo.repeatPassword : "********"}
            icon={editMode ? <LockIcon /> : <MailIcon />}
            editMode={editMode}
            readOnly={disableFunction()}
            disabled={disableFunction()}
            required={
              currUser.id === 0 && userCreationType !== UserTypeEnum.LDAP_USER
            }
            onValueChange={(value) => {
              setPasswordInfo({ ...passwordInfo, repeatPassword: value });
            }}
            width={"auto"}
            inputTypeProp={{
              inputType: FieldType.PASSWORD,
            }}
            error={isError()}
            errorText={!passwordsMatch ? t("passwordDoesntMatch") : ""}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default memo(UserGeneralPassword, (prevProps, nextProps) => {
  return (
    prevProps.editMode === nextProps.editMode &&
    prevProps.currUser.id === nextProps.currUser.id &&
    prevProps.userCreationType === nextProps.userCreationType
  );
});
