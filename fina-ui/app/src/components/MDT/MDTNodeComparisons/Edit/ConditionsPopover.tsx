import { Box } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/system";

interface ConditionsPopoverPropTypes {
  popoverCloseHandler: () => void;
  onChange: (val: string) => void;
}

const StyledItem = styled(Box)(() => ({
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

const ConditionsPopover: React.FC<ConditionsPopoverPropTypes> = ({
  popoverCloseHandler,
  onChange,
}) => {
  const { t } = useTranslation();

  const item = (equation: string, value: string) => {
    return (
      <StyledItem
        onClick={() => {
          popoverCloseHandler();
          onChange(value);
        }}
        data-testid={value}
      >
        <span
          style={{
            marginRight: 10,
          }}
        >
          {equation}
        </span>
        <span> {t(value)} </span>
      </StyledItem>
    );
  };

  return (
    <Box
      sx={{
        padding: "5px 10px",
        maxWidth: 150,
        overflow: "hidden",
      }}
    >
      {item("=", "EQUALS")}
      {item(">", "GREATER")}
      {item("<", "LESS")}
      {item("=!", "NOT_EQUALS")}
      {item("=<", "LESS_EQUALS")}
      {item(">=", "GREATER_EQUALS")}
      {item("∈", "CONTAINS")}
    </Box>
  );
};

export default ConditionsPopover;
