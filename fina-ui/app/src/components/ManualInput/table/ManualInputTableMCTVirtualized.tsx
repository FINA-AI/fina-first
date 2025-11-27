import React, { ReactNode } from "react";
import { AutoSizer, Column, Table, WindowScroller } from "react-virtualized";
import ManualInputTableCell from "./ManualInputTableCell";
import ManualInputTableHeaderCell from "./Input/ManualInputTableHeaderCell";
import { styled } from "@mui/material/styles";
import {
  MiProcess,
  MiTable,
  MiTableRow,
  MiTableRowItem,
} from "../../../types/manualInput.type";

interface ColumnType {
  dataKey: string;
  label: string;
  numeric: boolean;
  width: number;
}

interface ManualInputTableMCTVirtualizedProps {
  columns: ColumnType[];
  headerHeight: number;
  rowHeight: number;
  tableInfo: MiTable;
  miProcess: MiProcess;
  getFormattedValue: (value: string) => string;
  dateFormat: string;
  dateTimeFormat: string;
  scrollElement: HTMLElement;
  calculatedTableWidth: number;
  rowCount: number;
  rowGetter: ({ index }: { index: number }) => MiTableRow;
}

const StyledTable = styled(Table)(({ theme }: { theme: any }) => ({
  paddingTop: "25px",
  paddingBottom: "20px",
  "& .evenRowStyle": {
    display: "flex",
    borderTop: theme.general.border,
    borderBottom: theme.general.border,
    overflow: "visible !important",
    background: theme.palette.paperBackground,
    position: "sticky",
    top: 0,
    zIndex: 999999,
    height: "100%",
    "& .MuiTableCell-root": {
      background: "none",
    },
  },
  "& .oddRowStyle": {
    display: "flex",
    overflow: "visible!important",
    background: theme.palette.mode === "light" ? "#F0F0F0" : "#212C3A",
    "& .MuiTableCell-root": {
      background: "none",
    },
    borderBottom: theme.general.border,
  },
}));

class ManualInputTableMCTVirtualized extends React.PureComponent<ManualInputTableMCTVirtualizedProps> {
  static defaultProps = {
    headerHeight: 60,
    rowHeight: 60,
  };

  getTableCell = (
    rowItem: MiTableRowItem,
    elementIndex: number,
    rowIndex: number
  ) => {
    const {
      tableInfo,
      miProcess,
      getFormattedValue,
      dateFormat,
      dateTimeFormat,
    } = this.props;

    return (
      <ManualInputTableCell
        key={tableInfo.description + "_cell_" + rowIndex + "_" + elementIndex}
        rowItem={rowItem}
        index={elementIndex}
        miProcess={miProcess}
        table={tableInfo}
        getFormattedValue={getFormattedValue}
        dateFormat={dateFormat}
        dateTimeFormat={dateTimeFormat}
        rowIndex={rowIndex}
        tableType={"MCT"}
      />
    );
  };

  getTableHeaderCell = (label: ReactNode, index: number) => {
    return (
      <ManualInputTableHeaderCell
        tableType={"MCT"}
        index={index}
        label={label}
      />
    );
  };

  cellRenderer = ({
    columnIndex,
    rowData,
    rowIndex,
  }: {
    columnIndex: number;
    rowData: MiTableRow;
    rowIndex: number;
  }) => {
    return this.getTableCell(
      rowData.rowItems[columnIndex],
      columnIndex,
      rowIndex
    );
  };

  headerRenderer = ({
    label,
    columnIndex,
  }: {
    label?: ReactNode;
    columnIndex: number;
  }) => {
    return this.getTableHeaderCell(label, columnIndex);
  };

  getWidth = ({
    parentWidth,
    calculatedTableWidth,
  }: {
    parentWidth: number;
    calculatedTableWidth: number;
  }) => {
    if (parentWidth > calculatedTableWidth) {
      return parentWidth;
    }
    return calculatedTableWidth;
  };

  render() {
    const {
      scrollElement,
      columns,
      rowHeight,
      headerHeight,
      calculatedTableWidth,
      rowCount,
      ...tableProps
    } = this.props;

    return (
      <WindowScroller scrollElement={scrollElement}>
        {({ height, width, isScrolling, onChildScroll, scrollTop }) => {
          const calculatedWidth = this.getWidth({
            parentWidth: width,
            calculatedTableWidth: calculatedTableWidth,
          });

          return (
            <div>
              <AutoSizer disableHeight>
                {() => (
                  <StyledTable
                    rowCount={rowCount}
                    autoHeight={true}
                    width={calculatedWidth - 8}
                    overscanRowCount={20}
                    height={height}
                    isScrolling={isScrolling}
                    onScroll={onChildScroll}
                    scrollTop={scrollTop}
                    rowHeight={rowHeight}
                    headerHeight={headerHeight}
                    {...tableProps}
                    rowClassName={({ index }) => {
                      return index >= 0 && index % 2 === 0
                        ? "oddRowStyle"
                        : "evenRowStyle";
                    }}
                    gridStyle={{ overflow: "visible", overflowY: "visible" }}
                    style={{ overflow: "visible", overflowY: "visible" }}
                  >
                    {columns.map(({ dataKey, ...other }, index) => {
                      return (
                        <Column
                          key={dataKey}
                          style={{
                            overflow: index === 0 ? "visible" : "hidden",
                            position: index === 0 ? "sticky" : "relative",
                            zIndex: index === 0 ? 1 : 0,
                            left: 0,
                            marginLeft: 0,
                            display: "flex",
                            height: "100%",
                          }}
                          headerStyle={{ ...other }}
                          headerRenderer={(headerProps) =>
                            this.headerRenderer({
                              ...headerProps,
                              columnIndex: index,
                            })
                          }
                          cellRenderer={this.cellRenderer}
                          dataKey={dataKey}
                          {...other}
                        />
                      );
                    })}
                  </StyledTable>
                )}
              </AutoSizer>
            </div>
          );
        }}
      </WindowScroller>
    );
  }
}

export default ManualInputTableMCTVirtualized;
