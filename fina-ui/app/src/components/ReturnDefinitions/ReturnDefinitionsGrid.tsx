import { Grid } from "@mui/material";
import GridTable from "../common/Grid/GridTable";
import ReturnDefinitionsDetails from "./ReturnDefinitionsDetails";
import { Box } from "@mui/system";
import Paging from "../common/Paging/Paging";
import React from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import {
  ReturnDefinitionTable,
  ReturnDefinitionType,
  ReturnType,
} from "../../types/returnDefinition.type";
import {
  columnFilterConfigType,
  FilterType,
  GridColumnType,
} from "../../types/common.type";

interface Props {
  rows: ReturnDefinitionType[];
  setRows: (rows: ReturnDefinitionType[]) => void;
  columns: GridColumnType[];
  loading: boolean;
  initReturnDefinitionsTable: (row?: ReturnDefinitionType) => void;
  setIsDetailPageOpen: (value: boolean) => void;
  setSelectedRows: (rows: ReturnDefinitionType[]) => void;
  columnFilterConfig: columnFilterConfigType[];
  filterOnChangeFunction: (obj: FilterType) => void;
  isDetailPageOpen: boolean;
  currentReturnDefinition: ReturnDefinitionType;
  setCurrentReturnDefinition: (rd: ReturnDefinitionType | {}) => void;
  GeneralInfoEditMode: boolean;
  setGeneralInfoEditMode: (value: boolean) => void;
  saveReturnDefinition: (data: ReturnDefinitionType) => void;
  returnTypes: ReturnType[];
  tables: ReturnDefinitionTable[];
  setTables: (tables: ReturnDefinitionTable[]) => void;
  onPagingLimitChange: (limit: number) => void;
  totalResults: number;
  pagingPage: number;
  pagingLimit: number;
  selectedRows: ReturnDefinitionType[];
  orderRowByHeader: (cellName: string, arrowDirection: string) => void;
  onPageChange: (pageNum: number) => void;
  reorderReturnDefinitionTables: VoidFunction;
  scrollToIndex: number;
  actionButtons(row: ReturnDefinitionType, index: number): JSX.Element;
}

const StyledGridContainer = styled(Grid)({
  marginTop: "0px",
  paddingTop: "0px",
  position: "relative",
  overflow: "hidden",
  display: "flex",
  height: "100%",
});

const StyledPaper = styled(Paper)({
  width: "100%",
  height: "100%",
  boxShadow: "none",
});

const StyledFooterRoot = styled(Box)(({ theme }: { theme: any }) => ({
  height: theme.general.footerHeight,
  boxShadow: "3px -20px 8px -4px #BABABA1A",
  display: "flex",
  alignItems: "center",
  justifyContent: "end",
  borderTop: theme.palette.borderColor,
  background: theme.palette.paperBackground,
}));

const StyledFooterGrid = styled(Grid)(({ theme }: { theme: any }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "end",
  height: theme.general.footerHeight,
}));

const ReturnDefinitionsGrid: React.FC<Props> = ({
  rows,
  setRows,
  columns,
  loading,
  initReturnDefinitionsTable,
  setIsDetailPageOpen,
  setSelectedRows,
  actionButtons,
  columnFilterConfig,
  filterOnChangeFunction,
  isDetailPageOpen,
  currentReturnDefinition,
  setCurrentReturnDefinition,
  GeneralInfoEditMode,
  setGeneralInfoEditMode,
  saveReturnDefinition,
  returnTypes,
  tables,
  setTables,
  onPagingLimitChange,
  totalResults,
  pagingPage,
  pagingLimit,
  selectedRows,
  orderRowByHeader,
  reorderReturnDefinitionTables,
  onPageChange,
  scrollToIndex,
}) => {
  return (
    <>
      <StyledGridContainer>
        <Grid sx={{ paddingTop: "0px", height: "100%", width: "100%" }}>
          <StyledPaper>
            <GridTable
              rows={rows}
              setRows={setRows}
              columns={columns}
              loading={loading}
              rowOnClick={(
                row: ReturnDefinitionType,
                deselect: boolean,
                clickedRows: ReturnDefinitionType[]
              ) => {
                setGeneralInfoEditMode(false);
                initReturnDefinitionsTable(row);
                setIsDetailPageOpen(!deselect);
                setSelectedRows(clickedRows);
              }}
              onCheckboxClick={(
                row: ReturnDefinitionType,
                checkedRows: ReturnDefinitionType[]
              ) => {
                setSelectedRows(checkedRows);
              }}
              checkboxEnabled={true}
              actionButtons={actionButtons}
              columnFilterConfig={columnFilterConfig}
              filterOnChangeFunction={filterOnChangeFunction}
              selectedRows={selectedRows}
              orderRowByHeader={orderRowByHeader}
              scrollToIndex={scrollToIndex}
            />
          </StyledPaper>
          <StyledPaper className="relative-paper">
            <ReturnDefinitionsDetails
              isDetailPageOpen={isDetailPageOpen}
              setIsDetailPageOpen={setIsDetailPageOpen}
              currentReturnDefinition={currentReturnDefinition}
              setCurrentReturnDefinition={setCurrentReturnDefinition}
              GeneralInfoEditMode={GeneralInfoEditMode}
              setGeneralInfoEditMode={setGeneralInfoEditMode}
              saveReturnDefinition={saveReturnDefinition}
              returnTypes={returnTypes}
              tables={tables}
              setTables={setTables}
              reorderReturnDefinitionTables={reorderReturnDefinitionTables}
            />
          </StyledPaper>
        </Grid>
      </StyledGridContainer>
      <StyledFooterRoot>
        <StyledFooterGrid>
          <Paging
            onRowsPerPageChange={(number) => onPagingLimitChange(number)}
            onPageChange={(number) => onPageChange(number)}
            totalNumOfRows={totalResults}
            initialPage={pagingPage}
            initialRowsPerPage={pagingLimit}
          />
        </StyledFooterGrid>
      </StyledFooterRoot>
    </>
  );
};

export default ReturnDefinitionsGrid;
