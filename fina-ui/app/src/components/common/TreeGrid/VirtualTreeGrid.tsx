/* eslint react/prop-types: 0 */

import React, {
  FC,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AutoSizer, Column, Table } from "react-virtualized";
import "react-virtualized/styles.css";
import { Box } from "@mui/system";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import TreeExpandLoadingIcon from "../Tree/TreeExpandLoadingIcon";
import { Checkbox } from "@mui/material";
import ContextMenu from "../ContextMenu/ContextMenu";
import { TreeGridColumnType } from "../../../types/common.type";
import { styled, useTheme } from "@mui/material/styles";

const VirtualTreeGridRow = React.lazy(() => import("./VirtualTreeGridRow"));
const VirtualTreeGridHeaderCell = React.lazy(
  () => import("./VirtualTreeGridHeaderCell")
);

interface VirtualTreeGridProps {
  withCheckbox?: boolean;
  checkboxIdProperty?: any;
  editMode?: boolean;
  idProperty?: string;
  columns?: TreeGridColumnType[];
  data?: any[];
  loadChildrenFunction?: any;
  treeIcons?: any;
  checkboxOnChange?: any;
  defaultCheckedRows?: any[];
  checkboxColor?: string;
  contextMenus?: any;
  onRowClickFunction?: any;
  size?: string;
  selectedCutItem?: any;
  actionButtons?: any;
  onRowExpandChange?: any;
  expandPath?: any[];
  multiRowSelectionEnabled?: boolean;
  checkboxSelection?: boolean;
  columnFilterConfig?: any;
  filterOnChangeFunction?: any;
}

const StyledRootBox = styled(Box)(() => ({
  userSelect: "none",
  "& .ReactVirtualized__Grid__innerScrollContainer": {
    // borderBottom: "1px solid #EAEBF0",
  },
  "& .ReactVirtualized__Table__headerColumn": {
    height: "100%",
    position: "relative",
  },
  "& .ReactVirtualized__Table__headerTruncatedText": {
    display: "flex",
    alignItems: "center",
  },
}));

const StyledTable = styled(Table)<{
  withCheckbox: boolean;
  checkboxColor: string;
}>(({ theme, withCheckbox, checkboxColor }) => ({
  "& .ReactVirtualized__Table__headerRow": {
    borderTop: (theme as any).palette.borderColor,
  },
  "& .ReactVirtualized__Table__headerColumn": {
    marginRight: "25px",
    display: "flex",
    fontStyle: "normal",
    fontSize: "13px",
    fontWeight: 500,
    lineHeight: "32px",
  },
  "&:nth-child(1)": {
    "& .ReactVirtualized__Table__headerColumn:nth-child(1)": {
      marginRight: "10px",
      marginLeft: withCheckbox ? "0px" : "",
      width: withCheckbox ? "70px" : "",
      "& .ReactVirtualized__Table__headerTruncatedText": {
        paddingLeft: withCheckbox ? "0px" : "40px",
      },
    },
  },
  "& .ReactVirtualized__Table__rowColumn": {
    fontSize: "12px",
    lineHeight: "20px",
    textTransform: "capitalize",
    color: theme.palette.mode === "dark" ? "#FFF" : "#2C3644",
    marginRight: "25px",
    marginLeft: "0px !important",
    fontStyle: "normal",
    fontWeight: 400,
    "&:nth-child(1)": {
      marginRight: withCheckbox && "0px",
    },
  },
  "& .ReactVirtualized__Table__headerTruncatedText": {
    color: theme.palette.mode === "dark" ? "#dcdbdb" : "#596D89",
    fontSize: "12px",
    fontWeight: 500,
    lineHeight: "16px",
    textTransform: "none",
    width: "100%",
  },
  "& .MuiButtonBase-root": {
    color: checkboxColor,
  },
  "& .ReactVirtualized__Table__row": {
    borderTop: (theme as any).palette.borderColor,
    background: (theme as any).palette.paperBackground,
    "&:hover": {
      background: theme.palette.action.hover,
    },
  },
}));

