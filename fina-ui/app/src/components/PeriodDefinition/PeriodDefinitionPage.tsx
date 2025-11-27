import PeriodDefinitionContainer from "../../containers/PeriodDefinition/PeriodDefinitionContainer";
import PeriodDefinitionHeader from "./PeriodDefinitionHeader";
import React, { memo, useState } from "react";
import { Box } from "@mui/system";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import PeriodTypesContainer from "../../containers/PeriodType/PeriodTypesContainer";
import { PeriodSubmitDataType } from "../../types/period.type";
import { styled } from "@mui/material/styles";

const StyledRoot = styled(Box)(({ theme }: any) => ({
  padding: "16px",
  backgroundColor: theme.palette.paperBackground,
  width: "100%",
  boxSizing: "border-box",
  overflow: "hidden",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: "4px",
  ...theme.mainLayout,
}));

const StyledContentContainer = styled(Grid)({
  display: "flex",
  flexDirection: "column",
  borderRadius: "8px",
  height: "100%",
  boxSizing: "border-box",
  paddingBottom: 46,
});

const StyledTitleContainer = styled(Grid)({
  borderRadius: "8px",
  height: "100%",
  boxSizing: "border-box",
  paddingTop: "8px",
  paddingBottom: "14px",
});

const StyledMainTitleText = styled(Typography)(({ theme }: any) => ({
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "24px",
  color: theme.palette.textColor,
  display: "inline",
}));

const PeriodDefinitionPage = () => {
  const { t } = useTranslation();

  //period definition props
  const [activeTab, setActiveTab] = useState<string>("perioddefinition");
  const [selectedRows, setSelectedRows] = useState<PeriodSubmitDataType[]>([]);
  const [deleteMultiPeriodsModal, setDeleteMultiPeriodsModal] =
    useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  //periodType props
  const [addNewPeriodTypeModal, setAddNewPeriodTypeModal] =
    useState<boolean>(false);

  const [reloadPeriodData, setReloadPeriodData] = useState(false);

  const GetSelectedComponent = () => {
    switch (activeTab) {
      case "perioddefinition":
        return (
          <PeriodDefinitionContainer
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            deleteMultiPeriodsModal={deleteMultiPeriodsModal}
            setDeleteMultiPeriodsModal={setDeleteMultiPeriodsModal}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            reloadPeriodData={reloadPeriodData}
            setReloadPeriodData={setReloadPeriodData}
          />
        );
      case "periodtype":
        return (
          <PeriodTypesContainer
            addNewModalOpen={addNewPeriodTypeModal}
            setAddNewModalOpen={setAddNewPeriodTypeModal}
          />
        );
    }
  };

  return (
    <StyledRoot>
      <Grid
        container
        spacing={0}
        overflow={"hidden"}
        height={"100%"}
        borderRadius={"4px"}
      >
        <Grid item xs={12}>
          <StyledTitleContainer item xs={12}>
            <StyledMainTitleText>{t("periodDefinition")}</StyledMainTitleText>
          </StyledTitleContainer>
        </Grid>
        <StyledContentContainer item xs={12}>
          <PeriodDefinitionHeader
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            setDeleteMultiPeriodsModal={setDeleteMultiPeriodsModal}
            setModalOpen={setModalOpen}
            setAddNewPeriodTypeModal={setAddNewPeriodTypeModal}
            setReloadPeriodData={setReloadPeriodData}
          />
          {GetSelectedComponent()}
        </StyledContentContainer>
      </Grid>
    </StyledRoot>
  );
};

export default memo(PeriodDefinitionPage);
