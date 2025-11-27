import { useTranslation } from "react-i18next";
import { Box, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import GridTable from "../../../common/Grid/GridTable";
import React, { memo, useState } from "react";
import DeleteForm from "../../../common/Delete/DeleteForm";
import { styled } from "@mui/material/styles";
import { RegionPropertiesType } from "../../../../containers/FI/Configuration/RegionalStructure/RegionalStructureContainer";

const StyledRegionFi = styled(Box)({
  color: "#2C3644",
  lineHeight: "20px",
  fontWeight: 600,
  fontSize: "13px",
  textTransform: "capitalize",
});

const commonIconStyles = (theme: any) => ({
  ...theme.defaultIcon,
  cursor: "pointer",
});

const StyledToolbarDeleteIcon = styled(DeleteIcon)(({ theme }: any) => ({
  ...commonIconStyles(theme),
}));

const StyledAddIcon = styled(AddIcon)(({ theme }: any) => ({
  ...commonIconStyles(theme),
}));

const StyledCreateIcon = styled(CreateIcon)(({ theme }: any) => ({
  ...commonIconStyles(theme),
}));

const StyledContainer = styled(Box)(({ theme }: any) => ({
  backgroundColor: theme.palette.paperBackground,
}));

const StyledIconButton = styled(IconButton)(({ theme }: any) => ({
  color: theme.palette.mode === "light" ? "#98A7BC" : "#5D789A",
  padding: 4,
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

const StyledDeleteIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.mode === "light" ? "#98A7BC" : "#5D789A",
  padding: 4,
  "&:hover": {
    color: "#FF4128",
  },
}));

interface Props {
  regionProperties: RegionPropertiesType[];
  selectedProperty?: RegionPropertiesType;
  onRegionPropertyDeleteFunction: () => void;
  setOpenEditPropertyModal: (open: boolean) => void;
  setOpenPropertyModal: (open: boolean) => void;
  setSelectedProperty: (property: RegionPropertiesType | undefined) => void;
}

const RegionalStructureProperties: React.FC<Props> = ({
  regionProperties,
  selectedProperty,
  onRegionPropertyDeleteFunction,
  setOpenEditPropertyModal,
  setOpenPropertyModal,
  setSelectedProperty,
}) => {
  const [deleteRegionPropertiesModal, setDeleteRegionPropertiesModal] =
    useState(false);

  const { t } = useTranslation();
  let columns = [
    {
      field: "level",
      headerName: t("level"),
      minWidth: 100,
    },
    {
      field: "name",
      headerName: t("name"),
      minWidth: 100,
    },
  ];

  const onDeleteHandler = () => {
    onRegionPropertyDeleteFunction();
    setDeleteRegionPropertiesModal(false);
  };

  const onEdit = () => {
    if (selectedProperty) {
      setOpenEditPropertyModal(true);
    }
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <StyledContainer
        display={"flex"}
        justifyContent={"space-between"}
        flexDirection={"row"}
        alignItems={"center"}
        height={"20px"}
        padding={"12px"}
        boxShadow={"0px 1px 0px #EAEBF0"}
      >
        <StyledRegionFi>{t("regionProperties")}</StyledRegionFi>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <StyledIconButton onClick={() => setOpenPropertyModal(true)}>
            <StyledAddIcon style={{ cursor: "pointer" }} />
          </StyledIconButton>
          <StyledIconButton onClick={() => onEdit()}>
            <StyledCreateIcon
              style={{
                opacity: selectedProperty ? 1 : 0.9,
                cursor: selectedProperty ? "pointer" : "",
              }}
            />
          </StyledIconButton>
          <StyledDeleteIconButton
            onClick={() => {
              setDeleteRegionPropertiesModal(true);
              if (selectedProperty) {
                setSelectedProperty(undefined);
              }
            }}
          >
            <StyledToolbarDeleteIcon />
          </StyledDeleteIconButton>
        </Box>
      </StyledContainer>
      <StyledContainer
        height={"100%"}
        overflow={"hidden"}
        display={"flex"}
        flexDirection={"column"}
      >
        <GridTable
          columns={columns}
          rows={regionProperties.filter((item) => item.id !== 0)}
          selectedRows={selectedProperty ? [selectedProperty] : []}
          rowOnClick={(row: RegionPropertiesType, deselect: boolean) => {
            if (deselect) {
              setSelectedProperty(undefined);
            } else {
              setSelectedProperty(row);
            }
          }}
          loading={false}
          singleRowSelect={true}
          emptyIconStyle={{ position: "unset" }}
        />
      </StyledContainer>
      <DeleteForm
        headerText={t("delete")}
        bodyText={t("deleteWarning")}
        additionalBodyText={t("regionProperties")}
        isDeleteModalOpen={deleteRegionPropertiesModal}
        setIsDeleteModalOpen={setDeleteRegionPropertiesModal}
        onDelete={onDeleteHandler}
        showConfirm={false}
      />
    </div>
  );
};

export default memo(RegionalStructureProperties);
