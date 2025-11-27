import "@mui/material/styles";
import { CSSProperties } from "react";
import { PalettePropsType } from "./palette.type";

interface CustomThemeProperties {
  bodyBackgroundColor: string;
  shade: CSSProperties;
  glow: CSSProperties;
  rounded: {
    smallRadius: string;
    mediumRadius: string;
    bigRadius: string;
  };
  links: CSSProperties;
  shadows: CSSProperties;
  aHref: CSSProperties;
  aHrefUserProfile: CSSProperties;
  page: CSSProperties;
  pageContent: CSSProperties;
  pageTitle: CSSProperties;
  pageToolbar: CSSProperties;
  pagePaging: (props: { size?: string }) => CSSProperties;
  tableHeaderCell: (props: { isSmall: boolean }) => CSSProperties;
  modalHeader: CSSProperties;
  general: CSSProperties;
  toolbar: CSSProperties;
  defaultIcon: CSSProperties;
  smallIcon: CSSProperties;
  breadcrumb: {
    main: CSSProperties;
    icon: CSSProperties;
    text: CSSProperties;
  };
  customizeInput: (props: {
    size: string;
    width: string;
    isAutocomplete: boolean;
    isTextArea: boolean;
    height: string;
    isDisabled: boolean;
    isError: boolean;
  }) => {
    textField: CSSProperties;
    fieldValue: CSSProperties;
    fieldLabel: CSSProperties;
  };
  inputValue: CSSProperties;
  cellText: CSSProperties;
  sideMenu: {
    mainText: CSSProperties;
    secondaryText: CSSProperties;
  };
  btn: CSSProperties;
  icon: CSSProperties;
  modalTitle: CSSProperties;
  ModalBody: CSSProperties;
  modalFooter: CSSProperties;
  primaryBtn: CSSProperties;
  ghostBtn: CSSProperties;
  configResponsiveCard: CSSProperties;
  mainLayout: CSSProperties;
}

interface CustomTypeAction {
  select: CSSProperties;
  hover: CSSProperties;
  hoverOpacity: CSSProperties;
}

interface CustomPalette extends PalettePropsType {
  textColor?: string;
  secondaryTextColor?: string;
  paperBackground?: string;
  paperBoxShadow?: string;
  textFieldBorder?: string;
  tooltipBackground?: string;
  borderColor?: string;
  labelColor?: string;
  disableLabelColor?: string;
  iconColor?: string;
  errorColor?: string;
}

declare module "@mui/material/styles" {
  interface Theme extends CustomThemeProperties {}
  interface Palette extends CustomPalette {}
  interface TypeAction extends CustomTypeAction {}
}

declare module "@mui/system" {
  interface Theme extends CustomThemeProperties {}
  interface Palette extends CustomPalette {}
  interface TypeAction extends CustomTypeAction {}
}
