import React from "react";
import { Box, Divider, Skeleton } from "@mui/material";

const ConfigListSkeleton = () => {
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
          <Box
            display={"flex"}
            flexDirection={"row"}
            width={"100%"}
            alignItems={"center"}
          >
            <Box display={"flex"} height={"100%"}>
              <Skeleton
                variant="rectangular"
                width={20}
                height={20}
                animation="wave"
                sx={{
                  clipPath:
                    "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                }}
              />
            </Box>
            &#160;&#160;
            <Box width={"100%"}>
              <Skeleton variant="text" width={"70%"} animation={"wave"} />
              <Skeleton variant="text" width={"90%"} animation={"wave"} />
            </Box>
          </Box>
        </Box>
        <Divider />
      </div>
    );
  };
  return (
    <Box width={"100%"}>
      &#160;
      <Box display={"flex"} justifyContent={"space-around"}>
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Box display={"flex"} alignItems={"center"} key={i}>
              <Skeleton
                variant="rectangular"
                width={15}
                height={15}
                animation={"wave"}
              />
              &#160;
              <Skeleton
                variant="text"
                width={"30px"}
                height={15}
                animation={"wave"}
              />
            </Box>
          ))}
      </Box>
      {Array(15)
        .fill(0)
        .map((_, i) => (
          <Item key={i} />
        ))}
    </Box>
  );
};

export default ConfigListSkeleton;
