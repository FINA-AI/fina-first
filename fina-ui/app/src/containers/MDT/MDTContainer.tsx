import React, { memo, useEffect, useState } from "react";
import {
  deleteMDTNode,
  editMDTNode,
  getAllMDTCode,
  loadMDTDependencies,
  saveMDTNode,
} from "../../api/services/MDTService";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { BASE_REST_URL } from "../../util/appUtil";
import { PERMISSIONS } from "../../api/permissions";
import useConfig from "../../hoc/config/useConfig";
import { MDTDeleteModal, MDTDependency, MdtNode } from "../../types/mdt.type";

const MDTPage = React.lazy(() => import("../../components/MDT/MDTPage"));

export const treeKey = "MdtTreeCustomization";

interface MDTContainerProps {
  hideHeader: boolean;
  onNodeSelectionChange: (
    node: MdtNode | null,
    selectedNodes?: MdtNode[]
  ) => void;
  allMDTCODE: string[];
  showSkeleton: boolean;
}

const MDTContainer: React.FC<MDTContainerProps> = ({
  hideHeader = false,
  onNodeSelectionChange,
  allMDTCODE,
  showSkeleton,
}) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const { enqueueSnackbar } = useSnackbar();
  const { hasPermission } = useConfig();
  const hasAmendPermission = hasPermission(PERMISSIONS.MDT_AMEND);

  const [connectedNodes, setConnectedNodes] = useState<MDTDependency[]>([]);
  const [connectedForms, setConnectedForms] = useState<MDTDependency[]>([]);
  const [mdtCodes, setMDTCodes] = useState<string[]>([]);
  const [treeItems, setTreeItems] = useState<MdtNode[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedNodes, setSelectedNodes] = useState<MdtNode[]>([]);
  const [currentNode, setCurrentNode] = useState<MdtNode | null>(null);
  const [cutNodeSelection] = useState<{
    isSelected: boolean;
    ids: Set<number>;
  }>({
    isSelected: false,
    ids: new Set([]),
  });

  useEffect(() => {
    loadMDTCodes();
  }, []);

  const loadMDTCodes = () => {
    if (allMDTCODE) {
      setMDTCodes([...allMDTCODE]);
    } else {
      getAllMDTCode(true)
        .then((resp) => {
          setMDTCodes(resp.data);
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
        });
    }
  };

  const initDependencies = async (currentNode: MdtNode) => {
    try {
      if (currentNode) {
        const res = await loadMDTDependencies(currentNode.id);
        setConnectedNodes(res.data.nodes);
        setConnectedForms(res.data.tables);
      }
    } catch (e) {
      openErrorWindow(e, t("error"), true);
    }
  };

  const onNodeSelect = (node: MdtNode | null, selectedNodes?: MdtNode[]) => {
    setEditMode(false);
    if (onNodeSelectionChange) {
      onNodeSelectionChange(node, selectedNodes);
    } else {
      if (selectedNodes) {
        setSelectedNodes(selectedNodes);
      }

      const selectedNode = selectedNodes?.[0];
      setCurrentNode(!node && selectedNode ? selectedNode : node);

      if (node) initDependencies(node);
    }
  };

  const deleteMDTRow = async (
    node: MdtNode,
    setDeleteModal: React.Dispatch<React.SetStateAction<MDTDeleteModal>>,
    deleteModal: MDTDeleteModal
  ) => {
    try {
      const resp = await deleteMDTNode([node.id]);

      if (resp.data[0].deleteResult.totalSize > 0) {
        enqueueSnackbar(t("hasDependencies"), {
          variant: "error",
        });
        return true;
      } else {
        setCurrentNode(null);
        setSelectedNodes([]);
        enqueueSnackbar(t("deleted"), {
          variant: "success",
        });
      }
    } catch (err) {
      openErrorWindow(err, t("error"), true);
    }
    setDeleteModal({ ...deleteModal, isOpen: false, loading: false });
    return false;
  };

  const saveMDT = (node: MdtNode, setData?: (data: MdtNode) => void) => {
    const onAddChildrenRecursive = (
      items: any,
      parentId: number,
      newNode: MdtNode
    ) => {
      return items.map((item: any) => {
        if (item.id === parentId) {
          return {
            ...item,
            children: (item.children || []).concat(newNode),
          };
        } else if (item.children && item.children.length > 0) {
          return {
            ...item,
            children: onAddChildrenRecursive(item.children, parentId, newNode),
          };
        } else {
          return item;
        }
      });
    };

    const onEditChildrenRecursive = (
      items: any,
      editedNode: MdtNode,
      nodeLevel: number
    ) => {
      return items.map((item: any) => {
        if (item.id === editedNode.id) {
          return { ...editedNode, level: nodeLevel };
        } else if (item.children && item.children.length > 0) {
          return {
            ...item,
            children: onEditChildrenRecursive(
              item.children,
              editedNode,
              nodeLevel
            ),
          };
        } else {
          return item;
        }
      });
    };
    if (node.id < 0) {
      if (setData && !areRequiredFieldsFilled(node, setData)) {
        enqueueSnackbar(t("requiredFieldsAreEmpty"), { variant: "error" });
        return;
      }
      let parent =
        treeItems.find((item) => item.id === node.parentId) || ({} as MdtNode);
      let level = node.parentId === 0 ? 1 : parent?.level + 1;
      let sequence: number;
      let children = treeItems.filter(
        (item) => item.parentId === node.parentId
      );
      if (node.parentId === 0) {
        sequence =
          treeItems.length === 0
            ? 0
            : treeItems[treeItems.length - 1].sequence + 1;
      } else {
        sequence =
          children.length === 0 || !children
            ? parent.sequence + 1
            : children[children?.length - 1].sequence + 1;
      }
      saveMDTNode({ ...node, sequence: sequence })
        .then((resp) => {
          let index = treeItems.indexOf(parent);
          let newNode = {
            ...resp.data,
            level: level,
            sequence: sequence,
          };
          setData?.(newNode);
          if (node.parentId === 0) {
            let newTreeItems = treeItems;
            newTreeItems = [...newTreeItems, newNode];
            setTreeItems(newTreeItems);
          } else {
            if (node.expanded) {
              let newTreeItems = treeItems;

              const findChildrenLength = (node: any) => {
                if (!node || !node.children || node.children.length === 0) {
                  return 0;
                }

                let numberOfChildren = node.children.length;

                for (const child of node.children) {
                  numberOfChildren += findChildrenLength(child);
                }
                return numberOfChildren;
              };
              const newIndex = index + 1 + findChildrenLength({ children });

              newTreeItems.splice(newIndex, 0, newNode);

              newTreeItems = onAddChildrenRecursive(
                newTreeItems,
                node.parentId,
                newNode
              );
              setTreeItems(newTreeItems);
            } else if (!node.expanded && node?.children?.length > 0) {
              const tmp = treeItems.map((item) => {
                if (item.id === node.parentId) {
                  return { ...item, children: [...item.children, newNode] };
                }
                return item;
              });
              setTreeItems(tmp);
            }
          }
          setMDTCodes([...mdtCodes, newNode.code]);
          enqueueSnackbar(t("saved"), {
            variant: "success",
          });
          onNodeSelect(null, selectedNodes);
          if (
            cutNodeSelection.isSelected &&
            cutNodeSelection.ids.has(newNode.parentId)
          ) {
            cutNodeSelection.ids.add(newNode.id);
          }
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
        });
    } else {
      editMDTNode(node)
        .then((resp) => {
          let newTreeItems = onEditChildrenRecursive(
            treeItems,
            resp.data,
            node.level
          );

          const updatedNode = { ...node, code: resp.data?.code };

          setTreeItems(newTreeItems);
          setSelectedNodes([updatedNode]);
          const updatedMdtCodes = mdtCodes.filter(
            (code) => code !== updatedNode.code
          );
          setMDTCodes([...updatedMdtCodes, node.code]);
          enqueueSnackbar(t("saved"), {
            variant: "success",
          });
          onNodeSelect(null, selectedNodes);
          initDependencies(updatedNode);
        })
        .catch((err) => {
          setSelectedNodes(selectedNodes);
          openErrorWindow(err, t("error"), true);
        });
    }
  };

  const collapseAll = () => {
    let collapsed = treeItems.filter((item) => item.parentId === 0);
    collapsed = collapsed.map((item) => ({
      ...item,
      children: null,
      expanded: false,
    }));
    setTreeItems(collapsed);
  };

  const onExport = () => {
    let nodeIds = selectedNodes.map((item) => item.id);
    window.open(BASE_REST_URL + `/mdt/export/${nodeIds}`, "_blank");
  };

  const areRequiredFieldsFilled = (node: MdtNode, setData: any) => {
    if (node.code === undefined) {
      setData((prevState: any) => ({ ...prevState, code: "" }));
    }
    return !!node?.code;
  };

  return (
    <MDTPage
      onNodeSelect={onNodeSelect}
      selectedNodes={selectedNodes}
      connectedNodes={connectedNodes}
      connectedForms={connectedForms}
      validMdtCodes={mdtCodes}
      deleteMDTRow={deleteMDTRow}
      saveMDT={saveMDT}
      treeItems={treeItems}
      setTreeItems={setTreeItems}
      collapseAll={collapseAll}
      hideHeader={hideHeader}
      onExport={onExport}
      setSelectedNodes={setSelectedNodes}
      editMode={editMode}
      setEditMode={setEditMode}
      currentNode={currentNode}
      setCurrentNode={setCurrentNode}
      showSkeleton={showSkeleton}
      hasAmendPermission={hasAmendPermission}
      cutNodeSelection={cutNodeSelection}
    />
  );
};

export default memo(MDTContainer);
