import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { Select as MuiSelect, TooltipProps, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FIELD_VARIANT } from "../../../util/component/fieldUtil";
import MenuItem from "@mui/material/MenuItem";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { Box } from "@mui/system";
import Tooltip from "../Tooltip/Tooltip";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { styled, useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

export interface SelectionType {
  label: string;
  value: string | number | boolean;
  type?: string;
}

interface SelectProps {
  data: SelectionType[];
  label?: string;
  value?: string | number | boolean;
  onChange: (
    fieldItemValue: string,
    item: SelectionType,
    index: number
  ) => void;
  width?: number;
  disabled?: boolean;
  readOnly?: boolean;
  variant?: "filled" | "outlined" | "standard";
  isStatus?: boolean;
  size?: string;
  tooltip?: boolean;
  isError?: boolean;
  onFocusFunc?: () => void;
  onBlurFunc?: () => void;
  autoFocus?: boolean;
  maxHeight?: number;
  TooltipPlacement?: TooltipProps["placement"];
}

const StyledFormControl = styled(FormControl)<{
  _size: string | number;
  _width?: number | string;
  disabled: boolean;
}>(({ _size, _width, disabled, theme }) => ({
  width: _width ? `${_width}px` : "100%",
  "& .MuiInputBase-root": {
    width: _width ? `${_width}px` : "100%",
    height: _size === "default" ? "36px" : "32px",
  },
  "& .MuiInputLabel-root": {
    color: `${
      disabled
        ? `${(theme as any).palette.disableLabelColor}`
        : `${(theme as any).palette.labelColor}`
    }`,

    top: `${_size === "default" ? "2px" : "4px"} !important`,
    "&[data-shrink='false']": {
      top: `${_size === "default" ? "-5px" : "-7px"} !important`,
    },
    width: "calc(100% - 36px)",
    fontSize: _size === "default" ? "12px" : "11px",
  },
  "& .MuiInputLabel-root.Mui-error": {
    color: "#FF4128 !important",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      fontSize: _size === "default" ? "12px" : "11px",
      borderWidth: "1px !important",
    },
    height: _size === "small" ? "32px" : "36px",
    "&:hover": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor:
          theme.palette.mode === "dark" ? "#7D95B3" : "rgb(184, 185, 190)",
      },
    },
  },
  "& .MuiOutlinedInput-input": {
    padding: "10px 0 10px 14px!important",
  },
  "& .MuiSvgIcon-root": {
    ...(theme as any).smallIcon,
    color: theme.palette.mode === "light" ? "#98A7BC" : "#5D789A",
    padding: "4px",
    top: `calc(50% - 10px)`,
  },
}));

const StyledTextWrapper = styled(Typography)(() => ({
  maxWidth: "100%",
  overflow: "hidden",
  fontSize: "12px",
  fontWeight: 400,
  lineHeight: "20px",
}));

const Select: React.FC<SelectProps> = ({
  data = [],
  label = "",
  value = "",
  onChange,
  width,
  disabled = false,
  readOnly = false,
  variant = FIELD_VARIANT,
  isStatus = false,
  size = "default",
  tooltip = true,
  TooltipPlacement = "right",
  isError = false,
  onFocusFunc,
  onBlurFunc,
  autoFocus = false,
  maxHeight,
  ...props
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [fieldValue, setFieldValue] = useState<string | number | boolean>(
    value
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (item: SelectionType, index: number) => {
    const fieldItemValue = item.value.toString();
    setFieldValue(fieldItemValue);
    onChange(fieldItemValue, item, index);
    onBlurFunc && onBlurFunc();
  };

  useEffect(() => {
    setFieldValue(value);
  }, [value]);

  const getOption = (item: SelectionType, index: number) => {
    return (
      <MenuItem
        sx={{ display: "block !important" }}
        value={item.value as string}
        key={index}
        onClick={() => {
          handleChange(item, index);
        }}
        data-testid={"item-" + index}
      >
        <Tooltip placement={TooltipPlacement} title={tooltip ? item.label : ""}>
          <Box display={"flex"}>
            {isStatus && (
              <Box
                display={"flex"}
                alignItems={"center"}
                alignContent={"center"}
                style={{
                  color: item.value === "ACTIVE" ? "#289E20" : "#FF4128",
                }}
                marginRight={"5px"}
              >
                <FiberManualRecordIcon fontSize={"inherit"} />
              </Box>
            )}
            <StyledTextWrapper noWrap={true} data-testid={"item-value"}>
              {t(item.label)}
            </StyledTextWrapper>
          </Box>
        </Tooltip>
      </MenuItem>
    );
  };

  const id = label && label.replace(" ", "_");

  const error =
    typeof fieldValue === "boolean" || !!fieldValue ? false : isError;

  return (
    <StyledFormControl
      variant={variant}
      _size={size}
      _width={width}
      disabled={disabled}
      error={error}
    >
      {label && <InputLabel htmlFor={id}>{label}</InputLabel>}
      <MuiSelect
        name={"select"}
        error={error}
        disabled={disabled}
        readOnly={readOnly}
        value={fieldValue?.toString() || ""}
        label={label}
        onClose={() => {
          onBlurFunc && onBlurFunc();
          setIsOpen(false);
        }}
        onOpen={() => {
          setIsOpen(true);
          onFocusFunc && onFocusFunc();
        }}
        IconComponent={(props) => <KeyboardArrowDownIcon {...props} />}
        autoFocus={autoFocus}
        MenuProps={{
          PaperProps: {
            sx: {
              "& .MuiList-root.MuiMenu-list": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(52, 66, 88, 1)"
                    : theme.palette.background.paper,
              },
              maxHeight: `${maxHeight}px`,
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0px 19px 38px 0px rgba(0, 0, 0, 0.30), 0px 15px 12px 0px rgba(0, 0, 0, 0.22)"
                  : "0px 5px 5px -3px rgb(80 80 80 / 12%), " +
                    "0px 8px 10px 1px rgb(80 80 80 / 12%), " +
                    "0px 3px 14px 2px rgb(80 80 80 / 12%)",
            },
          },
        }}
        {...props}
      >
        <MenuItem
          aria-label="None"
          value=""
          sx={{ display: isOpen ? "none" : "flex" }}
        />
        {data?.map((dataItem: SelectionType, index: number) =>
          getOption(dataItem, index)
        )}
      </MuiSelect>
    </StyledFormControl>
  );
};

export default Select;
