import { Box, Grid, Skeleton } from "@mui/material";
import React from "react";

const UserAndGroupSkeleton = () => {
  return (
    <Box display={"flex"} flex={1} flexDirection={"column"} width={"100%"}>
      <Grid
        container
        width={"100%"}
        display={"flex"}
        justifyContent={"center"}
        style={{
          overflow: "hidden !important",
        }}
      >
        {Array(10)
          .fill(0)
          .map((v, index) => {
            return (
              <Grid
                container
                key={index + "" + v}
                width={"100%"}
                sx={{
                  padding: "0px 10px",
                }}
              >
                <Grid item xs={1}>
                  <Skeleton
                    height={40}
                    sx={{
                      minWidth: "20px",
                      marginRight: "10px",
                    }}
                  />
                </Grid>
                <Grid item xs={10}>
                  <Skeleton height={40} />
                </Grid>
                <Grid item xs={1}>
                  <Skeleton
                    height={40}
                    sx={{
                      minWidth: "20px",
                      marginLeft: "10px",
                    }}
                  />
                </Grid>
              </Grid>
            );
          })}
      </Grid>
    </Box>
  );
};

export default UserAndGroupSkeleton;
