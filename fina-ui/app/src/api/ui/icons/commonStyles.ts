export const iconsThemeColor = (theme: any) => {
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
