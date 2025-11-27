import Tooltip from "../common/Tooltip/Tooltip";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import { StyledListItemText } from "./sidebar-jss";
import { MainMenuItem } from "../../types/mainMenu.type";

interface SidebarLabelProps {
  item: MainMenuItem;
  langCode: string;
}

const StyledTooltip = styled(Tooltip)({
  color: "white",
  fontSize: "13px",
});

const SidebarLabel: React.FC<SidebarLabelProps> = ({ item, langCode }) => {
  const { t } = useTranslation();
  const [isOverflowing, setIsOverflowing] = useState(false);
  const ref = useRef(null);

  const getLabel = (item: MainMenuItem) => {
    if (item.i18n && item.i18n[langCode]) {
      return item.i18n[langCode];
    }
    const translatedName = t(item.i18nKey);
    return translatedName ? translatedName : item.name;
  };

  useEffect(() => {
    const el: any = ref.current;
    if (!el) return;
    const clone = el.cloneNode(true);
    clone.style.whiteSpace = "nowrap";
    clone.style.overflow = "visible";
    clone.style.position = "absolute";
    clone.style.visibility = "hidden";
    clone.style.width = "auto";
    el.parentNode.appendChild(clone);
    setIsOverflowing(clone.scrollWidth > el.offsetWidth);
    clone.parentNode.removeChild(clone);
  }, []);

  return (
    <StyledTooltip
      title={isOverflowing ? getLabel(item) : ""}
      disableInteractive
    >
      <StyledListItemText
        ref={ref}
        style={{
          color: "white",
        }}
        primary={getLabel(item)}
      />
    </StyledTooltip>
  );
};

export default SidebarLabel;
