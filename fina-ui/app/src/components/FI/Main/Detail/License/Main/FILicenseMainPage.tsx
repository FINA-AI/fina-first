import { Box, Grid, IconButton, Menu, Paper, Typography } from "@mui/material";
import PrimaryBtn from "../../../../../common/Button/PrimaryBtn";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import SearchField from "../../../../../common/Field/SearchField";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import useConfig from "../../../../../../hoc/config/useConfig";
import { getFormattedDateValue } from "../../../../../../util/appUtil";
import ClosableModal from "../../../../../../components/common/Modal/ClosableModal";
import FILicenseForm from "./FILicenseForm";
import DeleteForm from "../../../../../common/Delete/DeleteForm";
import FILicenseFilter from "./FILicenseFilter";
import FilterListIcon from "@mui/icons-material/FilterList";
import TextButton from "../../../../../common/Button/TextButton";
import FilterChip from "../../../../../common/Chip/FilterChip";
import CloseIcon from "@mui/icons-material/Close";
import LicensePageSkeleton from "../../../../Skeleton/FiLicense/LicensePageSkeleton";
import StarIcon from "@mui/icons-material/Star";
import NoRecordIndicator from "../../../../../common/NoRecordIndicator/NoRecordIndicator";
import { PERMISSIONS } from "../../../../../../api/permissions";
import { styled } from "@mui/material/styles";
import { FiDataType, LicensesDataType } from "../../../../../../types/fi.type";
import { FILicenseFilterType } from "../../../../../../containers/FI/Main/License/FILicenseContainer";

const StyledRoot = styled(Box)(({ theme }: any) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  background: theme.palette.paperBackground,
}));

const StyledGrid = styled(Grid)(({ theme }: any) => ({
  padding: theme.toolbar.padding,
  display: "flex",
  alignItems: "center",
  float: "right",
  justifyContent: "space-between",
  borderBottom: theme.palette.borderColor,
}));

const StyledCardContent = styled(Grid)({
  display: "flex",
  alignItems: "center",
  overflow: "hidden",
  justifyContent: "space-between",
  cursor: "pointer",
});

const StyledCardPaper = styled(Paper)(({ theme }: any) => ({
  height: "156px",
  maxHeight: "156px",
  backgroundColor: theme.palette.mode === "light" ? "#FFFFFF" : "#344258",
  borderRadius: "4px",
  border: theme.palette.borderColor,
  padding: "12px 16px",
  boxShadow: "none",
  "&:hover": {
    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.08)",
    "& $deleteIcon": {
      color: "#FF4128",
    },
  },
}));

const StyledDeleteIconBox = styled(Box)(({ theme }: any) => ({
  color: theme.palette.iconColor,
  cursor: "pointer",
  "& .MuiSvgIcon-root": {
    width: "20px",
    height: "20px",
  },
}));

const StyledLicenseNumber = styled(Box)(({ theme }: any) => ({
  color: theme.palette.textColor,
  fontSize: "13px",
  fontWeight: 500,
  lineHeight: "20px",
  marginTop: "8px",
  marginBottom: "8px",
}));

const StyledDescription = styled(Box)(({ theme }) => ({
  color: theme.palette.mode === "light" ? "#596D89" : "#ABBACE",
  fontWeight: 400,
  fontSize: "11px",
  lineHeight: "16px",
  height: "70px",
  maxHeight: "70px",
}));

const StyledDateBox = styled(Box)({
  display: "flex",
  justifyContent: "flex-end",
  width: "100%",
  fontSize: "11px",
  fontWeight: 400,
  color: "#ABBACE",
  lineHeight: "16px",
  marginTop: "8px",
});

const StyledDefaultStarIconBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: 24,
  backgroundColor: "#FFF4E5",
  marginLeft: 5,
  cursor: "pointer",
  "& .MuiSvgIcon-root": {
    width: "14px",
    height: "14px",
  },
});

const StyledNonDefaultIconBox = styled(Box)(({ theme }) => ({
  background: theme.palette.mode === "light" ? "#F5F5F5" : "inherit",
  height: 24,
  width: 24,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginLeft: 5,
  cursor: "pointer",
  "& .MuiSvgIcon-root": {
    width: "14px",
    height: "14px",
  },
}));

const StyledStatusBtnBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active: boolean }>(({ theme, active }) => ({
  borderRadius: "4px",
  width: "fit-content",
  display: "flex",
  justifyContent: "center",
  lineHeight: "16px",
  fontSize: "12px",
  fontWeight: 500,
  padding: "4px 12px",
  alignItems: "center",
  color: active
    ? theme.palette.mode === "light"
      ? "#289E20"
      : "#ABEFC6"
    : theme.palette.mode === "light"
    ? "#FF4128"
    : "#912018",
  backgroundColor: active
    ? theme.palette.mode === "light"
      ? "#E9F5E9"
      : "#067647"
    : theme.palette.mode === "light"
    ? "rgba(104, 122, 158, 0.1)"
    : "#FDA29B",
}));

