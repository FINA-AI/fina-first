import type { ReactNode, ComponentType } from "react";

export interface MenuItem {
  key: string;
  name: string;
  icon: ReactNode;
  link: string;
  subLink?: string | undefined | null;
  isOpened?: boolean;
  i18nKey?: string;
  permissions?: string[];
  component?: ComponentType<any>;
}
