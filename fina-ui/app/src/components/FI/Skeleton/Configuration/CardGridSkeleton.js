import PropTypes from "prop-types";
import React from "react";
import { Box, Divider, Grid, Skeleton } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledContainer = styled(Box)(({ theme }) => ({
  padding: 8,
  border: `1px solid ${theme.palette.mode === "dark" ? "#4d5c72" : "#EAEBF0"}`,
  borderRadius: 4,
  margin: "16px",
  marginTop: "0px",
  width: "100%",
  display: "flex",
}));

const StyledBottomMarginSkeleton = styled(Skeleton)({
  marginBottom: "6px",
  display: "flex",
  alignItems: "center",
});

const CardGridSkeleton = ({ cardNumber, fiType }) => {
  const Item = () => {
    return (
      <Grid
        item
        xl={fiType ? 3 : 2}
        md={fiType ? 4 : 3}
        sm={6}
        xs={12}
        display={"flex"}
      >
        <StyledContainer
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
        >
          <Box display={"flex"} justifyContent={"space-between"}>
            <Skeleton width={"20px"} height={20} animation={"wave"} />
            <Box display={"flex"}>
              <Skeleton
                variant="rectangular"
                width={16}
                height={15}
                animation={"wave"}
              />
              &#160;
              <Skeleton
                variant="rectangular"
                width={16}
                height={15}
                animation={"wave"}
              />
            </Box>
          </Box>
          <Skeleton
            variant="text"
            width={"100%"}
            animation={"wave"}
            height={15}
          />
          <Divider
            sx={{
              marginTop: "8px",
              marginBottom: "8px",
            }}
          />
          <StyledBottomMarginSkeleton
            variant="text"
            width={"50%"}
            animation={"wave"}
            height={15}
          />
          <Box display={"flex"} alignItems={"center"}>
            {fiType && (
              <>
                <Skeleton variant="circular" width={10} height={10} /> &#160;
              </>
            )}
            <StyledBottomMarginSkeleton
              variant="text"
              width={"80%"}
              height={15}
              animation={"wave"}
            />
          </Box>
          <Box display={"flex"} alignItems={"center"}>
            {fiType && (
              <>
                <Skeleton variant="circular" width={10} height={10} /> &#160;
              </>
            )}
            <StyledBottomMarginSkeleton
              variant="text"
              width={"80%"}
              height={15}
              animation={"wave"}
            />
          </Box>
        </StyledContainer>
      </Grid>
    );
  };
  return (
    <Grid
      container
      item
      xs={12}
      direction={"row"}
      wrap={"wrap"}
      display={"flex"}
    >
      {Array(cardNumber ? cardNumber : 30)
        .fill(0)
        .map((_, i) => (
          <Item key={i} />
        ))}
    </Grid>
  );
};
CardGridSkeleton.propTypes = {
  cardNumber: PropTypes.number,
  fiType: PropTypes.bool,
};
export default CardGridSkeleton;
