import { Paper, Popover, Skeleton } from "@mui/material";
import { FilterTypes } from "../../../util/appUtil";
import React, { Suspense } from "react";
import {
  columnFilterConfigType,
  GridColumnType,
  TreeGridColumnType,
} from "../../../types/common.type";
import { styled } from "@mui/material/styles";

const TextFilter = React.lazy(() => import("./TextFilter"));
const DateFilter = React.lazy(() => import("./DateFilter"));
const ListFilter = React.lazy(() => import("./ListFilter"));
const DatePickerFilter = React.lazy(() => import("./DatePickerFilter"));
const NumberBetweenFilter = React.lazy(() => import("./NumberBetweenFilter"));
const DateAndTimeFilter = React.lazy(() => import("./DateAndTimeFilter"));

interface FilterContainerProps {
  open: boolean;
  onClose: (val: string) => void;
  anchorEl: null | HTMLElement;
  columnsFilter: columnsFilter[];
  setColumnsFilter: (val: columnsFilter[]) => void;
  onFilterClickFunction: (result: columnsFilter[], filter: filterType) => void;
  onClear: () => void;
  cell: GridColumnType | TreeGridColumnType;
}

interface columnsFilter {
  name: string;
  type: string;
  value?: any;
  date?: number;
  start?: number;
  end?: number;
  key?: string;
}

interface filterType {
  field: string;
  name: string;
  type: string;
}

const StyledPopover = styled(Popover, {
  shouldForwardProp: (prop) => prop !== "marginTop",
})<{ marginTop: number }>(({ marginTop, theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: (theme as any).palette.mode === "dark" && "#344258",
    border: (theme as any).palette.borderColor,
    borderRadius: "4px",
    minWidth: "467px !important",
    minHeight: "70px !important",
    maxHeight: "80px !important",
    overflow: "hidden !important",
    marginTop: marginTop,
    display: "flex",
    alignItems: "center",
    boxShadow:
      (theme as any).palette.mode === "dark" &&
      "0px 19px 38px 0px rgba(0, 0, 0, 0.30), 0px 15px 12px 0px rgba(0, 0, 0, 0.22)",
  },
}));

const Skeletons = () => {
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        height: "100%",
        width: "100%",
        padding: "0px 15px",
      }}
    >
      <Skeleton variant="rounded" width={"80%"} height={30} />
      <Skeleton variant="circular" width={30} height={30} />
      <Skeleton variant="circular" width={30} height={30} />
    </div>
  );
};

