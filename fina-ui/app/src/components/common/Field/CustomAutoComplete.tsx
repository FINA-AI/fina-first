import { KeyboardArrowDownRounded } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import {
  Autocomplete,
  Box,
  CircularProgress,
  Paper,
  PaperProps,
  TextField,
  Typography,
} from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";
import React, { useRef, useState } from "react";
import TextButton from "../Button/TextButton";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import Tooltip from "../Tooltip/Tooltip";
import { styled } from "@mui/material/styles";
import ListBoxComponent from "./ListBoxVirtualComponent";

const getLoadingCircleSize = (size: string) => {
  switch (size) {
    case "default":
      return "20px";
    case "small":
      return "14px";
    default:
      return "20px";
  }
};

interface DataType {
  code?: string;
  id?: number;
  description?: string;
  name?: string;
}

interface CustomAutoCompleteProps {
  data: DataType[];
  label?: string;
  selectedItem?: any;
  displayFieldName?: string;
  valueFieldName: string;
  displayFieldFunction?: (item: any) => string;
  onChange: (selectedItem: any) => void;
  onKeyDown?: (value: string) => void;
  disabled?: boolean;
  isError?: boolean;
  addOption?: boolean;
  onAddNewItemClick?: () => void;
  addNewItemLabelText?: string;
  secondaryDisplayFieldName?: string;
  secondaryDisplayFieldLabel?: string;
  virtualized?: boolean;
  loading?: boolean;
  size?: string;
  onClear?: () => void;
  fieldName?: string;
  allowInvalidInputSelection?: boolean;
  renderOptionFunction?: (value: string, option: DataType) => React.ReactNode;
}

interface partsType {
  text: string;
  highlight: boolean;
}

const StyledTextFieldRoot = styled(TextField)<{
  _size: string;
}>(({ _size }) => ({
  "& .MuiOutlinedInput-root": {
    height: _size === "default" ? "36px" : "32px",
    paddingRight: "55px !important",
  },
  "& .MuiOutlinedInput-root.Mui-disabled": {
    paddingRight: "40px !important",
  },
  "& .MuiInputLabel-root": {
    top: `${_size === "default" ? "2px" : "0px"} !important`,
    "&[data-shrink='true']": {
      top: `${_size === "default" ? "2px" : "4px"} !important`,
    },
  },
}));

const StyledAutocomplete = styled(Autocomplete)(({ theme }: any) => ({
  "& .MuiSvgIcon-root": {
    ...theme.smallIcon,
  },
  "& .MuiInputLabel-root": {
    width: "calc(100% - 36px)",
  },
  "& .MuiBox-root": {
    "& .MuiAutocomplete-endAdornment": {
      // top: `calc(50% - 10px)`,
    },
    "& .MuiAutocomplete-clearIndicator": {
      border: "unset",
      background: "inherit",
      padding: "2px",
      "&:hover": {
        background: `${theme.palette.buttons.secondary.hover} !important`,
      },
    },
  },
  "& .MuiAutocomplete-popupIndicator": {
    color: "#7589A5",
    borderRadius: "1px",
    marginRight: "0px",
    border: "inherit",
    backgroundColor:
      theme.palette.mod === "dark" ? "rgba(52, 66, 88, 1)" : "inherit",
    "&:hover": {
      color: "#596D89 !important",
      backgroundColor: "transparent",
    },
  },
}));

const StyledAddNewWrapper = styled(Box)(({ theme }: any) => ({
  borderTop: theme.palette.borderColor,
  marginLeft: 10,
  marginRight: 10,
  padding: 10,
}));

const StyledAddIcon = styled(AddIcon)(() => ({
  width: 16,
  height: 14,
}));

