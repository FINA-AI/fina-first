import { Box } from "@mui/system";
import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";

type CatalogHistoryStatus = "created" | "updated" | "deleted" | "restored";

interface CatalogHistoryStatusCellProps {
  status: CatalogHistoryStatus;
}

const StyledStatusBox = styled(Box)<{ status: CatalogHistoryStatus }>(
  ({ status, theme }) => {
    const getStatusColors = () => {
      const isDark = theme.palette.mode === "dark";

      switch (status) {
        case "created":
          return {
            color: isDark ? "#D1FADF" : "#079455",
            background: isDark ? "#079455" : "#ECFDF3",
          };
        case "updated":
          return {
            color: isDark ? "#A9D1FF" : "#0086C9",
            background: isDark ? "#0086C9" : "#EFF8FF",
          };
        case "deleted":
          return {
            color: isDark ? "#FEE4E2" : "#FF4128",
            background: isDark ? "#B42318" : "#FFECE9",
          };
        case "restored":
          return {
            color: isDark ? "#FEF0C7" : "#DC6803",
            background: isDark ? "#DC6803" : "#FFFAEB",
          };
        default:
          return {
            color: isDark ? "#D1FADF" : "#079455",
            background: isDark ? "#079455" : "#ECFDF3",
          };
      }
    };

    const colors = getStatusColors();

    return {
      fontWeight: 500,
      fontSize: "12px",
      lineHeight: "16px",
      display: "flex",
      alignItems: "center",
      color: colors.color,
      background: colors.background,
      justifyContent: "center",
      borderRadius: "2px",
      minWidth: "70px",
      maxWidth: "80px",
      padding: "4px 8px",
    };
  }
);

const CatalogHistoryStatusCell: React.FC<CatalogHistoryStatusCellProps> = ({
  status,
}) => {
  const { t } = useTranslation();

  const getStatusLabel = () => {
    switch (status) {
      case "created":
        return t("created");
      case "updated":
        return t("updated");
      case "deleted":
        return t("deleted");
      case "restored":
        return t("restored");
      default:
        return t("updated");
    }
  };

  return <StyledStatusBox status={status}>{getStatusLabel()}</StyledStatusBox>;
};

export default CatalogHistoryStatusCell;
