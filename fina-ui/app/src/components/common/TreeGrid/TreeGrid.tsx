import React, {
  FC,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Box, Table, TableBody } from "@mui/material";
import withLoading from "../../../hoc/withLoading";
import NoRecordIndicator from "../NoRecordIndicator/NoRecordIndicator";
import {
  TreeGridColumnType,
  TreeGridStateType,
} from "../../../types/common.type";
import { styled } from "@mui/material/styles";
import { FilterTypes } from "../../../util/appUtil";

const TreeGridRow = React.lazy(() => import("./TreeGridRow"));
const TreeGridHeader = React.lazy(() => import("./TreeGridHeader"));

interface TreeGridProps {
  treeState: TreeGridStateType;
  setTreeState: React.Dispatch<React.SetStateAction<TreeGridStateType>>;
  columns: TreeGridColumnType[];
  data: any[];
  rootId: number;
  fetchFunction: any;
  checkboxClickHandler: any;
  idName: string;
  parentIdName: string;
  leafName: string;
  hideHeader: boolean;
  hideCheckBox: boolean;
  loading: boolean;
  headerFontWeight: number;
  borderColor: string;
  childrenColor: string;
  parentIconExpand: boolean;
  hideActionBtn: boolean;
  actionButtons: any;
  orderRowByHeader?: (cellName: string, direction: string) => void;
  filterOnChangeFunction: any;
  size: string;
  defaultExpandedRowsIds: number[];
  emptyIcon: boolean;
  resizer: boolean;
  treeIcons: { [key: string]: () => JSX.Element };
  rowSelectHandler: (
    row: any,
    rowsClicked: any[],
    isKeyboardShortcutKeyClicked: boolean,
    alreadySelected: boolean
  ) => void;
  onDoubleClick: (row: any) => void;
  onContextMenu?: any;
  selectedCutNode?: any;
  onNodeExpandChange?: (ids: number[]) => void;
}

const StyledRoot = styled(Box)<{ loading: boolean }>(({ theme, loading }) => ({
  position: "relative",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: (theme as any).palette.paperBackground,
  overflow: loading ? "hidden" : "auto",
  "& .MuiTableCell-stickyHeader ": {
    left: "auto",
  },
  "& .MuiTable-root": {
    display: "table",
  },
}));

