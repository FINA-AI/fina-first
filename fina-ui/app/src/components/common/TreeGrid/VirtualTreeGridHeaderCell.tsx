import { Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import SortableButton from "../Grid/SortableButton";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import FilterContainer from "../Filter/FilterContainer";
import React, { useState } from "react";
import { FilterTypes } from "../../../util/appUtil";
import { useTheme } from "@mui/material/styles";
import { TreeGridColumnType } from "../../../types/common.type";

interface VirtualTreeGridHeaderCellProps {
  column: TreeGridColumnType;
  sort: { dataIndex: string; direction: string };
  size: string;
  orderRowByHeader: (column: any, direction: string) => void;
  filterOnChangeFunction?: any;
  columnsFilter?: any;
  setColumnsFilter?: any;
}

const StyledCellRoot = styled(Box, {
  shouldForwardProp: (props) => props !== "isClearActive",
})<{ isClearActive: boolean }>(({ isClearActive }) => ({
  display: "flex",
  alignItems: "center",
  width: "100%",
  height: "100%",
  "& #filterContainer, & #clearFilterBtn": {
    display: "none",
    alignItems: "center",
  },
  "&:hover": {
    "& #sortButton, & #filterContainer": {
      display: "flex !important",
    },
    "& #clearFilterBtn": {
      display: isClearActive ? "block" : "none",
    },
    "& #filterButton": {
      display: isClearActive ? "none" : "block",
    },
  },
}));

const VirtualTreeGridHeaderCell: React.FC<VirtualTreeGridHeaderCellProps> = ({
  column,
  sort,
  size,
  orderRowByHeader,
  filterOnChangeFunction,
  columnsFilter,
  setColumnsFilter,
}) => {
  const theme: any = useTheme();

  const [isFilterActive, setIsFilterActive] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  const open = Boolean(anchorEl);
  const [isClearButtonActive, setIsClearButtonActive] =
    useState<boolean>(false);

  const filterOpenOnClickFunction = (event: any) => {
    event.stopPropagation();
    setIsFilterActive(true);
    setAnchorEl(event.currentTarget);
  };

  const onFilterCloseFunction = (columnsFilter: any) => {
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
        case FilterTypes.string:
          isActive = currentFilterItem.value;
          break;
      }
    }
    setIsFilterActive(isActive);
    setIsClearButtonActive(isActive);
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
        case FilterTypes.date:
          delete currentFilterItem.start;
          delete currentFilterItem.end;
          break;
        case FilterTypes.string:
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
    setColumnsFilter(result);
    if (filterOnChangeFunction) filterOnChangeFunction(result);
  };

  const onFilterClickFunction = (data: any, filter: any) => {
    onFilterCloseFunction(data);
    if (filterOnChangeFunction) filterOnChangeFunction(data, filter);
  };

  return (
    <>
      <StyledCellRoot
        isClearActive={isClearButtonActive}
        onClick={(e) => {
          if (!column?.filter) return;
          filterOpenOnClickFunction(e);
        }}
        data-testid={column.dataIndex + "-cell"}
      >
        <Typography>{column.title}</Typography>
        <Box sx={{ display: "flex" }}>
          {column.sortable && (
            <Box display={sort.direction ? "" : "none"} id={"sortButton"}>
              <SortableButton
                orderRowByHeader={orderRowByHeader}
                cell={column}
                size={size}
                hasFilter={true}
                treeGrid={true}
              />
            </Box>
          )}
          {column.filter && (
            <span
              id={"filterContainer"}
              style={{ display: isFilterActive ? "flex" : "none" }}
            >
              <ClearRoundedIcon
                id={"clearFilterBtn"}
                sx={{
                  cursor: "pointer",
                  position: "absolute",
                  right: "10px",
                  "& .MuiSvgIcon-root": {
                    padding: "0px !important",
                    borderRadius: "20px",
                  },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onFilterClearFunction();
                  onFilterCloseFunction(columnsFilter);
                }}
              />
              <FilterListRoundedIcon
                onClick={(event) => filterOpenOnClickFunction(event)}
                sx={{
                  cursor: "pointer",
                  right: "10px",
                  borderRadius: "50%",
                  position: "absolute",
                  color: isFilterActive
                    ? theme.palette.primary.main
                    : "inherit",
                }}
                id={"filterButton"}
              />
            </span>
          )}
        </Box>
      </StyledCellRoot>
      <FilterContainer
        open={open}
        onClose={() => {
          onFilterCloseFunction(columnsFilter);
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

export default VirtualTreeGridHeaderCell;
