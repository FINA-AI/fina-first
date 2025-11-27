import { Box } from "@mui/system";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import AddIcon from "@mui/icons-material/Add";
import React from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DashletType } from "../../../types/dashboard.type";
import { styled } from "@mui/material/styles";

interface DashboardItemHeaderProps {
  setIsAddNewOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedItem: React.Dispatch<
    React.SetStateAction<{ open: boolean; row: DashletType | null }>
  >;
}

const StyledToolbar = styled(Box)(({ theme }: any) => ({
  ...theme.toolbar,
  backgroundColor: theme.palette.paperBackground,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const StyledBackButton = styled(Box)(({ theme }: any) => ({
  height: 35,
  width: 40,
  backgroundColor: theme.palette.buttons.secondary.backgroundColor,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 4,
  "&:hover": {
    backgroundColor: theme.palette.buttons.secondary.hover,
  },
  transition: "0.3s",
  cursor: "pointer",
}));

const StyledLeftArrowIcon = styled(ArrowBackIosNewRoundedIcon)({
  color: "#8695B1",
  width: "13px !important",
  height: "13px !important",
});

const DashboardItemHeader: React.FC<DashboardItemHeaderProps> = ({
  setIsAddNewOpen,
  setSelectedItem,
}) => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <StyledToolbar data-testid={"header"}>
      <StyledBackButton
        onClick={() => {
          history.push(`/dashboard`);
        }}
        data-testid={"back-button"}
      >
        <StyledLeftArrowIcon />
      </StyledBackButton>
      <Box display={"flex"} gap={"8px"}>
        <PrimaryBtn
          style={{ marginLeft: "10px" }}
          onClick={() => {
            setIsAddNewOpen(true);
            setSelectedItem({ open: false, row: null });
          }}
          endIcon={<AddIcon />}
          data-testid={"create-button"}
        >
          {t("addNewDashlet")}
        </PrimaryBtn>
      </Box>
    </StyledToolbar>
  );
};

export default DashboardItemHeader;
