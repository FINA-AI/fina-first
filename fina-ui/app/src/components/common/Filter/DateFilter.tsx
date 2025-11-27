import { Grid } from "@mui/material";
import DatePicker from "../Field/DatePicker";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import useConfig from "../../../hoc/config/useConfig";
import { checkDateFormat } from "../../../util/appUtil";
import GridFilterCloseButton from "../Grid/GridFilterCloseButton";
import { styled } from "@mui/material/styles";
import { FilterIcon } from "../../../api/ui/icons/FilterIcon";

interface DateFilterProps {
  closeFilter: (val: any) => void;
  onClickFunction: (val: any) => void;
  defaultValue: defaultValueType;
}

interface defaultValueType {
  name: string;
  start?: number | string;
  end?: number | string;
  type: string;
}

const StyledGridContainer = styled(Grid)(() => ({
  "& .MuiGrid-root": {
    height: "35px !important",
    display: "flex",
    alignItems: "center",
  },
}));

const StyledGridItem = styled(Grid)(({ theme }: any) => ({
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

const DateFilter: React.FC<DateFilterProps> = ({
  closeFilter,
  onClickFunction,
  defaultValue,
}) => {
  const { getDateFormat } = useConfig();
  const { t } = useTranslation();
  const [activeFilterBtn, setActiveFilterBtn] = useState<boolean>(false);
  const [fieldValue, setFieldValue] = useState<defaultValueType>(defaultValue);

  const checkDates = (item: defaultValueType) => {
    if (item.start && item.end) {
      if (item.start > item.end) return false;

      return checkDateFormat(item.start) && checkDateFormat(item.end);
    } else if (item.start) {
      return checkDateFormat(item.start);
    } else if (item.end) {
      return checkDateFormat(item.end);
    }
  };

  const DateOnChangeFrom = (value: Date) => {
    let item = {
      name: fieldValue.name,
      type: fieldValue.type,
      start: value ? value.getTime() : "",
      end: fieldValue.end,
    };
    setFieldValue(item);
    setActiveFilterBtn(checkDates(item) ?? false);
  };

  const DateOnChangeTo = (value: Date) => {
    let item = {
      name: fieldValue.name,
      type: fieldValue.type,
      start: fieldValue.start,
      end: value ? value.getTime() : "",
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
      alignItems="center"
      justifyContent="center"
    >
      <StyledGridItem item xs={12} onKeyDown={handleKeyPress}>
        <DatePicker
          label={t("from")}
          onChange={(value) => DateOnChangeFrom(value)}
          format={getDateFormat(true)}
          value={defaultValue?.start ?? ""}
          autoFocus={true}
          data-testid={"from-date"}
        />
        <DatePicker
          label={t("to")}
          onChange={(value) => DateOnChangeTo(value)}
          format={getDateFormat(true)}
          value={defaultValue?.end ?? ""}
          data-testid={"to-date"}
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

export default DateFilter;
