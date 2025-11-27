import { useTheme } from "@mui/material/styles";
import React from "react";

export const FilterIcon = () => {
  const theme = useTheme();
  const fillColor = theme.palette.mode === "light" ? "#2962FF" : "#53B1FD";
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 34 37"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect y="0.5" width="34" height="36" rx="17" fill={fillColor} />
      <path
        d="M10.5416 13.1749C12.4749 15.6583 15.3332 19.3333 15.3332 19.3333V23.4999C15.3332 24.4166 16.0832 25.1666 16.9999 25.1666C17.9166 25.1666 18.6666 24.4166 18.6666 23.4999V19.3333C18.6666 19.3333 21.5249 15.6583 23.4582 13.1749C23.8832 12.6249 23.4916 11.8333 22.7916 11.8333H11.1999C10.5082 11.8333 10.1166 12.6249 10.5416 13.1749Z"
        fill="white"
      />
    </svg>
  );
};
