import { Box, Checkbox, TableCell } from "@mui/material";
import React from "react";
import { styled } from "@mui/material/styles";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { GridColumnType } from "../../../types/common.type";
import TreeExpandLoadingIcon from "../Tree/TreeExpandLoadingIcon";

interface TreeGridRowCellProps {
  row: any;
  idName: string;
  expanded: any[];
  leafName: string;
  freezeWidth?: number[];
  index: number;
  hideCheckBox: boolean;
  parentIconExpand: boolean;
  size: string;
  cellRefs: any;
  checked: any;
  treeIcons: any;
  onCheckboxClick: (row: any, event: any) => void;
  halfCheckedRows: any;
  col: any;
  colIndex: number;
  expanding: boolean;
  cellValue: any;
  onExpandIconClick: any;
  headerCellWidth: number;
}

const StyledTableCell = styled(TableCell)<{
  _size: string;
  _cell: GridColumnType;
}>(({ _size, _cell }) => ({
  fontWeight: 400,
  fontSize: _size === "small" ? "11px" : "12px",
  lineHeight: _size === "small" ? "16px" : "20px",
  textTransform: "capitalize",
  color: "#2C3644",
  display: "flex",
  alignItems: "center",
  position: "sticky",
  ...(_cell.flex || _cell.minWidth
    ? {
        flex: _cell.flex || 1,
        minWidth: _cell.minWidth,
      }
    : _cell.width
    ? {
        minWidth: _cell.width,
        width: _cell.width,
        maxWidth: _cell.width,
      }
    : { flex: 1 }),
  padding: "0px",
  whiteSpace: "nowrap",
  overflow: "hidden !important",
  textOverflow: "ellipsis",
  borderBottom: "unset !important",
}));

