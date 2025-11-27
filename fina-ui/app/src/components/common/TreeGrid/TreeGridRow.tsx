import React, { FC, useRef, useState } from "react";
import { TableRow } from "@mui/material";
import RowCellButtons from "../Grid/RowCellButtons";
import { TreeGridColumnType } from "../../../types/common.type";
import { styled, useTheme } from "@mui/material/styles";
import TreeGridRowCell from "./TreeGridRowCell";

interface TreeGridRowProps {
  columns: TreeGridColumnType[];
  row: any;
  selected: any;
  idName: string;
  parentIdName: string;
  expanded: any[];
  onExpand: (row: any) => any;
  getParents: any;
  scrollRef: any;
  leafName: string;
  freezeWidth?: number[];
  index: number;
  hideCheckBox: boolean;
  borderColor: string;
  childrenColor: string;
  parentIconExpand: boolean;
  hideActionBtn: boolean;
  actionButtons: any;
  size: string;
  cellRefs: any;
  rowOnClick: (row: any, event: any, index: number) => void;
  checked: any;
  treeIcons: any;
  onCheckboxClick: (row: any, event: any) => void;
  halfCheckedRows: any;
  onDoubleClick: any;
  headerCellWidths: number[];
  onContextMenu?: any;
  selectedCutNode?: any;
}

const StyledTableRow = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== "_isCutNode",
})<{ _isCutNode: any }>(({ theme, _isCutNode }) => ({
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  lineBreak: "anywhere",
  userSelect: "none",
  "& .MuiTableCell-root": {
    background: "transparent !important",
  },
  "& > .MuiTableCell-body": {
    color: "",
  },

  "& > .MuiTableCell-root": {
    backgroundColor: "inherit",
  },
  "& #rowButtons": {
    display: "none",
  },
  "& .MuiButtonBase-root": {
    "&:hover": {
      backgroundColor: "#ececec47",
    },
  },
  "&:hover": {
    "& #rowButtons": {
      display: "block",
      backgroundColor: "#FFFFFF !important",
      borderBottom: "none !important",
    },
    ...(!_isCutNode && {
      background: theme.palette.action.hover,
    }),
    borderBottom: (theme as any).borderColor,
    "& .MuiTableCell-root": {
      boxShadow: "unset !important",
    },
  },
}));

const getRowStyles = (
  selectedCutNode: any,
  theme: any,
  isRowVisible: () => boolean,
  isRowExpanded: () => boolean,
  isRowSelected: () => boolean,
  borderColor: string,
  expanded: any,
  row: any,
  childrenColor: string
): any => {
  const cutNodeExist = selectedCutNode && row.rowId === selectedCutNode.rowId;

  return {
    display: isRowVisible() ? "flex" : "none",
    "& > .MuiTableCell-body": {
      color: isRowExpanded() ? `${theme.palette.primary.main} !important` : "",
    },
    ...(cutNodeExist
      ? {
          background:
            "linear-gradient(90deg, #045C04 50%, transparent 0) repeat-x," +
            "linear-gradient(90deg, #045C04 50%, transparent 0) repeat-x," +
            "linear-gradient(0deg, #045C04 50%, transparent 0) repeat-y," +
            "linear-gradient(0deg, #045C04 50%, transparent 0) repeat-y",
          backgroundSize: "4px 1px, 4px 1px, 1px 4px, 1px 4px",
          backgroundPosition: "0 0, 0 100%, 0 0, 100% 0",
          cursor: "pointer",
          animation: "animatedCut .3s infinite linear",
          width: "calc(100% - 2px)",
          borderTop: "none",
        }
      : {
          borderBottom: "1px solid",
          background:
            isRowSelected() && `${theme.palette.action.select} !important`,
          borderColor: borderColor
            ? `${borderColor} !important`
            : theme.palette.mode === "dark"
            ? "#3C4D68"
            : "#EAEBF0",
        }),
    "& .MuiTableCell-root": {
      color:
        row.id > 0 &&
        expanded &&
        (row.level !== 0 || (row.children && row.children.length !== 0)) &&
        childrenColor
          ? `${childrenColor} !important`
          : "inherit",
    },
  };
};

