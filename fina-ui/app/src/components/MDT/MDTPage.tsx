import { Box, styled } from "@mui/system";
import React, { useMemo, useState } from "react";
import { Grid, Paper, Slide, Typography } from "@mui/material";
import MDTNodeDetails from "./MDTNodeDetails";
import MDTTree from "./Tree/MDTTree";
import { useTranslation } from "react-i18next";
import MDTGeneralInfoHeader from "./MDTGeneralInfo/MDTGeneralInfoHeader";
import { MDTDeleteModal, MDTDependency, MdtNode } from "../../types/mdt.type";

interface MDTPageProps {
  onNodeSelect: (node: MdtNode) => void;
  connectedNodes: MDTDependency[];
  connectedForms: MDTDependency[];
  validMdtCodes: string[];
  treeItems: MdtNode[];
  setTreeItems: (items: MdtNode[]) => void;
  hideHeader: boolean;
  onExport: () => void;
  editMode: boolean;
  setEditMode: (edit: boolean) => void;
  selectedNodes: MdtNode[];
  setSelectedNodes: (nodes: MdtNode[]) => void;
  currentNode: MdtNode | null;
  setCurrentNode: React.Dispatch<React.SetStateAction<MdtNode | null>>;
  showSkeleton: boolean;
  hasAmendPermission: boolean;
  cutNodeSelection: { isSelected: boolean; ids: Set<number> };

  collapseAll(): void;

  deleteMDTRow(
    node: MdtNode,
    setDeleteModal: React.Dispatch<React.SetStateAction<MDTDeleteModal>>,
    deleteModal: MDTDeleteModal
  ): Promise<boolean>;

  saveMDT(node: MdtNode, setData: (data: MdtNode) => void): void;
}

const StyledMainLayout = styled(Box, {
  shouldForwardProp: (prop: string) => !prop.startsWith("_"),
})<{ _hideHeader: boolean }>(({ theme, _hideHeader }) => ({
  backgroundColor: "#F0F1F7",
  height: "100%",
  boxSizing: "border-box",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  ...(theme as any).mainLayout,
  padding: _hideHeader ? "0px" : "16px",
}));

const StyledRootGrid = styled(Grid)(() => ({
  overflow: "hidden",
  height: "100%",
  borderRadius: 8,
  display: "flex",
  flexDirection: "column",
}));

const StyledGridContainer = styled(Grid)(() => ({
  marginTop: 0,
  paddingTop: 0,
  position: "relative",
  overflow: "hidden",
  display: "flex",
  height: "100%",
}));

const StyledPaper = styled(Paper)<{ position?: string }>(() => ({
  width: "100%",
  height: "100%",
  boxShadow: "none",
}));

const StyledCard = styled(Paper, {
  shouldForwardProp: (prop: string) => !prop.startsWith("_"),
})<{ _isMinimized: boolean }>(({ theme, _isMinimized }) => ({
  width: _isMinimized ? "40px" : "700px",
  borderRadius: "unset",
  overflow: _isMinimized ? "hidden" : "auto",
  position: "absolute",
  right: 0,
  top: "90px",
  height: "calc(100% - 90px)",
  "&.MuiPaper-root": {
    transition: "all 0.5s ease-in-out !important",
  },
  borderLeft: theme.palette.borderColor,
}));

const MDTPage: React.FC<MDTPageProps> = ({
  onNodeSelect,
  connectedNodes,
  connectedForms,
  validMdtCodes,
  deleteMDTRow,
  saveMDT,
  setTreeItems,
  treeItems,
  collapseAll,
  hideHeader,
  onExport,
  editMode,
  setEditMode,
  selectedNodes,
  setSelectedNodes,
  currentNode,
  setCurrentNode,
  showSkeleton,
  hasAmendPermission,
  cutNodeSelection,
}) => {
  const { t } = useTranslation();
  const containerRef = React.useRef(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [expandPath, setExpandPath] = useState<number[] | undefined>();

  const toggleCardWidth = () => {
    setIsMinimized((prev) => !prev);
  };

  const onMdtNodeDetailsCloseButtonClick = () => {
    setCurrentNode(null);
    setSelectedNodes([]);
    setIsMinimized(false);
  };

  const MdtNodeDetailsComponent = (
    <StyledCard elevation={4} _isMinimized={isMinimized}>
      <Box height={"100%"}>
        {isMinimized && currentNode ? (
          <MDTGeneralInfoHeader
            data={currentNode}
            editMode={editMode}
            setEditMode={setEditMode}
            saveMDT={saveMDT}
            originalData={null}
            setData={() => {}}
            onMdtNodeDetailsCloseButtonClick={onMdtNodeDetailsCloseButtonClick}
            clearSelectedMdtNode={() => {}}
            resizeFunction={toggleCardWidth}
            isMinimized={isMinimized}
          />
        ) : (
          <MDTNodeDetails
            currentNode={currentNode}
            setCurrentNode={setCurrentNode}
            connectedNodes={connectedNodes}
            connectedForms={connectedForms}
            validMdtCodes={validMdtCodes}
            editMode={editMode}
            saveMDT={saveMDT}
            setEditMode={setEditMode}
            onMdtNodeDetailsCloseButtonClick={onMdtNodeDetailsCloseButtonClick}
            toggleMainCardWidth={toggleCardWidth}
            isMinimized={isMinimized}
            hasAmendPermission={hasAmendPermission}
            setExpandPath={setExpandPath}
          />
        )}
      </Box>
    </StyledCard>
  );

  const getMemoizedTree = useMemo(() => {
    return (
      <MDTTree
        onNodeSelect={onNodeSelect}
        setEditMode={setEditMode}
        deleteMDTRow={deleteMDTRow}
        items={treeItems}
        setItems={setTreeItems}
        size={"small"}
        viewMode={hideHeader}
        contextMenuVisible={true}
        collapseAll={collapseAll}
        onExport={onExport}
        selectedNodes={selectedNodes}
        setSelectedNodes={setSelectedNodes}
        currentNode={currentNode}
        editMode={editMode}
        onSave={saveMDT}
        setCurrentNode={setCurrentNode}
        showSkeleton={showSkeleton}
        setIsCardMinimized={setIsMinimized}
        hasAmendPermission={hasAmendPermission}
        cutNodeSelection={cutNodeSelection}
        expandNodePath={expandPath}
      />
    );
  }, [treeItems, hideHeader, selectedNodes, editMode, expandPath]);

  return (
    <StyledMainLayout ref={containerRef} _hideHeader={hideHeader}>
      {!hideHeader && (
        <Typography fontSize={16} fontWeight={600}>
          {t("metaDataStructure")}
        </Typography>
      )}
      <StyledRootGrid>
        <StyledGridContainer>
          <Grid
            style={{
              paddingTop: 0,
              height: "100%",
              width: "100%",
            }}
          >
            <StyledPaper>{getMemoizedTree}</StyledPaper>
            <StyledPaper position={"relative"}>
              <Slide
                direction="left"
                in={
                  !!currentNode &&
                  (selectedNodes.length === 1 || currentNode.id < 0)
                }
                container={containerRef.current}
                timeout={600}
              >
                {MdtNodeDetailsComponent}
              </Slide>
            </StyledPaper>
          </Grid>
        </StyledGridContainer>
      </StyledRootGrid>
    </StyledMainLayout>
  );
};

export default MDTPage;
