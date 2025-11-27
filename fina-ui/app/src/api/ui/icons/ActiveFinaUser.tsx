import { useTheme } from "@mui/material/styles";
import { iconsThemeColor } from "./commonStyles";

export const ActiveFinaUser = () => {
  const theme = useTheme();

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_14235_615154)">
        <path
          d="M10 10C11.6575 10 13 8.6575 13 7C13 5.3425 11.6575 4 10 4C8.3425 4 7 5.3425 7 7C7 8.6575 8.3425 10 10 10ZM10 11.5C7.9975 11.5 4 12.505 4 14.5V15.25C4 15.6625 4.3375 16 4.75 16H15.25C15.6625 16 16 15.6625 16 15.25V14.5C16 12.505 12.0025 11.5 10 11.5Z"
          fill={iconsThemeColor(theme).primary}
        />
      </g>
      <rect
        x="1.00078"
        y="9"
        width="10"
        height="10"
        rx="5"
        fill={iconsThemeColor(theme).secondary}
      />
      <g clipPath="url(#clip1_14235_615154)">
        <path
          d="M6 9C3.24 9 1 11.24 1 14C1 16.76 3.24 19 6 19C8.76 19 11 16.76 11 14C11 11.24 8.76 9 6 9ZM6 18C3.795 18 2 16.205 2 14C2 11.795 3.795 10 6 10C8.205 10 10 11.795 10 14C10 16.205 8.205 18 6 18ZM7.94 12.145L5 15.085L4.06 14.145C3.865 13.95 3.55 13.95 3.355 14.145C3.16 14.34 3.16 14.655 3.355 14.85L4.65 16.145C4.845 16.34 5.16 16.34 5.355 16.145L8.65 12.85C8.845 12.655 8.845 12.34 8.65 12.145C8.455 11.95 8.135 11.95 7.94 12.145V12.145Z"
          fill={iconsThemeColor(theme).success}
        />
      </g>
      <defs>
        <clipPath id="clip0_14235_615154">
          <rect
            width="18"
            height="18"
            fill="white"
            transform="translate(1 1)"
          />
        </clipPath>
        <clipPath id="clip1_14235_615154">
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
