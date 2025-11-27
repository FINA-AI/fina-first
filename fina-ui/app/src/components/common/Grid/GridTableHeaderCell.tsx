import React, { useEffect, useMemo, useState } from "react";
import { StyledComponentProps, TableCell } from "@mui/material";
import { GridColumnType } from "../../../types/common.type";
import { Box, styled } from "@mui/system";
import SortableButton from "./SortableButton";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import FilterContainer from "../Filter/FilterContainer";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { FilterTypes } from "../../../util/appUtil";
import CellResizer from "./CellResizer";
import { useTheme } from "@mui/material/styles";

interface GridTableHeaderCellProps {
  column: GridColumnType;
  prevColumn: GridColumnType | null;
  nextColumn: GridColumnType | null;
  tableRef: any;
  size: string;
  memoizedColumnsFields: any;
  activeSortColName: string;
  setActiveSortColName: any;
  orderRowByHeader: any;
  columnsFilter: any;
  setColumnsFilter: any;
  filterOnChangeFunction?: any;
  resizer: boolean;
  tableHeaderMainDivider: any;
  headerRefs: any;
  draggable: boolean;
  checkboxEnabled: boolean;
  cellRefs: any;
  getMemoizedFlexibleColumns: any;
  isGridFlexible: boolean;
}

interface StyledHeaderTableCellProps extends StyledComponentProps<string> {
  theme?: any;
  _column: GridColumnType;
  _nextColumn: GridColumnType | null;
  _prevColumn: GridColumnType | null;
  _cellSize: string;
  _getMemoizedLeftPosition: string | number;
  _isFilterActive: boolean;
  _hasFilter: boolean;
  _isGridFlexible: boolean;
  _isSortActive: boolean;
}

const StyledHeaderTableCell = styled(TableCell, {
  shouldForwardProp: (prop: string) => !prop.startsWith("_"),
})<StyledHeaderTableCellProps>(
  ({
    theme,
    _column,
    _nextColumn,
    _cellSize,
    _getMemoizedLeftPosition,
    _isFilterActive,
    _hasFilter,
    _isGridFlexible,
    _isSortActive,
  }) => ({
    ...theme.tableHeaderCell({ isSmall: _cellSize === "small" }),
    flex: _column.fixed || _column.width ? 0 : _column.flex || 1,
    minWidth: _column.width
      ? `${_column.width}px`
      : _column.fixed
      ? "200px"
      : "0px",

    width: _column.width
      ? `${_column.width}px`
      : _column.fixed
      ? "200px"
      : "0px",
    maxWidth:
      _column.fixed || _column.width
        ? _column.width
          ? `${_column.width}px`
          : _column.fixed
          ? "200px"
          : "0px"
        : "",
    position: _column.fixed ? "sticky" : "relative",
    left: _column.fixed ? _getMemoizedLeftPosition : "",
    zIndex: _column.fixed ? theme.zIndex.modal - 1 : theme.zIndex.modal - 2,
    color: theme.palette.mode === "dark" ? "#ABBACE" : "#2C3644",
    fontStyle: "normal",
    top: "0 !important",
    borderBottom: "none",
    borderTop: theme.palette.borderColor,
    borderRight:
      !_nextColumn?.fixed && _column.fixed
        ? theme.palette.borderColor
        : "inherit",
    overflow: "hidden",
    display: _isGridFlexible ? "flex" : "",
    alignItems: "center",
    "& #filterContainer": {
      display: _isFilterActive ? "flex" : "none",
      alignItems: "center",
    },
    "& #clearFilterBtn": {
      display: "none",
    },
    "& #sortAndFilterContainer": {
      display: _isFilterActive || _isSortActive ? "flex !important" : "",
      alignItems: "center",
      height: _cellSize === "small" ? "16px" : "20px",
      minWidth:
        _isFilterActive || _isSortActive ? (_hasFilter ? "40px" : "20px") : "",
      background: "inherit",
    },
    "&:hover": {
      "& #resizer_Root": {
        visibility: "visible",
      },
      background:
        theme.palette.mode === "dark" ? "#3C4D68" : theme.palette.action.hover,
      "& #filterContainer": {
        display: "flex",
        alignItems: "center",
      },
      "& #clearFilterBtn": {
        display: "inline-block",
      },
      "& #sortBtn": {
        visibility: "visible !important",
      },
      "& #sortAndFilterContainer": {
        display: "flex !important",
        alignItems: "center",
        height: _cellSize === "small" ? "16px" : "20px",
        minWidth: _hasFilter ? "40px" : "20px",
        background: "inherit",
      },
      "& #filterButton": {
        visibility: _isFilterActive ? "hidden" : "visible",
      },
    },
  })
);

