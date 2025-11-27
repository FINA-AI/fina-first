import { Box, Button, IconButton } from "@mui/material";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import Popover from "@mui/material/Popover";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";

const StyledButton = styled(Button)({
  fontFamily: "Inter",
  fontStyle: "normal",
  textTransform: "none",
  fontWeight: 400,
  fontSize: 11,
  color: "#FFFFFF",
  justifyContent: "flex-start",
  "&.Mui-disabled": {
    color: "#FFFFFF",
    opacity: "50%",
  },
  "&:hover": {
    backgroundColor: "#414a57",
  },
});

const StyledTooltip = styled(Box)({
  padding: "4px",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#2C3644",
});

const StyledMoreVertRoundedIcon = styled(MoreVertRoundedIcon)(
  ({ theme }: any) => ({
    ...theme.smallIcon,
  })
);

interface ToolbarPopoverProps {
  selectedItem?: Record<string, any> | null;
  addFunction: () => void;
  editFunction: () => void;
  deleteFunction: () => void;
}

const ToolbarPopover: React.FC<ToolbarPopoverProps> = ({
  selectedItem,
  addFunction,
  editFunction,
  deleteFunction,
}) => {
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const popoverOpenHandler = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const popoverCloseHandler = () => {
    setAnchorEl(null);
  };

  const disabledButtonFunc = () => {
    return !selectedItem || Object.keys(selectedItem).length === 0;
  };
  return (
    <>
      <IconButton
        onClick={popoverOpenHandler}
        data-testid={"optionsBtn"}
        sx={{ borderRadius: "2px", padding: "2px", border: "none" }}
      >
        <StyledMoreVertRoundedIcon />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={popoverCloseHandler}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <StyledTooltip>
          <StyledButton
            data-testid={"addBtn"}
            onClick={() => {
              addFunction();
              setAnchorEl(null);
            }}
          >
            {t("add")}
          </StyledButton>
          <StyledButton
            data-testid={"editBtn"}
            disabled={disabledButtonFunc()}
            onClick={() => {
              editFunction();
              setAnchorEl(null);
            }}
          >
            {t("edit")}
          </StyledButton>
          <StyledButton
            data-testid={"deteletBtn"}
            disabled={disabledButtonFunc()}
            onClick={() => {
              deleteFunction();
              setAnchorEl(null);
            }}
          >
            {t("delete")}
          </StyledButton>
        </StyledTooltip>
      </Popover>
    </>
  );
};

export default ToolbarPopover;