const StyledIconsBox = styled(Box, {
  shouldForwardProp: (props) => props !== "isLeaf",
})<{
  size: string;
  expanded: boolean;
  isLeaf: boolean;
}>(({ size, expanded, isLeaf }) => ({
  cursor: "pointer",
  color: expanded ? "#9AA7BE" : "#8695B1",
  width: isLeaf ? (size === "small" ? "0px" : "20px") : "",
  marginRight: "10px",
  marginLeft: "16px",
  "& .MuiSvgIcon-root": {
    width: size === "small" ? "16px" : "",
    height: size === "small" ? "16px" : "",
    color: "#C2CAD8",
  },
}));

const StyledCheckbox = styled(Checkbox)<{ _size: string }>(({ _size }) => ({
  paddingLeft: 9,
  marginLeft: 9,
  display: _size === "small" ? "block" : "flex",
  "& .MuiSvgIcon-root": {
    display: "block ",
    width: 16,
    height: 16,
  },
  "& .MuiDivider-root": {
    display: "block",
  },
}));

const VirtualTreeGrid: FC<VirtualTreeGridProps> = ({
  withCheckbox = false,
  checkboxIdProperty = () => {},
  editMode = false,
  idProperty = "id",
  columns = [],
  data = [],
  loadChildrenFunction = () => {},
  treeIcons = {},
  checkboxOnChange = () => {},
  defaultCheckedRows,
  checkboxColor = "",
  contextMenus = null,
  onRowClickFunction = null,
  size = "default",
  selectedCutItem = null,
  actionButtons = () => {},
  onRowExpandChange = () => {},
  expandPath = [],
  multiRowSelectionEnabled = false,
  checkboxSelection = false,
  columnFilterConfig = [],
  filterOnChangeFunction,
}) => {
  const theme: any = useTheme();

  const [rows, setRows] = useState<any[]>([]);
  const [selectedNodes, setSelectedNodes] = useState<any[]>([]);
  const [checkedRows, setCheckedRows] = useState<any[]>([]);
  const [checkedObjects, setCheckedObjects] = useState<any[]>([]);
  const [contextMenuInfo, setContextMenuInfo] = useState<any>();
  const [sort, setSort] = useState({ dataIndex: "", direction: "" });
  const [columnsFilter, setColumnsFilter] = useState<any>([]);
  const tableRef: React.MutableRefObject<any> = useRef();

  let contextMenuOpen = Boolean(contextMenuInfo);
  useEffect(() => {
    if (contextMenus) {
      const handleClick = () => {
        setContextMenuInfo(null);
      };
      window.addEventListener("click", handleClick);
      return () => {
        window.removeEventListener("click", handleClick);
      };
    }
  }, []);

  const initTreeDataFlat = (arr: any) => {
    let newArr = [];
    for (let row of arr) {
      newArr.push(row);
      const getExpandedChildrenFromParentRow = (parent: any) => {
        if (parent.expanded && parent.children) {
          for (let child of parent.children) {
            newArr.push(child);
            getExpandedChildrenFromParentRow(child);
          }
        }
      };
      getExpandedChildrenFromParentRow(row);
    }

    setRows(newArr);
  };

  useEffect(() => {
    initTreeDataFlat(data);
  }, [data]);

  useEffect(() => {
    if (expandPath && expandPath.length && rows.length > 0) {
      expandToPath(expandPath);
    }
  }, [expandPath]);

  useEffect(() => {
    if (defaultCheckedRows) {
      setCheckedRows([...defaultCheckedRows]);
      setCheckedObjects(
        rows.filter((row) => defaultCheckedRows.includes(getRowsProperty(row)))
      );
    }
  }, [defaultCheckedRows]);

  const expandToPath = async (expandPath: number[]) => {
    let lastNode: any;
    let lastNodeIndex: any;

    for (let i = 0; i < expandPath.length; i++) {
      const isLastNodeIndex = i === expandPath.length - 1;
      const id = expandPath[i];
      let index = 0;
      const node = rows.find((n, indx) => {
        index = indx;
        return n[idProperty] === id;
      });

      if (node && !node.leaf && !isLastNodeIndex) {
        await onExpand(node, index);
      }

      if (isLastNodeIndex && node) {
        lastNode = node;
        lastNodeIndex = index;
      }
    }

    if (lastNodeIndex !== undefined) {
      scrollToItem(lastNodeIndex);
    }

    if (lastNode !== undefined) {
      setSelectedNodes([lastNode]);
    }
  };

  const getRowsProperty = (row: any) => {
    return typeof checkboxIdProperty === "function"
      ? checkboxIdProperty(row)
      : row[checkboxIdProperty];
  };

  const selectAllRows = (checked: any) => {
    let result = checked ? [...rows.map((row) => getRowsProperty(row))] : [];
    setCheckedRows(checked ? [...rows.map((row) => getRowsProperty(row))] : []);
    const checkedNodes = checked ? rows.filter((row) => row.level === 1) : [];
    setCheckedObjects(checkedNodes);
    checkboxOnChange(result, checkedNodes);
  };

  const onRowCheck = (checked: any, row: any) => {
    let checkdData = [];
    if (checked) {
      let arr = [];
      if (!row.rowData.leaf) {
        if (row.rowData.children) {
          arr = row.rowData.children.map((child: any) =>
            getRowsProperty(child)
          );
        }
        arr.push(getRowsProperty(row.rowData));

        checkdData = [
          ...checkedObjects.filter((r) => r.parentId !== row.rowData.id),
          ...row.rowData.children,
        ];
        setCheckedObjects(checkdData);
      } else {
        let childrenArr = rows.filter(
          (child) =>
            child.parentId === row.rowData.parentId &&
            child.id !== row.rowData.id
        );

        let parentRow = rows.find((r) => r.id === row.rowData.parentId);

        if (
          parentRow &&
          childrenArr.every((child) =>
            checkedRows.includes(getRowsProperty(child))
          )
        ) {
          arr.push(getRowsProperty(parentRow));
        }
        checkdData = [...checkedObjects, row.rowData];
        setCheckedObjects(checkdData);
      }
      let result: any = [
        ...(new Set([
          ...checkedRows,
          getRowsProperty(row.rowData),
          ...arr,
        ]) as any),
      ];
      setCheckedRows(result);

      checkboxOnChange(result, checkdData);
    } else {
      if (!row.rowData.leaf) {
        let arr: any[] = [];
        if (row.rowData.children) {
          arr = row.rowData.children.map((child: any) =>
            getRowsProperty(child)
          );
        }
        arr.push(getRowsProperty(row.rowData));
        let result = [...checkedRows.filter((rowId) => !arr.includes(rowId))];
        setCheckedRows(result);
        const checkdData = [...checkedObjects, ...row.rowData.children];

        setCheckedObjects(checkdData);
        checkboxOnChange(result, checkdData);
      } else {
        let arr = [getRowsProperty(row.rowData)];

        if (row.rowData.parentId && row.rowData.parentId !== 0) {
          arr = [getRowsProperty(row.rowData)];

          let parent = rows.find((r) => r.id === row.rowData.parentId);
          if (parent) arr.push(getRowsProperty(parent));
        }
        let result = [...checkedRows.filter((rowId) => !arr.includes(rowId))];
        setCheckedRows(result);
        const checkdData = checkedObjects.filter(
          (r) => r.id !== row.rowData.id
        );

        setCheckedObjects(checkdData);

        checkboxOnChange(result, checkdData);
      }
    }
  };

  const isRowSelected = (row: any) => {
    return checkedRows.includes(getRowsProperty(row.rowData));
  };

  const isRowIndeterminate = (row: any) => {
    if (row.rowData.leaf || !row.rowData.children) return false;
    return (
      !checkedRows.includes(getRowsProperty(row.rowData)) &&
      row.rowData.children.some((row: any) =>
        checkedRows.includes(getRowsProperty(row))
      )
    );
  };

  const onExpand = async (
    selectedItem: any,
    index: number,
    selectNode = false
  ) => {
    if (selectedItem.expanded) {
      return rows;
    } else {
      let children = [];
      if (!selectedItem.children) {
        children = await loadChildrenFunction(selectedItem, sort);

        if (sort.direction) {
          let i = sort.direction === "up" ? -1 : 1;
          let keys = sort.dataIndex.split(".");
          children = children.sort((a: any, b: any) =>
            getObjValueByKeys(a, keys) < getObjValueByKeys(b, keys) ? i : i * -1
          );
        }
      } else {
        children = selectedItem.children;
      }

      if (
        withCheckbox &&
        !selectedItem.leaf &&
        checkedRows.includes(getRowsProperty(selectedItem))
      ) {
        let result = [
          ...checkedRows,
          ...children.map((child: any) => getRowsProperty(child)),
        ];
        result = [...(new Set(result) as any)];
        setCheckedRows(result);
        const checkedObjects = rows.filter((row) =>
          result.includes(getRowsProperty(row.rowData))
        );
        setCheckedObjects(checkedObjects);
      }

      if (!selectedItem.children) {
        selectedItem.children = children;
        selectedItem.expanded = true;
      } else {
        selectedItem.expanded = true;
        children = selectedItem.children.map((node: any) => {
          node.expanded = false;
          node.opened = true;
          return node;
        });
      }

      rows.splice(index + 1, 0, ...children);

      setRows([...rows]);
      if (selectNode) {
        setSelectedNodes([...selectedNodes, selectedItem]);
      }

      onRowExpandChange(true, selectedItem);
    }
  };

  const onCollapse = (selectedItem: any, rowIndex: number) => {
    if (
      withCheckbox &&
      !selectedItem.leaf &&
      selectedItem.children &&
      checkedRows.includes(getRowsProperty(selectedItem))
    ) {
      let children = selectedItem.children.map((child: any) => {
        getRowsProperty(child);
        child.opened = false;
        return child;
      });
      let result = [
        ...checkedRows.filter((child) => !children.includes(child)),
      ];
      result = [...(new Set(result) as any)];
      setCheckedRows(result);
      const checkedObjects = rows.filter((row) =>
        result.includes(getRowsProperty(row.rowData))
      );
      setCheckedObjects(checkedObjects);
    }

    selectedItem.expanded = false;
    if (selectedItem.children && selectedItem.children.length > 0) {
      const indx = rows.findIndex(
        (element) => element[idProperty] === selectedItem[idProperty]
      );
      let toIndex = rows.findIndex(
        (el, index) => el.level <= selectedItem.level && index > indx
      );
      if (toIndex < 0) {
        toIndex = findIndexRecursive(selectedItem, indx);
      }

      const cutSequence =
        toIndex - (rowIndex + 1) > 0 ? toIndex - (rowIndex + 1) : 1;
      rows.splice(rowIndex + 1, cutSequence);
    }
    setRows([...rows]);
    onRowExpandChange(false, selectedItem);
  };

  const findIndexRecursive = (selectedItem: any, indx: number): any => {
    const toIndex = rows.findIndex(
      (el, index) => el.level === selectedItem.level - 1 && index > indx
    );
    if (toIndex < 0) {
      const child = rows.find((e) => e.id === selectedItem.parentId);
      if (child) {
        return findIndexRecursive(child, indx);
      } else {
        return indx + (rows.length - indx);
      }
    } else {
      return toIndex;
    }
  };

  const ExpandIcon: FC<{ node: any }> = ({ node }) => {
    const [expanding, setExpanding] = useState(false);

    const { expanded } = node.rowData;
    const { rowIndex } = node;
    const selectedItem: any = node.rowData;

    const onExpandClick = async () => {
      setExpanding(true);
      await onExpand(selectedItem, rowIndex);
      setExpanding(false);
    };

    if (expanding) {
      return <TreeExpandLoadingIcon />;
    }

    return (
      <StyledIconsBox
        size={size}
        expanded={expanded}
        isLeaf={node?.rowData?.leaf}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {expanded ? (
          <KeyboardArrowUpIcon
            fontSize={"small"}
            style={{
              visibility:
                (expanded && selectedItem.children?.length <= 0) ||
                selectedItem.leaf
                  ? "hidden"
                  : "visible",
            }}
            onClick={(e) => {
              e.stopPropagation();
              node.rowData.opened = false;
              onCollapse(selectedItem, rowIndex);
            }}
          />
        ) : (
          <KeyboardArrowDownIcon
            style={{
              visibility:
                (expanded && selectedItem.children?.length <= 0) ||
                selectedItem.leaf
                  ? "hidden"
                  : "visible",
            }}
            fontSize={"small"}
            onClick={(e) => {
              e.stopPropagation();
              node.rowData.opened = true;
              onExpandClick();
            }}
          />
        )}
      </StyledIconsBox>
    );
  };

  const calculateMargin = (node: any) => {
    const level = node.rowData.level;
    if (level) {
      if (level === 1) {
        return 34;
      }
      return 40 * level;
    }
    return 0;
  };

  const renderTreeCell = (c: any, node: any) => {
    return (
      <Box
        display={"flex"}
        flexDirection={"row"}
        style={{
          marginLeft: node.rowData.level
            ? `${calculateMargin(node)}px`
            : "inherit",
        }}
        data-testid={"row-cell"}
      >
        {!withCheckbox && <ExpandIcon node={node} />}
        <Box display={"flex"} alignItems={"center"} overflow={"hidden"}>
          {c.renderer ? (
            c.renderer(
              node.rowData[node.dataKey],
              node.rowData,
              node.rowIndex,
              node.rowData.expanded
            )
          ) : (
            <Box
              display={"flex"}
              style={{
                paddingLeft: node.rowData.level ? 10 : "inherit",
                alignItems: "center",
              }}
            >
              {node.rowData.leaf ? (
                treeIcons.leaf ? (
                  treeIcons.leaf()
                ) : null
              ) : (
                <>
                  {node.rowData.expanded
                    ? treeIcons.expandedIcon
                      ? treeIcons.expandedIcon()
                      : null
                    : treeIcons.folder
                    ? treeIcons.folder()
                    : null}
                </>
              )}
              <div
                style={{ paddingLeft: 10 }}
                data-testid={node.dataKey + "-value"}
              >
                <span>{node.rowData[node.dataKey]}</span>
              </div>
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  const getObjValueByKeys = (obj: any, keys: any) => {
    let val = obj;
    for (let i = 0; i < keys.length; i++) {
      val = val[keys[i]];
    }

    return val;
  };

  const orderRowByHeader = (column: string, direction: string) => {
    setSort({ dataIndex: column, direction: direction });
    let arr: any = [];
    let obj: any = { parent: null, children: [] };
    let rowsLen = rows.length;
    rows.forEach((row: any, index: number) => {
      if (index === 0) {
        obj.parent = row;
      } else if (!row.level || row.level === 0) {
        arr.push(obj);
        obj = { parent: row, children: [] };
      }

      if (row.level && row.level > 0) {
        obj.children.push(row);
      }

      if (rowsLen === index + 1) {
        arr.push(obj);
      }
    });

    let result: any = [];

    let i = direction === "up" ? -1 : 1;
    let keys = column.split(".");
    arr.forEach((item: any) => {
      result.push(item.parent);
      result = [
        ...result,
        ...item.children.sort((a: any, b: any) =>
          getObjValueByKeys(a, keys) < getObjValueByKeys(b, keys) ? i : i * -1
        ),
      ];
    });

    setRows(result);
  };

  const useCallbackOrderRowByHeader = useCallback(
    (column: string, direction: string) => {
      orderRowByHeader(column, direction);
    },
    [rows]
  );

  const scrollToItem = (index: number) => {
    if (data.length > 0 && index)
      setSelectedNodes([...selectedNodes, data[index]]);
    tableRef.current.scrollToRow(index, "smart"); // second parameter here could be 'auto', 'smart', 'center', 'end', 'start'
  };

  const onRowSelect = (row: any, index: number, event: any) => {
    const alreadySelected = selectedNodes.some(
      (item) => item[idProperty] === row[idProperty]
    );
    let clickedRows = alreadySelected ? [] : [row];

    if (multiRowSelectionEnabled) {
      if (event.ctrlKey || event.metaKey) {
        clickedRows = [row, ...selectedNodes];
      } else if (event.shiftKey) {
        const lastSelectedRow =
          selectedNodes.length === 0 ? null : selectedNodes[0];
        let startIndex =
          lastSelectedRow == null
            ? 0
            : rows.findIndex(
                (r) => r[idProperty] === lastSelectedRow[idProperty]
              );

        let endIndex = index;

        const subarray = rows.slice(
          startIndex > endIndex ? endIndex : startIndex,
          endIndex < startIndex ? startIndex : endIndex + 1
        );
        clickedRows = [...subarray, ...selectedNodes];
      }
    }

    setSelectedNodes(clickedRows);

    if (onRowClickFunction) {
      onRowClickFunction(row, event, clickedRows);
    }
  };

  return (
    <StyledRootBox
      width={"100%"}
      height={"100%"}
      data-testid={"virtual-tree-grid"}
    >
      <div>
        {contextMenus && contextMenuOpen && (
          <ContextMenu
            open={contextMenuOpen}
            contextMenuInfo={contextMenuInfo}
            handleClose={() => setContextMenuInfo(null)}
            contextMenus={contextMenus}
          />
        )}
      </div>
      <AutoSizer>
        {({ height, width }) => (
          <StyledTable
            checkboxColor={checkboxColor}
            withCheckbox={withCheckbox}
            ref={tableRef}
            width={width}
            height={height}
            headerHeight={size === "small" ? 40 : 48}
            rowHeight={size === "small" ? 40 : 48}
            rowCount={rows.length}
            rowGetter={({ index }) => rows[index]}
            onRowClick={({ rowData, event, index }) => {
              onRowSelect(rowData, index, event);
            }}
            onRowDoubleClick={({ index, rowData }) => {
              if (rowData.expanded) {
                onCollapse(rowData, index);
              } else if (!rowData.leaf) {
                onExpand(rowData, index, true);
              }
            }}
            onRowRightClick={(row: any) => {
              let event = row.event;

              setSelectedNodes([row.rowData]);
              if (onRowClickFunction) {
                onRowClickFunction(row.rowData, event, [row.rowData]);
              }

              if (contextMenus) {
                event.preventDefault();
                setContextMenuInfo({
                  x: event.clientX,
                  y: event.clientY,
                  row: row.rowData,
                  target: event.currentTarget,
                });
              }
            }}
            rowRenderer={({
              className,
              columns,
              index,
              onRowClick,
              onRowMouseOut,
              onRowMouseOver,
              onRowRightClick,
              onRowDoubleClick,
              rowData,
              style,
            }) => {
              const a11yProps: any = { "aria-rowindex": index + 1 };
              if (
                checkboxSelection &&
                checkedRows.length > 0 &&
                checkedRows.some(
                  (node) => node[idProperty] === rowData[idProperty]
                )
              ) {
                style.background = theme.palette.action.select;
              }
              if (
                onRowClick ||
                onRowMouseOut ||
                onRowMouseOver ||
                onRowDoubleClick ||
                onRowRightClick
              ) {
                a11yProps["aria-label"] = "row";
                a11yProps.tabIndex = 0;

                if (onRowClick) {
                  a11yProps.onClick = (event: any) =>
                    onRowClick({ event, index, rowData });
                }
                if (onRowMouseOut) {
                  a11yProps.onMouseOut = (event: any) =>
                    onRowMouseOut({ event, index, rowData });
                }
                if (onRowMouseOver) {
                  a11yProps.onMouseOver = (event: any) =>
                    onRowMouseOver({ event, index, rowData });
                }
                if (onRowRightClick) {
                  a11yProps.onContextMenu = (event: any) => {
                    onRowRightClick({ event, index, rowData });
                  };
                }
                if (onRowDoubleClick) {
                  a11yProps.onDoubleClick = (event: any) =>
                    onRowDoubleClick({ event, index, rowData });
                }
              }
              if (
                selectedNodes.length > 0 &&
                selectedNodes.some(
                  (node) => node[idProperty] === rowData[idProperty]
                )
              ) {
                style.background = theme.palette.action.select;
              }
              if (
                selectedCutItem &&
                rowData[idProperty] === selectedCutItem[idProperty]
              ) {
                style.background =
                  "linear-gradient(90deg, #045C04 50%, transparent 0) repeat-x," +
                  "linear-gradient(90deg, #045C04 50%, transparent 0) repeat-x," +
                  "linear-gradient(0deg, #045C04 50%, transparent 0) repeat-y," +
                  "linear-gradient(0deg, #045C04 50%, transparent 0) repeat-y";
                style.backgroundSize = " 4px 1px, 4px 1px, 1px 4px, 1px 4px";
                style.backgroundPosition = "0 0, 0 100%, 0 0, 100% 0";
                style.cursor = "pointer";
                style.animation = "animatedCut .3s infinite linear";
                style.width = "calc(100% - 2px)";
                style.borderTop = "none";
              }
              return (
                <Suspense>
                  <VirtualTreeGridRow
                    key={index}
                    className={className}
                    columns={columns}
                    a11yProps={a11yProps}
                    style={style}
                    index={index}
                    rowData={rowData}
                    size={size}
                    actionButtons={actionButtons}
                  />
                </Suspense>
              );
            }}
            headerRowRenderer={({ className, style, columns }) => (
              <div className={className} style={style} data-testid="header-row">
                {columns}
              </div>
            )}
          >
            {withCheckbox && (
              <Column
                key={"0"}
                width={70}
                label={
                  <Box display={"flex"}>
                    <StyledCheckbox
                      data-testid={`virtual-tree-grid-header-checkbox`}
                      _size={size}
                      onChange={(event) => {
                        selectAllRows(event.target.checked);
                      }}
                      checked={
                        checkedRows.length !== 0 &&
                        checkedRows.length === rows.length
                      }
                      indeterminate={
                        checkedRows.length > 0 &&
                        checkedRows.length !== rows.length
                      }
                      name="select"
                      color="primary"
                      disabled={editMode}
                    />
                  </Box>
                }
                dataKey={""}
                style={{ marginLeft: "0px" }}
                flexGrow={1}
                cellRenderer={(node) => {
                  return (
                    <Box display={"flex"}>
                      <Box>
                        <StyledCheckbox
                          data-testid={`virtual-tree-grid-checkbox-${node?.rowData?.id}`}
                          _size={size}
                          checked={isRowSelected(node)}
                          indeterminate={isRowIndeterminate(node)}
                          onChange={(event) => {
                            onRowCheck(event.target.checked, node);
                          }}
                          name="select"
                          color="primary"
                          disabled={editMode}
                        />
                      </Box>
                      <ExpandIcon node={node} />
                    </Box>
                  );
                }}
              />
            )}
            {columns.map((c, index: number) => {
              const filter = columnFilterConfig.find(
                (f: any) => f.dataIndex === c.dataIndex
              );
              const column: TreeGridColumnType = {
                ...c,
                filter: filter,
              };

              if (index === 0) {
                return (
                  <Column
                    key={index}
                    label={
                      <Suspense>
                        <VirtualTreeGridHeaderCell
                          column={column}
                          sort={sort}
                          size={size}
                          orderRowByHeader={useCallbackOrderRowByHeader}
                          filterOnChangeFunction={filterOnChangeFunction}
                          columnsFilter={columnsFilter}
                          setColumnsFilter={setColumnsFilter}
                        />
                      </Suspense>
                    }
                    dataKey={c.dataIndex}
                    flexGrow={1}
                    width={c.width ? c.width : 200}
                    cellRenderer={(node) => {
                      return renderTreeCell(c, node);
                    }}
                  />
                );
              }

              return (
                <Column
                  key={index}
                  label={
                    <Suspense>
                      <VirtualTreeGridHeaderCell
                        column={column}
                        sort={sort}
                        size={size}
                        orderRowByHeader={useCallbackOrderRowByHeader}
                        filterOnChangeFunction={filterOnChangeFunction}
                        columnsFilter={columnsFilter}
                        setColumnsFilter={setColumnsFilter}
                      />
                    </Suspense>
                  }
                  dataKey={c.dataIndex}
                  width={c.width ? c.width : 200}
                  flexGrow={c.flex ? c.flex : 0}
                  cellRenderer={(node) => {
                    if (c.renderer) {
                      return c.renderer(
                        node.rowData[node.dataKey],
                        node.rowData,
                        index,
                        false
                      );
                    }
                    return node.rowData[node.dataKey];
                  }}
                />
              );
            })}
          </StyledTable>
        )}
      </AutoSizer>
    </StyledRootBox>
  );
};

export default VirtualTreeGrid;
