import Modal from "@mui/material/Modal";
import CloseBtn from "../Button/CloseBtn";
import { Backdrop, Box, CircularProgress, IconButton } from "@mui/material";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import React, {
  CSSProperties,
  ReactElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { ResizeHandleIcon } from "../../../api/ui/icons/ResizeHandleIcon";

interface paperStylesType {
  width?: number | string;
  height?: number | string;
  padding?: number | string;
  border?: string;
  hover?: CSSProperties;
}

interface ClosableModalProps extends paperStylesType {
  open: boolean;
  onClose: (event?: {}, reason?: string) => void;
  title?: string;
  children: ReactElement | ReactElement[];
  includeHeader?: boolean;
  disableBackdropClick?: boolean;
  titleFontWeight?: string;
  expand?: boolean;
  loading?: boolean;
  draggable?: boolean;
  resizable?: boolean;
}

const StyledModal = styled(Modal)(({ theme }: any) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: theme.zIndex.modal,
}));

const StyledContent = styled(Box)<paperStylesType>(
  ({ width, height, padding, border, hover, theme }) => ({
    outline: "none",
    width: width ? width : "inherit",
    height: height ? height : "inherit",
    background: (theme as any).paperBackground,
    borderRadius: 10,
    padding: padding && padding,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    border: border ? border : "",
    "&:hover": {
      ...(hover || {}),
      "& .dropzone": {
        background: hover?.background,
      },
    },
  })
);

const StyledHeader = styled(Box)(({ theme }: any) => ({
  ...theme.modalHeader,
  display: "flex",
  alignItems: "center",
}));

const StyledHeaderButtonsBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  marginLeft: "auto",
}));

const StyledTitleWrapper = styled("span")<{ titleFontWeight?: string }>(
  ({ titleFontWeight, theme }) => ({
    width: "100%",
    fontWeight: titleFontWeight ? titleFontWeight : "600",
    fontSize: "13px",
    lineHeight: "20px",
    textTransform: "capitalize",
    ...(theme as any).modalTitle,
  })
);

const StyledIconButton = styled(IconButton)(() => ({
  transform: "rotate(-45deg)",
  color: "#9AA7BE",
  padding: "1px",
  top: "0.51px",
  width: "18px",
  height: "18px",
  "&:hover": {
    backgroundColor: "rgba(80,80,80, 0.05)",
    borderRadius: "12px",
  },
}));

const commonUnfoldStyles = () => ({
  "& .MuiSvgIcon-root": {
    width: "18px",
    height: "18px",
    fontSize: "18px",
  },
  width: "18px",
  height: "18px",
});

const StyledUnfoldLessIcon = styled(UnfoldLessIcon)(() => ({
  ...commonUnfoldStyles,
}));

const StyledUnfoldMoreIcon = styled(UnfoldMoreIcon)(() => ({
  ...commonUnfoldStyles,
}));

const StyledBackdrop = styled(Backdrop)(({ theme }: any) => ({
  zIndex: theme.zIndex.modal + 1,
  color: "#fff",
  position: "absolute",
  "&.MuiBackdrop-root": {
    backgroundColor:
      theme.palette.mode === "light" ? "rgb(128,128,128,0.3)" : "",
  },
}));

const ResizerHandle = styled("div")(({ theme }: any) => ({
  position: "absolute",
  width: "14px",
  height: "14px",
  right: "2px",
  bottom: "2px",
  cursor: "nwse-resize",
  zIndex: 10,
  "& svg": {
    color:
      theme.palette.mode === "dark"
        ? "#acb7cbd1 !important"
        : "#2b3748a8 !important",
    height: "15px",
    width: "15px",
  },
}));

