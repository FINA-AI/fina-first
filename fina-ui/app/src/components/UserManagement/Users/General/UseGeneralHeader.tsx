import { Box, Chip, Typography } from "@mui/material";
import TextButton from "../../../common/Button/TextButton";
import CheckIcon from "@mui/icons-material/Check";
import PrimaryBtn from "../../../common/Button/PrimaryBtn";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { loadLdapUsers } from "../../../../api/services/userManagerService";
import CustomAutoComplete from "../../../common/Field/CustomAutoComplete";
import DeleteForm from "../../../common/Delete/DeleteForm";
import UserLoginTextField from "./UserLoginTextField";
import {
  UserType,
  UserTypeEnum,
  UserTypeWithUIProps,
} from "../../../../types/user.type";
import { UserAuthTypeEnum } from "../../../../types/common.type";
import useConfig from "../../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../../api/permissions";
import { styled } from "@mui/system";
import { Config } from "../../../../types/config.type";

interface UseGeneralHeaderProps {
  editMode: boolean;
  onCancelFunction: VoidFunction;
  onEditFunction: (editMode: boolean) => void;
  currUser: Partial<UserTypeWithUIProps>;
  onSaveFunction: (formValidationHelper: any) => void;
  config: Config;
  setCurrUser: React.Dispatch<
    React.SetStateAction<Partial<UserTypeWithUIProps> | null>
  >;
  setUserCreationType: (value: UserTypeEnum) => void;
  userCreationType?: UserTypeEnum;
  formValidationHelper: any;
  userId: string;
  resetUserData(object: Partial<UserType>): void;
  deleteUserFunction(userId: number): Promise<void>;
  setUserData(object: Partial<UserType>): void;
  changeNewUserInfo(key: string, value: string): void;
}

const StyledRootBox = styled(Box)(({ theme }) => ({
  borderBottom: theme.palette.borderColor,
  display: "flex",
  justifyContent: "space-between",
  padding: 12,
  alignItems: "start",
}));

const StyledToggleContainer = styled(Box)(() => ({
  paddingTop: "14px",
  display: "flex",
  width: "220px",
  justifyContent: "space-between",
  alignItems: "center",
}));

const StyledInfoOutlinedIcon = styled(InfoOutlinedIcon)(({ theme }: any) => ({
  ...theme.smallIcon,
  marginLeft: 4,
  marginBottom: 2,
}));

const StyledChip = styled(Chip)<{ _selected: boolean }>(
  ({ theme, _selected }) => ({
    color: _selected
      ? theme.palette.mode === "dark"
        ? "#1F2532"
        : "#FFFFFF"
      : theme.palette.mode === "light"
      ? "#596D89"
      : "#ABBACE",
    backgroundColor: _selected ? theme.palette.primary.main : "transparent",
    "&:hover": {
      backgroundColor: _selected && `${theme.palette.primary.main} !important`,
      color: `${
        _selected
          ? theme.palette.mode === "dark"
            ? "#1F2532"
            : "#FFFFFF"
          : theme.palette.mode === "light"
          ? "#596D89"
          : "#ABBACE"
      } !important`,
    },
  })
);

const StyledLoginInput = styled(Box)(() => ({
  "& .MuiOutlinedInput-root": {
    width: "400px",
    paddingRight: "20px",
  },
  "& .Mui-error": {
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#FF4128 !important",
    },
  },
}));

const StyledTitleContainer = styled(Box)(({ theme }) => ({
  boxSizing: "border-box",
  maxWidth: 300,
  width: "fit-content",
  height: 40,
  padding: "8px 12px",
  backgroundColor: theme.palette.mode === "dark" ? "#2b3748" : "#F0F4FF",
  borderRadius: "4px",
  display: "flex",
  alignItems: "center",
  marginLeft: 4,
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  padding: "8px 12px",
  backgroundColor: theme.palette.mode === "dark" ? "#344258" : "",
  borderRadius: "4px",
  fontWeight: 600,
  fontSize: "14px",
  lineHeight: "21px",
}));

const StyledDivider = styled("div")(() => ({
  width: 1,
  height: "100%",
  backgroundColor: "#AEB8CB",
  margin: "0 8px",
}));

const StyledUserTypeBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#596D89" : "#2962FF",
  fontSize: 11,
  lineHeight: "12px",
  padding: "2px 4px",
  color: "#FFF",
  borderRadius: 2,
}));

const StyledDeleteIcon = styled(DeleteIcon)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#5D789A" : "#FF4128",
  cursor: "pointer",
  opacity: "0.6",
}));

