import { Box, Divider, Grid, Skeleton } from "@mui/material";
import React from "react";
import { useTheme } from "@mui/material/styles";

const FiPhysicalPersonSkeleton = () => {
  const theme = useTheme();
  const Header = () => {
    return (
      <Box
        display={"flex"}
        height={"72px"}
        paddingLeft={"20px"}
        justifyContent={"space-between"}
      >
        <Box
          width={"100%"}
          display={"flex"}
          alignContent={"center"}
          alignItems={"center"}
          justifyContent={"flex-start"}
        >
          <Skeleton variant="text" width={150} height={40} animation={"wave"} />
          <Divider
            orientation={"vertical"}
            style={{
              marginLeft: 5,
              marginRight: 5,
              height: 40,
            }}
          />
          <Skeleton variant="text" width={80} height={40} animation={"wave"} />
        </Box>
        <Box
          display={"flex"}
          alignContent={"center"}
          alignItems={"center"}
          justifyContent={"space-evenly"}
          paddingRight={"20px"}
          width={"200px"}
        >
          <Skeleton variant="text" width={80} height={40} animation={"wave"} />
          <Skeleton
            variant="circular"
            width={20}
            height={20}
            animation={"wave"}
          />
          <Skeleton
            variant="rectangular"
            width={25}
            height={25}
            animation={"wave"}
          />
        </Box>
      </Box>
    );
  };

  const HeaderItem = () => {
    return (
      <Box
        display={"flex"}
        flex={1}
        height={"66px"}
        alignItems={"center"}
        paddingLeft={"10px"}
        paddingRight={"10px"}
        marginLeft={"10px"}
        marginRight={"10px"}
        style={{
          border: `1px solid ${theme.palette.lightBackgroundColor}`,
          borderRadius: "8px",
        }}
      >
        <Box flex={0}>
          <Skeleton
            variant="rectangular"
            width={40}
            height={40}
            animation={"wave"}
            style={{
              borderRadius: "4px",
            }}
          />
        </Box>

        <Box
          display={"flex"}
          flexDirection={"column"}
          flex={1}
          paddingLeft={"20px"}
        >
          <Skeleton
            variant="text"
            height={20}
            width={"45%"}
            animation={"wave"}
          />
          <Skeleton variant="text" height={20} animation={"wave"} />
        </Box>
      </Box>
    );
  };

  const HeaderContent = () => {
    return (
      <Box display={"flex"} justifyContent={"space-between"}>
        <HeaderItem />
        <HeaderItem />
        <HeaderItem />
      </Box>
    );
  };

  const BodyItem = () => {
    return (
      <Box
        display={"flex"}
        flexDirection={"column"}
        paddingLeft={"20px"}
        paddingRight={"20px"}
        // marginTop={"20px"}
      >
        <Box display={"flex"} justifyContent={"space-between"}>
          <Skeleton
            variant="text"
            height={30}
            width={"150px"}
            animation={"wave"}
          />
          <Box width={"50px"} display={"flex"} justifyContent={"space-evenly"}>
            <Skeleton
              variant="rectangular"
              width={15}
              height={15}
              animation={"wave"}
            />
            <Skeleton
              variant="rectangular"
              width={15}
              height={15}
              animation={"wave"}
            />
          </Box>
        </Box>
        <Box
          display={"flex"}
          width={"100%"}
          paddingTop={"15px"}
          paddingBottom={"15px"}
        >
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Box display={"flex"} flexDirection={"column"}>
                <Skeleton
                  variant="text"
                  height={15}
                  width={"50%"}
                  animation={"wave"}
                />
                <Skeleton
                  variant="text"
                  height={20}
                  animation={"wave"}
                  width={"75%"}
                />
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box display={"flex"} flexDirection={"column"}>
                <Skeleton
                  variant="text"
                  height={15}
                  width={"50%"}
                  animation={"wave"}
                />
                <Skeleton
                  variant="text"
                  height={20}
                  animation={"wave"}
                  width={"75%"}
                />
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box display={"flex"} flexDirection={"column"}>
                <Skeleton
                  variant="text"
                  height={15}
                  width={"50%"}
                  animation={"wave"}
                />
                <Skeleton
                  variant="text"
                  height={20}
                  animation={"wave"}
                  width={"75%"}
                />
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box display={"flex"} flexDirection={"column"}>
                <Skeleton
                  variant="text"
                  height={15}
                  width={"50%"}
                  animation={"wave"}
                />
                <Skeleton
                  variant="text"
                  height={20}
                  animation={"wave"}
                  width={"75%"}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Skeleton variant="text" width={90} height={20} animation={"wave"} />
      </Box>
    );
  };

  return (
    <div
      style={{
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Box
        display={"flex"}
        flexDirection={"column"}
        style={{
          overflow: "hidden",
        }}
      >
        <Header />
        <HeaderContent />
        <div
          style={{
            paddingTop: 10,
            paddingBottom: 10,
          }}
        >
          <Divider />
        </div>
        <BodyItem />
        <BodyItem />
        <BodyItem />
        <BodyItem />
        <BodyItem />
      </Box>
    </div>
  );
};

export default FiPhysicalPersonSkeleton;
