import HomeIcon from "@mui/icons-material/Home";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import React from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

interface UserManagerBreadcrumbProps {
  name: string;
  linkName?: string;
}

const StyledBreadcrumb = styled(Breadcrumbs)(({ theme }: { theme: any }) => ({
  background: theme.bodyBackgroundColor,
  height: "16px",
  paddingBottom: "12px",
  paddingLeft: 0,
  marginTop: 0,
}));

const StyledHouseIcon = styled(HomeIcon)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  alignSelf: "center",
  width: "16px",
  height: "16px",
  cursor: "pointer",
  color: "#495F80",
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

const UserManagerBreadcrumb: React.FC<UserManagerBreadcrumbProps> = ({
  name,
}) => {
  return (
    <StyledBreadcrumb
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
    >
      <StyledHouseIcon />
      <StyledName> {name} </StyledName>
    </StyledBreadcrumb>
  );
};

export default React.memo(UserManagerBreadcrumb);
