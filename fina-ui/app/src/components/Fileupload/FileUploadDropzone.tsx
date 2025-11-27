import { useDropzone } from "react-dropzone";
import React, { useEffect } from "react";
import SystemUpdateAltOutlinedIcon from "@mui/icons-material/SystemUpdateAltOutlined";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled } from "@mui/system";

interface FileUploadDropzoneProps {
  addFile: (files: File[]) => void;
  isDisabled: boolean;
  maxFiles?: number;
}

const StyledDropzone = styled("div")(({ theme }) => ({
  borderWidth: 2,
  border: "1px dashed #B6B6B6",
  borderRadius: "6px",
  padding: "50px",
  margin: "20px 0",
  textAlign: "center",
  [theme.breakpoints.down("lg")]: {
    border: "none",
    padding: 0,
    paddingBottom: 50,
  },
  ...(theme as any).MuiPaper,
}));

const StyledButton = styled(Button)(() => ({
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
  padding: "5px 15px",
}));

const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
  addFile,
  isDisabled,
  maxFiles,
}) => {
  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    noClick: true,
    disabled: isDisabled,
    noKeyboard: true,
    maxFiles,
  });
  const { t } = useTranslation();

  useEffect(() => {
    addFile(acceptedFiles);
  }, [acceptedFiles]);

  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <StyledDropzone {...getRootProps()}>
      <input {...getInputProps()} />
      <div
        style={{
          color: "#B6B6B6",
        }}
      >
        {isDisabled ? (
          <div>{t("fileUploadDisabled")}</div>
        ) : (
          <>
            {!isSm ? (
              <>
                <SystemUpdateAltOutlinedIcon />
                <div>{t("drag files")}</div>
                <div>{t("or")}</div>
                <StyledButton variant="outlined" onClick={open}>
                  {t("choose file")}
                </StyledButton>{" "}
              </>
            ) : (
              <>
                <div style={{ paddingBottom: 10 }}>
                  <SystemUpdateAltOutlinedIcon />
                </div>
                <StyledButton variant="outlined" onClick={open}>
                  {t("choose file")}
                </StyledButton>
              </>
            )}
          </>
        )}
      </div>
    </StyledDropzone>
  );
};

export default FileUploadDropzone;
