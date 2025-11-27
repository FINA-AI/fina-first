import { Box, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import React from "react";
import { useTranslation } from "react-i18next";
import MDTTreeNodeIcon from "../Tree/MDTTreeNodeIcon";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/system";
import { MdtNode } from "../../../types/mdt.type";

interface MDTGeneralInfoHeaderProps {
  data: MdtNode;
  editMode: boolean;
  setEditMode: (edit: boolean) => void;
  originalData: MdtNode | null;
  setData: (data: MdtNode) => void;
  onMdtNodeDetailsCloseButtonClick: () => void;
  clearSelectedMdtNode: () => void;
  resizeFunction: () => void;
  isMinimized?: boolean;
  hasAmendPermission?: boolean;
  saveMDT(node: MdtNode, setData?: any): void;
}

const iconStyles = ({ theme }: any) => ({
  color: theme.palette.mode === "dark" ? "#5D789A" : "#C3CAD8",
  cursor: "pointer",
  width: "20px",
  height: "20px",
});

const StyledKeyboardDoubleArrowRightIcon = styled(KeyboardDoubleArrowRightIcon)(
  iconStyles
);

const StyledCloseIcon = styled(CloseIcon)(iconStyles);

const StyledMinimizeBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  height: "100%",
  overflow: "hidden",
  padding: "0 10px",
  borderTop: theme.palette.borderColor,
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  padding: 0,
  paddingRight: 8,
  color: theme.palette.mode === "dark" ? "#FFF" : "rgba(104, 122, 158, 0.8)",
  borderRight: "1px solid rgba(104, 122, 158, 0.8)",
  cursor: "pointer",
}));

const StyledTypeTypography = styled(Typography)(({ theme }) => ({
  marginLeft: "4px",
  color: theme.palette.mode === "dark" ? "#ABBACE" : "#8695B1",
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "20px",
}));

const StyledEditTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#FFF" : "#2C3644",
  fontSize: 12,
  fontWeight: 600,
  lineHeight: "18px",
}));

const StyledSaveBtn = styled(Box)(() => ({
  color: "#289E20",
  fontSize: 12,
  marginLeft: 4,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
}));

const StyledEditIcon = styled(EditIcon)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#5D789A" : "#8695B1",
  cursor: "pointer",
  width: "20px",
  height: "20px",
  marginRight: "6px",
}));

const MDTGeneralInfoHeader: React.FC<MDTGeneralInfoHeaderProps> = ({
  data,
  editMode,
  setEditMode,
  saveMDT,
  originalData,
  setData,
  onMdtNodeDetailsCloseButtonClick,
  clearSelectedMdtNode,
  resizeFunction,
  isMinimized,
  hasAmendPermission,
}) => {
  const { t } = useTranslation();

  if (isMinimized) {
    return (
      <StyledMinimizeBox>
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
          <StyledKeyboardDoubleArrowRightIcon
            style={{ transform: "rotate(180deg)", marginTop: 10 }}
            onClick={resizeFunction}
          />
        </Box>

        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          flexDirection={"column"}
          flex={1}
        >
          <MDTTreeNodeIcon
            propsStyle={{ transform: "rotate(90deg)" }}
            nodeType={data.type}
          />
          <StyledTypeTypography
            style={{
              transform: "rotate(90deg)",
              marginTop: "15px",
              padding: "5px",
            }}
          >
            {t(data.type)}
          </StyledTypeTypography>
        </Box>
        <Box style={{ display: "flex", flex: 2, alignItems: "center" }}>
          <StyledTypeTypography
            style={{
              transform: "rotate(90deg)",
              whiteSpace: "nowrap",
            }}
          >
            {data.code}
          </StyledTypeTypography>
        </Box>
      </StyledMinimizeBox>
    );
  } else {
    return (
      <>
        <Box display={"flex"} alignItems={"center"}>
          {!editMode ? (
            <>
              <MDTTreeNodeIcon nodeType={data.type} />
              <StyledTypeTypography>{t(data.type)}</StyledTypeTypography>
            </>
          ) : (
            <StyledEditTypography>
              {data.id < 0 ? t("addMdt") : t("editMdt")}
            </StyledEditTypography>
          )}
        </Box>
        <Box>
          {!editMode ? (
            <>
              {hasAmendPermission && (
                <StyledEditIcon onClick={() => setEditMode(true)} />
              )}
              <StyledKeyboardDoubleArrowRightIcon
                onClick={() => {
                  resizeFunction();
                }}
              />

              <StyledCloseIcon onClick={onMdtNodeDetailsCloseButtonClick} />
            </>
          ) : (
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <StyledTypography
                onClick={() => {
                  setEditMode(false);
                  setData(originalData as MdtNode);
                  data.id < 0 && onMdtNodeDetailsCloseButtonClick();
                  clearSelectedMdtNode();
                }}
              >
                {t("cancel")}
              </StyledTypography>
              <StyledSaveBtn
                onClick={async () => {
                  await saveMDT(data);
                }}
              >
                <Typography fontSize={"inherit"} mr={"3px"}>
                  {t("save")}
                </Typography>
                <CheckIcon fontSize={"inherit"} />
              </StyledSaveBtn>
            </Box>
          )}
        </Box>
      </>
    );
  }
};

export default MDTGeneralInfoHeader;
