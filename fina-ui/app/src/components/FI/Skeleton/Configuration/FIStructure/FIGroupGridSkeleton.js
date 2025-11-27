import { Box, Divider, Skeleton } from "@mui/material";
import React from "react";

const FIGroupGridSkeleton = () => {
  return (
    <Box
      height={"100%"}
      sx={{
        borderTopRightRadius: "8px",
      }}
    >
      &#160;
      {Array(8)
        .fill(0)
        .map((_, i) => (
          <Box
            key={i}
            display={"flex"}
            alignItems={"center"}
            sx={{
              width: "100%",
              padding: "20px",
              marginLeft: "10px",
              borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
            }}
          >
            <Skeleton
              variant="text"
              width={"40%"}
              height={20}
              animation={"wave"}
            />
            &#160;
            <Divider
              orientation={"vertical"}
              variant={"middle"}
              sx={{
                height: "12px",
                transform: "rotate(25deg)",
                margin: "0px 5px",
              }}
            />
            &#160;
            <Skeleton
              variant="text"
              width={"55%"}
              height={20}
              animation={"wave"}
            />
          </Box>
        ))}
    </Box>
  );
};
export default FIGroupGridSkeleton;
