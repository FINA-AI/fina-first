import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import TreeGrid from "../../common/TreeGrid/TreeGrid";
import Paging from "../../common/Paging/Paging";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DeleteIcon from "@mui/icons-material/Delete";
import AddNewCatalogItemModal from "./AddNewCatalogItemModal";
import DeleteForm from "../../common/Delete/DeleteForm";
import CatalogItemVersionForm from "./CatalogItemVersionForm";
import withLoading from "../../../hoc/withLoading";
import { Box, Grid } from "@mui/material";
import { PERMISSIONS } from "../../../api/permissions";
import useConfig from "../../../hoc/config/useConfig";
import ActionBtn from "../../common/Button/ActionBtn";
import EditIcon from "@mui/icons-material/Edit";
import RestoreIcon from "@mui/icons-material/Restore";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import ConfirmModal from "../../common/Modal/ConfirmModal";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SecondaryToolbar from "../../common/Toolbar/SecondaryToolbar";
import { styled } from "@mui/material/styles";
import FilePrintField from "../../common/Field/FilePrintField";
import ContextMenu from "../../common/ContextMenu/ContextMenu";
import ContextMenuItem from "../../common/ContextMenu/ContextMenuItem";
import { ContentCopy, ContentCut } from "@mui/icons-material";
import Divider from "@mui/material/Divider";
import MoveUpIcon from "@mui/icons-material/MoveUp";
import MoveDownIcon from "@mui/icons-material/MoveDown";
import { nodeMove } from "../../../api/services/catalogService";
import { GridColumnType, TreeGridColumnType } from "../../../types/common.type";
import {
  CatalogAddItemModal,
  CatalogForm,
  CatalogItemHistory,
  CatalogItemWithUIProps,
} from "../../../types/catalog.type";
import { CatalogTreeStateType } from "../../../containers/Catalog/CatalogItemContainer";
import { CancelIcon } from "../../../api/ui/icons/CancelIcon";

interface CatalogItemProps {
  columns: TreeGridColumnType[];
  data: CatalogItemWithUIProps[];
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (page: number) => void;
  rowEditFunction: (row: CatalogItemWithUIProps) => void;
  selectedElements: CatalogItemWithUIProps[];
  catalogAddItemModal: CatalogAddItemModal;
  setCatalogAddItemModal: (val: CatalogAddItemModal) => void;
  catalogModalData: Partial<CatalogItemWithUIProps>;
  catalogModalForm: CatalogForm;
  totalNumOfRootRows: number;
  catalogItemHistory: CatalogItemHistory[];
  catalogVersionColumns: GridColumnType[];
  setCatalogItemHistory: React.Dispatch<
    React.SetStateAction<CatalogItemHistory[]>
  >;
  _loading: boolean;
  versionLoading: boolean;
  size: string;
  activePage: number;
  rowsPerPage: number;
  catalogItemTreeState: CatalogTreeStateType;
  setCatalogItemTreeState: (data: CatalogTreeStateType) => void;
  catalogId: number;
  reloadCatalogs(): Promise<void>;
  filterOnChangeFunction(obj: any): void;
  restoreCatalogHandler(row: CatalogItemWithUIProps): Promise<void>;
  onExportClick(val: string, item: any): void;
  checkDependentRows(rowsToCheck?: CatalogItemWithUIProps[]): Promise<any>;
  getCatalogItemVersionFunction(item: CatalogItemWithUIProps): void;
  deleteCatalogItems(deleteChildren: boolean): void;
  saveCatalogItem(data: CatalogItemWithUIProps): Promise<void>;
  checkboxClickHandler(selectedElements: CatalogItemWithUIProps[]): void;
  rowDeleteFunction(
    row: CatalogItemWithUIProps | null,
    deleteChildren: boolean
  ): Promise<void>;
  fetchFunction(
    id: number,
    data: CatalogItemWithUIProps[],
    parentNode: CatalogItemWithUIProps
  ): Promise<any>;
}

