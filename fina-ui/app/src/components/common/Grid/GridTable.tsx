import React, {
  memo,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Box } from "@mui/system";
import { Table, Typography } from "@mui/material";
import { GridColumnType } from "../../../types/common.type";
import { FilterTypes } from "../../../util/appUtil";
import MainGridSkeleton from "../../FI/Skeleton/GridSkeleton/MainGridSkeleton";
import { useTranslation } from "react-i18next";
import { DragDropContext } from "react-beautiful-dnd";
import { styled } from "@mui/material/styles";

const EmptyDataIcon = React.lazy(() =>
  import("../../../api/ui/icons/EmptyDataIcon").then((module) => ({
    default: module.EmptyDataIcon,
  }))
);
const GridTableHeader = React.lazy(() => import("./GridTableHeader"));
const GridTableBody = React.lazy(() => import("./GridTableBody"));

interface GridTableProps {
  columns: GridColumnType[];
  rows: any[];
  size?: string;
  draggable?: boolean;
  checkboxEnabled?: boolean;
  disableRowSelection?: boolean;
  singleRowSelect?: boolean;
  checkboxSelection?: boolean;
  virtualized?: boolean;
  loading?: boolean;
  columnFilterConfig?: any;
  orderRowByHeader?: any;
  setRows?: any;
  filterOnChangeFunction?: any;
  resizer?: boolean;
  selectedRows?: any;
  rowOnClick?: any;
  onCheckboxClick?: any;
  scrollToIndex?: any;
  emptyIconStyle?: any;
  actionButtons?: any;
  onCellValueChange?: any;
  viewMode?: boolean;
  rowStyleSetter?: any;
}

const StyledTable = styled(Table)(() => ({
  borderCollapse: "unset",
  position: "relative",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  width: "100%",
  minHeight: "0px",
  minWidth: "0px",
  overflow: "hidden",
}));

const StyledEmptyDataContainer = styled(Box)(({ theme }: any) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  overflow: "auto",
  backgroundColor: theme.palette.paperBackground,
}));

