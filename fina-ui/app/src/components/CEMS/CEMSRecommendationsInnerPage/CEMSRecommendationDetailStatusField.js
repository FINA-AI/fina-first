import { ToggleButton, Typography } from "@mui/material";
import Tooltip from "../../common/Tooltip/Tooltip";
import { Box } from "@mui/system";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { CEMSStatusList } from "../CEMSConstants";
import { styled, useTheme } from "@mui/material/styles";

const StyledFieldContainer = styled(Box)({
  margin: "5px 10px 5px 0px",
  width: "100%",
  overflowX: "auto",
});

const StyledFieldset = styled("fieldset")(({ theme }) => ({
  border: `${theme.palette.borderColor} !important`,
  borderRadius: 4,
  paddingBottom: 0,
  paddingTop: 0,
}));

const StyledItemName = styled(Typography)(({ theme, isEditMode }) => ({
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
  margin: 5,
  borderRadius: "30px !important",
  border: `${theme.palette.borderColor} !important`,
  cursor: !isEditMode && "auto",
  boxSizing: "border-box",
}));

const StyledToggleButtonInnerBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  maxWidth: "170px",
});

const StyledButtonIconSpan = styled("span")({
  height: "10px",
  width: "10px",
  borderRadius: "50px",
  marginBottom: "2px",
  marginRight: "8px",
});

const StyledToggleButtonText = styled(Typography)({
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
  maxWidth: "180px",
  width: "100%",
  fontSize: 12,
});

const CEMSRecommendationDetailStatusField = ({
  data,
  setData,
  onChangeEmsRecommendationDetails,
  isEditMode,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

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
    <StyledFieldContainer>
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
                    setData({ ...data, status: value });
                    onChangeEmsRecommendationDetails({
                      status: value,
                    });
                  }
                }}
                style={{
                  backgroundColor:
                    data.status === item.value
                      ? getStatusColor(item.value)
                      : theme.palette.mode === "light"
                      ? "#FFF"
                      : "#2D3747",
                }}
              >
                <Tooltip title={item.label}>
                  <StyledToggleButtonInnerBox
                    style={{
                      color:
                        theme.palette.mode === "light"
                          ? data.status === item.value
                            ? "#FFF"
                            : "#707C93"
                          : data.status === item.value
                          ? "#F5F7FA"
                          : "#ABBACE",
                    }}
                  >
                    {data.status === item.value ? (
                      <CheckRoundedIcon
                        sx={{
                          fontSize: "16px",
                          color: "#FFF",
                          marginRight: "8px",
                        }}
                      />
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
    </StyledFieldContainer>
  );
};

CEMSRecommendationDetailStatusField.propTypes = {
  data: PropTypes.object,
  setData: PropTypes.func,
  emsRecommendationDetails: PropTypes.object,
  onChangeEmsRecommendationDetails: PropTypes.func,
  isEditMode: PropTypes.bool,
};
export default CEMSRecommendationDetailStatusField;
