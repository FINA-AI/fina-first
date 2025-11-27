import { Box } from "@mui/system";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import GridTable from "../common/Grid/GridTable";
import { GridColumnType } from "../../types/common.type";
import React from "react";
import { VersionDataProps } from "../../containers/About/AboutContainer";
import { styled } from "@mui/material/styles";

interface AboutPageProps {
  columns: GridColumnType[];
  data: VersionDataProps[];
  loading: boolean;
  setData: (val: VersionDataProps[]) => void;
}

const StyledMainLayout = styled(Box)(({ theme }: any) => ({
  ...theme.mainLayout,
}));

const StyledContentContainer = styled(Grid)(({ theme }: any) => ({
  ...theme.page,
}));
const StyledTitle = styled(Typography)(({ theme }: any) => ({
  ...theme.pageTitle,
}));

const StyledRoot = styled(Box)(({ theme }: any) => ({
  ...theme.pageContent,
}));

const AboutPage: React.FC<AboutPageProps> = ({
  columns,
  data,
  loading,
  setData,
}) => {
  const { t } = useTranslation();

  return (
    <StyledMainLayout>
      <StyledContentContainer>
        <StyledTitle>{t("about")}</StyledTitle>
        <StyledRoot>
          <GridTable
            columns={columns}
            rows={data}
            loading={loading}
            setRows={setData}
          />
        </StyledRoot>
      </StyledContentContainer>
    </StyledMainLayout>
  );
};

export default AboutPage;
