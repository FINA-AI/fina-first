import ClosableModal from "../../components/common/Modal/ClosableModal";
import PrimaryBtn from "../../components/common/Button/PrimaryBtn";
import { Box } from "@mui/system";
import React, { useState } from "react";
import DoneIcon from "@mui/icons-material/Done";
import { useTranslation } from "react-i18next";
import GhostBtn from "../common/Button/GhostBtn";
import TextField from "../../components/common/Field/TextField";
import { changePasswordService } from "../../api/services/userManagerService";
import InputAdornment from "@mui/material/InputAdornment";
import ErrorIcon from "@mui/icons-material/Error";
import { IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useSnackbar } from "notistack";
import Tooltip from "../common/Tooltip/Tooltip";
import { connect } from "react-redux";
import { styled } from "@mui/material/styles";

interface ChangePasswordModalProps {
  config?: any;
  showPasswordModal: boolean;
  setShowPasswordModal: (value: boolean) => void;
  closable?: boolean;
  onAfterPasswordChange?: VoidFunction;
}

type FieldValidation = {
  isValid: boolean;
  errorMessages: Set<string>;
};

type ValidationState = {
  oldPassword: FieldValidation;
  newPassword: FieldValidation;
  confirmPassword: FieldValidation;
};

const StyledModalContent = styled(Box)({
  display: "flex",
  padding: "14px 16px 8px 16px",
  flexDirection: "column",
  fontWeight: 500,
  fontSize: "12px",
  lineHeight: "20px",
});

const StyledModalFooter = styled(Box)(({ theme }: { theme: any }) => ({
  ...theme.modalFooter,
  fontWeight: 500,
  fontSize: "12px",
  lineHeight: "16px",
  display: "flex",
  justifyContent: "end",
}));

const StyledErrorIcon = styled(ErrorIcon)(({ theme }: { theme: any }) => ({
  ...theme.smallIcon,
  color: "#FF4128",
}));

