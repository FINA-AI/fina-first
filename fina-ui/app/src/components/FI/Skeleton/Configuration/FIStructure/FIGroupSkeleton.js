import { Box } from "@mui/material";
import React from "react";
import FIGroupHeaderSkeleton from "./FIGroupHeaderSkeleton";
import FIGroupGridSkeleton from "./FIGroupGridSkeleton";

const FIGroupSkeleton = () => {
  return (
    <Box height={"100%"}>
      <FIGroupHeaderSkeleton />
      <FIGroupGridSkeleton />
    </Box>
  );
};

export default FIGroupSkeleton;
