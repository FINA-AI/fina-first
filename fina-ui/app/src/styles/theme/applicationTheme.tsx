import loadThemePalette from "../../api/palette/themePaletteMode";
import { createBreakpoints, darken, lighten } from "@mui/system";
import shadows from "@mui/material/styles/shadows";
import { Palette, ThemePaletteColorType } from "./palette.type";

const applicationTheme = (color: ThemePaletteColorType, mode: string) => {
  const paperBackgroundColor = mode === "dark" ? "#2D3747" : "#FFFFFF";
  const paperBoxShadow =
    mode === "dark" ? "0px 2px 3px rgba(0, 0, 0, 0.1)" : shadows[3];
  let themePalette: Palette = loadThemePalette(color, mode);
  if (!themePalette) {
    themePalette = loadThemePalette("blueTheme", mode);
  }

  const textFieldBorderStyle = mode === "dark" ? "#1D2631" : "#D0D0D0";
  const tooltipBackgroundStyle = mode === "dark" ? "#2B3748" : "#9A9A9A";
  const breakpoints = createBreakpoints({});
  const textColor = mode === "dark" ? "#F5F7FA" : "inherit";
  const secondaryTextColor = mode === "dark" ? "#ABBACE" : "#596D89";
  const labelColor = mode === "dark" ? "#AEB8CB" : "#596D89";
  const disableLabelColor =
    mode === "dark" ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.38)";
  const borderColor = `1px solid ${mode === "dark" ? "#3C4D68" : "#EAEBF0"}`;
  const iconColor = mode === "dark" ? "#5D789A" : "#7589A5";
  const errorColor = "#FF4128";

  return {
    palette: {
      mode: mode,
      primary: themePalette.palette.primary,
      secondary: themePalette.palette.secondary,
      lightColor: themePalette.palette.lightColor,
      lightBackgroundColor: themePalette.palette.lightBackgroundColor,
      textColor: textColor,
      secondaryTextColor: secondaryTextColor,

      action: {
        hover:
          mode === "dark"
            ? themePalette.palette.buttons.secondary.hover
            : "rgba(240,240,240)", // "rgba(80,80,80, 0.05)"
        hoverOpacity: 0.05,
        select: themePalette.palette.select,
      },
      paperBackground: paperBackgroundColor,
      paperBoxShadow: paperBoxShadow,
      textFieldBorder: textFieldBorderStyle,
      tooltipBackground: tooltipBackgroundStyle,
      buttons: themePalette.palette.buttons,
      borderColor: borderColor,
      labelColor: labelColor,
      disableLabelColor: disableLabelColor,
      iconColor: iconColor,
      errorColor: errorColor,
    },
    bodyBackgroundColor: themePalette.palette.bodyBackgroundColor,
    typography: {
      useNextVariants: true,
      fontFamily: ["Inter", "sans-serif"].join(","),
      title: {
        fontWeight: 700,
      },
      body1: {
        fontSize: "1rem",
        [breakpoints.between(900, 1300)]: {
          fontSize: "0.75rem",
        },
      },
      body2: {
        fontWeight: 400,
      },
      fontWeightMedium: 700,
    },
    shade: {
      light: "0 10px 15px -5px rgba(62, 57, 107, .07)",
    },
    glow: {
      light: `0 2px 20px -5px ${themePalette.palette.primary.main}`,
      medium: `0 2px 40px -5px ${themePalette.palette.primary.main}`,
      dark: `0 2px 40px 0px ${themePalette.palette.primary.main}`,
    },
    rounded: {
      smallRadius: "8px",
      mediumRadius: "12px",
      bigRadius: "20px",
    },
    links: {
      color: mode === "dark" ? "#53b1fd !important" : "#2962ff !important",
      textDecoration: "underline",
    },
    shadows:
      mode === "dark"
        ? [
            "none",
            "0px 1px 3px 0px rgba(50,50,50, 0.2),0px 1px 1px 0px rgba(50,50,50, 0.14),0px 2px 1px -1px rgba(50,50,50, 0.12)",
            "0px 1px 5px 0px rgba(50,50,50, 0.2),0px 2px 2px 0px rgba(50,50,50, 0.14),0px 3px 1px -2px rgba(50,50,50, 0.12)",
            "0px 1px 8px 0px rgba(50,50,50, 0.2),0px 3px 4px 0px rgba(50,50,50, 0.14),0px 3px 3px -2px rgba(50,50,50, 0.12)",
            "0px 2px 4px -1px rgba(50,50,50, 0.2),0px 4px 5px 0px rgba(50,50,50, 0.14),0px 1px 10px 0px rgba(50,50,50, 0.12)",
            "0px 3px 5px -1px rgba(50,50,50, 0.2),0px 5px 8px 0px rgba(50,50,50, 0.14),0px 1px 14px 0px rgba(50,50,50, 0.12)",
            "0px 3px 5px -1px rgba(50,50,50, 0.2),0px 6px 10px 0px rgba(50,50,50, 0.14),0px 1px 18px 0px rgba(50,50,50, 0.12)",
            "0px 4px 5px -2px rgba(50,50,50, 0.2),0px 7px 10px 1px rgba(50,50,50, 0.14),0px 2px 16px 1px rgba(50,50,50, 0.12)",
            "0px 5px 5px -3px rgba(50,50,50, 0.2),0px 8px 10px 1px rgba(50,50,50, 0.14),0px 3px 14px 2px rgba(50,50,50, 0.12)",
            "0px 5px 6px -3px rgba(50,50,50, 0.2),0px 9px 12px 1px rgba(50,50,50, 0.14),0px 3px 16px 2px rgba(50,50,50, 0.12)",
            "0px 6px 6px -3px rgba(50,50,50, 0.2),0px 10px 14px 1px rgba(50,50,50, 0.14),0px 4px 18px 3px rgba(50,50,50, 0.12)",
            "0px 6px 7px -4px rgba(50,50,50, 0.2),0px 11px 15px 1px rgba(50,50,50, 0.14),0px 4px 20px 3px rgba(50,50,50, 0.12)",
            "0px 7px 8px -4px rgba(50,50,50, 0.2),0px 12px 17px 2px rgba(50,50,50, 0.14),0px 5px 22px 4px rgba(50,50,50, 0.12)",
            "0px 7px 8px -4px rgba(50,50,50, 0.2),0px 13px 19px 2px rgba(50,50,50, 0.14),0px 5px 24px 4px rgba(50,50,50, 0.12)",
            "0px 7px 9px -4px rgba(50,50,50, 0.2),0px 14px 21px 2px rgba(50,50,50, 0.14),0px 5px 26px 4px rgba(50,50,50, 0.12)",
            "0px 8px 9px -5px rgba(50,50,50, 0.2),0px 15px 22px 2px rgba(50,50,50, 0.14),0px 6px 28px 5px rgba(50,50,50, 0.12)",
            "0px 8px 10px -5px rgba(50,50,50, 0.2),0px 16px 24px 2px rgba(50,50,50, 0.14),0px 6px 30px 5px rgba(50,50,50, 0.12)",
            "0px 8px 11px -5px rgba(50,50,50, 0.2),0px 17px 26px 2px rgba(50,50,50, 0.14),0px 6px 32px 5px rgba(50,50,50, 0.12)",
            "0px 9px 11px -5px rgba(50,50,50, 0.2),0px 18px 28px 2px rgba(50,50,50, 0.14),0px 7px 34px 6px rgba(50,50,50, 0.12)",
            "0px 9px 12px -6px rgba(50,50,50, 0.2),0px 19px 29px 2px rgba(50,50,50, 0.14),0px 7px 36px 6px rgba(50,50,50, 0.12)",
            "0px 10px 13px -6px rgba(50,50,50, 0.2),0px 20px 31px 3px rgba(50,50,50, 0.14),0px 8px 38px 7px rgba(50,50,50, 0.12)",
            "0px 10px 13px -6px rgba(50,50,50, 0.2),0px 21px 33px 3px rgba(50,50,50, 0.14),0px 8px 40px 7px rgba(50,50,50, 0.12)",
            "0px 10px 14px -6px rgba(50,50,50, 0.2),0px 22px 35px 3px rgba(50,50,50, 0.14),0px 8px 42px 7px rgba(50,50,50, 0.12)",
            "0px 11px 14px -7px rgba(50,50,50, 0.2),0px 23px 36px 3px rgba(50,50,50, 0.14),0px 9px 44px 8px rgba(50,50,50, 0.12)",
            "0px 11px 15px -7px rgba(50,50,50, 0.2),0px 24px 38px 3px rgba(850,50,50 0.14),0px 9px 46px 8px rgba(50,50,50, 0.12)",
          ]
        : [
            "none",
            "0px 1px 3px 0px rgba(80,80,80, 0.2),0px 1px 1px 0px rgba(80,80,80, 0.14),0px 2px 1px -1px rgba(80,80,80, 0.12)",
            "0px 1px 5px 0px rgba(80,80,80, 0.2),0px 2px 2px 0px rgba(80,80,80, 0.14),0px 3px 1px -2px rgba(80,80,80, 0.12)",
            "0px 1px 8px 0px rgba(80,80,80, 0.2),0px 3px 4px 0px rgba(80,80,80, 0.14),0px 3px 3px -2px rgba(80,80,80, 0.12)",
            "0px 2px 4px -1px rgba(80,80,80, 0.2),0px 4px 5px 0px rgba(80,80,80, 0.14),0px 1px 10px 0px rgba(80,80,80, 0.12)",
            "0px 3px 5px -1px rgba(80,80,80, 0.2),0px 5px 8px 0px rgba(80,80,80, 0.14),0px 1px 14px 0px rgba(80,80,80, 0.12)",
            "0px 3px 5px -1px rgba(80,80,80, 0.2),0px 6px 10px 0px rgba(80,80,80, 0.14),0px 1px 18px 0px rgba(80,80,80, 0.12)",
            "0px 4px 5px -2px rgba(80,80,80, 0.2),0px 7px 10px 1px rgba(80,80,80, 0.14),0px 2px 16px 1px rgba(80,80,80, 0.12)",
            "0px 5px 5px -3px rgba(80,80,80, 0.2),0px 8px 10px 1px rgba(80,80,80, 0.14),0px 3px 14px 2px rgba(80,80,80, 0.12)",
            "0px 5px 6px -3px rgba(80,80,80, 0.2),0px 9px 12px 1px rgba(80,80,80, 0.14),0px 3px 16px 2px rgba(80,80,80, 0.12)",
            "0px 6px 6px -3px rgba(80,80,80, 0.2),0px 10px 14px 1px rgba(80,80,80, 0.14),0px 4px 18px 3px rgba(80,80,80, 0.12)",
            "0px 6px 7px -4px rgba(80,80,80, 0.2),0px 11px 15px 1px rgba(80,80,80, 0.14),0px 4px 20px 3px rgba(80,80,80, 0.12)",
            "0px 7px 8px -4px rgba(80,80,80, 0.2),0px 12px 17px 2px rgba(80,80,80, 0.14),0px 5px 22px 4px rgba(80,80,80, 0.12)",
            "0px 7px 8px -4px rgba(80,80,80, 0.2),0px 13px 19px 2px rgba(80,80,80, 0.14),0px 5px 24px 4px rgba(80,80,80, 0.12)",
            "0px 7px 9px -4px rgba(80,80,80, 0.2),0px 14px 21px 2px rgba(80,80,80, 0.14),0px 5px 26px 4px rgba(80,80,80, 0.12)",
            "0px 8px 9px -5px rgba(80,80,80, 0.2),0px 15px 22px 2px rgba(80,80,80, 0.14),0px 6px 28px 5px rgba(80,80,80, 0.12)",
            "0px 8px 10px -5px rgba(80,80,80, 0.2),0px 16px 24px 2px rgba(80,80,80, 0.14),0px 6px 30px 5px rgba(80,80,80, 0.12)",
            "0px 8px 11px -5px rgba(80,80,80, 0.2),0px 17px 26px 2px rgba(80,80,80, 0.14),0px 6px 32px 5px rgba(80,80,80, 0.12)",
            "0px 9px 11px -5px rgba(80,80,80, 0.2),0px 18px 28px 2px rgba(80,80,80, 0.14),0px 7px 34px 6px rgba(80,80,80, 0.12)",
            "0px 9px 12px -6px rgba(80,80,80, 0.2),0px 19px 29px 2px rgba(80,80,80, 0.14),0px 7px 36px 6px rgba(80,80,80, 0.12)",
            "0px 10px 13px -6px rgba(80,80,80, 0.2),0px 20px 31px 3px rgba(80,80,80, 0.14),0px 8px 38px 7px rgba(80,80,80, 0.12)",
            "0px 10px 13px -6px rgba(80,80,80, 0.2),0px 21px 33px 3px rgba(80,80,80, 0.14),0px 8px 40px 7px rgba(80,80,80, 0.12)",
            "0px 10px 14px -6px rgba(80,80,80, 0.2),0px 22px 35px 3px rgba(80,80,80, 0.14),0px 8px 42px 7px rgba(80,80,80, 0.12)",
            "0px 11px 14px -7px rgba(80,80,80, 0.2),0px 23px 36px 3px rgba(80,80,80, 0.14),0px 9px 44px 8px rgba(80,80,80, 0.12)",
            "0px 11px 15px -7px rgba(80,80,80, 0.2),0px 24px 38px 3px rgba(80,80,80, 0.14),0px 9px 46px 8px rgba(80,80,80, 0.12)",
          ],
    components: {
      MuiButtonBase: {
        defaultProps: {
          disableRipple: true,
        },
      },
      MuiList: {
        styleOverrides: {
          root: {
            padding: "4px",
            backgroundColor: paperBackgroundColor,
            ...(mode === "dark" && {
              border: "1px solid #3C4D68",
              borderRadius: 2,
              boxShadow: "",
            }),
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            "&:hover": {
              backgroundColor:
                mode === "light"
                  ? "rgba(80,80,80, 0.05)"
                  : themePalette.palette.buttons.secondary.hover,
            },
            "&.Mui-selected": {
              backgroundColor: themePalette.palette.primary.main,
              "&:hover": {
                backgroundColor:
                  mode === "light"
                    ? "rgba(80,80,80, 0.05)"
                    : themePalette.palette.buttons.secondary.hover,
              },
            },
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            "&.Mui-selected": {
              backgroundColor: `${themePalette.palette.primary.main} !important`,
              "& .MuiListItemText-root": {
                color: "#FFFFFF",
              },
            },
          },
        },
      },
      MuiSkeleton: {
        styleOverrides: {
          root: {
            backgroundColor: themePalette.palette.lightBackgroundColor,
          },
        },
      },
      MuiListItemText: {
        styleOverrides: {
          root: {
            whiteSpace: "nowrap",
            fontSize: "12px",
            [breakpoints.between(900, 1300)]: {
              fontSize: "0.75rem",
            },
          },
          primary: {
            color: textColor,
          },
          secondary: {
            color: mode === "dark" ? "#FFFFFF" : "#4F5863",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: paperBackgroundColor,
            backgroundImage: mode === "dark" && "unset",
          },
          rounded: {
            borderRadius: 0,
          },
          elevation1: {
            boxShadow:
              mode === "light"
                ? "-5px 0px 10px 0px #352f2f08 !important"
                : "-92px -35px 28px 0px rgba(0, 0, 0, 0.00), -59px -22px 25px 0px rgba(0, 0, 0, 0.01), -33px -13px 21px 0px rgba(0, 0, 0, 0.05), -15px -6px 16px 0px rgba(0, 0, 0, 0.09), -4px -1px 9px 0px rgba(0, 0, 0, 0.10);",
          },
          elevation4: {
            boxShadow:
              mode === "light"
                ? "-5px 0px 10px 0px #352f2f08"
                : "-49px 0px 14px 0px rgba(0, 0, 0, 0.00), -31px 0px 12px 0px rgba(0, 0, 0, 0.01), -18px 0px 11px 0px rgba(0, 0, 0, 0.03), -8px 0px 8px 0px rgba(0, 0, 0, 0.05), -2px 0px 4px 0px rgba(0, 0, 0, 0.06);",
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: mode === "dark" ? "#9A9A9A" : "#1D2631",
          },
          arrow: {
            color: mode === "dark" ? "#9A9A9A" : "#1D2631",
          },
        },
      },
      MuiPickersCalendarHeader: {
        styleOverrides: {
          iconButton: {
            backgroundColor: mode === "dark" && paperBackgroundColor,
          },
        },
      },
      MuiPickersBasePicker: {
        styleOverrides: {
          pickerView: {
            backgroundColor: mode === "dark" && paperBackgroundColor,
          },
        },
      },

      MuiButton: {
        styleOverrides: {
          contained: {
            boxShadow: "none",
          },

          root: {
            borderRadius: 8,
            fontWeight: 600,
          },
          sizeSmall: {
            padding: "7px 12px",
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: `${
              mode === "light" ? "rgba(104, 122, 158, 0.8)" : "#5D789A"
            }`,
            backgroundColor: "transparent",
            border: `1px solid ${
              mode === "light" ? "rgba(234, 235, 240, 1)" : "#3C4D68"
            }`,
            "&:hover": {
              backgroundColor: `${mode === "light" ? "#EAECF0" : "#1F2532"}`,
            },
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          button: {
            fontWeight: 600,
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            backgroundColor: `${paperBackgroundColor}`,
            borderRadius: "4px",
          },
        },
      },
      MuiInput: {
        styleOverrides: {
          root: {
            border:
              mode === "dark"
                ? "1px solid rgba(255,255,255,0.32)"
                : "1px solid rgba(0,0,0,0.32)",
            borderRadius: 8,
            overflow: "hidden",
            alignItems: "center",
            transition: "border 0.3s ease",
          },
          underline: {
            "&:after": {
              height: "calc(100% + 1px)",
              borderRadius: 8,
              bottom: -1,
              boxShadow: `0 0 1px ${themePalette.palette.primary.main}`,
            },
            "&:before": {
              display: "none",
            },
          },
          input: {
            padding: 10,
            fontSize: 14,
          },
          multiline: {
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 24,
          },
        },
      },
      MuiAutocomplete: {
        styleOverrides: {
          root: {
            "& .MuiInputLabel-root": {
              color: labelColor,
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: themePalette.palette.primary.main,
              "&.Mui-error": {
                color: errorColor,
              },
            },
          },
          popper: {
            position: "fixed",
            boxShadow:
              mode === "dark"
                ? "0px 19px 38px 0px rgba(0, 0, 0, 0.30), 0px 15px 12px 0px rgba(0, 0, 0, 0.22)"
                : "0px 5px 5px -3px rgb(80 80 80 / 12%), " +
                  "0px 8px 10px 1px rgb(80 80 80 / 12%), " +
                  "0px 3px 14px 2px rgb(80 80 80 / 12%)",
            "& .MuiPaper-root": {
              boxShadow: "unset",
            },
            "& .MuiAutocomplete-listbox": {
              padding: "4px",
              maxHeight: "100%",
              background:
                mode === "dark" ? "rgba(52, 66, 88, 1)" : paperBackgroundColor,
              ...(mode === "dark" && {
                border: "1px solid #3C4D68",
                borderRadius: 2,
              }),
              "& :hover": {
                borderRadius: "4px",
                '& .MuiAutocomplete-option[aria-selected="true"]': {
                  background:
                    mode === "light" &&
                    `${themePalette.palette.buttons.secondary.hover} !important`,
                },
              },
              "& .MuiAutocomplete-option": {
                fontWeight: 400,
                fontSize: "11px",
                lineHeight: "16px",
                "&:hover": {
                  backgroundColor: mode === "dark" && "#3c4d68",
                },
              },
            },
          },
        },
      },

      MuiSelect: {
        styleOverrides: {
          root: {
            background:
              mode === "dark" ? "rgba(52, 66, 88, 1)" : paperBackgroundColor,
            width: "100%",
            display: "flex",
            "& .MuiTypography-root": {
              lineBreak: "anywhere",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "calc(100% - 25px)",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: borderColor,
            },
            "&.Mui-error .MuiOutlinedInput-notchedOutline": {
              borderColor: errorColor,
            },
          },
          paper: {
            boxSizing: "border-box",
            paddingRight: "4px",
            paddingLeft: "4px",
            maxHeight: "300px",
          },
          options: {
            fontWeight: 400,
            fontSize: "11px",
            lineHeight: "16px",
          },
        },
      },
      MuiFormControl: {
        styleOverrides: {
          root: {
            width: "100%",
            "& .MuiInputLabel-root.Mui-focused": {},
            "& .MuiOutlinedInput-notchedOutline": {
              border: borderColor,
            },
            "& .MuiOutlinedInput-root.Mui-focused:not(.Mui-error) .MuiOutlinedInput-notchedOutline":
              {
                borderColor: lighten(themePalette.palette.primary.main, 0.3),
              },
            "& .MuiOutlinedInput-root:hover:not(.Mui-focused) .MuiOutlinedInput-notchedOutline":
              {
                borderColor: mode === "dark" ? "#7D95B3" : "rgb(184, 185, 190)",
              },
            "& .MuiOutlinedInput-root.Mui-error:hover .MuiOutlinedInput-notchedOutline":
              {
                borderColor: errorColor,
              },
          },
        },
      },
      MuiInputAdornment: {
        styleOverrides: {
          root: {
            paddingLeft: 0,
            paddingRight: 0,
            height: "auto",
            "& button": {
              width: 32,
              height: 32,
              padding: 0,
            },
            "& p": {
              minWidth: 24,
              lineHeight: "16px",
            },
            "& > svg": {
              position: "relative",
              top: 3,
            },
          },
          positionStart: {
            marginLeft: 0,
          },
          positionEnd: {
            marginRight: 0,
          },
        },
      },
      MuiToolbar: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiTableBody: {
        styleOverrides: {
          root: {
            backgroundColor: paperBackgroundColor,
            "&::-webkit-scrollbar": {
              backgroundColor: mode === "dark" ? "#2D3747" : "#f6f6f8",
            },
            "&::-webkit-scrollbar-corner": {
              backgroundColor: mode === "dark" ? "#2D3747" : "#f6f6f8",
            },
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            "&:hover": {
              "& .MuiTableCell-root": {
                boxShadow:
                  mode === "dark"
                    ? "0px 1px 0px #1d2632"
                    : "0px 1px 0px #EAEBF0",
              },
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            backgroundColor: paperBackgroundColor,
            color: textColor,
            background:
              mode === "dark"
                ? "linear-gradient(180deg, #2B3748 97%, #666c89 100%)"
                : "linear-gradient(180deg, #FFFFFF 97%, #EAEBF0 100%)",
            borderBottom:
              mode === "dark"
                ? "1px solid #636363"
                : `1px solid ${themePalette.palette.primary.light}`,
          },
          head: {
            fontWeight: 600,
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
          bar: {
            borderRadius: 16,
          },
          colorPrimary: {
            backgroundColor: mode === "dark" ? "#616161" : "#ededed",
          },
        },
      },
      MuiPickersToolbar: {
        styleOverrides: {
          toolbar: {
            borderRadius: 0,
            boxShadow: "inset 0 -30px 120px -30px rgba(0, 0, 0, 0.3)",
          },
        },
      },
      MuiPickersClock: {
        styleOverrides: {
          clock: {
            backgroundColor: "none",
            border: `1px solid ${themePalette.palette.primary.main}`,
          },
        },
      },
      MuiPickersClockPointer: {
        styleOverrides: {
          thumb: {
            boxShadow: `0 1px 10px 0px ${themePalette.palette.primary.main}`,
          },
        },
      },
      MuiPickerDTTabs: {
        styleOverrides: {
          tabs: {
            backgroundColor: "transparent",
            color: themePalette.palette.primary.main,
          },
        },
      },
      MuiExpansionPanel: {
        styleOverrides: {
          root: {
            "&:first-child": {
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            },
            "&:last-child": {
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
            },
            "&$expanded": {
              borderRadius: 8,
              boxShadow: `0px 0px 0px 1px ${themePalette.palette.primary.main}`,
              "& + div": {
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
              },
            },
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "light" ? "#EAEBF0" : "#5D789A",
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            position: "relative",
            marginBottom: 32,
            "&:after": {
              content: '""',
              position: "absolute",
              width: 60,
              height: 4,
              background: themePalette.palette.primary.main,
              bottom: 0,
              left: 26,
            },
            "& h2": {
              color:
                mode === "dark"
                  ? themePalette.palette.primary.light
                  : themePalette.palette.primary.dark,
            },
          },
        },
      },

      MuiToggleButtonGroup: {
        styleOverrides: {
          root: {
            overflow: "hidden",
            boxShadow: "none",
            border: `1px solid ${themePalette.palette.secondary.main}`,
          },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            "&.MuiButtonBase-root": {
              background: "inherit",
              width: "fit-content",
              padding: "4px 8px",
              color:
                mode === "dark" ? "#ABBACE !important" : "#596D89 !important",
              fontSize: 12,
              fontWeight: 500,
              lineHeight: "16px",
              textTransform: "capitalize",
              borderRadius: 30,
              border: borderColor,
              "&.Mui-selected": {
                backgroundColor: darken(themePalette.palette.primary.main, 0.3),
                color: `${mode === "dark" ? "#1F2532" : "#FFFFFF"} !important`,
                "&:hover": {
                  backgroundColor: `${themePalette.palette.primary.main} !important`,
                },
              },
            },
            "&:hover": {
              backgroundColor: themePalette.palette.primary.main,
              color: `${mode === "dark" ? "#1F2532" : "#FFFFFF"} !important`,
            },
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: {
            fontSize: "12px",
            lineHeight: "16px",
            height: "24px",
            border: `1px solid ${mode === "dark" ? "#3C4D68" : "#EAEBF0"}`,
            backgroundColor: "inherit",
            color: mode === "light" ? "#596D89" : "#ABBACE",
            "&:hover": {
              backgroundColor: `${themePalette.palette.buttons.primary.hover} `,
              color: `${mode === "dark" ? "#ABBACE" : "#596D89"}`,
            },
            "&:active": {
              backgroundColor: `${themePalette.palette.secondary.main} !important`,
              color: mode === "light" ? "#FFFFFF !important" : "#344258",
            },
          },
        },
      },

      MuiRadio: {
        styleOverrides: {
          root: {
            "&.Mui-checked": {
              color: themePalette.palette.primary,
            },
          },
        },
      },

      MUIDataTableToolbarSelect: {
        styleOverrides: {
          root: {
            boxShadow: "none",
            backgroundColor:
              mode === "dark"
                ? themePalette.palette.secondary.dark
                : themePalette.palette.secondary.light,
          },

          deleteIcon: {
            color: mode === "dark" ? "#FFF" : "#000",
          },
        },
      },

      MuiTab: {
        styleOverrides: {
          root: {
            backgroundColor:
              themePalette.palette.buttons.secondary.backgroundColor,
          },
        },
      },

      MuiCheckbox: {
        styleOverrides: {
          root: {
            "&.Mui-disabled": {
              color: themePalette.palette.primary.main,
              opacity: "0.4",
            },
          },
        },
      },

      MuiStepLabel: {
        styleOverrides: {
          root: {
            "&:hover": {
              backgroundColor: mode === "dark" ? "#313d51" : "#F0F4FF",
            },
            "& .MuiStepLabel-iconContainer": {
              background: themePalette.palette.lightBackgroundColor,
            },
            "& .MuiSvgIcon-root": {
              color: mode === "dark" && "#7D95B3",
            },
            "& .MuiStepLabel-iconContainer.Mui-disabled ": {
              ...(mode === "dark" && {
                circle: {
                  stroke: "#5D789A",
                  r: 11,
                },
              }),
            },
            "& .MuiStepLabel-iconContainer.Mui-active": {
              backgroundColor: themePalette.palette.primary.main,
            },
            "& .MuiStepLabel-label.Mui-active": {
              color: themePalette.palette.primary.main,
            },
            "& .MuiStepLabel-label.Mui-completed": {},
            "& .MuiStepLabel-label.Mui-disabled": {
              color: mode === "dark" && "#5D789A",
            },
            "& .MuiStepIcon-text": {
              fill: mode === "dark" && "#2D3747",
            },
          },
        },
      },

      MuiMenuItem: {
        styleOverrides: {
          root: {
            "&:hover": {
              backgroundColor: mode === "dark" && "#3c4d68 !important",
            },
            "&.Mui-selected": {
              "&:hover": {
                backgroundColor: mode === "dark" && "#53B1FD29 !important",
              },
            },
          },
        },
      },

      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiInputBase-root": {
              fontSize: "12px",
              color: mode === "dark" ? "#F5F7FA" : "#2C3644",
              backgroundColor: mode === "dark" && "rgba(52, 66, 88, 1)",
              "&:hover fieldset": {
                borderColor: mode === "dark" ? "#7D95B3" : "rgb(184, 185, 190)",
              },
              "&.Mui-focused fieldset": {
                borderColor: lighten(themePalette.palette.primary.main, 0.3),
              },
              "& svg": {
                color: iconColor,
              },
            },
            "& fieldset": {
              border: borderColor,
            },
            "& .MuiOutlinedInput-input": {
              height: "100%",
              paddingTop: "0px",
              paddingBottom: "0px",
              paddingLeft: "12px",
            },
            "& .MuiOutlinedInput-input.Mui-disabled": {
              WebkitTextFillColor: "unset",
              color: disableLabelColor,
            },
            "& .MuiOutlinedInput-root.Mui-error": {
              "& fieldset": {
                borderColor: errorColor,
              },
            },
          },
        },
      },

      MuiFormLabel: {
        styleOverrides: {
          root: {
            fontWeight: 500,
            lineHeight: "16px",
            top: "-5px",
            fontSize: "12px",
            color: labelColor,
            "&.Mui-focused": {},
            "&.Mui-error": {
              color: errorColor,
            },
            "& .Mui-focused [data-shrink='true']": {
              color: `${themePalette.palette.primary.main} !important`,
            },
          },
        },
      },
    },

    aHref: {
      marginTop: "10px",
      color: themePalette.palette.primary.main,
      textDecoration: "underline",
      cursor: "pointer",
      "&:hover": {
        color: "#484848",
      },
    },
    aHrefUserProfile: {
      marginTop: "10px",
      color: mode === "dark" ? "#FFFFFF" : themePalette.palette.primary.main,
      textDecoration: "underline",
      cursor: "pointer",
      "&:hover": {
        color: "#484848",
      },
    },
    page: {
      height: "100%",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      borderRadius: "4px",
      flexWrap: "nowrap",
    },
    pageContent: {
      overflow: "hidden",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      backgroundColor: paperBackgroundColor,
      borderRadius: "4px",
    },
    pageTitle: {
      fontWeight: 600,
      fontSize: "16px",
      lineHeight: "150%",
      color: textColor,
      marginBottom: "14px",
    },
    pageToolbar: {
      padding: "12px 16px",
      display: "flex",
      alignItems: "center",
      backgroundColor: paperBackgroundColor,
    },
    pagePaging: ({ size = "default" }) => ({
      boxShadow: "3px -20px 8px -4px #BABABA1A",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: size === "small" ? "4px 16px" : "8px 16px",
    }),
    tableHeaderCell: ({ isSmall }: { isSmall: boolean }) => ({
      fontWeight: 500,
      fontSize: isSmall ? "11px" : "12px",
      lineHeight: isSmall ? "12px" : "16px",
      color: mode === "dark" ? "#acb7cb" : "#707C94",
      padding: "12px 0px 12px 10px",
      backgroundColor:
        mode === "dark" ? darken(paperBackgroundColor, 0.3) : "inherit",
      background:
        mode === "dark"
          ? "linear-gradient(180deg, #2B3748 97%, #666c89 100%)"
          : "linear-gradient(180deg, #FFFFFF 97%, #EAEBF0 100%)",
    }),
    modalHeader: {
      fontWeight: 600,
      fontSize: "13px",
      lineHeight: "20px",
      color: textColor,
      padding: "12px 16px",
      borderBottom: borderColor,
      backgroundColor: paperBackgroundColor,
    },
    general: {
      border: mode === "dark" ? "1px solid #495F80" : "1px solid #EAEBF0",
      maxZIndex: 2147483647,
      footerHeight: "56px",
      miniPagingMargin: 15,
      darkTextColor: mode === "dark" ? "#FFFFFF" : "#000000",
      textColor: "#FFFFFF",
      lightTextColor: "#6C6D83",
      disabledTextColor: mode === "dark" ? "white" : "#B6B6B6",
      errorColor: "#DF4260",
      darkGray: "#D6D6D6",
      gray: "#F0F0F0",
      backgroundColor: "#FFFFFF",
    },
    toolbar: {
      padding: "12px 16px",
    },
    defaultIcon: {
      width: "24px",
      height: "24px",
    },
    smallIcon: {
      width: "16px",
      height: "16px",
    },
    breadcrumb: {
      main: {
        background: themePalette.palette.bodyBackgroundColor,
        height: "16px",
        paddingBottom: "22px",
        paddingLeft: 0,
        marginTop: 0,
      },
      icon: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        width: "16px",
        height: "16px",
        cursor: "pointer",
        color: "#98A7BC",
      },
      text: {
        fontSize: 12,
        fontWeight: 400,
        marginLeft: 5,
        lineHeight: "20px",
        color: themePalette.palette.primary.main,
      },
    },
    customizeInput: ({
      size,
      width,
      isAutocomplete,
      isTextArea,
      height,
      isDisabled,
      isError,
    }: {
      size: string;
      width: string;
      isAutocomplete: boolean;
      isTextArea: boolean;
      height: string;
      isDisabled: boolean;
      isError: boolean;
    }) => ({
      textField: {
        width: width !== undefined ? `${width}px` : "100%",
        "& .MuiOutlinedInput-root": {
          backgroundColor: mode === "dark" ? "rgba(52, 66, 88, 1)" : "inherit",
          height: isTextArea ? height : size === "default" ? "36px" : "32px",
          "& input": {
            paddingTop: "0px",
            paddingBottom: "0px",
            paddingLeft: "12px",
            backgroundColor:
              mode === "dark"
                ? "rgba(52, 66, 88, 1)"
                : `${paperBackgroundColor}`,
            borderRadius: "4px",
          },
          "& fieldset": {
            border: borderColor,
            "& legend": {
              "& span": {
                fontSize: "9px",
              },
            },
          },
          "& svg": {
            color: iconColor,
          },
        },
        "& label[data-shrink='true']": {
          color: isError && `${errorColor} !important`,
          top: size === "default" ? 2 : 4,
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: isError
            ? errorColor
            : mode === "dark"
            ? "#3C4D68"
            : `rgb(234, 235, 240)`,
        },
        "& .Mui-error": {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: errorColor,
          },
        },
        "&:focus-within": {
          "& .MuiOutlinedInput-notchedOutline": {
            border: isError
              ? `1px solid ${errorColor} !important`
              : `1px solid ${themePalette.palette.primary} `,
          },
        },
      },
      fieldValue: {
        fontWeight: 400,
        fontSize: size === "default" ? "12px" : "11px",
        lineHeight: "20px",
        color: isDisabled
          ? "rgba(0, 0, 0, 0.38)"
          : mode === "dark"
          ? "#F5F7FA"
          : "#2C3644",
        height: size === "default" ? "36px" : "32px",
      },
      fieldLabel: {
        fontWeight: 500,
        lineHeight: "16px",
        fontSize: size === "default" ? "12px" : "11px",
        color: isDisabled ? "rgba(0, 0, 0, 0.38)" : labelColor,
        top:
          size === "default"
            ? isAutocomplete
              ? "2px"
              : "-5px"
            : isAutocomplete
            ? "0px"
            : "-7px",
      },
    }),
    inputValue: {
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "20px",
      color: mode === "dark" ? "#FFFFFF" : "#2C3644",
    },
    cellText: {
      fontSize: "12px",
      fontWeight: 400,
      lineHeight: "20px",
      color: mode === "dark" ? "#FFFFFF" : "#2C3644",
    },
    sideMenu: {
      mainText: {
        fontSize: "13px",
        fontWeight: 500,
        lineHeight: "20px",
        color: mode === "dark" ? "#FFFFFF" : "#2C3644",
      },
      secondaryText: {
        fontSize: "11px",
        fontWeight: 400,
        lineHeight: "16px",
        color: mode === "dark" ? "#FFFFFF" : "#4F5863",
      },
    },
    btn: {
      borderRadius: "4px",
      fontSize: "12px !important",
      lineHeight: "16px",
      fontWeight: 500,
    },
    icon: {
      iconWidth: "16px",
      iconHeight: "16px",
    },
    modalTitle: {
      fontWeight: 600,
      fontSize: 13,
      lineHeight: "20px",
      color: textColor,
    },
    ModalBody: {
      backgroundColor: paperBackgroundColor,
      padding: "14px 16px",
    },
    modalFooter: {
      color: textColor,
      backgroundColor: paperBackgroundColor,
      padding: "8px 16px",
      borderTop: borderColor,
    },
    primaryBtn: {
      backgroundColor: `${themePalette.palette.primary.main} !important`,
      fontFamily: "Inter",
      fontStyle: "normal",
      padding: "8px 16px",
      borderRadius: "4px",
      whiteSpace: "nowrap",
      color: `${mode === "light" ? "#F9FAFB" : "#F5F7FA"}`,
      fontSize: "12px",
      "&:hover": {
        backgroundColor: `${themePalette.palette.buttons.primary.hover} !important`,
      },
      "&:disabled": {
        backgroundColor: `${themePalette.palette.primary.main}`,
        opacity: "30%",
        color: "#FFFFFF",
      },
      textTransform: "none",
    },
    ghostBtn: {
      textTransform: "none",
      color: textColor,
      backgroundColor: "inherit",
      "&:hover": {
        boxShadow: "none",
        "&:hover": {
          backgroundColor: `${mode === "light" ? "#EAECF0" : "#3C4D68"}`,
          borderColor: `${mode === "light" ? "#D0D5DD" : "#3C4D68"}`,
        },
      },
      "& svg": {
        color: `${mode === "light" ? "#98A7BC" : "#5D789A"}`,
      },
      "& span": {
        color: `${mode === "light" ? "#2C3644" : "#F5F7FA"}`,
      },
      "&:disabled": {
        opacity: "30%",
        color:
          mode === "dark" ? "#FFFFFF" : themePalette.palette.secondary.main,
        backgroundColor: themePalette.palette.lightColor,
      },
    },
    configResponsiveCard: {
      border: borderColor,
      boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.08)",
      background: paperBackgroundColor,
      borderRadius: "4px",
      fontFamily: "Inter",
      fontStyle: "normal",
    },
    mainLayout: {
      padding: "16px",
      backgroundColor: "inherit",
      width: "100%",
      boxSizing: "border-box",
      overflow: "hidden",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      borderRadius: "4px",
      [breakpoints.between(900, 1300)]: {
        padding: "8px",
      },
    },
  };
};

export default applicationTheme;
