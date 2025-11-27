import { Box, Typography } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { styled } from "@mui/material/styles";
import React, { ReactNode, useEffect, useState } from "react";
import { FieldType } from "../util/FiUtil";
import TextField from "../../common/Field/TextField";
import NumberField from "../../common/Field/NumberField";
import Select from "../../common/Field/Select";
import DatePicker from "../../common/Field/DatePicker";
import CopyButton from "../../common/Button/CopyButton";
import {
  getFormattedDateValue,
  getFormattedNumber,
} from "../../../util/appUtil";
import useConfig from "../../../hoc/config/useConfig";
import PercentageField from "../../common/Field/PercentageField";
import UserAndGroupVirtualizedSelect from "../../UserManagement/UserAndGroupVirtualizedSelect";
import Tooltip from "../../common/Tooltip/Tooltip";

interface FiInputProps {
  title: string;
  value?: any;
  name?: string;
  icon?: ReactNode;
  onValueChange?: (value: any, name: string, isValid?: boolean) => void;
  editMode?: boolean;
  inputTypeProp?: InputTypeProp;
  width?: string | number;
  readOnly?: boolean;
  component?: ReactNode;
  error?: boolean;
  errorText?: string;
  disabled?: boolean;
  tooltip?: boolean;
  tooltipText?: string;
  fieldValidationFunction?: (val: string) => boolean;
  required?: boolean;
  pattern?: RegExp;
}

interface InputTypeProp {
  inputType: string;
  listData?: any[];
  format?: string;
}

interface StyledProps {
  theme?: any;
  _isFullyDisabled?: boolean;
  _isTextFieldFocused?: boolean;
  _editMode?: boolean;
}

const StyledContainer = styled(Box, {
  shouldForwardProp: (prop: string) => !prop.startsWith("_"),
})<StyledProps>(({ theme, _isFullyDisabled, _isTextFieldFocused }) => ({
  border: theme.palette.borderColor,
  borderRadius: "4px",
  boxShadow: "none",
  backgroundColor:
    !_isFullyDisabled && _isTextFieldFocused
      ? theme.palette.mode === "light"
        ? "#F0F4FF"
        : "inherit"
      : "",
  "& :hover": {
    backgroundColor:
      !_isFullyDisabled && _isTextFieldFocused
        ? theme.palette.mode === "light"
          ? "#F6F6F6"
          : "#515C6A"
        : theme.palette.mode === "dark" && "#344258",
    borderRadius: "4px",
  },
}));

const StyledLogoContainer = styled(Box, {
  shouldForwardProp: (prop: string) => !prop.startsWith("_"),
})<StyledProps>(({ theme, _isFullyDisabled }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#344258" : "#F0F4FF",
  width: "40px",
  height: "40px",
  borderRadius: "6px",
  color: theme.palette.mode === "light" ? "#9AA7BE" : "rgb(200 208 223)",
  opacity: _isFullyDisabled ? 0.5 : 1,
  "& .MuiSvgIcon-root": {
    backgroundColor: theme.palette.mode === "dark" ? "#344258" : "#F0F4FF",
    opacity: _isFullyDisabled ? 0.5 : 1,
    color: theme.palette.mode === "dark" ? "#5D789A" : "rgb(154, 167, 190)",
  },
  "& .MuiInputBase-input": {
    paddingBottom: "0px !important",
  },
  "& rect": {
    fill: theme.palette.mode === "dark" ? "#344258" : "#F0F4FF",
  },
}));

const StyledTitle = styled(Typography, {
  shouldForwardProp: (prop: string) => !prop.startsWith("_"),
})<StyledProps>(({ theme, _isFullyDisabled, _editMode }: any) => ({
  color:
    _isFullyDisabled && _editMode
      ? "#98A7BC"
      : theme.palette.mode === "light"
      ? "#596D89"
      : "#ABBACE",
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: 500,
  fontSize: "11px",
  lineHeight: "12px",
  boxShadow: "none !important",
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  whiteSpace: "nowrap",
  lineBreak: "anywhere",
  overflow: "hidden",
  textOverflow: "ellipsis",
  paddingTop: "2px",
  opacity: _isFullyDisabled ? 0.5 : 1,
}));

const StyledText = styled(Typography, {
  shouldForwardProp: (prop: string) => !prop.startsWith("_"),
})<StyledProps>(({ theme, _isFullyDisabled }) => ({
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: "13px",
  lineHeight: "20px",
  color: theme.palette.textColor,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  boxShadow: "none !important",
  opacity: _isFullyDisabled ? 0.5 : 1,
}));

