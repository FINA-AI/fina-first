import HomeIcon from "@mui/icons-material/Home";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import React from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Typography } from "@mui/material";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/system";
import { styled } from "@mui/material/styles";

interface UserFileSpaceBreadCrumbsProps {
  userFileName: string;
}

const StyledBreadCrumbs = styled(Breadcrumbs)(({ theme }: any) => ({
  ...theme.breadcrumb.main,
  paddingBottom: "12px",
  "& .MuiBreadcrumbs-separator": {
    margin: "0px 2px",
  },
}));

const StyledName = styled(Typography)(({ theme }: any) => ({
  ...theme.breadcrumb.text,
}));

const UserFileSpaceBreadCrumbs: React.FC<UserFileSpaceBreadCrumbsProps> = ({
  userFileName,
}) => {
  const history = useHistory();
  const { t } = useTranslation();

  const handleClick = () => {
    history.push(`/userfilespace`);
  };
  return (
    <StyledBreadCrumbs
      separator={
        <NavigateNextIcon
          fontSize="small"
          style={{ color: "rgba(104, 122, 158, 0.8)", margin: "0px" }}
        />
      }
      aria-label="breadcrumb"
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <HomeIcon
          sx={(theme: any) => ({ ...theme.breadcrumb.icon })}
          onClick={handleClick}
        />
        <StyledName style={{ color: "#707C93" }}>
          {t("userFileSpace")}
        </StyledName>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <StyledName style={{ marginLeft: "0px" }}>{userFileName}</StyledName>
      </Box>
    </StyledBreadCrumbs>
  );
};

export default UserFileSpaceBreadCrumbs;
