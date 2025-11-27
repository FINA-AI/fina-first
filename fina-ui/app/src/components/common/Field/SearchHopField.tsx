import { IconButton, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/system";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { styled } from "@mui/material/styles";

interface SearchHopFieldProps {
  defaultSearchValue?: string;
  placeholder?: string;
  onSearchChange: (val: string) => void;
  onClear: () => void;
  searchedTotalResult: number;
  onNextHopClick: (val: number) => void;
}

const StyledTextField = styled(TextField)(({ theme }: any) => ({
  width: "300px",
  "& .MuiOutlinedInput-input": {
    paddingTop: "0px!important",
    paddingBottom: "0px!important",
    minHeight: "30px !important",
    fontSize: "14px !important",
    paddingLeft: "34px",
    ...theme.inputValue,
  },
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
  "& .MuiInputBase-adornedStart": {
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark" ? "rgb(0 0 0 / 5%)" : "#F9F9F9",
    },
  },
  "& .MuiSvgIcon-root": {
    "&:nth-child(1)": {
      position: "absolute",
      color: theme.palette.mode === "dark" ? "#596D89" : "#ABBACE",
    },
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.btn.borderRadius,
    padding: "0px",
  },
  "& input::placeholder": {
    color: theme.palette.mode === "light" ? "#596D89" : "#ABBACE",
  },
  paddingRight: 8,
}));

const StyledSearchIcon = styled(SearchIcon)(({ theme }: any) => ({
  ...theme.defaultIcon,
  margin: "4px 4px 4px 8px",
  color: "#8695B1",
}));

const StyledClearRoundedIcon = styled(ClearRoundedIcon)(({ theme }: any) => ({
  marginRight: 8,
  ...theme.smallIcon,
  color: "#C3CAD8",
  cursor: "pointer",
}));

const StyledKeyboardArrowUpIcon = styled(KeyboardArrowUpIcon)(
  ({ theme }: any) => ({
    ...theme.smallIcon,
    cursor: "pointer",
  })
);

const StyledKeyboardArrowDownIcon = styled(KeyboardArrowDownIcon)(
  ({ theme }: any) => ({
    ...theme.smallIcon,
    cursor: "pointer",
  })
);

const StyledCountText = styled("span")(() => ({
  color: "#596D89",
  fontWeight: 400,
  fontSize: "11px",
  lineHeight: "16px",
}));

const SearchHopField: React.FC<SearchHopFieldProps> = ({
  defaultSearchValue,
  placeholder,
  onSearchChange,
  onClear,
  searchedTotalResult = 0,
  onNextHopClick,
  ...props
}) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState(defaultSearchValue);
  const [activeStep, setActiveStep] = useState(0);
  const [activeArrowButtons, setActiveArrowButtons] = useState({
    next: false,
    prev: false,
  });

  useEffect(() => {
    onArrowChange();
  }, [activeStep, searchValue]);

  useEffect(() => {
    if (searchValue && searchedTotalResult !== 0) {
      setActiveStep(1);
    } else {
      setActiveStep(0);
    }
  }, [searchedTotalResult]);

  const textFieldOnChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    let val = event.target.value;
    if (onSearchChange) {
      onSearchChange(val);
    }
    setSearchValue(val);
  };

  const onClearValue = () => {
    setSearchValue("");
    if (onClear) {
      onClear();
    }
    setActiveArrowButtons({
      next: false,
      prev: false,
    });
  };

  const onNext = () => {
    if (activeStep + 1 > searchedTotalResult) {
      return;
    }

    setActiveStep(activeStep + 1);
    onNextHopClick(activeStep + 1);
  };

  const onPrev = () => {
    if (activeStep - 1 < 0) {
      return;
    }

    setActiveStep(activeStep - 1);
    onNextHopClick(activeStep - 1);
  };

  const onArrowChange = () => {
    let next = false;
    let prev = false;

    if (searchedTotalResult > 1) {
      next = activeStep !== searchedTotalResult;
      prev = activeStep !== 1;
    }

    setActiveArrowButtons({ next, prev });
  };

  const handleEnterKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      onNext();
    }
  };

  return (
    <Box display={"flex"}>
      <StyledTextField
        type={"text"}
        InputLabelProps={{
          shrink: true,
        }}
        value={searchValue}
        placeholder={placeholder ? placeholder : t("search")}
        {...props}
        onChange={(event) => textFieldOnChange(event)}
        onKeyDown={handleEnterKeyPress}
        data-testid={"search-hop-field"}
        InputProps={{
          startAdornment: <StyledSearchIcon />,
          endAdornment: searchValue && (
            <>
              <StyledCountText>{`${activeStep}/${searchedTotalResult}`}</StyledCountText>
              <IconButton
                onClick={() => onPrev()}
                disabled={!activeArrowButtons.prev}
                data-testid={"prev-button"}
              >
                <StyledKeyboardArrowUpIcon
                  style={{
                    color: activeArrowButtons.prev ? "#AEB8CB" : "#DFDFDF",
                  }}
                />
              </IconButton>
              <IconButton
                onClick={() => onNext()}
                disabled={!activeArrowButtons.next}
                data-testid={"next-button"}
              >
                <StyledKeyboardArrowDownIcon
                  style={{
                    color: activeArrowButtons.next ? "#AEB8CB" : "#DFDFDF",
                  }}
                />
              </IconButton>
              <StyledClearRoundedIcon
                onClick={() => onClearValue()}
                data-testid={"clear-button"}
              />
            </>
          ),
        }}
      />
    </Box>
  );
};

export default SearchHopField;
