import Tooltip from "../../../common/Tooltip/Tooltip";
import { Box } from "@mui/material";
import { ActiveLDAPUser } from "../../../../api/ui/icons/ActiveLDAPUser";
import { useTranslation } from "react-i18next";
import CustomUserIcon from "./CustomUserIcon";
import { UserType, UserTypeEnum } from "../../../../types/user.type";
import React from "react";
import { ActiveLockLDAPUser } from "../../../../api/ui/icons/ActiveLockLDAPUser";
import { ActiveFinaUser } from "../../../../api/ui/icons/ActiveFinaUser";
import { InactiveFinaUser } from "../../../../api/ui/icons/InactiveFinaUser";
import { InactiveLockFinaUser } from "../../../../api/ui/icons/InactiveLockFinaUser";
import { ActiveLockFinaUser } from "../../../../api/ui/icons/ActiveLockFinaUser";
import { InactiveLockLDAPUser } from "../../../../api/ui/icons/InactiveLockLDAPUser";
import { InactiveLDAPUser } from "../../../../api/ui/icons/InactiveLDAPUser";

interface UserIconProps {
  user: Partial<UserType>;
  selectedUser?: Partial<UserType>;
}

const UserIcon: React.FC<UserIconProps> = ({ user, selectedUser }) => {
  const { t } = useTranslation();

  const tooltipValue = () => {
    switch (user.userType) {
      case UserTypeEnum.LDAP_USER:
        return `${t(UserTypeEnum.LDAP_USER)} ${user.blocked ? "blocked" : ""}`;
      default:
        return `${t(UserTypeEnum.FINA_USER)}  ${user.blocked ? "blocked" : ""}`;
    }
  };

  const getIcons = (userType?: UserTypeEnum) => {
    if (!user.blocked && !user.disabled) {
      return userType === UserTypeEnum.LDAP_USER ? (
        <ActiveLDAPUser />
      ) : (
        <ActiveFinaUser />
      );
    }

    if (user.blocked && user.disabled) {
      return userType === UserTypeEnum.LDAP_USER ? (
        <InactiveLockLDAPUser />
      ) : (
        <InactiveLockFinaUser />
      );
    }

    if (user.blocked && !user.disabled) {
      return userType === UserTypeEnum.LDAP_USER ? (
        <ActiveLockLDAPUser />
      ) : (
        <ActiveLockFinaUser />
      );
    }

    if (!user.blocked && user.disabled) {
      return userType === "LDAP_USER" ? (
        <InactiveLDAPUser />
      ) : (
        <InactiveFinaUser />
      );
    }

    return <></>;
  };

  const GetFinaUserIcon = () => {
    return (
      <Box display={"flex"}>
        <CustomUserIcon isSelectedUser={user.id === selectedUser?.id}>
          {getIcons()}
        </CustomUserIcon>
      </Box>
    );
  };

  const GetIcons = () => {
    switch (user.userType) {
      case "LDAP_USER":
        return (
          <Box display={"flex"}>
            <CustomUserIcon isSelectedUser={user.id === selectedUser?.id}>
              {getIcons(UserTypeEnum.LDAP_USER)}
            </CustomUserIcon>
          </Box>
        );
      default:
        return GetFinaUserIcon();
    }
  };

  return (
    <Box
      sx={{
        marginRight: "3px",
      }}
    >
      <Tooltip title={tooltipValue()} arrow>
        {GetIcons()}
      </Tooltip>
    </Box>
  );
};

export default UserIcon;
