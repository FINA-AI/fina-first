import { Box, Paper, Skeleton } from "@mui/material";
import Grid from "@mui/material/Grid";
import React from "react";
import ListSkeleton from "../../FI/Skeleton/ListSkeleton/ListSkeleton";
import UsersGeneralSkeleton from "./UsersGeneralSkeleton";
import { styled } from "@mui/system";

const StyledGridContainer = styled(Grid)(({ theme }: any) => ({
  marginTop: 0,
  paddingTop: 0,
  position: "relative",
  overflow: "hidden",
  borderRadius: theme.rounded.smallRadius,
}));

const StyledGridItem = styled(Grid)(() => ({
  paddingTop: 0,
  height: "100%",
}));
const StyledPaper = styled(Paper)(({ theme }: any) => ({
  borderRadius: theme.rounded.smallRadius,
  width: "100%",
  height: "100%",
  boxShadow: "none",
}));

const UserManagerItemSkeleton = () => {
  return (
    <Box
      overflow={"hidden"}
      height={"100%"}
      display={"flex"}
      flexDirection={"column"}
    >
      <div>
        <Skeleton variant="text" width={"10%"} animation={"wave"} />
      </div>
      <Box flex={1} display={"flex"} mt={"15px"} mb={"15px"} gap={4}>
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <Skeleton
              key={i}
              variant="text"
              width={100}
              height={25}
              animation={"wave"}
            />
          ))}
      </Box>
      <StyledGridContainer
        container
        spacing={1}
        height={"100%"}
        direction={"row"}
      >
        <StyledGridItem item xs={3}>
          <StyledPaper>
            <ListSkeleton listItemCount={15} />
          </StyledPaper>
        </StyledGridItem>
        <StyledGridItem item xs={9}>
          <StyledPaper>
            <UsersGeneralSkeleton />
          </StyledPaper>
        </StyledGridItem>
      </StyledGridContainer>
    </Box>
  );
};

export default UserManagerItemSkeleton;
