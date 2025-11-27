import { Box } from "@mui/system";
import { Skeleton } from "@mui/material";
import React from "react";

const ToolbarListSearchSkeleton = () => {
  return (
    <Box
      display={"flex"}
      height={"55px"}
      alignItems={"center"}
      borderBottom={"1px solid #EAEBF0"}
      padding={"0px 12px"}
      justifyContent={"space-between"}
    >
      <Box display={"flex"} alignItems={"center"} width={"100%"}>
        <Skeleton
          variant="circular"
          width={"18px"}
          height={"18px"}
          style={{ marginRight: "4px" }}
        />
        <Skeleton
          variant="text"
          width={"30%"}
          style={{ borderRadius: "8px" }}
        />
      </Box>
      <Skeleton variant="circular" width={"20px"} height={"20px"} />
    </Box>
  );
};

export default ToolbarListSearchSkeleton;
