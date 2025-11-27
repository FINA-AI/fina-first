import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";
import { Box, Divider, Skeleton } from "@mui/material";

const LicenseConfigItemSkeleton = () => {
  const getSkeletonRow = (level) => {
    return (
      <Box display={"flex"} flexDirection={"column"} padding={"8px"}>
        <Box display={"flex"} alignItems={"center"}>
          <Skeleton width={"40%"} height={16} />
          &#160;&#160;&#160;
          <Skeleton variant={"rectangular"} width={16} height={16} />
        </Box>
        <Box display={"flex"} height={20} alignItems={"center"}>
          <Skeleton width={level === 2 ? "80%" : "95%"} height={16} />
          {level === 2 && (
            <>
              &#160;&#160;
              <Divider orientation="vertical" flexItem />
              &#160;&#160;
              <Box display={"flex"} flexDirection={"column"}>
                <Skeleton width={"80px"} height={12} />
              </Box>
            </>
          )}
        </Box>
        <Box display={"flex"} alignItems={"center"}>
          <Skeleton width={level === 2 ? "80%" : "95%"} height={16} />
          {level === 2 && (
            <>
              &#160;&#160;
              <Divider orientation="vertical" flexItem height={16} />
              &#160;&#160;
              <Box display={"flex"} flexDirection={"column"}>
                <Skeleton width={"80px"} height={12} />
              </Box>
            </>
          )}
        </Box>
      </Box>
    );
  };
  const data = [
    {
      id: "root",
      value: getSkeletonRow(1),
      children: [
        {
          id: "1",
          value: getSkeletonRow(2),
        },
        {
          id: "3",
          value: getSkeletonRow(2),
          children: [
            {
              id: "4",
              value: getSkeletonRow(3),
            },
          ],
        },
        {
          id: "5",
          value: getSkeletonRow(2),
        },
      ],
    },
    {
      id: "6",
      value: getSkeletonRow(1),
      children: [],
    },
    {
      id: "7",
      value: getSkeletonRow(1),
      children: [],
    },
    {
      id: "8",
      value: getSkeletonRow(1),
      children: [],
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
    <TreeView
      aria-label="rich object"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={["root", "1", "2", "3", "4", "5", "6", "7", "8"]}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {data.map((item) => {
        return renderTree(item);
      })}
    </TreeView>
  );
};

export default LicenseConfigItemSkeleton;