const CM_ACTIONS = {
  CUT: "cut",
  PASTE_CHILD: "pastechild",
  MOVE_UP: "moveup",
  MOVE_DOWN: "movedown",
  PASTE_AFTER: "pasteafter",
  PASTE_BEFORE: "pastebefore",
};

const StyledRoot = styled(Box)({
  overflow: "hidden",
  height: "100%",
  borderRadius: 8,
  display: "flex",
  flexDirection: "column",
});

const StyledToolbar = styled(Grid)(({ theme }: any) => ({
  maxHeight: theme.toolbar.height,
  display: "flex",
  alignItems: "center",
  justifyContent: "end",
  borderBottom: theme.palette.borderColor,
  height: 56,
}));

const StyledFooter = styled(Grid)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  zIndex: theme.zIndex.drawer - 2,
  boxShadow: "3px -20px 8px -4px #bababa1a",
  position: "relative",
  padding: "8px 16px",
}));

const StyledDataContainer = styled(Grid)({
  marginTop: 0,
  paddingTop: 0,
  position: "relative",
  overflow: "hidden",
  display: "flex",
  height: "100%",
});

const StyledDataContent = styled(Grid)({
  paddingTop: 0,
  height: "100%",
  width: "100%",
});

const commonIconStyles = (theme: any, size?: string) => ({
  marginLeft: "5px",
  width: size === "small" ? "16px" : "20px",
  height: size === "small" ? "16px" : "20px",
  "& .MuiSvgIcon-root": {
    width: size === "small" ? "16px" : "20px",
    height: size === "small" ? "16px" : "20px",
  },
});

const StyledFolderIcon = styled(FolderIcon)<{ size: string }>(
  ({ theme, size }) => ({
    ...commonIconStyles(theme, size),
  })
);

const StyledFolderOpenIcon = styled(FolderOpenIcon)<{ size: string }>(
  ({ theme, size }) => ({
    ...commonIconStyles(theme, size),
  })
);

const StyledAssignmentIcon = styled(AssignmentIcon)<{ size?: string }>(
  ({ theme, size }) => ({
    ...commonIconStyles(theme, size),
  })
);

