import { Box, Skeleton } from "@mui/material";

const UserFiTabsSkeleton = () => {
  return (
    <Box display={"flex"} flex={2}>
      {[...Array(10)].map((_, index) => (
        <Skeleton
          key={index}
          variant="rectangular"
          width={40}
          height={25}
          style={{ marginRight: "30px" }}
        />
      ))}
    </Box>
  );
};

export default UserFiTabsSkeleton;