const StyledTableCellInnerBox = styled(Box)<{ _size: string }>(({ _size }) => ({
  padding: _size === "small" ? "0px 12px" : "0px 16px",
  display: "block",
  width: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

const StyledCheckBox = styled(Checkbox, {
  shouldForwardProp: (props) => props !== "isDeleted",
})<{ _size: string; isDeleted: boolean }>(({ _size, isDeleted }) => ({
  margin: _size === "small" ? "0px 8px 0px 0px" : "0px 8px",
  "& .MuiSvgIcon-root": {
    width: _size === "small" ? "16px" : "20px",
    height: _size === "small" ? "16px" : "20px",
  },
  padding: _size === "small" ? "0px 8px 0px 0px" : "0px",
  color: isDeleted ? "#EAEBF0 !important" : "#C2CAD8",
}));

const StyledArrow = styled("span")<{ size: string }>(({ size }) => ({
  margin: "auto 0",
  height: "18px",
  color: "#C2CAD8",
  "& .MuiSvgIcon-root": {
    cursor: "pointer",
    width: size === "small" ? "16px" : "",
    height: size === "small" ? "16px" : "",
  },
}));

const StyledFirstCellValue = styled(Box)<{
  _size: string;
}>(({ _size }) => ({
  width: "100%",
  padding: _size === "small" ? "0px 12px" : "0px 16px",
  margin: "auto 0",
  fontWeight: 400,
  fontSize: _size === "small" ? "11px" : "12px",
  lineHeight: _size === "small" ? "16px" : "20px",
  textTransform: "capitalize",
  overflow: "hidden !important",
}));

const TreeGridRowCell: React.FC<TreeGridRowCellProps> = ({
  col,
  size,
  colIndex,
  freezeWidth,
  cellRefs,
  index,
  row,
  expanding,
  leafName,
  hideCheckBox,
  expanded,
  idName,
  checked,
  halfCheckedRows,
  onCheckboxClick,
  treeIcons,
  parentIconExpand,
  onExpandIconClick,
  cellValue,
  headerCellWidth,
}) => {
  const firstCell = (level: any) => {
    return (
      <>
        {[...Array(level)].map((e, i) => (
          <span
            onSelect={(event) => event.preventDefault()}
            key={i}
            style={{ cursor: "default", width: "30px", minWidth: "30px" }}
          />
        ))}
      </>
    );
  };

  const ExpandIcon = () => {
    return expanded.some((item) => item === row[idName]) ? (
      <>{!expanding && !row.leaf && <KeyboardArrowUpIcon fontSize="small" />}</>
    ) : (
      <>
        {!expanding && !row.leaf && <KeyboardArrowDownIcon fontSize="small" />}
      </>
    );
  };

  const isRowChecked = () => {
    return checked.some((item: any) => item[idName] === row[idName]);
  };

  const getCheckbox = () => {
    return (
      !hideCheckBox && (
        <StyledCheckBox
          _size={size}
          isDeleted={row.deleted}
          checked={isRowChecked()}
          disabled={row.deleted || expanding}
          indeterminate={halfCheckedRows.some(
            (item: any) => item[idName] === row[idName]
          )}
          onChange={(event) => {
            onCheckboxClick(row, event);
          }}
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
        />
      )
    );
  };

  const rowOpen = () => {
    return (
      <StyledArrow
        size={size}
        style={{
          visibility:
            row[leafName] && !treeIcons && !treeIcons?.leaf
              ? "hidden"
              : "visible",
        }}
        onClick={(event) => {
          (parentIconExpand ||
            (!parentIconExpand && row.children?.length !== 0)) &&
            onExpandIconClick(event);
        }}
      >
        {parentIconExpand ? (
          <ExpandIcon />
        ) : !parentIconExpand && row.children?.length === 0 ? (
          <Box width={"24px"} height={"24px"} />
        ) : (
          <ExpandIcon />
        )}
      </StyledArrow>
    );
  };

  return (
    <>
      {colIndex === 0 ? (
        <StyledTableCell
          _cell={col}
          _size={size}
          key={`tableCell-${colIndex}`}
          style={{
            ...(col.fixed && {
              position: "sticky",
              zIndex: "10",
              left: freezeWidth?.[colIndex],
            }),
            ...(headerCellWidth && {
              width: `${headerCellWidth}px`,
              minWidth: `${headerCellWidth}px`,
            }),
          }}
          ref={(ref) => (cellRefs.current[`${col.dataIndex}_${index}`] = ref)}
          data-testid={col.dataIndex + "-" + index + "-cell"}
        >
          <Box
            display={"flex"}
            key={`box-${colIndex}`}
            overflow={"hidden"}
            sx={{
              paddingLeft: "12px",
            }}
          >
            {firstCell(row.level)}
            {expanding && (
              <>
                {getCheckbox()}
                <TreeExpandLoadingIcon width={"20px"} />
              </>
            )}
            <>
              {!expanding && getCheckbox()}
              {rowOpen()}
              {expanded.some((item) => item === row[idName]) ? (
                <>
                  {treeIcons
                    ? row.leaf
                      ? treeIcons.leaf()
                      : treeIcons.expandedIcon()
                    : null}
                </>
              ) : (
                <>
                  {treeIcons
                    ? row.leaf
                      ? treeIcons.leaf()
                      : treeIcons.folder()
                    : null}
                </>
              )}
            </>

            <StyledFirstCellValue
              _size={size}
              alignContent={"middle"}
              data-testid={col.dataIndex + "-value"}
            >
              {cellValue}
            </StyledFirstCellValue>
          </Box>
        </StyledTableCell>
      ) : (
        <StyledTableCell
          _cell={col}
          _size={size}
          key={colIndex}
          style={{
            ...(col.fixed && {
              position: "sticky",
              zIndex: "10",
              left: freezeWidth?.[colIndex],
            }),
            ...(headerCellWidth && {
              width: `${headerCellWidth}px`,
              minWidth: `${headerCellWidth}px`,
            }),
          }}
          ref={(ref) => (cellRefs.current[`${col.dataIndex}_${index}`] = ref)}
          data-testid={col.dataIndex + "-" + index + "-cell"}
        >
          <StyledTableCellInnerBox
            key={`box-${colIndex}`}
            _size={size}
            data-testid={col.dataIndex + "-value"}
          >
            {cellValue}
          </StyledTableCellInnerBox>
        </StyledTableCell>
      )}
    </>
  );
};

export default TreeGridRowCell;
