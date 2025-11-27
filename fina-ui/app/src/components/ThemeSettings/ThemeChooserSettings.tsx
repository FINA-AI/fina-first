import React, { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Slide from "@mui/material/Slide";
import ThemeThumb from "./ThemeThumbs";
import {
  StyledCloseButton,
  StyledFormGroup,
  StyledFormLabel,
  StyledPaper,
  StyledSettingsWrapper,
  StyledSlideDiv,
  StyledSwitch,
  StyledThemeChooser,
  StyledThemeField,
  StyledThemeLabel,
} from "./theme-settings-jss";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

type PaletteType = { [key: string]: string };

interface Props {
  palette?: PaletteType[];
  mode: string;
  selectedValue: string;
  changeTheme(event: any): void;
  templateSettingsRef: any;
  showThemeEditor: boolean;
  changeVisibility(): void;
  changeMode(newMode: string): void;
}

const ThemeChooserSettings: React.FC<Props> = ({
  templateSettingsRef,
  palette,
  mode,
  selectedValue,
  changeMode,
  changeTheme,
  showThemeEditor,
  changeVisibility,
}) => {
  const [, setThemeMode] = useState("light");
  const { i18n } = useTranslation();
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down("md"));

  // Theme Mode Handle
  const handleSwitchMode = (name: string) => (event: any) => {
    changeMode(event.target.checked ? "dark" : "light");
    setThemeMode(name === event.target.checked ? "dark" : "light");
  };

  const getItem = (dataArray: PaletteType[]) => {
    return dataArray.map((item, index) => (
      <StyledThemeField
        label={""}
        key={index.toString()}
        control={
          <ThemeThumb
            value={item.value}
            selectedValue={selectedValue}
            handleChange={changeTheme}
            name={item.name}
          />
        }
      />
    ));
  };

  useEffect(() => {
    /**
     * If clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (
        showThemeEditor &&
        templateSettingsRef.current &&
        !templateSettingsRef.current.contains(event.target)
      ) {
        changeVisibility();
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [templateSettingsRef, showThemeEditor]);

  return (
    <StyledThemeChooser ref={templateSettingsRef} _visible={showThemeEditor}>
      <Slide direction={"left"} in={showThemeEditor} mountOnEnter unmountOnExit>
        <StyledSlideDiv>
          <StyledSettingsWrapper dir={"left"}>
            <StyledPaper>
              <FormControl component="fieldset">
                <StyledFormLabel component="legend">
                  {i18n?.t("theme mode") as any}
                </StyledFormLabel>
                <StyledFormGroup>
                  <span>{i18n?.t("light mode") as any}</span>
                  <FormControlLabel
                    label={i18n?.t("dark mode") as any}
                    sx={{
                      margin: 0,
                    }}
                    control={
                      <StyledSwitch
                        checked={mode === "dark"}
                        onChange={handleSwitchMode("dark")}
                        value="dark"
                        color="default"
                      />
                    }
                  />
                </StyledFormGroup>
              </FormControl>
            </StyledPaper>

            <StyledPaper>
              <FormControl
                component="fieldset"
                sx={{
                  display: "block",
                }}
              >
                <StyledThemeLabel component="legend">
                  {i18n?.t("theme color") as any}
                </StyledThemeLabel>
                {sm ? (
                  <StyledCloseButton>
                    <Button
                      startIcon={<CloseIcon />}
                      size={"small"}
                      onClick={changeVisibility}
                    >
                      <StyledFormLabel
                        style={{ paddingTop: 2, textTransform: "capitalize" }}
                      >
                        {i18n?.t("Close") as any}
                      </StyledFormLabel>
                    </Button>
                  </StyledCloseButton>
                ) : null}
                {palette !== undefined && getItem(palette)}
              </FormControl>
            </StyledPaper>
          </StyledSettingsWrapper>
          {/* END */}
        </StyledSlideDiv>
      </Slide>
    </StyledThemeChooser>
  );
};

export default ThemeChooserSettings;
