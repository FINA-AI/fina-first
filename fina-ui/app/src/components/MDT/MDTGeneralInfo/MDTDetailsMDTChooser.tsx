import { Box, styled } from "@mui/system";
import { Typography } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import MDTChooser from "../MDTChooser/MDTChooser";
import MDTTreeNodeIcon from "../Tree/MDTTreeNodeIcon";
import { MdtNode } from "../../../types/mdt.type";
import { ListElementNode } from "../MDTNodeDetails";

interface MDTDetailsMDTChooserPropTypes {
  currentNode: MdtNode;
  setCurrentNode: (node: MdtNode) => void;
  editMode: boolean;
  listElementNode?: ListElementNode;
  setListElementNode: (element: ListElementNode) => void;
}

const StyledHeaderTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#FFF" : "#2C3644",
  fontWeight: 600,
  fontSize: "12px",
  lineHeight: "18px",
}));

const StyledNameTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#FFF" : "#2C3644",
  fontWeight: 500,
  fontSize: 12,
  lineHeight: "18px",
}));

const StyledBox = styled(Box)(({ theme }) => ({
  border: theme.palette.borderColor,
  display: "flex",
  padding: 10,
}));

const MDTDetailsMDTChooser: React.FC<MDTDetailsMDTChooserPropTypes> = ({
  currentNode,
  setCurrentNode,
  editMode,
  listElementNode,
  setListElementNode,
}) => {
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onNodeSelect = (node: MdtNode) => {
    setListElementNode(node);
    setCurrentNode({ ...currentNode, equation: node.id?.toString() });
    handleClose();
  };

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        marginBottom={"8px"}
      >
        <StyledHeaderTypography>{t("chooseMDTFolder")}</StyledHeaderTypography>
      </Box>
      {!editMode ? (
        <StyledBox>
          <Box pr={"10px"}>
            <MDTTreeNodeIcon nodeType={listElementNode?.type} />
          </Box>
          <Box>
            <StyledNameTypography>{listElementNode?.name}</StyledNameTypography>
            <Typography color={"#8695B1"} fontSize={12} lineHeight={"18px"}>
              {listElementNode?.code}
            </Typography>
          </Box>
        </StyledBox>
      ) : (
        <Box>
          <MDTChooser
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            handleClose={handleClose}
            onNodeSelect={onNodeSelect}
            value={listElementNode}
            foldersOnly={true}
          />
        </Box>
      )}
    </>
  );
};

export default MDTDetailsMDTChooser;
