import React from "react";
import { Box, Typography } from "@mui/material";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import { keyframes } from "@mui/system";
import { useTheme } from "@mui/material/styles";

const pulseAnimation = keyframes`
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
    100% {
        transform: scale(1);
    }
`;

const EmptyUserPlaceholder = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        textAlign: "center",
        p: 4,
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(145deg, #3c4d68 0%, #3c4d68 100%);"
              : "linear-gradient(145deg, #f0f4f8 0%, #e2e8f0 100%)",
          boxShadow:
            theme.palette.mode === "dark"
              ? "10px 10px 20px #3c4d68, -10px -10px 20px #344258;"
              : "10px 10px 20px #d1d9e6, -10px -10px 20px #ffffff",
          animation: `${pulseAnimation} 3s ease-in-out infinite`,
        }}
      >
        <PersonOutlineRoundedIcon
          sx={{
            fontSize: 120,
            color: (theme as any).palette.iconColor,
            opacity: 0.6,
          }}
        />
      </Box>

      <Box sx={{ mt: 4, maxWidth: 400 }}>
        <Typography
          variant="h4"
          sx={{
            color:
              theme.palette.mode === "dark"
                ? "#ABBACE !important"
                : "#98A7BC !important",
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "scale(1.02)",
            },
          }}
        >
          User Not Selected
        </Typography>
      </Box>
    </Box>
  );
};

export default EmptyUserPlaceholder;
