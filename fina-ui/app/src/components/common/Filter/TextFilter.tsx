import { Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import GridFilterCloseButton from "../Grid/GridFilterCloseButton";
import { styled } from "@mui/material/styles";
import { FilterIcon } from "../../../api/ui/icons/FilterIcon";

interface TextFilterProps {
  isOnlyNumber?: boolean;
  label?: string;
  closeFilter: (val: string | number) => void;
  defaultValue?: valueType;
  onClickFunction: (val: string | number) => void;
  width?: string;
}

interface valueType {
  key?: string;
  value?: string | number;
}

const StyledContextGridItem = styled(Grid)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "0px 20px",
}));

const StyledTextField = styled(TextField)<{ _width?: string }>(
  ({ _width, theme }) => ({
    "& .MuiOutlinedInput-input": {
      "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
        WebkitAppearance: "none",
      },
      paddingBottom: "5px",
    },
    "& .MuiInputBase-input": {
      padding: "8.5px 14px",
      paddingBottom: "10px",
      fontSize: "small",
    },
    "& .MuiInputBase-root": {
      minWidth: _width ? _width : "328px",
      maxHeight: "35px",
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor:
          theme.palette.mode === "dark" ? "#5D789A" : "rgb(184, 185, 190)",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: `${theme.palette.primary.main} !important`,
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: (theme as any).palette.borderColor,
      borderRadius: "8px !important",
    },
    "& .MuiFormLabel-root": {
      color: `${(theme as any).palette.textColor} !important`,
      opacity: "0.8",
      "&.Mui-focused": {
        color: (theme as any).palette.textColor,
        opacity: "0.8",
      },
    },
    "& .MuiInputLabel-formControl": {
      top: "9px",
      "&.Mui-focused": {
        top: "9px",
      },
    },
    "& .MuiInputLabel-shrink": {
      top: "2px !important",
    },
    "& .MuiInputLabel-root": {
      fontSize: "small",
      top: "-2px",
    },
    paddingRight: "16px",
  })
);

const StyledFilter = styled("span")(() => ({
  cursor: "pointer",
  paddingRight: "10px",
  display: "flex",
}));

const TextFilter: React.FC<TextFilterProps> = ({
  isOnlyNumber,
  label,
  closeFilter,
  defaultValue,
  onClickFunction,
  width,
}) => {
  const [textValue, setTextValue] = useState(defaultValue?.value ?? "");

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onClickFunction(textValue);
    }
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      justifyContent="center"
      sx={{ display: "flex", alignItems: "center" }}
    >
      <StyledContextGridItem item xs={12}>
        <StyledTextField
          _width={width}
          type={isOnlyNumber ? "number" : "text"}
          variant="outlined"
          label={label}
          defaultValue={textValue}
          onChange={(event) => setTextValue(event.target.value)}
          autoFocus={true}
          onKeyDown={handleKeyPress}
          size="small"
          data-testid={"text-field"}
        />
        <StyledFilter
          onClick={() => onClickFunction(textValue)}
          data-testid={"filter-button"}
        >
          <FilterIcon />
        </StyledFilter>
        <GridFilterCloseButton onClose={() => closeFilter(textValue)} />
      </StyledContextGridItem>
    </Grid>
  );
};

export default TextFilter;
