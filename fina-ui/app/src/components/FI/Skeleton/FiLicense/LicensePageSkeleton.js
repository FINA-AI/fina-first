import { Box, Divider, Grid, Skeleton } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";

const StyledContainer = styled(Box)(({ theme }) => ({
  padding: 8,
  border: theme.palette.borderColor,
  borderRadius: 4,
  margin: 10,
  marginTop: 0,
}));

const StyledBottomMargin = styled(Skeleton)({
  marginBottom: "6px",
  display: "flex",
  alignItems: "center",
});

const LicensePageSkeleton = ({ cardNumber }) => {
  const Item = () => {
    return (
      <Grid marginTop={2} item xs={12} sm={6} md={4}>
        <StyledContainer
          minHeight={"200px"}
          display={"flex"}
          flexDirection={"column"}
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
            </Box>
          </Box>
          <Box>
            <Skeleton
              variant="text"
              width={"35%"}
              height={18}
              animation={"wave"}
              sx={{
                marginTop: "6px",
                display: "flex",
                alignItems: "center",
              }}
            />
            <Divider sx={{ marginTop: "8px", marginBottom: "8px" }} />

            <StyledBottomMargin
              variant="text"
              width={"100%"}
              animation={"wave"}
              height={18}
            />
            <StyledBottomMargin
              variant="text"
              width={"100%"}
              height={18}
              animation={"wave"}
            />
            <StyledBottomMargin
              variant="text"
              width={"100%"}
              height={18}
              animation={"wave"}
            />
            <StyledBottomMargin
              variant="text"
              width={"100%"}
              height={18}
              animation={"wave"}
            />
          </Box>
          <Box display={"flex"} flexDirection={"row-reverse"}>
            <Skeleton
              variant="text"
              width={"20%"}
              height={18}
              animation={"wave"}
              sx={{ marginBottom: "12px", justifyContent: "flex-end" }}
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

LicensePageSkeleton.propTypes = {
  cardNumber: PropTypes.number,
};

export default LicensePageSkeleton;
