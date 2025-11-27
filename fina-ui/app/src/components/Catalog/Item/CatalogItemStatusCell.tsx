import { Box } from "@mui/system";
import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";

interface CatalogItemStatusCellProps {
  value: boolean;
}

const StyledStatusBox = styled(Box)<{ value: boolean }>(({ value, theme }) => ({
  fontWeight: 500,
  fontSize: "12px",
  lineHeight: "16px",
  display: "flex",
  alignItems: "center",
  color:
    theme.palette.mode === "dark"
      ? value
        ? "#FEE4E2"
        : "#ABEFC6"
      : value
      ? "#FF4128"
      : "#289E20",
  background:
    theme.palette.mode === "dark"
      ? value
        ? "#B42318"
        : "#079455"
      : value
      ? "#FFECE9"
      : "#E9F5E9",
  justifyContent: "center",
  borderRadius: "2px",
  maxWidth: "60px",
  padding: "4px",
}));

const CatalogItemStatusCell: React.FC<CatalogItemStatusCellProps> = ({
  value,
}) => {
  const { t } = useTranslation();

  return (
    <StyledStatusBox value={value}>
      {value ? t("deleted") : t("active")}
    </StyledStatusBox>
  );
};

export default CatalogItemStatusCell;