const TreeGridRow: FC<TreeGridRowProps> = ({
  columns,
  row,
  selected,
  idName,
  parentIdName,
  expanded,
  onExpand,
  getParents,
  scrollRef,
  leafName,
  freezeWidth = [],
  index,
  hideCheckBox,
  borderColor,
  childrenColor,
  parentIconExpand,
  hideActionBtn,
  actionButtons,
  size = "default",
  cellRefs,
  rowOnClick,
  checked,
  treeIcons,
  onCheckboxClick,
  halfCheckedRows,
  onDoubleClick,
  headerCellWidths,
  onContextMenu,
  selectedCutNode,
}) => {
  const ref: any = useRef();
  const actionColumnRef: any = useRef(null);
  const [expanding, setExpanding] = useState(false);
  const theme: any = useTheme();

  const isRowVisible = () => {
    let parents = getParents(row[idName]);
    parents = parents.slice(0, parents.length - 1);

    //always show first level
    if (row[parentIdName] === 0) {
      return true;
    }

    let cond = expanded.some((d) => d === row[parentIdName]);
    //hide if parent is not expanded
    for (let parent of parents) {
      if (!expanded.some((d) => d === parent)) {
        return false;
      }
    }
    return cond;
  };

  const isRowExpanded = () => {
    return expanded.some((d) => d === row[idName]);
  };

  const isRowSelected = () => {
    return selected.some((item: any) => item[idName] === row[idName]);
  };

  const getRowValue = (row: any, col: any) => {
    const path = col.dataIndex.split(".");
    let value = row;
    for (let pathPart of path) {
      if (value) {
        value = value[pathPart];
      }
    }
    return value;
  };

  const getCellValue = (col: any, colIndex: number) => {
    return typeof col.renderer === "function"
      ? col.renderer(
          getRowValue(row, col),
          row,
          colIndex,
          expanded.includes(row.id)
        )
      : getRowValue(row, col);
  };

  const onTableRowClick = (event: React.MouseEvent) => {
    onRowClick(event);
  };

  const onRowClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    rowOnClick(row, event, index);
  };

  const onExpandIconClick = (event: any) => {
    if (!expanding) {
      setExpanding(true);
      onExpand(row).then(() => {
        setExpanding(false);
      });
      event.stopPropagation();
    }
  };

  const onDoubleClickFunc = (event: any) => {
    if (row.leaf) {
      if (onDoubleClick) {
        onDoubleClick(row);
      } else {
        event.stopPropagation();
      }
    } else if (
      parentIconExpand ||
      (!parentIconExpand && row.children?.length !== 0)
    ) {
      onExpandIconClick(event);
    }
  };

  return (
    <StyledTableRow
      data-testId={"treeGrid-row-" + index}
      className={isRowExpanded() ? "is-expanded" : ""}
      ref={ref}
      _isCutNode={selectedCutNode?.rowId === row?.rowId}
      sx={getRowStyles(
        selectedCutNode,
        theme,
        isRowVisible,
        isRowExpanded,
        isRowSelected,
        borderColor,
        expanded,
        row,
        childrenColor
      )}
      onMouseEnter={() => {
        if (!hideActionBtn) {
          if (actionColumnRef) {
            actionColumnRef.current.style.top = ref.current.offsetTop + "px";
            if (scrollRef.current) {
              actionColumnRef.current.style.right =
                0 - scrollRef.current.scrollLeft + "px";
            }
            actionColumnRef.current.style.display = "flex";
          }
        }
      }}
      onMouseLeave={() => {
        if (!hideActionBtn) {
          actionColumnRef.current.style.display = "none";
        }
      }}
      onClick={(event) => {
        onTableRowClick(event);
      }}
      onDoubleClick={(event) => {
        onDoubleClickFunc(event);
      }}
      style={{
        height: size === "small" ? 40 : 48,
        maxHeight: size === "small" ? 40 : 48,
      }}
      onContextMenu={(event: any) => {
        if (onContextMenu) {
          onContextMenu(event, row);
        }
      }}
    >
      {columns
        .filter((col) => !col.hidden)
        .map((col, colIndex) => {
          let cellValue = getCellValue(col, colIndex);
          return (
            <TreeGridRowCell
              col={col}
              size={size}
              colIndex={colIndex}
              freezeWidth={freezeWidth}
              cellRefs={cellRefs}
              index={index}
              row={row}
              expanding={expanding}
              leafName={leafName}
              hideCheckBox={hideCheckBox}
              expanded={expanded}
              idName={idName}
              checked={checked}
              halfCheckedRows={halfCheckedRows}
              onCheckboxClick={onCheckboxClick}
              treeIcons={treeIcons}
              parentIconExpand={parentIconExpand}
              cellValue={cellValue}
              onExpandIconClick={onExpandIconClick}
              headerCellWidth={headerCellWidths[colIndex]}
            />
          );
        })}
      {!hideActionBtn && (
        <RowCellButtons
          key={`rowCell-${index}`}
          row={row}
          actionColumnRef={actionColumnRef}
          height={size === "small" ? 40 : 48}
          actionButtons={actionButtons}
          size={size}
          rowIndex={index}
        />
      )}
    </StyledTableRow>
  );
};

export default TreeGridRow;
