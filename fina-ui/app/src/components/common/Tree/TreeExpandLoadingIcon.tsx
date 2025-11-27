import { Box } from "@mui/system";
import React, { FC } from "react";

interface TreeExpandLoadingIconProps {
  width?: number | string;
  iconStyle?: { [key: string]: number | string };
}

const TreeExpandLoadingIcon: FC<TreeExpandLoadingIconProps> = ({
  width,
  iconStyle,
}) => {
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      style={{
        width: width ? width : 40,
        height: 24,
      }}
    >
      <img
        style={{
          width: iconStyle ? iconStyle.width : 18,
          height: iconStyle ? iconStyle.height : 18,
        }}
        src={process.env.PUBLIC_URL + "/images/treeExpand.gif"}
        alt="fireSpot"
      />
    </Box>
  );
};

export default TreeExpandLoadingIcon;