const StyledLeftListItem = styled(Box)(() => ({
  float: "left",
  textAlign: "left",
  width: "60%",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

const StyledRightListItem = styled(Box)(() => ({
  color: "#8E9CB6",
  float: "right",
  textAlign: "left",
  width: "40%",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "flex",
  justifyContent: "flex-end",
  "& :hover": {
    overflow: "visible",
  },
}));

const StyledSecondaryText = styled(Typography)(() => ({
  color: "#8E9CB6",
  marginLeft: "10px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

const StyledCustomOption = styled("span")(() => ({
  lineBreak: "anywhere",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

const StyledKeyboardArrowDownIcon = styled(KeyboardArrowDownRounded)(
  ({ theme }) => ({
    cursor: "pointer",
    color: theme.palette.mode === "dark" ? "#FFFFFF" : "inherit",
  })
);

const CustomAutoComplete: React.FC<CustomAutoCompleteProps> = ({
  data,
  label,
  selectedItem,
  displayFieldName,
  valueFieldName,
  displayFieldFunction,
  onChange,
  onKeyDown,
  disabled = false,
  isError = false,
  addOption = false,
  onAddNewItemClick,
  addNewItemLabelText,
  secondaryDisplayFieldName,
  secondaryDisplayFieldLabel,
  virtualized,
  loading = false,
  size = "default",
  onClear,
  fieldName,
  allowInvalidInputSelection = false,
  renderOptionFunction,
}) => {
  // const ref: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const inputValueRef = useRef("");
  const selectedValueRef = useRef<undefined | {}>();
  const [error, setError] = useState<boolean>(false);

  const CustomPaper = (props: PaperProps) => {
    if (!addOption) {
      return (
        <Paper
          {...props}
          style={{
            overflowX: "hidden",
          }}
        />
      );
    }

    return (
      <Paper>
        <div {...props} />
        <StyledAddNewWrapper>
          <TextButton
            onMouseDown={() => {
              onAddNewItemClick && onAddNewItemClick();
            }}
            endIcon={<StyledAddIcon />}
          >
            {addNewItemLabelText}
          </TextButton>
        </StyledAddNewWrapper>
      </Paper>
    );
  };

  const getValue = (option: any) => {
    const value = displayFieldFunction
      ? displayFieldFunction(option)
      : displayFieldName && option[displayFieldName];
    return value ? value : "";
  };

  const getRenderOptions = () => {
    if (addOption && !data.length) {
      return {
        renderOption: (props: any, option: any) => {
          if (option.isNoOptions) {
            return (
              <Box {...props} sx={{ pointerEvents: "none" }}>
                {option.message}
              </Box>
            );
          }
        },
      };
    }

    if (
      !displayFieldFunction &&
      secondaryDisplayFieldName &&
      secondaryDisplayFieldName.trim().length > 0
    ) {
      const getParts = (option: any, key: string, inputValue: string) => {
        if (option[key] == null) {
          return [];
        }
        const matches = match(option[key], inputValue, {
          findAllOccurrences: true,
          insideWords: true,
        });
        return parse(option[key], matches);
      };

      return {
        renderOption: (
          props: any,
          option: any,
          {
            inputValue,
          }: {
            inputValue: string;
          }
        ) => {
          const parts = getParts(
            option,
            displayFieldName ? displayFieldName : "",
            inputValue
          );

          const secondaryParts = getParts(
            option,
            secondaryDisplayFieldName,
            inputValue
          );

          return (
            // eslint-disable-next-line react/prop-types
            <Box {...props} key={props.id}>
              <StyledLeftListItem>
                {parts.map((part: partsType, index: number) => {
                  return (
                    <Tooltip
                      title={option.name}
                      key={option[valueFieldName] + `${index}`}
                    >
                      <span
                        style={{
                          fontWeight: part.highlight ? 700 : 400,
                        }}
                      >
                        {part.text}
                      </span>
                    </Tooltip>
                  );
                })}
              </StyledLeftListItem>
              <StyledRightListItem>
                <span>{secondaryDisplayFieldLabel + " :"}</span>
                {secondaryParts.map((part: partsType, index: number) => (
                  <span
                    key={index}
                    style={{
                      fontWeight: part.highlight ? 700 : 400,
                    }}
                  >
                    {part.text}
                  </span>
                ))}
              </StyledRightListItem>
            </Box>
          );
        },
      };
    }

    return {
      renderOption: (props: any, option: any) => {
        const value = getValue(option);

        return (
          // eslint-disable-next-line react/prop-types
          <Box {...props} key={props["id"]}>
            <StyledCustomOption>
              {renderOptionFunction?.(value, option) || value}
            </StyledCustomOption>
          </Box>
        );
      },
    };
  };

  const filterOptions = createFilterOptions({
    matchFrom: "any",
    stringify: (option: any) => {
      if (displayFieldFunction) {
        return displayFieldFunction(option);
      }

      return secondaryDisplayFieldName
        ? displayFieldName &&
            `${option[displayFieldName]} ${option[secondaryDisplayFieldName]}`
        : (displayFieldName && option[displayFieldName]) ?? "";
    },
  });

  const wrappedFilterOptions = (options: any[], state: any) => {
    const filtered = filterOptions(options, state);

    if (addOption && filtered.length === 0) {
      return [{ isNoOptions: true, message: "No options available" }];
    }

    return filtered;
  };

  const handleBlur = () => {
    if (!allowInvalidInputSelection) return;
    if (inputValueRef.current && !selectedValueRef.current) {
      setError(true);
      onChange(null);
    }
  };

  const clearSelectedValueRef = () => {
    if (!allowInvalidInputSelection) return;

    selectedValueRef.current = undefined;
    inputValueRef.current = "";
    setError(false);
  };

  return (
    <StyledAutocomplete
      // ref={ref}
      ListboxProps={{
        style: {
          maxHeight: 300,
          overflow: "auto",
          width: "auto",
          // width: ref?.current?.clientWidth || "auto",
        },
      }}
      ListboxComponent={
        virtualized
          ? (ListBoxComponent as React.JSXElementConstructor<any>)
          : undefined
      }
      disabled={disabled}
      isOptionEqualToValue={(option: any, value: any) => {
        return option[valueFieldName] === value[valueFieldName];
      }}
      autoHighlight={true}
      loading={loading}
      blurOnSelect={true}
      data-testid={"autocomplete"}
      renderInput={(params) => (
        <StyledTextFieldRoot
          _size={size}
          {...params}
          error={isError || error}
          fullWidth
          label={label}
          variant="outlined"
          data-testid={`autocomplete-input-${fieldName ? fieldName : ""}`}
          onKeyDown={(e: any) => {
            if (!onKeyDown) return;
            if (e.key === "Enter") {
              e.stopPropagation();
              onKeyDown(e.target.value);
            }
          }}
          onBlur={handleBlur}
          onChange={(event) => {
            inputValueRef.current = event.target.value;
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <Box display={"flex"}>
                {loading ? (
                  <Box style={{ display: "flex", alignItems: "center" }}>
                    <CircularProgress
                      color="inherit"
                      size={getLoadingCircleSize(size)}
                      style={{
                        position: "absolute",
                        right: "12px",
                      }}
                    />
                  </Box>
                ) : null}
                {!loading && params.InputProps.endAdornment}
                <StyledSecondaryText>
                  {secondaryDisplayFieldLabel &&
                  selectedItem &&
                  secondaryDisplayFieldName &&
                  typeof selectedItem === "object" &&
                  selectedItem.hasOwnProperty(secondaryDisplayFieldName)
                    ? secondaryDisplayFieldLabel +
                      ": " +
                      selectedItem[
                        secondaryDisplayFieldName as keyof typeof selectedItem
                      ]
                    : ""}
                </StyledSecondaryText>
              </Box>
            ),
          }}
        />
      )}
      onChange={(e, v) => {
        if (v && typeof v === "object") {
          onChange(v);
          selectedValueRef.current = v;
        }
      }}
      getOptionLabel={(option) => {
        if (option && typeof option === "object") {
          const value = displayFieldFunction
            ? displayFieldFunction(option)
            : displayFieldName &&
              option[displayFieldName as keyof typeof option];
          return (value || "").toString();
        } else {
          return (option || "").toString();
        }
      }}
      options={data}
      popupIcon={<StyledKeyboardArrowDownIcon />}
      // inputValue={selectedItem}
      value={
        selectedItem && Object.keys(selectedItem).length === 0
          ? null
          : selectedItem
      }
      forcePopupIcon
      freeSolo
      size="small"
      PaperComponent={CustomPaper}
      {...getRenderOptions()}
      filterOptions={wrappedFilterOptions}
      onInputChange={(e, v) => {
        if (onClear && !v) {
          onClear();
        }
        clearSelectedValueRef();
      }}
    />
  );
};

export default CustomAutoComplete;
