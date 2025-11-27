import { Box, Grid, Skeleton } from "@mui/material";
import React from "react";
import FiInputSkeleton from "./FiInputSkeleton";
import PropTypes from "prop-types";

const FiGeneralInfoSkeleton = () => {
  const Header = () => {
    return (
      <Box
        display={"flex"}
        flexDirection={"row"}
        alignItems={"center"}
        pt={"24px"}
      >
        <Skeleton variant="rectangular" width={200} height={35} />
        <Box
          display={"flex"}
          flex={1}
          justifyContent={"flex-end"}
          alignItems={"center"}
        >
          <Box display={"flex"}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Skeleton variant="rectangular" width={35} height={35} />
              </Grid>
              <Grid item xs={6}>
                <Skeleton variant="rectangular" width={35} height={35} />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    );
  };

  const Item = ({ showHeader }) => {
    Item.propTypes = {
      showHeader: PropTypes.bool,
    };

    return (
      <Box display={"flex"} flex={1} flexDirection={"column"}>
        <Box display={"flex"} flexDirection={"column"}>
          {showHeader && (
            <div style={{ paddingBlock: "10px" }}>
              <Skeleton width={200} variant={"text"} />
            </div>
          )}
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
      </Box>
    );
  };

  return (
    <Box display={"flex"} height={"100%"} width={"100%"}>
      <Box
        display={"flex"}
        flex={1}
        paddingLeft={"24px"}
        paddingRight={"24px"}
        flexDirection={"column"}
        height={"100%"}
        width={"100%"}
      >
        <Header />
        <Box display={"flex"} flex={1} pt={"24px"}>
          <Item />
        </Box>
        <Box display={"flex"} flex={1}>
          <Item showHeader={true} />
        </Box>
        <Box display={"flex"} flex={1}>
          <Item showHeader={true} />
        </Box>
        <Box display={"flex"} flex={1}>
          <Item showHeader={true} />
        </Box>
      </Box>
    </Box>
  );
};
export default FiGeneralInfoSkeleton;
