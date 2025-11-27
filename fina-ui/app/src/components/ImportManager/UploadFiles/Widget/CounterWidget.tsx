import React from "react";
import Typography from "@mui/material/Typography";
import { Box, Link } from "@mui/material";
import { styled } from "@mui/material/styles";

interface CounterWidgetProps {
  count: number;
  subTitle: string;
  direction?: "row" | "row-reverse" | "column" | "column-reverse";
}

const StyledCounter = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "props",
})<{ props: any }>(({ theme, props }) => ({
  fontSize: props.fontSize ? props.fontSize : 100,
  color: theme.palette.primary.main,
  fontWeight: props.fontWeight ? props.fontWeight : "800",
}));

const CounterWidget: React.FC<CounterWidgetProps> = (props) => {
  const { count, subTitle, direction = "row" } = props;

  return (
    <Box
      display={"flex"}
      flex={1}
      flexDirection={direction}
      alignItems={"center"}
      justifyContent={"center"}
      height={"100%"}
    >
      <StyledCounter props={props}>{count}</StyledCounter>
      <Typography
        component={Link}
        variant="subtitle1"
        sx={{
          color: "#6C6D83",
          textDecoration: "none",
          boxShadow: "none",
          cursor: "pointer",
          marginLeft: direction === "row" ? 5 : "inherit",
        }}
      >
        {subTitle}
      </Typography>
    </Box>
  );
};

export default CounterWidget;
