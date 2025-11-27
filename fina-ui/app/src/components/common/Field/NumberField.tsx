import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import {
  FIELD_VARIANT,
  isFieldDisabled,
} from "../../../util/component/fieldUtil";
import { getFormattedNumber } from "../../../util/appUtil";
import { styled } from "@mui/material/styles";

interface NumberFieldProps {
  value?: number | undefined | null;
  format?: string | undefined;
  fieldName?: string | undefined;
  onChange: (value: number | string | undefined, fieldName?: string) => void;
  inputRef?: any;
  isDisabled?: boolean;
  label?: string;
  size?: string;
  border?: string;
  pattern?: any;
  onBlurFunc?: () => void;
  hasError?: boolean;
  width?: string;
}

const StyledTextField = styled(TextField)<{ _size: string; _width?: string }>(
  ({ _size, _width }) => ({
    "& .MuiInputBase-root": {
      width: _width ? `${_width}px` : "100%",
      height: _size === "default" ? "36px" : "32px",
    },
    "& .MuiInputLabel-root": {
      "&[data-shrink='false']": {
        top: `${_size === "default" ? "-5px" : "-7px"} !important`,
      },
    },
  })
);

const NumberField: React.FC<NumberFieldProps> = ({
  value,
  format,
  fieldName,
  onChange,
  inputRef,
  isDisabled,
  label,
  size = "default",
  pattern,
  onBlurFunc,
  hasError,
  width,
  ...props
}) => {
  const [originalValue, setOriginalValue] = useState<
    number | string | undefined | null
  >();
  const [formattedValue, setFormattedValue] = useState<string>();
  const [onChangeState, setOnChangeState] = useState<boolean>(false);
  const [errorState, setErrorState] = useState<boolean | undefined>(hasError);

  useEffect(() => {
    setErrorState(hasError);
  }, [hasError]);

  const decimalPattern = (
    pattern ? pattern : /^[+-]?\d*(?:[.]\d*)?$/
  ) as RegExp;

  useEffect(() => {
    setOriginalValue(value || value === 0 ? value : null);
    setFormattedValue(
      value || value === 0 ? getFormattedNumber(value, format) : ""
    );
  }, [value, isDisabled]);

  const getValue = () => {
    let val;
    if (onChangeState) {
      val = originalValue;
    } else {
      val = formattedValue;
    }

    return val || val === 0 ? val : "";
  };

  return (
    <StyledTextField
      _size={size}
      _width={width}
      data-testid={fieldName}
      error={errorState}
      variant={FIELD_VARIANT}
      label={label}
      {...props}
      inputRef={inputRef}
      disabled={isFieldDisabled(isDisabled)}
      value={getValue()}
      onFocus={() => {
        setOnChangeState(true);
      }}
      onBlur={() => {
        setOnChangeState(false);
        if (onBlurFunc) {
          onBlurFunc();
        }
      }}
      onChange={(event) => {
        setOnChangeState(true);
        decimalPattern.test(event.target.value);
        if (decimalPattern.test(event.target.value)) {
          const fieldItemValue = event.target.value;
          setOriginalValue(fieldItemValue);
          setFormattedValue(getFormattedNumber(fieldItemValue, format));
          onChange(
            fieldItemValue ? Number(fieldItemValue) : fieldItemValue,
            fieldName
          );
        }
      }}
    />
  );
};

export default NumberField;
