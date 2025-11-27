import React, {
  FC,
  memo,
  useCallback,
  useRef,
  useState,
  useEffect,
} from "react";
import { useTranslation } from "react-i18next";
import FIChooserSelect from "../../FI/FIChooserSelect";
import TextField from "../../common/Field/TextField";
import Select from "../../common/Field/Select";
import GhostBtn from "../../common/Button/GhostBtn";
import { Grid } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import GetAppRoundedIcon from "@mui/icons-material/GetAppRounded";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import CustomAutoComplete from "../../common/Field/CustomAutoComplete";
import { FiType } from "../../../types/fi.type";
import { EmsInspectionType } from "../../../types/inspection.type";
import { SanctionDataType } from "../../../types/sanction.type";
import useConfig from "../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../api/permissions";
import { styled } from "@mui/material/styles";

interface EmsProfileMainToolbarProps {
  inspectionTypes: EmsInspectionType[];
  sanctionTypes: SanctionDataType[];
  fis: any[];
  onFilterClick: (filterData: object) => void;
  onFilterClear: () => void;
  setAdvancedFilterModal: React.Dispatch<React.SetStateAction<boolean>>;
  onExportClick: () => void;
  setSelectedInspectionRow: React.Dispatch<React.SetStateAction<any>>;
  isFilterActive: boolean;
  resetToolbar?: boolean;
  onResetHandled?: () => void;
  isAdvancedFilterActive: boolean;
}

const commonIconStyles = (theme: any) => ({
  ...theme.smallIcon,
  color: "rgb(176, 176, 176)",
  "&:hover": {
    color: "#2962FF",
  },
});

const StyledRoot = styled(Grid)(({ theme }: any) => ({
  display: "flex",
  gap: 8,
  padding: 8,
  backgroundColor: theme.palette.paperBackground,
}));

const StyledFilterListRoundedIcon = styled(FilterListRoundedIcon)(
  ({ theme }) => ({
    ...commonIconStyles(theme),
  })
);

const StyledClearRoundedIcon = styled(ClearRoundedIcon)(({ theme }) => ({
  ...commonIconStyles(theme),
}));

const StyledActiveFilterDot = styled("div")({
  "&.activeFilter": {
    background: "#2962FF",
    width: "4px",
    height: "4px",
    borderRadius: "34px",
    position: "absolute",
    top: "0px",
    right: "0px",
  },
});

const StyledActiveFilterBadge = styled("div")(() => ({
  background: "#2962FF",
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  position: "absolute",
  top: "0px",
  right: "0px",
  zIndex: 1,
  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
}));

