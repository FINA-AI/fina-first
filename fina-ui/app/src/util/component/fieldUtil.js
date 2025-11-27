import { isFunction } from "../appUtil";

export const FIELD_VARIANT = "outlined";

export const isFieldDisabled = (isDisabled) => {
  if (isFunction(isDisabled)) {
    return isDisabled();
  }
  return isDisabled;
};

export const FieldDataType = {
  _STRING: "STRING",
  _DATE: "DATE",
  _INTEGER: "INTEGER",
  _NUMBER: "NUMBER",
};
