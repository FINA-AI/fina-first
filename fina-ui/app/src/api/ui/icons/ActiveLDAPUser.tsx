import { useTheme } from "@mui/material/styles";
import React from "react";
import { iconsThemeColor } from "./commonStyles";

export const ActiveLDAPUser = () => {
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
        x="1.00078"
        y="9"
        width="10"
        height="10"
        rx="5"
        fill={iconsThemeColor(theme).secondary}
      />
      <g clipPath="url(#clip0_14235_615206)">
        <path
          d="M6 9C3.24 9 1 11.24 1 14C1 16.76 3.24 19 6 19C8.76 19 11 16.76 11 14C11 11.24 8.76 9 6 9ZM6 18C3.795 18 2 16.205 2 14C2 11.795 3.795 10 6 10C8.205 10 10 11.795 10 14C10 16.205 8.205 18 6 18ZM7.94 12.145L5 15.085L4.06 14.145C3.865 13.95 3.55 13.95 3.355 14.145C3.16 14.34 3.16 14.655 3.355 14.85L4.65 16.145C4.845 16.34 5.16 16.34 5.355 16.145L8.65 12.85C8.845 12.655 8.845 12.34 8.65 12.145C8.455 11.95 8.135 11.95 7.94 12.145V12.145Z"
          fill={iconsThemeColor(theme).success}
        />
      </g>
      <defs>
        <clipPath id="clip0_14235_615206">
          <rect
            width="12"
            height="12"
            fill="white"
            transform="translate(0 8)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};
