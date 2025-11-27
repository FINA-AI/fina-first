import { Box, Divider, Skeleton } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";

const ListSkeleton = ({ listItemCount = 1 }) => {
  const Item = () => {
    return (
      <div>
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          height={"92px"}
          paddingLeft={"20px"}
        >
          <Skeleton variant="text" width={"70%"} animation={"wave"} />
          <Skeleton
            variant="text"
            width={"50%"}
            height={30}
            animation={"wave"}
          />
          <Skeleton variant="text" width={"90%"} animation={"wave"} />
        </Box>
        <Divider />
      </div>
    );
  };

  return (
    <div>
      {Array(listItemCount)
        .fill(0)
        .map((_, i) => (
          <Item key={i} />
        ))}
    </div>
  );
};

ListSkeleton.propTypes = {
  listItemCount: PropTypes.number,
};

export default ListSkeleton;
