import React from "react";
import Divider from "@mui/material/Divider";
import PrimaryBtn from "../../../../../common/Button/PrimaryBtn";
import { Box } from "@mui/system";
import { Checkbox, Stack, Typography } from "@mui/material";
import DatePicker from "../../../../../common/Field/DatePicker";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";
import GhostBtn from "../../../../../common/Button/GhostBtn";
import { styled } from "@mui/material/styles";
import { FILicenseFilterType } from "../../../../../../containers/FI/Main/License/FILicenseContainer";

interface FILicenseFilterProps {
  setFilters: (filters: FILicenseFilterType) => void;
  filters: FILicenseFilterType;
  onFilterClick: (filters: FILicenseFilterType) => void;
  setAnchorEl: (el: null | HTMLElement) => void;
}

const StyledHeader = styled(Box)(({ theme }: any) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: "0px 12px 8px 12px ",
  borderBottom: theme.palette.borderColor,
}));

const StyledTitle = styled(Box)({
  lineHeight: "16px",
  fontSize: "11px",
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
});

const StyledIconsBox = styled(Box)({
  display: "flex",
  paddingTop: "8px",
  alignItems: "center",
  justifyContent: "center",
});

const StyledFilterText = styled(Typography)(({ theme }: any) => ({
  fontWeight: 500,
  fontSize: "11px",
  lineHeight: "12px",
  color: theme.palette.secondaryTextColor,
}));

const StyledCloseIcon = styled(CloseIcon)(({ theme }: any) => ({
  display: "flex",
  alignItems: "center",
  color: "#9AA7BE",
  cursor: "pointer",
  ...theme.smallIcon,
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  background: theme.palette.mode === "dark" ? "#3C4D68" : "#EAEBF0",
}));

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }: any) => ({
  paddingTop: "4px",
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "20px",
  height: "30px",
  "& .MuiCheckbox-root": {
    color: theme.palette.mode === "light" ? "#C3CAD8" : "#495F80",
    padding: "0px !important",
    margin: "8px",
  },
  "& .Mui-checked": {
    "& .MuiSvgIcon-root": {
      color: theme.palette.primary.main,
    },
  },
  "& .MuiFormControlLabel-label": {
    fontSize: "12px",
    color: theme.palette.textColor,
  },
}));

const FILicenseFilter: React.FC<FILicenseFilterProps> = ({
  setFilters,
  filters,
  onFilterClick,
  setAnchorEl,
}) => {
  const { t } = useTranslation();

  const setValue = (
    key: keyof FILicenseFilterType,
    value: boolean | string | null
  ) => {
    setFilters({
      ...filters,
      [key]: value,
    });
  };

  const clearFunc = () => {
    setFilters({
      dateFrom: null,
      dateTo: null,
      active: false,
      inactive: false,
    });
  };

  return (
    <Box width={"190px"} data-testid={"license-filter-menu"}>
      <StyledHeader>
        <StyledTitle>{t("filter")}</StyledTitle>
        <Box
          onClick={() => {
            setAnchorEl(null);
          }}
          data-testid={"close-button"}
        >
          <StyledCloseIcon />
        </Box>
      </StyledHeader>
      <Box padding={"12px"}>
        <StyledFilterText>{t("status")}</StyledFilterText>
        <Stack>
          <StyledFormControlLabel
            label="Active"
            control={
              <Checkbox
                checked={filters.active}
                size="small"
                onChange={() => {
                  setFilters({ ...filters, inactive: false, active: true });
                }}
                data-testid={"active-checkbox"}
              />
            }
          />
          <StyledFormControlLabel
            label="Inactive"
            control={
              <Checkbox
                checked={filters.inactive}
                size={"small"}
                onChange={() => {
                  setFilters({ ...filters, inactive: true, active: false });
                }}
                data-testid={"inactive-checkbox"}
              />
            }
          />
        </Stack>
      </Box>
      <StyledDivider />
      <Box padding={"12px"} paddingBottom={"10px"}>
        <StyledFilterText>{t("date")}</StyledFilterText>
        <Box paddingTop={"10px"}>
          <DatePicker
            size={"small"}
            label={"From"}
            onChange={(value) => {
              setValue(
                "dateFrom",
                value ? new Date(value).getTime().toString() : null
              );
            }}
            value={filters.dateFrom}
            data-testid={"from-date"}
          />
        </Box>
        <Box paddingTop={"13px"}>
          <DatePicker
            size={"small"}
            label={"To"}
            onChange={(value) => {
              setValue(
                "dateTo",
                value ? new Date(value).getTime().toString() : null
              );
            }}
            value={filters.dateTo}
            data-testid={"to-date"}
          />
        </Box>
      </Box>
      <StyledDivider />
      <StyledIconsBox>
        <Box marginRight={"8px"}>
          <GhostBtn
            onClick={() => {
              clearFunc();
            }}
            data-testid={"clear-button"}
          >
            {t("clear")}
          </GhostBtn>
        </Box>
        <PrimaryBtn
          onClick={() => {
            onFilterClick(filters);
            setAnchorEl(null);
          }}
          endIcon={<FilterListIcon />}
          data-testid={"filter-button"}
        >
          {t("filter")}
        </PrimaryBtn>
      </StyledIconsBox>
    </Box>
  );
};

export default FILicenseFilter;
