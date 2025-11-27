import { Box, Grid, Skeleton } from "@mui/material";
import React from "react";
import ConfigListSkeleton from "../Common/ConfigListSkeleton";
import RegionFisSkeleton from "./RegionFisSkeleton";
import RegionPropertiesSkeleton from "./RegionPropertiesSkeleton";
import RegionalStructureTreeSkeleton from "./RegionalStructureTreeSkeleton";
import { styled } from "@mui/material/styles";

const StyledRegionFis = styled(Box)(({ theme }) => ({
  position: "relative",
  height: "100%",
  minWidth: 0,
  minHeight: 0,
  boxSizing: "border-box",
  backgroundColor: theme.palette.paperBackground,
}));

const StyledRegionFi = styled(Box)({
  color: "#2C3644",
  lineHeight: "20px",
  fontWeight: 600,
  fontSize: "13px",
  textTransform: "capitalize",
});

const StyledRegionFisWrapper = styled(Grid)(({ theme }) => ({
  paddingTop: "0px!important",
  backgroundColor: theme.palette.paperBackground,
  height: "100%",
}));

const StyledHeader = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.paperBackground,
  borderTopLeftRadius: "8px",
  height: "100%",
  flexBasis: 0,
  boxSizing: "border-box !important",
}));

const StyledPropertiesWrapper = styled(Box)({
  paddingBottom: 50,
  overflow: "hidden",
  marginTop: 20,
  borderRadius: "8px !important",
  height: "100%",
});

const StyledTreeGrid = styled(Grid)(({ theme }) => ({
  paddingBottom: "53px",
  paddingTop: "0px !important",
  height: "100%",
  backgroundColor: theme.palette.paperBackground,
}));

const StyledStructureListContainer = styled(Grid)(({ theme }) => ({
  borderRight: "1px solid rgba(0, 0, 0, 0.12)",
  backgroundColor: theme.palette.paperBackground,
  height: "100%",
}));

const StyledRootGrid = styled(Grid)(({ theme }) => ({
  height: "100%",
  backgroundColor: theme.palette.paperBackground,
}));

const StyledInnerGrid = styled(Grid)(({ theme }) => ({
  height: "100%",
  backgroundColor: theme.palette.paperBackground,
}));

const RegionalStructureSkeleton = () => {
  return (
    <>
      <StyledStructureListContainer item xs={2}>
        <ConfigListSkeleton />
      </StyledStructureListContainer>
      <StyledRootGrid item xs={10}>
        <StyledInnerGrid container direction={"row"} spacing={2} marginTop={0}>
          <StyledTreeGrid item xs={8}>
            <RegionalStructureTreeSkeleton />
          </StyledTreeGrid>
          <StyledRegionFisWrapper
            item
            xs={4}
            display={"flex"}
            flexDirection={"column"}
          >
            <StyledHeader
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              height={"20px"}
              padding={"20px 12px"}
              boxShadow={"0px 1px 0px #EAEBF0"}
            >
              <StyledRegionFi>
                <Skeleton
                  variant="text"
                  width={"70px"}
                  height={10}
                  animation={"wave"}
                />
              </StyledRegionFi>
              <Skeleton
                variant="text"
                width={"120px"}
                height={20}
                animation={"wave"}
              />
            </StyledHeader>
            <StyledRegionFis
              style={{
                overflow: "hidden",
                paddingBottom: 50,
                filter: "blur(2px)",
              }}
            >
              <RegionFisSkeleton />
            </StyledRegionFis>
            <StyledPropertiesWrapper>
              <RegionPropertiesSkeleton />
            </StyledPropertiesWrapper>
          </StyledRegionFisWrapper>
        </StyledInnerGrid>
      </StyledRootGrid>
    </>
  );
};

export default RegionalStructureSkeleton;
