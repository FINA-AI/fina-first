import { Box, Divider, Skeleton } from "@mui/material";
import React from "react";

interface FIListSkeletonProps {
  listItemCount: number;
}

const FIListSkeleton: React.FC<FIListSkeletonProps> = ({
  listItemCount = 7,
}) => {
  const Item = () => {
    return (
      <div>
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          height={"92px"}
          paddingLeft={"12px"}
        >
          <Box display={"flex"} alignItems={"center"}>
            <Skeleton
              variant="circular"
              width={"13px"}
              height={"13px"}
              style={{ borderRadius: "50px", marginRight: "8px" }}
            />
            <Skeleton
              variant="text"
              width={"30%"}
              style={{ borderRadius: "8px" }}
            />
          </Box>
          <Skeleton
            variant="text"
            width={"90%"}
            style={{ borderRadius: "8px" }}
          />
          <Skeleton
            variant="text"
            width={"90%"}
            style={{ borderRadius: "8px" }}
          />
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

export default FIListSkeleton;
