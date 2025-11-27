import { Box, Skeleton } from "@mui/material";
import React from "react";
import GridTable from "../../../../common/Grid/GridTable";
import { styled } from "@mui/material/styles";

const StyledRegionBody = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.paperBackground,
  borderBottomLeftRadius: "8px",
  borderBottomRightRadius: "8px",
}));

const StyledHeader = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.paperBackground,
  borderTopLeftRadius: "8px",
  height: "100%",
  flexBasis: 0,
  boxSizing: "border-box !important",
}));

const RegionFisSkeleton = () => {
  return (
    <Box width={"100%"}>
      <StyledHeader
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        height={"20px"}
        padding={"20px 12px"}
      >
        <Skeleton
          variant="rectangular"
          width={"100%"}
          height={30}
          animation={"wave"}
        />
      </StyledHeader>
      <StyledRegionBody overflow={"auto"} display={"block"} height={"100%"}>
        <GridTable
          columns={Array(3).fill({
            headerName: (
              <Skeleton
                variant="text"
                width={40}
                height={15}
                animation={"wave"}
              />
            ),
            field: "skeleton",
            minWidth: 60,
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
      </StyledRegionBody>
    </Box>
  );
};

export default RegionFisSkeleton;
