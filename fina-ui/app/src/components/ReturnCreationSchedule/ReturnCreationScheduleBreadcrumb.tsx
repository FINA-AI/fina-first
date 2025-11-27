import HomeIcon from "@mui/icons-material/Home";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link, Typography } from "@mui/material";
import React from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useHistory, useLocation } from "react-router-dom";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";

const commonStyles = (theme: any) => ({
  ...theme.breadcrumb.text,
  cursor: "pointer",
  textDecoration: "none",
  display: "flex",
});

const StyledLink = styled(Link)(({ theme }) => ({
  ...commonStyles(theme),
}));

const StyledName = styled(Typography)(({ theme }) => ({
  ...commonStyles(theme),
}));

const ReturnCreationScheduleBreadcrumb = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const location: any = useLocation();
  const taskName = location.state?.taskName;

  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
      sx={(theme: any) => ({ ...theme.breadcrumb.main })}
    >
      <Box display={"flex"} alignItems={"center"}>
        <StyledLink
          onClick={() => {
            history.push(`/returncreationschedule`);
          }}
        >
          <HomeIcon sx={(theme: any) => ({ ...theme.breadcrumb.icon })} />
          <StyledName>{t("home")}</StyledName>
        </StyledLink>
      </Box>

      <StyledName style={{ margin: "0px" }}>{taskName}</StyledName>
    </Breadcrumbs>
  );
};

export default ReturnCreationScheduleBreadcrumb;
