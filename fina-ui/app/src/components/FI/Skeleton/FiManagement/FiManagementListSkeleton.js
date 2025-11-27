import { Box, Divider, Skeleton } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";

const FiManagementListSkeleton = ({ listItemCount = 1 }) => {
  const Item = () => {
    return (
      <div>
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          height={"92px"}
          paddingLeft={"20px"}
          paddingRight={"20px"}
        >
          <Skeleton
            variant="text"
            width={"70%"}
            height={40}
            animation={"wave"}
          />
          <Skeleton variant="text" width={"100%"} animation={"wave"} />
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

FiManagementListSkeleton.propTypes = {
  listItemCount: PropTypes.number,
};

export default FiManagementListSkeleton;
