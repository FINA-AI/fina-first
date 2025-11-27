import { IconButton } from "@mui/material";
import { styled } from "@mui/system";
import React from "react";

interface MTDComparisonConditionsProps {
  condition: string;
  color?: string;
  background?: string;
  hoverBackground?: string;
}

const StyledIconBtn = styled(IconButton)(({ theme }) => ({
  width: "24px",
  height: "24px",
  background: theme.palette.primary.main,
  borderRadius: "50px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0px 10px",
  color: "#FFFFFF",
  fontSize: 13,
  whiteSpace: "nowrap",
  "&:hover": {
    backgroundColor: theme.palette.buttons.primary.hover,
    opacity: 0.7,
  },
}));

const MTDComparisonConditions: React.FC<MTDComparisonConditionsProps> = ({
  condition,
}) => {
  const getConditionIcon = () => {
    switch (condition) {
      case "EQUALS":
        return "=";
      case "NOT_EQUALS":
        return "=!";
      case "GREATER":
        return ">";
      case "GREATER_EQUALS":
        return ">=";
      case "LESS":
        return "<";
      case "LESS_EQUALS":
        return "=<";
      default:
        return "=";
      case "CONTAINS":
        return "∈";
    }
  };

  return (
    <StyledIconBtn data-testid={condition}>{getConditionIcon()}</StyledIconBtn>
  );
};

export default MTDComparisonConditions;
