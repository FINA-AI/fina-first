import { Grid } from "@mui/material";
import DatePicker from "../Field/DatePicker";
import React, { useState } from "react";
import useConfig from "../../../hoc/config/useConfig";
import { checkDateFormat } from "../../../util/appUtil";
import GridFilterCloseButton from "../Grid/GridFilterCloseButton";
import { styled } from "@mui/material/styles";
import { FilterIcon } from "../../../api/ui/icons/FilterIcon";

interface defaultValueType {
  name: string;
  type: string;
  date?: number | string;
}

interface DatePickerFilterProps {
  closeFilter: (val: defaultValueType) => void;
  onClickFunction: (val: defaultValueType) => void;
  defaultValue: defaultValueType;
  label?: string;
  width?: number;
}

const StyledGridContainer = styled(Grid)(() => ({
  "& .MuiGrid-root": {
    height: "40px !important",
    display: "flex",
    alignItems: "center",
  },
}));

const StyledGridItem = styled(Grid)(({ theme }: any) => ({
  display: "flex",
  alignItems: "center",
  padding: "0px 20px",
  "& .MuiFormControl-root": {
    width: "156px !important",
    paddingRight: "190px",
    top: "0px",
    height: "35px",
  },
  "& .MuiInputBase-input": {
    paddingTop: "0px !important",
    paddingBottom: "0px",
  },
  "& .MuiInputBase-root": {
    minWidth: "328px !important",
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
    cursor: activeFilterBtn ? "pointer" : "",
    "& svg": {
      opacity: activeFilterBtn ? "1" : "0.5",
    },
    paddingRight: "10px",
    display: "flex",
  })
);

const DatePickerFilter: React.FC<DatePickerFilterProps> = ({
  closeFilter,
  onClickFunction,
  defaultValue,
  label,
  width,
}) => {
  const { getDateFormat } = useConfig();
  const [activeFilterBtn, setActiveFilterBtn] = useState(false);
  const [fieldValue, setFieldValue] = useState(defaultValue);

  const checkDates = (item: defaultValueType) => {
    if (item.date) {
      return checkDateFormat(item.date);
    }
  };

  const DateOnChange = (value: Date) => {
    let item = {
      name: fieldValue.name,
      type: fieldValue.type,
      date: value ? value.getTime() : "",
    };
    setFieldValue(item);
    setActiveFilterBtn(checkDates(item) ?? false);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onClickFunction(fieldValue);
    }
  };

  return (
    <StyledGridContainer
      container
      spacing={0}
      direction="column"
      justifyContent="center"
    >
      <StyledGridItem item xs={12} onKeyDown={handleKeyPress}>
        <DatePicker
          width={width ? width : 328}
          label={label}
          onChange={(value) => DateOnChange(value)}
          format={getDateFormat(true)}
          value={defaultValue?.date ?? ""}
          autoFocus={true}
          showMonthView={true}
          data-testid={"date"}
        />
        <StyledFilter
          activeFilterBtn={activeFilterBtn}
          onClick={() => activeFilterBtn && onClickFunction(fieldValue)}
          data-testid={"filter-button"}
        >
          <FilterIcon />
        </StyledFilter>
        <GridFilterCloseButton
          disabled={!activeFilterBtn}
          onClose={() => closeFilter(fieldValue)}
        />
      </StyledGridItem>
    </StyledGridContainer>
  );
};

export default DatePickerFilter;
