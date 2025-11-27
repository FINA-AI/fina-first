import { Box, styled } from "@mui/system";
import { useTranslation } from "react-i18next";
import ClosableModal from "../common/Modal/ClosableModal";
import { Divider, Link, Typography } from "@mui/material";
import useConfig from "../../hoc/config/useConfig";
import { constructErrorLogTxt } from "./util/MdtErrorLogUtil";
import { downloadErrorLogHandler } from "../../util/appUtil";
import React from "react";

interface MdtErrorModal {
  error: any;
  setError: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      importedFileDataError: any;
      importedFileTranslationDataError: any;
    }>
  >;
}

const StyledRootBox = styled(Box)(() => ({
  display: "flex",
  width: "100%",
  height: "100%",
  flexDirection: "column",
  overflow: "auto",
}));

const StyledTypography = styled(Typography)(() => ({
  padding: "8px 0px",
  fontSize: "12px",
}));

const MdtErrorModal: React.FC<MdtErrorModal> = ({ error, setError }) => {
  const { t } = useTranslation();
  const { config } = useConfig();

  const handleClose = () => {
    setError({
      open: false,
      importedFileDataError: null,
      importedFileTranslationDataError: null,
    });
  };
  const handleDownloadErrorLog = (errorText: string) => {
    downloadErrorLogHandler(errorText);
  };

  const importedFileDataError =
    (error.importedFileDataError &&
      (error.importedFileDataError.codesNotFound?.length > 0 ||
        error.importedFileDataError.importedCodesToFix?.length > 0 ||
        error.importedFileDataError.renamedNodes?.length > 0)) ||
    error.importedFileDataError?.message?.length > 0;

  const importedFileTranslationDataError =
    error.importedFileTranslationDataError &&
    (error.importedFileTranslationDataError.nonExistingLanguageCodes?.length >
      0 ||
      error.importedFileTranslationDataError.nonExistingNodes?.length > 0 ||
      error.importedFileTranslationDataError.exception?.localizedMessage
        .length > 0 ||
      error.importedFileTranslationDataError.exceptionMessage);

  return (
    <ClosableModal
      onClose={handleClose}
      open={error.open}
      width={500}
      height={450}
      includeHeader={true}
      padding={0}
      title={t("beInformed")}
    >
      <StyledRootBox>
        <Divider />
        <Box sx={{ padding: "12px", fontSize: "14px", lineHeight: "20px" }}>
          <StyledTypography>
            {(importedFileDataError || importedFileTranslationDataError) &&
              t("issue")}
          </StyledTypography>
          <StyledTypography fontWeight={"500"}>
            {`${t("message")}: `}
          </StyledTypography>
          {error.importedFileDataError?.importedNodeCodes?.map(
            (item: string) => (
              <StyledTypography>{`${t(
                "importedNodeCodes"
              )} ${item}`}</StyledTypography>
            )
          )}

          {importedFileDataError && (
            <>
              <StyledTypography>{t("executionWereCaught")}</StyledTypography>
              {error.importedFileDataError?.codesNotFound?.map(
                (item: string) => (
                  <StyledTypography>
                    {`${t("codesNotFound")} 
                ${item}`}
                  </StyledTypography>
                )
              )}

              {error.importedFileDataError?.importedCodesToFix?.map(
                (item: string) => (
                  <StyledTypography>
                    {`${t("importedCodesToFix")} 
                ${item}`}
                  </StyledTypography>
                )
              )}
              {error.importedFileDataError?.message && (
                <StyledTypography>
                  {`${t("message")} : ${error.importedFileDataError.message}`}
                </StyledTypography>
              )}
              {Object.entries(error.importedFileDataError?.renamedNodes)?.map(
                ([key, value]) => (
                  <StyledTypography>
                    {`${t("renamedNodes")}  ${key} => ${value}`}
                  </StyledTypography>
                )
              )}
            </>
          )}
          {importedFileTranslationDataError && (
            <>
              {error.importedFileTranslationDataError?.nonExistingLanguageCodes?.map(
                (item: string) => (
                  <StyledTypography>
                    {`${t("nonExistingLanguageCodes")} 
                ${item}`}
                  </StyledTypography>
                )
              )}
              {error.importedFileTranslationDataError?.nonExistingNodes?.map(
                (item: string) => (
                  <StyledTypography>
                    {`${t("nonExistingNodes")} 
                ${item}`}
                  </StyledTypography>
                )
              )}
              {error.importedFileTranslationDataError.exception
                ?.localizedMessage.length > 0 && (
                <StyledTypography>
                  {
                    error.importedFileTranslationDataError.exception
                      ?.localizedMessage
                  }
                </StyledTypography>
              )}

              {error.importedFileTranslationDataError.exceptionMessage && (
                <StyledTypography>
                  {error.importedFileTranslationDataError.exceptionMessage}
                </StyledTypography>
              )}
            </>
          )}

          <StyledTypography>
            {(importedFileDataError || importedFileTranslationDataError) &&
              t("reportProblem")}
          </StyledTypography>
          <Link
            component="button"
            display={"flex"}
            sx={{
              padding: "8px 0px",
              fontSize: "12px",
            }}
            onClick={() =>
              handleDownloadErrorLog(constructErrorLogTxt(error, config, t))
            }
          >
            {(importedFileDataError || importedFileTranslationDataError) &&
              t("downloadErrorLog")}
          </Link>
        </Box>
      </StyledRootBox>
    </ClosableModal>
  );
};

export default MdtErrorModal;
