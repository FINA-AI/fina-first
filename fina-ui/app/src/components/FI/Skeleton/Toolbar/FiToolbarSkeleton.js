import { Box } from "@mui/material";
import { Skeleton } from "@mui/material";

const FiToolbarSkeleton = () => {
  return (
    <Box
      display={"flex"}
      flex={1}
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      <Box display={"flex"} flex={2}>
        <Skeleton
          variant="rectangular"
          width={40}
          height={25}
          style={{ marginRight: "30px", marginLeft: 10 }}
        />
        <Skeleton
          variant="rectangular"
          width={40}
          height={25}
          style={{ marginRight: "30px" }}
        />
        <Skeleton
          variant="rectangular"
          width={40}
          height={25}
          style={{ marginRight: "30px" }}
        />
        <Skeleton
          variant="rectangular"
          width={40}
          height={25}
          style={{ marginRight: "30px" }}
        />
        <Skeleton
          variant="rectangular"
          width={40}
          height={25}
          style={{ marginRight: "30px" }}
        />
        <Skeleton
          variant="rectangular"
          width={40}
          height={25}
          style={{ marginRight: "30px" }}
        />
        <Skeleton
          variant="rectangular"
          width={40}
          height={25}
          style={{ marginRight: "30px" }}
        />
        <Skeleton
          variant="rectangular"
          width={40}
          height={25}
          style={{ marginRight: "30px" }}
        />
        <Skeleton
          variant="rectangular"
          width={40}
          height={25}
          style={{ marginRight: "30px" }}
        />
        <Skeleton
          variant="rectangular"
          width={40}
          height={25}
          style={{ marginRight: "30px" }}
        />
        <Skeleton
          variant="rectangular"
          width={40}
          height={25}
          style={{ marginRight: "30px" }}
        />
        <Skeleton
          variant="rectangular"
          width={40}
          height={25}
          style={{ marginRight: "30px" }}
        />
      </Box>
      <Box
        display={"flex"}
        flex={1}
        justifyContent={"flex-end"}
        style={{ overflow: "hidden" }}
      >
        <Skeleton
          variant="circular"
          width={32}
          height={32}
          style={{ marginRight: 8 }}
        />
        <Skeleton
          variant="circular"
          width={32}
          height={32}
          style={{ marginRight: 8 }}
        />
        <Skeleton
          variant="circular"
          width={32}
          height={32}
          style={{ marginRight: 8 }}
        />
        <Skeleton
          variant="rectangular"
          width={190}
          height={32}
          style={{ borderRadius: "8px", marginRight: 8 }}
        />
        <Skeleton
          variant="rectangular"
          width={140}
          height={32}
          style={{ borderRadius: "8px" }}
        />
      </Box>
    </Box>
  );
};

export default FiToolbarSkeleton;
