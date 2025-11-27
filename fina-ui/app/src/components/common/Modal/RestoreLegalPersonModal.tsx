import { useTranslation } from "react-i18next";
import ClosableModal from "../../common/Modal/ClosableModal";
import GhostBtn from "../Button/GhostBtn";
import PrimaryBtn from "../Button/PrimaryBtn";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { Suspense } from "react";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

const RestoreIcon = React.lazy(() =>
  import("../../../api/ui/icons/RestoreIcon").then((module) => ({
    default: module.RestoreIcon,
  }))
);

interface RestoreLegalPersonModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  onRestore: () => void;
  name?: string;
}

const StyledHeader = styled(Box)(() => ({
  marginTop: "20px",
  textAlign: "center",
  fontSize: "18px",
  fontWeight: 600,
  fontFamily: "inter",
}));

const StyledBody = styled(Box)(({ theme }: any) => ({
  marginTop: "12px",
  textAlign: "center",
  fontSize: "16px",
  fontWeight: 400,
  fontFamily: "inter",
  color: theme.palette.mode === "light" ? "#AEB8CB" : "",
}));

const StyledAdditionalTextBox = styled(Box)(({ theme }: any) => ({
  color: theme.palette.mode === "light" ? "#AEB8CB" : "",
  textAlign: "center",
  fontWeight: 400,
}));

const StyledFooter = styled(Box)(() => ({
  marginTop: "24px",
  // margin: "auto",
  textAlign: "center",
  "& .MuiButtonBase-root": {
    marginRight: "16px",
  },
  "& .MuiSvgIcon-root": {
    marginTop: "inherit",
    marginLeft: "5px",
  },
}));

const RestoreLegalPersonModal: React.FC<RestoreLegalPersonModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  name,
  onRestore,
}) => {
  const { t } = useTranslation();

  const onClose = () => {
    setIsModalOpen(false);
  };

  return (
    <ClosableModal
      onClose={onClose}
      open={isModalOpen}
      width={320}
      includeHeader={false}
    >
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        padding={"16px"}
        component={Paper}
      >
        <Suspense fallback={<div style={{ height: 150 }} />}>
          <RestoreIcon />
        </Suspense>
        <StyledHeader>{t("personAlreadyExists")}</StyledHeader>
        <StyledBody>{t("areYouSureYouWantToRestore")}</StyledBody>
        <StyledAdditionalTextBox>
          <span style={{ borderBottom: "1px solid #8695B1" }}>{name}</span>
          {" ?"}
        </StyledAdditionalTextBox>

        <StyledFooter>
          <GhostBtn
            width={104}
            onClick={onClose}
            fontSize={14}
            borderRadius={4}
            defaultLineHeight={true}
          >
            {t("cancel")}
          </GhostBtn>
          <PrimaryBtn
            style={{ borderRadius: 4 }}
            onClick={() => {
              onClose();
              onRestore();
            }}
            endIcon={<RefreshIcon />}
          >
            <Typography> {t("restore")}</Typography>
          </PrimaryBtn>
        </StyledFooter>
      </Box>
    </ClosableModal>
  );
};

export default RestoreLegalPersonModal;
