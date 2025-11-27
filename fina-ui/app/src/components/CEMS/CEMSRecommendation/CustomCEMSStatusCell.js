import { Box, Typography } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import Tooltip from "../../common/Tooltip/Tooltip";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";

const getStatusBackground = (val, darkMode) => {
  switch (val) {
    case "IN_PROGRESS":
      return darkMode ? "#079455" : "#E9F5E9";
    case "HALF_REALIZED":
      return darkMode ? "#079455" : "#E9F5E9";
    case "COMPLETED_OUT_OF_DATE":
      return darkMode ? "#DC6803" : "#FFF4E5";
    case "COMPLETED":
      return darkMode ? "#079455" : "#E9F5E9";
    case "NOT_COMPLETED":
      return darkMode ? "#B42318" : "#FFECE9";
    case "DISMISSED_BY_CHAIRMAN":
      return darkMode ? "#DC6803" : "#FFF4E5";
    case "DISMISSED_BY_BOARD":
      return darkMode ? "#DC6803" : "#FFF4E5";
    case "DISMISSED_BY_COMMITTEE":
      return darkMode ? "#DC6803" : "#FFF4E5";
    case "COURT_CASE":
      return darkMode ? "#B42318" : "#FFECE9";
    case "POSTPONED":
      return darkMode ? "#DC6803" : "#FFF4E5";
  }
};

const getStatusColor = (val, darkMode) => {
  switch (val) {
    case "IN_PROGRESS":
      return darkMode ? "#ABEFC6" : "#289E20";
    case "HALF_REALIZED":
      return darkMode ? "#ABEFC6" : "#289E20";
    case "COMPLETED_OUT_OF_DATE":
      return darkMode ? "#FEF0C7" : "#FD6B0A";
    case "COMPLETED":
      return darkMode ? "#ABEFC6" : "#289E20";
    case "NOT_COMPLETED":
      return darkMode ? "#FEE4E2" : "#FF4128";
    case "DISMISSED_BY_CHAIRMAN":
      return darkMode ? "#FEF0C7" : "#FD6B0A";
    case "DISMISSED_BY_BOARD":
      return darkMode ? "#FEF0C7" : "#FD6B0A";
    case "DISMISSED_BY_COMMITTEE":
      return darkMode ? "#FEF0C7" : "#FD6B0A";
    case "COURT_CASE":
      return darkMode ? "#FEE4E2" : "#FF4128";
    case "POSTPONED":
      return darkMode ? "#FEF0C7" : "#FD6B0A";
  }
};

const StyledStatusBox = styled(Box)(({ theme, val }) => ({
  backgroundColor: getStatusBackground(val, theme.palette.mode === "dark"),
  maxWidth: 220,
  minWidth: 220,
  display: "flex",
  justifyContent: "center",
  padding: "5px 10px",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
}));

const StyledStatusText = styled(Typography)(({ theme, val }) => ({
  maxWidth: 220,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  color: getStatusColor(val, theme.palette.mode === "dark"),
}));

const CustomCEMSStatusCell = ({ val }) => {
  const { t } = useTranslation();

  return (
    <Tooltip title={t(val)}>
      <StyledStatusBox val={val}>
        <StyledStatusText val={val} fontSize={12}>
          {t(val)}
        </StyledStatusText>
      </StyledStatusBox>
    </Tooltip>
  );
};

CustomCEMSStatusCell.propTypes = {
  val: PropTypes.string,
};

export default CustomCEMSStatusCell;
