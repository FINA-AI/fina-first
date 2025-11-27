import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import AddIcon from "@mui/icons-material/Add";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDropzone } from "react-dropzone";
import FileAttachmentBox from "../../Messages/Chat/FileAttachmentBox";
import GhostBtn from "../../common/Button/GhostBtn";
import { styled } from "@mui/material/styles";
import { SurveyUploadModal } from "../../../types/survey.type";

interface UploadModalProps {
  setUploadModal: React.Dispatch<React.SetStateAction<SurveyUploadModal>>;
  uploadFile(file: File): void;
}

const StyledRoot = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "100%",
});

const StyledUploadContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 4,
  padding: 10,
  background:
    theme.palette.mode === "light" ? "rgba(240, 244, 255, 0.5)" : "#445565",
  border: `1px dashed ${theme.palette.primary.main}`,
  margin: 8,
}));

const StyledUploadText = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === "light" ? "#8695B1" : "#91abc8",
  fontWeight: 500,
  fontSize: 15,
  width: "fit-content",
  display: "flex",
  justifyContent: "center",
  padding: 4,
}));

const StyledBrowseBtn = styled(Box)({
  display: "flex",
  justifyContent: "center",
  width: 156,
  margin: 4,
});

const StyledFooter = styled(Box)(({ theme }: { theme: any }) => ({
  display: "flex",
  justifyContent: "flex-end",
  gap: 8,
  ...theme.modalFooter,
}));

const UploadModal: React.FC<UploadModalProps> = ({
  uploadFile,
  setUploadModal,
}) => {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[] | null>(null);
  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    noClick: true,
    disabled: false,
    noKeyboard: true,
  });

  useEffect(() => {
    if (acceptedFiles) {
      setFiles(acceptedFiles);
    }
  }, [acceptedFiles]);

  const handleUpload = () => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    const encodedFilename = encodeURIComponent(file.name);
    const safeFile = new File([file], encodedFilename, { type: file.type });
    uploadFile(safeFile);
  };

  return (
    <StyledRoot>
      {files && files?.length > 0 ? (
        <Box padding={"8px"}>
          <FileAttachmentBox
            files={files}
            open={true}
            remove={() => setFiles(null)}
          />
        </Box>
      ) : (
        <StyledUploadContainer {...getRootProps()} height={128}>
          <input {...getInputProps()} data-testid={"attachment-input"} />
          <Box
            display={"flex"}
            justifyContent={"center"}
            width={"fit-content"}
            flexDirection={"column"}
          >
            <Box display={"flex"} justifyContent={"center"}>
              <StyledUploadText>{t("dropToUpload")}</StyledUploadText>
            </Box>
            <Box display={"flex"} justifyContent={"center"}>
              <StyledUploadText>{t("or")}</StyledUploadText>
            </Box>
            <Box display={"flex"} justifyContent={"center"}>
              <StyledBrowseBtn>
                <PrimaryBtn
                  onClick={open}
                  startIcon={<AddIcon />}
                  data-testid={"browseFiles-button"}
                >
                  {t("browseFiles")}
                </PrimaryBtn>
              </StyledBrowseBtn>
            </Box>
          </Box>
        </StyledUploadContainer>
      )}
      <StyledFooter>
        <GhostBtn
          onClick={() => {
            setUploadModal({ title: "", open: false });
          }}
          data-testid={"cancel-button"}
        >
          {t("cancel")}
        </GhostBtn>
        <PrimaryBtn onClick={handleUpload} data-testid={"upload-button"}>
          {t("upload")}
        </PrimaryBtn>
      </StyledFooter>
    </StyledRoot>
  );
};

export default UploadModal;
