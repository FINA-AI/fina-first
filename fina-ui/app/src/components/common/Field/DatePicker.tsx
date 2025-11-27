import React, { Suspense, useEffect, useState } from "react";
import { isFieldDisabled } from "../../../util/component/fieldUtil";
import useConfig from "../../../hoc/config/useConfig";
import { Skeleton, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";

const DesktopDatePicker = React.lazy(() =>
  import("@mui/x-date-pickers/DesktopDatePicker").then((module) => ({
    default: module.DesktopDatePicker,
  }))
);

interface DatePickerProps {
  value?: number | Date | null | string;
  label?: string;
  format?: string;
  onChange: (value: Date) => void;
  isDisabled?: boolean;
  style?: React.CSSProperties;
  inputVariant?: string;
  size?: string;
  autoFocus?: boolean;
  showMonthView?: boolean;
  onBlurFunc?: () => void;
  onFocusFunc?: () => void;
  enableTooltip?: boolean;
  width?: number;
  isError?: boolean;
  "data-testid"?: string;
}

const StyledDesktopDatePicker = styled(DesktopDatePicker)<{
  _size: string;
  width?: number;
}>(({ _size, width, theme }) => ({
  "& .MuiInputBase-root": {
    width: width ? `${width}px` : "100%",
    height: _size === "default" ? "36px" : "32px",
  },
  "& .MuiSvgIcon-root": {
    ...(theme as any).smallIcon,
  },
  "& .MuiInputLabel-root": {
    width: "80% !important",
    top: `${_size === "default" ? "2px" : "4px"} !important`,
    "&[data-shrink='false']": {
      top: `${_size === "default" ? "-5px" : "-7px"} !important`,
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

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  label,
  format,
  onChange,
  isDisabled,
  style,
  size = "default",
  autoFocus = false,
  showMonthView = false,
  onBlurFunc,
  onFocusFunc,
  enableTooltip = false,
  width,
  isError = false,
  ...props
}) => {
  const { getDateFormat } = useConfig();
  const [isTextFieldFocused, setIsTextFieldFocused] = useState<boolean>(false);
  const [fieldValue, setFieldValue] = useState<number | null | Date>(null);

  useEffect(() => {
    if (value instanceof Date) {
      setFieldValue(value.getTime());
    } else {
      setFieldValue(value ? +value : null);
    }
  }, [value, isDisabled]);

  const handleClick = () => {
    setIsTextFieldFocused(true);
    if (onFocusFunc) {
      onFocusFunc();
    }
  };

  const handleDateChange = (date: Date) => {
    setFieldValue(date);
    onChange(date);
  };

  const getDateFormatHandler = () => {
    if (!!format) {
      return format;
    }
    return getDateFormat(true);
  };

  return (
    <Tooltip title={enableTooltip && !isTextFieldFocused ? label : ""}>
      <div>
        <Suspense
          fallback={
            <Skeleton
              variant="rounded"
              width={"100%"}
              height={size === "default" ? 36 : 32}
            />
          }
        >
          <StyledDesktopDatePicker
            _size={size}
            width={width}
            value={fieldValue}
            format={getDateFormatHandler()}
            label={label}
            sx={style}
            onChange={(date) => handleDateChange(date as Date)}
            disabled={isFieldDisabled(isDisabled)}
            slotProps={{
              textField: {
                // @ts-ignore
                "data-testid": props["data-testid"] as string,
                InputProps: {
                  // @ts-ignore
                  "data-testid": `${props["data-testid"]}-input`,
                },
                role: "button",
                onClick: () => handleClick(),
                onFocus: () => {
                  if (onFocusFunc) {
                    onFocusFunc();
                  }
                },
                onBlur: () => {
                  if (onBlurFunc) {
                    onBlurFunc();
                  }
                  setIsTextFieldFocused(false);
                },
                error: isError,
              },
            }}
            autoFocus={autoFocus}
            views={showMonthView ? ["year", "month", "day"] : undefined}
          />
        </Suspense>
      </div>
    </Tooltip>
  );
};

export default DatePicker;
