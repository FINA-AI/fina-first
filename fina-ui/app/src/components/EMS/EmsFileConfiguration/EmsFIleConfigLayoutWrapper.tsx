import EmsFileConfigContainer from "../../../containers/Ems/EmsFileConfiguration/EmsFileConfigContainer";
import React, { useRef, useState } from "react";
import EmsFileConfigDetailContainer from "../../../containers/Ems/EmsFileConfiguration/EmsFileConfigDetailContainer";
import Box from "@mui/material/Box";
import { IconButton } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { resizerMovement } from "../../../util/appUtil";
import EMSMainLayoutResizer from "../EmsLayout/EMSMainLayoutResizer";
import { styled, useTheme } from "@mui/material/styles";

const StyledRoot = styled(Box)({
  height: "100%",
  display: "flex",
  width: " 100%",
  boxSizing: "border-box",
  flexWrap: "nowrap",
  justifyContent: "center",
});

const StyledMainGrid = styled(Box)({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  minWidth: "0px",
});

const StyledHeader = styled(Box)(({ theme }: any) => ({
  padding: "10px",
  height: "16px",
  color: "#FFF",
  fontSize: "13px",
  lineHeight: "16px",
  backgroundColor:
    theme.palette.mode === "dark" ? "rgb(102, 108, 137)" : "#157fcc",
  minHeight: "0px",
  borderTop: theme.palette.borderColor,
}));

const StyledDetailHeader = styled(Box)(({ theme }: any) => ({
  height: "16px",
  padding: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor:
    theme.palette.mode === "dark" ? "rgb(102, 108, 137)" : "#157fcc",
}));

const StyledVerticalDetail = styled("span")({
  writingMode: "vertical-rl",
  transformOrigin: "bottom",
  color: "#FFF",
  letterSpacing: "1px",
  fontSize: "15px",
  marginTop: "10px",
});

const StyledText = styled("div")({
  color: "#FFF",
  fontSize: "13px",
  lineHeight: "16px",
});

const StyledIconButton = styled(IconButton)(({ theme }: any) => ({
  width: "25px",
  height: "25px",
  background: theme.palette.mode === "dark" ? "rgb(45, 55, 71)" : "#A9D2EE",
  color: "#FFFFFF",
}));

const EmsFIleConfigLayoutWrapper = () => {
  const theme: any = useTheme();

  const [selectedFileId, setSelectedFileId] = useState<undefined | number>(
    undefined
  );

  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(true);
  const isMouseDownRef = useRef(false);
  const resizerRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: React.MouseEvent) => {
    resizerMovement(isMouseDownRef.current, event.clientX, resizerRef);
  };

  const onDetailClose = (): void => {
    setIsDetailOpen(false);
  };

  const onDetailOpen = (): void => {
    setIsDetailOpen(true);
  };

  return (
    <StyledRoot
      onMouseMove={handleMouseMove}
      ref={mainContainerRef}
      data-testid={"file-configuration-page"}
    >
      <StyledMainGrid data-testid={"main-container"}>
        <StyledHeader>
          <StyledText>Import / Export Files Configuration</StyledText>
        </StyledHeader>
        <EmsFileConfigContainer setSelectedFileId={setSelectedFileId} />
      </StyledMainGrid>

      {isDetailOpen && (
        <EMSMainLayoutResizer
          isMouseDownRef={isMouseDownRef}
          resizerRef={resizerRef}
          menuRef={detailRef}
          mainContainerRef={mainContainerRef}
          minWidth={150}
          position={"right"}
        />
      )}

      <StyledRoot
        ref={detailRef}
        style={{
          width: isDetailOpen ? "45%" : "40px",
          minWidth: isDetailOpen ? "45%" : "40px",
          backgroundColor: isDetailOpen
            ? "inherit"
            : theme.palette.mode === "dark"
            ? "rgb(102, 108, 137)"
            : "#157fcc",
          borderLeft: !isDetailOpen && theme.palette.borderColor,
          borderTop: theme.palette.borderColor,
        }}
      >
        <StyledMainGrid
          style={{ display: isDetailOpen ? "block" : "none" }}
          data-testid={"detail-container"}
        >
          <StyledDetailHeader>
            <StyledText>File Configuration Attributes</StyledText>
            <div>
              <StyledIconButton
                onClick={() => onDetailClose()}
                data-testid={"detail-close-button"}
              >
                <KeyboardArrowRightIcon />
              </StyledIconButton>
            </div>
          </StyledDetailHeader>
          <EmsFileConfigDetailContainer selectedFileId={selectedFileId} />
        </StyledMainGrid>
        {!isDetailOpen && (
          <Box
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"space-between"}
            padding={"10px 0px"}
          >
            <StyledVerticalDetail>
              File Configuration Attributes
            </StyledVerticalDetail>
            <StyledIconButton
              onClick={() => onDetailOpen()}
              data-testid={"detail-open-button"}
            >
              <KeyboardArrowLeftIcon />
            </StyledIconButton>
          </Box>
        )}
      </StyledRoot>
    </StyledRoot>
  );
};

export default EmsFIleConfigLayoutWrapper;
