import { Box, Divider, Link, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ClosableModal from "../Modal/ClosableModal";
import React from "react";
import { ConfigType } from "../../../types/common.type";
import { downloadErrorLogHandler } from "../../../util/appUtil";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

interface GeneralErrorModalProps {
  errorData: { data: string[]; open: boolean };
  setErrorData: (value: { data: string[]; open: boolean }) => void;
  content: { title: string; value: string[] }[];
  config?: ConfigType;
}

const StyledRoot = styled(Box)(() => ({
  display: "flex",
  width: "100%",
  height: "100%",
  flexDirection: "column",
  overflow: "auto",
  borderRadius: 0,
}));

const StyledTextBox = styled(Box)(() => ({
  padding: "12px",
  fontSize: "14px",
  lineHeight: "20px",
}));

const StyledTypography = styled(Typography)(() => ({
  padding: "8px 0px",
  fontSize: "12px",
  fontWeight: "500",
}));

const GeneralErrorModal: React.FC<GeneralErrorModalProps> = ({
  errorData,
  setErrorData,
  content,
  config,
}) => {
  const { t } = useTranslation();
  const handleClose = () => {
    setErrorData({ data: [], open: false });
  };

  const constructErrorLogMessage = (userName: string | undefined) => {
    const contentMessage = content
      .filter((item) => item.value.length > 0)
      .map((item) => {
        const valuesText =
          item.value.length > 0 ? "\t" + item.value.join("\n") : "";
        return `${t(item.title)}\n\n${valuesText}`;
      })
      .join("\n\n");

    const indentedContentMessage = contentMessage
      .split("\n")
      .map((line) => `\t${line}`)
      .join("\n");

    return `  
        ${t("user")}: ${userName}
        ${t("timestamp")}: ${new Date().toLocaleString()}
      
        ************ ${t("issue")} **************
      
        ************ ${t("message")} **************
        ${indentedContentMessage}`;
  };

  const handleDownloadErrorLog = (errorText: string) => {
    downloadErrorLogHandler(errorText);
  };
  return (
    <ClosableModal
      onClose={handleClose}
      open={errorData.open}
      width={500}
      height={450}
      includeHeader={true}
      padding={0}
      title={t("beInformed")}
    >
      <StyledRoot component={Paper}>
        <Divider />
        <StyledTextBox>
          <StyledTypography>{content && `${t("issue")}`}</StyledTypography>
          <StyledTypography>{`${t("message")}: `}</StyledTypography>

          {content.length > 0 && (
            <>
              {content.map(
                (item, index) =>
                  item.value.length > 0 && (
                    <div key={index}>
                      <StyledTypography>{`${t(item.title)}`}</StyledTypography>
                      {item.value.map((value, valueIndex) => (
                        <StyledTypography key={valueIndex}>
                          {value}
                        </StyledTypography>
                      ))}
                    </div>
                  )
              )}
              <Link
                component={"button"}
                display={"flex"}
                style={{ padding: "8px 0px", fontSize: "12px" }}
                onClick={() =>
                  handleDownloadErrorLog(
                    constructErrorLogMessage(config?.userName)
                  )
                }
              >
                {t("downloadErrorLog")}
              </Link>
            </>
          )}
        </StyledTextBox>
      </StyledRoot>
    </ClosableModal>
  );
};

export default GeneralErrorModal;