const StyledCheckIndicator = styled(CheckRoundedIcon)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#95ff95" : "green",
  width: 12,
  height: 9,
}));

const StyledErrorLabel = styled("span")({
  color: "#FF4128",
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "13px",
  display: "flex",
  alignItems: "center",
  "& .MuiSvgIcon-root": {
    width: "15px",
    height: "15px",
    paddingRight: "2px",
  },
});

const FiInput: React.FC<FiInputProps> = ({
  title,
  value,
  name,
  icon,
  onValueChange,
  editMode = false,
  inputTypeProp = { inputType: FieldType.STRING, listData: [] },
  width = "304px",
  readOnly,
  component,
  error = false,
  errorText,
  disabled = false,
  tooltip = false,
  tooltipText = "",
  fieldValidationFunction,
  required = false,
  pattern,
}) => {
  const [isTextFieldFocused, setIsTextFieldFocused] = useState(false);
  const [copyLoading, setCopyLoading] = useState(false);
  const [showCopyButton, setShowCopyButton] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [showValueTooltip, setShowValueTooltip] = useState(false);
  const { getDateFormat } = useConfig();

  const onMouseEnterFunction = (event: React.MouseEvent<HTMLElement>) => {
    setShowValueTooltip(
      event.currentTarget.scrollWidth > event.currentTarget.clientWidth
    );
  };

  useEffect(() => {
    setDirty(false);
  }, [editMode]);

  const getInput = (): ReactNode => {
    if (component) return component;

    switch (inputTypeProp.inputType) {
      case FieldType.DATE:
        return (
          <DatePicker
            data-testid={name}
            value={value}
            size={"small"}
            onFocusFunc={() => setIsTextFieldFocused(true)}
            onBlurFunc={() => setIsTextFieldFocused(false)}
            onChange={(value) => {
              setDirty(true);
              if (!name) return;
              onValueChange?.(
                value ? new Date(value).getTime().toString() : null,
                name
              );
            }}
          />
        );

      case FieldType.LIST:
        return (
          <Select
            data-testid={name}
            size={"small"}
            disabled={readOnly}
            data={inputTypeProp.listData || []}
            value={value}
            onFocusFunc={() => setIsTextFieldFocused(true)}
            onBlurFunc={() => setIsTextFieldFocused(false)}
            onChange={(value) => {
              setDirty(true);
              if (name) {
                onValueChange?.(value, name);
              }
            }}
            isError={error}
          />
        );

      case FieldType.NUMBER:
        return (
          <NumberField
            size={"small"}
            isDisabled={readOnly}
            value={value}
            format={"#,##0.##########"}
            fieldName={name}
            onBlurFunc={() => setIsTextFieldFocused(false)}
            onChange={(value) => {
              setDirty(true);
              if (name) {
                onValueChange?.(value, name);
              }
            }}
            hasError={error}
            data-testid={name}
            pattern={pattern}
          />
        );

      case FieldType.PERCENTAGE:
        return (
          <PercentageField
            size={"small"}
            isDisabled={!!readOnly}
            value={value}
            fieldName={name ?? ""}
            format={"#.###"}
            onFocusFunc={() => setIsTextFieldFocused(true)}
            onBlurFunc={() => setIsTextFieldFocused(false)}
            onChange={(val) => {
              setDirty(true);
              if (name) {
                onValueChange?.(val, name);
              }
            }}
            isError={error}
            data-testid={name}
          />
        );

      case FieldType.PASSWORD:
        return (
          <TextField
            key={`${name}-input`}
            type="password"
            border={4}
            size={"small"}
            isDisabled={readOnly}
            value={value}
            fieldName={name}
            isError={error}
            onFocus={() => setIsTextFieldFocused(true)}
            onBlur={() => setIsTextFieldFocused(false)}
            autoFocus={isTextFieldFocused}
            required={required}
            onChange={(value: any) => {
              setDirty(true);
              if (name) {
                onValueChange?.(value, name);
              }
            }}
            fieldValidationFunction={fieldValidationFunction}
            tooltip
            tooltipText={tooltipText}
            data-testid={name}
          />
        );

      case FieldType.TEXTAREA:
        return (
          <TextField
            border={4}
            size={"small"}
            isDisabled={readOnly}
            value={value}
            fieldName={name}
            isError={error}
            helperText={errorText}
            multiline
            onFocus={() => setIsTextFieldFocused(true)}
            onBlur={() => setIsTextFieldFocused(false)}
            onChange={(value: any) => {
              setDirty(true);
              if (name) {
                onValueChange?.(value, name);
              }
            }}
            tooltip={tooltip}
            tooltipText={tooltipText}
            data-testid={name}
          />
        );

      case FieldType.USERS:
        return (
          <UserAndGroupVirtualizedSelect
            label={name}
            selectedUsers={value}
            setSelectedUsers={onValueChange}
            size={"small"}
            singleSelect={true}
            disabled={readOnly}
          />
        );

      default:
        return (
          <TextField
            border={4}
            size={"small"}
            isDisabled={readOnly}
            value={value}
            fieldName={name}
            isError={error}
            required={required}
            onFocus={() => setIsTextFieldFocused(true)}
            onBlur={() => setIsTextFieldFocused(false)}
            autoFocus={isTextFieldFocused}
            onChange={(value: any) => {
              setDirty(true);
              if (name) {
                onValueChange?.(value, name);
              }
            }}
            tooltip={tooltip}
            tooltipText={tooltipText}
            fieldValidationFunction={fieldValidationFunction}
            data-testid={name}
            pattern={pattern}
          />
        );
    }
  };

  const getValue = () => {
    if (inputTypeProp.inputType === FieldType.LIST) {
      const curr = inputTypeProp.listData?.find(
        (e) => e.value === value || e.id === value
      );
      return curr && value !== null ? curr.label : "";
    } else if (inputTypeProp.inputType === FieldType.DATE) {
      return getFormattedDateValue(value, getDateFormat(true));
    } else if (inputTypeProp.inputType === FieldType.PERCENTAGE) {
      return value + "%";
    } else if (inputTypeProp.inputType === FieldType.NUMBER) {
      return inputTypeProp.format
        ? getFormattedNumber(value, inputTypeProp.format)
        : getFormattedNumber(value);
    }
    return value;
  };

  return (
    <StyledContainer
      _isFullyDisabled={disabled}
      _isTextFieldFocused={isTextFieldFocused}
      display={"flex"}
      width={width}
      maxWidth={width}
      height={editMode ? "64px" : "56px"}
      onMouseLeave={() => {
        if (!editMode) {
          setShowCopyButton(false);
        }
      }}
      onMouseEnter={() => {
        if (!editMode && inputTypeProp.inputType !== FieldType.DATE) {
          setShowCopyButton(true);
        }
      }}
    >
      <Box
        display={"flex"}
        flex={1}
        padding={"8px"}
        flexDirection={"row"}
        minWidth={0}
      >
        <StyledLogoContainer
          _isFullyDisabled={disabled}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          {icon}
        </StyledLogoContainer>
        <Box
          display={"flex"}
          flexDirection={"column"}
          flex={1}
          marginLeft={"12px"}
          justifyContent={"space-between"}
          boxShadow={"none !important"}
          minWidth={0}
        >
          <Box
            display={"flex"}
            flexDirection={"row"}
            justifyContent={editMode ? "flex-start" : "space-between"}
            boxShadow={"none !important"}
          >
            <StyledTitle _isFullyDisabled={disabled} _editMode={editMode}>
              {title}
              {error && errorText && (
                <StyledErrorLabel>
                  <WarningAmberOutlinedIcon /> {errorText}
                </StyledErrorLabel>
              )}
            </StyledTitle>
            {editMode && dirty && !error && <StyledCheckIndicator />}
          </Box>
          {!editMode && (
            <Tooltip title={showValueTooltip ? getValue() : ""}>
              <StyledText
                _isFullyDisabled={disabled}
                onMouseEnter={onMouseEnterFunction}
              >
                {getValue()}
              </StyledText>
            </Tooltip>
          )}
          <Box marginTop={editMode ? "5px" : ""}>{editMode && getInput()}</Box>
        </Box>
        {!editMode && (
          <Box
            display={"flex"}
            flex={0.1}
            flexDirection={"column"}
            justifyContent={"flex-start"}
            sx={{
              "& .MuiIconButton-root:hover": {
                background: "inherit",
              },
            }}
          >
            {(showCopyButton || copyLoading) && (
              <CopyButton
                text={value}
                onLoadStart={() => setCopyLoading(true)}
                onLoadEnd={() => setCopyLoading(false)}
              />
            )}
          </Box>
        )}
      </Box>
    </StyledContainer>
  );
};
export default FiInput;
