import React, { useMemo, useRef, useState } from "react";
import TableHead from "@mui/material/TableHead";
import { GridColumnType } from "../../../types/common.type";
import { Checkbox, TableCell, TableRow } from "@mui/material";
import GridTableHeaderCell from "./GridTableHeaderCell";
import { DragIndicator } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

interface GridTableHeaderProps {
  columns: GridColumnType[];
  tableRef: any;
  memoizedColumnsLength: number;
  size: string;
  memoizedColumnsFields: any;
  orderRowByHeader: any;
  columnsFilter: any;
  setColumnsFilter: any;
  filterOnChangeFunction?: any;
  resizer: boolean;
  headerRefs: any;
  checkboxEnabled: boolean;
  checkedRows: any;
  isChecked: boolean;
  onCheckboxClick: any;
  rowCount: any;
  draggable: boolean;
  singleRowSelect: boolean;
  columnFilterConfig: any;
  cellRefs: any;
  headerRef: any;
}

const StyledTableHead = styled(TableHead)<{ size: string }>(
  ({ theme, size }) => ({
    zIndex: (theme as any).zIndex.appBar - 2,
    minHeight: size === "small" ? "41px" : "49px",
    overflow: "hidden",
  })
);

const StyledTableHeadRow = styled(TableRow)<{ size: string }>(({ size }) => ({
  width: "100%",
  minWidth: "0px",
  boxSizing: "border-box",
  height: size === "small" ? "41px" : "49px",
}));

const StyledMainDivider = styled("tr")(({ theme }: any) => ({
  position: "absolute",
  background: theme.palette.mode === "dark" ? "rgb(125,129,157)" : "#EAEBF0",
  width: "2px",
  zIndex: theme.zIndex.modal + 1,
  visibility: "hidden",
  height: "500px",
}));

const StyledTableCheckboxCell = styled(TableCell)<{
  _size: string;
  draggable: boolean;
}>(({ _size, draggable, theme }) => ({
  width: 24,
  position: "sticky",
  zIndex: theme.zIndex.modal - 1,
  color: "#707C93",
  left: draggable ? 35 : 0,
  overflow: "hidden !important",
  paddingTop: 5,
  paddingBottom: 3,
  paddingLeft: _size === "small" ? 10 : 14,
  fontStyle: "normal",
  fontSize: "13px",
  fontWeight: 500,
  lineHeight: "32px",
  top: "0 !important",
  borderBottom: "none",
  borderTop: (theme as any).palette.borderColor,
  // background: "linear-gradient(180deg, #FFFFFF 97%, #EAEBF0 100%)",
  "& #clearFilterBtn": {
    display: "none",
  },
  "& .MuiButtonBase-root": {
    "&:hover": {
      backgroundColor: "inherit",
    },
  },
  paddingRight: "2px",
  alignItems: "center",
  justifyContent: "center",
  display: "flex",
  minWidth: "24px",
}));

const StyledCheckboxRoot = styled(Checkbox)<{ _size: string }>(({ _size }) => ({
  padding: "0",
  display: "flex !important",
  alignItems: "center",
  color: "inherit",
  "& .MuiDivider-root": {
    display: "block !important",
  },
  "& .MuiSvgIcon-root": {
    width: _size === "small" ? "16px" : "20px",
    height: "20px",
    // padding: "2px",
  },
  width: "fit-content",
}));

const GridTableHeader: React.FC<GridTableHeaderProps> = ({
  columns,
  tableRef,
  memoizedColumnsLength,
  size,
  memoizedColumnsFields,
  orderRowByHeader,
  columnsFilter,
  setColumnsFilter,
  filterOnChangeFunction,
  resizer,
  headerRefs,
  checkboxEnabled,
  checkedRows,
  isChecked,
  onCheckboxClick,
  rowCount,
  draggable,
  singleRowSelect,
  columnFilterConfig,
  cellRefs,
  headerRef,
}) => {
  const [activeSortColName, setActiveSortColName] = useState<string>("");
  const tableHeaderMainDivider = useRef<any>();
  const isIntermediate = () => {
    return checkedRows.length > 0 && checkedRows.length < rowCount;
  };

  const handleChange = (checked: any) => {
    onCheckboxClick(checked);
  };

  const getMemoizedFlexibleColumns = useMemo(() => {
    return columns.filter((col: any) => !col.width && !col.fixed);
  }, [columns]);

  const isGridFlexible = columns.some((col) => !col.width && !col.fixed);

  //Scroll Sync
  // const scrollOverflowStyle = isGridFlexible
  //   ? { overflow: "hidden" }
  //   : ({ overflowX: "hidden", overflowY: "scroll" } as React.CSSProperties);

  return (
    <StyledTableHead ref={headerRef} size={size}>
      <StyledMainDivider
        id={"table_header_divider"}
        ref={tableHeaderMainDivider}
      />
      <StyledTableHeadRow
        size={size}
        style={{ display: isGridFlexible ? "flex" : "" }}
        data-testid={"grid-table-header-row"}
      >
        {draggable && (
          <StyledTableCheckboxCell
            _size={size}
            draggable={draggable}
            style={{
              left: 0,
              paddingLeft: 6,
              paddingRight: 5,
              height: !isGridFlexible
                ? size === "small"
                  ? "32px"
                  : "40px"
                : "inherit",
            }}
          >
            <DragIndicator style={{ visibility: "hidden" }} key={0} />
          </StyledTableCheckboxCell>
        )}
        {checkboxEnabled && (
          <StyledTableCheckboxCell
            _size={size}
            draggable={draggable}
            onClick={(e) => e.stopPropagation()}
            style={{
              left: draggable ? 35 : 0,
              paddingLeft: size === "small" ? 8 : 14,
              minWidth: "20px",
              height: !isGridFlexible
                ? size === "small"
                  ? "32px"
                  : "40px"
                : "",
            }}
            data-testid={"checkbox-cell"}
          >
            {!singleRowSelect && (
              <StyledCheckboxRoot
                _size={size}
                name={"grid-header-checkbox-cell"}
                indeterminate={isIntermediate()}
                checked={isChecked}
                onChange={(e) => handleChange(e.currentTarget.checked)}
                style={{ right: draggable ? 14 : 0 }}
              />
            )}
          </StyledTableCheckboxCell>
        )}
        {columns.map((column, index) => {
          return (
            <GridTableHeaderCell
              key={index}
              column={{
                ...column,
                filter: columnFilterConfig.find(
                  (f: any) => f.field === column.field
                ),
              }}
              tableRef={tableRef}
              prevColumn={index !== 0 ? columns[index - 1] : null}
              nextColumn={
                index < memoizedColumnsLength ? columns[index + 1] : null
              }
              size={size}
              memoizedColumnsFields={memoizedColumnsFields}
              activeSortColName={activeSortColName}
              setActiveSortColName={setActiveSortColName}
              orderRowByHeader={orderRowByHeader}
              columnsFilter={columnsFilter}
              setColumnsFilter={setColumnsFilter}
              filterOnChangeFunction={filterOnChangeFunction}
              resizer={resizer}
              tableHeaderMainDivider={tableHeaderMainDivider}
              headerRefs={headerRefs}
              draggable={draggable}
              checkboxEnabled={checkboxEnabled}
              cellRefs={cellRefs}
              getMemoizedFlexibleColumns={getMemoizedFlexibleColumns}
              isGridFlexible={isGridFlexible}
            />
          );
        })}
      </StyledTableHeadRow>
    </StyledTableHead>
  );
};

export default React.memo(GridTableHeader);
