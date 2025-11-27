import { useTheme } from "@mui/material/styles";
import React from "react";
import { iconsThemeColor } from "./commonStyles";

export const InactiveLDAPUser = () => {
  const theme = useTheme();

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 7C11 5.3425 9.6575 4 8 4C6.3425 4 5 5.3425 5 7C5 8.6575 6.3425 10 8 10C9.6575 10 11 8.6575 11 7ZM2 14.5V15.25C2 15.6625 2.3375 16 2.75 16H13.25C13.6625 16 14 15.6625 14 15.25V14.5C14 12.505 10.0025 11.5 8 11.5C5.9975 11.5 2 12.505 2 14.5Z"
        fill={iconsThemeColor(theme).primary}
      />
      <path
        d="M12.2 7.25V10.25C12.2 10.6625 12.5375 11 12.95 11C13.3625 11 13.7 10.6625 13.7 10.25V7.25C13.7 6.8375 13.3625 6.5 12.95 6.5C12.5375 6.5 12.2 6.8375 12.2 7.25Z"
        fill={iconsThemeColor(theme).primary}
      />
      <path
        d="M16 9.5H13C12.5875 9.5 12.25 9.8375 12.25 10.25C12.25 10.6625 12.5875 11 13 11H16C16.4125 11 16.75 10.6625 16.75 10.25C16.75 9.8375 16.4125 9.5 16 9.5Z"
        fill={iconsThemeColor(theme).primary}
      />
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
      <g clipPath="url(#clip0_14235_615207)">
        <path
          d="M5.66667 11.6673V15.3907L4.04 13.764C3.91 13.634 3.69667 13.634 3.56667 13.764C3.43667 13.894 3.43667 14.104 3.56667 14.234L5.76333 16.4307C5.89333 16.5607 6.10333 16.5607 6.23333 16.4307L8.43 14.234C8.56 14.104 8.56 13.894 8.43 13.764C8.3 13.634 8.09 13.634 7.96 13.764L6.33333 15.3907V11.6673C6.33333 11.484 6.18333 11.334 6 11.334C5.81667 11.334 5.66667 11.484 5.66667 11.6673Z"
          fill={iconsThemeColor(theme).error}
        />
      </g>
      <defs>
        <clipPath id="clip0_14235_615207">
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
