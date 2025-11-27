import HomeIcon from "@mui/icons-material/Home";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import React from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Typography } from "@mui/material";
import PropTypes from "prop-types";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  background: theme.bodyBackgroundColor,
  height: "16px",
  paddingBottom: "12px",
  paddingLeft: 0,
  marginTop: 0,
}));

const StyledHomeIcon = styled(HomeIcon)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  alignSelf: "center",
  width: "16px",
  height: "16px",
  cursor: "pointer",
});

const StyledName = styled(Typography)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  color: theme.palette.primary.main,
  height: "16px",
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: "500",
  fontSize: "12px",
  lineHeight: "130%",
  textTransform: "capitalize",
}));

const StyledLink = styled(Link)({
  color: "#707C93",
  height: "16px",
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: "300",
  fontSize: "12px",
  lineHeight: "130%",
  cursor: "pointer",
  textTransform: "capitalize",
  justifyContent: "center",
  alignItems: "center",
  alignSelf: "center",
});

const CEMSBreadcrumb = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const location = useLocation();

  const paths = location?.pathname.split("/");

  const redirect = (index) => {
    history.push(paths.slice(0, index + 3).join("/"));
  };

  return (
    <StyledBreadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
    >
      <StyledHomeIcon
        onClick={() => {
          redirect(0);
        }}
      />
      {paths
        .filter((element, index) => index !== 2 && index !== 0)
        .map((item, index) => {
          return (
            item &&
            (paths[paths.length - 1] === item ? (
              <StyledName key={index + "name"}>{t(item)}</StyledName>
            ) : (
              <StyledLink
                key={index}
                underline="none"
                to={"#"}
                onClick={() => {
                  redirect(index);
                }}
              >
                {t(item)}
              </StyledLink>
            ))
          );
        })}
    </StyledBreadcrumbs>
  );
};

CEMSBreadcrumb.propTypes = {
  name: PropTypes.string,
  tabName: PropTypes.string,
};

export default CEMSBreadcrumb;
