import { Box, styled } from "@mui/system";
import { Typography } from "@mui/material";
import React from "react";
import MDTNodeGeneralInfoEdit from "./Edit/MDTNodeGeneralInfoEdit";
import MDTNodeStatusButtons from "./MDTNodeStatusButtons";
import MDTNodeGeneralInfoFooter from "./MDTNodeGeneralInfoFooter";
import MDTGeneralInfoHeader from "./MDTGeneralInfoHeader";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { copyToClipboard } from "../../../util/appUtil";
import { MdtNode } from "../../../types/mdt.type";

interface MDTNodeGeneralInfoPropTypes {
  data: MdtNode;
  setData: (data: MdtNode) => void;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  saveMDT: (node: MdtNode) => void;
  originalData: MdtNode | null;
  onMdtNodeDetailsCloseButtonClick: () => void;
  clearSelectedMdtNode: () => void;
  isMinimized: boolean;
  hasAmendPermission: boolean;
  isUsedByAnotherNode: boolean;

  toggleFunction(): void;
}

const StyledContentBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  marginTop: 8,
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#F5F7FA" : "#2C3644",
  fontSize: 12,
  fontWeight: 500,
  lineHeight: "20px",
  marginRight: "8px",
}));

const StyledNameTypography = styled(Typography)(({ theme }) => ({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  color: theme.palette.mode === "dark" ? "#ABBACE" : "#9AA7BE",
  fontSize: 12,
  ml: "5px",
  lineHeight: "20px",
  fontWeight: 400,
}));

const StyledTitleBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "&:hover": {
    "& .copyIcon": {
      cursor: "pointer",
      visibility: "visible",
      fontSize: "16px !important",
      marginRight: "8px",
      color: "#98A7BC",
    },
  },
}));

const MDTNodeGeneralInfo: React.FC<MDTNodeGeneralInfoPropTypes> = ({
  data,
  setData,
  editMode,
  setEditMode,
  saveMDT,
  originalData,
  onMdtNodeDetailsCloseButtonClick,
  clearSelectedMdtNode,
  toggleFunction,
  isMinimized,
  hasAmendPermission,
  isUsedByAnotherNode,
}) => {
  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        data-testid={"header"}
      >
        <MDTGeneralInfoHeader
          data={data}
          editMode={editMode}
          setEditMode={setEditMode}
          saveMDT={saveMDT}
          originalData={originalData}
          setData={setData}
          onMdtNodeDetailsCloseButtonClick={onMdtNodeDetailsCloseButtonClick}
          clearSelectedMdtNode={clearSelectedMdtNode}
          resizeFunction={toggleFunction}
          isMinimized={isMinimized}
          hasAmendPermission={hasAmendPermission}
        />
      </Box>
      <StyledContentBox data-testid={"body"}>
        {!editMode ? (
          <StyledTitleBox>
            <StyledTypography data-testid={"node-code"}>
              {data.code}
            </StyledTypography>
            <ContentCopyIcon
              className={"copyIcon"}
              sx={{
                visibility: "hidden",
                fontSize: "16px !important",
              }}
              onClick={() => copyToClipboard(data.code)}
            />
            <StyledNameTypography data-testid={"node-name"}>
              {data.name}
            </StyledNameTypography>
          </StyledTitleBox>
        ) : (
          <MDTNodeGeneralInfoEdit
            data={data}
            setData={setData}
            isUsedByAnotherNode={isUsedByAnotherNode}
          />
        )}
      </StyledContentBox>
      {!editMode && (
        <StyledContentBox data-testid={"footer"}>
          <MDTNodeGeneralInfoFooter data={data} />
        </StyledContentBox>
      )}
      {data && (
        <StyledContentBox data-testid={"mdt-node-statuses"}>
          <MDTNodeStatusButtons
            data={data}
            setData={setData}
            editMode={editMode}
          />
        </StyledContentBox>
      )}
    </>
  );
};

export default MDTNodeGeneralInfo;
