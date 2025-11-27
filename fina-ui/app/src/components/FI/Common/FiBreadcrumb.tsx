import HomeIcon from "@mui/icons-material/Home";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import React from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Typography } from "@mui/material";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/system";
import { styled } from "@mui/material/styles";

const StyledBreadCrumbs = styled(Breadcrumbs)(({ theme }: any) => ({
  ...theme.breadcrumb.main,
  "& .MuiBreadcrumbs-separator": {
    margin: "0px 2px",
  },
}));

const StyledName = styled(Typography)(({ theme }: any) => ({
  ...theme.breadcrumb.text,
  cursor: "pointer",
}));

const StyledHouseIcon = styled(HomeIcon)(({ theme }: any) => ({
  ...theme.breadcrumb.icon,
}));

interface FiBreadcrumbProps {
  name: string;
  tabName?: string;
  mainPageName: string;
  onBreadCrubmNavigationClick?: (pageName: string) => void;
}

const FiBreadcrumb: React.FC<FiBreadcrumbProps> = ({
  name,
  tabName,
  mainPageName,
  onBreadCrubmNavigationClick,
}) => {
  const history = useHistory();
  const { t } = useTranslation();

  const handleClick = () => {
    if (onBreadCrubmNavigationClick) onBreadCrubmNavigationClick(mainPageName);
    history.push(`/${mainPageName}`);
  };
  return (
    <StyledBreadCrumbs
      sx={{ paddingBottom: tabName === "general" ? "0px" : "12px" }}
      separator={
        <NavigateNextIcon
          fontSize="small"
          style={{ color: "rgba(104, 122, 158, 0.8)", margin: "0px" }}
        />
      }
      aria-label="breadcrumb"
      data-testid={"fi-breadcrumbs"}
    >
      <Box
        display={"flex"}
        alignItems={"center"}
        onClick={handleClick}
        data-testid={"navigate-back-button"}
      >
        <StyledHouseIcon />
        <StyledName style={{ color: "#707C93" }}>{t("home")}</StyledName>
      </Box>
      <Box display={"flex"} alignItems={"center"}>
        <StyledName data-testid={"fi-name-label"}>{t(name)}</StyledName>
      </Box>
    </StyledBreadCrumbs>
  );
};

export default FiBreadcrumb;
