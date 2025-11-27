const getRandomBlueColor = () => {
  let h = 240;

  let s = Math.floor(Math.random() * (80 - 40 + 1)) + 40;

  let l = Math.floor(Math.random() * (80 - 40 + 1)) + 40;

  return `hsl(${h}, ${s}%, ${l}%)`;
};

const darkenBlueColor = (hslColor) => {
  let [h, s, l] = hslColor.match(/\d+/g).map(Number);

  const subtractValue = 10;
  l = Math.max(0, l - subtractValue);

  return `hsl(${h}, ${s}%, ${l}%)`;
};

export const getRandomFillAndStrokeColor = () => {
  const fill = getRandomBlueColor();
  const stroke = darkenBlueColor(fill);
  return { fill, stroke };
};

export const getChartOptions = (theme) => {
  return {
    label: {
      fill: theme.palette.mode === "dark" ? "#FFFFFF" : "#2C3644",
      fontSize: "11px",
      lineHeight: "16px",
      fontWeight: "400",
    },
    title: {
      fill: theme.palette.mode === "dark" ? "#FFFFFF" : "#2C3644",
      fontWeight: 400,
      fontSize: "11px",
      lineHeight: "16px",
    },
    item: {
      fontWeight: 600,
      fontSize: "11px",
      lineHeight: "16px",
    },
    tooltip: {
      backgroundColor:
        theme.palette.mode === "light" ? "#FFFFFF" : "rgb(38 45 56)",
    },
  };
};
