import ClosableModal from "../common/Modal/ClosableModal";
import { Box } from "@mui/system";
import GhostBtn from "../common/Button/GhostBtn";
import PrimaryBtn from "../common/Button/PrimaryBtn";
import CheckIcon from "@mui/icons-material/Check";
import React from "react";
import { useTranslation } from "react-i18next";
import { Grid } from "@mui/material";
import { logout } from "../../api/services/securityService";
import { styled } from "@mui/material/styles";

interface LogoutModalProps {
  openLogoutModal: boolean;
  setOpenLogoutModal: (open: boolean) => void;
  modalContent: string;
}

const StyledFooter = styled(Box)(({ theme }: { theme: any }) => ({
  ...theme.modalFooter,
  padding: 10,
  paddingRight: 20,
}));

const StyledCheckIcon = styled(CheckIcon)({
  width: 16,
  height: 14,
});

const StyledContent = styled(Grid)({
  padding: "30px 30px 15px 30px",
  width: "400px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const LogoutModal: React.FC<LogoutModalProps> = ({
  setOpenLogoutModal,
  openLogoutModal,
  modalContent,
}) => {
  const { t } = useTranslation();
  const logoutFunction = async () => {
    await logout();
    window.location.reload();
  };
  return (
    <ClosableModal
      onClose={() => setOpenLogoutModal(false)}
      open={openLogoutModal}
      includeHeader={false}
      title={t("warning")}
      disableBackdropClick={false}
    >
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-between"}
      >
        <Box display={"flex"} flex={1}>
          <StyledContent container spacing={2} direction={"column"}>
            <Grid item>{`${t(modalContent)}?`}</Grid>
          </StyledContent>
        </Box>
        <StyledFooter
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <GhostBtn
            onClick={() => {
              setOpenLogoutModal(false);
            }}
            style={{ marginRight: "10px" }}
          >
            {t("no")}
          </GhostBtn>
          <PrimaryBtn
            onClick={() => {
              logoutFunction();
              setOpenLogoutModal(false);
            }}
            endIcon={<StyledCheckIcon />}
          >
            {t("yes")}
          </PrimaryBtn>
        </StyledFooter>
      </Box>
    </ClosableModal>
  );
};

export default LogoutModal;
