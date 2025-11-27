import { useTheme } from "@mui/material/styles";
import React from "react";
import { iconsThemeColor } from "./commonStyles";

export const InactiveLockLDAPUser = () => {
  const theme = useTheme();

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 11C11 9.3425 9.6575 8 8 8C6.3425 8 5 9.3425 5 11C5 12.6575 6.3425 14 8 14C9.6575 14 11 12.6575 11 11ZM2 18.5V19.25C2 19.6625 2.3375 20 2.75 20H13.25C13.6625 20 14 19.6625 14 19.25V18.5C14 16.505 10.0025 15.5 8 15.5C5.9975 15.5 2 16.505 2 18.5Z"
        fill={iconsThemeColor(theme).primary}
      />
      <path
        d="M12.2 11.25V14.25C12.2 14.6625 12.5375 15 12.95 15C13.3625 15 13.7 14.6625 13.7 14.25V11.25C13.7 10.8375 13.3625 10.5 12.95 10.5C12.5375 10.5 12.2 10.8375 12.2 11.25Z"
        fill={iconsThemeColor(theme).primary}
      />
      <path
        d="M16 13.5H13C12.5875 13.5 12.25 13.8375 12.25 14.25C12.25 14.6625 12.5875 15 13 15H16C16.4125 15 16.75 14.6625 16.75 14.25C16.75 13.8375 16.4125 13.5 16 13.5Z"
        fill={iconsThemeColor(theme).primary}
      />
      <rect x="1.4" y="13.4" width="9.2" height="9.2" rx="4.6" fill="white" />
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
      <g clipPath="url(#clip0_14235_615208)">
        <path
          d="M5.66667 15.6673V19.3907L4.04 17.764C3.91 17.634 3.69667 17.634 3.56667 17.764C3.43667 17.894 3.43667 18.104 3.56667 18.234L5.76333 20.4307C5.89333 20.5607 6.10333 20.5607 6.23333 20.4307L8.43 18.234C8.56 18.104 8.56 17.894 8.43 17.764C8.3 17.634 8.09 17.634 7.96 17.764L6.33333 19.3907V15.6673C6.33333 15.484 6.18333 15.334 6 15.334C5.81667 15.334 5.66667 15.484 5.66667 15.6673Z"
          fill={iconsThemeColor(theme).error}
        />
      </g>
      <rect
        width="6"
        height="5"
        transform="translate(15 5)"
        fill={iconsThemeColor(theme).secondary}
      />
      <g clipPath="url(#clip1_14235_615208)">
        <path
          d="M21 4H20.5V3C20.5 1.62 19.38 0.5 18 0.5C16.62 0.5 15.5 1.62 15.5 3V4H15C14.45 4 14 4.45 14 5V10C14 10.55 14.45 11 15 11H21C21.55 11 22 10.55 22 10V5C22 4.45 21.55 4 21 4ZM18 8.5C17.45 8.5 17 8.05 17 7.5C17 6.95 17.45 6.5 18 6.5C18.55 6.5 19 6.95 19 7.5C19 8.05 18.55 8.5 18 8.5ZM16.5 4V3C16.5 2.17 17.17 1.5 18 1.5C18.83 1.5 19.5 2.17 19.5 3V4H16.5Z"
          fill={iconsThemeColor(theme).warning}
        />
      </g>
      <defs>
        <clipPath id="clip0_14235_615208">
          <rect
            width="8"
            height="8"
            fill="white"
            transform="translate(2 14.001)"
          />
        </clipPath>
        <clipPath id="clip1_14235_615208">
          <rect width="12" height="12" fill="white" transform="translate(12)" />
        </clipPath>
      </defs>
    </svg>
  );
};