const StyledClearIconContainer = styled(Box)<{ size: string }>(({ size }) => ({
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "width 0.3s ease, height 0.3s ease, top 0.3s ease",
  height: "30px",
  width: "30px",
  top: size === "small" ? "5px" : "8px",
  right: "4px",
  "& #clearFilterBtn": {
    width: "20px",
    height: "20px",
    transition: "width 0.3s ease, height 0.3s ease",
  },
}));

const StyledClearRoundedIcon = styled(ClearRoundedIcon)(() => ({
  width: "11px",
  cursor: "pointer",
  "& .MuiSvgIcon-root": {
    padding: "0px !important",
    borderRadius: "20px",
  },
}));

const GridTableHeaderCell: React.FC<GridTableHeaderCellProps> = ({
  column,
  prevColumn,
  tableRef,
  nextColumn,
  size,
  memoizedColumnsFields,
  activeSortColName,
  setActiveSortColName,
  orderRowByHeader,
  columnsFilter,
  setColumnsFilter,
  filterOnChangeFunction,
  resizer,
  tableHeaderMainDivider,
  headerRefs,
  draggable,
  checkboxEnabled,
  cellRefs,
  getMemoizedFlexibleColumns,
  isGridFlexible,
}) => {
  const theme: any = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  const [isFilterActive, setIsFilterActive] = useState<boolean>(false);
  const [isClearButtonActive, setIsClearButtonActive] =
    useState<boolean>(false);

  let addLeftPosition = (draggable ? 40 : 0) + (checkboxEnabled ? 40 : 0);

  const getMemoizedLeftPosition = useMemo(() => {
    if (tableRef) {
      if (column.fixed) {
        let leftPosition = "";

        for (let field of memoizedColumnsFields) {
          if (field === column.field) {
            leftPosition = leftPosition.trim().slice(0, -1);
            break;
          }
          leftPosition += `var(--${field.replace(".", "-")}-size) + `;
        }

        return `calc(((${leftPosition}) + ${addLeftPosition}) * 1px)`;
      }
    }
    return "none";
  }, [column, memoizedColumnsFields]);

  useEffect(() => {
    onActionButtonChange();
  }, [columnsFilter]);

  const open = Boolean(anchorEl);
  const filterOpenOnClickFunction = (event: any) => {
    event.stopPropagation();
    setIsFilterActive(true);
    setAnchorEl(event.currentTarget);
  };

  const onActionButtonChange = () => {
    if (column.filter) {
      let currentFilterItem = columnsFilter.find(
        (filter: any) => filter.name === column.filter.name
      );
      if (currentFilterItem) {
        switch (column.filter.type) {
          case FilterTypes.string:
          case FilterTypes.number:
          case FilterTypes.list:
            setIsFilterActive(currentFilterItem.value);
            setIsClearButtonActive(currentFilterItem.value);
            break;
          case FilterTypes.date:
            setIsFilterActive(currentFilterItem.start || currentFilterItem.end);
            setIsClearButtonActive(
              currentFilterItem.start || currentFilterItem.end
            );
            break;
          case FilterTypes.datePicker:
            setIsFilterActive(currentFilterItem.date);
            setIsClearButtonActive(currentFilterItem.date);
            break;
          case FilterTypes.users:
          case FilterTypes.fis:
            setIsFilterActive(currentFilterItem.value);
            setIsClearButtonActive(currentFilterItem.value);
            break;
          case FilterTypes.periods:
            setIsFilterActive(currentFilterItem.value);
            setIsClearButtonActive(currentFilterItem.value);
            break;
          case FilterTypes.country:
            setIsFilterActive(Boolean(currentFilterItem.value));
            setIsClearButtonActive(Boolean(currentFilterItem.value));
            break;
          case FilterTypes.numberBetween:
            setIsFilterActive(currentFilterItem.start || currentFilterItem.end);
            setIsClearButtonActive(
              currentFilterItem.start || currentFilterItem.end
            );
            break;
          case FilterTypes.dateAndTimePicker:
            setIsFilterActive(currentFilterItem.start || currentFilterItem.end);
            setIsClearButtonActive(
              currentFilterItem.start || currentFilterItem.end
            );
            break;
          default:
            setIsFilterActive(currentFilterItem.key);
            setIsClearButtonActive(currentFilterItem.key);
            break;
        }
      } else {
        setIsFilterActive(false);
        setIsClearButtonActive(false);
      }
    }
  };

  const onFilterCloseFunction = () => {
    setAnchorEl(null);
    let currentFilterItem = columnsFilter.find(
      (filter: any) => filter.name === column.filter.name
    );
    let isActive = false;
    if (column.filter && currentFilterItem) {
      switch (column.filter.type) {
        case FilterTypes.date:
          isActive = currentFilterItem.start || currentFilterItem.end;
          break;
        case FilterTypes.datePicker:
          isActive = currentFilterItem.date;
          break;
        case FilterTypes.users:
        case FilterTypes.fis:
          isActive = currentFilterItem.value;
          break;
        case FilterTypes.periods:
          isActive = currentFilterItem.value;
          break;
        case FilterTypes.country:
          isActive = Boolean(currentFilterItem.value);
          break;
        case FilterTypes.numberBetween:
          isActive = currentFilterItem.start || currentFilterItem.end;
          break;
        default:
          isActive = currentFilterItem.value;
          break;
      }
    }
    setIsFilterActive(isActive);
  };

  const onFilterClearFunction = () => {
    let result: any = [];
    setAnchorEl(null);
    setIsClearButtonActive(false);
    setIsFilterActive(false);
    let currentFilterItem = columnsFilter.find(
      (filter: any) => filter.name === column.filter.name
    );
    if (currentFilterItem) {
      switch (column.filter.type) {
        case FilterTypes.list:
          delete currentFilterItem.key;
          delete currentFilterItem.value;
          break;
        case FilterTypes.date:
          delete currentFilterItem.start;
          delete currentFilterItem.end;
          break;
        case FilterTypes.users:
        case FilterTypes.fis:
          delete currentFilterItem.value;
          break;
        case FilterTypes.periods:
          delete currentFilterItem.value;
          break;
        case FilterTypes.country:
          delete currentFilterItem.value;
          break;
        case FilterTypes.datePicker:
          delete currentFilterItem.date;
          break;
        case FilterTypes.numberBetween:
          delete currentFilterItem.start;
          delete currentFilterItem.end;
          break;
        case FilterTypes.dateAndTimePicker:
          delete currentFilterItem.start;
          delete currentFilterItem.end;
          break;
        default:
          delete currentFilterItem.value;
          break;
      }
      result = [
        ...columnsFilter.filter((f: any) => f.name !== column.filter.name),
      ];

      if (
        !(
          column.filter.type === FilterTypes.country &&
          !Boolean(currentFilterItem.value)
        )
      ) {
        result.push(currentFilterItem);
      }
    }
    if (columnsFilter.length && !currentFilterItem) {
      if (filterOnChangeFunction) filterOnChangeFunction(result);
      return;
    }
    setColumnsFilter(result);
    if (filterOnChangeFunction) filterOnChangeFunction(result);
  };

  const onFilterClickFunction = (data: any, filter: any) => {
    onFilterCloseFunction();
    if (filterOnChangeFunction) filterOnChangeFunction(data, filter);
  };

  return (
    <>
      <StyledHeaderTableCell
        _column={column}
        _nextColumn={nextColumn}
        _prevColumn={prevColumn}
        _cellSize={size}
        _getMemoizedLeftPosition={
          !prevColumn ? addLeftPosition : getMemoizedLeftPosition
        }
        _isFilterActive={isFilterActive}
        _hasFilter={Boolean(column.filter)}
        _isGridFlexible={isGridFlexible}
        _isSortActive={activeSortColName === column.field}
        onClick={(e) => {
          if (!column?.filter) return;
          filterOpenOnClickFunction(e);
        }}
        className={"headerTableCellClass"}
        data-testid={column?.field + "-header-cell"}
        ref={(ref: any) => {
          if (ref && tableRef) {
            headerRefs.current[column.field] = ref;

            const observer = new ResizeObserver((entries) => {
              for (let entry of entries) {
                const newWidth = entry.contentRect.right;
                if (newWidth > 0) {
                  tableRef.style.setProperty(
                    [`--${column.field.replaceAll(".", "-")}-size`],
                    `${newWidth}`
                  );
                } else if (newWidth - 11 <= 0) {
                  // TODO Fix cell sizing
                  tableRef.style.setProperty(
                    [`--${column.field.replaceAll(".", "-")}-size`],
                    11 + (column.width ? column.width : -11)
                  );
                }
              }
            });

            observer.observe(ref);
          }
        }}
      >
        <Box display={"flex"} alignItems={"center"} maxWidth={"100%"}>
          <Box
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            data-testid={column?.field + "-header-cell-content"}
          >
            {column.headerName}
          </Box>
          <Box
            style={{
              display:
                activeSortColName === column.field || isClearButtonActive
                  ? ""
                  : "none",
            }}
            id={"sortAndFilterContainer"}
          >
            <Box
              id={"sortBtn"}
              style={{
                visibility:
                  activeSortColName === column.field ? "visible" : "hidden",
              }}
            >
              <SortableButton
                cell={column}
                orderRowByHeader={orderRowByHeader}
                treeGrid={false}
                setActiveSortColName={setActiveSortColName}
                hasFilter={column.filter}
                size={size}
              />
            </Box>

            {column.filter && (
              <span id={"filterContainer"}>
                {isClearButtonActive && (
                  <StyledClearIconContainer size={size}>
                    <StyledClearRoundedIcon
                      id={"clearFilterBtn"}
                      onClick={(event) => {
                        event.stopPropagation();
                        onFilterClearFunction();
                        onFilterCloseFunction();
                      }}
                    />
                  </StyledClearIconContainer>
                )}
                <FilterListRoundedIcon
                  onClick={(event) => filterOpenOnClickFunction(event)}
                  style={{
                    right: "10px",
                    borderRadius: "50%",
                    position: "absolute",
                    cursor: "pointer",
                    color: isFilterActive
                      ? theme.palette.primary.main
                      : "inherit",
                  }}
                  id={"filterButton"}
                />
              </span>
            )}
          </Box>
          {resizer && (
            <CellResizer
              tableRef={tableRef}
              tableHeaderMainDivider={tableHeaderMainDivider}
              headerRefs={headerRefs}
              column={column}
              cellRefs={cellRefs}
              getMemoizedFlexibleColumns={getMemoizedFlexibleColumns}
              size={size}
              checkboxEnabled={checkboxEnabled}
            />
          )}
        </Box>
      </StyledHeaderTableCell>
      <FilterContainer
        open={open}
        onClose={() => {
          onFilterCloseFunction();
        }}
        onClear={() => {
          onFilterClearFunction();
        }}
        anchorEl={anchorEl}
        cell={column}
        columnsFilter={columnsFilter}
        setColumnsFilter={setColumnsFilter}
        onFilterClickFunction={onFilterClickFunction}
      />
    </>
  );
};

export default GridTableHeaderCell;
