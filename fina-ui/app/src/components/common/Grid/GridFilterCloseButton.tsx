import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { FC } from "react";
import { styled } from "@mui/material/styles";

interface GridFilterCloseButtonProps {
  onClose: () => void;
  disabled?: boolean;
}

const StyledCloseIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "disabled",
})<{ disabled: boolean }>(({ theme, disabled }) => ({
  height: 32,
  width: 32,
  border: `1px solid ${theme.palette.mode === "dark" ? "#B42318" : "#FF4128"}`,
  backgroundColor: theme.palette.mode === "dark" ? "#FEE4E2" : "none",
  borderRadius: "50%",
  "&:hover": {
    backgroundColor: theme.palette.mode === "dark" ? "#FEE4E2" : "none",
  },
  opacity: disabled ? 0.4 : 1,
  cursor: disabled ? "default" : "pointer",
}));

const StyledCloseIcon = styled(CloseIcon)(({ theme }: any) => ({
  display: "flex",
  color: theme.palette.mode === "dark" ? "#B42318" : "#FF4128",
}));

const GridFilterCloseButton: FC<GridFilterCloseButtonProps> = ({
  onClose,
  disabled = false,
}) => {
  return (
    <StyledCloseIconButton
      disabled={disabled}
      onClick={() => !disabled && onClose()}
      data-testid={"clear-icon-button"}
    >
      <StyledCloseIcon />
    </StyledCloseIconButton>
  );
};

export default GridFilterCloseButton;
