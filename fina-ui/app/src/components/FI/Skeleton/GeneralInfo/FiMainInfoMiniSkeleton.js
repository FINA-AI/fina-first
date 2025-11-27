import { Box, Grid } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import { Skeleton } from '@mui/material';

const FiMainInfoMiniSkeleton = () => {
  const BoxItem = ({ topItem, bottomItem }) => {
    BoxItem.propTypes = {
      topItem: PropTypes.any,
      bottomItem: PropTypes.any,
    };

    return (
      <Box display={"flex"} flex={1} width={"20%"} p={2}>
        <Grid container direction={"column"} spacing={2}>
          <Grid item>{topItem}</Grid>
          <Grid item>{bottomItem}</Grid>
        </Grid>
      </Box>
    );
  };

  const Item = () => {
    return (
      <Box display={"flex"}>
        <Box display={"flex"} flex={1} flexDirection={"row"}>
          <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
            <Skeleton variant="rectangular" width={35} height={35} />
          </Box>
          <Box
            display={"flex"}
            flexDirection={"column"}
            flex={1}
            ml={2}
            justifyContent={"space-between"}
          >
            <Skeleton variant="rectangular" width={200} height={35} />
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box display={"flex"} flex={1} width={"100%"}>
      <BoxItem
        topItem={
          <Box display={"flex"} alignItems={"center"}>
            <Skeleton variant="rectangular" width={"100%"} height={35} />
          </Box>
        }
        bottomItem={<Item />}
      />
      <BoxItem topItem={<Item />} bottomItem={<Item />} />
      <BoxItem topItem={<Item />} bottomItem={<Item />} />
      <BoxItem topItem={<Item />} bottomItem={<Item />} />
      <BoxItem
        topItem={
          <Box display={"flex"} justifyContent={"flex-end"}>
            <Skeleton variant="rectangular" width={35} height={35} />
          </Box>
        }
        bottomItem={<Skeleton variant="rectangular" width={"100%"} height={35} />}
      />
    </Box>
  );
};

export default FiMainInfoMiniSkeleton;
