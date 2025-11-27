import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import { useTranslation } from "react-i18next";
import TextButton from "../../common/Button/TextButton";
import { Link } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Clear";
import { styled, useTheme } from "@mui/material/styles";

interface ToolbarListSearchProps {
  filterValue?: string;
  to?: string;
  padding?: string;
  height: number;
  onClear?: VoidFunction;
  onFilter(searchValue: string): void;
}

const StyledRoot = styled(Box)<{ padding?: string; height: number }>(
  ({
    theme,
    padding,
    height,
  }: {
    theme: any;
    padding?: string;
    height: number;
  }) => ({
    width: "100%",
    padding: padding ? padding : "8px 12px",
    display: "flex",
    height: height ? `${height}px` : "72px",
    boxSizing: "border-box",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: theme.palette.borderColor,
    "& svg": {
      color: theme.palette.mode === "dark" ? "#5D789A" : "rgba(24, 41, 57, .5)",
    },
    "& div": {
      display: "flex",
    },
    "& .MuiInput-root": {
      width: "100%",
    },
    "& .MuiButtonBase-root": {
      padding: 4,
    },
  })
);

const StyledArrowBackIosIcon = styled(ArrowBackIosIcon)(({ theme }: any) => ({
  top: "2px",
  position: "relative",
  marginLeft: -4,
  "& .MuiSvgIcon-root": {
    ...theme.defaultIcon,
  },
}));

const StyledSearchInput = styled(Input)(({ theme }) => ({
  height: "32px",
  border: "none",
  borderRadius: "8px",
  backgroundColor: theme.palette.mode === "light" ? "#F9F9FB" : "#414c5e",
  padding: "6px",
  fontSize: "12px",
  "& input::placeholder": {
    fontSize: "12px",
    lineHeight: "16px",
  },
  "& svg": {
    paddingBottom: "3px",
  },
  "& .MuiButtonBase-root": {
    background: "inherit",
    border: "inherit",
  },
}));

const StyledSearchIcon = styled(SearchIcon)(({ theme }: any) => ({
  cursor: "pointer",
  ...theme.defaultIcon,
}));

const StyledSideIconsBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  padding: 0,
  "& .MuiButtonBase-root": {
    background: "inherit",
    border: "inherit",
  },
}));

const StyledTypography = styled(Typography)(({ theme }: any) => ({
  color: theme.palette.secondaryTextColor,
}));

const ToolbarListSearch: React.FC<ToolbarListSearchProps> = ({
  filterValue,
  onFilter,
  to,
  padding,
  height,
  onClear,
}) => {
  const theme = useTheme();
  const [initSearch, setInitSearch] = useState<boolean | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const { t } = useTranslation();

  const handleSearch = () => {
    setInitSearch(true);
  };
  const handleClose = () => {
    setInitSearch(null);
    clearFilter();
    onFilter("");
  };

  const onSearchKeyPress = () => {
    // it triggers by pressing the enter key
    onFilter(searchValue);
  };

  useEffect(() => {
    setSearchValue(filterValue ?? "");
  }, [filterValue]);

  const clearFilter = () => {
    setSearchValue("");
    if (onClear) onClear();
  };

  return (
    <StyledRoot height={height} padding={padding} data-testid={"list-toolbar"}>
      {!initSearch && (
        <TextButton
          component={Link}
          to={to || "/catalog"}
          style={{
            color: theme.palette.mode === "dark" ? "#5D789A" : "",
          }}
          startIcon={<StyledArrowBackIosIcon viewBox={"0 0 1 32"} />}
          data-testid="navigate-back-button"
        >
          <StyledTypography>{t("back")}</StyledTypography>
        </TextButton>
      )}
      {initSearch && (
        <StyledSearchInput
          onKeyDown={(e) => e.key === "Enter" && onSearchKeyPress()}
          type="text"
          // className={`${classes.searchInput}`}
          autoFocus
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          disableUnderline
          placeholder={t("search")}
          data-testid={"search-input"}
          startAdornment={
            <InputAdornment position="start">
              <IconButton
                disabled={!searchValue}
                data-testid="execute-search-button"
              >
                <StyledSearchIcon onClick={() => onSearchKeyPress()} />
              </IconButton>
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="start">
              <ClearIcon
                sx={{ fontSize: "17px", cursor: "pointer" }}
                onClick={() => handleClose()}
                data-testid="clear-button"
              />
            </InputAdornment>
          }
        />
      )}
      {!initSearch && (
        <StyledSideIconsBox>
          <IconButton
            type="submit"
            aria-label="search"
            onClick={handleSearch}
            size="large"
            data-testid="toggle-search-button"
          >
            <StyledSearchIcon />
          </IconButton>
        </StyledSideIconsBox>
      )}
    </StyledRoot>
  );
};

export default React.memo(ToolbarListSearch);
