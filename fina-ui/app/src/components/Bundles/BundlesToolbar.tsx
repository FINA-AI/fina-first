import { Grid } from "@mui/material";
import PrimaryBtn from "../common/Button/PrimaryBtn";
import React from "react";
import { useTranslation } from "react-i18next";
import EditIcon from "@mui/icons-material/Edit";
import { Box } from "@mui/system";
import GhostBtn from "../common/Button/GhostBtn";
import DoneIcon from "@mui/icons-material/Done";
import { styled } from "@mui/material/styles";

interface BundlesToolbarProps {
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  cancelEditHandler: () => void;
  saveEditHandler: () => void;
  setSaveModalOpen: (isOpen: boolean) => void;
  isSaveDisabled: boolean;
}

const StyledRoot = styled(Grid)(({ theme }: any) => ({
  ...theme.pageToolbar,
  justifyContent: "end",
}));

const BundlesToolbar: React.FC<BundlesToolbarProps> = ({
  editMode,
  setEditMode,
  cancelEditHandler,
  setSaveModalOpen,
  isSaveDisabled,
}) => {
  const { t } = useTranslation();

  return (
    <StyledRoot>
      {!editMode ? (
        <PrimaryBtn
          onClick={() => setEditMode(true)}
          fontSize={12}
          endIcon={<EditIcon />}
        >
          {t("edit")}
        </PrimaryBtn>
      ) : (
        <Box
          display={"flex"}
          width={"100%"}
          justifyContent={"flex-end"}
          alignItems={"center"}
        >
          <Box display={"flex"} gap={"10px"}>
            <GhostBtn
              onClick={() => cancelEditHandler()}
              style={{ marginRight: "5px" }}
              height={32}
            >
              {t("cancel")}
            </GhostBtn>
          </Box>
          <PrimaryBtn
            disabled={isSaveDisabled}
            onClick={() => setSaveModalOpen(true)}
            style={{ background: "#289E20", height: "32px" }}
            endIcon={<DoneIcon sx={{ color: "#FFFFFF" }} />}
          >
            {t("save")}
          </PrimaryBtn>
        </Box>
      )}
    </StyledRoot>
  );
};

export default BundlesToolbar;
