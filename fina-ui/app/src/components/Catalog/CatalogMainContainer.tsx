import React, { useState } from "react";
import { Route, useHistory, useLocation } from "react-router-dom";
import MiniCatalogContainer from "../../containers/Catalog/MiniCatalogContainer";
import Grid from "@mui/material/Grid";
import { Box, Typography } from "@mui/material";
import CatalogItemContainer from "../../containers/Catalog/CatalogItemContainer";
import CatalogContainer from "../../containers/Catalog/CatalogContainer";
import { useTranslation } from "react-i18next";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeIcon from "@mui/icons-material/Home";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import menuLink from "../../api/ui/menuLink";
import { styled } from "@mui/material/styles";
import { MainMenuItem } from "../../types/mainMenu.type";
import { CatalogItemTreeState } from "../../types/catalog.type";

const StyledMainLayout = styled(Box)(({ theme }: any) => ({
  ...theme.mainLayout,
}));

const StyledContentContainerBox = styled(Box)(({ theme }: any) => ({
  ...theme.page,
}));

const StyledContentContainerGrid = styled(Grid)(({ theme }: any) => ({
  ...theme.page,
}));

const StyledTitle = styled(Typography)(({ theme }: any) => ({
  ...theme.pageTitle,
}));

const StyledCatalogContainer = styled(Grid)(({ theme }: any) => ({
  borderRight: theme.palette.borderColor,
}));

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }: any) => ({
  ...theme.breadcrumb.main,
}));

const StyledHomeIcon = styled(HomeIcon)(({ theme }: any) => ({
  ...theme.breadcrumb.icon,
}));

const StyledHomeText = styled(Typography)(({ theme }: any) => ({
  ...theme.breadcrumb.text,
  color: "#707C93",
}));

const StyledContainer = styled(Box)(({ theme }: any) => ({
  height: "100%",
  width: "100%",
  display: "flex",
  borderRadius: "4px",
  background: theme.palette.paperBackground,
  flexDirection: "row",
  overflow: "hidden",
}));

const CatalogMainContainer = ({ menuItem }: { menuItem: MainMenuItem }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [treeState, setTreeState] = useState<CatalogItemTreeState>({
    data: [],
    columns: [],
  });
  const location = useLocation();

  const getPathParams = () => {
    const regex = /^\/([^\/]+)(?:\/([^\/]+))?(?:\/([^\/]+))?$/;
    const match = menuItem?.subLink?.match(regex);

    if (match) {
      return {
        page: match[1].toLowerCase(), // mandatory
        catalogId: match[3] || null, // optional
      };
    }

    return { page: "catalog" };
  };
  const getComponent = () => {
    if (location.pathname.toLowerCase().startsWith(menuLink.catalog)) {
      menuItem.subLink = location.pathname;
    }

    const params = getPathParams();
    if (params.catalogId) {
      return (
        <StyledContentContainerGrid container spacing={0}>
          <Box>
            <StyledBreadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="breadcrumb"
            >
              <Box display={"flex"} alignItems={"center"}>
                <StyledHomeIcon
                  onClick={() => {
                    menuItem.subLink = menuLink.catalog;
                    history.push(menuLink.catalog);
                  }}
                />
                <StyledHomeText>{t("home")}</StyledHomeText>
              </Box>
            </StyledBreadcrumbs>
          </Box>
          <StyledContainer>
            <StyledCatalogContainer item xs={2}>
              <MiniCatalogContainer
                setTreeState={setTreeState}
                treeState={treeState}
                catalogId={params.catalogId}
              />
            </StyledCatalogContainer>
            <Grid item xs={10}>
              <CatalogItemContainer
                treeState={treeState}
                setTreeState={setTreeState}
                catalogId={params.catalogId}
              />
            </Grid>
          </StyledContainer>
        </StyledContentContainerGrid>
      );
    }

    return null;
  };

  return (
    <StyledMainLayout>
      <Route path={`/*`}>{getComponent()}</Route>
      <StyledContentContainerBox
        id={"mainCatalog"}
        style={{
          display:
            location.pathname.toLowerCase() === menuLink.catalog
              ? "flex"
              : "none",
        }}
      >
        <StyledTitle>{t("catalog")}</StyledTitle>
        <CatalogContainer />
      </StyledContentContainerBox>
    </StyledMainLayout>
  );
};

export default React.memo(CatalogMainContainer);
