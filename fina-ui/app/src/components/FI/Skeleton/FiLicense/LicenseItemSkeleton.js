import PropTypes from "prop-types";
import { Box, Skeleton } from "@mui/material";
import React from "react";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";

const StyledHeaderItem = styled(Box)(({ theme }) => ({
  display: "flex",
  flex: 1,
  height: "64px",
  alignItems: "center",
  paddingLeft: "10px",
  paddingRight: "10px",
  marginLeft: "10px",
  marginRight: "10px",
  border: theme.palette.borderColor,
  borderRadius: "8px",
}));

const StyledBody = styled(Box)(() => ({
  height: "100%",
  padding: "0px 12px",
  minWidth: "0px",
}));

const StyledHeaderFooter = styled(Box)(({ theme }) => ({
  borderBottom: theme.palette.borderColor,
}));

const StyledBodyHeaderSeparator = styled(Box)(({ theme }) => ({
  borderBottom: `1px dashed ${
    theme.palette.mode === "dark" ? "#8d9299" : "#EAEBF0"
  }`,
  display: "flex",
  padding: "12px 0px",
}));
const LicenseItemSkeleton = () => {
  const HeaderItem = () => {
    return (
      <StyledHeaderItem>
        <Box flex={0}>
          <Skeleton
            variant="rectangular"
            width={40}
            height={40}
            style={{
              borderRadius: "4px",
            }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            paddingLeft: "20px",
          }}
        >
          <Skeleton variant="text" height={20} width={"45%"} />
          <Skeleton variant="text" height={20} />
        </Box>
      </StyledHeaderItem>
    );
  };

  const BankOperation = () => {
    return (
      <Box width={"100%"} height={"100%"}>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          width={"100%"}
          alignItems={"center"}
        >
          <Box display={"flex"} width={"100%"}>
            <Skeleton variant={"text"} width={"10%"} />
            <Skeleton
              variant={"text"}
              width={"10%"}
              style={{ marginLeft: "8px" }}
            />
          </Box>
          <Box display={"flex"} width={"100%"} justifyContent={"flex-end"}>
            <Skeleton variant={"circular"} width={"20px"} height={"20px"} />
          </Box>
        </Box>
        <Box marginTop={"10px"}>{BankOperationComment()}</Box>
      </Box>
    );
  };

  const BankOperationComment = () => {
    return (
      <Box display={"flex"} alignItems={"center"} flexDirection={"column"}>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          width={"100%"}
        >
          <Box display={"flex"} width={"100%"} flexDirection={"column"}>
            <Skeleton variant={"text"} width={"85%"} height={"12px"} />
            <Skeleton variant={"text"} width={"85%"} height={"12px"} />
            <Skeleton variant={"text"} width={"85%"} height={"12px"} />
            <Box width={"85%"} justifyContent={"flex-end"}>
              <Skeleton variant={"text"} width={"100px"} height={"15px"} />
            </Box>
          </Box>
          <Box display={"flex"} flexDirection={"column"} height={"50px"}>
            <Skeleton
              variant={"text"}
              width={"100px"}
              height={"12px"}
              style={{ marginLeft: "40px" }}
            />
            <Skeleton
              variant={"text"}
              width={"100px"}
              height={"12px"}
              style={{ marginLeft: "40px" }}
            />
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box>
      <Box
        sx={{
          height: "100%",
          overflow: "hidden",
          padding: "12px",
        }}
      >
        <Grid container spacing={1} display={"flex"}>
          <Grid item xs={12}>
            <Skeleton variant={"text"} width={"10%"} />
          </Grid>
          <Grid item xs={12} paddingTop={"0px !important"}>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              width={"100%"}
              alignItems={"center"}
            >
              <Box display={"flex"} width={"100%"} alignItems={"center"}>
                <Skeleton variant={"text"} width={"30%"} />
                <Skeleton
                  variant={"text"}
                  width={"10%"}
                  style={{ marginRight: "4px", marginLeft: "20px" }}
                />
                <Skeleton variant={"circular"} width={"20px"} height={"20px"} />
              </Box>
              <Box
                display={"flex"}
                width={"100%"}
                justifyContent={"flex-end"}
                alignItems={"center"}
              >
                <Skeleton variant={"text"} width={"40px"} />
                <Skeleton
                  variant={"text"}
                  width={"5px"}
                  style={{ margin: "0px 4px" }}
                />
                <Skeleton
                  variant={"text"}
                  width={"40px"}
                  style={{ marginRight: "4px" }}
                />
                <Skeleton variant={"circular"} width={"20px"} height={"20px"} />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} padding={"0px !important"}>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              padding={"20px 0px"}
            >
              {HeaderItem()}
              {HeaderItem()}
              {HeaderItem()}
            </Box>
          </Grid>
        </Grid>
        <StyledHeaderFooter />
        <StyledBodyHeaderSeparator>
          <Skeleton variant={"circular"} width={"28px"} height={"28px"} />{" "}
          <Skeleton
            variant={"text"}
            width={"10%"}
            style={{ marginLeft: "8px" }}
          />
        </StyledBodyHeaderSeparator>
        <Box padding={"12px 0px"} display={"flex"}>
          <Skeleton variant={"circular"} width={"28px"} height={"28px"} />
          <Skeleton
            variant={"text"}
            width={"30%"}
            style={{ marginLeft: "8px" }}
          />
        </Box>
      </Box>
      <StyledBody>
        {BankOperation()}
        {BankOperation()}
        {BankOperation()}
        {BankOperation()}
        {BankOperation()}
        {BankOperation()}
      </StyledBody>
    </Box>
  );
};

LicenseItemSkeleton.propTypes = {
  listItemCount: PropTypes.number,
};

export default LicenseItemSkeleton;
