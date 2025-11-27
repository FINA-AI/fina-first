import { Box, Grid } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import React from "react";

const MiSkeleton = () => {
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      paddingLeft={"20px"}
      paddingRight={"20px"}
      overflow={"hidden"}
    >
      <Box
        display={"flex"}
        width={"100%"}
        paddingTop={"15px"}
        paddingBottom={"15px"}
      >
        <Grid container spacing={1}>
          {Array.from({ length: 110 }).map((_, index) => (
            <Grid item xs={2} key={index} style={{ margin: "10px 0px" }}>
              <Skeleton
                variant="text"
                height={20}
                width={"85%"}
                animation={"wave"}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default MiSkeleton;
