import React, { ReactElement, useEffect, useRef, useState } from "react";
import {
  createTheme,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material/styles";
import applicationTheme from "../../styles/theme/applicationTheme";
import { getLocalStorageValue } from "../../api/ui/localStorageHelper";
import { bindActionCreators } from "redux";
import {
  changeModeAction,
  changeThemeAction,
  showThemeEditorAction,
} from "../../redux/actions/uiActions";
import { connect } from "react-redux";
import TemplateSettings from "../../components/ThemeSettings/ThemeChooserSettings";
import { responsiveFontSizes } from "@mui/material";
import { Box } from "@mui/system";
import { ConfigType } from "../../types/common.type";
import { ThemePaletteColorType } from "../../styles/theme/palette.type";

export const AppContext = React.createContext((_newMode: string) => {});

const createResponsiveTheme = (color: ThemePaletteColorType, mode: string) => {
  return responsiveFontSizes(createTheme(applicationTheme(color, mode) as any));
};

type PaletteType = { [key: string]: string };

interface ThemeWrapperProps {
  children: ReactElement[];
  color: ThemePaletteColorType;
  mode: string;
  palette: PaletteType[];
  changeMode: ({ mode, user }: { mode: string; user?: string }) => void;
  changeTheme: ({ theme, user }: { theme: string; user?: string }) => void;
  config: ConfigType;
  isThemeEditorVisible: boolean;
  changeThemeEditorVisibility: (value: boolean) => void;
}

const ThemeWrapper: React.FC<ThemeWrapperProps> = ({
  changeMode,
  changeTheme,
  children,
  palette,
  color = "blueTheme",
  mode = "light",
  isThemeEditorVisible,
  changeThemeEditorVisibility,
  config,
}) => {
  const [theme, setTheme] = useState(createResponsiveTheme(color, mode));
  const [newPalette, setNewPalette] = useState<
    { [key: string]: string }[] | undefined
  >(undefined);
  const templateSettingsRef = useRef(null);

  useEffect(() => {
    setNewPalette(palette);
    initUserTheme();
  }, []);
  const handleChangeMode = (newMode: string) => {
    setTheme(createResponsiveTheme(color, newMode));
    changeMode({ mode: newMode });
  };

  const handleChangeTheme = (event: any) => {
    setTheme(createResponsiveTheme(event.target.value, mode));
    changeTheme({ theme: event.target.value, user: config.userName });
  };

  const initUserTheme = async () => {
    const themeColor = getLocalStorageValue("finaThemeColor", "blueTheme");
    const themeType = getLocalStorageValue("finaThemeType", "light");

    setTheme(createResponsiveTheme(themeColor, themeType));
    changeTheme({ theme: themeColor, user: config.userName });
    changeMode({ mode: themeType, user: config.userName });
  };
  const handleChangeThemeEditorVisibility = () => {
    changeThemeEditorVisibility(!isThemeEditorVisible);
  };

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Box
          sx={(theme) => ({
            width: "100%",
            height: "100%",
            minHeight: "100%",
            marginTop: 0,
            zIndex: 1,
            backgroundColor: theme.bodyBackgroundColor,
          })}
        >
          <TemplateSettings
            templateSettingsRef={templateSettingsRef}
            palette={newPalette}
            selectedValue={color}
            mode={mode}
            changeTheme={handleChangeTheme}
            changeMode={handleChangeMode}
            showThemeEditor={isThemeEditorVisible}
            changeVisibility={handleChangeThemeEditorVisibility}
          />
          <AppContext.Provider value={handleChangeMode}>
            {children}
          </AppContext.Provider>
        </Box>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

const reducer = "ui";
const mapStateToProps = (state: any) => ({
  force: state, // force state from reducer
  color: state.getIn([reducer, "theme"]),
  palette: state.getIn([reducer, "palette"]),
  mode: state.getIn([reducer, "type"]),
  isThemeEditorVisible: state.getIn([reducer, "isThemeEditorVisible"]),
  config: state.get("config").config,
});

const dispatchToProps = (dispatch: any) => ({
  changeTheme: bindActionCreators(changeThemeAction, dispatch),
  changeMode: bindActionCreators(changeModeAction, dispatch),
  changeThemeEditorVisibility: bindActionCreators(
    showThemeEditorAction,
    dispatch
  ),
});

const ThemeWrapperMapped = connect(
  mapStateToProps,
  dispatchToProps
)(ThemeWrapper);

export default React.memo(ThemeWrapperMapped);
