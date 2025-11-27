import { TableCell } from "@mui/material";
import { Box } from "@mui/system";
import SortableButton from "../Grid/SortableButton";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import FilterContainer from "../Filter/FilterContainer";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import React, { FC, useEffect, useState } from "react";
import { FilterTypes } from "../../../util/appUtil";
import CellResizer from "./CellResizer";
import { TreeGridColumnType } from "../../../types/common.type";
import { styled, useTheme } from "@mui/material/styles";

interface TreeGridHeaderCellProps {
  refArray: any;
  widthArray: number[];
  borderColor: string;
  headerFontWeight: number;
  columnsFilter: any[];
  setColumnsFilter: any;
  orderRowByHeader?: (cellName: string, arrowDirection: string) => void;
  col: TreeGridColumnType;
  i: number;
  filterOnChangeFunction: (filter: any) => void;
  size?: string;
  setActiveSortColName: React.Dispatch<React.SetStateAction<string>>;
  activeSortColName: string;
  cellRefs: any;
  headerRefs: any;
  resizer: boolean;
  columns: TreeGridColumnType[];
  hideCheckBox?: boolean;
  tableRef: any;
  tableContainerRef: any;
  tableHeaderMainDivider: any;
}

const StyledHeaderText = styled(Box)<{ size: string }>(({ theme, size }) => ({
  ...(theme as any).tableHeaderCell({ size }),
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  background: "transparent !important",
}));

const StyledSortableBtn = styled("span")<{
  size: string;
  sortBtmActive: boolean;
}>(({ size, sortBtmActive }) => ({
  display: "flex",
  "& .MuiSvgIcon-root": {
    width: size === "small" ? "16px" : "",
    height: size === "small" ? "16px" : "",
    color: "#707C93",
  },
  visibility: sortBtmActive ? "visible" : "hidden",
}));

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
  color: "#707C93",
  "& .MuiSvgIcon-root": {
    padding: "0px !important",
    borderRadius: "20px",
  },
}));

