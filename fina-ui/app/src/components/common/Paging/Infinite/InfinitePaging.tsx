import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import RowsPerPage from "../RowsPerPage";
import { Typography } from "@mui/material";
import { NumOfRowsPerPage } from "../../../../util/appUtil";
import { useTranslation } from "react-i18next";
import InfinitePagination from "./InfinitePagination";

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

interface UnlimitedPagingProps {
  isMini?: boolean;
  size?: string;
  initialRowsPerPage?: number;
  initialPage: number;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  maxRowsPerPage?: number;
  minRowsPerPage?: number;
  onPageChange: (page: number) => void;
  dataQuantity: number;
}

const InfinitePaging: React.FC<UnlimitedPagingProps> = ({
  isMini = false,
  size = "default",
  initialRowsPerPage = NumOfRowsPerPage.INITIAL_ROWS_PER_PAGE,
  initialPage,
  onRowsPerPageChange,
  maxRowsPerPage = NumOfRowsPerPage.MAX_ROWS_PER_PAGE,
  minRowsPerPage = NumOfRowsPerPage.MIN_ROWS_PER_PAGE,
  onPageChange,
  dataQuantity,
}) => {
  const { t } = useTranslation();

  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  useEffect(() => {
    setRowsPerPage(initialRowsPerPage);
  }, []);

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
    onRowsPerPageChange?.(input);
  };

  return (
    <StyledRootBox>
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
      <InfinitePagination
        size={size}
        initialPage={initialPage}
        onPageChange={onPageChange}
        dataQuantity={dataQuantity}
        rowsPerPage={rowsPerPage}
      />
    </StyledRootBox>
  );
};

export default InfinitePaging;
