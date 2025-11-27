import React, { ReactNode, useRef, useState } from "react";
import EmsMainLayoutLeftSide from "./EmsMainLayoutLeftSide";
import { useTranslation } from "react-i18next";
import EMSMainLayoutResizer from "./EMSMainLayoutResizer";
import { resizerMovement } from "../../../util/appUtil";
import { useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

interface EmsMainLayoutWrapperProps {
  children: ReactNode;
}

const StyledRoot = styled(Box)({
  height: "100%",
  display: "flex",
  width: " 100%",
  boxSizing: "border-box",
  flexWrap: "nowrap",
});

const StyledMainGrid = styled(Box)({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
  flexWrap: "nowrap",
  minWidth: "0px",
});

const StyledMainHeader = styled(Box)(({ theme }: any) => ({
  padding: "10px",
  color: theme.palette.textColor,
  fontSize: "13px",
  lineHeight: "16px",
  backgroundColor:
    theme.palette.mode === "dark" ? "rgb(102, 108, 137)" : "#157fcc",
  minHeight: "17px",
}));

const EmsMainLayoutWrapper: React.FC<EmsMainLayoutWrapperProps> = ({
  children,
}) => {
  const { t } = useTranslation();

  const isMouseDownRef = useRef(false);
  const resizerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const tabRoute = location.pathname.replace("/ems/", "");

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(true);

  const handleMouseMove = (event: React.MouseEvent) => {
    resizerMovement(isMouseDownRef.current, event.clientX, resizerRef);
  };

  return (
    <StyledRoot onMouseMove={handleMouseMove} ref={mainContainerRef}>
      <EmsMainLayoutLeftSide
        menuRef={menuRef}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      {isMenuOpen && (
        <EMSMainLayoutResizer
          isMouseDownRef={isMouseDownRef}
          resizerRef={resizerRef}
          menuRef={menuRef}
          mainContainerRef={mainContainerRef}
          minWidth={150}
          position={"left"}
        />
      )}
      <StyledMainGrid>
        <StyledMainHeader>{t(tabRoute)}</StyledMainHeader>
        <div
          style={{
            height: "100%",
            minHeight: 0,
          }}
        >
          {children}
        </div>
      </StyledMainGrid>
    </StyledRoot>
  );
};

export default EmsMainLayoutWrapper;