const TreeGrid: FC<TreeGridProps> = ({
  treeState,
  setTreeState,
  columns = [],
  data,
  rootId,
  fetchFunction,
  checkboxClickHandler = () => {},
  idName = "id",
  parentIdName = "parentId",
  leafName = "leaf",
  hideHeader = false,
  hideCheckBox = false,
  // singleSelect = false,
  loading,
  headerFontWeight,
  borderColor,
  childrenColor,
  parentIconExpand = true,
  hideActionBtn = false,
  actionButtons,
  orderRowByHeader,
  filterOnChangeFunction,
  size = "default",
  defaultExpandedRowsIds,
  emptyIcon = true,
  resizer = true,
  treeIcons,
  rowSelectHandler,
  onDoubleClick,
  onContextMenu,
  selectedCutNode,
  onNodeExpandChange,
}) => {
  const [expanded, setExpanded] = useState<number[]>([]);
  const [columnsFilter, setColumnsFilter] = useState<any>([]);
  const [freezeWidth, setFreezeWidth] = useState<number[]>([]);
  const [checkedRows, setCheckedRows] = useState<any[]>([]);
  const [selectedRowsState, setSelectedRowsState] = useState<any[]>([]);
  const [halfCheckedRows, setHalfCheckedRows] = useState<any[]>([]);

  const cellRefs = useRef([]);
  const headerRefs = useRef({ headerCells: [], headerCellWidths: [] });
  const tableRef: React.MutableRefObject<any> = useRef();
  const tableContainerRef: React.MutableRefObject<any> = useRef();
  const scrollRef = useRef();
  let treeRowIndex = 0;

  useEffect(() => {
    fetchData(rootId);
    setSelectedRowsState([]);
    setCheckedRows([]);
    setHalfCheckedRows([]);
    setExpanded([]);

    if (
      defaultExpandedRowsIds &&
      defaultExpandedRowsIds.length === 0 &&
      expanded.length > 0
    ) {
      data.forEach((item: any) => {
        if (expanded.includes(item[idName])) {
          item.expanded = true;
        }
      });
    }

    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTop = 0;
    }
  }, [data]);

  useEffect(() => {
    if (defaultExpandedRowsIds?.length) {
      setExpanded([...defaultExpandedRowsIds]);
      restoreExpandedNodes(defaultExpandedRowsIds);
    } else {
      setExpanded([]);
    }
  }, [defaultExpandedRowsIds]);

  useEffect(() => {
    setTreeState((prevState) => ({
      ...prevState,
      columns: columns,
    }));
    initColumnFilters(columns);
  }, [columns]);

  useEffect(() => {
    if (onNodeExpandChange) {
      onNodeExpandChange(expanded);
    }
  }, [expanded]);

  const initColumnFilters = useCallback((columns: TreeGridColumnType[]) => {
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
        filters.push(obj);
      }
    }
    setColumnsFilter(filters);
  }, []);

  const addChildren = async (row: {
    children: any[];
    level: number;
    [key: string]: any;
  }) => {
    if (!row.children || row.children.length === 0) {
      row.children = await fetchFunction(row[idName], data, row);
      row.children = row.children.map((e) => ({
        ...e,
        level: row.level === undefined ? 0 : row.level + 1,
      }));
      setTreeState({ ...treeState, treeData: [...treeState.treeData] });
      if (row.children.length > 0 && selectedRowsState.length > 1) {
        selectedRowsState.find(
          (r) => r.rowId === row.children[0].parentRowId
        ) && setSelectedRowsState([...selectedRowsState, ...row.children]);
      }
      //check && add children after expanding
      if (checkedRows.find((item) => item[idName] === row[idName])) {
        setCheckedRows([...checkedRows, ...row.children]);
      }
    }
  };

  const onExpand = async (row: any) => {
    let exp = [];
    if (expanded.some((d) => d === row[idName])) {
      exp = expanded.filter((e) => e !== row[idName]);
    } else {
      await addChildren(row);
      exp = [...expanded, row[idName]];
    }
    setExpanded(exp);
  };

  const useCallbackOrderRowByHeader = useCallback(
    (cellName: string, arrowDirection: string) => {
      return orderRowByHeader && orderRowByHeader(cellName, arrowDirection);
    },
    [orderRowByHeader, data]
  );
  const fetchData = async (id: number) => {
    const fetchedData = await fetchFunction(id, data);
    setTreeState((prevState) => ({
      ...prevState,
      treeData: fetchedData.map((e: any) => ({ ...e, level: 0 })),
    }));
  };

  const rowOnClick = (row: any, event: any, index: number) => {
    const alreadySelected = selectedRowsState.some(
      (item) => item[idName] === row[idName]
    );

    let rowsClicked: any[] = alreadySelected ? [] : [{ ...row, index: index }];
    let isKeyboardShortcutKeyClicked = false;

    if (event.ctrlKey || event.metaKey) {
      rowsClicked = [{ ...row, index: index }, ...selectedRowsState];
      isKeyboardShortcutKeyClicked = true;
    }

    setSelectedRowsState(rowsClicked);
    if (rowSelectHandler) {
      rowSelectHandler(
        row,
        rowsClicked,
        isKeyboardShortcutKeyClicked,
        alreadySelected
      );
    }
  };

  const onCheckboxClick = (row: any, event: any) => {
    const checked = event.target.checked;

    //checked items array
    let checkedRowsData = [...checkedRows];

    let currRow = row;

    // half checked/checked parents array
    let halfCheckedRowData: any[] = [...halfCheckedRows];

    if (checked) {
      if (halfCheckedRowData.some((item) => item[idName] === row[idName])) {
        halfCheckedRowData = [];
      }
      if (row.children) {
        //add row and children to checkedRowData recursively
        const getChildren = (parent: any) => {
          if (parent.children) {
            if (checkedRowsData.find((item) => item[idName] === row[idName])) {
              checkedRowsData = [...checkedRowsData, ...parent.children];
            } else {
              checkedRowsData = [...checkedRowsData, ...parent.children, row];
            }
            parent.children.forEach((item: any) => {
              getChildren(item);
            });
          }
        };
        getChildren(row);
      } else {
        checkedRowsData.push(row);
      }
    } else {
      // remove row and children from array recursively
      if (row.children) {
        const getChildren = (parent: any) => {
          checkedRowsData = checkedRowsData.filter(
            (r) => r[idName] !== row[idName]
          );
          if (parent.children) {
            parent.children.forEach((item: any) => {
              checkedRowsData = checkedRowsData.filter(
                (r) => r[idName] !== item[idName]
              );
            });
            parent.children.forEach((item: any) => {
              getChildren(item);
            });
          }
        };
        getChildren(row);
      } else {
        checkedRowsData = checkedRowsData.filter(
          (r) => r[idName] !== row[idName]
        );
      }
    }

    //function for halfchecking parents
    if (checkedRowsData.length !== 0) {
      while (currRow) {
        //get parent of the selected row

        let currRowParent: any;

        const getCurrRow = (parent: any) => {
          if (parent[idName] === currRow[parentIdName]) {
            currRowParent = parent;
          } else {
            if (parent.children && parent.children.length > 0)
              parent.children.forEach((item: any) => {
                getCurrRow(item);
              });
          }
        };

        treeState.treeData.forEach((item: any) => {
          if (item[idName] === currRow[parentIdName]) {
            currRowParent = item;
          } else {
            getCurrRow(item);
          }
        });
        if (currRowParent && currRowParent?.children) {
          if (
            //check if every child inside parent is checked
            checkedRowsData.filter(
              (r) => r[parentIdName] === currRowParent[idName]
            ).length === currRowParent.children.length
          ) {
            if (
              !checkedRowsData.find((item) => {
                return item[idName] === currRowParent[idName];
              })
            ) {
              checkedRowsData.length > 0 && checkedRowsData.push(currRowParent);
            }

            halfCheckedRowData = halfCheckedRowData.filter((item) => {
              return item[idName] !== currRow[parentIdName];
            });
          } else {
            let checkedRowDataIds = checkedRowsData.map((item) => {
              return item[idName];
            });

            let halfCheckedRowDataIds = halfCheckedRowData.map((item) => {
              return item[idName];
            });

            let childArrIds = currRowParent.children.map((item: any) => {
              return item[idName];
            });

            if (
              //check if item is not in array and check if parentRow contains some elements from checked and halfchecked array
              !halfCheckedRowData.find((item) => {
                return item[idName] === currRowParent[idName];
              }) &&
              childArrIds.some((item: any) =>
                [...checkedRowDataIds, ...halfCheckedRowDataIds].includes(item)
              )
            ) {
              halfCheckedRowData.push(currRowParent);
              checkedRowsData = checkedRowsData.filter((item) => {
                return item[idName] !== currRowParent[idName];
              });
            }

            if (
              !childArrIds.some((item: any) =>
                [...checkedRowDataIds, ...halfCheckedRowDataIds].includes(item)
              )
            ) {
              //remove from halfchecked array and checked array
              halfCheckedRowData = halfCheckedRowData.filter((item) => {
                return item[idName] !== currRowParent[idName];
              });
              checkedRowsData = checkedRowsData.filter(
                (item) => item[idName] !== currRowParent[idName]
              );
            }
          }
          currRow = currRowParent;
        } else {
          break;
        }
      }
      setCheckedRows(checkedRowsData);
      setHalfCheckedRows(halfCheckedRowData);
    } else {
      setCheckedRows([]);
      setHalfCheckedRows([]);
    }
    checkboxClickHandler(checkedRowsData);
  };

  const getParents = (id: number) => {
    function createTree(data: any, id: number) {
      const nodes: { item: any; child: any } = { item: null, child: null };
      for (const d of data) {
        if (d[idName] == id) {
          nodes.item = d[idName];
          break;
        }
        if (d.children) {
          const result: { item: any; child: any } = createTree(d.children, id);
          if (result.item) {
            nodes.item = d[idName];
            nodes.child = result;
            break;
          }
        }
      }
      return nodes;
    }

    function findObject(data: any, id: number) {
      let result = [],
        tree = createTree(data, id);

      while (tree) {
        result.push(tree.item);
        tree = tree.child;
      }

      return result;
    }

    return findObject(treeState.treeData, id);
  };

  const drawTree = (children: any) => {
    if (children) {
      return children.map((d: any) => {
        return (
          <React.Fragment key={treeRowIndex}>
            <Suspense>
              <TreeGridRow
                index={treeRowIndex++}
                key={d.rowId}
                columns={treeState.columns}
                row={d}
                idName={idName}
                parentIdName={parentIdName}
                selected={selectedRowsState}
                checked={checkedRows}
                expanded={expanded}
                onExpand={onExpand}
                getParents={getParents}
                scrollRef={scrollRef}
                leafName={leafName}
                freezeWidth={freezeWidth}
                hideCheckBox={hideCheckBox}
                borderColor={borderColor}
                childrenColor={childrenColor}
                parentIconExpand={parentIconExpand}
                hideActionBtn={hideActionBtn}
                actionButtons={actionButtons}
                size={size}
                cellRefs={cellRefs}
                rowOnClick={rowOnClick}
                treeIcons={treeIcons}
                onCheckboxClick={onCheckboxClick}
                halfCheckedRows={halfCheckedRows}
                onDoubleClick={onDoubleClick}
                headerCellWidths={headerRefs.current?.headerCellWidths}
                onContextMenu={onContextMenu}
                selectedCutNode={selectedCutNode}
              />
            </Suspense>
            {drawTree(d.children)}
          </React.Fragment>
        );
      });
    }
  };

  const handleScroll = (event: any) => {
    scrollRef.current = event.currentTarget;
  };

  const restoreExpandedNodes = useCallback(
    (defaultExpandedIds: any) => {
      if (defaultExpandedRowsIds) {
        const traverse = async (node: any) => {
          if (defaultExpandedIds.includes(node.rowId)) {
            await addChildren(node);
          }

          if (node.children && node.children.length > 0) {
            node.children.forEach((child: any) => traverse(child));
          }
        };

        treeState.treeData = [...data.map((e: any) => ({ ...e, level: 0 }))];
        treeState.treeData.forEach((item: any) => traverse(item));
      }
    },
    [defaultExpandedRowsIds]
  );

  let isDataEmpty = !loading && (!data || data.length === 0);

  return (
    <StyledRoot
      loading={loading}
      onScroll={handleScroll}
      ref={tableContainerRef}
    >
      <Table stickyHeader ref={tableRef}>
        {!hideHeader && (
          <Suspense>
            <TreeGridHeader
              columns={treeState.columns}
              setFreezeWidth={setFreezeWidth}
              hideCheckBox={hideCheckBox}
              headerFontWeight={headerFontWeight}
              borderColor={borderColor}
              orderRowByHeader={useCallbackOrderRowByHeader}
              columnsFilter={columnsFilter}
              setColumnsFilter={setColumnsFilter}
              filterOnChangeFunction={filterOnChangeFunction}
              size={size}
              cellRefs={cellRefs}
              headerRefs={headerRefs}
              resizer={resizer}
              tableRef={tableRef}
              tableContainerRef={tableContainerRef}
            />
          </Suspense>
        )}
        {treeState.treeData.length !== 0 && (
          <TableBody>{drawTree(treeState.treeData)}</TableBody>
        )}
      </Table>
      {emptyIcon && isDataEmpty && <NoRecordIndicator />}
    </StyledRoot>
  );
};

export default withLoading(TreeGrid);
