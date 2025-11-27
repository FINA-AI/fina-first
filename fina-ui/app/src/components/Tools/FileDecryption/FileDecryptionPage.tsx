import { Box } from "@mui/system";
import { Grid, Typography } from "@mui/material";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import FileDecryptionDropZone from "./FileDecryptionDropZone";
import TextField from "../../common/Field/TextField";
import useConfig from "../../../hoc/config/useConfig";
import { styled } from "@mui/material/styles";

interface FileDecryptionPageProps {
  decryptFileHandler(data: FormData, isLegacyCertificateMode: boolean): void;
}

const StyledRoot = styled(Box)(({ theme }: { theme: any }) => ({
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.paperBackground,
  borderRadius: "4px",
}));

const StyledGridContainer = styled(Grid)({
  overflow: "hidden",
  padding: "12px 8px",
});

const StyledToolbar = styled(Grid)(({ theme }: { theme: any }) => ({
  ...theme.pageToolbar,
  padding: "9px 16px",
  justifyContent: "flex-end",
  borderBottom: theme.palette.borderColor,
}));

const StyledTypography = styled(Typography)(({ theme }: { theme: any }) => ({
  marginLeft: 8,
  color: theme.palette.textColor,
  fontWeight: 600,
  fontSize: 14,
  lineHeight: "21px",
  marginBottom: 14,
}));

const FileDecryptionPage: React.FC<FileDecryptionPageProps> = ({
  decryptFileHandler,
}) => {
  const { t } = useTranslation();
  const [data, setData] = useState<Record<string, any>>();
  const { config } = useConfig();

  const onAddFile = (name: string, file: File) => {
    setData({ ...(data || {}), [name]: file });
  };

  const isLegacyCertificateMode = () => {
    return Boolean(config.properties["CERTIFICATE_MODE"] === "LEGACY");
  };

  return (
    <StyledRoot>
      <StyledToolbar>
        <PrimaryBtn
          onClick={() => {
            let formData = new FormData();
            formData.append("certificateFile", data?.certificateFile);
            formData.append("finaFile", data?.finaFile);
            formData.append("password", data?.password);
            decryptFileHandler(formData, isLegacyCertificateMode());
          }}
          data-testid={"decrypt-button"}
        >
          {t("decrypt")}
        </PrimaryBtn>
      </StyledToolbar>
      <StyledGridContainer item xs={6}>
        <Grid container>
          <Grid item xs={12}>
            <StyledTypography>{t("selectFinaFile")}</StyledTypography>
            <FileDecryptionDropZone
              acceptedFileTypes={[".fina", ".xlsx", ".xlsm"]}
              onAddFile={onAddFile}
              acceptedFileName={"finaFile"}
            />
          </Grid>
          {isLegacyCertificateMode() && (
            <>
              <Grid item xs={12}>
                <StyledTypography marginTop={"24px"}>
                  {t("selectCertificateFile")}
                </StyledTypography>
                <FileDecryptionDropZone
                  acceptedFileTypes={[".pfx"]}
                  onAddFile={onAddFile}
                  acceptedFileName={"certificateFile"}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTypography marginTop={"24px"}>
                  {t("password")}
                </StyledTypography>
                <Box ml={"8px"}>
                  <TextField
                    label={t("certificatePassword")}
                    onChange={(val: string) => {
                      setData({ ...data, password: val });
                    }}
                    type={"password"}
                    fieldName={"password"}
                  />
                </Box>
              </Grid>
            </>
          )}
        </Grid>
      </StyledGridContainer>
    </StyledRoot>
  );
};

export default FileDecryptionPage;