const ClosableModal: React.FC<ClosableModalProps> = ({
  children,
  onClose,
  open = false,
  title,
  includeHeader = true,
  width,
  height,
  disableBackdropClick = false,
  padding,
  titleFontWeight,
  border,
  hover = { background: "" },
  expand = false,
  draggable = false,
  resizable = false,
  loading,
}) => {
  const [isExpand, setIsExpand] = useState<boolean>(false);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });

  const [resizing, setResizing] = useState(false);
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });

  useLayoutEffect(() => {
    if ((!draggable && !resizable) || !width || !height) return;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const getPercent = (value: string | number, total: number) => {
      if (typeof value === "string" && value.endsWith("%")) {
        return (parseFloat(value) / 100) * total;
      }
      const numeric = Number(value);
      return !isNaN(numeric) ? (numeric / 100) * total : null;
    };

    const modalWidth = getPercent(width, screenWidth);
    const modalHeight = getPercent(height, screenHeight);

    if (modalWidth != null && modalHeight != null) {
      setSize({ width: modalWidth, height: modalHeight });

      const centerX = screenWidth / 2 - modalWidth / 2;
      const centerY = screenHeight / 2 - modalHeight / 2;
      setPosition({ x: centerX, y: centerY });
    }
  }, []);

  useEffect(() => {
    if (!draggable && !resizable) return;

    if (dragging || resizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, resizing]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) {
      const newX = e.clientX - dragStart.current.x;
      const newY = e.clientY - dragStart.current.y;
      setPosition({ x: newX, y: newY });
    } else if (resizing) {
      const deltaX = e.clientX - resizeStart.current.x;
      const deltaY = e.clientY - resizeStart.current.y;
      setSize({
        width: Math.max(200, resizeStart.current.width + deltaX),
        height: Math.max(150, resizeStart.current.height + deltaY),
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    setResizing(false);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setResizing(true);
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    };
  };

  return (
    <>
      <StyledBackdrop open={!!loading}>
        <CircularProgress color={"inherit"} />
      </StyledBackdrop>
      <StyledModal
        open={open}
        onClose={(event, reason) => {
          if (disableBackdropClick && reason === "backdropClick") {
            return;
          }
          onClose(event, reason);
        }}
        style={{
          maxHeight: `100%`,
        }}
      >
        <StyledContent
          display={"flex"}
          maxHeight={"100%"}
          component={Paper}
          width={width}
          height={height}
          padding={padding}
          border={border}
          hover={hover}
          data-testid={"custom-closable-modal"}
          style={
            draggable || resizable
              ? {
                  top: position.y,
                  left: position.x,
                  width: isExpand ? "100%" : size.width,
                  height: isExpand ? "100%" : size.height,
                  marginLeft: isExpand ? "70px" : undefined,
                  position: "absolute",
                }
              : isExpand
              ? { width: "100%", height: "100%", marginLeft: "70px" }
              : {}
          }
        >
          {includeHeader && (
            <StyledHeader
              flex={0}
              onMouseDown={(e) => {
                if (draggable) {
                  handleMouseDown(e);
                }
              }}
            >
              <StyledTitleWrapper titleFontWeight={titleFontWeight}>
                {title}
              </StyledTitleWrapper>
              <StyledHeaderButtonsBox>
                {expand &&
                  (isExpand ? (
                    <StyledIconButton
                      onClick={() => {
                        setIsExpand(false);
                      }}
                    >
                      <StyledUnfoldLessIcon />
                    </StyledIconButton>
                  ) : (
                    <StyledIconButton
                      onClick={() => {
                        setIsExpand(true);
                      }}
                    >
                      <StyledUnfoldMoreIcon />
                    </StyledIconButton>
                  ))}
                <CloseBtn onClick={onClose} />
              </StyledHeaderButtonsBox>
            </StyledHeader>
          )}
          <Box flex={1} overflow={"hidden"}>
            {children}
          </Box>
          {resizable && (
            <ResizerHandle onMouseDown={handleResizeStart}>
              <ResizeHandleIcon />
            </ResizerHandle>
          )}
        </StyledContent>
      </StyledModal>
    </>
  );
};

export default ClosableModal;
