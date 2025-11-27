import React, { useState } from "react";
import { Grid, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { columnFilterConfigType } from "../../../types/common.type";
import GridFilterCloseButton from "../Grid/GridFilterCloseButton";
import { styled } from "@mui/material/styles";
import { FilterIcon } from "../../../api/ui/icons/FilterIcon";

interface NumberBetweenFilterProps {
  closeFilter: (data: columnFilterConfigType) => void;
  onClickFunction: (data: columnFilterConfigType) => void;
  defaultValue: columnFilterConfigType;
}

const StyledGridItem = styled(Grid)(({ theme }: any) => ({
  display: "flex",
  alignItems: "center",
  "& .MuiFormControl-root": {
    width: "156px !important",
    paddingRight: "16px",
    top: "0px",
  },
  "& .MuiInputBase-input": {
    paddingTop: "0px !important",
    paddingBottom: "0px",
  },
  "& .MuiInputBase-root": {
    maxWidth: "156px !important",
    height: "40px !important",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor:
        theme.palette.mode === "dark" ? "#5D789A" : "rgb(184, 185, 190)",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: `${theme.palette.primary.main} !important`,
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: theme.palette.borderColor,
    borderRadius: "8px !important",
  },
  "& .MuiInputLabel-formControl": {
    top: "-5px",
  },
  "& .MuiInputLabel-shrink": {
    top: "3px",
  },
  "& .MuiInputAdornment-root": {
    paddingBottom: "0px",
  },
  "& .MuiFormLabel-root": {
    color: theme.palette.secondaryTextColor,
    opacity: "0.8",
    fontSize: "14px",
    "&.Mui-focused": {
      color: theme.palette.secondaryTextColor,
      opacity: "0.8",
    },
  },
  "& .MuiInputAdornment-positionEnd": {
    padding: "0",
  },
}));

const StyledFilter = styled("span")<{ activeFilterBtn: boolean }>(
  ({ activeFilterBtn }) => ({
    display: "flex",
    alignItems: "center",
    cursor: activeFilterBtn ? "pointer" : "",
    "& svg": {
      opacity: activeFilterBtn ? "1" : "0.5",
    },
    paddingRight: "16px",
  })
);

const NumberBetweenFilter: React.FC<NumberBetweenFilterProps> = ({
  closeFilter,
  onClickFunction,
  defaultValue,
}) => {
  const [activeFilterBtn, setActiveFilterBtn] = useState(false);
  const { t } = useTranslation();
  const [fieldValue, setFieldValue] = useState(
    defaultValue || { start: null, end: null }
  );

  const checkNumbers = (value: number | string | undefined) => {
    return (
      value !== undefined &&
      !isNaN(value as number) &&
      value !== "" &&
      value !== null
    );
  };

  const handleInputChange = (e: any, field: string) => {
    const value = e.target.value;
    setFieldValue({
      ...fieldValue,
      [field]: value,
    });
    setActiveFilterBtn(checkNumbers(value));
  };

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      onClickFunction(fieldValue);
    }
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      height={"40px !important"}
    >
      <StyledGridItem item xs={12} onKeyDown={handleKeyPress}>
        <TextField
          label={t("from")}
          type={"number"}
          variant="outlined"
          value={fieldValue.start}
          onChange={(e) => handleInputChange(e, "start")}
          autoFocus={true}
          data-testid={"from-field"}
        />
        <TextField
          label={t("to")}
          type={"number"}
          variant="outlined"
          value={fieldValue.end}
          onChange={(e) => handleInputChange(e, "end")}
          data-testid={"to-field"}
        />
        <StyledFilter
          activeFilterBtn={activeFilterBtn}
          onClick={() => onClickFunction(fieldValue)}
          data-testid={"filter-button"}
        >
          <FilterIcon />
        </StyledFilter>
        <GridFilterCloseButton onClose={() => closeFilter(fieldValue)} />
      </StyledGridItem>
    </Grid>
  );
};

export default NumberBetweenFilter;
