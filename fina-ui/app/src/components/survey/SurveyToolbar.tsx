import { Box } from "@mui/system";
import GhostBtn from "../common/Button/GhostBtn";
import { useTranslation } from "react-i18next";
import PrimaryBtn from "../common/Button/PrimaryBtn";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import useConfig from "../../hoc/config/useConfig";
import { PERMISSIONS } from "../../api/permissions";
import { styled } from "@mui/material/styles";
import React from "react";
import { SurveyUploadModal } from "../../types/survey.type";

interface SurveyToolbarProps {
  setUploadModal: React.Dispatch<React.SetStateAction<SurveyUploadModal>>;
  setIsPublicUpload: (value: boolean) => void;
}

const StyledRoot = styled(Box)(({ theme }: { theme: any }) => ({
  ...theme.pageToolbar,
  display: "flex",
  justifyContent: "flex-end",
  gap: 8,
}));

const SurveyToolbar: React.FC<SurveyToolbarProps> = ({
  setUploadModal,
  setIsPublicUpload,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();

  return (
    <StyledRoot data-testid={"toolbar"}>
      {hasPermission(PERMISSIONS.SURVEY_PUBLIC_UPLOAD) && (
        <GhostBtn
          onClick={() => {
            setUploadModal({ title: "uploadPublicSurvey", open: true });
            setIsPublicUpload(true);
          }}
          startIcon={<PublicRoundedIcon />}
          data-testid={"upload-public-survey"}
        >
          {t("uploadPublicSurvey")}
        </GhostBtn>
      )}

      {hasPermission(PERMISSIONS.SURVEY_PRIVATE_UPLOAD) && (
        <PrimaryBtn
          onClick={() => {
            setUploadModal({ title: "uploadPrivateSurvey", open: true });
            setIsPublicUpload(false);
          }}
          endIcon={<CloudUploadRoundedIcon />}
          data-testid={"upload-private-survey"}
        >
          {t("uploadPrivateSurvey")}
        </PrimaryBtn>
      )}
    </StyledRoot>
  );
};

export default SurveyToolbar;
