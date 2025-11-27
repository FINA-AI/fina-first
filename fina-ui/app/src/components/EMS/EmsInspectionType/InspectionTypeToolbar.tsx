import React from "react";
import { Box } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import GhostBtn from "../../common/Button/GhostBtn";
import EditIcon from "@mui/icons-material/Edit";
import RemoveIcon from "@mui/icons-material/Remove";
import LoopIcon from "@mui/icons-material/Loop";
import { EmsInspectionType } from "../../../types/inspection.type";
import useConfig from "../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../api/permissions";
import { styled } from "@mui/material/styles";

interface ToolbarProps {
  setShowAddModal: (isShowModal: boolean) => void;
  setShowDeleteModal: (isShowModal: boolean) => void;
  currInspectionType: EmsInspectionType | null;
  setCurrInspectionType: React.Dispatch<React.SetStateAction<any>>;
  onRefresh: () => void;
}

const StyledToolbar = styled(Box)(({ theme }: any) => ({
  padding: theme.toolbar.padding,
  maxHeight: theme.toolbar.height,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  borderTopLeftRadius: "4px",
  borderTopRightRadius: "4px",
}));

const StyledToolbarBtnBox = styled(Box)({
  marginRight: "5px",
});

const InspectionTypeToolbar: React.FC<ToolbarProps> = ({
  setShowAddModal,
  setShowDeleteModal,
  currInspectionType,
  setCurrInspectionType,
  onRefresh,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();

  return (
    <StyledToolbar data-testid={"toolbar"}>
      <Box display={"flex"} justifyContent={"start"}>
        {hasPermission(PERMISSIONS.EMS_INSPECTION_TYPE_AMEND) && (
          <>
            <StyledToolbarBtnBox>
              <GhostBtn
                onClick={() => {
                  setCurrInspectionType(null);
                  setShowAddModal(true);
                }}
                startIcon={<AddIcon />}
                data-testid={"create-button"}
              >
                {t("Add")}
              </GhostBtn>
            </StyledToolbarBtnBox>
            <StyledToolbarBtnBox>
              <GhostBtn
                onClick={() => {
                  setShowAddModal(true);
                }}
                disabled={!currInspectionType || currInspectionType.syncronized}
                startIcon={<EditIcon />}
                data-testid={"edit-button"}
              >
                {t("Edit")}
              </GhostBtn>
            </StyledToolbarBtnBox>
          </>
        )}
        {hasPermission(PERMISSIONS.EMS_INSPECTION_TYPE_DELETE) && (
          <StyledToolbarBtnBox>
            <GhostBtn
              onClick={() => {
                setShowDeleteModal(true);
              }}
              disabled={!currInspectionType || currInspectionType.syncronized}
              startIcon={<RemoveIcon />}
              data-testid={"delete-button"}
            >
              {t("Delete")}
            </GhostBtn>
          </StyledToolbarBtnBox>
        )}
        <StyledToolbarBtnBox>
          <GhostBtn
            onClick={onRefresh}
            startIcon={<LoopIcon />}
            data-testid={"refresh-button"}
          >
            {t("Refresh")}
          </GhostBtn>
        </StyledToolbarBtnBox>
      </Box>
    </StyledToolbar>
  );
};

export default InspectionTypeToolbar;
