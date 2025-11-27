import TextField from "../../../common/Field/TextField";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { validateUserLogin } from "../../../../util/component/validationUtil";

interface UserLoginTextFieldProps {
  onValueChange: (value: string) => void;
}

const UserLoginTextField: React.FC<UserLoginTextFieldProps> = ({
  onValueChange,
}) => {
  const [isTextFieldFocused, setIsTextFieldFocused] = useState(false);
  const [login, setLogin] = useState("");
  const { t } = useTranslation();

  const onChange = (value: string) => {
    setLogin(value);
    onValueChange(value);
  };

  const validUserLogin = validateUserLogin(login);

  return (
    <TextField
      isError={!login || !validUserLogin}
      label={t("login")}
      onChange={onChange}
      tooltip={true}
      onFocus={() => setIsTextFieldFocused(true)}
      onBlur={() => setIsTextFieldFocused(false)}
      autoFocus={isTextFieldFocused}
      tooltipText={!validUserLogin ? t("invalidlogin") : t("requiredField")}
      fieldValidationFunction={(value: string) => validateUserLogin(value)}
    />
  );
};

export default UserLoginTextField;
