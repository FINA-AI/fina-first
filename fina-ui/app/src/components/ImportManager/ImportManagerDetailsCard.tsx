import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import { Grid, Typography } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import WarningIcon from "@mui/icons-material/Warning";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import React, { useEffect, useState } from "react";
import useConfig from "../../hoc/config/useConfig";
import { getFormattedDateTimeValue } from "../../util/appUtil";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { styled } from "@mui/material/styles";
import { ImportedReturn } from "../../types/importManager.type";

interface ImportManagerDetailsCardProps {
  packageReturn: ImportedReturn;
  showXmlClickHandler(packageReturn: ImportedReturn): void;
}

const StyledCardContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: 8,
  padding: 12,
  borderBottom: (theme as any).palette.borderColor,
  background: theme.palette.mode === "dark" ? "#475467" : "#FFFFFF",
  "&:hover": {
    background: theme.palette.mode === "dark" ? "#475467d6" : "#F6F6F6",
  },
  "& .MuiAccordionSummary-content": {
    margin: "0!important",
  },
  "& .MuiAccordionDetails-root": {
    padding: "0!important",
  },
  "& .MuiButtonBase-root": {
    padding: "0!important",
    minHeight: "0!important",
  },
  "& .MuiPaper-root": {
    boxShadow: "none",
  },
}));

const StyledStatusContainer = styled(Box)(() => ({
  backgroundColor: "#F0F4FF",
  borderRadius: 2,
  padding: "2px 4px",
  width: "fit-content",
}));

const StyledStatus = styled(Typography)(() => ({
  color: "#2962FF",
  fontWeight: 400,
  fontSize: 11,
  lineHeight: "12px",
}));

const StyledFiberManualRecord = styled(FiberManualRecordIcon)(() => ({
  width: 10,
  height: 10,
  color: "#EAEBF0",
  marginLeft: 8,
  marginRight: 8,
}));

const StyledWarningIcon = styled(WarningIcon)(() => ({
  color: "#FF8D00",
  fontSize: 14,
  marginRight: 5,
}));

const StyledDates = styled(Typography)(({ theme }) => ({
  fontSize: 11,
  fontWeight: 400,
  lineHeight: "16px",
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#4F5863",
}));

const StyledXml = styled(Typography)(() => ({
  color: "#2962FF",
  textDecorationLine: "underline",
  fontWeight: 400,
  fontSize: 11,
  cursor: "pointer",
  lineHeight: "16px",
}));

const StyledProcess = styled(Typography)(() => ({
  fontWeight: 400,
  fontSize: 11,
  lineHeight: "12px",
}));

const StyledCode = styled(Typography)(() => ({
  fontSize: 13,
  fontWeight: 500,
  marginRight: 5,
  lineHeight: "20px",
}));

const StyledPerson = styled(Typography)(() => ({
  color: "#98A7BC",
  fontSize: 12,
  fontWeight: 400,
  lineHeight: "20px",
}));

const StyledSeemore = styled(Typography)(() => ({
  fontSize: 11,
  fontWeight: 400,
  color: "#98A7BC",
  cursor: "pointer",
  lineHeight: "16px",
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#2B3748" : "#F9F9F9",
  width: "100%",
}));

const StyledCheckIcon = styled(CheckRoundedIcon)(() => ({
  width: "16px",
  height: "16px",
  color: "#289E20",
  paddingRight: "4px",
}));

const StyledSecText = styled("span")(() => ({
  fontWeight: 400,
  lineHeight: "16px",
  fontSize: "12px",
  color: "#98A7BC",
  marginRight: "4px",
}));

const StyledHeader = styled(StyledProcess)(() => ({
  whiteSpace: "nowrap",
  overflow: "hidden",
  lineBreak: "anywhere",
  maxWidth: "560px",
  textOverflow: "ellipsis",
}));

const StyledMessageContainer = styled(Box)<{ expanded: boolean }>(
  ({ theme, expanded }) => ({
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: theme.palette.mode === "dark" ? "#2B3748" : "#F9F9F9",
    padding: "8px",
    border: expanded ? (theme as any).palette.borderColor : "",
    borderRadius: "2px",
  })
);

