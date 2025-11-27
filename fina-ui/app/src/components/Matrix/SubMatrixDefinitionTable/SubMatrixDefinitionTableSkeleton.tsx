import React from "react";
import { Box } from "@mui/system";
import { Skeleton } from "@mui/material";

const SubMatrixDefinitionTableSkeleton = () => {
  const DefinitionTableRow = () => (
    <Box
      style={{
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "nowrap",
        marginBottom: "10px",
        color: "rgb(0 0 0 / 5%)",
      }}
    >
      <Skeleton
        variant="text"
        height={"30px"}
        sx={{ margin: "0 20px", flex: 1 }}
      />
      <Skeleton
        variant="text"
        height={"30px"}
        sx={{ margin: "0 20px", flex: 1 }}
      />
      <Skeleton
        variant="text"
        height={"30px"}
        sx={{ margin: "0 20px", flex: 1 }}
      />
      <Skeleton variant="text" sx={{ marginRight: "20px", flex: 1 }} />
    </Box>
  );

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",

        width: "100%",
        marginTop: "15px",
      }}
    >
      {[...Array(20)].map((_, index) => (
        <DefinitionTableRow key={index} />
      ))}
    </Box>
  );
};

export default SubMatrixDefinitionTableSkeleton;
