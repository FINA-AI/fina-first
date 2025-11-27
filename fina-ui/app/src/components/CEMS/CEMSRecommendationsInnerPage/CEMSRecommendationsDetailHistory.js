import { Box } from "@mui/system";
import { CALENDAR_MONTHS } from "../../../containers/Calendar/CalendarContainer";
import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionDetails from "@mui/material/AccordionDetails";
import { Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledRootBox = styled(Box)({
  "& .MuiAccordion-root:before": {
    display: "hidden !important",
    position: "relative !important",
  },
  "& .MuiPaper-root": {
    boxShadow: "none",
  },
  height: "100%",
  overflowX: "hidden",
  overflowY: "auto",
  marginBottom: 10,
});

const StyledDateFormatBox = styled(Box)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#434B59",
  fontSize: "13px",
  fontWeight: 500,
  lineHeight: "20px",
  maxWidth: "200px",
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  margin: "8px 0px",
  background: theme.palette.mode === "dark" ? "#3c4d68" : "#F9F9F9",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  maxWidth: 750,
  maxHeight: "200px",
  "& .MuiCollapse-root": {
    width: "100%",
  },
}));

const StyledLastOneBox = styled(Box)({
  background: "#2962FF",
  color: "#FFFFFF",
  borderRadius: "2px",
  fontSize: "10px",
  fontWeight: 500,
  lineHeight: "10px",
  textTransform: "capitalize",
  maxWidth: "fit-content",
  padding: "3px 8px",
  marginLeft: "10px",
});

const StyledHeader = styled(Box)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  width: "100%",
});

const StyledAccordionDetails = styled(AccordionDetails)({
  display: "flex",
  width: "100%",
  boxSizing: "border-box",
  maxHeight: 120,
});

const StyledGrid = styled(Grid)({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  height: "100%",
});

const StyledTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#434B59",
  opacity: "0.6",
  fontWeight: 500,
  fontSize: "11px",
  lineHeight: "12px",
  width: "100%",
}));

const StyledText = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#434B59",
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "20px",
  width: "100%",
  wordWrap: "break-word",
}));

const StyledTextWrapperBox = styled(Box)({
  paddingRight: "6px",
  overflow: "auto",
  "&::-webkit-scrollbar": {
    width: "2px",
    height: "100%",
  },
  "&::-webkit-scrollbar-thumb": {
    borderRadius: "3px",
  },
  "&:hover::-webkit-scrollbar": {
    width: "4px",
  },
});

const CEMSRecommendationsDetailHistory = ({ data }) => {
  const { t } = useTranslation();

  const getDate = (item) => {
    const date = new Date(item.recordDate);

    return (
      <StyledDateFormatBox>
        {`${date.getHours() + ":" + date.getMinutes()} | ${date.getDate()} ${
          CALENDAR_MONTHS[date.getMonth()]
        } ${date.getFullYear()}`}
      </StyledDateFormatBox>
    );
  };

  const getLastOneIcon = () => {
    return <StyledLastOneBox>{t("Last One")}</StyledLastOneBox>;
  };

  return (
    <StyledRootBox>
      {data?.map((item, index) => {
        return (
          <StyledAccordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              style={{ width: "100%", display: "flex" }}
            >
              <StyledHeader>
                {getDate(item)} {index === 0 && getLastOneIcon()}
              </StyledHeader>
            </AccordionSummary>
            <StyledAccordionDetails>
              <Grid container item xs={12} display={"flex"} spacing={"16px"}>
                <StyledGrid item xs={4}>
                  <StyledTitle>{t("executionStatus")}</StyledTitle>
                  <StyledTextWrapperBox>
                    <StyledText>{t(item.status)}</StyledText>
                  </StyledTextWrapperBox>
                </StyledGrid>
                <StyledGrid item xs={4}>
                  <StyledTitle>{t("banksMeasureFullfilOrder")}</StyledTitle>
                  <StyledTextWrapperBox>
                    <StyledText>{item.fiActions}</StyledText>
                  </StyledTextWrapperBox>
                </StyledGrid>
                <StyledGrid item xs={4}>
                  <StyledTitle>{t("note")}</StyledTitle>
                  <StyledTextWrapperBox>
                    <Typography>{item.note}</Typography>
                  </StyledTextWrapperBox>
                </StyledGrid>
              </Grid>
            </StyledAccordionDetails>
          </StyledAccordion>
        );
      })}
    </StyledRootBox>
  );
};

CEMSRecommendationsDetailHistory.propTypes = {
  data: PropTypes.array,
};

export default CEMSRecommendationsDetailHistory;