const StyledVisibilityIcon = styled(IconButton)({
  size: "small",
  color: "#AEB8CB",
  background: "inherit",
  border: "inherit",
  "&:hover": {
    background: "inherit",
  },
});

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  config,
  showPasswordModal,
  setShowPasswordModal,
  closable = true,
  onAfterPasswordChange = () => {},
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const [validation, setValidation] = useState<ValidationState>({
    oldPassword: {
      isValid: true,
      errorMessages: new Set([]),
    },
    newPassword: {
      isValid: true,
      errorMessages: new Set([]),
    },
    confirmPassword: {
      isValid: true,
      errorMessages: new Set([]),
    },
  });

  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({
    showCurrPassword: false,
    showNewPassword: false,
    showRepeatPassword: false,
  });
  const [passwordInfo, setPasswordInfo] = useState<Record<string, string>>({
    currPassword: "",
    newPassword: "",
    repeatPassword: "",
  });

  const initValidationMessage = (
    message: string,
    key: keyof ValidationState,
    isValid: boolean
  ) => {
    if (isValid) {
      validation[key].errorMessages.delete(message);
    } else {
      validation[key].errorMessages.add(message);
    }
  };

  const validateNewPassword = (value: string) => {
    const passwordPolicy = {
      ...config.passwordPolicy,
    };

    let regexPattern = "";

    const RegexFunc = (regex: string, value: string) => {
      return new RegExp(regex).test(value);
    };

    if (passwordPolicy.letters) {
      let regex = "(?=.*[a-zA-Z])";
      regexPattern += regex;

      const hasLetters = RegexFunc(regex, value);

      initValidationMessage(t("passwordLetters"), "newPassword", hasLetters);
    }

    if (passwordPolicy.specialCharacters) {
      let regex = "(?=.*[!@#$%^&*()])";
      regexPattern += regex;
      const hasSpecialCharacters = RegexFunc(regex, value);
      initValidationMessage(
        t("passwordSpecialCharacters"),
        "newPassword",
        hasSpecialCharacters
      );
    }

    if (passwordPolicy.upperCase) {
      let regex = "(?=.*[A-Z])";
      regexPattern += regex;
      const hasUpperCase = RegexFunc(regex, value);
      initValidationMessage(
        t("passwordUpperCase"),
        "newPassword",
        hasUpperCase
      );
    }

    if (passwordPolicy.numbers) {
      let regex = "(?=.*\\d)";
      regexPattern += regex;
      const hasNumbers = RegexFunc(regex, value);
      initValidationMessage(t("passwordNumber"), "newPassword", hasNumbers);
    }

    if (passwordPolicy.minLength) {
      let regex = `.{${passwordPolicy.minLength},}$`;
      regexPattern += regex;
      const hasMinLength = RegexFunc(regex, value);
      initValidationMessage(
        t("passwordLength", { minLength: passwordPolicy.minLength }),
        "newPassword",
        hasMinLength
      );
    }
    validation.newPassword.isValid = RegexFunc(regexPattern, value);
    setValidation({ ...validation });
  };

  const onChangeValue = (key: string, value: string) => {
    passwordInfo[key] = value;

    if (key === "newPassword") {
      validateNewPassword(passwordInfo.newPassword);
    }

    if (passwordInfo.repeatPassword && passwordInfo.newPassword) {
      if (passwordInfo.newPassword !== passwordInfo.repeatPassword) {
        validation.confirmPassword.isValid = false;
        validation.confirmPassword.errorMessages.add(t("passwordDoesNotMatch"));
        setValidation({ ...validation });
      } else {
        if (validation.newPassword.isValid)
          validation.confirmPassword.isValid = true;
        setValidation({ ...validation });
      }
    }
  };

  const handleClickShowPassword = (showPasswordField: string) => {
    setShowPassword({
      ...showPassword,
      [showPasswordField]: !showPassword[showPasswordField],
    });
  };

  const changePasswordHandler = () => {
    changePasswordService(passwordInfo).then((res) => {
      const response = res.data[0];
      switch (response) {
        case "SUCCESS":
          enqueueSnackbar(t("PasswordChangedSuccessfully"), {
            variant: "success",
          });
          clearFieldsHandler();
          setShowPasswordModal(false);
          onAfterPasswordChange();
          break;
        case "CURRENT_PASS_NO_MATCH":
          validation.oldPassword.isValid = false;
          validation.oldPassword.errorMessages.add(t("invalidOldPassword"));
          setValidation({ ...validation });
          break;
        case "ALREADY_USED":
          validation.newPassword.isValid = false;
          validation.newPassword.errorMessages.add(t("passwordAlreadyUsed"));
          setValidation({ ...validation });
          break;
      }
    });
  };
  const clearFieldsHandler = () => {
    setPasswordInfo({
      currPassword: "",
      newPassword: "",
      repeatPassword: "",
    });
    setValidation({
      oldPassword: {
        isValid: true,
        errorMessages: new Set([]),
      },
      newPassword: {
        isValid: true,
        errorMessages: new Set([]),
      },
      confirmPassword: {
        isValid: true,
        errorMessages: new Set([]),
      },
    });
  };

  return (
    <ClosableModal
      disableBackdropClick={true}
      onClose={() => {
        if (closable) {
          setShowPasswordModal(false);
          clearFieldsHandler();
        }
      }}
      open={showPasswordModal}
      includeHeader={true}
      width={500}
      title={t("change password")}
    >
      <StyledModalContent>
        <Box pb={"8px"}>
          <TextField
            isDisabled={true}
            value={`${config.user} [${config.userName}]`}
          />
        </Box>
        <Box pb={"8px"}>
          <TextField
            type={showPassword.showCurrPassword ? "text" : "password"}
            label={t("oldPassword")}
            onChange={(val: string) => onChangeValue("currPassword", val)}
            value={passwordInfo.currPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {!validation.oldPassword.isValid ? (
                    <Tooltip title={t("invalidOldPassword")}>
                      <StyledErrorIcon tabIndex={-1} />
                    </Tooltip>
                  ) : (
                    <StyledVisibilityIcon
                      onClick={(event) => {
                        event.preventDefault();
                        handleClickShowPassword("showCurrPassword");
                      }}
                      edge="end"
                      tabIndex={-1}
                    >
                      {showPassword.showCurrPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </StyledVisibilityIcon>
                  )}
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box p={"6px 0px 8px 0px"}>
          <TextField
            type={showPassword.showNewPassword ? "text" : "password"}
            label={t("newPassword")}
            onChange={(val: string) => onChangeValue("newPassword", val)}
            value={passwordInfo.newPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {!validation.newPassword.isValid ? (
                    <Tooltip
                      title={Array.from(
                        validation.newPassword.errorMessages
                      ).join(", ")}
                    >
                      <StyledErrorIcon tabIndex={-1} />
                    </Tooltip>
                  ) : (
                    <StyledVisibilityIcon
                      onClick={(event) => {
                        event.preventDefault();
                        handleClickShowPassword("showNewPassword");
                      }}
                      edge="end"
                      tabIndex={-1}
                    >
                      {showPassword.showNewPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </StyledVisibilityIcon>
                  )}
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box p={"6px 0px 8px 0px"}>
          <TextField
            type={showPassword.showRepeatPassword ? "text" : "password"}
            label={t("confirmPassword")}
            onChange={(val: string) => onChangeValue("repeatPassword", val)}
            value={passwordInfo.repeatPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {!validation.confirmPassword.isValid ? (
                    <Tooltip
                      title={Array.from(
                        validation.confirmPassword.errorMessages
                      ).join(", ")}
                    >
                      <StyledErrorIcon tabIndex={-1} />
                    </Tooltip>
                  ) : (
                    <StyledVisibilityIcon
                      onClick={(event) => {
                        event.preventDefault();
                        handleClickShowPassword("showRepeatPassword");
                      }}
                      edge="end"
                      tabIndex={-1}
                    >
                      {showPassword.showRepeatPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </StyledVisibilityIcon>
                  )}
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </StyledModalContent>
      <StyledModalFooter>
        <GhostBtn
          onClick={() => {
            setShowPasswordModal(false);
            clearFieldsHandler();
          }}
        >
          {t("cancel")}
        </GhostBtn>
        <PrimaryBtn
          disabled={
            passwordInfo.currPassword.length === 0 ||
            validation.newPassword.isValid === false ||
            validation.confirmPassword.isValid === false
          }
          onClick={changePasswordHandler}
          endIcon={<DoneIcon />}
          style={{ marginLeft: 12 }}
        >
          {t("save")}
        </PrimaryBtn>
      </StyledModalFooter>
    </ClosableModal>
  );
};

const mapStateToProps = (state: any) => ({
  config: state.get("config").config,
});

export default connect(mapStateToProps)(ChangePasswordModal);
