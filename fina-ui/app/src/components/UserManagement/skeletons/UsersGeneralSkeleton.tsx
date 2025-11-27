import { Box, Divider, Grid, Skeleton } from "@mui/material";
import React from "react";
import { styled } from "@mui/system";

const StyledBox = styled(Box)(() => ({
  padding: 20,
}));

const StyledDivider = styled(Divider)(() => ({
  color: "#EAEBF0",
  height: 1,
  width: "auto",
  marginLeft: 16,
  marginRight: 16,
}));

const UsersGeneralSkeleton = () => {
  return (
    <Box
      sx={{
        position: "relative",
        height: "100%",
        overflow: "auto",
        borderCollapse: "unset !important",
      }}
    >
      <Box
        sx={{
          boxSizing: "border-box",
          height: "100%",
          borderRadius: 8,
        }}
      >
        <StyledBox>
          <Box display={"flex"} justifyContent={"space-between"}>
            <Box
              width={"100%"}
              display={"flex"}
              alignContent={"center"}
              alignItems={"center"}
              justifyContent={"flex-start"}
            >
              <Skeleton
                variant="text"
                width={180}
                height={50}
                animation={"wave"}
              />
            </Box>
            <Box
              display={"flex"}
              alignContent={"center"}
              alignItems={"center"}
              justifyContent={"space-evenly"}
              paddingRight={"20px"}
              width={"300px"}
            >
              <Skeleton
                variant="text"
                width={80}
                height={40}
                animation={"wave"}
              />
              <Skeleton
                variant="circular"
                width={20}
                height={20}
                animation={"wave"}
              />
              <Skeleton
                variant="text"
                width={80}
                height={40}
                animation={"wave"}
              />
            </Box>
          </Box>
          <Grid
            container
            direction={"row"}
            wrap={"wrap"}
            spacing={3}
            paddingTop={"20px"}
            item
            xs={12}
          >
            <Grid item xl={4} md={4} sm={6} xs={12}>
              <Skeleton
                variant="text"
                width={"260px"}
                height={"60px"}
                animation={"wave"}
              />
            </Grid>
            <Grid item xl={4} md={4} sm={6} xs={12}>
              <Skeleton
                variant="text"
                width={"260px"}
                height={"60px"}
                animation={"wave"}
              />
            </Grid>
            <Grid item xl={4} md={4} sm={6} xs={12}>
              <Skeleton
                variant="text"
                width={"260px"}
                height={"60px"}
                animation={"wave"}
              />
            </Grid>
            <Grid item xl={4} md={4} sm={6} xs={12}>
              <Skeleton
                variant="text"
                width={"260px"}
                height={"60px"}
                animation={"wave"}
              />
            </Grid>
            <Grid item xl={4} md={4} sm={6} xs={12}>
              <Skeleton
                variant="text"
                width={"260px"}
                height={"60px"}
                animation={"wave"}
              />
            </Grid>
            <Grid item xl={4} md={4} sm={6} xs={12}>
              <Skeleton
                variant="text"
                width={"260px"}
                height={"60px"}
                animation={"wave"}
              />
            </Grid>
          </Grid>
        </StyledBox>

        <StyledDivider />
        <StyledBox display={"flex"} flexDirection={"column"}>
          <Skeleton variant="text" width={"40px"} animation={"wave"} />

          <Box display={"flex"} gap={3}>
            <Skeleton
              variant="text"
              width={"260px"}
              height={"60px"}
              animation={"wave"}
            />
            <Skeleton
              variant="text"
              width={"260px"}
              height={"60px"}
              animation={"wave"}
            />
          </Box>
        </StyledBox>

        <StyledDivider />

        <StyledBox display={"flex"} flexDirection={"column"}>
          <Box display={"flex"} gap={"10px"}>
            <Skeleton
              variant="text"
              width={"100px"}
              height={"25px"}
              animation={"wave"}
            />
            <Skeleton
              variant="text"
              width={"100px"}
              height={"25px"}
              animation={"wave"}
            />
            <Skeleton
              variant="text"
              width={"100px"}
              height={"25px"}
              animation={"wave"}
            />
          </Box>
        </StyledBox>

        <StyledDivider />

        <Box padding={"14px"}>
          <Skeleton variant="text" width={"40px"} animation={"wave"} />
          <Grid
            sx={{
              paddingTop: "10px",
            }}
            container
            item
            xs={12}
          >
            {Array(6)
              .fill(0)
              .map((group, i) => (
                <Box marginRight={"10px"} key={i}>
                  <Skeleton
                    variant="text"
                    width={"280px"}
                    height={"100px"}
                    animation={"wave"}
                  />
                </Box>
              ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default UsersGeneralSkeleton;
