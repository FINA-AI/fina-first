import React from "react";
import { Box } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import GhostBtn from "../../common/Button/GhostBtn";
import EditIcon from "@mui/icons-material/Edit";
import RemoveIcon from "@mui/icons-material/Remove";
import LoopIcon from "@mui/icons-material/Loop";
import { SanctionDataType } from "../../../types/sanction.type";
import useConfig from "../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../api/permissions";
import { styled } from "@mui/material/styles";

interface ToolbarProps {
  setShowAddModal: (isShowModal: boolean) => void;
  setShowDeleteModal: (isShowModal: boolean) => void;
  currSanctionType: SanctionDataType | null;
  setCurrSanctionType: React.Dispatch<React.SetStateAction<any>>;
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

const EmsSanctionTypeToolbar: React.FC<ToolbarProps> = ({
  setShowAddModal,
  setShowDeleteModal,
  currSanctionType,
  setCurrSanctionType,
  onRefresh,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();

  return (
    <StyledToolbar data-testid={"toolbar"}>
      <Box display={"flex"} justifyContent={"start"}>
        {hasPermission(PERMISSIONS.EMS_SANCTION_AND_RECOMMENDATION_AMEND) && (
          <>
            <StyledToolbarBtnBox>
              <GhostBtn
                onClick={() => {
                  setCurrSanctionType(null);
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
                disabled={!currSanctionType || currSanctionType.syncronized}
                startIcon={<EditIcon />}
                data-testid={"edit-button"}
              >
                {t("Edit")}
              </GhostBtn>
            </StyledToolbarBtnBox>
          </>
        )}
        {hasPermission(PERMISSIONS.EMS_SANCTION_AND_RECOMMENDATION_DELETE) && (
          <StyledToolbarBtnBox>
            <GhostBtn
              onClick={() => {
                setShowDeleteModal(true);
              }}
              disabled={!currSanctionType || currSanctionType.syncronized}
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

export default EmsSanctionTypeToolbar;
