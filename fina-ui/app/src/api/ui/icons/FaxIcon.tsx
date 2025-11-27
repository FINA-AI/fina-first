import { useTheme } from "@mui/material/styles";
import React from "react";

export const FaxIcon = () => {
  const theme = useTheme();
  const fillColor = theme.palette.mode === "dark" ? "#5D789A" : "#9AA7BE";
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_675_350)">
        <rect
          width="24"
          height="24"
          transform="translate(0 0.339355)"
          fill={fillColor}
        />
        <g clipPath="url(#clip1_675_350)">
          <path
            d="M20 5.33936H10V10.3394C10 10.8894 9.55 11.3394 9 11.3394C8.45 11.3394 8 10.8894 8 10.3394V3.33936H13C13.55 3.33936 14 2.88936 14 2.33936V0.339355C14 -0.210645 13.55 -0.660645 13 -0.660645H7C6.45 -0.660645 6 -0.210645 6 0.339355V5.33936H4C2.9 5.33936 2 6.23936 2 7.33936V19.3394C2 20.4394 2.9 21.3394 4 21.3394H20C21.1 21.3394 22 20.4394 22 19.3394V7.33936C22 6.23936 21.1 5.33936 20 5.33936Z"
            fill={fillColor}
            fillOpacity="1"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_675_350">
          <rect
            width="24"
            height="24"
            fill="white"
            transform="translate(0 0.339355)"
          />
        </clipPath>
        <clipPath id="clip1_675_350">
          <rect
            width="24"
            height="24"
            fill="white"
            transform="translate(0 -0.660645)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};
