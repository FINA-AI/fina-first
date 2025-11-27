import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FiInput from "../../../FI/Common/FiInput";
import PhoneIcon from "@mui/icons-material/Phone";
import DesktopMacIcon from "@mui/icons-material/DesktopMac";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import UsersGroupCards from "../Common/UsersGroupCards";
import { FieldType } from "../../../FI/util/FiUtil";
import UserGeneralPassword from "./UserGeneralPassword";
import UseGeneralHeader from "./UseGeneralHeader";
import { UserAuthTypeEnum } from "../../../../types/common.type";
import UserGeneralAccountDetails from "./UserGeneralAccountDetails";
import {
  UserType,
  UserTypeEnum,
  UserTypeWithUIProps,
} from "../../../../types/user.type";
import { styled } from "@mui/system";
import { Group } from "../../../../types/group.type";
import { Config } from "../../../../types/config.type";
import { TypesIcon } from "../../../../api/ui/icons/TypesIcon";
import { UserCheckedIcon } from "../../../../api/ui/icons/UserCheckedIcon";

interface UsersGeneralProps {
  groups: Group[];
  currUser: Partial<UserTypeWithUIProps>;
  editMode: boolean;
  onSaveFunction: (formValidationHelper: any) => void;
  onCancelFunction: VoidFunction;
  onEditFunction: (editMode: boolean) => void;
  config: Config;
  setCurrUser: React.Dispatch<
    React.SetStateAction<Partial<UserTypeWithUIProps> | null>
  >;
  formValidationHelper: any;
  requiredFields: string[];
  userId: string;
  resetUserData(object: Partial<UserType>): void;
  deleteUserFunction(userId: number): Promise<void>;
  setUserData(object: Partial<UserType>): void;
  changeNewUserInfo(key: string, value: string): void;
}

const StyledBox = styled(Box)(() => ({
  position: "relative",
  height: "100%",
  borderCollapse: "unset",
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
}));

const StyledGroupSelection = styled(Box)<{ _disabled: boolean }>(
  ({ _disabled }) => ({
    padding: 14,
    opacity: _disabled ? 0.6 : "",
  })
);

const StyledTypography = styled(Typography)(() => ({
  fontWeight: 600,
  fontSize: 13,
  lineHeight: "20px",
  marginLeft: 4,
}));

