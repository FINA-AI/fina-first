import { Box, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/system";

interface ErrorTemplatePopoverProps {
  popoverCloseHandler: (val: any) => void;
  setErrorTemplate: (value: string) => void;
  errorTemplate: string;
  insertPosition: number;
}

const StyledSectionBox = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  padding: "10px 12px",
  borderBottom: "1px solid #434B59",
}));

const StyledTypography = styled(Typography)(() => ({
  color: "#EAEBF0",
  fontWeight: 400,
  fontSize: 14,
  opacity: 0.7,
  marginBottom: 12,
}));

const StyledTooltipItem = styled(Box)(() => ({
  padding: "4px",
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "12px",
  color: "#FFFFFF",
  display: "flex",
  alignItems: "center",
  textTransform: "capitalize",
  textJustify: "auto",
  cursor: "pointer",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.1)",
  },
}));

const ErrorTemplatePopover: React.FC<ErrorTemplatePopoverProps> = ({
  popoverCloseHandler,
  errorTemplate = "",
  setErrorTemplate,
  insertPosition,
}) => {
  const { t } = useTranslation();

  const item = (value: string, title: string) => {
    let result = "";

    if (errorTemplate) {
      const index =
        insertPosition < 0 ? errorTemplate?.length + 1 : insertPosition;
      result = `${errorTemplate?.slice(
        0,
        index
      )}<${value}>${errorTemplate?.slice(index)}`;
    } else {
      result = `<${value}>`;
    }

    return (
      <StyledTooltipItem
        onClick={() => {
          setErrorTemplate(result);
          popoverCloseHandler(value);
        }}
        data-testid={title}
      >
        {t(title)}
      </StyledTooltipItem>
    );
  };

  return (
    <Box
      sx={{
        padding: "4px",
        maxWidth: 150,
        overflow: "hidden",
      }}
    >
      <StyledSectionBox data-testid={"comparison-section"}>
        <StyledTypography> {t("comparison")}</StyledTypography>
        {item("comparison.leftEquation", "leftEquation")}
        {item("comparison.rightEquation", "rightEquation")}
        {item("comparison.condition", "condition")}
      </StyledSectionBox>
      <StyledSectionBox data-testid={"mdtNode-section"}>
        <StyledTypography> {t("mdtNode")}</StyledTypography>
        {item("item.code", "code")}
        {item("item.description", "description")}
        {item("item.equation", "equation")}
        {item("item.dataElementValue", "dataElementValue")}
      </StyledSectionBox>
      <StyledSectionBox data-testid={"other-section"}>
        <StyledTypography> {t("other")}</StyledTypography>
        {item("compValue", "comparisonValue")}
        {item("itemValue", "originalValue")}
        {item("rowNumber", "rowNumber")}
      </StyledSectionBox>
    </Box>
  );
};

export default ErrorTemplatePopover;