const UseGeneralHeader: React.FC<UseGeneralHeaderProps> = ({
  editMode,
  onCancelFunction,
  onEditFunction,
  currUser,
  onSaveFunction,
  setUserData,
  changeNewUserInfo,
  config,
  setCurrUser,
  userCreationType,
  setUserCreationType,
  deleteUserFunction,
  formValidationHelper,
  resetUserData,
  userId,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();

  const [ldapUsers, setLdapUsers] = useState([]);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    if (config.authenticationType !== UserAuthTypeEnum.FINA) {
      loadLdapUsers().then((resp) => {
        setLdapUsers(resp.data);
      });
    }
  }, [config]);
  const cancelFunction = () => {
    onCancelFunction();
  };

  const GetToggleButtons = () => {
    return (
      Number(userId) === 0 &&
      config.authenticationType === UserAuthTypeEnum.MIXED && (
        <StyledToggleContainer>
          <StyledChip
            _selected={userCreationType === UserTypeEnum.FINA_USER}
            label={
              <span style={{ display: "flex", alignItems: "center" }}>
                FINA USER
                <StyledInfoOutlinedIcon />
              </span>
            }
            variant="outlined"
            onClick={() => {
              setUserCreationType(UserTypeEnum.FINA_USER);
              currUser.userType = UserTypeEnum.FINA_USER;
              changeNewUserInfo("userLogin", "");
              changeNewUserInfo("userFullName", "");
              const initUser = { id: 0, userType: UserTypeEnum.FINA_USER };
              setCurrUser({ ...initUser });
              resetUserData({ ...initUser });
              formValidationHelper.isPasswordValid = false;
              formValidationHelper.passwordMatch = false;
            }}
          />
          <StyledChip
            _selected={userCreationType === UserTypeEnum.LDAP_USER}
            label={
              <span style={{ display: "flex", alignItems: "center" }}>
                LDAP USER
                <StyledInfoOutlinedIcon />
              </span>
            }
            variant="outlined"
            onClick={() => {
              setUserCreationType(UserTypeEnum.LDAP_USER);
              currUser.userType = UserTypeEnum.LDAP_USER;
              resetUserData({
                id: 0,
                userType: UserTypeEnum.LDAP_USER,
              });
              formValidationHelper.isPasswordValid = true;
              formValidationHelper.passwordMatch = true;
            }}
          />
        </StyledToggleContainer>
      )
    );
  };

  const LdapAUtoComplete = () => {
    return (
      <CustomAutoComplete
        data={ldapUsers}
        label={"Select User"}
        valueFieldName={"login"}
        displayFieldName={"name"}
        secondaryDisplayFieldName={"login"}
        secondaryDisplayFieldLabel={"login"}
        virtualized={true}
        isError={!currUser.login}
        selectedItem={currUser}
        onClear={() => {
          setCurrUser({
            userType: userCreationType,
          });
          resetUserData({
            id: 0,
            userType: UserTypeEnum.LDAP_USER,
          });
        }}
        onChange={(item) => {
          const baseUser = {
            login: item.login,
            titleDescription: item.title,
            email: item.email,
            phone: item.phone,
            title: item.title,
            userType: userCreationType,
            name: item.name,
            description: item.name,
          };
          setCurrUser({
            ...baseUser,
            id: item.id - 1,
          });
          setUserData({
            ...baseUser,
            id: item.id,
          });
          changeNewUserInfo("userLogin", item.login);
          changeNewUserInfo("userFullName", item.name);
        }}
      />
    );
  };

  const getUserLoginField = () => {
    if ((editMode && !currUser.id) || Number(userId) === 0) {
      return (
        <Box>
          <StyledLoginInput>
            {userCreationType === UserTypeEnum.LDAP_USER ? (
              <LdapAUtoComplete />
            ) : (
              <UserLoginTextField
                onValueChange={(value) => {
                  formValidationHelper.validateLogin(value);
                  setUserData({ login: value });
                  if (!currUser.id) {
                    changeNewUserInfo("userLogin", value);
                  }
                }}
              />
            )}
          </StyledLoginInput>
          {GetToggleButtons()}
        </Box>
      );
    } else {
      return (
        <Box>
          <StyledTitleContainer>
            <StyledTitle>{currUser.login}</StyledTitle>
            <StyledDivider />
            <StyledUserTypeBox>
              {currUser.userType === UserTypeEnum.FINA_USER ||
              !currUser.userType
                ? "Fina User"
                : "LDAP User"}
            </StyledUserTypeBox>
          </StyledTitleContainer>
          {GetToggleButtons()}
        </Box>
      );
    }
  };

  return (
    <StyledRootBox data-testid={"general-header"}>
      {getUserLoginField()}

      {editMode ? (
        <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
          <TextButton
            color={"secondary"}
            style={{
              fontSize: 12,
              fontWeight: 500,
              lineHeight: "16px",
            }}
            onClick={cancelFunction}
          >
            {t("cancel")}
          </TextButton>
          <span
            style={{
              borderLeft: "1px solid #687A9E",
              height: 14,
            }}
          />
          <TextButton
            style={{
              fontSize: 12,
              fontWeight: 500,
              lineHeight: "16px",
            }}
            onClick={() => {
              onSaveFunction(formValidationHelper);
            }}
            endIcon={<CheckIcon sx={{ width: "12px", height: "12px" }} />}
          >
            {t("save")}
          </TextButton>
        </Box>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={"20px"}
        >
          {hasPermission(PERMISSIONS.USER_AMEND) && (
            <PrimaryBtn
              height={32}
              onClick={() => onEditFunction(true)}
              endIcon={<EditIcon />}
              children={<>{t("edit")}</>}
              data-testid={"edit-button"}
            />
          )}
          {hasPermission(PERMISSIONS.USER_DELETE) && (
            <StyledDeleteIcon
              onClick={() => setIsDeleteConfirmOpen(true)}
              data-testid={"delete-button"}
            />
          )}
        </Box>
      )}
      {isDeleteConfirmOpen && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={t("user")}
          isDeleteModalOpen={isDeleteConfirmOpen}
          setIsDeleteModalOpen={setIsDeleteConfirmOpen}
          onDelete={() => {
            if (currUser.id) deleteUserFunction(currUser.id);
            setIsDeleteConfirmOpen(false);
          }}
          showConfirm={false}
        />
      )}
    </StyledRootBox>
  );
};

export default UseGeneralHeader;
