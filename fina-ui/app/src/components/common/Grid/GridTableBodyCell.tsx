import { Box, StyledComponentProps, TableCell } from "@mui/material";
import CopyCellButton from "./CopyCellButton";
import React, { FC, memo, useMemo, useRef, useState } from "react";
import Tooltip from "../Tooltip/Tooltip";
import TextField from "../Field/TextField";
import { styled } from "@mui/system";
import { GridColumnType } from "../../../types/common.type";
import { useTheme } from "@mui/material/styles";
import { getNestedValue } from "../../../util/appUtil";

interface StyleTableCellProps extends StyledComponentProps<string> {
  theme?: any;
  _fixed: number;
  _tableSize?: string;
  _isLastFixedCol: boolean;
  _hidden: boolean;
  _calculatedWidth?: string;
  _left: string | number;
  _cell: GridColumnType;
}

const StyledTableCell = styled(TableCell, {
  shouldForwardProp: (prop: string) => !prop.startsWith("_"),
})<StyleTableCellProps>(
  ({
    theme,
    _fixed,
    _tableSize,
    _isLastFixedCol,
    _hidden,
    _calculatedWidth,
    _left,
    _cell,
  }) => ({
    position: _fixed ? "sticky" : "static",
    fontSize: _tableSize === "small" ? 11 : 12,
    lineHeight: _tableSize === "small" ? "16px" : "20px",
    zIndex: _isLastFixedCol ? theme.zIndex.modal - 103 : _fixed ? 2 : 1,
    borderRight: _isLastFixedCol
      ? theme.palette.mode === "dark"
        ? "1px solid #3C4D68"
        : "1px solid #EAEBF0"
      : "inherit",
    boxShadow: _isLastFixedCol
      ? theme.palette.mode === "dark"
        ? "15px 0px 12px 0px #3c4d6840"
        : "15px 0px 12px 0px #352F2F0A"
      : "none",
    display: _hidden ? "none" : "",
    color: theme.palette.textColor,
    minWidth: _cell.width || _cell.fixed ? _calculatedWidth : 0,
    width: _cell.width || _cell.fixed ? _calculatedWidth : 0,
    maxWidth: _cell.fixed || _cell.width ? _calculatedWidth : "",
    flex: _cell.fixed || _cell.width ? "none" : _calculatedWidth || 1,
    left: _fixed ? _left : "",
  })
);

interface GridTableBodyCellProps {
  rowIndex: number;
  cellIndex: number;
  freezable: boolean;
  isCellHidden: boolean;
  row: any;
  cell: any;
  size?: string;
  editableCellIds?: number[];
  onCellClick: (row: any) => void;
  onCellValueChange: (value: string, row: any, cell: any) => void;
  cellRefs: any;
  viewMode: boolean;
  isLastFixedCell: boolean;
  columns: any[];
  tableRef: any;
  checkboxEnabled: boolean;
  draggable: boolean;
  headerRefs: any;
}

const cellComponentStyles = `
  .cell-content {
    width: calc(100% - 10px);
    user-select: none;
    align-items: center;
    display: flex;
  }
  
  .cell-content.hover-enabled:hover {
    background: var(--hover-bg);
    width: calc(100% - 10px);
    border-radius: 8px;
  }
  
  .cell-content.hover-enabled:hover #copyButton {
    display: block;
  }

  .cell-content #copyButton {
    display: none;
  }
  
  .cell-div {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    float: left;
  }
`;

