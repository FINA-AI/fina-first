import React from "react";
import { Box, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import GhostBtn from "../Button/GhostBtn";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";

interface SecondaryToolbarProps {
  selectedItemsCount: number;
  onDeleteButtonClick: () => void;
  onCancelClick?: () => void;
  children?: React.ReactNode;
  style?: object;
}

const StyledRoundedDivider = styled("span")(({ theme }) => ({
  width: 5,
  height: 5,
  borderRadius: "50%",
  backgroundColor: theme.palette.mode === "dark" ? "#2D3747" : "#F5F7FA",
}));

const StyledDivider = styled("span")(({ theme }) => ({
  minHeight: "30px",
  minWidth: "1px",
  display: "inline-block",
  background: theme.palette.mode === "dark" ? "#2D3747" : "#F5F7FA",
  marginLeft: "20px",
  border: "1px",
}));

const StyledRootBox = styled(Box)(({ theme }: any) => ({
  background: theme.palette.primary.main,
  // padding: theme.toolbar.padding,
  display: "flex",
  alignItems: "center",
  borderRadius: "8px",
  borderBottomRightRadius: "0px",
  padding: "8px 20px",
  "& .MuiButtonBase-root:hover svg": {
    color:
      theme.palette.mode === "dark"
        ? "#97b5db !important"
        : "#5d789a !important",
  },
}));

const SecondaryToolbar: React.FC<SecondaryToolbarProps> = ({
  selectedItemsCount,
  onDeleteButtonClick,
  onCancelClick,
  children,
  style,
}) => {
  const theme = useTheme();
  const themeColor = theme.palette.mode === "dark" ? "#2D3747" : "#F5F7FA";
  const { t } = useTranslation();

  const onCancel = () => {
    if (onCancelClick) {
      onCancelClick();
    }
  };

  return (
    <StyledRootBox style={style} data-testid={"secondary-toolbar"}>
      {children}

      <Typography
        sx={{
          marginRight: "15px",
          fontWeight: 600,
          lineHeight: "32px",
          whiteSpace: "nowrap",
          color: themeColor,
        }}
      >
        {t("selectedItemsFi", { itemsLength: selectedItemsCount })}
      </Typography>

      <StyledRoundedDivider />

      <GhostBtn
        onClick={onDeleteButtonClick}
        height={32}
        sx={{
          marginLeft: "15px",
          "&:hover span svg, &:hover span p": {
            color:
              theme.palette.mode === "dark"
                ? "#97b5db !important"
                : "#5d789a !important",
          },
        }}
        endIcon={<DeleteIcon style={{ color: themeColor }} />}
      >
        <Typography
          fontWeight={500}
          sx={{ lineHeight: "16px", color: themeColor, maxWidth: "80px" }}
          noWrap
        >
          {t("delete")}
        </Typography>
      </GhostBtn>

      <StyledDivider />

      <Typography
        sx={{
          cursor: "pointer",
          marginLeft: "20px",
          fontWeight: 500,
          lineHeight: "18px",
          color: themeColor,
        }}
        onClick={() => onCancel()}
      >
        {t("cancel")}
      </Typography>
    </StyledRootBox>
  );
};

export default SecondaryToolbar;
