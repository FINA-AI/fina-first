import React, { SetStateAction, useState } from "react";
import { Autocomplete, Popper, TextField } from "@mui/material";
import { KeyboardArrowDownRounded } from "@mui/icons-material";
import { NumOfRowsPerPage } from "../../../util/appUtil";
import { styled } from "@mui/material/styles";

interface RowsPerPageProps {
  rowsPerPage: number;
  handleRowsPerPageChange: (
    page: number,
    setInput?: React.Dispatch<SetStateAction<number>>
  ) => void;
  size?: string;
}

const StyledAutocomplete = styled(Autocomplete)<{ _size?: string }>(
  ({ theme, _size }) => ({
    "& .MuiIconButton-root": {
      background: "inherit",
      border: "none !important",
    },
    "& .MuiOutlinedInput-root": {
      background: "inherit !important",
      "& fieldset": {
        border: `${(theme as any).palette.borderColor} !important`,
      },

      "&:hover fieldset": {
        borderColor:
          theme.palette.mode === "dark"
            ? "#5D789A"
            : theme.palette.primary.main,
      },
    },
    "& .MuiFormControl-root": {
      width: "64px",
      position: "relative",
      paddingRight: "20px",
      height: _size === "small" ? "22px" : "32px",
    },
    "& .MuiAutocomplete-endAdornment": {
      right: "5px !important",
      "& .MuiSvgIcon-root": {
        ...(theme as any).defaultIcon,
      },
    },
    "& .MuiOutlinedInput-input": {
      fontWeight: 500,
      fontSize: _size === "small" ? "12px" : "14px",
      lineHeight: "24px",
      color: theme.palette.mode === "dark" ? "#FFFFFF" : "#182939",
      opacity: 0.9,
      "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
        WebkitAppearance: "none",
      },
    },
    "& .MuiInputBase-root ": {
      height: "40px",
      padding: "0px 0px 0px 0px !important",
      "& .MuiAutocomplete-input": {
        padding: "0px 0px 0px 10px !important",
      },
      // Input border - focused
      "&.Mui-focused": {
        borderColor: "#2962FF",
        "&:after": {
          content: "none",
        },
        // Arrow icon - focused
        "& .MuiAutocomplete-popupIndicator": {},
      },
      "&.Mui-error": {
        borderColor: "#FF4128",
      },
    },
    "& .MuiAutocomplete-popupIndicator": {
      // Arrow icon - default
      color: "#7589A5",
      borderRadius: "1px",
      marginRight: "0px",
      // Arrow icon - hover
      "&:hover": {
        color: "#596D89 !important",
        backgroundColor: "transparent",
      },
    },
  })
);

const StyledPopper = styled(Popper)<{ _size?: string }>(({ theme, _size }) => ({
  "& .MuiAutocomplete-listbox": {
    "& .MuiAutocomplete-option": {
      fontSize: _size === "small" ? "12px !important" : "16px !important",
      "&[aria-selected='true']": {
        borderRadius: "4px",
        color: theme.palette.primary.main,
      },
    },
  },
}));

const RowsPerPage: React.FC<RowsPerPageProps> = ({
  rowsPerPage,
  handleRowsPerPageChange,
  size,
}) => {
  const options = NumOfRowsPerPage.OPTIONS;
  const [input, setInput] = useState(rowsPerPage);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      const targetElement = e.target as HTMLInputElement;
      if (targetElement) {
        handleRowsPerPageChange(Number(targetElement.value), setInput);
        targetElement.blur();
      }
    }
  };

  return (
    <StyledAutocomplete
      _size={size}
      PopperComponent={(props) => <StyledPopper {...props} _size={size} />}
      renderInput={(v) => (
        <TextField
          {...v}
          type={"number"}
          onKeyDown={(e) => handleKeyPress(e)}
        />
      )}
      onInputChange={(e, v) => {
        handleRowsPerPageChange(Number(v));
        setInput(Number(v));
      }}
      options={options}
      popupIcon={<KeyboardArrowDownRounded />}
      inputValue={String(input)}
      value={String(input)}
      disableClearable
      forcePopupIcon
      freeSolo
      size="small"
      closeText=""
      openText=""
      data-testid={"rowsPerPage"}
    />
  );
};

export default RowsPerPage;
