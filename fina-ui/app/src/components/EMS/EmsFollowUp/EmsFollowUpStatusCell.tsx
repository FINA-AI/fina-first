import React from "react";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

interface EmsFollowUpStatusCellProps {
  value: string;
}

const StyledRoot = styled(Box)({
  borderRadius: 4,
  width: 150,
  textAlign: "center",
  padding: "4px 5px",

  "& .MuiTypography-root": {
    lineBreak: "anywhere",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontSize: 12,
    lineHeight: "16px",
    fontWeight: 500,
  },
});

const EmsFollowUpStatusCell: React.FC<EmsFollowUpStatusCellProps> = ({
  value,
}) => {
  const { t } = useTranslation();

  const getBgColor = () => {
    switch (value) {
      case "IN_PROGRESS":
        return "yellow";
      case "COMPLETED":
        return "lightGreen";
      case "UNFULFILLED":
        return "red";
      case "PARTIALLY_COMPLETED":
        return "orange";
      default:
        return "";
    }
  };

  return (
    <StyledRoot
      style={{
        background: getBgColor(),
      }}
    >
      <Typography sx={{ color: "#2D3747" }}>{t(value)}</Typography>
    </StyledRoot>
  );
};

export default EmsFollowUpStatusCell;
