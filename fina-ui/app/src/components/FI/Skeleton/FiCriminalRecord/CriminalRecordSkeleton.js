import { Box, Grid, Skeleton, Stack } from "@mui/material";
import React from "react";
import { styled } from "@mui/material/styles";

const StyledCardLayout = styled(Box)({
  display: "flex",
  flexDirection: "column",
  paddingLeft: "20px",
  paddingRight: "20px",
  paddingBottom: "45px",
  padding: "14px",
  borderRadius: "8px",
});

const CriminalRecordSkeleton = () => {
  const CardItem = () => {
    return (
      <StyledCardLayout>
        <Grid container item xs={12} spacing={2}>
          <Grid item xs={3}>
            <Skeleton
              variant="text"
              height={20}
              width={"25%"}
              animation={"wave"}
            />
            <Skeleton
              variant="text"
              height={20}
              width={"8%"}
              animation={"wave"}
            />
          </Grid>
          <Grid item xs={3}>
            <Stack spacing={4}>
              <Box>
                <Skeleton
                  variant="text"
                  height={20}
                  width={"30%"}
                  animation={"wave"}
                />
                <Skeleton
                  variant="text"
                  height={20}
                  width={"10%"}
                  animation={"wave"}
                />
              </Box>
              <Box>
                <Skeleton
                  variant="text"
                  height={20}
                  width={"30%"}
                  animation={"wave"}
                />
                <Skeleton
                  variant="text"
                  height={20}
                  width={"10%"}
                  animation={"wave"}
                />
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={3}>
            <Stack spacing={4}>
              <Box>
                <Skeleton
                  variant="text"
                  height={20}
                  width={"30%"}
                  animation={"wave"}
                />
                <Skeleton
                  variant="text"
                  height={20}
                  width={"20%"}
                  animation={"wave"}
                />
              </Box>
              <Box>
                <Skeleton
                  variant="text"
                  height={20}
                  width={"30%"}
                  animation={"wave"}
                />
                <Skeleton
                  variant="text"
                  height={20}
                  width={"20%"}
                  animation={"wave"}
                />
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={2}>
            <Stack spacing={4}>
              <Box>
                <Skeleton
                  variant="text"
                  height={20}
                  width={"40%"}
                  animation={"wave"}
                />
                <Skeleton
                  variant="text"
                  height={20}
                  width={"30%"}
                  animation={"wave"}
                />
              </Box>
              <Box>
                <Skeleton
                  variant="text"
                  height={20}
                  width={"40%"}
                  animation={"wave"}
                />
                <Skeleton
                  variant="text"
                  height={20}
                  width={"30%"}
                  animation={"wave"}
                />
              </Box>
            </Stack>
          </Grid>
          <Grid
            item
            xs={1}
            display={"flex"}
            justifyContent={"space-evenly"}
            flexDirection={"row"}
          >
            <Skeleton
              variant="rectangular"
              height="15%"
              width="15%"
              animation="wave"
            />
            <Skeleton
              variant="rectangular"
              height="15%"
              width="15%"
              animation="wave"
            />
          </Grid>
        </Grid>
      </StyledCardLayout>
    );
  };

  return (
    <Box padding={"10px"}>
      <Stack spacing={2}>
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <CardItem key={i} />
          ))}
      </Stack>
    </Box>
  );
};

export default CriminalRecordSkeleton;
