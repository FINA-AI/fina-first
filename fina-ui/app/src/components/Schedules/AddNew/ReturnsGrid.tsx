import { Box } from "@mui/system";
import GridTable from "../../common/Grid/GridTable";
import { FieldSize, GridColumnType } from "../../../types/common.type";
import React, { FC } from "react";
import { ReturnDefinitionType } from "../../../types/returnDefinition.type";

interface ReturnsGridProps {
  selectedRows: ReturnDefinitionType[];
  columns: GridColumnType[];
  rows: ReturnDefinitionType[];
  setRows: React.Dispatch<React.SetStateAction<ReturnDefinitionType[]>>;
  loading: boolean;
  onCheck: (row: ReturnDefinitionType, rows: ReturnDefinitionType[]) => void;
  singleSelect: boolean;
  columnFilterConfig: GridColumnType[];
  filterOnChangeFunction: (column: ReturnDefinitionType, value: any) => void;
  size?: FieldSize;
}

const ReturnsGrid: FC<ReturnsGridProps> = ({
  selectedRows,
  columns,
  rows,
  setRows,
  loading,
  onCheck,
  singleSelect,
  columnFilterConfig,
  filterOnChangeFunction,
  size = FieldSize.DEFAULT,
}) => {
  return (
    <Box overflow={"auto"} height={"100%"}>
      <GridTable
        columns={columns}
        rows={rows}
        setRows={setRows}
        selectedRows={selectedRows}
        rowOnClick={(
          row: any,
          __: any,
          selectedRows: ReturnDefinitionType[]
        ) => {
          onCheck(row, selectedRows);
        }}
        onCheckboxClick={(
          row: ReturnDefinitionType,
          rows: ReturnDefinitionType[]
        ) => {
          onCheck(row, rows);
        }}
        loading={loading}
        checkboxEnabled={true}
        virtualized={true}
        singleRowSelect={singleSelect}
        columnFilterConfig={columnFilterConfig}
        filterOnChangeFunction={filterOnChangeFunction}
        checkboxSelection={true}
        size={size}
      />
    </Box>
  );
};

export default ReturnsGrid;
