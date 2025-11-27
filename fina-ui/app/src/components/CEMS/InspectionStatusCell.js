import { Box } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import Tooltip from "../common/Tooltip/Tooltip";
import { styled } from "@mui/material/styles";

const getBorderColor = (type) => {
  switch (type) {
    case "order":
      return "1px solid #FF8D00";
    case "decisrecommendationion":
      return "1px solid #289E20";
    case "sanction":
      return "1px solid #FF4128";
    default:
      return "1px solid #289E20";
  }
};

const getBackgroundColor = (type) => {
  switch (type) {
    case "order":
      return "#FFF4E5";
    case "recommendation":
      return "rgba(40, 158, 32, 0.1)";
    case "sanction":
      return "#EAEBF0";
    default:
      return "#EAEBF0";
  }
};
const getColor = (type) => {
  switch (type) {
    case "order":
      return "#FD6B0A";
    case "recommendation":
      return "#289E20";
    case "sanction":
      return "#FF4128";
    default:
      return "#289E20";
  }
};

const StyledStatusBox = styled(Box)(
  ({ theme, borderColor, backgroundColor, color }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: theme.palette.mode === "light" ? "#FFF" : "#2D3747",
    border: borderColor,
    borderRadius: 4,
    padding: "0px 10px",
    "&:hover": {
      background: theme.palette.mode === "light" ? backgroundColor : "#1F2532",
      border: borderColor,
      color: color,
    },
  })
);

const StyleTextBox = styled(Box)(({ color }) => ({
  fontSize: "12px",
  fontWeight: 500,
  marginLeft: "2px",
  marginRight: "2px",
  color: color,
}));

const StyledTooltipContent = styled(Box)({
  padding: "4px",
  maxWidth: 200,
  maxHeight: 200,
  overflow: "auto",
  "&::-webkit-scrollbar-thumb": {
    background: "#8695B1",
  },
  "&::-webkit-scrollbar": {
    backgroundColor: "#EAEBF0",
  },
});

const StyledTooltipItem = styled(Box)({
  padding: "4px",
  fontWeight: 400,
  fontSize: "11px",
  color: "#FFFFFF",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  textTransform: "capitalize",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.1)",
  },
});

const InspectionStatusCell = ({ type, list }) => {
  const { t } = useTranslation();

  const getLabel = () => {
    return t(type);
  };

  const GetPopover = () => {
    if (list.length === 0) return "";

    const label = getLabel();
    const groupData = () => {
      const counts = {};

      list.forEach(function (x) {
        counts[x.value] = (counts[x.value] || 0) + 1;
      });

      return counts;
    };

    const groupedData = groupData();

    return (
      <StyledTooltipContent
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {Object.keys(groupedData).map(function (keyName, keyIndex) {
          return (
            <StyledTooltipItem key={keyIndex}>
              {groupedData[keyName] + " " + label + " - " + t(keyName)}
            </StyledTooltipItem>
          );
        })}
      </StyledTooltipContent>
    );
  };

  return (
    <Tooltip title={GetPopover()} style={{ maxWidth: 200 }}>
      <StyledStatusBox
        borderColor={getBorderColor(type)}
        backgroundColor={getBackgroundColor(type)}
        color={getColor(type)}
        onClick={(e) => e.stopPropagation()}
      >
        <StyleTextBox color={getColor(type)}> {list.length} </StyleTextBox>
        <StyleTextBox color={getColor(type)}>{getLabel()}</StyleTextBox>
      </StyledStatusBox>
    </Tooltip>
  );
};

InspectionStatusCell.propTypes = {
  type: PropTypes.string,
  list: PropTypes.array,
};
export default InspectionStatusCell;
