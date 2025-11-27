import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import BackupIcon from "@mui/icons-material/Backup";
import FileUploadDropzone from "./FileUploadDropzone";
import AddedFile from "./AddedFile";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { styled } from "@mui/system";

interface FileUploadWindowProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  uploadFile: (
    formData: FormData,
    f: UploadFile,
    files: UploadFile[],
    setFiles: (files: UploadFile[]) => void
  ) => UploadFile;
  config: any;
}

interface UploadFile {
  name?: string;
  id: string;
  file: File;
  isValid?: boolean;
  invalidText?: string;
  progress?: number;
}

const StyledModal = styled(Modal)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  [theme.breakpoints.down("xl")]: {
    width: "67%",
    marginLeft: "17%",
  },
  [theme.breakpoints.down("lg")]: {
    width: "67%",
    marginLeft: "17%",
  },
}));

const StyledPaper = styled("div")(({ theme }) => ({
  width: "1000px",
  background: "#FFFFFF",
  borderRadius: "6px",
  backgroundColor: "#FFFFFF",
  padding: "25px",
  [theme.breakpoints.down("lg")]: {
    paddingBottom: 15,
  },
}));

const StyledUploadButton = styled(Button)(() => ({
  background: `#3f51b5 0% 0% no-repeat padding-box`,
  color: "#FFFFFF",
  borderRadius: "6px",
  padding: "15px 50px",
  font: "normal normal 800 12px/20px FiraGO",
  "&:hover": {
    background: `#283593 0% 0% no-repeat padding-box`,
  },
  "&:disabled": {
    opacity: "30%",
    background: `#3f51b5 0% 0% no-repeat padding-box`,
    color: "#FFFFFF",
  },
  textTransform: "none",
}));
const StyledCloseButton = styled(Button)(() => ({
  padding: "15px 50px",
  margin: "5px",
  font: "normal normal 800 12px/20px FiraGO",
  textTransform: "none",
  color: "#3f51b5",
  borderColor: "#3f51b5",
  "&:hover": {
    background: `#e8eaf6 0% 0% no-repeat padding-box`,
  },
  "&:disabled": {
    opacity: "30%",
    color: "#3f51b5",
    borderColor: "#3f51b5",
  },
}));

const StyledBtnWrapper = styled("div")(({ theme }) => ({
  [theme.breakpoints.down("lg")]: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
  },
}));

const FileUploadWindow: React.FC<FileUploadWindowProps> = ({
  open,
  setOpen,
  config,
  uploadFile,
}) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();

  const handleClose = () => {
    setFiles([]);
    setOpen(false);
  };

  const addFile = (f: File[]) => {
    if (f && f.length !== 0) {
      let tmpFiles: UploadFile[] = [];
      f.forEach((f) => {
        if (
          !tmpFiles.find((d) => d.id === f.name) &&
          !files.find((d) => d.id === f.name)
        ) {
          tmpFiles.push({
            id: f.name,
            file: f,
            ...validateName(f.name),
          });
        }
      });
      setFiles(files.concat(tmpFiles));
    }
  };

  const validateName = (name: string) => {
    for (let p of config.fileNamePatterns) {
      if (new RegExp(`^${p}$`).test(name)) {
        return { isValid: true, invalidText: "" };
      }
    }
    return { isValid: false, invalidText: t("file name is not valid") };
  };

  const fileRemove = (fileName: string) => {
    let index = files.findIndex((d) => d.id === fileName);
    if (index >= 0) {
      files.splice(index, 1);
      setFiles([...files]);
    }
  };

  const onFileUpload = async () => {
    let validFiles = files.filter((f) => f.isValid);
    setFiles([...validFiles]);
    let uploadFiles: UploadFile[] = [];

    validFiles.forEach((f) => {
      let formData = new FormData();
      formData.append(`file`, f.file);
      try {
        uploadFiles.push(uploadFile(formData, f, files, setFiles));
      } catch (error) {
        openErrorWindow(error);
      }
    });

    try {
      await Promise.all(uploadFiles);
    } catch (error) {
      openErrorWindow(error);
    } finally {
      handleClose();
    }
  };

  return (
    <StyledModal
      open={open}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <StyledPaper>
        <div
          style={{
            textAlign: "center",
            color: "#484848",
            fontWeight: "500",
          }}
        >
          {t("upload files")}
        </div>
        <FileUploadDropzone
          isDisabled={!config.fileNamePatterns}
          addFile={addFile}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            overflowY: "auto",
            maxHeight: 200,
          }}
        >
          {files.map((file) => (
            <AddedFile
              key={file.id}
              fileName={file.file.name}
              size={file.file.size}
              isValid={!!file.isValid}
              invalidText={file.invalidText}
              progress={file.progress}
              onFileRemove={fileRemove}
            />
          ))}
        </div>
        <StyledBtnWrapper>
          <StyledUploadButton
            disabled={files.length !== 1}
            onClick={() => onFileUpload()}
          >
            <BackupIcon />
            &#160;&#160;{t("upload file")}
          </StyledUploadButton>
          <StyledCloseButton variant="outlined" onClick={() => handleClose()}>
            {t("close")}
          </StyledCloseButton>
        </StyledBtnWrapper>
      </StyledPaper>
    </StyledModal>
  );
};

export default FileUploadWindow;