const TreeGridHeaderCell: FC<TreeGridHeaderCellProps> = ({
  refArray,
  widthArray,
  borderColor,
  headerFontWeight,
  columnsFilter,
  setColumnsFilter,
  orderRowByHeader,
  col,
  i,
  filterOnChangeFunction,
  size = "default",
  setActiveSortColName,
  activeSortColName,
  cellRefs,
  headerRefs,
  resizer,
  columns,
  hideCheckBox,
  tableRef,
  tableContainerRef,
  tableHeaderMainDivider,
}) => {
  const theme: any = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [isClearButtonActive, setIsClearButtonActive] = useState(false);
  const open = Boolean(anchorEl);

  useEffect(() => {
    onActionButtonChange();
  }, [columnsFilter]);

  const filterOpenOnClickFunction = (event: any) => {
    setIsFilterActive(true);
    setAnchorEl(event.currentTarget);
  };

  const onActionButtonChange = () => {
    if (col.filter) {
      let currentFilterItem = columnsFilter.find(
        (filter) => filter.name === col.filter.name
      );
      if (!currentFilterItem) {
        setIsFilterActive(false);
        setIsClearButtonActive(false);
      }
      if (currentFilterItem) {
        switch (col.filter.type) {
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
          case FilterTypes.country:
            setIsFilterActive(currentFilterItem.value);
            setIsClearButtonActive(currentFilterItem.value);
            break;
          default:
            setIsFilterActive(currentFilterItem.key);
            setIsClearButtonActive(currentFilterItem.key);
            break;
        }
      }
    }
  };

  const onFilterCloseFunction = () => {
    setAnchorEl(null);
    let currentFilterItem = columnsFilter.find(
      (filter) => filter.name === col.filter.name
    );
    let isActive = false;
    if (col.filter && currentFilterItem) {
      switch (col.filter.type) {
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
        default:
          isActive = currentFilterItem.value;
          break;
      }
    }
    setIsFilterActive(isActive);
  };

  const onFilterClearFunction = () => {
    setAnchorEl(null);
    setIsClearButtonActive(false);
    setIsFilterActive(false);
    let currentFilterItem = columnsFilter.find(
      (filter) => filter.name === col.filter.name
    );
    if (currentFilterItem) {
      switch (col.filter.type) {
        case FilterTypes.list:
          delete currentFilterItem.key;
          delete currentFilterItem.value;
          break;
        case FilterTypes.date:
          delete currentFilterItem.start;
          delete currentFilterItem.end;
          break;
        case FilterTypes.datePicker:
          delete currentFilterItem.date;
          break;
        case FilterTypes.users:
        case FilterTypes.fis:
          delete currentFilterItem.value;
          break;
        default:
          delete currentFilterItem.value;
          break;
      }
      let result: any = [
        ...columnsFilter.filter((f) => f.name !== col.filter.name),
        currentFilterItem,
      ];
      setColumnsFilter(result);
      filterOnChangeFunction(result);
    }
  };

  const onFilterClickFunction = (data: any) => {
    onFilterCloseFunction();
    filterOnChangeFunction(data);
  };

  return (
    <>
      <TableCell
        ref={(ref: any) => {
          refArray.current[i] = ref;
          headerRefs.current.headerCells[col.dataIndex ? col.dataIndex : ""] =
            ref;
        }}
        key={i}
        onClick={(e) => {
          e.stopPropagation();
          if (!col?.filter) return;
          filterOpenOnClickFunction(e);
        }}
        sx={{
          overflow: "hidden",
          ...(col.flex || col.minWidth
            ? {
                flex: col.flex || 1,
                minWidth: col.minWidth,
              }
            : col.width
            ? {
                minWidth: col.width,
                width: col.width,
                maxWidth: col.width,
              }
            : { flex: 1 }),
          "&.MuiTableCell-root": {
            fontWeight: headerFontWeight,
            borderColor: borderColor ? `${borderColor} !important` : "",
            zIndex: "20",
            position: "sticky",
            maxHeight: size === "small" ? "41px" : "49px",
            minWidth: col.minWidth ? col.minWidth : "",
          },
          left: col.fixed ? widthArray[i] : "",
          "& #filterContainer": {
            display: isFilterActive ? "flex" : "none",
            alignItems: "center",
          },
          "& #clearFilterBtn": {
            display: "none",
          },
          "&:hover": {
            "& #resizer_Root": {
              visibility: "visible",
            },
            "& #filterContainer": {
              display: "flex",
              alignItems: "center",
            },
            background: theme.palette.action.hover,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0px 1px 0px #1d2632"
                : "0px 1px 0px #EAEBF0",
            "& #clearFilterBtn": {
              display: "inline-block",
            },
            "& #sortBtn": {
              visibility: "visible",
            },
            "& #filterButton": {
              visibility: isFilterActive ? "hidden" : "visible",
            },
          },
        }}
        data-testid={col?.dataIndex + "-header-cell"}
      >
        <Box
          display={"flex"}
          alignItems={"center"}
          style={{
            height: "inherit",
            ...(i === 0 && {
              paddingLeft: hideCheckBox
                ? "35px"
                : size === "small"
                ? "55px"
                : "75px",
            }),
          }}
        >
          <StyledHeaderText size={size}>{col.title}</StyledHeaderText>
          <StyledSortableBtn
            sortBtmActive={activeSortColName === col.dataIndex}
            size={size}
            id={"sortBtn"}
          >
            <SortableButton
              orderRowByHeader={orderRowByHeader}
              setActiveSortColName={setActiveSortColName}
              cell={col}
              treeGrid={true}
              hasFilter={Boolean(col.filter)}
              size={size}
            />
          </StyledSortableBtn>
          {col.filter && (
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
                    : "#707C93",
                }}
                id={"filterButton"}
              />
            </span>
          )}

          {resizer && (
            <CellResizer
              cellRefs={cellRefs}
              colName={col.dataIndex ? col.dataIndex : ""}
              headerRefs={headerRefs}
              columns={columns.map((col: TreeGridColumnType) => {
                return { ...col, field: col.dataIndex };
              })}
              checkboxEnabled={hideCheckBox}
              size={size}
              virtualized={false}
              tableRef={tableRef.current}
              tableHeaderMainDivider={tableHeaderMainDivider}
              tableContainerRef={tableContainerRef}
              draggable={false}
            />
          )}
        </Box>
      </TableCell>
      <FilterContainer
        open={open}
        onClose={() => {
          onFilterCloseFunction();
        }}
        onClear={() => {
          onFilterClearFunction();
        }}
        anchorEl={anchorEl}
        cell={col}
        columnsFilter={columnsFilter}
        setColumnsFilter={setColumnsFilter}
        onFilterClickFunction={onFilterClickFunction}
      />
    </>
  );
};

export default TreeGridHeaderCell;