const CatalogItem: React.FC<CatalogItemProps> = ({
  catalogItemTreeState,
  setCatalogItemTreeState,
  data,
  columns,
  onPageChange,
  onRowsPerPageChange,
  totalNumOfRootRows,
  fetchFunction,
  selectedElements,
  checkboxClickHandler,
  rowEditFunction,
  rowDeleteFunction,
  saveCatalogItem,
  deleteCatalogItems,
  catalogAddItemModal,
  setCatalogAddItemModal,
  catalogModalData,
  catalogModalForm,
  getCatalogItemVersionFunction,
  catalogItemHistory,
  catalogVersionColumns,
  setCatalogItemHistory,
  checkDependentRows,
  _loading,
  onExportClick,
  versionLoading,
  restoreCatalogHandler,
  size = "default",
  filterOnChangeFunction,
  activePage,
  rowsPerPage,
  reloadCatalogs,
  catalogId,
}) => {
  const { t } = useTranslation();
  const [catalogItemVersionModal, setCatalogItemVersionModal] = useState(false);
  const newToolbarActive = () => {
    if (selectedElements) {
      return (
        selectedElements.every((item) => !item.deleted) &&
        selectedElements.length > 1
      );
    }
    return false;
  };
  const [deleteFormOpen, setDeleteFormOpen] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [confirmDeleteLabel, setConfirmDeleteLabel] = useState();
  const [confirmDeleteChecked, setConfirmDeleteChecked] = useState(false);
  const [singleDeleteSelectedRow, setSingleDeleteSelectedRow] =
    useState<CatalogItemWithUIProps | null>(null);
  const [headerText, setHeaderText] = useState();
  const [restoreConfirmModal, setRestoreConfirmModal] = useState<any>({
    isOpen: false,
    row: null,
  });
  const { hasPermission } = useConfig();

  const [selectedCutNode, setSelectedCutNode] =
    useState<CatalogItemWithUIProps | null>(null);
  const [contextMenuInfo, setContextMenuInfo] = useState<any>();
  let [cutNodeIds] = useState<Set<number>>(new Set([]));
  let [expandedNodeIds] = useState<Set<number>>(new Set([]));
  let flatTreeData = useRef([...catalogItemTreeState.treeData]);

  const [defaultExpandedNodeIds, setDefaultExpandedNodeIds] = useState<
    number[]
  >([]);

  let contextMenuOpen = Boolean(contextMenuInfo);

  useEffect(() => {
    const handleClick = () => {
      setContextMenuInfo(null);
    };
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    flatTreeData.current = getFlattenRows(catalogItemTreeState.treeData);
  }, [catalogItemTreeState.treeData]);

  const getFlattenRows = (data: CatalogItemWithUIProps[]) => {
    const result: CatalogItemWithUIProps[] = [];

    function traverse(node: CatalogItemWithUIProps) {
      result.push({ ...node });
      if (
        expandedNodeIds.has(node.rowId) &&
        node.children &&
        node.children.length > 0
      ) {
        node.children.forEach((child) => traverse(child));
      }
    }

    data.forEach((item) => traverse(item));
    return result;
  };

  const getExtractedNodesAmount = (node: CatalogItemWithUIProps) => {
    let itemsAmount = 0;
    const counter = (parent: CatalogItemWithUIProps[]) => {
      itemsAmount += 1;
      for (let i = 0; i < parent?.length; i++) {
        const newParent = parent[i];
        if (!expandedNodeIds.has(newParent.rowId)) itemsAmount += 1;
        if (expandedNodeIds.has(newParent.rowId)) {
          counter(newParent.children);
        }
      }
    };

    if (expandedNodeIds.has(node.rowId) && node.children) {
      counter(node.children);
    } else {
      itemsAmount = 1;
    }

    return itemsAmount;
  };

  const onDeleteRow = async (row: CatalogItemWithUIProps) => {
    setSingleDeleteSelectedRow(null);
    setHeaderText(t("Delete"));

    if (row.leaf) {
      setShowConfirmDelete(false);
      setDeleteFormOpen(true);
      setSingleDeleteSelectedRow(row);
    } else {
      const hasDependentRows = await checkDependentRows([row]);
      if (!hasDependentRows) {
        setShowConfirmDelete(false);
        setDeleteFormOpen(true);
        setSingleDeleteSelectedRow(row);
      } else {
        setConfirmDeleteLabel(t("deleteDependentRows"));
        setSingleDeleteSelectedRow(row);
        setShowConfirmDelete(hasDependentRows);
        setDeleteFormOpen(true);
      }
    }
  };

  const onDeleteAll = async () => {
    setHeaderText(
      t("deleteWarningCatalogItems", {
        itemsLength: selectedElements.length,
      })
    );
    setConfirmDeleteLabel(t("deleteDependentRows"));
    const hasDependentRows = await checkDependentRows();
    setShowConfirmDelete(hasDependentRows);
    setDeleteFormOpen(true);
  };

  const deleteCatalogItemsFunction = () => {
    if (singleDeleteSelectedRow) {
      rowDeleteFunction(singleDeleteSelectedRow, confirmDeleteChecked);
    } else {
      deleteCatalogItems(confirmDeleteChecked);
    }
    setDeleteFormOpen(false);
    setConfirmDeleteChecked(false);
    setShowConfirmDelete(false);
    setSingleDeleteSelectedRow(null);
  };

  const versionClickFunction = (item: CatalogItemWithUIProps) => {
    setCatalogItemVersionModal(true);
    getCatalogItemVersionFunction(item);
  };

  let actionButtons = (row: CatalogItemWithUIProps, index: number) => {
    return (
      <>
        {!row.deleted &&
          !row.leaf &&
          hasPermission(PERMISSIONS.CATALOG_AMEND) && (
            <ActionBtn
              onClick={() =>
                setCatalogAddItemModal({ isOpen: true, data: row })
              }
              rowIndex={index}
              children={<AddIcon />}
              tooltipTitle={t("add")}
              buttonName={"add"}
            />
          )}
        {row.deleted && hasPermission(PERMISSIONS.CATALOG_DELETE) && (
          <ActionBtn
            onClick={() => setRestoreConfirmModal({ isOpen: true, row })}
            rowIndex={index}
            children={<SettingsBackupRestoreIcon />}
            tooltipTitle={t("restore")}
            buttonName={"restore"}
          />
        )}
        <ActionBtn
          onClick={() => versionClickFunction(row)}
          rowIndex={index}
          children={<RestoreIcon />}
          tooltipTitle={t("history")}
          buttonName={"history"}
        />
        {!row.deleted && (
          <>
            {hasPermission(PERMISSIONS.CATALOG_AMEND) && (
              <ActionBtn
                onClick={() => rowEditFunction(row)}
                children={<EditIcon />}
                rowIndex={index}
                tooltipTitle={t("edit")}
                buttonName={"edit"}
              />
            )}

            {hasPermission(PERMISSIONS.CATALOG_DELETE) && (
              <ActionBtn
                onClick={() => {
                  onDeleteRow(row);
                }}
                children={<DeleteIcon />}
                color={"#FF735A"}
                rowIndex={index}
                tooltipTitle={t("delete")}
                buttonName={"delete"}
              />
            )}
          </>
        )}
      </>
    );
  };

  const treeIcons = {
    expandedIcon: () => {
      return (
        <StyledFolderIcon
          size={size}
          style={{
            color: "#2962FF",
          }}
        />
      );
    },
    folder: () => {
      return (
        <StyledFolderOpenIcon
          size={size}
          style={{
            color: "#AEB8CB",
          }}
        />
      );
    },
    leaf: () => {
      return <StyledAssignmentIcon style={{ color: "#1c7483" }} />;
    },
  };

  const onContextMenuHandler = (event: any, row: CatalogItemWithUIProps) => {
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

    event.preventDefault();
    setContextMenuInfo({
      x: event.clientX,
      y: eventClientY,
      row,
      target: event.currentTarget,
    });
  };

  const isCMActionDisabled = (
    action: string,
    selectedNode: CatalogItemWithUIProps
  ) => {
    const nodes = flatTreeData.current;
    const nodeIndex = nodes.findIndex((n) => n.rowId === selectedNode.rowId);
    switch (action) {
      case CM_ACTIONS.MOVE_UP:
        return !nodes
          .slice(0, nodeIndex)
          .some((n) => n.parentRowId === selectedNode.parentRowId);
      case CM_ACTIONS.MOVE_DOWN:
        return !nodes
          .slice(nodeIndex + 1)
          .some((n) => n.parentRowId === selectedNode.parentRowId);
      case CM_ACTIONS.CUT:
        if (!selectedCutNode) return false;
        return selectedNode.rowId === selectedCutNode.rowId;
      case CM_ACTIONS.PASTE_CHILD:
        if (!selectedCutNode) return true;
        return (
          selectedNode.leaf ||
          selectedNode.rowId === selectedCutNode.rowId ||
          cutNodeIds.has(selectedNode.rowId)
        );
      case CM_ACTIONS.PASTE_BEFORE:
      case CM_ACTIONS.PASTE_AFTER:
        if (!selectedCutNode) return true;
        return (
          selectedNode.rowId === selectedCutNode.rowId ||
          cutNodeIds.has(selectedNode.rowId)
        );
      default:
        return false;
    }
  };

  const handleOnCutNode = (selectedNode: CatalogItemWithUIProps) => {
    cutNodeIds.clear();
    const nodes = flatTreeData.current;
    setSelectedCutNode(selectedNode);
    const selectedNodeIndex = nodes.findIndex(
      (n) => n.rowId === selectedNode.rowId
    );
    const amount = getExtractedNodesAmount(selectedNode);
    nodes.slice(selectedNodeIndex, selectedNodeIndex + amount).forEach((n) => {
      cutNodeIds.add(n.rowId);
    });
  };

  let contextMenus = (selectedNode: CatalogItemWithUIProps) => {
    return (
      selectedNode && (
        <div key={""}>
          <ContextMenuItem
            onClick={() => handleOnCutNode(selectedNode)}
            name={t("cut")}
            icon={<ContentCut fontSize="small" />}
            disabled={isCMActionDisabled(CM_ACTIONS.CUT, selectedNode)}
          />
          <Divider />
          <ContextMenuItem
            onClick={() => {
              onPasteFunc(
                selectedCutNode,
                selectedNode,
                CM_ACTIONS.PASTE_BEFORE
              );
            }}
            name={t("pastebefore")}
            icon={<ContentCopy fontSize="small" />}
            disabled={isCMActionDisabled(CM_ACTIONS.PASTE_BEFORE, selectedNode)}
          />
          <ContextMenuItem
            onClick={() => {
              onPasteFunc(
                selectedCutNode,
                selectedNode,
                CM_ACTIONS.PASTE_AFTER
              );
            }}
            name={t("pasteafter")}
            icon={<ContentCopy fontSize="small" />}
            disabled={isCMActionDisabled(CM_ACTIONS.PASTE_AFTER, selectedNode)}
          />
          <ContextMenuItem
            onClick={() => {
              onPasteFunc(
                selectedCutNode,
                selectedNode,
                CM_ACTIONS.PASTE_CHILD
              );
            }}
            name={t("pastechild")}
            icon={<ContentCopy fontSize="small" />}
            disabled={isCMActionDisabled(CM_ACTIONS.PASTE_CHILD, selectedNode)}
          />
          <Divider />
          <ContextMenuItem
            onClick={() => {
              onMoveUpOrDownFunc(selectedNode, CM_ACTIONS.MOVE_UP);
            }}
            name={t("moveup")}
            icon={<MoveUpIcon fontSize="small" />}
            disabled={isCMActionDisabled(CM_ACTIONS.MOVE_UP, selectedNode)}
          />
          <ContextMenuItem
            onClick={() => {
              onMoveUpOrDownFunc(selectedNode, CM_ACTIONS.MOVE_DOWN);
            }}
            name={t("movedown")}
            icon={<MoveDownIcon fontSize="small" />}
            disabled={isCMActionDisabled(CM_ACTIONS.MOVE_DOWN, selectedNode)}
          />
        </div>
      )
    );
  };

  const onNodeExpandChange = (expandedIds: number[]) => {
    expandedNodeIds.clear();
    expandedIds.forEach((id) => expandedNodeIds.add(id));
    flatTreeData.current = getFlattenRows(catalogItemTreeState.treeData);
  };

  const onMoveUpOrDownFunc = async (
    node: CatalogItemWithUIProps,
    moveDr: string
  ) => {
    const nodes = flatTreeData.current;
    const nodeIndex = nodes.findIndex((n) => n.rowId === node.rowId);
    const adjacentNodeIndex = getDestinationNodeIndex(moveDr, node, nodeIndex);

    const newRowNumber = nodes[adjacentNodeIndex].rowNumber;

    await nodeMove(catalogId, node.rowId, newRowNumber, node.parentRowId)
      .then(() => {
        handleTreeOrNodeReload(node);
        setSelectedCutNode(null);
      })
      .catch(() => {});
  };

  const onPasteFunc = async (
    selectedCutNode: CatalogItemWithUIProps | null,
    selectedNode: CatalogItemWithUIProps | null,
    pasteDr: string
  ) => {
    let itemRowId, itemRowNumber, itemParentRowId;

    switch (pasteDr) {
      case CM_ACTIONS.PASTE_CHILD:
        itemRowId = selectedCutNode?.rowId;
        itemRowNumber = -1;
        itemParentRowId = selectedNode?.rowId;
        break;
      case CM_ACTIONS.PASTE_AFTER:
        itemRowId = selectedCutNode?.rowId;
        itemRowNumber = selectedNode?.rowNumber && selectedNode?.rowNumber + 1;
        itemParentRowId = selectedNode?.parentRowId;
        break;
      case CM_ACTIONS.PASTE_BEFORE:
        itemRowId = selectedCutNode?.rowId;
        itemRowNumber = selectedNode?.rowNumber;
        itemParentRowId = selectedNode?.parentRowId;
        break;
      default:
        break;
    }

    try {
      await nodeMove(catalogId, itemRowId, itemRowNumber, itemParentRowId);
      await reloadCatalogs();

      setDefaultExpandedNodeIds(Array.from(expandedNodeIds));
      setSelectedCutNode(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleTreeOrNodeReload = async (node: CatalogItemWithUIProps) => {
    if (node.parentRowId === 0) {
      try {
        await reloadCatalogs();
        setDefaultExpandedNodeIds(Array.from(expandedNodeIds));
      } catch (err) {
        console.log(err);
      }
    } else {
      const parentNode: CatalogItemWithUIProps | null = getNodeByRowId(
        node.parentRowId
      );
      if (parentNode) {
        parentNode.children = await fetchFunction(
          parentNode["rowId"],
          data,
          parentNode
        );
        parentNode.children = parentNode.children.map((e) => ({
          ...e,
          level: parentNode.level === undefined ? 0 : parentNode.level + 1,
        }));
        setCatalogItemTreeState({
          ...catalogItemTreeState,
          treeData: [...catalogItemTreeState.treeData],
        });
      }
    }
  };

  const getDestinationNodeIndex = (
    moveDirection: string,
    selectedNode: CatalogItemWithUIProps,
    selectedItemIndex: number
  ) => {
    const nodes = flatTreeData.current;
    if (moveDirection === CM_ACTIONS.MOVE_UP) {
      const destinationNode = nodes
        .slice(0, selectedItemIndex)
        .reverse()
        .find((n) => n.parentRowId === selectedNode.parentRowId);
      return nodes.findIndex((n) => n.rowId === destinationNode?.rowId);
    } else {
      const destinationNode = nodes
        .slice(selectedItemIndex + 1)
        .find((n) => n.parentRowId === selectedNode.parentRowId);
      return nodes.findIndex((n) => n.rowId === destinationNode?.rowId);
    }
  };

  const getNodeByRowId = (rowId: number): CatalogItemWithUIProps | null => {
    const { treeData } = catalogItemTreeState;
    let result: CatalogItemWithUIProps | null = null;

    function traverse(node: CatalogItemWithUIProps) {
      if (node.rowId === rowId) {
        result = node;
        return;
      }

      if (node.children && node.children.length > 0) {
        for (let child of node.children) {
          traverse(child);
          if (result) return;
        }
      }
    }

    for (let item of treeData) {
      traverse(item);
      if (result) break;
    }

    return result;
  };

  return (
    <StyledRoot data-testid={"catalog-item-page"}>
      <StyledToolbar>
        {newToolbarActive() ? (
          <SecondaryToolbar
            selectedItemsCount={selectedElements.length}
            onDeleteButtonClick={() => onDeleteAll()}
            onCancelClick={() => {
              checkboxClickHandler([]);
            }}
          />
        ) : (
          <div>
            {hasPermission(PERMISSIONS.CATALOG_EXPORT) && (
              <FilePrintField
                buttonProps={{
                  "data-testid": "catalog-export-button",
                }}
                label={t("export")}
                icon={
                  <FileDownloadIcon
                    style={{ marginLeft: "3px", color: "#98A7BC" }}
                  />
                }
                handleClick={onExportClick}
                style={{
                  marginRight: "8px",
                }}
                isDisabled={() => {
                  return false;
                }}
                displayOptions={[
                  { type: t("data"), value: "SIMPLE", key: "data" },
                  {
                    type: t("metadata"),
                    value: "FULL",
                    key: "meta-data",
                  },
                ]}
              />
            )}
            <span style={{ marginLeft: "8px", marginRight: 16 }}>
              {hasPermission(PERMISSIONS.CATALOG_AMEND) && (
                <PrimaryBtn
                  onClick={() => {
                    setCatalogAddItemModal({ isOpen: true, data: null });
                  }}
                  disabled={
                    selectedElements.length > 0 &&
                    selectedElements[0].leaf === true
                  }
                  endIcon={<AddIcon />}
                  data-testid={"create-catalog-item-button"}
                >
                  {t("addRoot")}
                </PrimaryBtn>
              )}
            </span>
          </div>
        )}
      </StyledToolbar>
      <StyledDataContainer flex={1}>
        <StyledDataContent flex={1}>
          <TreeGrid
            treeState={catalogItemTreeState}
            setTreeState={setCatalogItemTreeState}
            fetchFunction={fetchFunction}
            data={data}
            columns={columns}
            checkboxClickHandler={checkboxClickHandler}
            idName={"rowId"}
            parentIdName={"parentRowId"}
            rootId={0}
            rowDeleteFunction={onDeleteRow}
            loading={false}
            actionButtons={actionButtons}
            selectedElements={selectedElements}
            hideActionBtn={false}
            defaultExpandedRowsIds={defaultExpandedNodeIds}
            treeIcons={treeIcons}
            filterOnChangeFunction={filterOnChangeFunction}
            onContextMenu={(event: any, node: CatalogItemWithUIProps) =>
              onContextMenuHandler(event, node)
            }
            selectedCutNode={selectedCutNode}
            onNodeExpandChange={onNodeExpandChange}
          />
        </StyledDataContent>
      </StyledDataContainer>
      <StyledFooter>
        <Paging
          initialPage={activePage}
          totalNumOfRows={totalNumOfRootRows}
          onRowsPerPageChange={(number) => onRowsPerPageChange(number)}
          onPageChange={(number) => onPageChange(number)}
          isMini={false}
          initialRowsPerPage={rowsPerPage}
        />
      </StyledFooter>
      {catalogAddItemModal.isOpen && (
        <AddNewCatalogItemModal
          open={catalogAddItemModal.isOpen}
          handClose={() =>
            setCatalogAddItemModal({ isOpen: false, data: null })
          }
          saveCatalogItem={saveCatalogItem}
          currCatalogItem={catalogAddItemModal.data}
          catalogModalForm={catalogModalForm}
          catalogModalData={catalogModalData}
          isEdit={catalogAddItemModal.isEdit}
        />
      )}
      <DeleteForm
        isDeleteModalOpen={deleteFormOpen}
        setIsDeleteModalOpen={setDeleteFormOpen}
        onDelete={deleteCatalogItemsFunction}
        headerText={headerText}
        bodyText={t("deleteConfirmationWarningCatalogItems")}
        showConfirm={showConfirmDelete}
        confirmLabel={confirmDeleteLabel}
        confirmChecked={confirmDeleteChecked}
        setConfirmChecked={setConfirmDeleteChecked}
      />
      <CatalogItemVersionForm
        catalogItemVersionModal={catalogItemVersionModal}
        handClose={() => setCatalogItemVersionModal(!catalogItemVersionModal)}
        catalogItemHistory={catalogItemHistory}
        catalogVersionColumns={catalogVersionColumns}
        setCatalogItemHistory={setCatalogItemHistory}
        setCatalogItemVersionModal={setCatalogItemVersionModal}
        versionLoading={versionLoading}
      />
      <ConfirmModal
        isOpen={restoreConfirmModal.isOpen}
        setIsOpen={setRestoreConfirmModal}
        onConfirm={() => {
          restoreCatalogHandler(restoreConfirmModal.row);
          setRestoreConfirmModal({ ...restoreConfirmModal, isOpen: false });
        }}
        confirmBtnTitle={t("yes")}
        cancelBtnTitle={t("no")}
        bodyText={t("catalogRestoreQuestion")}
        icon={<CancelIcon />}
      />
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
    </StyledRoot>
  );
};

export default withLoading(CatalogItem);
