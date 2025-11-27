import { useTranslation } from "react-i18next";
import React, { memo, useState } from "react";
import { Box } from "@mui/system";
import { Grid, Paper, Typography } from "@mui/material";
import ImportManagerHeader from "./ImportManagerHeader";
import ImportManagerContainer from "../../containers/ImportManager/ImportManagerContainer";
import UploadFilesContainer from "../../containers/ImportManager/UploadFilesContainer";

import { styled } from "@mui/material/styles";

export const StyledContainer = styled(Box)(({ theme }) => ({
  height: "100%",
  padding: "20px 16px",
  boxSizing: "border-box",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  ...(theme as any).mainLayout,
}));

export const StyledMainPage = styled(Grid)(() => ({
  height: "100%",
  borderRadius: 8,
  paddingTop: 14,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  boxSizing: "border-box",
}));

export const StyledPaper = styled(Paper)(() => ({
  width: "100%",
  height: "100%",
  boxShadow: "none",
  borderRadius: "8px 8px 0px 0px",
}));

export const StyledTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: 16,
  color: (theme as any).palette.textColor,
}));

const ImportManagerPage = () => {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState("uploadFiles");

  const GetPage = () => {
    switch (activeTab) {
      case "importManager":
        return <ImportManagerContainer />;
      case "uploadFiles":
        return <UploadFilesContainer />;
      default:
        return <ImportManagerContainer />;
    }
  };

  return (
    <StyledContainer>
      <StyledTitle> {t("importManager")}</StyledTitle>
      <StyledMainPage>
        <Grid>
          <StyledPaper>
            <ImportManagerHeader
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </StyledPaper>
        </Grid>
        {GetPage()}
      </StyledMainPage>
    </StyledContainer>
  );
};

export default memo(ImportManagerPage);
