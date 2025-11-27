import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { FIELD_VARIANT } from "../../../util/component/fieldUtil";
import Tooltip from "../Tooltip/Tooltip";
import { styled } from "@mui/material/styles";

interface PercentageFieldProps {
  size?: string;
  value?: number | string;
  isDisabled: boolean;
  label?: string;
  fieldName: string;
  onChange: (value: number | string, fieldName: string) => void;
  format: string;
  isError?: boolean;
  required?: boolean;
  onBlurFunc?: () => void;
  onFocusFunc?: () => void;
}

const StyledTextField = styled(TextField)<{ _width?: number; _size: string }>(
  ({ _width, _size }) => ({
    "& .MuiInputBase-root": {
      width: _width ? `${_width}px` : "100%",
      height: _size === "default" ? "36px" : "32px",
    },
    "& .MuiInputLabel-root": {
      top: `${_size === "default" ? "2px" : "4px"} !important`,
      "&[data-shrink='false']": {
        top: `${_size === "default" ? "-5px" : "-7px"} !important`,
      },
    },
  })
);

const PercentageField: React.FC<PercentageFieldProps> = ({
  size = "default",
  value,
  isDisabled,
  label,
  fieldName,
  onChange,
  format,
  isError,
  required,
  onBlurFunc,
  onFocusFunc,
  ...props
}) => {
  const [viewMode, setViewMode] = useState(true);
  const [val, setVal] = useState(value);
  const [fieldError, setFieldError] = useState(isError);

  useEffect(() => {
    setFieldError(isError);
  }, [isError]);

  useEffect(() => {
    setVal(value);
  }, [value]);

  function Format(num: number, fixed: number) {
    let re = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
    let matchResult = num.toString().match(re);
    if (matchResult) return matchResult[0];
  }

  const onFieldChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    let newValue = event.target.value;
    if (+newValue >= 0 && +newValue <= 100) {
      if (newValue.toString().length > format.length) {
        let formatValue = Format(+newValue, format.length - 2);
        if (formatValue) {
          newValue = formatValue;
        }
      }
      setVal(newValue);
      onChange(newValue, fieldName);
    }

    if (required && !newValue) {
      setFieldError(true);
    } else if (required && Number(newValue) === 100) {
      setFieldError(false);
    } else if (newValue.length > 0 && isNaN(+newValue)) {
      setFieldError(true);
    } else {
      setFieldError(
        required &&
          !(
            Number(newValue.slice(0, 2)) >= 0 &&
            Number(newValue.slice(0, 2)) <= 100
          )
      );
    }
  };

  const getViewValue = (val: number | string) => {
    return `${val}%`;
  };

  return (
    <Tooltip title="Valid Range 0-100">
      <StyledTextField
        _size={size}
        error={fieldError}
        label={label}
        value={
          val
            ? viewMode
              ? getViewValue(val)
              : val
            : val === 0
            ? getViewValue(val)
            : ""
        }
        disabled={isDisabled}
        onChange={(event) => onFieldChange(event)}
        variant={FIELD_VARIANT}
        onFocus={() => {
          setViewMode(false);
          onFocusFunc && onFocusFunc();
        }}
        onBlur={() => {
          setViewMode(true);
          onBlurFunc && onBlurFunc();
        }}
        data-testid={fieldName}
        {...props}
      />
    </Tooltip>
  );
};

export default PercentageField;
