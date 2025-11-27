import { Box } from "@mui/system";
import React from "react";
import { useTranslation } from "react-i18next";
import { styled, useTheme } from "@mui/material/styles";

const StyledRoot = styled(Box)({
  lineBreak: "anywhere",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  borderRadius: 2,
  width: 100,
  textAlign: "center",
  padding: "4px 12px !important",
  fontSize: 12,
  lineHeight: "16px",
  fontWeight: 500,
});

const RCSModalStatusCell = ({ value }: { value: string }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const getBgColor = () => {
    switch (value) {
      case "STATUS_ONDEMAND":
        return theme.palette.mode === "dark" ? "#DC6803" : "#FFF4E5";
      case "STATUS_SCHEDULED":
        return theme.palette.mode === "dark" ? "#3c4d68" : "#EAEBF0";
      case "STATUS_ERROR":
        return theme.palette.mode === "dark" ? "#B42318" : "#f5e9e9";
      case "STATUS_DONE":
        return theme.palette.mode === "dark" ? "#079455" : "#E9F5E9";
      case "STATUS_PROCESSING":
        return theme.palette.mode === "dark" ? "#B2DDFF" : "#29dfff";
    }
  };
  const getColor = () => {
    switch (value) {
      case "STATUS_ONDEMAND":
        return theme.palette.mode === "dark" ? "#FEF0C7" : "#FF8D00";
      case "STATUS_SCHEDULED":
        return theme.palette.mode === "dark" ? "#8695b1" : "#596D89";
      case "STATUS_ERROR":
        return theme.palette.mode === "dark" ? "#FEE4E2" : "#FF4128";
      case "STATUS_DONE":
        return theme.palette.mode === "dark" ? "#ABEFC6" : "#289E20";
      case "STATUS_PROCESSING":
        return theme.palette.mode === "dark" ? "#1849A9" : "#FFF";
    }
  };

  return (
    <StyledRoot
      style={{
        background: getBgColor(),
        color: getColor(),
      }}
    >
      {t(value)}
    </StyledRoot>
  );
};

export default RCSModalStatusCell;
