import { Tab, Tooltip } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { styled } from "@mui/material/styles";

interface TabNavigationButtonProps {
  index: number;
  onClickFunction: (element: string) => void;
  label: string;
  element: string;
  getTabInfo: (width: number) => void;
  isTabActive: boolean;
  dataTestId: string;
}

const StyledTab = styled(Tab, {
  shouldForwardProp: (props) => props !== "isTabActive",
})<{ isTabActive: boolean }>(({ theme, isTabActive }) => ({
  display: "block",
  border: theme.palette.mode === "dark" ? "1px solid #3C4D68" : "",
  backgroundColor: isTabActive
    ? theme.palette.primary.main
    : theme.palette.mode === "dark"
    ? "#2D3747"
    : (theme as any).palette.buttons.secondary.backgroundColor,
  color: isTabActive
    ? theme.palette.mode === "dark"
      ? "#1F2532"
      : "#FFFFFF"
    : theme.palette.mode === "dark"
    ? "#F5F7FA"
    : "inherit",
}));

const TabNavigationButton: React.FC<TabNavigationButtonProps> = ({
  index,
  onClickFunction,
  label,
  element,
  getTabInfo,
  isTabActive,
  dataTestId,
}) => {
  const textElementRef = useRef<HTMLDivElement>(null);
  const getTooltipValue = () => {
    if (textElementRef?.current) {
      return textElementRef.current.scrollWidth >
        textElementRef.current.clientWidth
        ? label
        : "";
    } else {
      return "";
    }
  };

  useEffect(() => {
    if (textElementRef.current) {
      getTabInfo(textElementRef.current.clientWidth);
    }
  }, []);

  return (
    <Tooltip title={getTooltipValue()} arrow key={index}>
      <StyledTab
        ref={textElementRef}
        isTabActive={isTabActive}
        onClick={() => onClickFunction(element)}
        key={index}
        label={label}
        value={index}
        data-testid={dataTestId}
      />
    </Tooltip>
  );
};

export default TabNavigationButton;
