import { Box } from "@mui/system";
import React from "react";
import { useTranslation } from "react-i18next";
import { Divider, Link, Typography } from "@mui/material";
import ClosableModal from "../../common/Modal/ClosableModal";
import { downloadErrorLogHandler } from "../../../util/appUtil";
import { styled } from "@mui/material/styles";

interface EmsFileImportErrorModalProps {
  importFileData: { open: boolean; errors: any; warnings: any };
  setImportFileData: (value: {
    open: boolean;
    errors: any;
    warnings: any;
  }) => void;
}

const StyledRoot = styled(Box)({
  display: "flex",
  width: "100%",
  height: "100%",
  flexDirection: "column",
  overflow: "auto",
});

const StyledTypography = styled(Typography)({
  padding: "8px 0px",
  fontSize: "12px",
});

const EmsFileImportErrorModal: React.FC<EmsFileImportErrorModalProps> = ({
  importFileData,
  setImportFileData,
}) => {
  const { t } = useTranslation();

  const handleClose = () => {
    setImportFileData({ open: false, errors: [], warnings: [] });
  };

  const constructErrorLogMessage = () => {
    const errorMessages = importFileData.errors.join("\n");
    const warningMessages = importFileData.warnings.join("\n");
    return `${errorMessages}\n${warningMessages}`;
  };

  const handleDownloadErrorLog = (errorText: string) => {
    downloadErrorLogHandler(errorText);
  };
  return (
    <ClosableModal
      onClose={handleClose}
      open={importFileData.open}
      width={500}
      height={450}
      includeHeader={true}
      padding={0}
      title={t("beInformed")}
    >
      <StyledRoot>
        <Divider />
        <Box sx={{ padding: "12px", fontSize: "14px", lineHeight: "20px" }}>
          <StyledTypography>{t("issue")}</StyledTypography>
          <StyledTypography fontWeight={"500"}>
            {`${t("message")}: `}
          </StyledTypography>
          {importFileData.errors.map((item: string, index: number) => (
            <Typography
              key={index}
              sx={{ padding: "8px 0px", fontSize: "12px", color: "#ff1919" }}
            >
              {item}
            </Typography>
          ))}
          {importFileData.warnings.map((item: string, index: number) => (
            <Typography
              key={index}
              sx={{ padding: "8px 0px", fontSize: "12px", color: "#ff9200" }}
            >
              {item}
            </Typography>
          ))}
          <StyledTypography>{t("reportProblem")}</StyledTypography>
          <Link
            component="button"
            display={"flex"}
            sx={{ padding: "8px 0px", fontSize: "12px" }}
            onClick={() => handleDownloadErrorLog(constructErrorLogMessage())}
          >
            {t("downloadErrorLog")}
          </Link>
        </Box>
      </StyledRoot>
    </ClosableModal>
  );
};

export default EmsFileImportErrorModal;
