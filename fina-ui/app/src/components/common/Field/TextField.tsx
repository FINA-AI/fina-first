import React, { useEffect, useState } from "react";
import { default as MuiTextField } from "@mui/material/TextField";
import {
  FIELD_VARIANT,
  isFieldDisabled,
} from "../../../util/component/fieldUtil";
import { styled } from "@mui/material/styles";
import { FieldSize } from "../../../types/common.type";
import Tooltip from "../Tooltip/Tooltip";

interface TextFieldProps {
  value?: string;
  fieldName?: string;
  onChange?: any;
  isDisabled?: any;
  label?: string;
  width?: number | string;
  isError?: boolean;
  helperText?: string;
  variant?: any;
  style?: React.CSSProperties;
  height?: number;
  border?: number;
  multiline?: boolean;
  rows?: number;
  minLength?: number;
  size?: FieldSize | string;
  type?: string;
  fontSize?: number;
  maxLength?: number;
  required?: boolean;
  dirtable?: boolean;
  isDirty?: boolean;
  onFocus?: (event: any) => void;
  autoFocus?: boolean;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  defaultValue?: string;
  InputProps?: any;
  placeholder?: string;
  readOnly?: boolean;
  fieldValidationFunction?: (value: any) => boolean;
  tooltip?: boolean;
  tooltipText?: string;
  pattern?: RegExp;
}

const StyledMuiTextField = styled(MuiTextField)<{
  _width?: string | number;
  _height?: number;
  _size?: string;
  _multiline: boolean;
  dirty?: boolean;
}>(({ _width, _height, _size, _multiline, dirty }) => ({
  width: _width ? `${_width}px` : "100%",
  "& .MuiInputBase-root": {
    width: _width ? `${_width}px` : "100%",
    height: _multiline ? _height : _size === "default" ? "36px" : "32px",
    padding: _multiline && "16.5px 14px",
    color: dirty ? "orange !important" : "",
  },
  "& .MuiOutlinedInput-input": {
    paddingLeft: _multiline && "0px",
  },
  "& .MuiInputLabel-root": {
    top: `${_size === "default" ? "2px" : "4px"} !important`,
    "&.Mui-focused": {},
    "&[data-shrink='false']": {
      top: `${_size === "default" ? "-5px" : "-7px"} !important`,
    },
  },

  "& .MuiInputBase-multiline": {
    cursor: "default !important",
  },

  "& .MuiInputBase-inputMultiline": {
    cursor: "default !important",
  },
}));

const TextField: React.FC<TextFieldProps> = ({
  value,
  fieldName = "textField",
  onChange,
  isDisabled,
  label,
  width,
  isError = false,
  helperText,
  variant,
  style,
  height,
  border: _border,
  multiline = false,
  rows,
  minLength,
  size = FieldSize.DEFAULT,
  type,
  fontSize: _fontSize = 12,
  maxLength = 5000,
  required = false,
  dirtable = false,
  isDirty = false,
  onFocus,
  onBlur,
  onKeyDown,
  defaultValue,
  InputProps,
  placeholder,
  readOnly,
  fieldValidationFunction,
  tooltip = false,
  tooltipText = "",
  pattern,
  ...props
}) => {
  const [fieldValue, setFieldValue] = useState(value);
  const [fieldError, setFieldError] = useState(isError || (required && !value));
  const [dirty, setDirty] = useState(isDirty);

  useEffect(() => {
    setFieldValue(value);
    setFieldError(isError || (required && !value));
  }, [value, isDisabled, required]);

  useEffect(() => {
    setFieldError(isError || (required && !value));
  }, [isError]);

  const validate = (fieldItemValue: any) => {
    if (minLength) {
      setFieldError(fieldItemValue ? fieldItemValue.length < minLength : true);
    }
    if (maxLength && fieldItemValue) {
      setFieldError(fieldItemValue.length > maxLength);
    }
    if (required && !fieldItemValue) {
      setFieldError(true);
    }

    if (fieldValidationFunction) {
      const validationResult = fieldValidationFunction(fieldItemValue);
      setFieldError(!validationResult);
    }
  };

  return (
    <Tooltip title={tooltip ? (fieldError ? tooltipText : "") : ""}>
      <StyledMuiTextField
        _width={width}
        _height={height}
        _multiline={multiline}
        _size={size}
        dirty={dirtable && dirty}
        data-testid={fieldName}
        placeholder={placeholder}
        error={fieldError}
        helperText={helperText ? helperText : ""}
        label={label}
        name={fieldName}
        onFocus={(event) => {
          if (onFocus) {
            onFocus(event);
          }
        }}
        onBlur={(event) => {
          if (onBlur) {
            onBlur(event);
          }
        }}
        onKeyDown={(event) => {
          if (onKeyDown) {
            onKeyDown(event);
          }
        }}
        inputProps={{
          "data-testid": `${fieldName}-input`,
          maxLength: maxLength,
          readOnly: readOnly,
        }}
        InputProps={InputProps}
        variant={variant ? variant : FIELD_VARIANT}
        style={style}
        value={fieldValue ? fieldValue : ""}
        onChange={(event) => {
          if (dirtable) {
            setDirty(true);
          }
          const fieldItemValue = event.target.value;
          if (pattern && !pattern.test(fieldItemValue)) {
            return;
          }
          setFieldValue(fieldItemValue);
          //validation
          validate(fieldItemValue);
          onChange(fieldItemValue, fieldName);
        }}
        disabled={isFieldDisabled(isDisabled)}
        multiline={multiline}
        rows={rows}
        type={type}
        defaultValue={defaultValue}
        autoComplete={type === "password" ? "new-password" : fieldName}
        {...props}
      />
    </Tooltip>
  );
};

export default TextField;
