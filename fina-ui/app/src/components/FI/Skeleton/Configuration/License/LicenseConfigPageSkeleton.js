import PropTypes from "prop-types";
import React from "react";
import { Box, Divider, Grid, Skeleton } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledContainer = styled(Box)(({ theme }) => ({
  padding: 8,
  border: theme.palette.borderColor,
  borderRadius: 4,
  margin: 16,
  marginTop: 0,
}));

const StyledBottomMarginSkeleton = styled(Skeleton)({
  marginBottom: 6,
  display: "flex",
  alignItems: "center",
});

const LicenseConfigPageSkeleton = ({ cardNumber }) => {
  const Item = () => {
    return (
      <Grid item xl={4} md={6} sm={6} xs={12}>
        <StyledContainer
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
        >
          <Box display={"flex"} justifyContent={"space-between"}>
            <Skeleton width={"100px"} height={20} animation={"wave"} />

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

          <Divider sx={{ marginTop: "8px", marginBottom: "8px" }} />
          <StyledBottomMarginSkeleton
            variant="text"
            width={"35%"}
            height={15}
            animation={"wave"}
          />
          <StyledBottomMarginSkeleton
            variant="text"
            width={"100%"}
            animation={"wave"}
            height={15}
          />
          <StyledBottomMarginSkeleton
            variant="text"
            width={"100%"}
            height={15}
            animation={"wave"}
          />
          <StyledBottomMarginSkeleton
            variant="text"
            width={"100%"}
            height={15}
            animation={"wave"}
          />
          <StyledBottomMarginSkeleton
            variant="text"
            width={"100%"}
            height={15}
            animation={"wave"}
          />
          <StyledBottomMarginSkeleton
            variant="text"
            width={"100%"}
            height={15}
            animation={"wave"}
          />
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

LicenseConfigPageSkeleton.propTypes = {
  cardNumber: PropTypes.number,
};

export default LicenseConfigPageSkeleton;