const GridTable: React.FC<GridTableProps> = ({
  columns = [],
  rows = [],
  setRows,
  size = "default",
  draggable = false,
  checkboxEnabled = false,
  orderRowByHeader,
  filterOnChangeFunction,
  resizer = true,
  selectedRows,
  rowOnClick,
  onCheckboxClick,
  scrollToIndex,
  disableRowSelection = false,
  singleRowSelect = false,
  checkboxSelection = false,
  virtualized = false,
  loading,
  columnFilterConfig = [],
  emptyIconStyle = {},
  actionButtons,
  onCellValueChange,
  viewMode = false,
  rowStyleSetter,
}) => {
  let isEmpty = rows.length === 0;
  const { t } = useTranslation();
  const tableRef = useRef<any>();
  const headerRef = useRef<any>(null);
  const headerRefs = useRef<any>([]);
  const cellRefs = useRef<any>([]);
  const [columnsFilter, setColumnsFilter] = useState<any>([]);
  const [checkedRows, setCheckedRows] = useState<any>([]);
  const [selectedRowsState, setSelectedRowsState] = useState<any>([]);
  const [visibleColumns, setVisibleColumns] = useState<GridColumnType[]>([]);
  const getObjValueByKeys = (obj: object, keys: any[]) => {
    let val: any = obj;
    for (let i: number = 0; i < keys.length; i++) {
      val = val[keys[i]] ?? "";
    }

    return typeof val === "string" ? val.trimStart().toLowerCase() : val;
  };

  const orderRowByHeaderDefault = (
    cellName: string,
    arrowDirection: string
  ) => {
    let i = arrowDirection === "up" ? 1 : -1;
    let keys = cellName.split(".");
    setRows([
      ...rows.sort((a, b) =>
        getObjValueByKeys(a, keys) > getObjValueByKeys(b, keys) ? i : i * -1
      ),
    ]);
  };

  const useCallbackOrderRowByHeader = useCallback(
    (cellName: string, arrowDirection: string) => {
      return orderRowByHeader
        ? orderRowByHeader(cellName, arrowDirection)
        : orderRowByHeaderDefault(cellName, arrowDirection);
    },
    [orderRowByHeader, rows]
  );

  useEffect(() => {
    if (selectedRows) {
      setSelectedRowsState(selectedRows);
      if (checkboxEnabled) {
        setCheckedRows(selectedRows);
      }
    }
  }, [selectedRows]);

  useEffect(() => {
    const nonHiddenColumns = columns.filter((col) => !col.hidden);
    setVisibleColumns(nonHiddenColumns);
    initColumnFilters(nonHiddenColumns);

    if (headerRef?.current) resetCellStyles(headerRefs.current);
    if (cellRefs?.current) resetCellStyles(cellRefs.current);

    // if (headerRefs && headerRefs.current && tableRef && tableRef.current) {
    //   tableRef.current.style.cssText = "";
    //   Object.entries(headerRefs.current).forEach((entry) => {
    //     const [key, value] = entry;
    //     if (value instanceof HTMLElement) {
    //       const tableElement = tableRef.current;
    //       if (!key) return;
    //       const cellStyle = tableElement.querySelector(`.${key}`)?.style;
    //
    //       if (cellStyle) {
    //         cellStyle.setPropertysetProperty(
    //           `--${key.replaceAll(".", "-")}-size`,
    //           value.getBoundingClientRect().width + "px"
    //         );
    //       }
    //     }
    //   });
    // }
  }, [columns]);

  const initColumnFilters = (columns: GridColumnType[]) => {
    let filters = [...columnsFilter];
    for (let col of columns) {
      if (
        col.filter &&
        (col.filter.value || col.filter.start || col.filter.end)
      ) {
        let obj: any = {
          name: col.filter.name,
          type: col.filter.type,
        };
        switch (col.filter.type) {
          case FilterTypes.string:
          case FilterTypes.number:
            obj.value = col.filter.value;
            break;
          case FilterTypes.list:
            obj.key = col.filter.name;
            obj.value = col.filter.value;
            break;
          case FilterTypes.date:
            obj.start = col.filter.start;
            obj.end = col.filter.end;
            break;
          case FilterTypes.numberBetween:
            obj.start = col.filter.start;
            obj.end = col.filter.end;
            break;
          case FilterTypes.datePicker:
            obj.date = col.filter.value;
            break;
          default:
            obj.value = col.filter.value;
            break;
        }

        const existing = filters.find((item) => item.name === obj.name);

        if (existing) Object.assign(existing, obj);
        else filters.push(obj);
      }
    }
    setColumnsFilter(filters);
  };

  const onRowClick = (row: any, event: any) => {
    if (!disableRowSelection) {
      setSelectedRowsState((prevState: any) => {
        const alreadySelected = prevState.some(
          (item: any) => item.id === row.id
        );

        let clickedRows = alreadySelected ? [] : [row];
        let isKeyboardShortcutKeyClicked = false;

        if (!singleRowSelect) {
          if (event.ctrlKey || event.metaKey) {
            clickedRows = [row, ...prevState];
            isKeyboardShortcutKeyClicked = true;
          } else if (event.shiftKey) {
            isKeyboardShortcutKeyClicked = true;
            const lastSelectedRow =
              prevState.length === 0 ? null : prevState[0];
            let startIndex =
              lastSelectedRow == null
                ? 0
                : rows.findIndex((r) => r.id === lastSelectedRow.id);

            let endIndex = rows.findIndex((r) => r.id === row.id);

            const subarray = rows.slice(
              startIndex > endIndex ? endIndex : startIndex,
              endIndex < startIndex ? startIndex : endIndex + 1
            );
            clickedRows = [...subarray, ...prevState];
          }
        }
        if (singleRowSelect && checkboxSelection) {
          setCheckedRows(clickedRows);
        } else if (checkboxSelection) {
          setCheckedRows(clickedRows);
        }

        if (rowOnClick) {
          rowOnClick(
            row,
            alreadySelected,
            clickedRows,
            isKeyboardShortcutKeyClicked
          );
        }
        return clickedRows;
      });
    }
  };

  const onRowCheckboxClick = useCallback(
    (row: any, event: any) => {
      const checked = event.target.checked;
      if (!singleRowSelect) {
        setCheckedRows((prevState: any) => {
          let checkedRowsData = [];
          if (checked) {
            checkedRowsData = [row, ...prevState];
          } else {
            checkedRowsData = prevState.filter(
              (item: any) => item.id !== row.id
            );
          }
          if (onCheckboxClick) {
            onCheckboxClick(row, checkedRowsData);
          }

          return checkedRowsData;
        });

        if (!disableRowSelection && checkboxSelection) {
          setSelectedRowsState((prevState: any) => {
            let checkedRowsData = [];

            if (checked) {
              checkedRowsData = [row, ...prevState];
            } else {
              checkedRowsData = prevState.filter(
                (item: any) => item.id !== row.id
              );
            }
            return checkedRowsData;
          });
        }
      } else {
        setCheckedRows([row]);

        if (!disableRowSelection && checkboxSelection) {
          setSelectedRowsState([row]);
        }
        if (onCheckboxClick) {
          onCheckboxClick(row, [row]);
        }
      }
    },
    [selectedRows, rows]
  );

  const headerCheckboxChangeFunction = (checked: any) => {
    setCheckedRows(checked ? rows : []);
    if (onCheckboxClick) onCheckboxClick(null, checked ? rows : []);
  };

  const useCallBackHeaderCheckboxChangeFunction = useCallback(
    (checked: any) => {
      return headerCheckboxChangeFunction(checked);
    },
    [rows]
  );

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const updatedRows = [...rows];

    const [draggedRow] = updatedRows.splice(result.source.index, 1);
    updatedRows.splice(result.destination.index, 0, draggedRow);

    setRows(updatedRows);
  };

  const CustomGridTableBody = () => {
    return (
      <Suspense>
        <GridTableBody
          columns={visibleColumns}
          bodyRows={rows}
          selectedRows={selectedRowsState}
          checkedRows={checkedRows}
          onRowClick={onRowClick}
          onCheckboxClick={onRowCheckboxClick}
          scrollRef={tableRef}
          checkboxEnabled={checkboxEnabled}
          singleRowSelect={singleRowSelect}
          actionButtons={actionButtons}
          size={size}
          onCellValueChange={onCellValueChange}
          virtualized={virtualized}
          cellRefs={cellRefs}
          headerColumnRefs={headerRefs}
          draggable={draggable}
          headerRefs={headerRefs}
          tableContainerRef={tableRef}
          viewMode={viewMode}
          rowStyleSetter={rowStyleSetter}
          tableRef={tableRef}
          headerRef={headerRef}
          scrollToIndex={scrollToIndex}
        />
      </Suspense>
    );
  };

  const resetCellStyles = (refs: Record<string, HTMLElement | null>) => {
    for (const el of Object.values(refs)) {
      if (el) {
        el.style.width = "";
        el.style.flex = "";
        el.style.minWidth = "";
        el.style.maxWidth = "";
      }
    }
  };

  return (
    <StyledTable ref={tableRef}>
      <Suspense>
        <GridTableHeader
          columns={columns.filter((col) => !col.hidden)}
          tableRef={tableRef.current}
          memoizedColumnsLength={visibleColumns.length}
          size={size}
          memoizedColumnsFields={visibleColumns.map((column) => column.field)}
          orderRowByHeader={useCallbackOrderRowByHeader}
          columnsFilter={columnsFilter}
          setColumnsFilter={setColumnsFilter}
          filterOnChangeFunction={filterOnChangeFunction}
          resizer={resizer}
          headerRefs={headerRefs}
          checkboxEnabled={checkboxEnabled}
          checkedRows={checkedRows}
          isChecked={checkedRows.length > 0}
          onCheckboxClick={useCallBackHeaderCheckboxChangeFunction}
          rowCount={rows.length}
          draggable={draggable}
          singleRowSelect={singleRowSelect}
          columnFilterConfig={columnFilterConfig}
          cellRefs={cellRefs}
          headerRef={headerRef}
        />
      </Suspense>
      {!loading &&
        rows.length !== 0 &&
        (draggable ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            {CustomGridTableBody()}
          </DragDropContext>
        ) : (
          CustomGridTableBody()
        ))}
      {loading && (
        <MainGridSkeleton
          columns={visibleColumns}
          columnFilterConfig={columnFilterConfig}
          checkboxEnabled={checkboxEnabled}
          size={size}
        />
      )}
      {!loading && rows && isEmpty && (
        <StyledEmptyDataContainer>
          <div style={{ ...emptyIconStyle }}>
            <Box display={"flex"} flexDirection={"column"} overflow={"hidden"}>
              <Suspense>
                <EmptyDataIcon />
              </Suspense>
              <Typography>{t("noRecordInFile")}</Typography>
            </Box>
          </div>
        </StyledEmptyDataContainer>
      )}
    </StyledTable>
  );
};

export default memo(GridTable);
