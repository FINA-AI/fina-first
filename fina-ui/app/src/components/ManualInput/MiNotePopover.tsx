import * as React from "react";
import Popover from "@mui/material/Popover";
import TextField from "../common/Field/TextField";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

interface MiNotePopoverProps {
  anchorEl: Element | null;
  setAnchorEl: (el: Element | null) => void;
  noteValue: string;
  setNoteValue: (value: string) => void;
}

const StyledPopover = styled(Popover)(({ theme }) => ({
  top: "10px",
  "& .MuiPopover-paper": {
    backgroundColor: (theme as any).palette.paperBackground,
    width: "350px",
    color: "#FFFFFF",
    padding: "4px",
  },
}));

const MiNotePopover: React.FC<MiNotePopoverProps> = ({
  anchorEl,
  setAnchorEl,
  noteValue,
  setNoteValue,
}) => {
  const { t } = useTranslation();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <StyledPopover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
    >
      <Box padding={"9px 9px"}>
        <TextField
          value={noteValue}
          onChange={(value: string) => setNoteValue(value)}
          label={t("note")}
          multiline={true}
          rows={5}
        />
      </Box>
    </StyledPopover>
  );
};

export default MiNotePopover;
