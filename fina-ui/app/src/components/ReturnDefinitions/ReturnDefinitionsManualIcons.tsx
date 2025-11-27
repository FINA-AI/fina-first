import { Box } from "@mui/system";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import HorizontalRuleOutlinedIcon from "@mui/icons-material/HorizontalRuleOutlined";
import React, { memo } from "react";
import { styled } from "@mui/material/styles";

const StyledGridIconBox = styled(Box)({
  width: 28,
  height: 28,
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginLeft: "2px",
});

const ReturnDefinitionsManualIcons = ({ value }: { value: string }) => {
  return (
    <Box paddingX={"20px"}>
      <StyledGridIconBox
        sx={(theme: any) => ({
          backgroundColor: value
            ? theme.palette.mode === "light"
              ? "#ebf5e9"
              : "#079455"
            : theme.palette.mode === "light"
            ? "#f5e9e9"
            : "#B42318",
        })}
      >
        {value ? (
          <DoneOutlinedIcon
            sx={(theme) => ({
              fontSize: "small",
              color: theme.palette.mode === "light" ? "#289E20" : "#ABEFC6",
            })}
          />
        ) : (
          <HorizontalRuleOutlinedIcon
            sx={(theme) => ({
              fontSize: "small",
              color: theme.palette.mode === "light" ? "#ff0600" : "#FEE4E2",
            })}
          />
        )}
      </StyledGridIconBox>
    </Box>
  );
};

export default memo(ReturnDefinitionsManualIcons);
