import HomeIcon from "@mui/icons-material/Home";
import Link from "@mui/material/Link";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import React from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Typography } from "@mui/material";
import { useHistory } from "react-router-dom";
import Box from "@mui/material/Box";
import Tooltip from "../common/Tooltip/Tooltip";
import { styled } from "@mui/system";

interface UserManagerBreadcrumbProps {
  name?: string;
  linkName: string;
  setEditMode?: (editMode: boolean) => void;
}

const StyledBreadcrumb = styled(Breadcrumbs)(({ theme }: any) => ({
  background: theme.bodyBackgroundColor,
  height: "16px",
  paddingBottom: "12px",
  paddingLeft: 0,
  marginTop: 0,
}));

const StyledHomeIcon = styled(HomeIcon)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  alignSelf: "center",
  width: "16px",
  height: "16px",
  cursor: "pointer",
}));

const StyledLink = styled(Link)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#707C93",
  height: "16px",
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: "300",
  fontSize: "12px",
  lineHeight: "130%",
  cursor: "pointer",
  textTransform: "capitalize",
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  alignItems: "center",
  color: theme.palette.primary.main,
  height: "16px",
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: "500",
  fontSize: "12px",
  lineHeight: "130%",
  textTransform: "capitalize",
  textOverflow: "ellipsis",
  overflow: "hidden",
}));

const UserManagerBreadcrumb: React.FC<UserManagerBreadcrumbProps> = ({
  name,
  linkName,
  setEditMode,
}) => {
  const history = useHistory();

  const handleClick = () => {
    if (setEditMode) {
      setEditMode(false);
    }
    history.push(`/usermanager/${linkName}`);
  };
  return (
    <StyledBreadcrumb
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
    >
      <StyledHomeIcon onClick={handleClick} />
      <StyledLink underline="none" onClick={handleClick}>
        {linkName}
      </StyledLink>
      <Box maxWidth={"500px"}>
        <Tooltip title={name || ""}>
          <StyledTypography> {name} </StyledTypography>
        </Tooltip>
      </Box>
    </StyledBreadcrumb>
  );
};

export default React.memo(UserManagerBreadcrumb);
