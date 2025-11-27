import { useTheme } from "@mui/material/styles";
import React from "react";

const iconsThemeColor = (theme: any) => {
  return theme.palette.mode === "dark"
    ? {
        primary: "#5D789A",
        secondary: "#2D3747",
        success: "#ABEFC6",
        warning: "#FDB022",
        error: "#F97066",
        backgroundColor: {
          primary: "#3c4d68",
        },
      }
    : {
        primary: "#AEB8CB",
        secondary: "#FFFFFF",
        success: "#289E20",
        warning: "#FF8D00",
        error: "#FF4128",
        backgroundColor: {
          primary: "#F0F4FF",
        },
      };
};

export const UserCheckedIcon = () => {
  const theme = useTheme();

  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_675_1090)">
        <rect
          width="24"
          height="24"
          transform="translate(0 0.339355)"
          fill={iconsThemeColor(theme).backgroundColor.primary}
        />
        <path
          d="M12 19.3394L11.14 18.4794C9.96 17.2994 9.97 15.3794 11.16 14.2194L12 13.3994C11.61 13.3594 11.32 13.3394 11 13.3394C8.33 13.3394 3 14.6794 3 17.3394V19.3394H12ZM11 11.3394C13.21 11.3394 15 9.54936 15 7.33936C15 5.12936 13.21 3.33936 11 3.33936C8.79 3.33936 7 5.12936 7 7.33936C7 9.54936 8.79 11.3394 11 11.3394Z"
          fill={iconsThemeColor(theme).primary}
          fillOpacity="1"
        />
        <path
          d="M16.18 19.1193C15.79 19.5093 15.15 19.5093 14.76 19.1193L12.69 17.0293C12.31 16.6393 12.31 16.0193 12.69 15.6393L12.7 15.6293C13.09 15.2393 13.72 15.2393 14.1 15.6293L15.47 16.9993L19.9 12.5393C20.29 12.1493 20.92 12.1493 21.31 12.5393L21.32 12.5493C21.7 12.9393 21.7 13.5593 21.32 13.9393L16.18 19.1193Z"
          fill={iconsThemeColor(theme).primary}
          fillOpacity="1"
        />
      </g>
      <defs>
        <clipPath id="clip0_675_1090">
          <rect
            width="24"
            height="24"
            fill="white"
            transform="translate(0 0.339355)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};
