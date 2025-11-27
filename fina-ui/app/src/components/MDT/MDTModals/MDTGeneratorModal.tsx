import ClosableModal from "../../common/Modal/ClosableModal";
import { useTranslation } from "react-i18next";
import { Box, styled } from "@mui/system";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SubmitBtn from "../../common/Button/SubmitBtn";
import FileAttachmentBox from "../../Messages/Chat/FileAttachmentBox";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Typography } from "@mui/material";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import AddIcon from "@mui/icons-material/Add";
import { mdtXmlGenerator } from "../../../api/services/MDTService";
import { useSnackbar } from "notistack";

interface MDTGeneratorModalProps {
  openModal: boolean;
  onClose(): void;
}

const StyledUploadContainerBox = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 4,
  padding: 10,
  background: "rgba(240, 244, 255, 0.5)",
  border: "1px dashed #2962FF",
  width: "100%",
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondaryTextColor,
  fontWeight: 500,
  fontSize: 15,
  width: "fit-content",
  display: "flex",
  justifyContent: "center",
  padding: 4,
}));

const StyledFooter = styled(Box)(({ theme }) => ({
  ...(theme as any).modalFooter,
  fontWeight: 500,
  fontSize: "12px",
  lineHeight: "16px",
  display: "flex",
  textTransform: "capitalize",
  justifyContent: "end",
  padding: "16px",
  "& .MuiSvgIcon-root": {
    paddingLeft: "10px",
  },
}));

const StyledUploadBox = styled(Box)(({ theme }) => ({
  background: theme.palette.mode === "dark" ? "inherit" : "#FFFFFF",
  borderRadius: "13px",
  width: "fit-content",
  fontWeight: 500,
  fontSize: "12px",
  lineHeight: "16px",
  textTransform: "capitalize",
  padding: "4px 8px",
  marginRight: "10px",
  border: "1px solid #2962FF",
  color: theme.palette.mode === "dark" ? "#5d789a" : "#2962FF",
}));

const StyledUploadProgressBox = styled(Box)(() => ({
  background: "#94B1FF",
  borderRadius: "13px",
  minWidth: "fit-content",
  fontWeight: 500,
  fontSize: "12px",
  lineHeight: "16px",
  textTransform: "capitalize",
  color: "#FFFFFF",
  padding: "4px 8px",
  marginRight: "10px",
}));

const MDTGeneratorModal: React.FC<MDTGeneratorModalProps> = ({
  onClose,
  openModal,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [file, setFile] = useState<File | null>(null);
  const [btnDisable, setBtnDisable] = useState(true);
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    noClick: true,
    disabled: false,
    noKeyboard: true,
    multiple: false,
    accept: [".xls", ".xlsx"],
  });

  useEffect(() => {
    if (acceptedFiles.length !== 0) {
      setFile(acceptedFiles[0]);
      setBtnDisable(false);
      //TODO Server Side Upload File
      setIsFileUploaded(true);
    }
  }, [acceptedFiles]);

  const mdtGeneratorFunc = () => {
    const formData = new FormData();
    formData.append("attachment", file as File);

    mdtXmlGenerator(formData)
      .then((res) => {
        const blob = new Blob([res.data]);
        const originalFileName = file?.name;
        let fileName = `${originalFileName}.zip`;
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link?.parentNode?.removeChild(link);

        enqueueSnackbar(t("Convert Successfully"), {
          variant: "success",
        });
      })
      .catch(() => {
        enqueueSnackbar(t("Convert Failed"), {
          variant: "error",
        });
      })
      .finally(() => {
        onClose();
      });
  };

  return (
    <ClosableModal
      onClose={onClose}
      open={openModal}
      width={530}
      height={390}
      includeHeader={true}
      title={t("mdtGenerator")}
      titleFontWeight={"600"}
    >
      <Box
        width={"100%"}
        height={"280px"}
        display={"flex"}
        flexDirection={"column"}
      >
        <Box
          overflow={"auto"}
          padding={"20px"}
          display={"flex"}
          height={"100%"}
        >
          {!file && (
            <StyledUploadContainerBox {...getRootProps()}>
              <input {...getInputProps()} />
              <Box
                display={"flex"}
                justifyContent={"center"}
                width={"fit-content"}
                flexDirection={"column"}
              >
                <Box display={"flex"} justifyContent={"center"}>
                  <StyledTypography>
                    {`${t("dropToUpload")} ${"or"}`}
                  </StyledTypography>
                </Box>
                <Box display={"flex"} justifyContent={"center"}>
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    width={"156px"}
                    margin={"4px"}
                  >
                    <PrimaryBtn onClick={open} startIcon={<AddIcon />}>
                      {`${t("browseFiles")}`}
                    </PrimaryBtn>
                  </Box>
                </Box>
              </Box>
            </StyledUploadContainerBox>
          )}

          {file && (
            <Box display={"flex"} width={"100%"} height={"100%"}>
              <FileAttachmentBox
                files={[file]}
                open={true}
                remove={() => {
                  setFile(null);
                  setBtnDisable(true);
                }}
                style={{
                  background: "#F9F9F9",
                  borderRadius: "3px",
                }}
              >
                {isFileUploaded ? (
                  <StyledUploadBox>{t("uploaded")}</StyledUploadBox>
                ) : (
                  <StyledUploadProgressBox>
                    {`${t("uploading")} ...`}
                  </StyledUploadProgressBox>
                )}
              </FileAttachmentBox>
            </Box>
          )}
        </Box>
      </Box>
      <StyledFooter>
        <SubmitBtn
          onClick={() => mdtGeneratorFunc()}
          disabled={btnDisable}
          endIcon={<ChevronRightIcon />}
        >
          {t("convert")}
        </SubmitBtn>
      </StyledFooter>
    </ClosableModal>
  );
};

export default MDTGeneratorModal;
