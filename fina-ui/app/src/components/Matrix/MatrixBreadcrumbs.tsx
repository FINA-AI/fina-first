import React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { RouteComponentProps, withRouter } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeIcon from "@mui/icons-material/Home";
import { Link, Typography } from "@mui/material";
import { Box, styled } from "@mui/system";

const StyledBreadcrumb = styled(Breadcrumbs)(({ theme }: any) => ({
  ...theme.breadcrumb.main,
  "& .MuiBreadcrumbs-separator": {
    margin: "0px 2px",
  },
}));

const StyledHouseIcon = styled(HomeIcon)(({ theme }: any) => ({
  ...theme.breadcrumb.icon,
}));

const StyledLink = styled(Typography)({
  color: "#707C93",
  height: "16px",
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: "300",
  fontSize: "12px",
  lineHeight: "130%",
  cursor: "pointer",
  textTransform: "capitalize",
  paddingLeft: "8px",
});

const StyledName = styled(Link)(({ theme }: any) => ({
  ...theme.breadcrumb.text,
  cursor: "pointer",
  textDecoration: "none",
}));
interface MatrixBreadcrumbsProps extends RouteComponentProps {}

const MatrixBreadcrumbs: React.FC<MatrixBreadcrumbsProps> = (props) => {
  const {
    history,
    location: { pathname },
  } = props;

  let pathNames = pathname.split("/").filter((x: string) => x);

  const handleClick = (pathName: string) => {
    if (pathNames.length === 1) {
      return;
    }
    history.push(pathName);
  };

  const getBreadcrumbsName = (index: number) => {
    switch (index) {
      case 1:
        return "Return Mapping";
      case 2:
        return "Table Mapping";
      case 3:
        return "MDT Node Mapping";
    }
  };

  return (
    <>
      <StyledBreadcrumb
        separator={
          <NavigateNextIcon
            fontSize="small"
            style={{ color: "rgba(104, 122, 158, 0.8)", margin: "0px" }}
          />
        }
      >
        <Box
          display={"flex"}
          alignItems={"center"}
          onClick={() => handleClick("/matrix")}
          style={{ cursor: "pointer" }}
        >
          <StyledHouseIcon />
          <StyledLink>File Mapping</StyledLink>
        </Box>
        {pathNames.map((_, index: number) => {
          if (index === 0) {
            return;
          }
          const routeTo = `/${pathNames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathNames.length - 1;
          return (
            <StyledName
              style={isLast ? { marginLeft: "0px" } : { color: "#707C93" }}
              key={index}
              onClick={() => !isLast && handleClick(routeTo)}
            >
              {getBreadcrumbsName(index)}
            </StyledName>
          );
        })}
      </StyledBreadcrumb>
    </>
  );
};

export default withRouter(MatrixBreadcrumbs);
