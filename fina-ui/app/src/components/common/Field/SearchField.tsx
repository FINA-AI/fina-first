import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import React, { useEffect, useState } from "react";
import GhostBtn from "../Button/GhostBtn";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/system";
import { styled } from "@mui/material/styles";

interface SearchFieldProps {
  text?: string;
  defaultValue?: any;
  onFilterClick?: (value: string) => void;
  onClear?: () => void;
  width?: string | number;
  height?: string | number;
  minSearchTextLength?: number;
  withFilterButton?: boolean;
  onFilterChange?: (value: string) => void;
  style?: object;
}

const StyledTextField = styled(TextField)<{
  _width: number | string;
  _height: number | string;
}>(({ _width, _height, theme }) => ({
  width: _width,
  paddingRight: 8,
  "& .MuiOutlinedInput-root": {
    backgroundColor: (theme as any).palette.paperBackground,
    borderRadius: (theme as any).btn.borderRadius,
    padding: "0px",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor:
        theme.palette.mode === "dark" ? "#3C4D68" : `rgb(234, 235, 240)`,
    },

    "&:hover": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor:
          theme.palette.mode === "dark" ? "#7D95B3" : "rgb(184, 185, 190)",
      },
    },
  },
  "& .MuiSvgIcon-root": {
    "&:nth-of-type(1)": {
      position: "absolute",
    },
  },
  "& .MuiOutlinedInput-input": {
    paddingTop: "0px!important",
    paddingBottom: "0px!important",
    minHeight: "30px !important",
    fontSize: "14px !important",
    paddingLeft: "34px",
    ...(theme as any).inputValue,
    backgroundColor: (theme as any).palette.paperBackground,
  },
  "& .MuiInputBase-root": {
    height: _height,
  },
  "& .MuiInputBase-adornedStart": {
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark" ? "rgb(0 0 0 / 5%)" : "#F9F9F9",
    },
  },
  "& .MuiInputBase-adornedEnd": {
    "&:hover": {
      backgroundColor: (theme as any).palette.paperBackground,
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: (theme as any).palette.borderColor,
  },
  "& input::placeholder": {
    color: theme.palette.mode === "light" ? "#596D89" : "#ABBACE",
  },
}));

const StyledSearchIcon = styled(SearchIcon)(({ theme }: any) => ({
  ...theme.defaultIcon,
  margin: "4px 4px 4px 8px",
  color: "#5D789A",
}));

const StyledClearRoundedIcon = styled(ClearRoundedIcon)(({ theme }: any) => ({
  marginRight: 8,
  ...theme.smallIcon,
  color: "#5D789A",
  cursor: "pointer",
}));

const SearchField: React.FC<SearchFieldProps> = ({
  text,
  defaultValue,
  onFilterClick,
  onClear,
  width = "100%",
  height = 32,
  minSearchTextLength = 3,
  withFilterButton = true,
  onFilterChange,
  ...props
}) => {
  const { t } = useTranslation();
  const [value, setValue] = useState<string | undefined>("");
  const [searchValue, setSearchValue] = useState(defaultValue);

  useEffect(() => {
    if (defaultValue !== searchValue) {
      setSearchValue(defaultValue);
    }
  }, [defaultValue]);
  const isFilterEnabled = () => {
    if (
      searchValue &&
      searchValue.length > 0 &&
      searchValue.length < minSearchTextLength
    )
      return false;
    if (value) {
      return value !== searchValue;
    }

    return !(!value && !searchValue);
  };

  const textFieldOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let val = event.target.value;
    setSearchValue(val);
    if (onFilterChange) {
      onFilterChange(val);
    }
  };

  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // it triggers by pressing the enter key
    if (
      searchValue &&
      searchValue.length >= minSearchTextLength &&
      e.which === 13 &&
      onFilterClick
    ) {
      onSearch();
    }
  };

  const onSearch = () => {
    if (onFilterClick) {
      onFilterClick(searchValue);
    }
    setValue(searchValue);
  };

  const onClearValue = () => {
    setSearchValue("");
    setValue("");
    if (onClear) {
      onClear();
    }
  };

  return (
    <Box
      width={width ? width : "100%"}
      display={"flex"}
      height={"fit-content !important"}
    >
      <StyledTextField
        _height={height}
        _width={width}
        data-testid={"searchField"}
        type={"text"}
        InputLabelProps={{ shrink: true }}
        value={searchValue ? searchValue : ""}
        onKeyPress={onKeyPress}
        onKeyDown={(e: any) => e.stopPropagation()}
        placeholder={text ? text : t("search")}
        {...props}
        onChange={(event) =>
          textFieldOnChange(event as React.ChangeEvent<HTMLInputElement>)
        }
        InputProps={{
          startAdornment: <StyledSearchIcon />,
          endAdornment: (
            <StyledClearRoundedIcon
              visibility={!searchValue ? "hidden" : "visible"}
              onClick={() => onClearValue()}
            />
          ),
        }}
      />
      {withFilterButton && (
        <GhostBtn
          fontSize={12}
          onClick={() => onSearch()}
          children={t("filter")}
          disabled={!isFilterEnabled()}
          data-testid={"filter-button"}
        />
      )}
    </Box>
  );
};

export default SearchField;
