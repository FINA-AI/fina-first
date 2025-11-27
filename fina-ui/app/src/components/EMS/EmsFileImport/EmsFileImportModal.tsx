import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ClosableModal from "../../common/Modal/ClosableModal";
import Box from "@mui/material/Box";
import { Grid } from "@mui/material";
import { FiType } from "../../../types/fi.type";
import Select from "../../common/Field/Select";
import GhostBtn from "../../common/Button/GhostBtn";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useDropzone } from "react-dropzone";
import TextField from "../../common/Field/TextField";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";

interface EmsFileImportModalProps {
  showModal: boolean;
  setShowModal: (isSow: boolean) => void;
  fiTypes: FiType[];
  addNewConfig: (payload: FormData) => void;
}

const StyledFooter = styled(Box)(({ theme }: any) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 10,
  paddingRight: 20,
  ...theme.modalFooter,
}));

const StyledCheckIcon = styled(CloudUploadIcon)({
  width: 16,
  height: 14,
  marginLeft: "5px",
});

const EmsFileImportModal: React.FC<EmsFileImportModalProps> = ({
  showModal,
  setShowModal,
  fiTypes,
  addNewConfig,
}) => {
  const { t } = useTranslation();
  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    noClick: true,
    disabled: false,
    noKeyboard: true,
    accept: [".xlsx"],
  });

  const [importData, setImportData] = useState<any>({});
  const [file, setFile] = useState<{ path?: string } | any>({});

  useEffect(() => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, [acceptedFiles]);

  const appendFormData = (
    formData: FormData,
    key: string,
    value: string | number | boolean | Blob | undefined
  ) => {
    if (value !== undefined) {
      formData.append(key, value.toString());
    }
  };

  return (
    <ClosableModal
      onClose={() => {
        setShowModal(false);
      }}
      open={showModal}
      includeHeader={true}
      title={t("fileimport")}
      disableBackdropClick={true}
    >
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-between"}
      >
        <Box display={"flex"} flex={1}>
          <Grid container spacing={2} direction={"column"} padding={"30px"}>
            <Grid item>
              <Select
                data={fiTypes.map((item) => ({
                  label: item.code,
                  value: item.code,
                }))}
                label={t("fiType")}
                onChange={(value) => {
                  setImportData({ ...importData, fiType: value });
                }}
                value={importData?.fiType}
                data-testid={"fi-Type-select"}
              />
            </Grid>

            <Grid item>
              <Box style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <TextField
                  onChange={() => {}}
                  value={file?.path ?? importData?.exportFileTemplateName}
                  isDisabled={true}
                  fieldName={"file-name"}
                />

                <Box {...getRootProps()}>
                  <input {...getInputProps()} />
                  <PrimaryBtn
                    onClick={open}
                    startIcon={<AddIcon />}
                    children={<>{t("browseFiles")}</>}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <StyledFooter>
          <GhostBtn
            onClick={() => {
              setShowModal(false);
            }}
            style={{ marginRight: "10px" }}
            data-testid={"cancel-button"}
          >
            {t("cancel")}
          </GhostBtn>
          <PrimaryBtn
            backgroundColor={"rgb(41, 98, 255)"}
            onClick={() => {
              const formData = new FormData();
              formData.append("fileUpload", file);
              appendFormData(formData, "fiTypeCode", importData?.fiType);
              appendFormData(formData, "file_name", file?.path);

              addNewConfig(formData);
              setShowModal(false);
            }}
            disabled={!(file.path && importData.fiType)}
            endIcon={<StyledCheckIcon />}
            data-testid={"upload-button"}
          >
            {t("upload")}
          </PrimaryBtn>
        </StyledFooter>
      </Box>
    </ClosableModal>
  );
};

export default EmsFileImportModal;
