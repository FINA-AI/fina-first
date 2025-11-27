import { Box, Divider, Link, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ClosableModal from "../common/Modal/ClosableModal";
import useConfig from "../../hoc/config/useConfig";
import { downloadErrorLogHandler } from "../../util/appUtil";
import React from "react";
import { FiImportResult } from "../../types/fi.type";
import { styled } from "@mui/material/styles";

interface FiErrorModalProps {
  fiErrorModalIsOpen: boolean;
  setFiErrorModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  errorData: FiImportResult;
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

const FiErrorModal: React.FC<FiErrorModalProps> = ({
  fiErrorModalIsOpen,
  setFiErrorModalIsOpen,
  errorData,
}) => {
  const { t } = useTranslation();
  const { config }: any = useConfig();

  const handleClose = () => {
    setFiErrorModalIsOpen(false);
  };

  const { importedFis, modifiedFis, ...otherErrorData } = errorData;
  const errors = Object.values(otherErrorData).some(
    (array) => Array.isArray(array) && array.length > 0
  );

  const constructErrorText = () => {
    let prolog = `${t("user")} : ${config.userName}\n${t(
      "timestamp"
    )}: ${new Date().toLocaleString()} \n\n`;

    let text = prolog + `${t("executionWereCaught")}\n\n`;
    for (const [key, value] of Object.entries(errorData)) {
      if (Array.isArray(value) && value.length > 0) {
        if (key === "exceptionMessages") {
          value.forEach((item) => {
            text += `${item}\n`;
          });
        } else {
          text += `${t(`${key}`)} ${value}\n`;
        }
      }
    }
    return text;
  };

  const handleDownloadErrorLog = (errorText: string) => {
    downloadErrorLogHandler(errorText);
  };

  return (
    <ClosableModal
      onClose={handleClose}
      open={fiErrorModalIsOpen}
      width={500}
      height={450}
      includeHeader={true}
      padding={0}
      title={t("beInformed")}
    >
      <StyledRoot>
        <Divider />
        <Box sx={{ padding: "12px", fontSize: "14px", lineHeight: "20px" }}>
          <StyledTypography>{t("FiImportCompleted")}</StyledTypography>
          <StyledTypography>{errors && t("issue")}</StyledTypography>
          <StyledTypography fontWeight={"500"}>
            {`${t("message")}: `}
          </StyledTypography>
          {importedFis.length > 0 && (
            <>
              <StyledTypography>
                {t("importedFis")} : {importedFis.join(", ")}
              </StyledTypography>
            </>
          )}
          {modifiedFis.length > 0 && (
            <>
              <StyledTypography>
                {t("modifiedFis")} : {modifiedFis}
              </StyledTypography>
            </>
          )}
          {errors && (
            <>
              <StyledTypography>{t("executionWereCaught")}</StyledTypography>
              {Object.entries(otherErrorData).map(([key, value]) => {
                if (Array.isArray(value) && value.length > 0) {
                  if (key === "exceptionMessages") {
                    return (
                      <div key={key}>
                        {value.map((message, index) => (
                          <StyledTypography key={index}>
                            {`${message} \n`}
                          </StyledTypography>
                        ))}
                      </div>
                    );
                  }
                  return (
                    <StyledTypography key={key}>
                      {`${t(`${key}`)} 
                      ${value}`}
                    </StyledTypography>
                  );
                }
                return null;
              })}
            </>
          )}

          <StyledTypography>{errors && t("reportProblem")}</StyledTypography>
          <Link
            component="button"
            display={"flex"}
            sx={{ padding: "8px 0px", fontSize: "12px" }}
            onClick={() => handleDownloadErrorLog(constructErrorText())}
          >
            {errors && t("downloadErrorLog")}
          </Link>
        </Box>
      </StyledRoot>
    </ClosableModal>
  );
};

export default FiErrorModal;
