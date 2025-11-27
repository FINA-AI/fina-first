import React, { FC, useEffect, useState } from "react";
import GridTableBodyRow from "./GridTableBodyRow";
import { getRowHeight } from "./util/gridUtils";
import { GridColumnType } from "../../../types/common.type";

interface VirtualizedRowsProps {
  bodyRef: any;
  bodyRows: any[];
  selectedRows: any[];
  checkedRows: any[];
  columns: GridColumnType[];
  onRowClick: (row: any) => void;
  onCheckboxClick: (row: any) => void;
  checkboxEnabled: boolean;
  size: string;
  rowStyleSetter: (row: any) => any;
  tableRef: any;
  headerRefs: any;
  cellRefs: any;
  headerColumnRefs: any;
  headerRef: any;
  scrollRef: any;
  singleRowSelect: boolean;
  actionButtons: any;
  backgroundColor: string;
  editableCellIds?: number[];
  setEditableCellIds: (editableCellIds: number[]) => void;
  onCellValueChange: (value: string, row: any, cell: any) => void;
  viewMode: boolean;
  draggable: boolean;
  windowHeight: number;
  index: number;
}

const VirtualizedRows: FC<VirtualizedRowsProps> = ({
  bodyRef,
  bodyRows,
  selectedRows,
  checkedRows,
  columns,
  onRowClick,
  onCheckboxClick,
  checkboxEnabled,
  size,
  rowStyleSetter,
  tableRef,
  headerRefs,
  cellRefs,
  headerRef,
  scrollRef,
  actionButtons,
  editableCellIds = [],
  setEditableCellIds,
  onCellValueChange,
  viewMode,
  draggable,
  windowHeight,
}) => {
  const defaultOverScanRowCount = 5;
  const itemHeight = getRowHeight(size);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    bodyRef.current.addEventListener("scroll", onScroll);
  }, []);

  let startIndex = Math.floor(scrollTop / itemHeight);

  startIndex =
    startIndex > defaultOverScanRowCount + 3
      ? startIndex - defaultOverScanRowCount
      : startIndex;

  let endIndex = Math.min(
    bodyRows.length - 1, // don't render past the end of the list
    Math.floor((scrollTop + windowHeight) / itemHeight)
  );

  const _rowRenderer: FC<{
    index: number;
    key: number;
    style: { [key: string]: number | string };
  }> = ({ index, key, style }) => {
    const item = bodyRows[index];

    return (
      <GridTableBodyRow
        key={key}
        row={item}
        rowIndex={index}
        isSelected={selectedRows.some((row) => item.id === row.id)}
        isChecked={checkedRows.some((row) => item.id === row.id)}
        onRowClick={onRowClick}
        onCheckboxClick={onCheckboxClick}
        columns={columns}
        scrollRef={scrollRef}
        checkboxEnabled={checkboxEnabled}
        actionButtons={actionButtons}
        size={size}
        editableCellIds={editableCellIds}
        setEditableCellIds={setEditableCellIds}
        onCellValueChange={onCellValueChange}
        style={style}
        virtualized={true}
        cellRefs={cellRefs}
        headerRefs={headerRefs}
        draggable={draggable}
        viewMode={viewMode}
        rowStyleSetter={rowStyleSetter}
        tableRef={tableRef}
        isDraggableRow={false}
      />
    );
  };

  const items = [];
  for (let i = startIndex; i <= endIndex; i++) {
    items.push(
      _rowRenderer({
        index: i,
        key: i,
        style: {
          position: "absolute",
          top: `${i * itemHeight}px`,
          width: "100%",
          // display: "table-row-group",
          height: `${itemHeight}px`,
        },
      })
    );
  }

  const onScroll = (event: any) => {
    setScrollTop(event.currentTarget.scrollTop);
    headerRef.current.scrollLeft = event.target.scrollLeft;
  };

  return <div>{items}</div>;
};

export default VirtualizedRows;
