import TableRow from "@mui/material/TableRow";
import GridTableBodyCell from "./GridTableBodyCell";
import RowCellButtons from "./RowCellButtons";
import { Checkbox, TableCell } from "@mui/material";
import React, { FC, memo, useMemo, useRef } from "react";
import { Draggable } from "react-beautiful-dnd";
import { DragIndicator } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

interface GridTableBodyRowProps {
  row: any;
  rowIndex: number;
  isSelected?: boolean;
  isChecked?: boolean;
  onRowClick: (row: any, event: any) => void;
  onCheckboxClick: (row: any, event: any) => void;
  columns: any[];
  scrollRef: any;
  checkboxEnabled: boolean;
  actionButtons: any;
  size?: string;
  editableCellIds: any[];
  setEditableCellIds: (editableCellIds: number[]) => void;
  onCellValueChange: (row: any, column: any, value: any) => void;
  style?: { [key: string]: string | number };
  virtualized: boolean;
  cellRefs: any;
  draggable: boolean;
  headerRefs: any;
  isDraggableRow: boolean;
  viewMode: boolean;
  rowStyleSetter: (row: any) => any;
  tableRef: any;
}

const StyledTableRow = styled(TableRow, {
  shouldForwardProp: (prop: string) => !prop.startsWith("_"),
})<{
  _isRowSelected: boolean;
  _isRowDraggable?: boolean;
}>(({ theme, _isRowSelected, _isRowDraggable }) => ({
  ...(_isRowSelected
    ? {
        background: `linear-gradient(180deg, ${
          (theme as any).palette.action.select
        } 97%, ${theme.palette.mode === "dark" ? "#495F80" : "#EAEBF0"}  100%)`,
        "&:hover": {
          background: theme.palette.action.hover,
        },
      }
    : {
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(180deg, #2D3747 97%, #495F80 100%)"
            : "linear-gradient(180deg, #FFFFFF 97%, #EAEBF0 100%)",
        "&:hover": {
          background: theme.palette.action.hover,
        },
      }),
  ...(_isRowDraggable && {
    "& .MuiTableCell-root": {},
  }),
}));

const StyledCheckbox = styled(Checkbox)<{ _size: string }>(
  ({ theme, _size }) => ({
    padding: "0",
    display: "block !important",
    color: theme.palette.mode === "dark" ? "#b1b4b7" : "#C2CAD8",
    "& .MuiSvgIcon-root": {
      display: "block !important",
      width: _size === "small" ? "16px" : "20px",
      height: "20px",
    },
    "& .MuiDivider-root": {
      display: "block !important",
    },
    width: "fit-content",
  })
);

const StyledTableCell = styled(TableCell)(({ theme }: any) => ({
  borderBottom: "none !important",
  borderTop: "none !important",
  position: "sticky",
  zIndex: theme.zIndex.appBar - 3,
  alignItems: "center",
  "& .MuiButtonBase-root": {
    "&:hover": {
      backgroundColor: "inherit",
    },
  },
  width: "fit-content",
  paddingRight: "2px !important",
  display: "flex",
  alignItem: "center",
}));

const GridTableBodyRow: FC<GridTableBodyRowProps> = ({
  row,
  rowIndex,
  isSelected = false,
  isChecked = false,
  onRowClick,
  onCheckboxClick,
  columns,
  scrollRef,
  checkboxEnabled,
  actionButtons,
  size = "default",
  editableCellIds,
  setEditableCellIds,
  onCellValueChange,
  style,
  virtualized,
  cellRefs,
  draggable,
  headerRefs,
  isDraggableRow,
  viewMode,
  rowStyleSetter,
  tableRef,
}) => {
  const actionColumnRef: any = useRef(null);
  const rowStyle = rowStyleSetter ? rowStyleSetter(row) : "";

  const ref: any = useRef();
  const rowOnClick = (event: any) => {
    event.stopPropagation();
    onRowClick(row, event);
  };

  const onCellClick = (row: any) => {
    setEditableCellIds([row.id]);
  };

  const countFixedColumns = columns.filter((col) => col.fixed).length;

  const GetTableRowCellMemo = useMemo(() => {
    return columns.map((item, index) => (
      <GridTableBodyCell
        key={index}
        cell={item}
        rowIndex={rowIndex}
        cellIndex={index}
        freezable={item.fixed !== undefined ? item.fixed : false}
        isCellHidden={item.hidden}
        row={row}
        size={size}
        editableCellIds={editableCellIds}
        onCellClick={onCellClick}
        onCellValueChange={onCellValueChange}
        cellRefs={cellRefs}
        headerRefs={headerRefs}
        viewMode={viewMode}
        isLastFixedCell={countFixedColumns - 1 === index}
        tableRef={tableRef}
        columns={columns}
        checkboxEnabled={checkboxEnabled}
        draggable={draggable}
      />
    ));
  }, [columns, row, editableCellIds, isDraggableRow]);

  const GetRowCellButtonMemo = useMemo(() => {
    return (
      <RowCellButtons
        row={row}
        actionColumnRef={actionColumnRef}
        height={size === "small" ? 38 : 44}
        rowIndex={rowIndex}
        actionButtons={actionButtons}
        size={size}
      />
    );
  }, [actionColumnRef, row]);

  const checkboxOnChange = (e: any) => {
    e.stopPropagation();
    onCheckboxClick(row, e);
  };

  const onMouseEnter = () => {
    if (ref.current && actionColumnRef && actionColumnRef.current) {
      if (virtualized) {
        actionColumnRef.current.style.top = 0 + "px";
      } else {
        actionColumnRef.current.style.top =
          ref.current.getBoundingClientRect().top -
          tableRef.current.getBoundingClientRect().top +
          "px";
      }
      if (scrollRef.current) {
        actionColumnRef.current.style.right =
          scrollRef.current.scrollWidth -
          scrollRef.current.clientWidth -
          scrollRef.current.scrollLeft +
          "px";
      }
      actionColumnRef.current.style.display = "flex";
    }
  };

  const onMouseLeave = () => {
    if (ref.current && actionColumnRef && actionColumnRef.current) {
      actionColumnRef.current.style.display = "none";
    }
  };

  const CustomTableRowContent = () => {
    return (
      <>
        {(isDraggableRow || draggable) && (
          <StyledTableCell style={{ left: 0 }}>
            <DragIndicator
              style={{
                cursor: "move",
                color: "rgba(104, 122, 158, 0.8)",
                verticalAlign: "middle",
              }}
              key={rowIndex}
            />
          </StyledTableCell>
        )}
        {checkboxEnabled && (
          <StyledTableCell
            width={24}
            onClick={(e) => e.stopPropagation()}
            style={{
              paddingLeft: isDraggableRow
                ? "3px"
                : size === "small"
                ? "12px"
                : "15px",
              left: draggable ? 35 : 0,
              minWidth: "23px",
            }}
          >
            <StyledCheckbox
              data-testid={"row-checkbox-" + rowIndex}
              _size={size}
              name={"grid-checkbox-cell"}
              checked={isChecked}
              onClick={(e) => {
                e.stopPropagation();
                checkboxOnChange(e);
              }}
              style={{ right: draggable ? 12 : 0 }}
            />
          </StyledTableCell>
        )}
        {GetTableRowCellMemo}
        {actionButtons && GetRowCellButtonMemo}
      </>
    );
  };

  return draggable ? (
    <Draggable key={row.id} draggableId={row.id.toString()} index={rowIndex}>
      {(provided, snapshot) => (
        <StyledTableRow
          _isRowSelected={isSelected || isChecked}
          _isRowDraggable={snapshot.isDragging}
          ref={(instance) => {
            provided.innerRef(instance);
            ref.current = instance;
          }}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          data-testid={`row-${rowIndex}`}
          //ref={ref}
          style={{
            ...style,
            ...provided.draggableProps.style,
            display: "flex",
          }}
          key={rowIndex}
          onClick={(event) => rowOnClick(event)}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {CustomTableRowContent()}
        </StyledTableRow>
      )}
    </Draggable>
  ) : (
    <StyledTableRow
      _isRowSelected={isSelected || isChecked}
      data-testid={`row-${rowIndex}`}
      ref={ref}
      style={style}
      key={rowIndex}
      onClick={(event) => rowOnClick(event)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      sx={{
        ...rowStyle,
        display: "flex",
      }}
    >
      {CustomTableRowContent()}
    </StyledTableRow>
  );
};

export default memo(GridTableBodyRow, (prevProps, nextProps) => {
  if (nextProps.editableCellIds.length > 0) {
    return !(
      prevProps.editableCellIds[0] === nextProps.row.id ||
      nextProps.editableCellIds.indexOf(nextProps.row.id) === 0
    );
  }

  if (!prevProps.virtualized) {
    return (
      prevProps.isChecked === nextProps.isChecked &&
      prevProps.isSelected === nextProps.isSelected &&
      Object.is(prevProps.row, nextProps.row) &&
      Object.is(prevProps.columns, nextProps.columns)
    );
  }

  return false;
});
