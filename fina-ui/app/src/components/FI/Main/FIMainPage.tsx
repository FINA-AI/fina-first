import Grid from "@mui/material/Grid";
import FIHeader from "./FIHeader";
import FITable from "./FITable";
import Paging from "../../common/Paging/Paging";
import FIToolbar from "./Toolbar/FIToolbar";
import React, { memo, useState } from "react";
import FiImportProgress from "./Toolbar/FiImportProgess";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import { FiDataType, FiTypeDataType } from "../../../types/fi.type";
import {
  columnFilterConfigType,
  GridColumnType,
} from "../../../types/common.type";

/* eslint-disable react/prop-types */

interface FIMainPageProps {
  reloadFi: (data: FiDataType) => void;
  deleteSelectedRows: () => void;
  cancelSelectedRows: () => void;
  selectedRowsLen: () => number;
  fiTypes: FiTypeDataType[];
  selectedFIType?: FiTypeDataType;
  setSelectedFiType: React.Dispatch<
    React.SetStateAction<FiTypeDataType | undefined>
  >;
  columns: GridColumnType[];
  columnFilterConfig: columnFilterConfigType[];
  rows: FiDataType[];
  setRows: React.Dispatch<React.SetStateAction<FiDataType[]>>;
  selectedRows: FiDataType[];
  setSelectedRows: React.Dispatch<React.SetStateAction<FiDataType[]>>;
  setActivePage: React.Dispatch<React.SetStateAction<number>>;
  setRowPerPage: (limit: number) => void;
  catalogLength: number;
  pagingPage: number;
  initialRowsPerPage: number;
  deleteFIFunction: (row: FiDataType) => void;
  activeFIMainToolbar: boolean;
  FilterOnChangeFunction: (filters: columnFilterConfigType[]) => void;
  loading: boolean;
  loader: boolean;
  isDefault: boolean;
  countedFis: any;
  setColumns: React.Dispatch<React.SetStateAction<GridColumnType[]>>;
  onExport: (selectedRows: FiDataType[]) => void;
  loadFisByTypeFunction: (id: number, filter?: any) => void;
  orderRowByHeader: (
    cellName: keyof FiDataType,
    arrowDirection: string
  ) => void;
}

const StyledContentContainer = styled(Grid)({
  backgroundColor: "inherit",
  borderRadius: "4px",
  height: "100%",
  boxSizing: "border-box",
  paddingBottom: 142,
});

const StyledPagingContainer = styled(Box)(({ theme }) => ({
  boxShadow: "3px -20px 8px -4px #BABABA1A",
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "end",
  padding: "8px 16px",
  backgroundColor: theme.palette.mode === "dark" ? "#2B3748" : "#ffffff",
}));

const FIMainPage: React.FC<FIMainPageProps> = memo(
  ({
    reloadFi,
    fiTypes,
    selectedFIType,
    setSelectedFiType,
    columns,
    columnFilterConfig,
    rows,
    setRows,
    selectedRows,
    setSelectedRows,
    setActivePage,
    setRowPerPage,
    catalogLength,
    pagingPage,
    initialRowsPerPage,
    deleteFIFunction,
    isDefault,
    activeFIMainToolbar,
    selectedRowsLen,
    deleteSelectedRows,
    cancelSelectedRows,
    FilterOnChangeFunction,
    loading,
    loader,
    countedFis,
    setColumns,
    onExport,
    loadFisByTypeFunction,
    orderRowByHeader,
  }) => {
    const [importProgressActive, setImportProgressActive] = useState(false);
    const [importProgress, setImportProgress] = useState(-1);

    const GridPaging = () => (
      <Paging
        onRowsPerPageChange={(number) => setRowPerPage(number)}
        onPageChange={(number) => setActivePage(number)}
        totalNumOfRows={catalogLength}
        initialPage={pagingPage}
        initialRowsPerPage={initialRowsPerPage}
      />
    );

    return (
      <>
        <Grid
          container
          spacing={0}
          overflow="hidden"
          height="100%"
          borderRadius="4px"
          data-tsetid={"fi-main-page"}
        >
          <Grid item xs={12}>
            <FIHeader />
          </Grid>
          <StyledContentContainer item xs={12}>
            <FIToolbar
              fiTypes={fiTypes}
              columns={columns}
              selectedFIType={selectedFIType}
              setSelectedFiType={setSelectedFiType}
              isDefault={isDefault}
              activeFIMainToolbar={activeFIMainToolbar}
              selectedRowsLen={selectedRowsLen}
              onDeleteMultipleRowsClick={deleteSelectedRows}
              cancelSelectedRows={cancelSelectedRows}
              reloadFi={reloadFi}
              countedFis={countedFis}
              setColumns={setColumns}
              onExport={() => onExport(selectedRows)}
              loadFisByTypeFunction={loadFisByTypeFunction}
              setImportProgressActive={setImportProgressActive}
              setImportProgress={setImportProgress}
            />
            <FITable
              columns={columns}
              columnFilterConfig={columnFilterConfig}
              rows={rows}
              setRows={setRows}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              deleteFIFunction={deleteFIFunction}
              FilterOnChangeFunction={FilterOnChangeFunction}
              loading={loader}
              skeletonLoading={loading}
              orderRowByHeader={orderRowByHeader}
            />
            <StyledPagingContainer>
              <GridPaging />
            </StyledPagingContainer>
          </StyledContentContainer>
        </Grid>
        {importProgressActive && (
          <FiImportProgress
            importProgress={importProgress}
            loading={importProgressActive}
          />
        )}
      </>
    );
  }
);

export default FIMainPage;
