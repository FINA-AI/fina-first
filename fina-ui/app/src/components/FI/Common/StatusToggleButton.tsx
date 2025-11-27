import { Box } from "@mui/system";
import React, { useState } from "react";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import ArrowDropUpRoundedIcon from "@mui/icons-material/ArrowDropUpRounded";
import { MenuItem, Popover, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";

interface StyledStatusProps {
  isActive: boolean;
}

const StyledStatus = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isActive",
})<StyledStatusProps>(({ theme, isActive }) => ({
  padding: "4px 12px",
  height: "fit-content",
  marginRight: 5,
  fontWeight: 500,
  fontSize: "12px",
  lineHeight: "20px",
  textTransform: "capitalize",
  borderRadius: "2px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  color: isActive
    ? theme.palette.mode === "light"
      ? "#289E20"
      : "#ABEFC6"
    : theme.palette.mode === "light"
    ? "#FF4128"
    : "#B42318",
  backgroundColor: isActive
    ? theme.palette.mode === "light"
      ? "#E9F5E9"
      : "#079455"
    : theme.palette.mode === "light"
    ? "rgba(104, 122, 158, 0.1)"
    : "#FDA29B",
}));

const StyledMenuItemBox = styled(Box)({
  display: "flex",
  width: "109px",
  padding: "4px",
  flexDirection: "column",
  alignItems: "flex-start",
  backgroundColor: "#2C3644",
});

const StyledTypography = styled(Typography)({
  color: "#FFF",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  alignSelf: "stretch",
  fontDamily: "Inter",
  fontSize: "11px",
  fontWeight: 400,
  lineHeight: "16px",
  textTransform: "capitalize",
});

const StyledMenuItem = styled(MenuItem)({
  width: "100%",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "#FFFFFF",
  },
});

interface StatusToggleButtonProps {
  status: boolean;
  onChange: (status: boolean) => void;
}

const StatusToggleButton: React.FC<StatusToggleButtonProps> = ({
  status,
  onChange,
}) => {
  const { t } = useTranslation();
  const [isActiveStatus, setIsActiveStatus] = useState(status);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const updateActiveStatus = (status: boolean) => {
    setIsActiveStatus(status);
    onChange(status);
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      marginRight={"10px"}
      padding={"3px"}
    >
      <Box width={"100%"}>
        <StyledStatus
          isActive={isActiveStatus}
          onClick={handleClick}
          data-testid={"status-toggle-button"}
        >
          {!isActiveStatus ? t("inactive") : t("active")}

          {open ? (
            <ArrowDropUpRoundedIcon fontSize={"small"} />
          ) : (
            <ArrowDropDownRoundedIcon fontSize={"small"} />
          )}
        </StyledStatus>
      </Box>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => handleClose()}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{ top: "5px" }}
        data-testid={"status-popover"}
      >
        <StyledMenuItemBox>
          <StyledMenuItem
            onClick={() => updateActiveStatus(true)}
            data-testid={"active"}
          >
            <StyledTypography>{t("active")}</StyledTypography>
          </StyledMenuItem>
          <StyledMenuItem
            onClick={() => updateActiveStatus(false)}
            data-testid={"inactive"}
          >
            <StyledTypography>{t("inactive")}</StyledTypography>
          </StyledMenuItem>
        </StyledMenuItemBox>
      </Popover>
    </Box>
  );
};

export default StatusToggleButton;
