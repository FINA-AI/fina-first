import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import RowsPerPage from "./RowsPerPage";
import Pagination from "./Pagination";
import {
  INITIAL_PAGINATION_PAGE,
  MiniPagination,
  NumOfRowsPerPage,
} from "../../../util/appUtil";
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";

interface PagingProps {
  isMini?: boolean;
  onPageChange: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  totalNumOfRows: number;
  initialRowsPerPage?: number;
  maxRowsPerPage?: number;
  minRowsPerPage?: number;
  visibilityLimit?: number;
  initialPage?: number;
  size?: string;
}

const StyledRootBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  width: "fit-content",
  float: "right",
}));

const StyledLabel = styled(Typography)<{ size: string }>(({ size }) => ({
  paddingRight: "20px",
  fontSize: size === "small" ? "11px" : "13px",
  fontWeight: 500,
}));

const Paging: React.FC<PagingProps> = ({
  isMini = false,
  onPageChange,
  onRowsPerPageChange,
  totalNumOfRows,
  initialRowsPerPage = NumOfRowsPerPage.INITIAL_ROWS_PER_PAGE,
  maxRowsPerPage = NumOfRowsPerPage.MAX_ROWS_PER_PAGE,
  minRowsPerPage = NumOfRowsPerPage.MIN_ROWS_PER_PAGE,
  visibilityLimit = MiniPagination.VISIBILITY_LIMIT,
  initialPage = INITIAL_PAGINATION_PAGE,
  size = "default",
}) => {
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [numOfPages, setNumOfPages] = useState(
    Math.ceil(totalNumOfRows / rowsPerPage)
  );

  const { t } = useTranslation();
  useEffect(() => {
    setRowsPerPage(initialRowsPerPage);
    setNumOfPages(Math.ceil(totalNumOfRows / rowsPerPage));
  }, [totalNumOfRows]);

  const validate = (input: number) => {
    if (input < minRowsPerPage) {
      return minRowsPerPage;
    } else if (input > maxRowsPerPage) {
      return maxRowsPerPage;
    } else {
      return input;
    }
  };
  const handleRowsPerPageChange = (input: number) => {
    input = validate(input);
    setRowsPerPage(input);
    setNumOfPages(Math.ceil(totalNumOfRows / input));
    onRowsPerPageChange?.(input);
  };
  return (
    <StyledRootBox data-testid={"paging-controls"}>
      {!isMini ? (
        <>
          <StyledLabel size={size}>{t("rowsPerPage") + ":"}</StyledLabel>
          <RowsPerPage
            rowsPerPage={rowsPerPage}
            handleRowsPerPageChange={handleRowsPerPageChange}
            size={size}
          />
        </>
      ) : (
        <></>
      )}
      <Pagination
        isMini={isMini}
        count={numOfPages}
        initialPage={initialPage}
        onPageChange={onPageChange}
        visibilityLimit={visibilityLimit}
        size={size}
      />
    </StyledRootBox>
  );
};
export default React.memo(Paging, (prevProps: any, nextProps: any) => {
  return (
    prevProps.totalNumOfRows === nextProps.totalNumOfRows &&
    prevProps.initialPage === nextProps.initialPage &&
    prevProps.initialRowsPerPage === nextProps.initialRowsPerPage
  );
});