const GridTableBodyCell: FC<GridTableBodyCellProps> = ({
  rowIndex,
  cellIndex,
  freezable,
  isCellHidden,
  row,
  cell,
  size,
  editableCellIds = [],
  onCellClick,
  onCellValueChange,
  cellRefs,
  viewMode,
  isLastFixedCell,
  columns,
  tableRef,
  checkboxEnabled,
  draggable,
  headerRefs,
}) => {
  const hidden = isCellHidden;
  const fixed = freezable;
  const theme = useTheme();

  const [tooltip, setTooltip] = useState(false);
  const [copyLoading, setCopyLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const getRowValue = (row: any, col: GridColumnType) => {
    const path = col.field.split(".");
    let value = row;
    for (let pathPart of path) {
      if (value) value = value[pathPart];
    }
    return value;
  };

  const getCellValue = (col: GridColumnType, colIndex: number) => {
    let item = getRowValue(row, col);

    if (typeof col.renderCell === "function") {
      return col.renderCell(item, row, colIndex);
    }
    return item;
  };

  const textValue = getCellValue(cell, rowIndex);

  const isCellEmpty = () => {
    let value = textValue;
    return !(value && value.props?.children !== null && !cell.hideBackground);
  };

  const hasTooltip = () => {
    return typeof cell.renderCell !== "function";
  };

  const onMouseEnterFunction = () => {
    requestAnimationFrame(() => {
      const el = contentRef.current;
      if (el && el.scrollWidth > el.clientWidth) {
        setTooltip(true);
      } else {
        setTooltip(false);
      }
    });
  };

  const getCellComponent = (item: any) => {
    if (item.editable && editableCellIds.indexOf(row.id) >= 0) {
      let value = getRowValue(row, cell);

      row.immutableData = row.immutableData ? row.immutableData : { ...row };

      return (
        <Box width={"100%"}>
          <TextField
            size={"small"}
            value={value}
            dirtable={true}
            isDirty={row.isDirty}
            onFocus={(event) => {
              event.target.select();
            }}
            onChange={(v: string) => {
              if (onCellValueChange) {
                onCellValueChange(v, row, item);
              }
              row[cell.field] = v;
              row.isDirty = row.immutableData[cell.field] !== row[cell.field];
            }}
          />
        </Box>
      );
    }

    const hoverEnabled = !cell.hideCopy && !isCellEmpty() && !viewMode;
    const copyEnabled =
      !cell.hideCopy && !cell.hideBackground && !isCellEmpty();
    return (
      <>
        <style>{cellComponentStyles}</style>
        <div
          key={item.key}
          className={`cell-content ${hoverEnabled ? "hover-enabled" : ""}`}
          style={
            {
              "--hover-bg":
                theme.palette.mode === "dark" ? "#2D3747" : "#FFFFFF",
              position: "relative",
              minHeight: size === "small" ? "32px" : "40px",
              left: -5,
              width: "100%",
            } as React.CSSProperties
          }
          onClick={() => {
            if (cell.editable) {
              onCellClick(row);
            } else if (editableCellIds.length > 0) {
              onCellClick({ id: -1 });
            }
          }}
        >
          <div
            className={`cell-content`}
            style={{
              position: "absolute",
              left: 5,
            }}
          >
            {hasTooltip() ? (
              <Tooltip title={textValue} arrow disableHoverListener={!tooltip}>
                <div
                  ref={contentRef}
                  className={`cell-div`}
                  data-testid={`${cell.field}-${rowIndex}-value`}
                  onMouseEnter={onMouseEnterFunction}
                >
                  {textValue}
                </div>
              </Tooltip>
            ) : (
              <div
                className={`cell-div`}
                data-testid={`${cell.field}-${rowIndex}-value`}
              >
                {textValue}
              </div>
            )}

            <div
              id={"copyButton"}
              style={{
                display: copyLoading ? "block" : "",
                float: "left",
                alignItems: "center",
              }}
            >
              {copyEnabled && (
                <CopyCellButton
                  text={
                    cell["copyFunction"]
                      ? cell.copyFunction(row)
                      : row[cell.field]
                  }
                  onLoadStart={() => setCopyLoading(true)}
                  onLoadEnd={() => setCopyLoading(false)}
                />
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  const getWidth = () => {
    try {
      if (cell.fixed || cell.width) {
        return `calc(((var(--${cell.field.replaceAll(
          ".",
          "-"
        )}-size)) - 10) * 1px)`;
      } else {
        if (headerRefs.current[cell.field]) {
          const computedStyle = window.getComputedStyle(
            headerRefs.current[cell.field]
          );
          return computedStyle.flex;
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const calculatedWidth = getWidth();

  let addLeftPosition = (draggable ? 40 : 0) + (checkboxEnabled ? 40 : 0);

  const getMemoizedLeftPosition = useMemo(() => {
    if (tableRef) {
      if (cell.fixed) {
        if (cell.field === columns[0].field) {
          return addLeftPosition;
        }

        let leftPosition = "";

        for (let column of columns) {
          if (column.field === cell.field) {
            leftPosition = leftPosition.trim().slice(0, -1);
            break;
          }
          leftPosition += `var(--${column.field.replace(".", "-")}-size) + `;
        }

        return `calc(((${leftPosition}) + ${addLeftPosition}) * 1px)`;
      }
    }
    return "none";
  }, [cell, columns]);

  return (
    <StyledTableCell
      key={"gridTableCell_" + cellIndex}
      _fixed={+fixed}
      _hidden={hidden}
      _isLastFixedCol={isLastFixedCell}
      _tableSize={size}
      _calculatedWidth={calculatedWidth}
      ref={(ref) => (cellRefs.current[`${cell.field}_${rowIndex}`] = ref)}
      _cell={cell}
      _left={getMemoizedLeftPosition}
      data-testid={`${cell.field}-${rowIndex}-cell`}
    >
      {getCellComponent(cell)}
    </StyledTableCell>
  );
};

export default memo(GridTableBodyCell, (prevProps: any, nextProps: any) => {
  let editableIdChanged =
    prevProps.editableCellIds.length === nextProps.editableCellIds.length;

  if (nextProps.editableCellIds.length > 0) {
    editableIdChanged =
      prevProps.editableCellIds[0] === nextProps.editableCellIds[0];
  }

  return (
    prevProps.cell.fixed === nextProps.cell.fixed &&
    prevProps.cell.renderCell === nextProps.cell.renderCell &&
    getNestedValue(prevProps.row, prevProps.cell.field) ===
      getNestedValue(nextProps.row, prevProps.cell.field) &&
    prevProps.row.id === nextProps.row.id &&
    editableIdChanged &&
    prevProps.isLastFixedCell === nextProps.isLastFixedCell &&
    prevProps.cell === nextProps.cell
  );
});
