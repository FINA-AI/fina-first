import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import Tabs from "@mui/material/Tabs";
import React, { useEffect, useMemo, useRef, useState } from "react";
import TabNavigationButton from "./TabNavigationButton";
import { useWindowSize } from "../../../util/appUtil";
import { useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";

interface TabNavigationProps {
  tabs: string[];
  activeTabName?: string;
  onTabClickFunction: (element: string, userId: string) => void;
  scrollButtonsShow: boolean;
}

const StyledAppBarContainer = styled(Box, {
  shouldForwardProp: (props) => props !== "bothBtnDisable",
})<{ bothBtnDisable: boolean }>(({ theme, bothBtnDisable }) => ({
  display: "flex",
  boxShadow: "none",
  alignItems: "center",
  height: "35px",
  width: "100%",
  overflow: "hidden",
  "& .MuiTabs-root": {
    alignItems: "center",
    background: "inherit",
  },
  "& .MuiTabs-flexContainer": {
    height: "32px !important",
  },
  "& .MuiButtonBase-root": {
    maxWidth: "190px",
    borderRadius: "40px",
    boxSizing: "border-box",
    alignItems: "center",
    flexDirection: "row",
    cursor: "pointer",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    marginRight: "12px",
    fontSize: "12px",
    lineHeight: "16px",
    fontWeight: 500,
    zIndex: "5",
    minHeight: "32px !important",
    padding: "8px 24px",
    textTransform: "capitalize",
    opacity: 1,
  },
  "& .MuiTabScrollButton-root": {
    display: bothBtnDisable ? "none !important" : "flex !important",
    opacity: "1",
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    border: `1px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    "& MuiSvgIcon-root": {
      color: theme.palette.primary.main,
    },
    margin: "0px 10px",
    padding: "inherit",
  },
  "& .MuiTabs-scrollButtons.Mui-disabled": {
    opacity: "0.3",
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    border: "1px solid",
    color: theme.palette.primary.main,
    padding: "inherit",
  },
}));

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTabName,
  onTabClickFunction,
  scrollButtonsShow,
}) => {
  const { userId }: { userId: string } = useParams();
  const [width] = useWindowSize();
  const [isBothBtnDisable, setIsBothBtnDisable] = useState<boolean>(true);
  const [tabsWidth, setTabsWidth] = useState<
    { index: number; width: number }[]
  >([]);
  const { t } = useTranslation();

  let bothBtnDisable = scrollButtonsShow
    ? !scrollButtonsShow
    : isBothBtnDisable;

  const onClickFunction = (element: string) => {
    onTabClickFunction(element, userId);
  };

  const isTabActive = (field: string) => {
    if (!activeTabName) return false;
    else return activeTabName.toLowerCase() === field.toLowerCase();
  };

  const tabRef = useRef<HTMLDivElement>(null);

  const memoizedValue = useMemo(
    () => tabs.findIndex((t) => t === activeTabName),
    [activeTabName]
  );

  useEffect(() => {
    if (!scrollButtonsShow) {
      let fullWidth = 0;
      for (let o of tabsWidth) {
        fullWidth += o.width + 12;
      }
      if (tabRef.current) {
        //94 = buttons width + buttons margin - last tabs right padding
        setIsBothBtnDisable(tabRef.current.clientWidth > fullWidth + 94);
      }
    }
  }, [width]);

  return (
    <StyledAppBarContainer bothBtnDisable={bothBtnDisable} ref={tabRef}>
      <Tabs
        value={memoizedValue}
        TabIndicatorProps={{
          style: {
            display: "none",
          },
        }}
        variant="scrollable"
        aria-label="scrollable auto tabs example"
        scrollButtons
        data-testid={"tab-navigation"}
      >
        {tabs.map((element, index) => {
          return (
            <TabNavigationButton
              key={index}
              dataTestId={element}
              getTabInfo={(width) =>
                setTabsWidth((tabsWidth) => [
                  ...tabsWidth,
                  {
                    index: index,
                    width: width,
                  },
                ])
              }
              onClickFunction={onClickFunction}
              index={index}
              label={t(element)}
              isTabActive={isTabActive(element)}
              element={element}
              data-testid={element}
            />
          );
        })}
      </Tabs>
    </StyledAppBarContainer>
  );
};

export default React.memo(TabNavigation, (prevProps, nextProps) => {
  return (
    prevProps.activeTabName === nextProps.activeTabName &&
    prevProps.tabs === nextProps.tabs
  );
});
