import { Box } from "@mui/system";
import { connect } from "react-redux";
import { styled } from "@mui/material/styles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import React, { useEffect, useState } from "react";
import CopyCellButton from "../../common/Grid/CopyCellButton";
import MDTTreeNodeIcon from "./MDTTreeNodeIcon";
import MDTTreeRowActionMenu from "./MDTTreeRowActionMenu";
import TreeExpandLoadingIcon from "../../common/Tree/TreeExpandLoadingIcon";
import { getLanguage } from "../../../util/appUtil";
import { MdtNode } from "../../../types/mdt.type";
import { LanguageType, UIEventType } from "../../../types/common.type";

interface MDTRowProps {
  node: MdtNode;
  index: number;
  style: React.CSSProperties;
  onExpandClick: (node: MdtNode) => void;
  onCollapseCLick: (node: MdtNode) => void;
  isSelected: boolean;
  setEditMode: (value: boolean) => void;
  deleteMDTRow: (data: MdtNode) => void;
  viewMode: boolean;
  currentNode?: MdtNode | null;
  editMode: boolean;
  setIsCancelModalOpen: (
    value: React.SetStateAction<{
      open: boolean;
      selectedNode: MdtNode | null;
    }>
  ) => void;
  defaultExpanding: boolean;
  hasAmendPermission?: boolean;
  languages: LanguageType[];

  onContextMenuHandler(event: UIEventType, row: MdtNode): void;

  onNodeEdit(node: MdtNode): void;

  onSelect(node: MdtNode, event: UIEventType): void;
}

const StyledRow = styled("div", {
  shouldForwardProp: (prop: string) => !prop.startsWith("_"),
})<{ _isSelected: boolean }>(({ theme, _isSelected }) => ({
  boxSizing: "border-box",
  userSelect: "none",

  "&:hover": {
    background:
      theme.palette.mode === "light" ? "rgba(80,80,80, 0.05)" : "#3C4D68",
    "& .actionMenu": {
      display: "block",
    },
  },
  position: "relative", // Ensure positioning works for the child element

  background: _isSelected ? (theme as any).palette.action.select : "inherit",
}));

const ActionMenu = styled("div")(() => ({
  minWidth: 100,
  maxWidth: 120,
  backgroundColor: "inherit",
  display: "none",
  // position: "absolute !important",
  marginRight: 5,
  right: 0,
  top: 0,
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
}));

const StyledMdcCellBox = styled(Box)(() => ({
  paddingLeft: 8,
  whiteSpace: "nowrap !important",
  overflow: "hidden !important",
  textOverflow: "ellipsis !important",
  "&:hover": {
    cursor: "pointer",
    "& .copyButton": {
      visibility: "visible", // Targets the child with class 'copyButton'
    },
  },
}));
const StyledNameField = styled("div")(() => ({
  width: "100%",
  cursor: "pointer",
  overflow: "hidden",
  textOverflow: "ellipsis",
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: "11px",
  lineHeight: "20px",
  color: "#8695B1",
  paddingLeft: 10,
}));

const CopyButton = styled(Box)(() => ({
  visibility: "hidden",
}));

const StyledMdcCodeBox = styled(Box, {
  shouldForwardProp: (prop: string) => !prop.startsWith("_"),
})<{ _expanded: boolean }>(({ theme, _expanded }) => ({
  paddingLeft: 10,
  paddingRight: 10,
  paddingTop: 8,
  paddingBottom: 8,
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: "11px",
  lineHeight: "20px",
  "&:hover": {
    background: theme.palette.mode !== "dark" ? "#FFFFFF" : "rgb(124,127,136)",
    borderRadius: "8px !Important",
  },
  alignItems: "center",
  color: _expanded ? theme.palette.primary.main : "",
}));

