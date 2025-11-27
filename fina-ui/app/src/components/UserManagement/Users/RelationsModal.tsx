import ClosableModal from "../../common/Modal/ClosableModal";
import { Box, styled } from "@mui/system";
import GhostBtn from "../../common/Button/GhostBtn";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import CheckIcon from "@mui/icons-material/Check";
import React from "react";
import { useTranslation } from "react-i18next";
import { Grid } from "@mui/material";

interface RelationsModalProps {
  openRelationWarningModal: boolean;
  setOpenRelationWarningModal: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  saveOnClose: boolean;
  onSave(disable: boolean): void;
}

const StyledFooter = styled(Box)(({ theme }: any) => ({
  ...theme.modalFooter,
  padding: 10,
  paddingRight: 20,
}));

const StyledContentGrid = styled(Grid)(() => ({
  padding: "30px 30px 15px 30px",
  height: "100px",
  width: "430px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const RelationsModal: React.FC<RelationsModalProps> = ({
  setOpenRelationWarningModal,
  openRelationWarningModal,
  onSave,
  title,
  saveOnClose,
}) => {
  const { t } = useTranslation();
  return (
    <ClosableModal
      onClose={() => setOpenRelationWarningModal(false)}
      open={openRelationWarningModal}
      includeHeader={false}
      title={t("warning")}
      disableBackdropClick={true}
    >
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-between"}
      >
        <Box display={"flex"} flex={1}>
          <StyledContentGrid container spacing={2} direction={"column"}>
            <Grid item>{`${t(title)}?`}</Grid>
          </StyledContentGrid>
        </Box>
        <StyledFooter
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <GhostBtn
            onClick={() => {
              if (saveOnClose) {
                onSave(false);
              }
              setOpenRelationWarningModal(false);
            }}
            style={{ marginRight: "10px" }}
          >
            {t("no")}
          </GhostBtn>
          <PrimaryBtn
            onClick={() => {
              onSave(true);
              setOpenRelationWarningModal(false);
            }}
            backgroundColor={"rgb(40, 158, 32)"}
            endIcon={
              <CheckIcon
                sx={{
                  width: "16px",
                  height: "14px",
                }}
              />
            }
          >
            {t("yes")}
          </PrimaryBtn>
        </StyledFooter>
      </Box>
    </ClosableModal>
  );
};

export default RelationsModal;
