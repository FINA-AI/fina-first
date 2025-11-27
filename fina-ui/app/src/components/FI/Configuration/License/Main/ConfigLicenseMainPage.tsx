import { Box, Grid, Typography } from "@mui/material";
import SearchField from "../../../../common/Field/SearchField";
import PrimaryBtn from "../../../../common/Button/PrimaryBtn";
import AddIcon from "@mui/icons-material/Add";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ClosableModal from "../../../../common/Modal/ClosableModal";
import ConfigLicenseCreate from "../Create/ConfigLicenseCreate";
import DeleteForm from "../../../../common/Delete/DeleteForm";
import { useHistory } from "react-router-dom";
import LicenseConfigPageSkeleton from "../../../Skeleton/Configuration/License/LicenseConfigPageSkeleton";
import menuLink from "../../../../../api/ui/menuLink";
import ConfigLicenseCard from "../ConfigLicenseCard";
import NoRecordIndicator from "../../../../common/NoRecordIndicator/NoRecordIndicator";
import useConfig from "../../../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../../../api/permissions";
import { styled } from "@mui/material/styles";
import { LicenseType } from "../../../../../types/fi.type";

const commonIconStyles = (theme: any) => ({
  ...theme.smallIcon,
  color: "#9AA7BE",
  cursor: "pointer",
});

const StyledEditIcon = styled(EditIcon)(({ theme }: any) => ({
  ...commonIconStyles(theme),
}));

const StyledDeleteIcon = styled(DeleteIcon)(({ theme }: any) => ({
  ...commonIconStyles(theme),
}));

const StyledToolbarGrid = styled(Grid)(({ theme }: any) => ({
  padding: theme.toolbar.padding,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottom: theme.palette.borderColor,
  backgroundColor: theme.palette.paperBackground,
}));

const StyledBody = styled(Box)(({ theme }: any) => ({
  maxHeight: "100%",
  height: "100%",
  overflow: "auto",
  background: theme.palette.paperBackground,
  padding: "8px 12px",
  borderBottomRightRadius: "8px",
  borderBottomLeftRadius: "8px",
  "& .MuiPaper-rounded": {
    boxShadow: "none",
    "&:hover": {
      boxShadow: "0px 2px 10px 0px #00000014",
    },
  },
}));

const StyledCardRoot = styled(Grid)(({ theme }: any) => ({
  "& .MuiSvgIcon-root": {
    color: theme.palette.mode === "light" ? "#9AA7BE" : "#5D789A",
    height: "20px",
  },
  "&:hover": {
    "& #editIcon": {
      color: "#2962FF",
    },
    "& #deleteIcon": {
      color: "#FF4128",
    },
  },
}));

const StyledCardContent = styled(Grid)({
  display: "flex",
  alignItems: "center",
  overflow: "hidden",
  justifyContent: "space-between",
});

const StyledShortNameBox = styled(Box)(({ theme }: any) => ({
  textTransform: "uppercase",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  color: theme.palette.primary.main,
  fontWeight: 500,
  fontSize: 12,
  lineHeight: "16px",
  height: 18,
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: 2,
  padding: "3px 6px 2px 6px",
}));

const StyledCodeBox = styled(Box)(({ theme }: any) => ({
  color: theme.palette.textColor,
  marginTop: 12,
  fontWeight: 400,
  fontSize: 11,
  minHeight: "15px",
  lineHeight: "16px",
}));

const StyledEditBox = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: 22,
  height: 22,
  "&:hover": {
    backgroundColor: "rgba(41, 98, 255, 0.1)",
    borderRadius: 37,
  },
});

const StyledDeleteBox = styled(StyledEditBox)({
  marginLeft: 4,
  "&:hover": {
    backgroundColor: "rgba(255, 65, 40, 0.1)",
  },
});

const StyledNameText = styled(Typography)(({ theme }) => ({
  fontSize: 11,
  fontWeight: 400,
  lineHeight: "16px",
  color: theme.palette.mode === "dark" ? "#FFF" : "#596D89",
}));

interface Props {
  licenses: LicenseType[];
  addLicenseHandler: (data: LicenseType) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (val: boolean) => void;
  deleteLicenseTypeHandler: (item: LicenseType) => void;
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (val: boolean) => void;
  currentLicense: LicenseType;
  setCurrentLicense: (license: LicenseType) => void;
  loading: boolean;
}