const UsersGeneral: React.FC<UsersGeneralProps> = ({
  groups,
  currUser,
  editMode,
  onSaveFunction,
  onCancelFunction,
  onEditFunction,
  changeNewUserInfo,
  setUserData,
  config,
  setCurrUser,
  deleteUserFunction,
  formValidationHelper,
  requiredFields,
  resetUserData,
  userId,
}) => {
  const { t } = useTranslation();
  const [userCreationType, setUserCreationType] = useState<UserTypeEnum>();

  const getUserType = (currUser: Partial<UserTypeWithUIProps>) =>
    currUser.userType
      ? currUser.userType
      : config.authenticationType === UserAuthTypeEnum.LDAP
      ? UserTypeEnum.LDAP_USER
      : UserTypeEnum.FINA_USER;

  useEffect(() => {
    if (currUser.userType) {
      setUserCreationType(getUserType(currUser));
    }
  }, [currUser.userType]);

  useEffect(() => {
    if (!currUser.id) {
      const userType = getUserType(currUser);
      setUserData({ id: 0, userType });
      setCurrUser((prevState) => ({ ...prevState, userType }));
    }
  }, [currUser]);

  const isDisabled = () => {
    if (config.authenticationType === UserAuthTypeEnum.LDAP) {
      return true;
    }
    return (
      config.authenticationType === UserAuthTypeEnum.MIXED &&
      userCreationType === UserTypeEnum.LDAP_USER
    );
  };

  const validatePasswordMatch = (match: boolean) => {
    formValidationHelper.passwordMatch = match;
  };

  const isFieldRequired = (fieldName: string) => {
    return (
      userCreationType !== UserTypeEnum.LDAP_USER &&
      requiredFields &&
      requiredFields.includes(fieldName)
    );
  };

  return (
    <StyledBox>
      <UseGeneralHeader
        editMode={editMode}
        onCancelFunction={onCancelFunction}
        currUser={currUser}
        onEditFunction={onEditFunction}
        onSaveFunction={onSaveFunction}
        setUserData={setUserData}
        config={config}
        changeNewUserInfo={changeNewUserInfo}
        setCurrUser={setCurrUser}
        userCreationType={userCreationType}
        setUserCreationType={setUserCreationType}
        deleteUserFunction={deleteUserFunction}
        formValidationHelper={formValidationHelper}
        resetUserData={resetUserData}
        userId={userId}
      />
      <Box boxSizing={"border-box"} borderRadius={"8px"} overflow={"auto"}>
        <Box>
          <Grid
            container
            direction={"row"}
            wrap={"wrap"}
            p={"12px"}
            item
            xs={12}
          >
            <Grid item xl={4} md={4} sm={6} xs={12} padding={"4px"}>
              <FiInput
                title={t("fullname")}
                name={"fullname"}
                value={currUser.description}
                icon={<AssignmentIndIcon />}
                editMode={editMode}
                readOnly={isDisabled()}
                disabled={isDisabled()}
                onValueChange={(val) => {
                  setUserData({ description: val });
                  if (!currUser.id) {
                    changeNewUserInfo("userFullName", val);
                  }
                }}
                width={"auto"}
                required={isFieldRequired("description")}
                tooltip={true}
                tooltipText={t("requiredField")}
                fieldValidationFunction={(v) => {
                  if (
                    currUser.userType === UserTypeEnum.FINA_USER &&
                    requiredFields.includes("description")
                  ) {
                    return Boolean(v);
                  }
                  return true;
                }}
              />
            </Grid>
            <Grid item xl={4} md={4} sm={6} xs={12} padding={"4px"}>
              <FiInput
                title={t("usertitle")}
                name={"title"}
                value={currUser.titleDescription}
                readOnly={isDisabled()}
                disabled={isDisabled()}
                required={isFieldRequired("title")}
                icon={<UserCheckedIcon />}
                editMode={editMode}
                onValueChange={(val) => {
                  setUserData({ titleDescription: val });
                }}
                width={"auto"}
              />
            </Grid>

            <Grid item xl={4} md={4} sm={6} xs={12} padding={"4px"}>
              <FiInput
                title={t("phone")}
                name={"phone"}
                value={currUser.phone}
                readOnly={isDisabled()}
                disabled={isDisabled()}
                icon={<PhoneIcon />}
                editMode={editMode}
                onValueChange={(val) => {
                  setUserData({ phone: val });
                }}
                width={"auto"}
                required={isFieldRequired("phone")}
                tooltip={true}
                tooltipText={t("requiredField")}
                fieldValidationFunction={(val) => {
                  if (
                    currUser.userType === UserTypeEnum.FINA_USER &&
                    requiredFields.includes("phone")
                  ) {
                    return Boolean(val);
                  }
                  return true;
                }}
              />
            </Grid>
            <Grid item xl={4} md={4} sm={6} xs={12} padding={"4px"}>
              <FiInput
                title={t("email")}
                name={"email"}
                readOnly={isDisabled()}
                disabled={isDisabled()}
                required={isFieldRequired("email")}
                value={currUser.email}
                icon={<MailOutlineIcon />}
                editMode={editMode}
                onValueChange={(val) => {
                  setUserData({ email: val });
                }}
                width={"auto"}
                tooltip={true}
                tooltipText={t("invalidemail")}
                fieldValidationFunction={(val) => {
                  return formValidationHelper.validateEmail(currUser, val);
                }}
              />
            </Grid>
            <Grid item xl={4} md={4} sm={6} xs={12} padding={"4px"}>
              <FiInput
                title={t("currUserType")}
                name={"type"}
                value={currUser.userType}
                readOnly={true}
                disabled={true}
                icon={<TypesIcon />}
                editMode={editMode}
                onValueChange={(val) => {
                  setUserData({ userType: val });
                }}
                width={"auto"}
                inputTypeProp={{
                  inputType: FieldType.LIST,
                  listData: [
                    { label: t("finaUser"), value: UserTypeEnum.FINA_USER },
                    { label: t("ldap"), value: UserTypeEnum.LDAP_USER },
                  ],
                }}
              />
            </Grid>
            <Grid item xl={4} md={4} sm={6} xs={12} padding={"4px"}>
              <FiInput
                title={t("contactPerson")}
                name={"contact"}
                required={isFieldRequired("contact")}
                value={currUser.contactPerson}
                readOnly={isDisabled()}
                disabled={isDisabled()}
                icon={<DesktopMacIcon />}
                editMode={editMode}
                onValueChange={(val) => {
                  setUserData({ contactPerson: val });
                }}
                width={"auto"}
              />
            </Grid>
            <Grid item xl={4} md={4} sm={6} xs={12} padding={"4px"}>
              <FiInput
                title={t("contactPersonPosition")}
                name={"contactPersonPosition"}
                required={isFieldRequired("contactPersonPosition")}
                value={currUser.contactPersonPosition}
                readOnly={isDisabled()}
                disabled={isDisabled()}
                icon={<TypesIcon />}
                editMode={editMode}
                onValueChange={(val) => {
                  setUserData({ contactPersonPosition: val });
                }}
                width={"auto"}
              />
            </Grid>
          </Grid>
        </Box>
        <UserGeneralPassword
          currUser={currUser}
          editMode={editMode}
          setUserData={setUserData}
          disableFunction={isDisabled}
          validatePasswordMatch={validatePasswordMatch}
          formValidationHelper={formValidationHelper}
          userCreationType={userCreationType}
        />
        <UserGeneralAccountDetails
          currUser={currUser}
          editMode={editMode}
          setUserData={setUserData}
          config={config}
        />
        <StyledGroupSelection _disabled={editMode}>
          <StyledTypography>{t("groups")}</StyledTypography>
          <Grid
            sx={{
              paddingTop: "10px",
            }}
            container
            item
            xs={12}
            data-testid={"users-groups"}
          >
            {groups.map((group, i) => (
              <UsersGroupCards
                key={"item" + i}
                permitted={true}
                name={group.code}
                text={group.description}
                index={i}
              />
            ))}
          </Grid>
        </StyledGroupSelection>
      </Box>
    </StyledBox>
  );
};

export default UsersGeneral;
