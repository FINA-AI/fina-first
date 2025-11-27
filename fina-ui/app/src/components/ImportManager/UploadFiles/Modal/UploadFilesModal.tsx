import ClosableModal from "../../../common/Modal/ClosableModal";
import React, { FC, useEffect, useState } from "react";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import { Grid, Typography } from "@mui/material";
import PrimaryBtn from "../../../common/Button/PrimaryBtn";
import AddIcon from "@mui/icons-material/Add";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { connect } from "react-redux";
import UploadFileProgressView from "./UploadFileProgressView";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import GhostBtn from "../../../common/Button/GhostBtn";
import { uploadFile } from "../../../../api/services/uploadFileService";
import { UploadFileType } from "../../../../types/uploadFile.type";
import { styled } from "@mui/material/styles";

interface UploadFilesModalProps {
  isUploadFileModalOpen: boolean;
  setIsUploadFileModalOpen: (isOpen: boolean) => void;
  uploadFilePattern: string;
  data: UploadFileType[];
  setData: React.Dispatch<React.SetStateAction<UploadFileType[]>>;
}

const StyledRoot = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "100%",
  boxSizing: "border-box",
  padding: 0,
});

const StyledUploadContainer = styled(Box)(({ theme }) => ({
  height: "108px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 4,
  padding: 10,
  background:
    theme.palette.mode === "dark" ? "#3c4d6896" : "rgba(240, 244, 255, 0.5)",
  border: "1px dashed #2962FF",
}));

const StyledUploadText = styled(Typography)({
  color: "#98A7BC",
  fontWeight: 500,
  fontSize: 13,
  lineHeight: "16px",
  width: "fit-content",
  display: "flex",
  justifyContent: "center",
  padding: 6,
});

const StyledBrowseButton = styled(Box)({
  display: "flex",
  justifyContent: "center",
  width: 156,
  margin: 4,
});

const StyledFooter = styled(Box)(({ theme }: any) => ({
  display: "flex",
  justifyContent: "end",
  ...theme.modalFooter,
}));

const UploadFilesModal: FC<UploadFilesModalProps> = ({
  isUploadFileModalOpen,
  setIsUploadFileModalOpen,
  uploadFilePattern,
  data,
  setData,
}) => {
  const { t } = useTranslation();
  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    noClick: true,
    disabled: false,
    noKeyboard: true,
  });
  const { openErrorWindow } = useErrorWindow();

  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    addFile(acceptedFiles);
  }, [acceptedFiles]);

  const handleClose = () => {
    files.forEach((file) => {
      if (file.cancelSource) {
        file.cancelSource.cancel("Upload cancelled by user.");
      }
    });

    setFiles([]);
    setIsUploadFileModalOpen(false);
  };

  const addFile = (f: any) => {
    if (f && f.length !== 0) {
      let tmpFiles: any = [];
      f.forEach((f: any) => {
        const source = axios.CancelToken.source();
        if (
          !tmpFiles.find((d: any) => d.id === f.name) &&
          !files.find((d) => d.id === f.name)
        ) {
          tmpFiles.push({
            id: f.name,
            file: f,
            ...validateName(f.name),
            cancelSource: source,
          });
        }
      });
      setFiles(files.concat(tmpFiles));
    }
  };

  const validateName = (name: string) => {
    for (let p of uploadFilePattern) {
      let regExp;

      try {
        regExp = RegExp(`^${p}$`);
      } catch {
        return {
          isValid: false,
          invalidText: t("file name pattern is not valid"),
        };
      }

      if (regExp.test(name)) {
        return { isValid: true, invalidText: "" };
      }
    }
    return { isValid: false, invalidText: t("file name is not valid") };
  };

  const fileRemove = (fileName: string) => {
    let cancelItem = files.find((el) => el.file.name === fileName);
    if (cancelItem !== null && cancelItem.cancelSource) {
      cancelItem["canceled"] = true;
      cancelItem.cancelSource.cancel("Request Cancelled!");
    }
    setFiles(files.filter((d) => d.file.name !== fileName));
  };

  const onFileUpload = () => {
    let validFiles = files.filter((f) => f.isValid);
    setFiles([...validFiles]);

    // map each file to a promise
    const uploadPromises = validFiles.map((f) => {
      return uploadFile(f.file, f.cancelSource.token, (event: any) => {
        let index = files.findIndex((d) => d.id === f.id);
        if (index >= 0) {
          files[index]["progress"] = Math.round(
            (100 * event.loaded) / event.total
          );
          setFiles([...files.filter((el) => !el.canceled)]);
        }
      });
    });

    // wait for all promises (file uploads) to complete
    Promise.all(uploadPromises)
      .then((res) => {
        let tmp = res.map((item) => {
          return item.data;
        });
        setData([...tmp, ...data]);
      })
      .catch((error) => {
        const message = !error?.response?.data ? error?.message : error;
        openErrorWindow(message, t("error"), true);
      })
      .finally(() => {
        setIsUploadFileModalOpen(false);
      });
  };

  return (
    <ClosableModal
      onClose={handleClose}
      open={isUploadFileModalOpen}
      title={t("uploadfiles")}
      width={800}
      height={files.length > 0 ? 400 : 300}
      disableBackdropClick
    >
      <StyledRoot p={"8px 16px"}>
        <Box sx={{ padding: "8px 16px", marginTop: "16px", paddingTop: 0 }}>
          <StyledUploadContainer
            {...getRootProps()}
            height={files && `${files.length === 0 ? 128 : 56}px`}
          >
            <input {...getInputProps()} />
            <Box
              display={"flex"}
              justifyContent={"center"}
              width={"fit-content"}
              flexDirection={"column"}
            >
              <Box display={"flex"} justifyContent={"center"}>
                <StyledUploadText>
                  {`${t("dropToUpload")} ${t("or")}`}
                </StyledUploadText>
              </Box>
              <Box display={"flex"} justifyContent={"center"}>
                <StyledBrowseButton>
                  <PrimaryBtn
                    onClick={open}
                    startIcon={<AddIcon />}
                    children={<>{t("browseFiles")}</>}
                  />
                </StyledBrowseButton>
              </Box>
            </Box>
          </StyledUploadContainer>
        </Box>
        <Box height={"100%"} overflow={"auto"}>
          {files && files.length > 0 && (
            <Grid
              paddingTop={"2px"}
              display={"flex"}
              justifyContent={"flex-start"}
              container
            >
              {files.map((file) => (
                <Grid item xs={6}>
                  <UploadFileProgressView
                    key={file.id}
                    fileName={file.file.name}
                    size={file.file.size}
                    isValid={file.isValid}
                    invalidText={file.invalidText}
                    progress={file.progress}
                    onFileRemove={fileRemove}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
        <StyledFooter display={"flex"} gap={"8px"} pt={"8px"}>
          <PrimaryBtn
            disabled={!files.find((f) => f.isValid)}
            onClick={onFileUpload}
          >
            {t("upload")}
          </PrimaryBtn>
          <GhostBtn onClick={handleClose}>{t("close")}</GhostBtn>
        </StyledFooter>
      </StyledRoot>
    </ClosableModal>
  );
};

const mapStateToProps = (state: any) => ({
  config: state.get("config").config,
});
export default connect(mapStateToProps)(UploadFilesModal);
