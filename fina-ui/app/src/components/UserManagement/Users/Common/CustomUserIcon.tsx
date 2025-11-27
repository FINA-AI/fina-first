import { Box } from "@mui/system";
import React, { ReactElement } from "react";

interface CustomUserIconProps {
  children: ReactElement;
  isSelectedUser: boolean;
}

const CustomUserIcon: React.FC<CustomUserIconProps> = ({
  children,
  isSelectedUser,
}) => {
  return (
    <Box
      sx={{
        color: isSelectedUser ? "#FFF" : "#8695B1",
      }}
    >
      {children}
    </Box>
  );
};

export default CustomUserIcon;
