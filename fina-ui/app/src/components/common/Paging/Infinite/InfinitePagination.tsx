import React, { useEffect, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { styled } from "@mui/system";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

const StyledNumberField = styled(TextField, {
  shouldForwardProp: (prop) => prop !== "_size",
})<{ _size?: string }>(({ theme, _size }) => ({
  "& .MuiOutlinedInput-root": {
    width: "70px",
    height: _size === "small" ? "22px" : "32px",
    backgroundColor: "inherit",
    "& fieldset": {
      borderColor: theme.palette.borderColor || theme.palette.primary.main,
    },
    "&:hover fieldset": {
      borderColor:
        theme.palette.mode === "dark" ? "#5D789A" : theme.palette.primary.main,
    },
  },
  "& .MuiOutlinedInput-input": {
    fontWeight: 500,
    fontSize: _size === "small" ? "12px" : "14px",
    lineHeight: "24px",
    color: theme.palette.mode === "dark" ? "#FFFFFF" : "#182939",
    opacity: 0.9,
    textAlign: "center",
    "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
      WebkitAppearance: "none",
    },
  },
}));

const sharedStyles = (theme: any) => ({
  "&.Mui-disabled": {
    borderColor: theme.palette.mode === "dark" ? "#2D3747" : "inherit",
  },
  padding: "0px 15px",
  border: `1px solid ${theme.palette.textFieldBorder}`,
  borderRadius: "4px",
  margin: "inherit",
  minWidth: "unset",
  height: "inherit",
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#182939",
  fontWeight: 500,
  lineHeight: "24px",
  '&[aria-current="true"]': {
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.mode === "dark" ? "#2D3747" : "#FFFFFF",
    "&:hover": {
      "& .MuiButton-label": {
        color: "#182939",
      },
      backgroundColor: theme.palette.buttons.primary.hover,
    },
  },
  "& .MuiButton-label": {
    color: "#182939",
    fontSize: "14px !important",
  },
  "& .MuiTouchRipple-root": {
    color: "transparent",
  },
  "&:hover": {
    border: `1px solid ${
      theme.palette.mode === "dark" ? "#2D3747" : theme.palette.primary.main
    }`,
    backgroundColor: theme.palette.mode === "dark" ? "#344258" : "transparent",
  },
  "& .MuiSvgIcon-root": {
    width: "15px",
    fontSize: "14px",
  },
});

const StyledOutlinedButton = styled(Button, {
  shouldForwardProp: (props) => props !== "isDisabled",
})<{
  _size?: string;
  isDisabled: boolean;
}>(({ theme, _size, isDisabled }) => ({
  ...sharedStyles(theme),
  padding: _size === "small" ? "0px 10px" : "0px 15px",
  width: "20px",
  fontSize: _size === "small" ? "12px" : "14px",
  border: (theme as any).palette.borderColor,
  cursor: !isDisabled ? "pointer" : "default",
  pointerEvents: !isDisabled ? "auto" : "none",
  ...(!isDisabled && {
    "&:hover": {
      border: `1px solid ${
        theme.palette.mode === "dark" ? "#5D789A" : theme.palette.primary.main
      }`,
    },
  }),
}));

interface UnlimitedPaginationProps {
  size?: string;
  initialPage: number;
  onPageChange: (page: number) => void;
  dataQuantity: number;
  rowsPerPage: number;
}

const InfinitePagination: React.FC<UnlimitedPaginationProps> = ({
  size = "default",
  initialPage,
  onPageChange,
  dataQuantity,
  rowsPerPage,
}) => {
  const [pageNumeration, setPageNumeration] = useState<number | undefined>(
    initialPage
  );

  useEffect(() => {
    setPageNumeration(initialPage);
  }, [initialPage]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      const targetElement = e.target as HTMLInputElement;
      if (targetElement) {
        onPageChange(Number(targetElement.value));
        targetElement.blur();
      }
    }
  };

  const changePageNumeration = (direction: string) => {
    let changedPage;
    if (direction === "prev") {
      changedPage =
        pageNumeration && pageNumeration !== 1
          ? pageNumeration - 1
          : pageNumeration;
    } else {
      changedPage = pageNumeration && pageNumeration + 1;
    }
    if (changedPage) {
      setPageNumeration(changedPage);
      onPageChange(changedPage);
    }
  };

  return (
    <Box sx={{ display: "flex", gap: "5px" }}>
      <StyledOutlinedButton
        variant="outlined"
        isDisabled={pageNumeration === 1}
        _size={size}
        onClick={() => !(pageNumeration === 1) && changePageNumeration("prev")}
      >
        <ArrowBackIos style={{ color: "#687A9E", paddingLeft: "6px" }} />
      </StyledOutlinedButton>
      <StyledNumberField
        _size={size}
        type={"number"}
        onKeyDown={(e) => handleKeyPress(e)}
        onChange={(e) => {
          const inputValue = Number(e.target.value);
          if (inputValue > 0) {
            setPageNumeration(inputValue);
          }
        }}
        onBlur={(e) => {
          const inputValue = Number(e.target.value);
          onPageChange(inputValue > 0 ? inputValue : initialPage);
        }}
        value={pageNumeration}
      />
      <StyledOutlinedButton
        variant="outlined"
        isDisabled={dataQuantity < rowsPerPage}
        _size={size}
        sx={{ marginRight: "6px" }}
        onClick={() => changePageNumeration("next")}
      >
        <ArrowForwardIos style={{ color: "#5D789A" }} />
      </StyledOutlinedButton>
    </Box>
  );
};

export default InfinitePagination;
