import React, { useEffect, useState } from "react";
import { Box, ToggleButton, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { darken, styled } from "@mui/system";
import { UserTypeEnum, UserTypeWithUIProps } from "../../../../types/user.type";
import { UserAuthTypeEnum } from "../../../../types/common.type";
import { Config } from "../../../../types/config.type";

interface UserGeneralAccountDetailsProps {
  editMode: boolean;
  currUser: Partial<UserTypeWithUIProps>;
  setUserData: (data: any) => void;
  config: Config;
}

const StyledAccountText = styled(Typography)(() => ({
  fontWeight: 600,
  fontSize: 13,
  lineHeight: "20px",
  marginLeft: 4,
}));

interface StyledToggleButtonProps {
  _active?: boolean;
}

const StyledToggleButtonWrapper = styled(Box)<StyledToggleButtonProps>(
  ({ theme, _active }) => ({
    marginRight: "5px",
    "& .MuiButtonBase-root": _active && {
      color: `${
        theme.palette.mode === "dark" ? "#1F2532" : "#FFFFFF"
      } !important`,
      backgroundColor: `${darken(theme.palette.primary.main, 0.2)} !important`,
      "&:hover": {
        backgroundColor: `${theme.palette.primary.main} !important`,
      },
    },
  })
);

const StyledToggleButton = styled(ToggleButton)(() => ({
  height: 25,
  width: "fit-content",
  padding: "4px 8px",
  fontSize: 12,
  fontWeight: 500,
  lineHeight: "16px",
  textTransform: "capitalize",
  borderRadius: 30,
}));

const UserGeneralAccountDetails: React.FC<UserGeneralAccountDetailsProps> = ({
  currUser,
  editMode,
  setUserData,
  config,
}) => {
  const { t } = useTranslation();
  const [disableAccount, setDisableAccount] = useState(false);
  const [blockAccount, setBlockAccount] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  useEffect(() => {
    setBlockAccount(currUser.blocked ?? false);
    setDisableAccount(currUser.disabled ?? false);
    setChangePassword(currUser.changePassword ?? false);
  }, [currUser.id, editMode]);

  const isLDAPUser = currUser.userType === UserTypeEnum.LDAP_USER;
  const isAuthTypeMixed = config.authenticationType === UserAuthTypeEnum.MIXED;

  return (
    <Box
      padding={"12px"}
      display={"flex"}
      flexDirection={"column"}
      data-testid={"account-details"}
    >
      <StyledAccountText>{t("accountDetail")}</StyledAccountText>
      <Box display={"flex"} gap={"10px"} paddingTop={"12px"}>
        <StyledToggleButtonWrapper _active={disableAccount}>
          <StyledToggleButton
            onClick={() => {
              if (editMode) {
                setUserData({ disabled: !disableAccount });
                setDisableAccount(!disableAccount);
              }
            }}
            disabled={!editMode}
            value={disableAccount}
            data-testid={"disable-account-button"}
          >
            {t("disableAccount")}
          </StyledToggleButton>
        </StyledToggleButtonWrapper>
        <StyledToggleButtonWrapper
          _active={blockAccount}
          hidden={isLDAPUser && !isAuthTypeMixed}
        >
          <StyledToggleButton
            onClick={() => {
              if (editMode) {
                if (isLDAPUser) return;
                setUserData({ blocked: !blockAccount });
                setBlockAccount(!blockAccount);
              }
            }}
            disabled={!editMode}
            value={blockAccount}
            data-testid={"blocked-account-button"}
          >
            {t("blockedAccount")}
          </StyledToggleButton>
        </StyledToggleButtonWrapper>
        <StyledToggleButtonWrapper
          _active={changePassword}
          hidden={isLDAPUser && !isAuthTypeMixed}
        >
          <StyledToggleButton
            onClick={() => {
              if (editMode) {
                if (isLDAPUser) return;
                setUserData({ changePassword: !changePassword });
                setChangePassword(!changePassword);
              }
            }}
            disabled={!editMode}
            value={changePassword}
            data-testid={"change-password-button"}
          >
            {t("changePassword")}
          </StyledToggleButton>
        </StyledToggleButtonWrapper>
      </Box>
    </Box>
  );
};

export default UserGeneralAccountDetails;
