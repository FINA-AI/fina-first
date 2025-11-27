import { Grid } from "@mui/material";
import ConfigListSkeleton from "../Common/ConfigListSkeleton";
import React from "react";
import FIGroupSkeleton from "./FIGroupSkeleton";

const FIStructureSkeleton = () => {
  return (
    <Grid
      container
      direction={"row"}
      sx={{
        borderTopRightRadius: "8px",
        height: "100%",
      }}
    >
      <Grid
        item
        xs={2}
        height={"100%"}
        borderRight={"1px solid rgba(0, 0, 0, 0.12)"}
      >
        <ConfigListSkeleton />
      </Grid>
      <Grid item xs={10} height={"100%"}>
        <FIGroupSkeleton />
      </Grid>
    </Grid>
  );
};

export default FIStructureSkeleton;
