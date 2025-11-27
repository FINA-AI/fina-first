import { Box, Button, List, TextField } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import React, { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Tooltip from "../Tooltip/Tooltip";
import { styled } from "@mui/material/styles";

interface MiniPagingProps {
  totalNumOfRows?: number;
  initialedPage: number;
  onPageChange: (page: number) => void;
  initialRowsPerPage: number;
  numberOfRowsOnPage?: number;
  isInfinitePaging?: boolean;
}

const StyledField = styled(TextField)<{
  error: boolean;
}>(({ error }) => ({
  "& .MuiInputBase-root": {
    height: "40px",
    width: "55px",
  },
  paddingRight: "6px",
  "& .MuiInputBase-input": {
    textAlign: "center",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: `1px solid ${error ? "red" : "rgba(0, 0, 0, 0.05)"} !important`,
  },
  "& .MuiOutlinedInput-input": {
    padding: "0!important",
  },
}));

const StyledRootBox = styled(Box)(() => ({
  display: "flex",
  overflow: "hidden",
  flexFlow: "row wrap",
  alignItems: "center",
  justifyContent: "center",
  width: "fit-content",
  "& .MuiButton-root": {
    width: "32px !important",
    height: "32px !important",
  },
  fontSize: "14px",
}));

const StyledList = styled(List)(({ theme }: any) => ({
  display: "inline-flex",
  paddingTop: "0px !important",
  paddingBottom: "0px !important",
  height: "32px",
  margin: "0px 6px 0px 0px !important",
  border: "unset",
  backgroundColor: theme.palette.paperBackground,
  "& .MuiOutlinedInput-input": {
    fontSize: "14px",
  },
  "& .MuiInputBase-root.MuiOutlinedInput-root": {
    height: "32px",
    margin: "inherit",
    cursor: "pointer !important",
    "&:hover": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "inherit",
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "transparent",
    },
    "&.Mui-focused": {
      "& .MuiOutlinedInput-notchedOutline": {
        border: "1px solid #182939",
      },
    },
  },
}));

const StyledOutlinedButton = styled(Button)(({ theme }: any) => ({
  border: `1px solid ${theme.palette.textFieldBorder}`,
  borderRadius: "4px",
  margin: "inherit",
  minWidth: "unset",
  width: "40px !important",
  height: "inherit",
  '&[aria-current="true"]': {
    backgroundColor: "#2962FF",
    border: "1px solid #2962FF",
    "& .MuiButton-label": {
      color: "#FFFFFF",
    },
    "&:hover": {
      "& .MuiButton-label": {
        color: "#182939",
      },
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
    backgroundColor: "transparent",
  },
  "& .MuiSvgIcon-root": {
    width: "15px",
  },
}));

const MiniPaging: React.FC<MiniPagingProps> = ({
  totalNumOfRows,
  initialedPage = 1,
  onPageChange,
  initialRowsPerPage,
  numberOfRowsOnPage,
  isInfinitePaging,
}) => {
  const [error, setError] = useState<boolean>(false);
  const [initialPage, setInitialPage] = useState<number | string>(
    initialedPage
  );
  const { t } = useTranslation();

  useEffect(() => {
    setInitialPage(initialedPage);
  }, [initialedPage]);

  const getMaxPage = () => {
    return Math.ceil(
      (totalNumOfRows ?? 0) / (initialRowsPerPage ? initialRowsPerPage : 25)
    );
  };

  const checkPageNumber = (value: number) => {
    return value <= getMaxPage();
  };

  const changePage = (value: number) => {
    if (!isInfinitePaging) {
      if (value > 0 && checkPageNumber(value)) {
        setError(false);
        onPageChange(value);
      } else {
        setError(true);
      }
    } else {
      onPageChange(value);
    }
  };

  const nextPageDisable = () => {
    return getMaxPage() > initialPage && initialPage > 0;
  };

  const changePageBtn = (type: number) => {
    const newPage = (initialPage as number) + (type === 0 ? -1 : 1);
    setInitialPage(newPage);
    changePage(newPage);
  };

  const decimalPattern = /^[]?\d*(?:[]\d*)?$/;

  const disablePage = () => {
    return numberOfRowsOnPage
      ? numberOfRowsOnPage < initialRowsPerPage
      : !nextPageDisable();
  };

  return (
    <StyledRootBox>
      <nav>
        <StyledList data-testid={"mini-paging"}>
          <StyledOutlinedButton
            variant="outlined"
            disabled={initialPage <= 1}
            onClick={() => changePageBtn(0)}
            data-testid={"previous-button"}
          >
            <ArrowBackIos style={{ color: "#687A9E", paddingLeft: "6px" }} />
          </StyledOutlinedButton>
          <Tooltip
            title={
              error && !isInfinitePaging
                ? t("maxPage", { maxPage: getMaxPage() })
                : ""
            }
          >
            <StyledField
              data-testid={"paging-text-field"}
              error={error && !isInfinitePaging}
              label={""}
              value={initialPage}
              variant="outlined"
              onChange={(e) => {
                decimalPattern.test(e.target.value) &&
                  setInitialPage(
                    e.target.value === "" ? "" : parseInt(e.target.value)
                  );
              }}
              onBlur={(e) => changePage(parseInt(e.target.value))}
            />
          </Tooltip>
          <StyledOutlinedButton
            variant="outlined"
            disabled={disablePage()}
            onClick={() => changePageBtn(1)}
            data-testid={"next-button"}
          >
            <ArrowForwardIos style={{ color: "#687A9E" }} />
          </StyledOutlinedButton>
        </StyledList>
      </nav>
    </StyledRootBox>
  );
};

export const MiniPagingMemo = memo(MiniPaging, (prevProps, nextProps) => {
  return (
    prevProps.initialedPage === nextProps.initialedPage &&
    prevProps.initialRowsPerPage === nextProps.initialRowsPerPage &&
    prevProps.totalNumOfRows === nextProps.totalNumOfRows
  );
});

export default MiniPaging;
