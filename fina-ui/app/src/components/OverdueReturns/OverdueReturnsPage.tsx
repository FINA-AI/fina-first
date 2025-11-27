import { Box } from "@mui/system";
import React from "react";
import { Grid, IconButton, Paper } from "@mui/material";
import Paging from "../common/Paging/Paging";
import GridTable from "../common/Grid/GridTable";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import TableCustomizationButton from "../common/Button/TableCustomizationButton";
import { OVERDUE_RETUNRS_TABLE_KEY } from "../../api/TableCustomizationKeys";
import { styled } from "@mui/material/styles";
import {
  columnFilterConfigType,
  GridColumnType,
} from "../../types/common.type";
import { OverdueReturn } from "../../types/return.type";

interface OverdueReturnsPageProps {
  pagingPage: number;
  pagingLimit: number;
  onPagingLimitChange: (limit: number) => void;
  setPagingPage: (page: number) => void;
  columns: GridColumnType[];
  rows: OverdueReturn[];
  loading: boolean;
  filterOnChangeFunction: (obj: any) => void;
  setRows: (rows: OverdueReturn[]) => void;
  onExport: VoidFunction;
  totalResults: number;
  columnFilterConfig: columnFilterConfigType[];
  setColumns: (columns: GridColumnType[]) => void;
  orderRowByHeader(cellName: string, arrowDirection: string): void;
}

const StyledRoot = styled(Grid)(({ theme }: { theme: any }) => ({
  ...theme.pageContent,
  backgroundColor: theme.palette.paperBackground,
}));

const StyledHeader = styled(Grid)(({ theme }: { theme: any }) => ({
  ...theme.pageToolbar,
  justifyContent: "flex-end",
  borderBottom: theme.palette.borderColor,
}));

const StyledGridContainer = styled(Grid)({
  marginTop: 0,
  paddingTop: 0,
  position: "relative",
  overflow: "hidden",
  display: "flex",
  height: "100%",
});

const StyledFooterRoot = styled(Box)(({ theme }: { theme: any }) => ({
  height: theme.general.footerHeight,
  boxShadow: "3px -20px 8px -4px #BABABA1A",
  display: "flex",
  alignItems: "center",
  justifyContent: "end",
  borderTop: theme.palette.borderColor,
}));

const StyledFooterGrid = styled(Grid)(({ theme }: { theme: any }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "end",
  height: theme.general.footerHeight,
}));

const StyledIconButton = styled(IconButton)(({ theme }: { theme: any }) => ({
  height: 32,
  width: 32,
  borderRadius: 50,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginRight: 10,
  "& .MuiSvgIcon-root": {
    ...theme.smallIcon,
  },
}));

const OverdueReturnsPage: React.FC<OverdueReturnsPageProps> = ({
  pagingPage,
  pagingLimit,
  onPagingLimitChange,
  setPagingPage,
  columns,
  columnFilterConfig,
  rows,
  loading,
  filterOnChangeFunction,
  setRows,
  onExport,
  totalResults,
  orderRowByHeader,
  setColumns,
}) => {
  return (
    <StyledRoot>
      <StyledHeader>
        <StyledIconButton onClick={onExport}>
          <FileDownloadIcon fontSize={"small"} />
        </StyledIconButton>
        <span>
          <TableCustomizationButton
            columns={columns}
            setColumns={setColumns}
            isDefault={false}
            hasColumnFreeze={true}
            tableKey={OVERDUE_RETUNRS_TABLE_KEY}
          />
        </span>
      </StyledHeader>
      <StyledGridContainer>
        <Paper sx={{ width: "100%", height: "100%", boxShadow: "none" }}>
          <GridTable
            rows={rows}
            setRows={setRows}
            columns={columns}
            columnFilterConfig={columnFilterConfig}
            loading={loading}
            rowOnClick={() => {}}
            checkboxEnabled={false}
            selectedRows={[]}
            filterOnChangeFunction={filterOnChangeFunction}
            orderRowByHeader={orderRowByHeader}
          />
        </Paper>
      </StyledGridContainer>
      <StyledFooterRoot>
        <StyledFooterGrid>
          <Paging
            onRowsPerPageChange={(number) => onPagingLimitChange(number)}
            onPageChange={(number) => setPagingPage(number)}
            totalNumOfRows={totalResults}
            initialPage={pagingPage}
            initialRowsPerPage={pagingLimit}
          />
        </StyledFooterGrid>
      </StyledFooterRoot>
    </StyledRoot>
  );
};

export default OverdueReturnsPage;
