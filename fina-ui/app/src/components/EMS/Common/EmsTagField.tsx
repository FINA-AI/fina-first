import { Autocomplete } from "@mui/lab";
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { FieldSize } from "../../../types/common.type";
import TextField from "@mui/material/TextField/TextField";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { KeyboardArrowDownRounded } from "@mui/icons-material";

interface EmsTagFieldProps {
  selectedOptions: any[];
  onChange: (v: any[]) => void;
  disabled?: boolean;
  label?: string;
  size?: FieldSize;
  displayFieldFunction?: (v: any) => any;
  valueField?: string;
  data?: any[];
  editable?: boolean;
  numbersOnly?: boolean;
}

const StyledAutocomplete = styled(Autocomplete)<{ _size: string }>(
  ({ theme, _size }) => ({
    "& .MuiSvgIcon-root": {
      ...(theme as any).smallIcon,
    },
    "& .MuiAutocomplete-endAdornment": {
      top: `50%`,
      right: 10,
    },
    "&.MuiAutocomplete-hasPopupIcon.MuiAutocomplete-hasClearIcon.MuiAutocomplete-root .MuiOutlinedInput-root":
      {
        height: "100% !important",
        paddingTop: "4px !important",
        paddingBottom: "4px !important",
      },
    "&.MuiAutocomplete-root .MuiOutlinedInput-root .MuiAutocomplete-input": {
      padding: "0px !important",
      paddingLeft: "6px !important",
    },
    "&.MuiAutocomplete-inputRoot": {},
    "& .MuiOutlinedInput-root": {
      height: _size === "default" ? "36px" : "32px",
      flexWrap: "wrap",
      paddingTop: 4,
      "& .MuiChip-root": {
        height: _size === FieldSize.SMALL ? "18px" : "22px",
      },
      "& .MuiOutlinedInput-input": {
        height: "0px",
      },
      "& .MuiAutocomplete-endAdornment": {
        display: "flex",
        minWidth: "40px",
        justifyContent: "flex-end",
        "& .MuiButtonBase-root": {
          "&:hover": {
            background: (theme as any).palette.action.select,
          },
        },
      },
    },
    "& .MuiInputLabel-root": {
      top: `${_size === "default" ? "2px" : "0px"} !important`,
      "&[data-shrink='true']": {
        top: `${_size === "default" ? "2px" : "4px"} !important`,
      },
    },
    "& .MuiAutocomplete-popupIndicator": {
      background: "none",
      border: "none",
      "&:hover": {
        background: "none !important",
        cursor: "pointer",
      },
      ...(theme as any).selectOption,
    },
  })
);

const EmsTagField: React.FC<EmsTagFieldProps> = ({
  selectedOptions = [],
  onChange,
  disabled,
  label,
  size = FieldSize.DEFAULT,
  displayFieldFunction,
  valueField,
  data = [],
  editable = true,
  numbersOnly = false,
}) => {
  const numbersRegexpPattern = /^\d+$/;
  const regexp = new RegExp(numbersRegexpPattern);

  const [options] = useState<any>(data);
  const [selectedTags, setSelectedTags] = useState<any>(selectedOptions);

  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    setSelectedTags(selectedOptions);
  }, [selectedOptions]);

  const handleKeyDown = (event: any) => {
    if (editable && event.key === "Enter" && inputValue === "") {
      event.preventDefault();
    }
    if (editable && event.key === "Enter" && inputValue !== "") {
      event.preventDefault();
      if (numbersOnly && !regexp.test(inputValue)) {
        return;
      }
      const data = [...selectedTags, inputValue];
      onChange(data);
      setSelectedTags(data);
      setInputValue("");
    }
  };

  const filterOptions = createFilterOptions({
    matchFrom: "any",
    stringify: (option) => {
      if (displayFieldFunction) {
        return displayFieldFunction(option);
      }

      return option;
    },
  });

  return (
    <StyledAutocomplete
      _size={size}
      multiple
      open={open}
      // filterSelectedOptions
      onClose={(evt, reasons) => {
        if (reasons === "selectOption") {
          return;
        }
        setOpen(false);
      }}
      onOpen={() => {
        if (data && displayFieldFunction && !disabled) {
          return setOpen(!open);
        }
        return false;
      }}
      options={options}
      filterOptions={displayFieldFunction && filterOptions}
      getOptionLabel={(option: any) => {
        if (displayFieldFunction) {
          return displayFieldFunction(option);
        }
        return option;
      }}
      value={selectedTags}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue.trim());
      }}
      disabled={disabled}
      onChange={(event, newValue: any) => {
        setSelectedTags(newValue);
        onChange(newValue);
      }}
      data-testid={"ems-tag-autocomplete"}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          onKeyDown={handleKeyDown}
          label={label}
          fullWidth
          multiline={true}
          size={FieldSize.SMALL}
          disabled={disabled}
          onChange={() => {}}
          data-testid={"tag-input"}
          InputProps={{
            ...params.InputProps,
            className: "MuiAutocomplete-inputRoot",
          }}
        />
      )}
      isOptionEqualToValue={(option: any, value: any) => {
        if (valueField) {
          return option[valueField] === value[valueField];
        }
        return option === value;
      }}
      // renderTags={(value, getTagProps) =>
      //   value.map((option, index) => (
      //     <Chip
      //       variant="outlined"
      //       label={displayFieldFunction ? displayFieldFunction(option) : option}
      //       {...getTagProps({ index })}
      //     />
      //   ))
      // }
      popupIcon={
        !disabled &&
        Boolean(options.length) && (
          <KeyboardArrowDownRounded style={{ cursor: "pointer" }} />
        )
      }
    />
  );
};

export default EmsTagField;
