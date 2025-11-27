import React, { Suspense, useEffect, useState } from "react";
import { isFieldDisabled } from "../../../util/component/fieldUtil";
import useConfig from "../../../hoc/config/useConfig";
import { styled } from "@mui/material/styles";
import { Skeleton } from "@mui/material";

const KeyboardDateTimePicker = React.lazy(() =>
  import("@mui/x-date-pickers/DateTimePicker").then((module) => ({
    default: module.DateTimePicker,
  }))
);

interface DateAndTimePickerProps {
  value: Date | number | null;
  label?: string;
  format?: string;
  onChange: (val: Date | null) => void;
  isDisabled?: boolean;
  style?: React.CSSProperties;
  size?: string;
  InputPropsFunc?: () => React.ReactNode;
  isError?: boolean;
  minDateTime?: boolean;
}

const StyledKeyboardDateTimePicker = styled(KeyboardDateTimePicker)<{
  width: number | string;
  size: string;
}>(({ width, size, theme }) => ({
  "& .MuiInputBase-root": {
    width: width ? `${width}px` : "100%",
    height: size === "default" ? "36px" : "32px",
  },
  "& .MuiSvgIcon-root": {
    ...(theme as any).smallIcon,
  },
  "& .MuiInputLabel-root": {
    width: "80% !important",
    top: `${size === "default" ? "2px" : "4px"} !important`,
    "&[data-shrink='false']": {
      top: `${size === "default" ? "-5px" : "-7px"} !important`,
    },
  },
  "& .MuiFormLabel-filled": {
    width: "unset !important",
  },
  "& .MuiIconButton-edgeEnd": {
    width: "22px",
    height: "22px",
    marginRight: "-10px",
    background: "inherit",
    border: "unset",
    "&:hover": {
      background: (theme as any).palette.buttons.secondary.hover,
    },
  },
}));

const DateAndTimePicker: React.FC<DateAndTimePickerProps> = ({
  value,
  label,
  format,
  onChange,
  isDisabled,
  style,
  size = "default",
  InputPropsFunc,
  isError = false,
  minDateTime = false,
}) => {
  const [fieldValue, setFieldValue] = useState<Date | number | null>(null);
  const { getDateFormat } = useConfig();

  useEffect(() => {
    setFieldValue(value);
  }, [value, isDisabled]);

  const getDateFormatHandler = () => {
    if (!!format) {
      return format;
    }
    return getDateFormat(false);
  };

  return (
    <Suspense
      fallback={
        <Skeleton
          variant="rounded"
          width={"100%"}
          height={size === "default" ? 36 : 32}
        />
      }
    >
      <StyledKeyboardDateTimePicker
        size={size}
        width={"100%"}
        value={fieldValue}
        format={getDateFormatHandler()}
        label={label}
        sx={style}
        onChange={(date) => {
          const newDate = date as Date;
          setFieldValue(newDate);
          onChange(newDate);
        }}
        minDateTime={minDateTime ? new Date() : null}
        disabled={isFieldDisabled(isDisabled)}
        closeOnSelect={false}
        slotProps={{
          textField: ({ InputProps }) => ({
            error: isError,
            InputProps: {
              endAdornment: (
                <>
                  {InputPropsFunc && InputPropsFunc()}
                  {InputProps.endAdornment}
                </>
              ),
            },
            inputProps: {
              "data-testid": "dateTimePicker-input",
            },
          }),
        }}
      />
    </Suspense>
  );
};

export default DateAndTimePicker;
