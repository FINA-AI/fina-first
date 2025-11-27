import { Box, Skeleton } from "@mui/material";
import React from "react";

const FIGroupHeaderSkeleton = () => {
  return (
    <Box
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
      padding={"10px"}
      borderBottom={"1px solid rgba(0, 0, 0, 0.12)"}
      sx={{ borderTopRightRadius: "8px" }}
    >
      <Skeleton
        variant="rectangular"
        width={"60%"}
        height={32}
        animation={"wave"}
      />
      <Box display={"flex"} alignItems={"center"}>
        <Skeleton
          variant="text"
          width={"100px"}
          height={32}
          animation={"wave"}
        />
        &#160;
      </Box>
    </Box>
  );
};

export default FIGroupHeaderSkeleton;
