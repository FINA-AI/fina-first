import { Box, IconButton } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import Tooltip from "../../common/Tooltip/Tooltip";
import { keyframes, styled } from "@mui/material/styles";
import React, { ReactNode } from "react";
import { WarningInfo } from "./ReportGenerationWizard";

interface ReportGenerationWizardMovementContainerProps {
  arrowRightActive: boolean;
  arrowLeftActive: boolean;
  arrowUpActive: boolean;
  arrowDownActive: boolean;
  warningIconInfo?: Partial<WarningInfo>;
  onVerticalMove(up: boolean): void;
  onHorizontalMove(leftToRight: boolean): void;
}

const blink = keyframes({
  "0%": {
    opacity: 1,
  },
  "25%": {
    opacity: 0,
  },
  "50%": {
    opacity: 1,
  },
  "75%": {
    opacity: 0,
  },
  "100%": {
    opacity: 1,
  },
});

const StyledArrowIconContainer = styled(Box)({
  "& .Mui-disabled": {
    border: "1px solid rgba(0, 0, 0, 0.26) !important",
  },
});

const StyledMovementContainer = styled(Box)(({ theme }) => ({
  flexDirection: "column",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  display: "flex",
  backgroundColor: theme.palette.mode === "dark" ? "#3c4d68" : "#F9F9F9",
}));

const StyledArrowIconButton = styled(IconButton)<{ component?: ReactNode }>({
  borderRadius: "25px",
  border: "1px solid #2962FF",
  width: 28,
  height: 28,
  "& .MuiSvgIcon-root": {
    width: 15,
    height: 15,
  },
  margin: "10px 0px",
  "&:hover": {
    backgroundColor: "#2962FF",
    "& .MuiSvgIcon-root": {
      color: "#FFFFFF",
    },
  },
});

const StyledWarningIconContainer = styled(Box)(({ theme }) => ({
  justifyContent: "center",
  alignItems: "center",
  color: theme.palette.mode === "dark" ? "#FDB022" : "#FF8D00",
  animation: `${blink} 2s`,
}));

const ReportGenerationWizardMovementContainer: React.FC<
  ReportGenerationWizardMovementContainerProps
> = ({
  onHorizontalMove,
  onVerticalMove,
  arrowRightActive,
  arrowLeftActive,
  arrowUpActive,
  arrowDownActive,
  warningIconInfo,
}) => {
  return (
    <StyledMovementContainer aria-label={"center container"}>
      <StyledArrowIconContainer
        display={"flex"}
        alignItems={"center"}
        flexDirection={"column"}
      >
        <StyledArrowIconButton
          color="primary"
          component="label"
          onClick={() => {
            onHorizontalMove(true);
          }}
          disabled={!arrowRightActive}
          data-testid={"arrow-forward"}
        >
          <ArrowForwardIosIcon />
        </StyledArrowIconButton>
        <StyledArrowIconButton
          onClick={() => {
            onHorizontalMove(false);
          }}
          color="primary"
          component="label"
          disabled={!arrowLeftActive}
          data-testid={"arrow-back"}
        >
          <ArrowBackIosNewIcon />
        </StyledArrowIconButton>
        <StyledArrowIconButton
          onClick={() => {
            onVerticalMove(true);
          }}
          color="primary"
          component="label"
          disabled={!arrowUpActive}
          style={{ transform: "rotate(-90deg)" }}
          data-testid={"arrow-up"}
        >
          <ArrowForwardIosIcon />
        </StyledArrowIconButton>
        <StyledArrowIconButton
          onClick={() => {
            onVerticalMove(false);
          }}
          color="primary"
          component="label"
          disabled={!arrowDownActive}
          style={{ transform: "rotate(-90deg)" }}
          data-testid={"arrow-down"}
        >
          <ArrowBackIosNewIcon />
        </StyledArrowIconButton>
      </StyledArrowIconContainer>
      <StyledWarningIconContainer
        sx={{ display: warningIconInfo?.visibility ? "flex" : "none" }}
      >
        <Tooltip title={warningIconInfo?.title || ""}>
          <WarningRoundedIcon fontSize={"large"} />
        </Tooltip>
      </StyledWarningIconContainer>
    </StyledMovementContainer>
  );
};

export default ReportGenerationWizardMovementContainer;
