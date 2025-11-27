import { AutoSizer, List } from "react-virtualized";
import React, { Suspense, useEffect, useRef, useState } from "react";
import {
  filterNodes,
  getPath,
  loadChildren,
  loadCurrentUserRootNodes,
  mdtPaste,
  saveMDTNode,
} from "../../../api/services/MDTService";
import { Box } from "@mui/system";
import MDTSearchField from "./MDTSearchField";
import {
  getStateFromLocalStorage,
  setStateToLocalStorage,
} from "../../../api/ui/localStorageHelper";
import { treeKey } from "../../../containers/MDT/MDTContainer";
import ContextMenu from "../../common/ContextMenu/ContextMenu";
import ContextMenuItem from "../../common/ContextMenu/ContextMenuItem";
import { ContentCopy, ContentCut } from "@mui/icons-material";
import MoveUpIcon from "@mui/icons-material/MoveUp";
import MoveDownIcon from "@mui/icons-material/MoveDown";
import { useTranslation } from "react-i18next";
import { Paper } from "@mui/material";
import DeleteForm from "../../common/Delete/DeleteForm";
import ConfirmModal from "../../common/Modal/ConfirmModal";
import SimpleLoadMask from "../../common/SimpleLoadMask";
import Divider from "@mui/material/Divider";
import MDTTreeSkeleton from "./MDTTreeSkeleton";
import { useTheme } from "@mui/material/styles";
import { MDTDeleteModal, MdtNode } from "../../../types/mdt.type";
import { ContextMenuInfo, UIEventType } from "../../../types/common.type";
import { CancelIcon } from "../../../api/ui/icons/CancelIcon";

const MDTRow = React.lazy(() => import("./MDTRow"));
const MDTHeader = React.lazy(() => import("../MDTHeader"));

interface MDTTreeProps {
  onNodeSelect: (
    node: MdtNode,
    clickedRows?: MdtNode[],
    event?: UIEventType
  ) => void;
  setEditMode: (edit: boolean) => void;
  items: MdtNode[];
  setItems: (items: MdtNode[]) => void;
  foldersOnly?: boolean;
  size: string;
  viewMode: boolean;
  contextMenuVisible?: boolean;
  collapseAll?: () => void;
  onExport?: () => void;
  selectedNodes: MdtNode[];
  setSelectedNodes: (nodes: MdtNode[]) => void;
  currentNode?: MdtNode | null;
  editMode?: boolean;
  setCurrentNode?: (node: MdtNode | null) => void;
  showSkeleton?: boolean;
  setIsCardMinimized?: (minimized: boolean) => void;
  hasAmendPermission?: boolean;
  cutNodeSelection?: {
    isSelected: boolean;
    ids: Set<number>;
  };
  onSave?: (node: MdtNode, setData: (data: MdtNode) => void) => void;
  expandNodePath?: number[];

  deleteMDTRow?(
    node: MdtNode,
    setDeleteModal: React.Dispatch<React.SetStateAction<MDTDeleteModal>>,
    deleteModal: MDTDeleteModal
  ): Promise<boolean>;
}

const CM_ACTIONS = {
  CUT: "cut",
  PASTE_CHILD: "pastechild",
  MOVE_UP: "moveup",
  MOVE_DOWN: "movedown",
  PASTE_AFTER: "pasteafter",
  PASTE_BEFORE: "pastebefore",
};

