import { Box, Skeleton } from "@mui/material";
import React from "react";
import GridTable from "../../../../common/Grid/GridTable";

const RegionPropertiesSkeleton = () => {
  return (
    <Box
      width={"100%"}
      sx={{
        borderBottomLeftRadius: "8px",
        borderBottomRightRadius: "8px",
      }}
    >
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        height={"20px"}
        padding={"20px 12px"}
        boxShadow={"0px 1px 0px #EAEBF0"}
      >
        <Skeleton
          variant="text"
          width={"100px"}
          height={20}
          animation={"wave"}
        />
        <Box display={"flex"} alignItems={"center"}>
          <Skeleton
            variant="rectangular"
            width={15}
            height={15}
            animation={"wave"}
          />
          &#160; &#160;
          <Skeleton
            variant="rectangular"
            width={15}
            height={15}
            animation={"wave"}
          />
          &#160; &#160;
          <Skeleton
            variant="rectangular"
            width={15}
            height={15}
            animation={"wave"}
          />
        </Box>
      </Box>
      <Box overflow={"auto"} display={"block"} height={"100%"}>
        <GridTable
          columns={Array(2).fill({
            headerName: (
              <Skeleton
                variant="text"
                width={40}
                height={15}
                animation={"wave"}
              />
            ),
            field: "skeleton",
            minWidth: 100,
            fixed: true,
          })}
          rows={[]}
          setRows={() => {}}
          selectedRows={[]}
          setSelectedRows={() => {}}
          copyCellFunction={false}
          rowOnClick={() => {}}
          loading={true}
        />
      </Box>
    </Box>
  );
};

export default RegionPropertiesSkeleton;
