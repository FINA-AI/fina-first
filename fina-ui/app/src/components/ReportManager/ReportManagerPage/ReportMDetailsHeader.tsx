import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { IconButton, Typography } from "@mui/material";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { Box } from "@mui/system";
import React from "react";
import { styled } from "@mui/material/styles";

interface ReportMDetailsHeaderProps {
  setIsMinimized: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDetailPageOpen: React.Dispatch<React.SetStateAction<boolean>>;
  code: string;
  isMinimized: boolean;
}

const StyledInfoBarHeader = styled(Box)(({ theme }: any) => ({
  padding: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: theme.palette.paperBackground,
  borderBottom: theme.palette.borderColor,
}));

const StyledMainHeadline = styled(Typography)(({ theme }: any) => ({
  fontSize: 14,
  fontWeight: 600,
  color: theme.palette.textColor,
}));

const StyledCollapseIcon = styled(KeyboardDoubleArrowRightIcon)(
  ({ theme }: any) => ({
    color: theme.palette.iconColor,
    cursor: "pointer",
  })
);

const ReportMDetailsHeader: React.FC<ReportMDetailsHeaderProps> = ({
  isMinimized,
  setIsMinimized,
  setIsDetailPageOpen,
  code,
}) => {
  return (
    <StyledInfoBarHeader
      flexDirection={isMinimized ? "column" : "row"}
      height={isMinimized ? "100%" : "fit-content"}
    >
      <StyledCollapseIcon
        style={{
          transform: isMinimized ? "rotate(180deg)" : "",
        }}
        onClick={() => setIsMinimized(!isMinimized)}
      />
      <Box
        display="flex"
        alignItems="center"
        style={{
          transform: isMinimized ? "rotate(90deg)" : "",
          flex: isMinimized ? 1 : "",
        }}
      >
        <AssignmentIcon
          style={{
            color: "#1c7483",
          }}
        />
        <StyledMainHeadline ml={"5px"}>{code}</StyledMainHeadline>
      </Box>
      {!isMinimized && (
        <IconButton
          onClick={() => {
            setIsDetailPageOpen(false);
          }}
        >
          <ClearRoundedIcon fontSize={"small"} />
        </IconButton>
      )}
    </StyledInfoBarHeader>
  );
};

export default ReportMDetailsHeader;
