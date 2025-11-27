import * as React from "react";
import Popover from "@mui/material/Popover";
import { Box } from "@mui/system";
import { styled } from "@mui/material/styles";

interface ReportScheduleManagerReviewProps {
  anchorEl: Element | null;
  setAnchorEl: (el: Element | null) => void;
  handleClickReview(type: string): void;
}

const StyledStatusItem = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  fontWeight: 400,
  fontSize: "11px",
  lineHeight: "16px",
  textTransform: "capitalize",
  padding: "4px",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.1);",
  },
});

const StyledPopover = styled(Popover)({
  top: 4,
  "& .MuiPopover-paper": {
    backgroundColor: "#2A3341 !important",
    width: "110px",
    color: "#FFFFFF",
    padding: "4px",
  },
});

const ReportScheduleManagerReview: React.FC<
  ReportScheduleManagerReviewProps
> = ({ anchorEl, setAnchorEl, handleClickReview }) => {
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <StyledPopover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <StyledStatusItem
        onClick={() => {
          handleClickReview("XLSX");
        }}
      >
        XLSX
      </StyledStatusItem>
    </StyledPopover>
  );
};

export default ReportScheduleManagerReview;
