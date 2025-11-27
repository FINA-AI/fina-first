import { Grid } from "@mui/material";
import GridTable from "../common/Grid/GridTable";
import Paging from "../common/Paging/Paging";
import React from "react";
import { Box } from "@mui/system";
import {
  columnFilterConfigType,
  FilterType,
  GridColumnType,
} from "../../types/common.type";
import { BundlesDataType } from "../../types/bundles.type";
import { styled } from "@mui/material/styles";

interface BundlesMainTableProps {
  columns: GridColumnType[];
  bundles: BundlesDataType[];
  columnFilterConfig: columnFilterConfigType[];
  filterOnChangeFunction: (filterConfig: FilterType[]) => void;
  onPagingLimitChange: (limit: number) => void;
  pagingPage: number;
  pagingLimit: number;
  totalRows: number;
  onPageChange: (page: number) => void;
  loading: boolean;
  orderRowByHeader: (fieldName: string, direction: string) => void;
  scrollToIndex: number;
}

const StyledRoot = styled(Box)(({ theme }: any) => ({
  ...theme.pageContent,
}));

const StyledGridContainer = styled(Grid)({
  marginTop: 0,
  paddingTop: 0,
  position: "relative",
  overflow: "hidden",
  display: "flex",
  height: "100%",
});

const StylePagesContainer = styled(Grid)(({ theme }: any) => ({
  ...theme.pagePaging({ size: "default" }),
}));

const StyledContent = styled(Grid)({
  paddingTop: 0,
  height: "100%",
  width: "100%",
});
const BundlesMainTable: React.FC<BundlesMainTableProps> = ({
  columns,
  bundles,
  columnFilterConfig,
  filterOnChangeFunction,
  onPagingLimitChange,
  pagingPage,
  pagingLimit,
  onPageChange,
  totalRows,
  loading,
  orderRowByHeader,
  scrollToIndex,
}) => {
  return (
    <StyledRoot>
      <StyledGridContainer>
        <StyledContent flex={1}>
          <GridTable
            columns={columns}
            rows={bundles}
            disableRowSelection={true}
            columnFilterConfig={columnFilterConfig}
            filterOnChangeFunction={filterOnChangeFunction}
            loading={loading}
            orderRowByHeader={orderRowByHeader}
            scrollToIndex={scrollToIndex}
          />
        </StyledContent>
      </StyledGridContainer>
      <StylePagesContainer>
        <Paging
          onRowsPerPageChange={(number) => onPagingLimitChange(number)}
          onPageChange={(number) => onPageChange(number)}
          totalNumOfRows={totalRows}
          initialPage={pagingPage}
          initialRowsPerPage={pagingLimit}
        />
      </StylePagesContainer>
    </StyledRoot>
  );
};

export default BundlesMainTable;
