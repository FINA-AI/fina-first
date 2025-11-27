import { Box, styled } from "@mui/system";
import Popover from "@mui/material/Popover";
import MDTTree from "../Tree/MDTTree";
import React, { useState } from "react";
import TextField from "../../common/Field/TextField";
import { useTranslation } from "react-i18next";
import InputAdornment from "@mui/material/InputAdornment";
import MDTTreeNodeIcon from "../Tree/MDTTreeNodeIcon";
import { MdtNode } from "../../../types/mdt.type";
import { ListElementNode } from "../MDTNodeDetails";
import { UIEventType } from "../../../types/common.type";

interface MDTChooserProps {
  anchorEl: Element | null;
  setAnchorEl: (value: Element | null) => void;
  value?: ListElementNode | MdtNode | null;
  foldersOnly: boolean;
  disabledMdtChooser?: boolean;
  handleClose(event: UIEventType): void;
  onNodeSelect(
    node: MdtNode,
    clickedRows?: MdtNode[],
    event?: UIEventType
  ): void;
}

const StyledPopover = styled(Popover)(({ theme }) => ({
  "& .MuiPaper-root": {
    width: "100%",
    maxWidth: 652,
    height: 300,
    background:
      theme.palette.mode === "light" ? "#FFFFFF" : "rgba(52, 66, 88, 1)",
    border: theme.palette.borderColor,
    borderRadius: "2px",
    boxShadow:
      theme.palette.mode === "light"
        ? "rgba(80, 80, 80, 0.2) 0px 5px 5px -3px, rgba(80, 80, 80, 0.14) 0px 8px 10px 1px, rgba(80, 80, 80, 0.12) 0px 3px 14px 2px"
        : "0px 19px 38px 0px rgba(0, 0, 0, 0.30), 0px 15px 12px 0px rgba(0, 0, 0, 0.22)",
  },
}));

const MDTChooser: React.FC<MDTChooserProps> = ({
  anchorEl,
  handleClose,
  onNodeSelect,
  setAnchorEl,
  value,
  foldersOnly,
  disabledMdtChooser = false,
}) => {
  const { t } = useTranslation();
  const [items, setItems] = useState<MdtNode[]>([]);
  const [selectedNodes, setSelectedNodes] = useState<MdtNode[]>([]);

  const handleClick = (event: UIEventType) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <Box
        onClick={(event) => {
          handleClick(event);
        }}
        data-testid={"mdt-chooser"}
      >
        <TextField
          value={value?.code}
          onChange={() => {}}
          label={t("chooseMDTFile")}
          size={"small"}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MDTTreeNodeIcon nodeType={value?.type} />
              </InputAdornment>
            ),
          }}
          isDisabled={disabledMdtChooser}
          data-testid={"input-field"}
        />
      </Box>
      <StyledPopover
        sx={{
          width: "100%",
          height: 300,
        }}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        data-testid={"popover"}
      >
        <Box width={"100% !important"} height={"100%"}>
          <MDTTree
            onNodeSelect={onNodeSelect}
            foldersOnly={foldersOnly}
            setEditMode={() => {}}
            setItems={setItems}
            items={items}
            size={"small"}
            viewMode={true}
            selectedNodes={selectedNodes}
            setSelectedNodes={setSelectedNodes}
          />
        </Box>
      </StyledPopover>
    </>
  );
};

export default MDTChooser;
