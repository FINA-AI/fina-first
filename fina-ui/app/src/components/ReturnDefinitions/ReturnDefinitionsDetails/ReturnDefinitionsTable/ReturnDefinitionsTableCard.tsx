import { Box } from "@mui/system";
import { IconButton, ToggleButton, Typography } from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ReturnDefinitionsTableCardEdit from "./ReturnDefinitionsTableCardEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import useConfig from "../../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../../api/permissions";
import { styled } from "@mui/material/styles";
import {
  ReturnDefinitionTable,
  ReturnDefinitionType,
} from "../../../../types/returnDefinition.type";

interface ReturnDefinitionsTableCardProps {
  currentTable: ReturnDefinitionTable;
  currentReturnDefinition: ReturnDefinitionType;
  onDelete: VoidFunction;
  onSave: (table: ReturnDefinitionTable) => void;
  isDeleteHidden: boolean;
}

const StyledRoot = styled(Box)(({ theme }: { theme: any }) => ({
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.paperBackground,
  height: 90,
  boxShadow: "none !important",
  padding: "10px 10px",
  marginTop: 10,
}));

const StyledHeaderWrapper = styled(Box)(({ theme }: { theme: any }) => ({
  borderBottom: theme.palette.borderColor,
  display: "flex",
  justifyContent: "space-between",
  paddingBottom: 10,
  alignItems: "start",
}));

const StyledIconBox = styled(Box)({
  backgroundColor: "#FFB703",
  height: 30,
  width: 30,
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const commonIconStyles = {
  width: "18px",
  height: "18px",
  cursor: "pointer",
};

const StyledEditIcon = styled(EditRoundedIcon)({
  color: "#9AA7BE",
  ...commonIconStyles,
});

const StyledDeleteIcon = styled(DeleteIcon)({
  color: "#FF735A",
  ...commonIconStyles,
});

const StyledPrimaryText = styled(Typography)(({ theme }: { theme: any }) => ({
  color: theme.palette.textColor,
  fontSize: 14,
  fontWeight: 500,
}));

const StyledSecondaryText = styled(Typography)({
  color: "#AEB8CB",
  fontSize: 12,
});

const StyledToggleButton = styled(ToggleButton)(
  ({ theme }: { theme: any }) => ({
    height: 25,
    width: "fit-content",
    backgroundColor: "#F0F4FF",
    padding: "3px 5px 3px 5px",
    fontSize: 12,
    fontWeight: 500,
    textTransform: "capitalize",
    border: "none !important",
    cursor: "default",
    "&:hover": {
      backgroundColor: theme.palette.buttons.primary.hover,
    },
  })
);

const StyledActiveToggleButton = styled(Box)({
  fontSize: 12,
  padding: 0,
  paddingRight: 4,
  color: "rgba(104, 122, 158, 0.8)",
  borderRight: "1px solid rgba(104, 122, 158, 0.8)",
  cursor: "pointer",
});

const ReturnDefinitionsTableCard: React.FC<ReturnDefinitionsTableCardProps> = ({
  currentTable,
  currentReturnDefinition,
  isDeleteHidden,
  onDelete,
  onSave,
}) => {
  const { t } = useTranslation();
  const [editMode, setEditMode] = useState(false);
  const { hasPermission } = useConfig();

  useEffect(() => {
    setEditMode(false);
  }, [currentReturnDefinition]);
  const onSaveWrapper = async (newTable: ReturnDefinitionTable) => {
    await onSave(newTable);
    setEditMode(false);
  };
  return editMode ? (
    <ReturnDefinitionsTableCardEdit
      currentTable={currentTable}
      setEditMode={setEditMode}
      currentReturnDefinition={currentReturnDefinition}
      onSave={onSaveWrapper}
    />
  ) : (
    <StyledRoot>
      <StyledHeaderWrapper>
        <Box>
          <StyledPrimaryText>{currentTable.code}</StyledPrimaryText>
          <StyledSecondaryText>
            {currentTable.visibleLevel >= 10 ? t("up") : t("down")}
          </StyledSecondaryText>
        </Box>
        <Box display={"flex"}>
          {hasPermission(PERMISSIONS.FINA_RETURN_DEFINITION_AMEND) && (
            <IconButton
              onClick={() => {
                setEditMode(true);
              }}
              style={{ background: "none", border: "none" }}
            >
              <StyledEditIcon />
            </IconButton>
          )}
          {hasPermission(PERMISSIONS.FINA_RETURN_DEFINITION_DELETE) && (
            <IconButton
              sx={{ display: isDeleteHidden ? "none" : "flex" }}
              style={{ border: "none" }}
              onClick={onDelete}
            >
              <StyledDeleteIcon />
            </IconButton>
          )}
        </Box>
      </StyledHeaderWrapper>
      <Box
        display={"flex"}
        pt={"5px"}
        justifyContent={"space-between"}
        alignItems={"end"}
      >
        <Box display={"flex"}>
          <StyledIconBox>
            <FolderRoundedIcon
              sx={{ width: "17px", height: "17px", color: "#FFF" }}
            />
          </StyledIconBox>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <StyledPrimaryText ml={"10px"}>
                {currentTable.node?.code}
              </StyledPrimaryText>
              <StyledSecondaryText ml={"5px"}>
                {currentTable.name}
              </StyledSecondaryText>
            </Box>
            <StyledSecondaryText ml={"10px"}>
              {currentTable.type}
            </StyledSecondaryText>
          </Box>
        </Box>
        {currentTable.type === "VCT" && (
          <StyledActiveToggleButton>
            <StyledToggleButton
              value={currentTable.manualInput ? currentTable.manualInput : ""}
            >
              {t(currentTable.evalType)}
            </StyledToggleButton>
          </StyledActiveToggleButton>
        )}
      </Box>
    </StyledRoot>
  );
};

export default ReturnDefinitionsTableCard;