const StyledMessageBox = styled(Box)(() => ({
  display: "flex",
}));

const StyledMessage = styled(Box)(() => ({
  fontSize: "11px",
  display: "flex",
  alignItems: "center",
}));

const ImportManagerDetailsCard: React.FC<ImportManagerDetailsCardProps> = ({
  packageReturn,
  showXmlClickHandler,
}) => {
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [packageReturn.id]);

  return (
    <StyledCardContainer>
      <Box display={"flex"} justifyContent={"space-between"}>
        <StyledStatusContainer>
          <StyledStatus>{packageReturn.status}</StyledStatus>
        </StyledStatusContainer>
        <Box>
          <StyledXml
            onClick={() => {
              showXmlClickHandler(packageReturn);
            }}
          >
            {t("showXML")}
          </StyledXml>
        </Box>
      </Box>
      <Box display={"flex"} alignItems={"center"}>
        <StyledCode>{packageReturn.returnCode}</StyledCode>
        <StyledPerson>{t("by") + " " + packageReturn.bankCode}</StyledPerson>
      </Box>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Box display={"flex"} alignItems={"center"}>
          <StyledDates>
            <StyledSecText>{t("upload")} : </StyledSecText>
            {getFormattedDateTimeValue(
              packageReturn.uploadTime,
              getDateFormat(true)
            )}
          </StyledDates>
          <StyledFiberManualRecord />
          <StyledDates>
            <StyledSecText>{t("start")} : </StyledSecText>
            {getFormattedDateTimeValue(
              packageReturn.periodStart,
              getDateFormat(true)
            )}
          </StyledDates>
          <StyledFiberManualRecord />
          <StyledDates>
            <StyledSecText>{t("end")} : </StyledSecText>
            {getFormattedDateTimeValue(
              packageReturn.periodEnd,
              getDateFormat(true)
            )}
          </StyledDates>
        </Box>
      </Box>
      <StyledMessageContainer expanded={expanded}>
        <StyledAccordion
          elevation={0}
          expanded={expanded}
          onChange={() => {
            if (
              packageReturn.message &&
              packageReturn.message?.trim().length > 0
            ) {
              setExpanded(!expanded);
            }
          }}
        >
          <AccordionSummary
            aria-label="Expand"
            aria-controls="additional-actions1-content"
            id="additional-actions1-header"
          >
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              width={"100%"}
            >
              {!expanded && (
                <>
                  <Box display={"flex"} alignItems={"center"}>
                    {packageReturn.status === "IMPORTED" ? (
                      <CheckRoundedIcon />
                    ) : (
                      <StyledWarningIcon />
                    )}
                    <StyledHeader>{packageReturn.message}</StyledHeader>
                  </Box>
                  <Box display={"flex"} alignItems={"center"}>
                    <StyledSeemore
                      onClick={() => {
                        if (
                          packageReturn.message &&
                          packageReturn.message?.trim().length > 0
                        ) {
                          setExpanded(!expanded);
                        }
                      }}
                    >
                      {t("seeMore")}
                    </StyledSeemore>
                  </Box>
                </>
              )}
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid item>
              <StyledProcess>
                <StyledMessageBox>
                  {packageReturn.status === "IMPORTED" ? (
                    <StyledCheckIcon />
                  ) : (
                    <StyledWarningIcon />
                  )}
                  <StyledMessage>{packageReturn.message}</StyledMessage>
                </StyledMessageBox>

                <Box
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"flex-end"}
                >
                  <StyledSeemore
                    onClick={() => {
                      if (
                        packageReturn.message &&
                        packageReturn.message?.trim().length > 0
                      ) {
                        setExpanded(!expanded);
                      }
                    }}
                  >
                    {expanded && t("seeLess")}
                  </StyledSeemore>
                </Box>
              </StyledProcess>
            </Grid>
          </AccordionDetails>
        </StyledAccordion>
      </StyledMessageContainer>
    </StyledCardContainer>
  );
};

export default ImportManagerDetailsCard;
