import React, { useState } from "react";
import { Button } from "@mui/material";
import List from "@mui/material/List";
import { usePagination } from "@mui/lab";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import MiniNavigation from "./MiniNavigation";
import { PaginationTypes } from "../../../util/appUtil";
import { styled } from "@mui/material/styles";

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

interface PaginationProps {
  isMini: boolean;
  count: number;
  initialPage: number;
  onPageChange: (page: number) => void;
  visibilityLimit?: number;
  size?: string;
}

const StyledOutlinedButton = styled(Button, {
  shouldForwardProp: (props) => props !== "isOutlined",
})<{
  _size?: string;
  isOutlined: boolean;
}>(({ theme, _size, isOutlined }) => ({
  ...sharedStyles(theme),
  padding: _size === "small" ? "0px 10px" : "0px 15px",
  width: isOutlined ? "20px" : "fit-content !important",
  fontSize: _size === "small" ? "12px" : "14px",
  border: (theme as any).palette.borderColor,
  ...(isOutlined && {
    "&:hover": {
      border: `1px solid ${
        theme.palette.mode === "dark" ? "#5D789A" : theme.palette.primary.main
      }`,
    },
  }),
}));

const StyledRootList = styled(List)<{ size?: string }>(({ size, theme }) => ({
  backgroundColor: (theme as any).palette.paperBackground,
  display: "inline-flex",
  paddingTop: "0px !important",
  paddingBottom: "0px !important",
  height: size === "default" ? "32px" : "22px",
  margin: "0px 6px 0px 0px !important",
  border: "unset",
  "& .MuiInputBase-root.MuiOutlinedInput-root": {
    margin: "inherit",
    cursor: "pointer !important",
    background: "inherit",
    border: "none",
    width: "32px",
    "&:hover": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor:
          theme.palette.mode === "dark"
            ? "#2D3747"
            : theme.palette.primary.main,
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "transparent",
    },
    "&.Mui-focused": {
      "& .MuiOutlinedInput-notchedOutline": {
        border: `1px solid ${
          theme.palette.mode === "dark" ? "#5D789A" : theme.palette.primary.main
        }`,
      },
    },
  },
}));

const Pagination: React.FC<PaginationProps> = ({
  isMini,
  count,
  initialPage,
  onPageChange,
  visibilityLimit,
  size,
}) => {
  const [localOptions, setLocalOptions] = useState<number[]>([]);

  const siblingCount = (page: number, count: number) => {
    if (isMini) return 0;
    if (page === 3 || page === count - 2) return 0.5;
    return page <= 2 || page >= count - 1 ? 0 : 1;
  };

  const { items } = usePagination({
    count: count === 0 ? 1 : count,
    page: initialPage,
    siblingCount: siblingCount(initialPage, count),
    onChange: (e, v) => {
      if (v >= 1 && v <= count) {
        onPageChange(v);
      }
    },
  });

  const handleOnClick = (page: number) => {
    if (page) {
      onPageChange(page);
    }
  };
  type PaginationValue = number | React.ReactElement | null;

  const checkStepWidth = (type: string, value: PaginationValue): boolean => {
    if (type === PaginationTypes.PAGE && typeof value === "number") {
      return value.toString().length > 3;
    }
    return false;
  };

  return (
    <nav>
      <StyledRootList size={size} data-testid={"pagination"}>
        {items.map(({ page, type, ...item }, index) => {
          let value = null;
          let testId = "";

          switch (type) {
            case PaginationTypes.PAGE:
              value = page;
              testId = "page-" + page;
              break;
            case PaginationTypes.NEXT:
              value = <ArrowForwardIos style={{ color: "#5D789A" }} />;
              testId = "next";
              break;
            case PaginationTypes.PREVIOUS:
              value = (
                <ArrowBackIos
                  style={{ color: "#687A9E", paddingLeft: "6px" }}
                />
              );
              testId = "previous";
              break;
            case PaginationTypes.START_ELLIPSIS:
            case PaginationTypes.END_ELLIPSIS:
              const lowerBound = (items[index - 1]?.page as number) + 1;
              const upperBound = items[index + 1]?.page as number;

              return (
                <MiniNavigation
                  key={index}
                  index={index}
                  lowerBound={lowerBound}
                  upperBound={upperBound}
                  items={items}
                  type={type}
                  visibilityLimit={visibilityLimit}
                  localOptions={localOptions}
                  setLocalOptions={setLocalOptions}
                  handleOnClick={handleOnClick}
                  count={count}
                />
              );
            default:
              break;
          }

          return (
            <StyledOutlinedButton
              {...item}
              key={`pagination-item-${index}`}
              variant="outlined"
              isOutlined={!checkStepWidth(type, value)}
              _size={size}
              data-testid={testId + "-button"}
            >
              {value}
            </StyledOutlinedButton>
          );
        })}
      </StyledRootList>
    </nav>
  );
};

export default Pagination;