const EmsProfileMainToolbar: FC<EmsProfileMainToolbarProps> = ({
  inspectionTypes,
  sanctionTypes,
  fis,
  onFilterClick,
  onFilterClear,
  setAdvancedFilterModal,
  onExportClick,
  setSelectedInspectionRow,
  isFilterActive,
  resetToolbar,
  onResetHandled,
  isAdvancedFilterActive,
}) => {
  const { t } = useTranslation();
  const [selectedFis, setSelectedFis] = useState<FiType[]>([]);
  const [resetFields, setResetFields] = useState<boolean>(false);
  const { hasPermission } = useConfig();

  const defaultFilterData = {
    inspectionTypes: {},
    status: "-1",
    sanctionType: {},
  };

  const filterDataRef = useRef({ ...defaultFilterData });

  const status = [
    { label: t("planned"), value: "0" },
    { label: t("inprogress"), value: "1" },
    { label: t("done"), value: "2" },
  ];

  useEffect(() => {
    if (resetToolbar) {
      filterDataRef.current = { ...defaultFilterData };
      setSelectedFis([]);
      setResetFields((prev) => !prev);
      onResetHandled?.();
    }
  }, [resetToolbar]);

  const onFilterChange = (key: string, value: any) => {
    filterDataRef.current = { ...filterDataRef.current, [key]: value };
  };

  const GetFieldsCallback = useCallback(() => {
    return (
      <>
        <Grid width={"100%"}>
          <TextField
            label={t("inspectiondocumentnumber")}
            onChange={(val: string) => {
              onFilterChange("inspectionDocumentNumber", val);
            }}
            fieldName={"inspection-doc-number"}
          />
        </Grid>
        <Grid width={"100%"} data-testid={"inspection-field-container"}>
          <CustomAutoComplete
            label={t("selectinspection")}
            data={inspectionTypes}
            selectedItem={filterDataRef.current.inspectionTypes}
            displayFieldName={"descriptions"}
            valueFieldName={"id"}
            onChange={(val) => onFilterChange("inspectionTypes", val)}
            onClear={() => onFilterChange("inspectionTypes", null)}
          />
        </Grid>
        <Grid width={"100%"}>
          <Select
            label={t("status")}
            value={
              filterDataRef.current.status !== "-1"
                ? filterDataRef.current.status
                : ""
            }
            onChange={(selectedStatus) =>
              onFilterChange("status", selectedStatus)
            }
            data={status}
            data-testid={"status-select"}
          />
        </Grid>
        <Grid width={"100%"}>
          <TextField
            label={t("entersanctiondocnumber")}
            onChange={(val: string) => {
              onFilterChange("sanctionDocumentNumber", val);
            }}
            fieldName={"sanction-doc-number"}
          />
        </Grid>
        <Grid width={"100%"} data-testid={"sanction-type-field-container"}>
          <CustomAutoComplete
            label={t("selectsanctiontype")}
            data={sanctionTypes.map((item) => ({
              ...item,
              description: `${item.type} - ${item.name}`,
            }))}
            selectedItem={filterDataRef.current.sanctionType}
            displayFieldName={"description"}
            valueFieldName={"id"}
            onChange={(val) => onFilterChange("sanctionType", val)}
            onClear={() => onFilterChange("sanctionType", null)}
          />
        </Grid>
        <Grid width={"100%"}>
          <Select
            data={[
              { label: t("all"), value: "all" },
              { label: t("synchronizedaml"), value: "synchronizedaml" },
              { label: t("nonsynchronized"), value: "nonsynchronized" },
            ]}
            label={t("choosesynchronizedtype")}
            onChange={(value) => {
              onFilterChange("synchronizedtype", value);
            }}
            data-testid={"sync-type-select"}
          />
        </Grid>
      </>
    );
  }, [resetFields, inspectionTypes, sanctionTypes]);

  return (
    <StyledRoot data-testid={"toolbar"}>
      <Grid width={"100%"}>
        <FIChooserSelect
          onChange={(val) => setSelectedFis(val)}
          label={t("selectfi")}
          data={fis}
          checkedRows={selectedFis}
          popoverWidth={500}
          width={200}
        />
      </Grid>
      {<GetFieldsCallback />}
      <Grid
        width={"100%"}
        style={{ display: "flex", alignItems: "center", gap: 8 }}
      >
        <IconButton
          sx={{ padding: "2px" }}
          onClick={() => {
            setSelectedInspectionRow(null);
            onFilterClick({ ...filterDataRef.current, fis: selectedFis });
          }}
          data-testid={"filter-button"}
        >
          <StyledActiveFilterDot
            className={isFilterActive ? "activeFilter" : ""}
          />
          <StyledFilterListRoundedIcon />
        </IconButton>

        <IconButton
          sx={{ padding: "2px" }}
          onClick={() => {
            filterDataRef.current = { ...defaultFilterData };
            onFilterClear();
            setSelectedFis([]);
            setResetFields((prev) => !prev);
          }}
          data-testid={"clear-button"}
        >
          <StyledClearRoundedIcon />
        </IconButton>

        <GhostBtn
          onClick={() => setAdvancedFilterModal(true)}
          tooltipText={t("advancedfilter")}
          startIcon={
            <>
              <TravelExploreIcon />
              {isAdvancedFilterActive && (
                <StyledActiveFilterBadge className="activeFilter" />
              )}
            </>
          }
          data-testid={"advanced-filter-button"}
        />
        {hasPermission(PERMISSIONS.EMS_FI_EXPORT) && (
          <GhostBtn
            onClick={onExportClick}
            endIcon={<GetAppRoundedIcon />}
            data-testid={"export-button"}
          >
            {t("export")}
          </GhostBtn>
        )}
      </Grid>
    </StyledRoot>
  );
};

export default memo(EmsProfileMainToolbar);
