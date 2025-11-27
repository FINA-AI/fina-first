import { Box } from "@mui/system";
import { Skeleton } from "@mui/material";
import React from "react";

const MiniPagingSkeleton = () => {
  return (
    <Box
      display={"flex"}
      height={"56px"}
      alignItems={"center"}
      padding={"0px 12px"}
      justifyContent={"space-between"}
    >
      <Box
        width={"32px"}
        height={"32px"}
        border={"1px solid rgba(0, 0, 0, 0.12)"}
        borderRadius={"4px"}
        alignItems={"center"}
        justifyContent={"center"}
        display={"flex"}
      >
        <Skeleton variant="text" width={"10px"} height={"30px"} />
      </Box>
      <Box
        width={"32px"}
        height={"32px"}
        border={"1px solid rgba(0, 0, 0, 0.12)"}
        borderRadius={"4px"}
        margin={"0px 4px"}
        alignItems={"center"}
        justifyContent={"center"}
        display={"flex"}
      >
        <Skeleton variant="text" width={"10px"} height={"30px"} />
      </Box>
      <Box
        width={"32px"}
        height={"32px"}
        border={"1px solid rgba(0, 0, 0, 0.12)"}
        borderRadius={"4px"}
        alignItems={"center"}
        justifyContent={"center"}
        display={"flex"}
      >
        <Skeleton variant="text" width={"10px"} height={"30px"} />
      </Box>
    </Box>
  );
};

export default MiniPagingSkeleton;
