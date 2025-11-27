import React, { ReactNode } from "react";
import { AutoSizer, Column, Table, WindowScroller } from "react-virtualized";
import ManualInputTableCell from "./ManualInputTableCell";
import ManualInputVctRowDeleteButton from "./Input/ManualInputVctRowDeleteButton";
import ManualInputTableHeaderCell from "./Input/ManualInputTableHeaderCell";
import { styled } from "@mui/material/styles";
import {
  MiProcess,
  MiTable,
  MiTableColumn,
  MiTableRow,
  MiTableRowItem,
} from "../../../types/manualInput.type";
import { UIEventType } from "../../../types/common.type";

interface ManualInputTableVCTVirtualizedProps {
  columns: MiTableColumn[];
  headerHeight: number;
  rowHeight: number;
  tableInfo: MiTable;
  miProcess: MiProcess;
  getFormattedValue: (value: string) => string;
  dateFormat: string;
  dateTimeFormat: string;
  scrollElement: HTMLElement;
  onDeleteRowClick: (rowIndex: number) => void;
  onContextMenuClick: (event: UIEventType, index: number) => void;
  calculatedTableWidth: number;
  rowCount: number;
  rowGetter: ({ index }: { index: number }) => MiTableRow;
  isDeleteDisabled: boolean;
}

const StyledTable = styled(Table)(({ theme }: { theme: any }) => ({
  paddingTop: "25px",
  paddingBottom: "20px",
  "& .evenRowStyle": {
    display: "flex",
    borderTop: theme.general.border,
    borderBottom: theme.general.border,
    background: theme.palette.paperBackground,
    overflow: "visible!important",
    position: "sticky",
    top: 0,
    zIndex: 999,
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
  },
}));

class ManualInputTableVCTVirtualized extends React.PureComponent<ManualInputTableVCTVirtualizedProps> {
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
        tableType={"VCT"}
        rowIndex={rowIndex}
      />
    );
  };

  getTableVRemoveRowCell = (
    elementIndex: number,
    rowIndex: number,
    isDisabled: boolean
  ) => {
    const { tableInfo, onDeleteRowClick } = this.props;

    return (
      <ManualInputVctRowDeleteButton
        tableInfo={tableInfo}
        onDeleteRowClick={onDeleteRowClick}
        elementIndex={elementIndex}
        rowIndex={rowIndex}
        isDisabled={isDisabled}
      />
    );
  };

  getTableHeaderCell = (label: ReactNode, index: number) => {
    return (
      <ManualInputTableHeaderCell
        tableType={"VCT"}
        index={index}
        label={label}
      />
    );
  };

  cellRenderer = ({
    columnIndex,
    rowData,
    rowIndex,
    isDeleteDisabled,
  }: {
    columnIndex: number;
    rowData: MiTableRow;
    rowIndex: number;
    isDeleteDisabled: boolean;
  }) => {
    //Row Numberer
    if (columnIndex === 0) {
      return this.getTableCell(
        rowData.rowItems[columnIndex],
        columnIndex,
        rowIndex
      );
    }

    if (rowData.rowItems && rowData.rowItems[columnIndex - 1]) {
      return this.getTableCell(
        rowData.rowItems[columnIndex - 1],
        columnIndex,
        rowIndex
      );
    }
    return this.getTableVRemoveRowCell(columnIndex, rowIndex, isDeleteDisabled);
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

  onRowRightClick = ({
    event,
    index,
  }: {
    event: UIEventType;
    index: number;
  }) => {
    const { onContextMenuClick } = this.props;
    if (onContextMenuClick) {
      onContextMenuClick(event, index);
    }
  };

  getWidth = ({
    parentWidth,
    calculatedTableWidth,
  }: {
    parentWidth: number;
    calculatedTableWidth: number;
  }) => {
    if (parentWidth >= calculatedTableWidth) {
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
      isDeleteDisabled,
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
                  onRowRightClick={this.onRowRightClick}
                  // onRowsRendered={this.onRowsRendered}
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
                          height: "100%",
                          marginLeft: 0,
                          left: 0,
                          display: "flex",
                        }}
                        headerStyle={{ ...other }}
                        headerRenderer={(headerProps) =>
                          this.headerRenderer({
                            ...headerProps,
                            columnIndex: index,
                          })
                        }
                        cellRenderer={({
                          columnIndex,
                          rowData,
                          rowIndex,
                        }): any =>
                          this.cellRenderer({
                            columnIndex,
                            rowData,
                            rowIndex,
                            isDeleteDisabled,
                          })
                        }
                        dataKey={dataKey}
                        {...other}
                      />
                    );
                  })}
                </StyledTable>
              )}
            </AutoSizer>
          );
        }}
      </WindowScroller>
    );
  }
}

export default ManualInputTableVCTVirtualized;
