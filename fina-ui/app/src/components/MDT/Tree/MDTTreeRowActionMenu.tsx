import { Box, styled } from "@mui/system";
import { IconButton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import React, { useState } from "react";
import MDTTreeNodeIcon from "./MDTTreeNodeIcon";
import { useTranslation } from "react-i18next";
import Popover from "@mui/material/Popover";
import useConfig from "../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../api/permissions";
import { MdtNode, MDTNodeType } from "../../../types/mdt.type";
import { UIEventType } from "../../../types/common.type";

interface MDTTreeRowActionMenuProps {
  node: MdtNode;
  addHandler: (data: MdtNode) => void;
  editHandler: (data: MdtNode) => void;
  deleteHandler: (data: MdtNode) => void;
  hasAmendPermission?: boolean;
}

const StyledTypography = styled(Typography)(() => ({
  color: "#FFFFFF",
  fontSize: 12,
  fontWeight: 400,
  marginLeft: 6,
  textWrap: "nowrap",
  whiteSpace: "nowrap",
}));

const StyledPopoverContent = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  borderRadius: 2,
  padding: "8px",
  gap: 4,
  boxShadow: " 0px 2px 10px rgba(0, 0, 0, 0.08)",
  "& .MuiSvgIcon-root": {
    color: "#FFFFFF !important",
  },
  maxWidth: 200,
  overflow: "hidden",
  backgroundColor: "#2A3341",
  zIndex: 100,
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  margin: 5,
  backgroundColor: theme.palette.paperBackground,
  height: 32,
  width: 32,
  border: "0.5px solid rgba(104, 122, 158, 0.08)",
}));

const MDTTreeRowActionMenu: React.FC<MDTTreeRowActionMenuProps> = ({
  node,
  addHandler,
  editHandler,
  deleteHandler,
  hasAmendPermission,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();

  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const open = Boolean(anchorEl);

  const popoverOpenHandler = (event: UIEventType) => {
    setAnchorEl(event.currentTarget);
  };
  const popoverCloseHandler = () => {
    setAnchorEl(null);
  };

  const getPopoverRow = (type: string, title: string) => {
    return (
      <Box
        display={"flex"}
        sx={{
          padding: 2,
          cursor: "pointer",
          "&:hover": {
            background: "rgba(255, 255, 255, 0.1)",
          },
        }}
        onClick={(event) => {
          event.stopPropagation();
          popoverCloseHandler();
          editHandler({
            expanded: node.expanded,
            id: -1,
            type: type,
            parentId: node.id,
            key: false,
            required: false,
            disabled: false,
          } as MdtNode);
        }}
        data-testid={title + "-button"}
      >
        <MDTTreeNodeIcon nodeType={type} />
        <StyledTypography> {t(title)} </StyledTypography>
      </Box>
    );
  };

  const getPopoverContent = () => {
    return (
      <StyledPopoverContent data-testid={"mdt-tree-row-creation-menu"}>
        {getPopoverRow(MDTNodeType.NODE, "addNode")}
        {getPopoverRow(MDTNodeType.INPUT, "addInput")}
        {getPopoverRow(MDTNodeType.VARIABLE, "addVariable")}
        {getPopoverRow(MDTNodeType.LIST, "addList")}
        {getPopoverRow(MDTNodeType.DATA, "addData")}
      </StyledPopoverContent>
    );
  };

  return (
    <Box
      display={"flex"}
      height={"100%"}
      flexDirection={"row"}
      justifyContent={"center"}
      alignItems={"center"}
      data-testid={"mdt-tree-row-actions"}
    >
      {hasAmendPermission && (
        <>
          {node.type === MDTNodeType.NODE && !node.catalog && (
            <StyledIconButton
              edge="start"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                popoverOpenHandler(e);
                addHandler(node);
              }}
              size="large"
              data-testid={"add-button"}
            >
              <AddIcon
                sx={{
                  fontSize: 21,
                  cursor: "pointer",
                  color: "#7589A5",
                }}
              />
            </StyledIconButton>
          )}
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={popoverCloseHandler}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            sx={{
              "& .MuiPopover-paper": {
                backgroundColor: "#2A3341 !important",
              },
            }}
          >
            {getPopoverContent()}
          </Popover>
        </>
      )}

      {!node.catalog && (
        <>
          {hasAmendPermission && (
            <StyledIconButton
              edge="start"
              onClick={(e) => {
                e.stopPropagation();
                editHandler(node);
              }}
              size="small"
              data-testid={"edit-button"}
            >
              <EditIcon
                sx={{
                  fontSize: 21,
                  cursor: "pointer",
                  color: "#7589A5",
                }}
              />
            </StyledIconButton>
          )}
          {hasPermission(PERMISSIONS.MDT_DELETE) && (
            <StyledIconButton
              edge="start"
              onClick={(e) => {
                e.stopPropagation();
                deleteHandler(node);
              }}
              size="small"
              data-testid={"delete-button"}
            >
              <DeleteIcon
                sx={{
                  color: "rgb(255, 115, 90)",
                }}
              />
            </StyledIconButton>
          )}
        </>
      )}
    </Box>
  );
};

export default MDTTreeRowActionMenu;