const MDTRow: React.FC<MDTRowProps> = ({
  node,
  style,
  index,
  onExpandClick,
  onCollapseCLick,
  isSelected,
  onSelect,
  setEditMode,
  deleteMDTRow,
  viewMode,
  onContextMenuHandler,
  currentNode,
  editMode,
  setIsCancelModalOpen,
  defaultExpanding,
  onNodeEdit,
  hasAmendPermission,
  languages,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [expanding, setExpanding] = useState(false);
  const [copyLoading, setCopyLoading] = useState(false);
  const langCode = getLanguage();
  const currentLang: LanguageType | null =
    languages.find((lang) => lang.code === langCode) || null;

  useEffect(() => {
    setExpanded(node.expanded);
  }, [node.expanded]);

  const onExpand = async (e: UIEventType) => {
    e.preventDefault();
    e.stopPropagation();
    setExpanding(true);
    await onExpandClick(node);
    setExpanding(false);
    setExpanded(true);
  };

  const ExpandIcon = () => {
    return expanded ? (
      <KeyboardArrowDownIcon
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onCollapseCLick(node);
          setExpanded(false);
        }}
        sx={{
          color: "#C3CAD8",
          width: "16px",
          height: "16px",
        }}
      />
    ) : (
      <KeyboardArrowUpIcon
        onClick={onExpand}
        sx={{
          color: "#C3CAD8",
          width: "16px",
          height: "16px",
        }}
      />
    );
  };

  const ArrowIcon = () => {
    const icon =
      expanding || defaultExpanding ? (
        <TreeExpandLoadingIcon
          width={"16px"}
          iconStyle={{ width: "16px", height: "16px" }}
        />
      ) : (
        <ExpandIcon />
      );

    if ((expanded && node.children?.length <= 0) || node.type !== "NODE") {
      return (
        <div
          style={{ visibility: "hidden", margin: "0px 12px", width: "16px" }}
        ></div>
      );
    }

    return (
      <Box
        display={"flex"}
        justifyContent={"center"}
        style={{
          cursor: "pointer",
          color: expanded ? "#9AA7BE" : "#8695B1",
          margin: "0px 12px",
        }}
      >
        {icon}
      </Box>
    );
  };

  const MDTCell = () => {
    return (
      <StyledMdcCellBox
        display={"flex"}
        width={"100%"}
        height={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <StyledMdcCodeBox _expanded={expanded} display={"flex"}>
          <Box>{node.code}</Box>
          <CopyButton
            className={"copyButton"}
            sx={{
              visibility: copyLoading ? "visible" : "",
            }}
          >
            <CopyCellButton
              text={node.code}
              onLoadStart={() => setCopyLoading(true)}
              onLoadEnd={() => setCopyLoading(false)}
            />
          </CopyButton>
        </StyledMdcCodeBox>
        <StyledNameField>
          {currentLang && node.descriptions
            ? node.descriptions[currentLang.id]
            : node.name}
        </StyledNameField>
      </StyledMdcCellBox>
    );
  };

  return (
    <StyledRow
      data-testid={node.code}
      _isSelected={isSelected}
      key={index}
      style={style}
      onClick={(event) => {
        setTimeout(() => {}, 200);
        if (event.detail === 2) {
          event.preventDefault();
          event.stopPropagation();

          if (
            (expanded && node.children?.length <= 0) ||
            node.type !== "NODE"
          ) {
            return;
          }

          if (expanded) {
            onCollapseCLick(node);
          } else {
            onExpand(event);
          }
          return;
        }
        if (editMode && node.id !== currentNode?.id) {
          setIsCancelModalOpen({ open: true, selectedNode: node });
        } else {
          onSelect(node, event);
        }
      }}
      onContextMenu={(event) => onContextMenuHandler(event, node)}
    >
      <Box display={"flex"} height={"100%"}>
        <Box display={"flex"} alignItems={"center"}>
          <ArrowIcon />
          <Box display={"flex"} alignItems={"center"}>
            <MDTTreeNodeIcon nodeType={node.type} />
          </Box>
        </Box>
        {MDTCell()}
        {!viewMode && (
          <ActionMenu className={"actionMenu"}>
            <MDTTreeRowActionMenu
              node={node}
              addHandler={() => {
                setEditMode(true);
              }}
              editHandler={(node: MdtNode) => {
                onNodeEdit(node);
                setEditMode(true);
              }}
              deleteHandler={() => {
                deleteMDTRow(node);
              }}
              hasAmendPermission={hasAmendPermission}
            />
          </ActionMenu>
        )}
      </Box>
    </StyledRow>
  );
};

const mapStateToProps = (state: any) => ({
  languages: state.getIn(["language", "languages"]),
});

export default connect(mapStateToProps)(MDTRow);
