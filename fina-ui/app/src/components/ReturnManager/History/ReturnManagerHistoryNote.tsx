import { Box, darken } from "@mui/system";
import React, { useState } from "react";
import { IconButton, Typography } from "@mui/material";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import Tooltip from "../../common/Tooltip/Tooltip";
import { styled } from "@mui/material/styles";

interface ReturnManagerHistoryNoteProps {
  setIsNoteOpen: (open: boolean) => void;
  data?: string;
}

const getIconStyles = (theme: any) => ({
  color: "#98A7BC",
  ...theme.smallIcon,
});

const StyledRoot = styled(Box)<{ zoomed: boolean }>(
  ({ theme, zoomed }: { theme: any; zoomed: boolean }) => ({
    height: zoomed ? 280 : 120,
    width: "100%",
    backgroundColor:
      theme.palette.mode === "dark"
        ? darken(theme.palette.paperBackground, 0.2)
        : theme.palette.paperBackground,

    position: "relative",
    bottom: -9,
    zIndex: 9999,
    boxShadow: theme.palette.paperBoxShadow,
    borderRadius: 4,
  })
);

const StyledHeader = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  padding: "12px 16px 0px 16px",
});
const StyledIconBtn = styled(IconButton)({
  padding: "4px",
});

const StyledTitle = styled(Typography)(({ theme }: { theme: any }) => ({
  fontSize: 11,
  lineHeight: "16px",
  color: theme.palette.textColor,
}));

const StyledText = styled(Typography)(({ theme }: { theme: any }) => ({
  color: theme.palette.secondaryTextColor,
  lineHeight: "20px",
  fontSize: 12,
}));

const StyledRemoveIcon = styled(RemoveRoundedIcon)(({ theme }) =>
  getIconStyles(theme)
);
const StyledArrowUpIcon = styled(KeyboardArrowUpRoundedIcon)(({ theme }) =>
  getIconStyles(theme)
);
const StyledArrowDownIcon = styled(KeyboardArrowDownRoundedIcon)(({ theme }) =>
  getIconStyles(theme)
);
const ReturnManagerHistoryNote: React.FC<ReturnManagerHistoryNoteProps> = ({
  setIsNoteOpen,
  data,
}) => {
  const [zoomed, setZoomed] = useState(false);

  return (
    <StyledRoot zoomed={zoomed}>
      <StyledHeader>
        <StyledTitle>Note</StyledTitle>
        <Box>
          <StyledIconBtn onClick={() => setIsNoteOpen(false)}>
            <StyledRemoveIcon />
          </StyledIconBtn>
          <Tooltip title={zoomed ? "Zoom Out" : "Zoom In"}>
            <StyledIconBtn onClick={() => setZoomed(!zoomed)}>
              {!zoomed ? <StyledArrowUpIcon /> : <StyledArrowDownIcon />}
            </StyledIconBtn>
          </Tooltip>
        </Box>
      </StyledHeader>
      <Box p={"0 16px 12px 16px"}>
        <StyledText>{data}</StyledText>
      </Box>
    </StyledRoot>
  );
};

export default ReturnManagerHistoryNote;