const MDTTree: React.FC<MDTTreeProps> = ({
  onNodeSelect,
  setEditMode,
  deleteMDTRow,
  items,
  setItems,
  foldersOnly,
  size = "default",
  viewMode,
  contextMenuVisible = false,
  collapseAll,
  onExport,
  selectedNodes,
  setSelectedNodes,
  currentNode,
  editMode = false,
  onSave,
  setCurrentNode,
  showSkeleton,
  setIsCardMinimized,
  hasAmendPermission,
  cutNodeSelection,
  expandNodePath,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [filteredData, setFilteredData] = useState<MdtNode[]>([]);
  const [filtering, setFiltering] = useState(false);
  const [scrollToIndex, setScrollToIndex] = useState<number | undefined>(-1);
  const [contextMenuInfo, setContextMenuInfo] = useState<ContextMenuInfo>(null);
  const [selectedCutItem, setSelectedCutItem] = useState<MdtNode | null>(null);
  const [loadMask, setLoadMask] = useState(false);
  const [deleteModal, setDeleteModal] = useState<MDTDeleteModal>({
    isOpen: false,
    data: null,
    loading: false,
  });
  const [isCancelModalOpen, setIsCancelModalOpen] = useState<{
    open: boolean;
    selectedNode: MdtNode | null;
  }>({
    open: false,
    selectedNode: null,
  });
  const [defaultExpandingNodes, setDefaultExpandingNodes] = useState<{
    [id: string]: boolean;
  }>();
  const [isDefaultExpanding, setIsDefaultExpanding] = useState(true);

  let contextMenuOpen = Boolean(contextMenuInfo);

  useEffect(() => {
    init();

    if (contextMenuVisible) {
      const handleClick = () => {
        setContextMenuInfo(null);
      };
      window.addEventListener("click", handleClick);
      return () => {
        window.removeEventListener("click", handleClick);
      };
    }
  }, []);

  useEffect(() => {
    if (expandNodePath && expandNodePath.length) {
      expandPath(expandNodePath);
    }
  }, [expandNodePath]);

  const onRefreshClick = () => {
    setSelectedNodes([]);
    init();
    setScrollToIndex(undefined);
  };

  const listRef = useRef<any>();

  const init = () => {
    loadCurrentUserRootNodes().then((resp) => {
      const data: MdtNode[] = resp.data;
      const itemLength = data.length;
      const itemsData = data.map((d, index) => ({
        ...d,
        level: 1,
        nextElementId: itemLength > index + 1 ? data[index + 1].id : d.id,
      }));
      items = itemsData;
      setItems(itemsData);
      restoreExpandedRowState();
    });
  };

  const restoreExpandedRowState = async () => {
    const expandedRowIdsArray = getStateFromLocalStorageHandler();
    if (expandedRowIdsArray) {
      for (let i = 0; i < expandedRowIdsArray.length; i++) {
        let rId = expandedRowIdsArray[i];
        const rootItem = items.find((item) => item.id === rId);
        if (rootItem) {
          await onExpand(
            rootItem,
            items.findIndex((item) => item.id === rId)
          );
        }
      }
      setIsDefaultExpanding(false);
    }
  };

  const loadChildrenCall = async (item: MdtNode) => {
    const children: MdtNode[] = (await loadChildren(item.id, foldersOnly)).data;
    return children.map((d, index) => {
      d.level = item.level + 1;
      if (children.length > index + 1) {
        d.nextElementId = children[index + 1].id;
      } else {
        d.nextElementId = d.id;
      }
      return d;
    });
  };

  const getStateFromLocalStorageHandler = () => {
    const mdtState = getStateFromLocalStorage();
    return mdtState[treeKey]?.expandedRowIds || [];
  };

  const onNodeEdit = (node: MdtNode) => {
    setSelectedNodes([node]);
    if (onNodeSelect) {
      onNodeSelect(node);
    }
  };

  const onNodeSelectClick = (node: MdtNode, event: UIEventType) => {
    setScrollToIndex(undefined);

    const alreadySelected = selectedNodes.some((item) => item.id === node.id);
    if (alreadySelected && setIsCardMinimized) {
      setIsCardMinimized(false);
    }
    let clickedRows = alreadySelected ? [] : [node];

    if (event.ctrlKey || event.metaKey) {
      clickedRows = [node, ...selectedNodes];
    } else if (event.shiftKey) {
      const lastSelectedRow =
        selectedNodes.length === 0 ? null : selectedNodes[0];
      let startIndex =
        lastSelectedRow == null
          ? 0
          : items.findIndex((r) => r.id === lastSelectedRow.id);

      let endIndex = items.findIndex((r) => r.id === node.id);

      const subarray = items.slice(
        startIndex > endIndex ? endIndex : startIndex,
        endIndex < startIndex ? startIndex : endIndex + 1
      );
      clickedRows = [...subarray, ...selectedNodes];
    }

    setSelectedNodes(clickedRows);

    if (onNodeSelect && !alreadySelected) {
      onNodeSelect(node, clickedRows, event);
    }
  };

  const addDefaultExpandedRowId = (selectedItem: MdtNode) => {
    if (!selectedItem) return;
    const expandedRowIdsArray = getStateFromLocalStorageHandler();
    if (expandedRowIdsArray.includes(selectedItem.id)) {
      return;
    }
    setStateToLocalStorage(treeKey, {
      expandedRowIds: [...expandedRowIdsArray, selectedItem.id],
    });
  };

  const removeDefaultExpandedRowId = (childrenIds: number[]) => {
    const expandedRowIdsArray: number[] = getStateFromLocalStorageHandler();
    const filteredIds = expandedRowIdsArray.filter(
      (id) => !childrenIds.includes(id)
    );

    setStateToLocalStorage(treeKey, {
      expandedRowIds: filteredIds,
    });
  };

  const onExpand = async (
    selectedItem: MdtNode,
    index: number,
    selectNode = false
  ) => {
    if (!selectedItem) return;
    addDefaultExpandedRowId(selectedItem);

    setDefaultExpandingNodes((prev) => ({
      ...prev,
      [selectedItem.id]: true,
    }));

    let children: MdtNode[] = [];
    if (!selectedItem.children) {
      children = await loadChildrenCall(selectedItem);
      selectedItem.children = children;
      selectedItem.expanded = true;
    } else {
      if (selectedItem.expanded === false) {
        children = selectedItem.children.map((node: MdtNode) => {
          node.expanded = false;
          return node;
        });
        selectedItem.expanded = true;
        if (
          setCurrentNode &&
          currentNode &&
          selectedItem?.id === currentNode?.id
        ) {
          setCurrentNode({
            ...currentNode,
            children: children,
            expanded: true,
          });
        }
      }
    }

    items.splice(index + 1, 0, ...children);
    setItems([...items]);
    if (selectNode) {
      setSelectedNodes([selectedItem]);
      onNodeSelect(selectedItem);
    }

    setDefaultExpandingNodes((prev) => ({
      ...prev,
      [selectedItem.id]: false,
    }));
  };

  const onCollapse = (selectedItem: MdtNode, index: number) => {
    if (selectedItem.children !== null) {
      if (setCurrentNode && selectedItem?.id === currentNode?.id) {
        setCurrentNode({ ...currentNode, expanded: false });
        const selectedNode = selectedNodes?.find(
          (node) => node.id === currentNode.id
        );
        if (selectedNode) selectedNode.expanded = false;
      }
      selectedItem.expanded = false;
      const indx = items.findIndex((element) => element.id === selectedItem.id);

      let toIndex = items.findIndex(
        (el, index) => el.level <= selectedItem.level && index > indx
      );

      if (toIndex < 0) {
        toIndex = findIndexRecursive(selectedItem, indx);
      }

      const cutSequence = toIndex - (index + 1) > 0 ? toIndex - (index + 1) : 1;

      let rowIds = [];
      for (let i = index; i < cutSequence + index; i++) {
        rowIds.push(items[i].id);
      }
      removeDefaultExpandedRowId(rowIds);

      items.splice(index + 1, cutSequence);
      setItems([...items]);
    }
  };

  const findIndexRecursive = (selectedItem: MdtNode, indx: number): number => {
    const toIndex = items.findIndex(
      (el, index) => el.level === selectedItem.level - 1 && index > indx
    );
    if (toIndex < 0) {
      const child = items.find((e) => e.id === selectedItem.parentId);
      if (child) {
        return findIndexRecursive(child, indx);
      } else {
        return indx + (items.length - indx);
      }
    } else {
      return toIndex;
    }
  };

  const pasteHandler = (
    selectedNode: MdtNode,
    selectedCutItem: MdtNode,
    pasteDirection: string
  ) => {
    let adjacentItemSequence;
    let pasteData;

    if (selectedNode.parentId !== selectedCutItem.parentId) {
      if (pasteDirection === "before") {
        adjacentItemSequence = selectedNode.sequence - 1;
      } else {
        adjacentItemSequence = selectedNode.sequence + 1;
      }

      pasteData = {
        ...selectedCutItem,
        parentId: selectedNode.parentId,
        sequence: adjacentItemSequence,
      };
    } else {
      if (pasteDirection === "before") {
        adjacentItemSequence = selectedNode.sequence;
      } else {
        adjacentItemSequence = selectedNode.sequence + 1;
      }
      pasteData = {
        ...selectedCutItem,
        sequence: adjacentItemSequence,
      };
    }

    return pasteData;
  };
  const onPasteFunction = (
    selectedCutItem: MdtNode,
    selectedNode: MdtNode,
    pasteDirection?: string
  ) => {
    setLoadMask(true);
    let pasteData: MdtNode;

    if (pasteDirection === "before") {
      pasteData = pasteHandler(selectedNode, selectedCutItem, pasteDirection);
    } else if (pasteDirection === "after") {
      pasteData = pasteHandler(selectedNode, selectedCutItem, pasteDirection);
    } else {
      pasteData = {
        ...selectedCutItem,
        parentId: selectedNode.id,
      };
    }

    mdtPaste([pasteData]).then(() => {
      const expandedItemsId: number[] = getStateFromLocalStorageHandler();
      const deleteCutItemFromLocalStorage = expandedItemsId.filter(
        (id) => id !== pasteData.id
      );
      setStateToLocalStorage(treeKey, {
        expandedRowIds: deleteCutItemFromLocalStorage,
      });
      init();
      scrollToIndexHandler(selectedNode);
      setLoadMask(false);
    });
  };

  const onMoveUpOrDownFunction = (
    selectedNode: MdtNode,
    moveDirection: string
  ) => {
    setLoadMask(true);

    const selectedItemIndex = items.findIndex(
      (item) => selectedNode.id === item.id
    );

    const destinationItemIndex = getDestinationNodeIndex(
      moveDirection,
      selectedNode,
      selectedItemIndex
    );

    let destinationItem = items[destinationItemIndex];

    let destinationItemSequence =
      moveDirection === "down"
        ? destinationItem.sequence + 1
        : destinationItem.sequence;
    let selectedItemSequence =
      moveDirection === "down"
        ? selectedNode.sequence + 1
        : selectedNode.sequence;

    const submitData = {
      ...selectedNode,
      sequence: destinationItemSequence,
    };

    saveMDTNode(submitData).then(() => {
      let updatedItems = [...items];
      if (!selectedNode.expanded && !destinationItem.expanded) {
        [updatedItems[selectedItemIndex], updatedItems[destinationItemIndex]] =
          [
            {
              ...updatedItems[destinationItemIndex],
              sequence: selectedItemSequence,
            },
            {
              ...updatedItems[selectedItemIndex],
              sequence: destinationItemSequence,
            },
          ];
      } else {
        let selectedExtractedItemsAmount =
          getExtractedNodesAmount(selectedNode);
        let adjacentExtractedItemsAmount =
          getExtractedNodesAmount(destinationItem);

        const selectedExtractedItems = updatedItems.slice(
          selectedItemIndex,
          selectedItemIndex + selectedExtractedItemsAmount
        );
        const adjacentExtractedItems = updatedItems.slice(
          destinationItemIndex,
          destinationItemIndex + adjacentExtractedItemsAmount
        );
        const firstPart = updatedItems.slice(
          0,
          moveDirection === "up" ? destinationItemIndex : selectedItemIndex
        );
        const secondPart = updatedItems.slice(
          moveDirection === "up"
            ? selectedItemIndex + selectedExtractedItemsAmount
            : destinationItemIndex + adjacentExtractedItemsAmount
        );

        if (moveDirection === "up") {
          updatedItems = [
            ...firstPart,
            ...selectedExtractedItems,
            ...adjacentExtractedItems,
            ...secondPart,
          ];
        } else {
          updatedItems = [
            ...firstPart,
            ...adjacentExtractedItems,
            ...selectedExtractedItems,
            ...secondPart,
          ];
        }
      }

      setItems(updatedItems);
      setLoadMask(false);
    });
  };

  const getDestinationNodeIndex = (
    moveDirection: string,
    selectedNode: MdtNode,
    selectedItemIndex: number
  ) => {
    if (moveDirection === "up") {
      const destinationNode = items
        .slice(0, selectedItemIndex)
        .reverse()
        .find((n) => n.parentId === selectedNode.parentId);
      return items.findIndex((n) => n.id === destinationNode?.id);
    } else {
      const destinationNode = items
        .slice(selectedItemIndex + 1)
        .find((n) => n.parentId === selectedNode.parentId);
      return items.findIndex((n) => n.id === destinationNode?.id);
    }
  };

  const getExtractedNodesAmount = (node: MdtNode) => {
    let itemsAmount = 0;
    const counter = (parent: MdtNode[]) => {
      itemsAmount += 1;
      for (let i = 0; i < parent?.length; i++) {
        const newParent = parent[i];
        if (!newParent.expanded) itemsAmount += 1;
        if (newParent.expanded) {
          counter(newParent.children);
        }
      }
    };

    if (node.expanded && node.children) {
      counter(node.children);
    } else {
      itemsAmount = 1;
    }

    return itemsAmount;
  };

  const onContextMenuHandler = (event: UIEventType, row: MdtNode) => {
    const screenHeight = window.screen.height;

    let eventClientY;
    if (row.level !== 1) {
      eventClientY =
        event.clientY + 300 > screenHeight
          ? event.clientY - 240
          : event.clientY;
    } else {
      eventClientY =
        event.clientY + 300 > screenHeight
          ? event.clientY - 170
          : event.clientY;
    }

    setSelectedNodes([row]);

    event.preventDefault();
    setContextMenuInfo({
      x: event.clientX,
      y: eventClientY,
      row,
      target: event.currentTarget,
    });
  };

  const scrollToIndexHandler = (selectedNode: MdtNode) => {
    const index = items.findIndex((item) => item.id === selectedNode.id);
    setScrollToIndex(index);
  };

  const handleCancelModal = (selectedNode: MdtNode) => {
    if (editMode) {
      setIsCancelModalOpen({
        open: true,
        selectedNode,
      });
    }
  };

  let contextMenus = (selectedNode: MdtNode) => {
    return (
      selectedNode && (
        <div key={""}>
          <ContextMenuItem
            onClick={() => {
              if (cutNodeSelection) {
                cutNodeSelection.ids.clear();
                cutNodeSelection.isSelected = true;
              }
              handleCancelModal(selectedNode);
              setSelectedCutItem(selectedNode);
              const selectedNodeIndex = items.findIndex(
                (n) => n.id === selectedNode.id
              );
              const extractedNodesAmount =
                getExtractedNodesAmount(selectedNode);
              const extractedNodes = items.slice(
                selectedNodeIndex,
                selectedNodeIndex + extractedNodesAmount
              );
              extractedNodes.forEach((n) => {
                cutNodeSelection?.ids.add(n.id);
              });
            }}
            name={t("cut")}
            icon={<ContentCut fontSize="small" />}
            disabled={
              !!(
                !hasAmendPermission ||
                selectedNode.id <= 0 ||
                isCMActionDisabled(CM_ACTIONS.CUT, selectedNode)
              )
            }
          />
          <Divider />
          {selectedNode.level !== 1 && (
            <ContextMenuItem
              onClick={() => {
                handleCancelModal(selectedNode);
                if (selectedCutItem && cutNodeSelection) {
                  onPasteFunction(selectedCutItem, selectedNode, "before");
                  setSelectedCutItem(null);
                  cutNodeSelection.isSelected = false;
                }
              }}
              name={t("pastebefore")}
              icon={<ContentCopy fontSize="small" />}
              disabled={
                !!(
                  !hasAmendPermission ||
                  !selectedCutItem ||
                  isCMActionDisabled(CM_ACTIONS.PASTE_BEFORE, selectedNode)
                )
              }
            />
          )}
          {selectedNode.level !== 1 && (
            <ContextMenuItem
              onClick={() => {
                handleCancelModal(selectedNode);
                if (selectedCutItem && cutNodeSelection) {
                  onPasteFunction(selectedCutItem, selectedNode, "after");
                  setSelectedCutItem(null);
                  cutNodeSelection.isSelected = false;
                }
              }}
              name={t("pasteafter")}
              icon={<ContentCopy fontSize="small" />}
              disabled={
                !!(
                  !hasAmendPermission ||
                  !selectedCutItem ||
                  isCMActionDisabled(CM_ACTIONS.PASTE_AFTER, selectedNode)
                )
              }
            />
          )}
          {selectedNode.type === "NODE" && (
            <ContextMenuItem
              onClick={() => {
                handleCancelModal(selectedNode);
                if (selectedCutItem && cutNodeSelection) {
                  onPasteFunction(selectedCutItem, selectedNode);
                  setSelectedCutItem(null);
                  cutNodeSelection.isSelected = false;
                }
              }}
              name={t("pastechild")}
              icon={<ContentCopy fontSize="small" />}
              disabled={
                !!(
                  !hasAmendPermission ||
                  !selectedCutItem ||
                  isCMActionDisabled(CM_ACTIONS.PASTE_CHILD, selectedNode)
                )
              }
            />
          )}
          <Divider />
          <ContextMenuItem
            onClick={() => {
              onMoveUpOrDownFunction(selectedNode, "up");
            }}
            name={t("moveup")}
            icon={<MoveUpIcon fontSize="small" />}
            disabled={
              !!(
                !hasAmendPermission ||
                isCMActionDisabled(CM_ACTIONS.MOVE_UP, selectedNode)
              )
            }
          />
          <ContextMenuItem
            onClick={() => {
              onMoveUpOrDownFunction(selectedNode, "down");
            }}
            name={t("movedown")}
            icon={<MoveDownIcon fontSize="small" />}
            disabled={
              !!(
                !hasAmendPermission ||
                isCMActionDisabled(CM_ACTIONS.MOVE_DOWN, selectedNode)
              )
            }
          />
        </div>
      )
    );
  };

  const isCMActionDisabled = (action: string, selectedNode: MdtNode) => {
    const nodeIndex = items.findIndex((n) => n.id === selectedNode.id);
    switch (action) {
      case CM_ACTIONS.MOVE_UP:
        return !items
          .slice(0, nodeIndex)
          .some((n) => n.parentId === selectedNode.parentId);
      case CM_ACTIONS.MOVE_DOWN:
        return !items
          .slice(nodeIndex + 1)
          .some((n) => n.parentId === selectedNode.parentId);
      case CM_ACTIONS.CUT:
        if (!selectedCutItem) return false;
        return selectedNode.id === selectedCutItem.id;
      case CM_ACTIONS.PASTE_CHILD:
      case CM_ACTIONS.PASTE_BEFORE:
      case CM_ACTIONS.PASTE_AFTER:
        if (!selectedCutItem) return false;
        return (
          selectedNode.id === selectedCutItem.id ||
          cutNodeSelection?.ids.has(selectedNode.id)
        );
      default:
        return false;
    }
  };

  const onCancelModalConfirm = () => {
    if (isCancelModalOpen.selectedNode) {
      setSelectedNodes([isCancelModalOpen.selectedNode]);
      onNodeSelect(isCancelModalOpen.selectedNode);
    }
    setEditMode(false);
    setIsCancelModalOpen({ open: false, selectedNode: null });
  };

  const rowRenderer = ({ index, style }: { index: number; style: any }) => {
    const node = items[index];
    const padding = (node.level - 1) * 20;
    const tmpStyle = {
      ...style,
      userSelect: "none",
      paddingLeft: `${padding}px`,
      paddingRight: `${20}px`,
      ...(selectedCutItem && node.id === selectedCutItem.id
        ? {
            background:
              "linear-gradient(90deg, #045C04 50%, transparent 0) repeat-x," +
              "linear-gradient(90deg, #045C04 50%, transparent 0) repeat-x," +
              "linear-gradient(0deg, #045C04 50%, transparent 0) repeat-y," +
              "linear-gradient(0deg, #045C04 50%, transparent 0) repeat-y",
            backgroundSize: " 4px 1px, 4px 1px, 1px 4px, 1px 4px",
            backgroundPosition: "0 0, 0 100%, 0 0, 100% 0",
            cursor: "pointer",
            animation: "animatedCut .3s infinite linear",
            width: "calc(100% - 2px)",
            borderTop: "none",
          }
        : {}),
    };

    return (
      <Suspense>
        <MDTRow
          key={index}
          node={node}
          index={index}
          style={tmpStyle}
          isSelected={selectedNodes.some((s) => s.id === node.id)}
          onSelect={onNodeSelectClick}
          onNodeEdit={onNodeEdit}
          onExpandClick={async (selectedItem: MdtNode) => {
            await onExpand(selectedItem, index);
          }}
          onCollapseCLick={(selectedItem) => {
            setScrollToIndex(undefined);
            onCollapse(selectedItem, index);
          }}
          setEditMode={setEditMode}
          deleteMDTRow={(data: MdtNode) =>
            setDeleteModal({ isOpen: true, data: data, loading: false })
          }
          viewMode={viewMode}
          onContextMenuHandler={onContextMenuHandler}
          editMode={editMode}
          currentNode={currentNode}
          setIsCancelModalOpen={setIsCancelModalOpen}
          defaultExpanding={defaultExpandingNodes?.[node.id] || false}
          hasAmendPermission={hasAmendPermission}
        />
      </Suspense>
    );
  };

  const expandPath = async (pathArray: number[]) => {
    if (pathArray) {
      for (let index = 0; index < pathArray.length; ++index) {
        const nodeIndex = items.findIndex((el) => el.id === pathArray[index]);
        if (nodeIndex >= 0) {
          setScrollToIndex(nodeIndex);
          const node = items.find((el) => el.id === pathArray[index]);
          if (node) {
            await onExpand(node, nodeIndex, index === pathArray.length - 1);
          }
        }
      }
    }
  };

  return (
    <Box
      width={"100%"}
      height={"100%"}
      display={"flex"}
      flexDirection={"column"}
    >
      {loadMask && (
        <SimpleLoadMask
          loading={true}
          message={"Working, Please Wait..."}
          color={"primary"}
        />
      )}
      <Box>
        {!viewMode && (
          <Paper
            sx={{
              width: "100%",
              height: "100%",
              boxShadow: "none",
            }}
          >
            <MDTHeader
              collapseAll={collapseAll}
              currentNode={currentNode ? currentNode : selectedNodes[0]}
              onExport={onExport}
              setItems={setItems}
              onRefreshClick={onRefreshClick}
              selectedNodes={selectedNodes}
              onSave={onSave}
              isExpanding={isDefaultExpanding}
              hasAmendPermission={hasAmendPermission}
              setLoadMask={setLoadMask}
            />
          </Paper>
        )}
      </Box>
      <Box
        style={{
          paddingTop: 8,
          paddingBottom: 8,
          paddingLeft: 10,
          paddingRight: 10,
          borderBottom:
            theme.palette.mode === "light" &&
            (theme as any).palette.borderColor,
        }}
      >
        <MDTSearchField
          data={filteredData}
          loading={filtering}
          virtualized={true}
          onInputChange={(v) => {
            if (v) {
              setFiltering(true);
              filterNodes(v, foldersOnly)
                .then((resp) => {
                  setFilteredData(resp.data);
                })
                .finally(() => setFiltering(false));
            }
          }}
          onChange={(v, event) => {
            getPath(v.id).then((resp) => {
              expandPath(resp.data);
            });
            onNodeSelect(v, undefined, event);
          }}
          displayFieldFunction={(option) => {
            return `${option.code} ${option.name}`;
          }}
        />
      </Box>
      <Box flex={1} display={"flex"} style={{ userSelect: "none" }}>
        <div>
          {contextMenuVisible &&
            contextMenus &&
            contextMenuOpen &&
            contextMenuInfo && (
              <ContextMenu
                open={contextMenuOpen}
                contextMenuInfo={contextMenuInfo}
                handleClose={() => setContextMenuInfo(null)}
                contextMenus={contextMenus}
              />
            )}
        </div>
        {items ? (
          <AutoSizer>
            {({ height, width }) => (
              <List
                ref={listRef}
                overscanRowCount={10}
                height={height}
                rowCount={items.length}
                rowHeight={size === "small" ? 40 : 48}
                rowRenderer={rowRenderer}
                width={width}
                scrollToIndex={scrollToIndex}
                scrollToAlignment={"center"}
              />
            )}
          </AutoSizer>
        ) : (
          showSkeleton && <MDTTreeSkeleton />
        )}
      </Box>
      {deleteModal.isOpen && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={t(`${deleteModal.data?.type}`)}
          isDeleteModalOpen={deleteModal.isOpen}
          loading={deleteModal.loading}
          loadingBtn={true}
          setIsDeleteModalOpen={() =>
            setDeleteModal({ ...deleteModal, isOpen: false, loading: true })
          }
          onDelete={async () => {
            if (deleteMDTRow && deleteModal.data) {
              setDeleteModal({ ...deleteModal, loading: true });
              const hasDependencies = await deleteMDTRow(
                deleteModal.data,
                setDeleteModal,
                deleteModal
              );

              if (!hasDependencies) {
                scrollToIndexHandler(deleteModal.data);
                init();
              } else {
                setDeleteModal({
                  isOpen: false,
                  data: null,
                  loading: false,
                });
              }
            }
          }}
        />
      )}
      {isCancelModalOpen.open && contextMenuVisible && (
        <ConfirmModal
          isOpen={isCancelModalOpen.open}
          setIsOpen={(open) => {
            setIsCancelModalOpen({ open: open, selectedNode: null });
          }}
          onConfirm={() => {
            onCancelModalConfirm();
          }}
          confirmBtnTitle={t("confirm")}
          headerText={t("cancel")}
          bodyText={t("cancelBodyText")}
          additionalBodyText={t("changes")}
          icon={<CancelIcon />}
        />
      )}
    </Box>
  );
};

export default MDTTree;