const FilterContainer: React.FC<FilterContainerProps> = ({
  open,
  onClose,
  anchorEl,
  cell,
  columnsFilter,
  setColumnsFilter,
  onFilterClickFunction,
  onClear,
}) => {
  const onFilterClick = (value: any, filter: filterType) => {
    if (!value) {
      onClear();
      return;
    } else if (typeof value === "string" && value.trim() === "") {
      onClear();
      return;
    } else if (Array.isArray(value) && value.length === 0) {
      onClear();
      return;
    } else if (typeof value === "object" && value !== null) {
      if (Object.keys(value).length === 0) {
        onClear();
        return;
      }
      if (value.type === "DATE" && !value.end && !value.start) {
        onClear();
        return;
      } else if (value.type === "DATE_PICKER" && !value.date) {
        onClear();
        return;
      }
    }

    let currentFilterItem: columnsFilter = {
      name: cell.filter.name,
      type: cell.filter.type,
    };
    if (currentFilterItem) {
      switch (cell?.filter?.type) {
        case FilterTypes.string:
        case FilterTypes.number:
          currentFilterItem.value = value;
          break;
        case FilterTypes.date:
          currentFilterItem.start = value.start;
          currentFilterItem.end = value.end;
          break;
        case FilterTypes.list:
          currentFilterItem.key = value.key;
          currentFilterItem.value = value.value;
          break;
        case FilterTypes.datePicker:
          currentFilterItem.date = value.date;
          break;
        case FilterTypes.numberBetween:
          currentFilterItem.start = value.start;
          currentFilterItem.end = value.end;
          break;
        case FilterTypes.dateAndTimePicker:
          currentFilterItem.start = value.start;
          currentFilterItem.end = value.end;
          break;
        default:
          currentFilterItem.value = value;
          break;
      }
    }
    let result = [
      ...columnsFilter.filter((f) => f.name !== cell.filter.name),
      currentFilterItem,
    ];
    onFilterClickFunction(result, filter);
    setColumnsFilter(result);
  };

  const GetListDefaultValue = () => {
    let result = { key: "", value: "" };
    let item = columnsFilter.filter(
      (el: columnFilterConfigType) => el.name === cell.filter.name
    );
    if (item.length !== 0) {
      result.key = item[0].key ?? "";
      result.value = item[0].value;
    } else {
      if (cell.filter.value) {
        result.key = cell.filter.name;
        result.value = cell.filter.value;
      }
    }
    return result;
  };

  const FilterComponent = ({
    cell,
  }: {
    cell: GridColumnType | TreeGridColumnType;
  }) => {
    if (cell.filter.renderFilter) {
      let value = columnsFilter.find(
        (el) => el.name === cell.filter.name
      )?.value;
      return cell.filter.renderFilter(
        columnsFilter,
        onFilterClick,
        onClear,
        value
      );
    } else {
      switch (cell.filter.type) {
        case FilterTypes.string:
          return (
            <TextFilter
              onClickFunction={(value) => onFilterClick(value, cell.filter)}
              label={cell.headerName}
              defaultValue={columnsFilter.find(
                (el) => el.name === cell.filter.name
              )}
              closeFilter={onClear}
              width={cell.filter.width}
            />
          );
        case FilterTypes.number:
          return (
            <TextFilter
              onClickFunction={(value) => onFilterClick(value, cell.filter)}
              defaultValue={columnsFilter.find(
                (el) => el.name === cell.filter.name
              )}
              label={cell.headerName}
              isOnlyNumber={true}
              closeFilter={onClear}
              width={cell.filter.width}
            />
          );
        case FilterTypes.date:
          return (
            <DateFilter
              onClickFunction={(value) => onFilterClick(value, cell.filter)}
              defaultValue={{
                ...columnsFilter.find((el) => el.name === cell.filter.name),
                name: cell.filter.name,
                type: cell.filter.type,
              }}
              closeFilter={onClear}
            />
          );

        case FilterTypes.list:
          return (
            <ListFilter
              label={cell.headerName}
              onClickFunction={(value) => onFilterClick(value, cell.filter)}
              defaultValue={GetListDefaultValue()}
              optionsArray={cell.filter.filterArray}
              closeFilter={onClear}
              width={cell.filter.width}
            />
          );
        case FilterTypes.datePicker:
          return (
            <DatePickerFilter
              label={cell.headerName}
              onClickFunction={(value) => onFilterClick(value, cell.filter)}
              defaultValue={{
                ...columnsFilter.find((el) => el.name === cell.filter.name),
                name: cell.filter.name,
                type: cell.filter.type,
              }}
              closeFilter={onClear}
            />
          );

        case FilterTypes.numberBetween:
          return (
            <NumberBetweenFilter
              onClickFunction={(value) => onFilterClick(value, cell.filter)}
              defaultValue={{
                ...columnsFilter.find((el) => el.name === cell.filter.name),
                name: cell.filter.name,
                type: cell.filter.type,
              }}
              closeFilter={onClear}
            />
          );
        case FilterTypes.dateAndTimePicker:
          return (
            <DateAndTimeFilter
              onClickFunction={(value) => onFilterClick(value, cell.filter)}
              defaultValue={{
                ...columnsFilter.find((el) => el.name === cell.filter.name),
                name: cell.filter.name,
                type: cell.filter.type,
              }}
              closeFilter={onClear}
            />
          );
        default:
          return (
            <TextFilter
              onClickFunction={(value) => onFilterClick(value, cell.filter)}
              defaultValue={columnsFilter.find(
                (el) => el.name === cell.filter.name
              )}
              label={cell.headerName}
              closeFilter={onClear}
            />
          );
      }
    }
  };

  return (
    <StyledPopover
      marginTop={
        anchorEl?.classList?.contains("headerTableCellClass") ? 48 : 30
      }
      open={open}
      anchorEl={anchorEl}
      onClose={() => onClose("")}
      slotProps={{
        paper: {
          "data-testid": "filter-container",
        } as React.ComponentProps<typeof Paper>,
      }}
    >
      {open && (
        <Suspense fallback={<Skeletons />}>
          <FilterComponent cell={cell} />
        </Suspense>
      )}
    </StyledPopover>
  );
};

export default FilterContainer;
