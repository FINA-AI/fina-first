import { useTheme } from "@mui/material/styles";
import React from "react";
import { iconsThemeColor } from "./commonStyles";

export const InactiveLockFinaUser = () => {
  const theme = useTheme();

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_14235_615156)">
        <g clipPath="url(#clip1_14235_615156)">
          <path
            d="M10 14C11.6575 14 13 12.6575 13 11C13 9.3425 11.6575 8 10 8C8.3425 8 7 9.3425 7 11C7 12.6575 8.3425 14 10 14ZM10 15.5C7.9975 15.5 4 16.505 4 18.5V19.25C4 19.6625 4.3375 20 4.75 20H15.25C15.6625 20 16 19.6625 16 19.25V18.5C16 16.505 12.0025 15.5 10 15.5Z"
            fill={iconsThemeColor(theme).primary}
          />
        </g>
      </g>
      <rect
        x="1.4"
        y="13.4"
        width="9.2"
        height="9.2"
        rx="4.6"
        fill={iconsThemeColor(theme).secondary}
      />
      <rect
        x="1.4"
        y="13.4"
        width="9.2"
        height="9.2"
        rx="4.6"
        stroke={iconsThemeColor(theme).error}
        strokeWidth="0.8"
      />
      <g clipPath="url(#clip2_14235_615156)">
        <path
          d="M5.66667 15.6673V19.3907L4.04 17.764C3.91 17.634 3.69667 17.634 3.56667 17.764C3.43667 17.894 3.43667 18.104 3.56667 18.234L5.76334 20.4307C5.89334 20.5607 6.10334 20.5607 6.23334 20.4307L8.43 18.234C8.56 18.104 8.56 17.894 8.43 17.764C8.3 17.634 8.09 17.634 7.96 17.764L6.33334 19.3907V15.6673C6.33334 15.484 6.18334 15.334 6 15.334C5.81667 15.334 5.66667 15.484 5.66667 15.6673Z"
          fill={iconsThemeColor(theme).error}
        />
      </g>
      <rect
        width="6"
        height="5"
        transform="translate(15 5)"
        fill={iconsThemeColor(theme).secondary}
      />
      <g clipPath="url(#clip3_14235_615156)">
        <path
          d="M21 4H20.5V3C20.5 1.62 19.38 0.5 18 0.5C16.62 0.5 15.5 1.62 15.5 3V4H15C14.45 4 14 4.45 14 5V10C14 10.55 14.45 11 15 11H21C21.55 11 22 10.55 22 10V5C22 4.45 21.55 4 21 4ZM18 8.5C17.45 8.5 17 8.05 17 7.5C17 6.95 17.45 6.5 18 6.5C18.55 6.5 19 6.95 19 7.5C19 8.05 18.55 8.5 18 8.5ZM16.5 4V3C16.5 2.17 17.17 1.5 18 1.5C18.83 1.5 19.5 2.17 19.5 3V4H16.5Z"
          fill={iconsThemeColor(theme).warning}
        />
      </g>
      <defs>
        <clipPath id="clip0_14235_615156">
          <rect
            width="18"
            height="18"
            fill="white"
            transform="translate(1 5)"
          />
        </clipPath>
        <clipPath id="clip1_14235_615156">
          <rect
            width="18"
            height="18"
            fill="white"
            transform="translate(1 5)"
          />
        </clipPath>
        <clipPath id="clip2_14235_615156">
          <rect
            width="8"
            height="8"
            fill="white"
            transform="translate(2 14.001)"
          />
        </clipPath>
        <clipPath id="clip3_14235_615156">
          <rect width="12" height="12" fill="white" transform="translate(12)" />
        </clipPath>
      </defs>
    </svg>
  );
};
