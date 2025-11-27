import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import AddIcon from "@mui/icons-material/Add";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import FileAttachmentBox from "../../Messages/Chat/FileAttachmentBox";
import { styled } from "@mui/material/styles";

interface FileDecryptionDropZoneProps {
  acceptedFileTypes: string[];
  acceptedFileName: string;
  onAddFile(name: string, file: File): void;
}

const StyledUploadContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 4,
  padding: 10,
  background:
    theme.palette.mode === "dark" ? "inherit" : "rgba(240, 244, 255, 0.5)",
  border: `1px dashed ${theme.palette.primary.main}`,
  marginLeft: 8,
}));

const StyledUploadText = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#5D789A" : "#8695B1",
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

const FileDecryptionDropZone: React.FC<FileDecryptionDropZoneProps> = ({
  acceptedFileTypes,
  acceptedFileName,
  onAddFile,
}) => {
  const { t } = useTranslation();

  const [files, setFiles] = useState<File[] | null>(null);

  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    noClick: true,
    disabled: false,
    noKeyboard: true,
    accept: acceptedFileTypes,
  });

  useEffect(() => {
    if (acceptedFiles) {
      setFiles(acceptedFiles);
      onAddFile(acceptedFileName, acceptedFiles[0]);
    }
  }, [acceptedFiles]);

  return (
    <>
      {files && files?.length > 0 ? (
        <Box>
          <FileAttachmentBox
            files={files}
            open={true}
            remove={() => setFiles(null)}
          />
        </Box>
      ) : (
        <StyledUploadContainer
          {...getRootProps()}
          height={128}
          data-testid={"drop-zone"}
        >
          <input {...getInputProps()} />
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
                <PrimaryBtn onClick={open} startIcon={<AddIcon />}>
                  {t("browseFiles")}
                </PrimaryBtn>
              </StyledBrowseBtn>
            </Box>
          </Box>
        </StyledUploadContainer>
      )}
    </>
  );
};

export default FileDecryptionDropZone;