const StyledNonDefaultStarIcon = styled(StarIcon)(({ theme }) => ({
  color: theme.palette.mode === "light" ? "#9AA7BE" : "#5D789A",
}));

interface FILicenseMainPageProps {
  licenseLength: number;
  loading: boolean;
  licenses: LicensesDataType[];
  onFilterClick: (filters: FILicenseFilterType) => void;
  onSearchClick: (search: string) => void;
  onDeleteFunction: (item: LicensesDataType) => void;
  onLicenseItemClick: (item: LicensesDataType) => void;
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (open: boolean) => void;
  fi: FiDataType;
  setLicenses: (licenses: LicensesDataType[]) => void;
  updateDefaultLicense: (license: LicensesDataType) => void;
  onClearFunc: () => void;
}

const FILicenseMainPage: React.FC<FILicenseMainPageProps> = ({
  licenseLength,
  loading,
  onFilterClick,
  onSearchClick,
  onDeleteFunction,
  onLicenseItemClick,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  fi,
  licenses,
  setLicenses,
  updateDefaultLicense,
  onClearFunc,
}) => {
  const { t } = useTranslation();
  const { getDateFormat, hasPermission } = useConfig();
  const [open, setOpen] = useState(false);
  const [selectedCardItem, setSelectedCardItem] =
    useState<LicensesDataType | null>(null);

  const handleClose = () => {
    setOpen(false);
  };
  const onCancel = () => {
    handleClose();
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openFilter = Boolean(anchorEl);

  const handleFilterOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const [filters, setFilters] = useState<FILicenseFilterType>({
    inactive: false,
    active: false,
    dateFrom: null,
    dateTo: null,
  });

  const clearAll = () => {
    const newFilter = {
      inactive: false,
      active: false,
      dateFrom: null,
      dateTo: null,
    };
    setFilters(newFilter);
    onFilterClick(newFilter);
  };

  const deleteStatus = () => {
    const newFilter = {
      ...filters,
      active: false,
      inactive: false,
    };
    setFilters(newFilter);
    onFilterClick(newFilter);
  };

  const createCardContent = (item: LicensesDataType) => {
    return (
      <Grid>
        <StyledCardContent item xs={12}>
          <Box display={"flex"}>
            <StyledStatusBtnBox
              active={item.licenceStatus === "ACTIVE"}
              data-testid={"status-label"}
            >
              {item.licenceStatus === "ACTIVE" ? t("active") : t("inactive")}
            </StyledStatusBtnBox>
            <Box>
              {item.default ? (
                <StyledDefaultStarIconBox
                  onClick={(e) => {
                    e.stopPropagation();
                    updateDefaultLicense({ ...item, default: false });
                  }}
                  data-testid={"default-button"}
                >
                  <StarIcon sx={{ color: "#FF8D00" }} />
                  <Typography
                    color={"#FF8D00"}
                    fontSize={11}
                    pr={"5px"}
                    data-testid={"default-label"}
                  >
                    {t("default")}
                  </Typography>
                </StyledDefaultStarIconBox>
              ) : (
                <StyledNonDefaultIconBox
                  onClick={(e) => {
                    e.stopPropagation();
                    updateDefaultLicense({ ...item, default: true });
                  }}
                  data-testid={"non-default-button"}
                >
                  <StyledNonDefaultStarIcon fontSize={"small"} />
                </StyledNonDefaultIconBox>
              )}
            </Box>
          </Box>
          {hasPermission(PERMISSIONS.FI_DELETE) && (
            <StyledDeleteIconBox>
              <DeleteIcon
                onClick={(event) => {
                  event.stopPropagation();
                  setIsDeleteModalOpen(true);
                  setSelectedCardItem(item);
                }}
                data-testid={"delete-button"}
              />
            </StyledDeleteIconBox>
          )}
        </StyledCardContent>
        <StyledCardContent item xs={12}>
          <StyledLicenseNumber data-testid={"license-number-label"}>
            {t("licenseNumber")} - {item.code}
          </StyledLicenseNumber>
        </StyledCardContent>
        <StyledCardContent item xs={12} data-testid={"license-name-label"}>
          <StyledDescription>{item.licenseType?.name}</StyledDescription>
        </StyledCardContent>
        <StyledCardContent item xs={12}>
          <StyledDateBox data-testid={"date-of-change-label"}>
            {getFormattedDateValue(item.dateOfChange, getDateFormat(true))}
          </StyledDateBox>
        </StyledCardContent>
      </Grid>
    );
  };

  return (
    <StyledRoot>
      <Box width={"100%"}>
        <StyledGrid width={"100%"} height={"100%"} data-testid={"header"}>
          <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
            <SearchField
              withFilterButton={false}
              text={t("searchRows")}
              onFilterChange={(val) => onSearchClick(val)}
              onClear={onClearFunc}
              width={"275px"}
            />
            <IconButton
              data-testid={"filterBtn"}
              onClick={handleFilterOpen}
              style={{ padding: "4px", marginLeft: "4px" }}
            >
              <FilterListIcon fontSize="small" />
            </IconButton>
            <Box display={"flex"} flexDirection={"row"}>
              {filters.active !== false && (
                <FilterChip
                  name={t("active")}
                  icon={
                    <CloseIcon
                      onClick={deleteStatus}
                      sx={{ color: "#9AA7BE", fontSize: 15 }}
                    />
                  }
                  data={["", "active"]}
                />
              )}
              {filters.inactive !== false && (
                <FilterChip
                  name={t("inactive")}
                  icon={
                    <CloseIcon
                      sx={{ color: "#9AA7BE", fontSize: 15 }}
                      onClick={deleteStatus}
                    />
                  }
                  data={["", "inactive"]}
                />
              )}
              {filters.dateFrom !== null && (
                <FilterChip
                  name={getFormattedDateValue(
                    filters.dateFrom,
                    getDateFormat(true)
                  )}
                  icon={
                    <CloseIcon
                      sx={{ color: "#9AA7BE", fontSize: 15 }}
                      onClick={() => {
                        const newFilter = { ...filters, dateFrom: null };
                        setFilters(newFilter);
                        onFilterClick(newFilter);
                      }}
                    />
                  }
                  data={["dateBefore", filters.dateFrom]}
                />
              )}
              {filters.dateTo !== null && (
                <FilterChip
                  name={getFormattedDateValue(
                    filters.dateTo,
                    getDateFormat(true)
                  )}
                  icon={
                    <CloseIcon
                      sx={{ color: "#9AA7BE", fontSize: 15 }}
                      onClick={() => {
                        const newFilter = { ...filters, dateTo: null };
                        setFilters(newFilter);
                        onFilterClick(newFilter);
                      }}
                    />
                  }
                  data={["dateAfter", filters.dateTo]}
                />
              )}
              {filters.dateTo !== null && filters.dateFrom !== null && (
                <>
                  <TextButton
                    onClick={() => clearAll()}
                    data-testid={"clear-all-button"}
                  >
                    {t("clearAll")}
                  </TextButton>
                </>
              )}
            </Box>
            <Menu
              anchorEl={anchorEl}
              open={openFilter}
              onClose={handleFilterClose}
            >
              <FILicenseFilter
                setFilters={setFilters}
                filters={filters}
                onFilterClick={onFilterClick}
                setAnchorEl={setAnchorEl}
              />
            </Menu>
          </Box>
          {hasPermission(PERMISSIONS.FI_AMEND) && (
            <Box display={"flex"} alignItems={"center"}>
              <PrimaryBtn
                onClick={() => setOpen(true)}
                fontSize={12}
                data-testid={"addNewBtn"}
                endIcon={<AddIcon />}
              >
                {t("addNew")}
              </PrimaryBtn>
            </Box>
          )}
          <ClosableModal
            onClose={() => setOpen(false)}
            open={open}
            includeHeader={true}
            disableBackdropClick={true}
            title={t("addLicenses")}
            padding={0}
          >
            <FILicenseForm
              fi={fi}
              onCancel={onCancel}
              licenses={licenses}
              setLicenses={setLicenses}
            />
          </ClosableModal>
        </StyledGrid>
      </Box>
      {loading ? (
        <LicensePageSkeleton cardNumber={licenseLength} />
      ) : (
        <Box
          alignContent={"flex-start"}
          sx={{ height: "100%", overflow: "hidden" }}
        >
          <Grid
            container
            item
            xs={12}
            alignContent={"flex-start"}
            sx={{ padding: "4px 8px", overflow: "auto", height: "100%" }}
          >
            {!loading && licenses.length === 0 && <NoRecordIndicator />}
            {licenses.map((item, index) => {
              return (
                <Grid
                  key={index}
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  onClick={() => onLicenseItemClick(item)}
                  padding={"8px 4px"}
                  data-testid={`fi-license-card-${index}`}
                  data-targetid={`fi-license-card-${item.code}`}
                >
                  <StyledCardPaper key={index}>
                    {createCardContent(item)}
                  </StyledCardPaper>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}
      <DeleteForm
        headerText={t("delete")}
        bodyText={t("deleteWarning")}
        additionalBodyText={t("license")}
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        onDelete={() => {
          if (selectedCardItem) onDeleteFunction(selectedCardItem);
        }}
      />
    </StyledRoot>
  );
};

export default FILicenseMainPage;
