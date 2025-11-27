import Menu from "@mui/material/Menu";
import React, { ReactElement } from "react";
import { styled } from "@mui/material/styles";
import { ContextMenuInfo } from "../../../types/common.type";
import { MenuListProps } from "@mui/material";

interface ContextMenuProps {
  open: boolean;
  contextMenuInfo: ContextMenuInfo;
  handleClose: () => void;
  contextMenus: (selectedRow: any) => ReactElement;
}

const StyledMenu = styled(Menu)(() => ({
  pointerEvents: "none",
}));

const ContextMenu: React.FC<ContextMenuProps> = ({
  open,
  contextMenuInfo,
  handleClose,
  contextMenus,
}) => {
  return (
    <StyledMenu
      open={open}
      onClose={handleClose}
      anchorEl={contextMenuInfo?.target}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: "visible",
          left: `${contextMenuInfo?.x}px !important;`,
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          mt: 1.5,
        },
      }}
      MenuListProps={
        {
          "data-testid": "context-menu",
          "aria-labelledby": "basic-button",
        } as MenuListProps
      }
    >
      {contextMenus(contextMenuInfo?.row)}
    </StyledMenu>
  );
};

export default ContextMenu;