const ConfigLicenseMainPage: React.FC<Props> = ({
  licenses,
  addLicenseHandler,
  isAddModalOpen,
  setIsAddModalOpen,
  deleteLicenseTypeHandler,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  currentLicense,
  setCurrentLicense,
  loading,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();
  const history = useHistory();

  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedLicense, setSelectedLicense] = useState<LicenseType>(
    {} as LicenseType
  );
  const [editMode, setEditMode] = useState(false);

  const addModalCloseHandler = () => {
    setIsAddModalOpen(false);
  };

  const editModalCloseHandler = () => {
    setIsAddModalOpen(false);
    setCurrentLicense({} as LicenseType);
    setEditMode(false);
  };

  const filterClearHandler = () => {
    setSearchValue("");
  };

  const openLicense = (licenseItem: LicenseType) => {
    history.push(`${menuLink.configuration}/license/${licenseItem.id}`);
  };

  const onDelete = () => {
    deleteLicenseTypeHandler(selectedLicense);
    setIsDeleteModalOpen(false);
  };

  const createCardContent = (item: LicenseType) => {
    let operations = item.operations;
    const bankOperations = operations.filter(
      (operation) => operation.parentId === 0
    ).length;
    return (
      <StyledCardRoot
        onClick={() => {
          openLicense(item);
        }}
        data-testid={`license-card-${item.code}`}
      >
        <StyledCardContent item xs={12}>
          <StyledShortNameBox>
            {bankOperations !== 1
              ? `${bankOperations} ${t("bankingOperations")}`
              : `${bankOperations} ${t("bankingOperations")}`}
          </StyledShortNameBox>
          <div style={{ marginLeft: "10px", order: "1", display: "flex" }}>
            {hasPermission(PERMISSIONS.FINA_LICTYPE_AMEND) && (
              <StyledEditBox>
                <StyledEditIcon
                  id={"editIcon"}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAddModalOpen(true);
                    setEditMode(true);
                    setCurrentLicense(item);
                  }}
                />
              </StyledEditBox>
            )}

            {hasPermission(PERMISSIONS.FINA_LICTYPE_DELETE) && (
              <StyledDeleteBox>
                <StyledDeleteIcon
                  id={"deleteIcon"}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDeleteModalOpen(true);
                    setSelectedLicense(item);
                  }}
                />
              </StyledDeleteBox>
            )}
          </div>
        </StyledCardContent>
        <StyledCodeBox>{item.code}</StyledCodeBox>
        <Grid pt={"8px"}>
          <StyledNameText>{item.name}</StyledNameText>
        </Grid>
      </StyledCardRoot>
    );
  };

  return (
    <Box height={"100%"}>
      <Box width={"100%"}>
        <StyledToolbarGrid width={"100%"}>
          <SearchField
            withFilterButton={false}
            width={280}
            onFilterChange={(value) => setSearchValue(value)}
            onClear={filterClearHandler}
          />
          {hasPermission(PERMISSIONS.FINA_LICTYPE_AMEND) && (
            <PrimaryBtn
              onClick={() => setIsAddModalOpen(true)}
              fontSize={12}
              data-testid={"addNewBtn"}
              endIcon={<AddIcon />}
            >
              {t("addNew")}
            </PrimaryBtn>
          )}
        </StyledToolbarGrid>
      </Box>
      <StyledBody>
        {loading ? (
          <LicenseConfigPageSkeleton cardNumber={licenses.length} />
        ) : (
          <>
            {loading !== undefined && !loading && licenses.length === 0 && (
              <Grid container item xs={12} height={"100%"}>
                <NoRecordIndicator />
              </Grid>
            )}
            <Grid container item xs={12}>
              {licenses
                .filter(
                  (item) =>
                    item?.code
                      ?.toLowerCase()
                      .includes(searchValue.toLowerCase()) ||
                    item?.name
                      ?.toLowerCase()
                      .includes(searchValue.toLowerCase())
                )
                .map((item, index) => {
                  return (
                    <ConfigLicenseCard key={index}>
                      {createCardContent(item)}
                    </ConfigLicenseCard>
                  );
                })}
            </Grid>
          </>
        )}

        <ClosableModal
          open={isAddModalOpen}
          onClose={editMode ? editModalCloseHandler : addModalCloseHandler}
          title={editMode ? t("editLicense") : t("addLicense")}
          includeHeader={true}
          width={600}
          height={"auto"}
        >
          <ConfigLicenseCreate
            addLicenseHandler={addLicenseHandler}
            modalCloseHandler={
              editMode ? editModalCloseHandler : addModalCloseHandler
            }
            isEdit={editMode}
            currentLicense={currentLicense}
          />
        </ClosableModal>
      </StyledBody>
      <DeleteForm
        headerText={t("delete")}
        bodyText={t("deleteWarning")}
        additionalBodyText={t("license")}
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        onDelete={onDelete}
        showConfirm={false}
      />
    </Box>
  );
};

export default ConfigLicenseMainPage;
