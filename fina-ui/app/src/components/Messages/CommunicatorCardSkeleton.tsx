import { Box, Skeleton, Stack } from "@mui/material";
import React from "react";
import Divider from "@mui/material/Divider";

import { styled } from "@mui/material/styles";

const StyledCardLayout = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: "14px",
  backgroundColor: theme.palette.mode === "light" ? "#F9F9F9" : "#37474F",
  borderRadius: "8px",
  height: 160,
}));

const StyledWidgets = styled(Skeleton)(() => ({
  minWidth: 50,
  marginLeft: 10,
  height: 15,
}));

const StyledText = styled(Skeleton)(() => ({
  width: "100%",
  height: 15,
}));

const StyledIcons = styled(Skeleton)(() => ({
  width: 30,
  height: 30,
}));

const CommunicatorCardSkeleton = () => {
  const CardItem = () => {
    return (
      <StyledCardLayout>
        <Box display={"flex"} justifyContent={"space-between"}>
          <Box width={"100%"}>
            <Skeleton width={"30%"} />
          </Box>
          <Box display={"flex"}>
            <Skeleton width={50} style={{ marginRight: 5 }} />
            <Skeleton width={20} />
          </Box>
        </Box>
        <Box width={"100%"}>
          <Skeleton width={"20%"} />
        </Box>
        <Box width={"100%"} mb={"5px"}>
          <StyledText />
          <StyledText />
          <StyledText />
          <StyledText />
          <StyledText />
        </Box>
        <Divider />
        <Box display={"flex"} justifyContent={"space-between"} pt={"5px"}>
          <Box display={"flex"} alignItems={"center"}>
            <StyledIcons variant={"circular"} />
            <StyledWidgets />
          </Box>
          <Box display={"flex"} alignItems={"center"}>
            <StyledIcons variant={"circular"} />
            <StyledWidgets />
          </Box>
          <Box display={"flex"} alignItems={"center"}>
            <StyledIcons variant={"circular"} />
            <StyledWidgets />
          </Box>
        </Box>
      </StyledCardLayout>
    );
  };

  return (
    <Box padding={"10px"}>
      <Stack spacing={2}>
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <CardItem key={i} />
          ))}
      </Stack>
    </Box>
  );
};

export default CommunicatorCardSkeleton;
