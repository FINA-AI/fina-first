import { Autocomplete } from "@mui/lab";
import { CircularProgress, Popper, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { KeyboardArrowDownRounded } from "@mui/icons-material";
import { DashletType } from "../../../types/dashboard.type";
import { styled } from "@mui/material/styles";

interface DashletAutocompleteProps {
  data: DashletType[];
  displayFieldName: string;
  valueFieldName: string;
  onChange: (value: DashletType) => void;
  size: string;
  secondaryDisplayFieldName?: string;
  disabled?: boolean;
  loading?: boolean;
  isError?: boolean;
  label: string;
  onClose: () => void;
  selectedItem: any;
  onClear?: () => void;
  placeholder: string;
}

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

const StyledAutocomplete = styled(Autocomplete)<{ _size: string }>(
  ({ theme, _size }) => ({
    "& .MuiSvgIcon-root": {
      ...(theme as any).smallIcon,
    },
    ...(theme as any).customizeInput({ _size, isAutocomplete: true }).textField,
    "& .MuiOutlinedInput-root": {
      borderRadius: "13px",
      backgroundColor: (theme as any).palette.lightBackgroundColor,
      "& input": {
        "&::-webkit-input-placeholder": { color: "#94B0FF" },
      },
      "& .MuiBox-root": {
        display: "none",
      },
      padding: "4px 8px",
      height: "26px",
    },
  })
);

const StyledPopper = styled(Popper)({
  top: "3px !important",
  "& .MuiAutocomplete-listbox": {
    boxSizing: "border-box",
    background: "#2C3644 !important",
    '& .MuiAutocomplete-option[aria-selected="true"]': {
      backgroundColor: "#414A56 !important",
    },
    "& :hover": {
      borderRadius: "4px",
      backgroundColor: "#414A56 !important",
    },
    "& .MuiAutocomplete-option": {
      color: "#FFFFFF",
    },
    "& .MuiAutocomplete-option.Mui-focused": {
      backgroundColor: "#414A56 !important",
    },
    "& li": {
      padding: "4px",
      display: "block",
      whiteSpace: "nowrap",
      lineBreak: "anywhere",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  },
});

const DashletAutocomplete: React.FC<DashletAutocompleteProps> = ({
  data,
  displayFieldName,
  valueFieldName,
  onChange,
  size,
  secondaryDisplayFieldName,
  disabled,
  loading,
  isError,
  label,
  onClose,
  selectedItem,
  onClear,
  placeholder,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>();
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (iconRef.current) {
      iconRef.current.click();
    }
  }, []);

  const filterOptions = createFilterOptions({
    matchFrom: "any",
    stringify: (option: { [key: string]: string }) =>
      secondaryDisplayFieldName
        ? `${option[displayFieldName]} ${option[secondaryDisplayFieldName]}`
        : option[displayFieldName],
  });

  return (
    <StyledAutocomplete
      _size={size}
      ref={ref}
      ListboxProps={{
        style: {
          maxHeight: 300,
          overflow: "auto",
          width: ref.current?.clientWidth || undefined,
        },
      }}
      disabled={disabled}
      PopperComponent={(props) => <StyledPopper {...props} />}
      isOptionEqualToValue={(option: any, value: any) =>
        option[valueFieldName] === value[valueFieldName]
      }
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          error={isError}
          fullWidth
          label={label}
          variant="outlined"
          onBlur={() => {
            onClose();
          }}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <Box display={"flex"}>
                {loading ? (
                  <CircularProgress
                    color="inherit"
                    size={getLoadingCircleSize(size)}
                  />
                ) : null}
                {!loading && params.InputProps.endAdornment}
              </Box>
            ),
          }}
        />
      )}
      onChange={(e, v) => {
        let value = v as DashletType;
        onChange(value);
      }}
      getOptionLabel={(option: any) => {
        const value = option[displayFieldName];
        return value ? value : "";
      }}
      options={data}
      popupIcon={
        <Box ref={iconRef}>
          <KeyboardArrowDownRounded style={{ cursor: "pointer" }} />
        </Box>
      }
      // inputValue={selectedItem}
      value={
        selectedItem && Object.keys(selectedItem).length === 0
          ? null
          : selectedItem
      }
      forcePopupIcon
      freeSolo
      size="small"
      filterOptions={filterOptions as any}
      onInputChange={(e, v) => {
        if (onClear && !v) {
          onClear();
        }
      }}
      open={true}
    />
  );
};

export default DashletAutocomplete;
