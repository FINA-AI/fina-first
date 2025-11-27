import { Box, Divider, Grid, Skeleton } from "@mui/material";
import React from "react";
import FiStructureListSkeleton from "./FiStructureListSkeleton";
import { styled } from "@mui/material/styles";

const StyledRow = styled(Box)({
  width: "100%",
  padding: "20px",
  marginLeft: "10px",
  borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
});

const FIMainStructureSkeleton = () => {
  return (
    <Grid container direction={"row"} height={"100%"}>
      <Grid
        item
        xs={2}
        height={"100%"}
        borderRight={"1px solid rgba(0, 0, 0, 0.12)"}
      >
        <FiStructureListSkeleton />
      </Grid>
      <Grid item xs={10}>
        <Box height={"100%"}>
          <Box
            display={"flex"}
            justifyContent={"flex-end"}
            alignItems={"center"}
            padding={"10px"}
            borderBottom={"1px solid rgba(0, 0, 0, 0.12)"}
            sx={{ borderTopRightRadius: "8px" }}
          >
            <Box display={"flex"} alignItems={"center"}>
              <Skeleton
                variant="text"
                width={"100px"}
                height={40}
                animation={"wave"}
              />
              &#160;
            </Box>
          </Box>
          <Box height={"100%"} sx={{ borderTopRightRadius: "8px" }}>
            &#160;
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <StyledRow key={i} display={"flex"} alignItems={"center"}>
                  <Skeleton
                    sx={{ marginRight: "5px", borderRadius: "4px" }}
                    variant="rectangular"
                    width={17}
                    height={17}
                    animation={"wave"}
                  />
                  <Skeleton
                    variant="text"
                    width={"40%"}
                    height={20}
                    animation={"wave"}
                    sx={{ marginLeft: "10px" }}
                  />
                  &#160;
                  <Divider
                    sx={{
                      height: "12px",
                      transform: "rotate(25deg)",
                      margin: "0px 5px",
                    }}
                    orientation={"vertical"}
                    variant={"middle"}
                  />
                  &#160;
                  <Skeleton
                    variant="text"
                    width={"55%"}
                    height={20}
                    animation={"wave"}
                  />
                </StyledRow>
              ))}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default FIMainStructureSkeleton;
