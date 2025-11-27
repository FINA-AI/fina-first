import { useTheme } from "@mui/material/styles";
import React from "react";
import { iconsThemeColor } from "./commonStyles";

export const InactiveFinaUser = () => {
  const theme = useTheme();

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_14235_615155)">
        <path
          d="M10 10C11.6575 10 13 8.6575 13 7C13 5.3425 11.6575 4 10 4C8.3425 4 7 5.3425 7 7C7 8.6575 8.3425 10 10 10ZM10 11.5C7.9975 11.5 4 12.505 4 14.5V15.25C4 15.6625 4.3375 16 4.75 16H15.25C15.6625 16 16 15.6625 16 15.25V14.5C16 12.505 12.0025 11.5 10 11.5Z"
          fill={iconsThemeColor(theme).primary}
        />
      </g>
      <rect x="1.4" y="9.4" width="9.2" height="9.2" rx="4.6" fill="white" />
      <rect
        x="1.4"
        y="9.4"
        width="9.2"
        height="9.2"
        rx="4.6"
        fill={iconsThemeColor(theme).secondary}
      />
      <rect
        x="1.4"
        y="9.4"
        width="9.2"
        height="9.2"
        rx="4.6"
        stroke={iconsThemeColor(theme).error}
        strokeWidth="0.8"
      />
      <g clipPath="url(#clip1_14235_615155)">
        <path
          d="M5.66667 11.6673V15.3907L4.04 13.764C3.91 13.634 3.69667 13.634 3.56667 13.764C3.43667 13.894 3.43667 14.104 3.56667 14.234L5.76334 16.4307C5.89334 16.5607 6.10334 16.5607 6.23334 16.4307L8.43 14.234C8.56 14.104 8.56 13.894 8.43 13.764C8.3 13.634 8.09 13.634 7.96 13.764L6.33334 15.3907V11.6673C6.33334 11.484 6.18334 11.334 6 11.334C5.81667 11.334 5.66667 11.484 5.66667 11.6673Z"
          fill={iconsThemeColor(theme).error}
        />
      </g>
      <defs>
        <clipPath id="clip0_14235_615155">
          <rect
            width="18"
            height="18"
            fill="white"
            transform="translate(1 1)"
          />
        </clipPath>
        <clipPath id="clip1_14235_615155">
          <rect
            width="8"
            height="8"
            fill="white"
            transform="translate(2 10.001)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};
