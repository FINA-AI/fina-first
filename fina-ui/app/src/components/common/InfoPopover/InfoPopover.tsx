import React, { FC, useState } from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

interface InfoPopoverProps {
  info: Record<string, string>;
  isActive?: boolean;
}

const StyledInfoOutlinedIcon = styled(InfoOutlinedIcon, {
  shouldForwardProp: (props) => props !== "isActive",
})<{ isActive: boolean }>(({ isActive }) => ({
  height: "17px",
  alignSelf: "start",
  margin: "2px",
  color: isActive ? "#FFFFFF" : "#AEB8CB",
}));

const StyledPopoverBox = styled(Box)(({ theme }: any) => ({
  backgroundColor: theme.palette.tooltipBackground,
  color: "#FFF",
  fontSize: "11px",
  lineHeight: "16px",
  padding: "8px 16px",
}));

const InfoPopover: FC<InfoPopoverProps> = ({ info, isActive = false }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event: any) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const newInfo: string[] = [];
  Object.keys(info).forEach((key) => {
    newInfo.push(`${key}: ${info[key]}`);
  });

  const open = Boolean(anchorEl);
  return (
    <Box>
      <StyledInfoOutlinedIcon
        isActive={isActive}
        aria-owns={open ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        onClick={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      />
      <Popover
        id="mouse-over-popover"
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        disableRestoreFocus
        sx={{ pointerEvents: "none" }}
      >
        <StyledPopoverBox>
          {newInfo.map((e, i) => {
            return <Typography key={i}>{e}</Typography>;
          })}
        </StyledPopoverBox>
      </Popover>
    </Box>
  );
};

export default InfoPopover;
