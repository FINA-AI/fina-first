import { Box, Skeleton } from "@mui/material";
import React from "react";
import { styled } from "@mui/material/styles";

const StyledContainer = styled(Box)(({ theme }) => ({
  border: theme.palette.borderColor,
  borderRadius: "4px",
}));

const StyledLogoContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.lightBackgroundColor,
  width: "40px",
  height: "40px",
  borderRadius: "6px",
  color: "rgba(104, 122, 158, 0.8)",
}));

const StyledTitle = styled(Box)({
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: 500,
  fontSize: "12px",
  lineHeight: "16px",
  color: "rgba(44, 54, 68, 0.6)",
});

const StyledText = styled(Box)({
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: "14px",
  lineHeight: "20px",
  color: "#2C3644",
  width: "205px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const FiInputSkeleton = () => {
  return (
    <StyledContainer
      display={"flex"}
      width={"304px"}
      maxWidth={"304px"}
      height={"64px"}
    >
      <Box display={"flex"} flex={1} padding={"12px"} flexDirection={"row"}>
        <StyledLogoContainer
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Skeleton variant="rectangular" />
        </StyledLogoContainer>
        <Box
          display={"flex"}
          flexDirection={"column"}
          flex={1}
          marginLeft={"12px"}
          justifyContent={"space-between"}
        >
          <StyledTitle>
            <Skeleton variant="text" />
          </StyledTitle>

          <StyledText>
            <Skeleton variant="rectangular" />
          </StyledText>
        </Box>
      </Box>
    </StyledContainer>
  );
};

export default FiInputSkeleton;
