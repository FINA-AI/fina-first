import { Box, Divider, Grid, Skeleton } from "@mui/material";
import React from "react";
import FiInputSkeleton from "../GeneralInfo/FiInputSkeleton";

const ShareholderSkeleton = () => {
  const Header = () => {
    return (
      <Box display={"flex"} height={"72px"} justifyContent={"space-between"}>
        <Box
          width={"100%"}
          display={"flex"}
          alignContent={"center"}
          alignItems={"center"}
          justifyContent={"flex-start"}
        >
          <Skeleton variant="text" width={150} height={40} animation={"wave"} />
          &#160;&#160;
          <Skeleton variant="text" width={80} height={40} animation={"wave"} />
          &#160;&#160;
          <Skeleton variant="text" width={200} height={40} animation={"wave"} />
          &#160;&#160;
        </Box>
        <Box
          display={"flex"}
          alignContent={"center"}
          alignItems={"center"}
          justifyContent={"space-evenly"}
          paddingRight={"20px"}
          width={"200px"}
        >
          <Skeleton variant="text" width={80} height={40} animation={"wave"} />
          <Skeleton
            variant="circular"
            width={20}
            height={20}
            animation={"wave"}
          />
          <Skeleton
            variant="rectangular"
            width={25}
            height={25}
            animation={"wave"}
          />
        </Box>
      </Box>
    );
  };

  const HeaderContent = () => {
    return (
      <Box>
        <Grid
          container
          wrap={"wrap"}
          direction={"row"}
          spacing={1}
          style={{ width: "100%" }}
        >
          <Grid item>
            <FiInputSkeleton />
          </Grid>
          <Grid item>
            <FiInputSkeleton />
          </Grid>
          <Grid item>
            <FiInputSkeleton />
          </Grid>
          <Grid item>
            <FiInputSkeleton />
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      sx={{
        padding: "16px",
        overflow: "hidden",
      }}
    >
      <Header />
      <HeaderContent />
      &#160;&#160;
      <Divider />
      &#160;&#160;
      <Skeleton variant="text" height={40} animation={"wave"} width={"100%"} />
    </Box>
  );
};

export default ShareholderSkeleton;
