import React from "react";
import { Skeleton } from "@mui/material";
import { Box } from "@mui/system";

const SkeletonRow = () => (
  <Box
    style={{
      display: "flex",
      flexWrap: "nowrap",
      marginBottom: "10px",
      color: "rgb(0 0 0 / 5%)",
    }}
  >
    <Skeleton variant="circular" width={40} height={40} />
    <Skeleton
      variant="text"
      width={"40%"}
      sx={{ fontSize: "1rem", margin: "0 20px" }}
    />
    <Skeleton variant="text" width={"40%"} sx={{ fontSize: "1rem" }} />
  </Box>
);

const MdtTreeSkeleton = () => {
  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        marginLeft: "20px",
        marginTop: "10px",
      }}
    >
      {[...Array(15)].map((_, index) => (
        <SkeletonRow key={index} />
      ))}
    </Box>
  );
};

export default MdtTreeSkeleton;
