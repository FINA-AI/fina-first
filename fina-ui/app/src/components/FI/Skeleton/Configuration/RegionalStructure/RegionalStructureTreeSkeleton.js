import { Box, Skeleton } from "@mui/material";
import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import { useTheme } from "@mui/material/styles";

const RegionalStructureTreeSkeleton = () => {
  const theme = useTheme();
  const getSkeletonRow = () => {
    return (
      <Box display={"flex"} flexDirection={"column"} padding={"8px"}>
        <Box display={"flex"} alignItems={"center"}>
          <Skeleton variant={"rectangular"} width={16} height={16} />
          <Skeleton variant={"text"} width={"80%"} height={16} />
        </Box>
      </Box>
    );
  };
  const data = [
    {
      id: "root",
      value: getSkeletonRow(),
      children: [],
    },
    {
      id: "2",
      value: getSkeletonRow(),
      children: [
        {
          id: "1",
          value: getSkeletonRow(),
        },
        {
          id: "3",
          value: getSkeletonRow(),
          children: [
            {
              id: "4",
              value: getSkeletonRow(),
            },
            {
              id: "5",
              value: getSkeletonRow(),
            },
          ],
        },
        {
          id: "6",
          value: getSkeletonRow(),
          children: [],
        },
      ],
    },
  ];

  const renderTree = (item) => (
    <TreeItem key={item.id} nodeId={item.id} label={item.value}>
      {Array.isArray(item.children)
        ? item.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );
  return (
    <Box height={"100%"}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        padding={"10px"}
        borderBottom={"1px solid rgba(0, 0, 0, 0.12)"}
        style={{
          backgroundColor: theme.palette.paperBackground,
          borderTopRightRadius: "8px",
        }}
      >
        <Skeleton
          variant="rectangular"
          width={"80%"}
          height={32}
          animation={"wave"}
        />
        <Box display={"flex"} alignItems={"center"}>
          <Skeleton
            variant="text"
            width={"60px"}
            height={15}
            animation={"wave"}
          />
          &#160;
          <Skeleton
            variant="rectangular"
            width={15}
            height={15}
            animation={"wave"}
          />
        </Box>
      </Box>
      <Box
        height={"100%"}
        style={{
          backgroundColor: theme.palette.paperBackground,
          borderBottomRightRadius: "8px",
        }}
      >
        <TreeView
          aria-label="rich object"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpanded={["root", "1", "2", "3", "4", "5", "6"]}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          {data.map((item) => {
            return renderTree(item);
          })}
        </TreeView>
      </Box>
    </Box>
  );
};

export default RegionalStructureTreeSkeleton;
