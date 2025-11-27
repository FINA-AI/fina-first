import { useTheme } from "@mui/material/styles";
import React from "react";
import { iconsThemeColor } from "./commonStyles";

export const ActiveLockFinaUser = () => {
  const theme = useTheme();

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_14235_615319)">
        <g clipPath="url(#clip1_14235_615319)">
          <path
            d="M10 14C11.6575 14 13 12.6575 13 11C13 9.3425 11.6575 8 10 8C8.3425 8 7 9.3425 7 11C7 12.6575 8.3425 14 10 14ZM10 15.5C7.9975 15.5 4 16.505 4 18.5V19.25C4 19.6625 4.3375 20 4.75 20H15.25C15.6625 20 16 19.6625 16 19.25V18.5C16 16.505 12.0025 15.5 10 15.5Z"
            fill={iconsThemeColor(theme).primary}
          />
        </g>
      </g>
      <rect
        x="1.00078"
        y="13"
        width="10"
        height="10"
        rx="5"
        fill={iconsThemeColor(theme).secondary}
      />
      <g clipPath="url(#clip2_14235_615319)">
        <path
          d="M6 13C3.24 13 1 15.24 1 18C1 20.76 3.24 23 6 23C8.76 23 11 20.76 11 18C11 15.24 8.76 13 6 13ZM6 22C3.795 22 2 20.205 2 18C2 15.795 3.795 14 6 14C8.205 14 10 15.795 10 18C10 20.205 8.205 22 6 22ZM7.94 16.145L5 19.085L4.06 18.145C3.865 17.95 3.55 17.95 3.355 18.145C3.16 18.34 3.16 18.655 3.355 18.85L4.65 20.145C4.845 20.34 5.16 20.34 5.355 20.145L8.65 16.85C8.845 16.655 8.845 16.34 8.65 16.145C8.455 15.95 8.135 15.95 7.94 16.145V16.145Z"
          fill={iconsThemeColor(theme).success}
        />
      </g>
      <rect
        width="6"
        height="5"
        transform="translate(15 5)"
        fill={iconsThemeColor(theme).secondary}
      />
      <g clipPath="url(#clip3_14235_615319)">
        <path
          d="M21 4H20.5V3C20.5 1.62 19.38 0.5 18 0.5C16.62 0.5 15.5 1.62 15.5 3V4H15C14.45 4 14 4.45 14 5V10C14 10.55 14.45 11 15 11H21C21.55 11 22 10.55 22 10V5C22 4.45 21.55 4 21 4ZM18 8.5C17.45 8.5 17 8.05 17 7.5C17 6.95 17.45 6.5 18 6.5C18.55 6.5 19 6.95 19 7.5C19 8.05 18.55 8.5 18 8.5ZM16.5 4V3C16.5 2.17 17.17 1.5 18 1.5C18.83 1.5 19.5 2.17 19.5 3V4H16.5Z"
          fill={iconsThemeColor(theme).warning}
        />
      </g>
      <defs>
        <clipPath id="clip0_14235_615319">
          <rect
            width="18"
            height="18"
            fill="white"
            transform="translate(1 5)"
          />
        </clipPath>
        <clipPath id="clip1_14235_615319">
          <rect
            width="18"
            height="18"
            fill="white"
            transform="translate(1 5)"
          />
        </clipPath>
        <clipPath id="clip2_14235_615319">
          <rect
            width="12"
            height="12"
            fill="white"
            transform="translate(0 12)"
          />
        </clipPath>
        <clipPath id="clip3_14235_615319">
          <rect width="12" height="12" fill="white" transform="translate(12)" />
        </clipPath>
      </defs>
    </svg>
  );
};
