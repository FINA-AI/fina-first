import React from "react";

export interface MainMenuItem {
  key: string;
  name: string;
  icon?: React.ElementType;
  link: string;
  subLink?: string;
  groupSeparator?: string;
  isOpened?: boolean;
  i18nKey: string;
  permissions: string[];
  component?: React.ComponentType<any>;
  hidden?: boolean;
  i18n?: any;
  iframeSrc?: string;
  badge?: boolean;
}

export interface MainTabItem {
  key?: string;
  path: string;
  component: React.ComponentType<any>;
  item: MainMenuItem;
}

export interface PermittedMenuItem {
  code: string;
  i18n: any;
  iframeSrc: any;
  permissions: string[];
}
