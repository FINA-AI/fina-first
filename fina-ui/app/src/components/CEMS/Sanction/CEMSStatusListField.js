import { useTranslation } from "react-i18next";
import { Box } from "@mui/system";
import { ToggleButton, Typography } from "@mui/material";
import { CEMSStatusList } from "../CEMSConstants";
import Tooltip from "../../common/Tooltip/Tooltip";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";

const StyledFieldset = styled("fieldset")(({ theme }) => ({
  border: `${theme.palette.borderColor} !important`,
  borderRadius: 4,
  paddingBottom: 0,
  paddingTop: 0,
}));

const StyledItemName = styled(Typography, {
  shouldForwardProp: (props) => props !== "isEditMode",
})(({ theme, isEditMode }) => ({
  color:
    theme.palette.mode === "light"
      ? isEditMode
        ? "#434B59"
        : "rgb(44, 54, 68) !important"
      : isEditMode
      ? "rgb(152, 167, 188)"
      : theme.palette.secondaryTextColor,
  fontWeight: 500,
  fontSize: 13,
}));

const StyledToggleButton = styled(ToggleButton)(({ theme, isEditMode }) => ({
  maxWidth: "200px !important",
  width: "100% !important",
  height: "30px !important",
  margin: "5px",
  borderRadius: "30px !important",
  border: `${theme.palette.borderColor} !important`,
  cursor: !isEditMode && "auto",
  boxSizing: "border-box",
}));

const StyledToggleButtonInnerBox = styled(Box, {
  shouldForwardProp: (props) => props !== "activeStatus",
})(({ theme, activeStatus, item }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  maxWidth: "170px",
  color:
    theme.palette.mode === "light"
      ? activeStatus === item.value
        ? "#FFF"
        : "#707C93"
      : activeStatus === item.value
      ? "#F5F7FA"
      : "#ABBACE",
}));

const StyledButtonIconSpan = styled("span")({
  height: 10,
  width: 10,
  borderRadius: 50,
  marginBottom: 2,
  marginRight: 8,
});

const StyledToggleButtonText = styled(Typography)({
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
  maxWidth: "180px",
  width: "100%",
  fontSize: 12,
});

const StyledCheckRoundedIcon = styled(CheckRoundedIcon)({
  fontSize: "16px",
  color: "#FFF",
  marginRight: 8,
});

const CEMSStatusListField = ({ data, onStatusClick, isEditMode }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [activeStatus, setActiveStatus] = useState(data.status);

  useEffect(() => {
    setActiveStatus(data.status);
  }, [isEditMode]);

  const getStatusColor = (val) => {
    switch (val) {
      case "IN_PROGRESS":
        return "#289E20";
      case "HALF_REALIZED":
        return "#289E20";
      case "COMPLETED_OUT_OF_DATE":
        return "#FD6B0A";
      case "COMPLETED":
        return "#289E20";
      case "NOT_COMPLETED":
        return "#FF4128";
      case "DISMISSED_BY_CHAIRMAN":
        return "#FD6B0A";
      case "DISMISSED_BY_BOARD":
        return "#FD6B0A";
      case "DISMISSED_BY_COMMITTEE":
        return "#FD6B0A";
      case "COURT_CASE":
        return "#FF4128";
      case "POSTPONED":
        return "#FD6B0A";
    }
  };

  return (
    <Box sx={{ margin: "5px 10px 5px 0px", width: "100%", overflowX: "auto" }}>
      <StyledFieldset disabled={!isEditMode}>
        <legend>
          <StyledItemName isEditMode={isEditMode}>
            {t("executionStatus")}
          </StyledItemName>
        </legend>
        <Box>
          {CEMSStatusList().map((item, index) => {
            return (
              <StyledToggleButton
                isEditMode={isEditMode}
                key={index}
                value={item.value}
                onChange={(event, value) => {
                  if (isEditMode) {
                    setActiveStatus(value);
                    onStatusClick({
                      key: value,
                      value: item.label,
                    });
                  }
                }}
                style={{
                  backgroundColor:
                    activeStatus === item.value
                      ? getStatusColor(item.value)
                      : theme.palette.mode === "light"
                      ? "#FFF"
                      : "#2D3747",
                }}
              >
                <Tooltip title={item.label}>
                  <StyledToggleButtonInnerBox
                    activeStatus={activeStatus}
                    item={item}
                  >
                    {activeStatus === item.value ? (
                      <StyledCheckRoundedIcon />
                    ) : (
                      <StyledButtonIconSpan
                        style={{
                          backgroundColor: getStatusColor(item.value),
                        }}
                      />
                    )}
                    <StyledToggleButtonText>
                      {t(item.value)}
                    </StyledToggleButtonText>
                  </StyledToggleButtonInnerBox>
                </Tooltip>
              </StyledToggleButton>
            );
          })}
        </Box>
      </StyledFieldset>
    </Box>
  );
};

CEMSStatusListField.propTypes = {
  data: PropTypes.object,
  onStatusClick: PropTypes.func,
  isEditMode: PropTypes.bool,
};
export default CEMSStatusListField;
