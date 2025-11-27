import FIChooserSelect from "../../FI/FIChooserSelect";
import React, { FC, memo, useEffect, useState } from "react";
import GetAppRoundedIcon from "@mui/icons-material/GetAppRounded";

import DatePicker from "../../common/Field/DatePicker";
import { Grid } from "@mui/material";
import TextField from "../../common/Field/TextField";
import { useTranslation } from "react-i18next";
import Select from "../../common/Field/Select";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import IconButton from "@mui/material/IconButton";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { FollowUpFilterType, FollowUpType } from "../../../types/followUp.type";
import GhostBtn from "../../common/Button/GhostBtn";
import { BASE_URL, getLanguage } from "../../../util/appUtil";
import { loadFiTreeData } from "../../../api/services/ems/emsFisService";
import { styled } from "@mui/material/styles";
import { FiType } from "../../../types/fi.type";

interface EmsFollowupToolbarProps {
  filters: any;
  onFilterClick: (filters: FollowUpFilterType) => void;
  setSelectedFollowUpRow: React.Dispatch<
    React.SetStateAction<FollowUpType | null>
  >;
}

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

const StyledFilterListRoundedIcon = styled(FilterListRoundedIcon)<{
  isDisable: boolean;
}>(({ isDisable, theme }) => ({
  ...(theme as any).smallIcon,
  color: isDisable ? "rgb(211, 211, 211)" : "rgb(176, 176, 176)",
  "&:hover": {
    color: isDisable ? "" : "#2962FF",
  },
}));

const StyledClearRoundedIcon = styled(ClearRoundedIcon)<{
  isDisable: boolean;
}>(({ isDisable, theme }) => ({
  ...(theme as any).smallIcon,
  color: isDisable ? "rgb(211, 211, 211)" : "rgb(176, 176, 176)",
  "&:hover": {
    color: isDisable ? "" : "#2962FF",
  },
}));

const EmsFollowupToolbar: FC<EmsFollowupToolbarProps> = ({
  filters,
  onFilterClick,
  setSelectedFollowUpRow,
}) => {
  const { t } = useTranslation();

  const [selectedFis, setSelectedFis] = useState<FiType[]>([]);
  const [fis, setFis] = useState<any[]>([]);
  const [filterData, setFilterData] = useState<FollowUpFilterType>(filters);
  const [isFilterActive, setIsFilterActive] = useState<boolean>(false);

  useEffect(() => {
    loadFiData();
  }, []);

  const loadFiData = async () => {
    const res = await loadFiTreeData();
    setFis(res.data);
  };

  const onExportClick = () => {
    const queryParams = [`langCode=${getLanguage()}`];

    if (Object.keys(filterData).length > 0) {
      for (const key in filterData) {
        if (filterData.hasOwnProperty(key)) {
          if (key === "fiIds" && Array.isArray(filterData[key])) {
            const fiIdsArray = filterData[key]
              ?.map((id) => `${key}=${id}`)
              .join("&");
            if (fiIdsArray) {
              queryParams.push(fiIdsArray);
            }
          } else {
            queryParams.push(
              `${key}=${filterData[key as keyof FollowUpFilterType]}`
            );
          }
        }
      }
    }

    const queryString = queryParams.length > 0 ? queryParams.join("&") : "";

    const url =
      `${BASE_URL}/rest/ems/v1/inspection/followup/export` +
      (queryString ? `?${queryString}` : "");

    window.open(url, "_blank");
  };

  return (
    <Grid
      style={{ display: "flex", gap: 8, padding: 8 }}
      data-testid={"toolbar"}
    >
      <Grid width={"100%"}>
        <FIChooserSelect
          onChange={(val) => {
            setSelectedFis(val);
            let fiIds = val.map((item: any) => item.id);
            setFilterData({ ...filterData, fiIds: fiIds });
          }}
          checkedRows={selectedFis}
          label={t("selectfi")}
          data={fis}
          width={200}
          popoverWidth={500}
        />
      </Grid>
      <Grid width={"100%"}>
        <DatePicker
          label={t("deadlinefrom")}
          value={filterData.deadlineDateFrom ?? null}
          onChange={(value) => {
            setFilterData({
              ...filterData,
              deadlineDateFrom: value && value.getTime(),
            });
          }}
          data-testid={"deadline-from"}
        />
      </Grid>
      <Grid width={"100%"}>
        <DatePicker
          label={t("deadlineto")}
          value={filterData.deadlineDateTo ?? null}
          onChange={(value) => {
            setFilterData({
              ...filterData,
              deadlineDateTo: value && value.getTime(),
            });
          }}
          data-testid={"deadline-to"}
        />
      </Grid>
      <Grid width={"100%"}>
        <TextField
          label={t("decreenumber")}
          value={filterData.decreeNumber ?? ""}
          onChange={(val: string) => {
            setFilterData({
              ...filterData,
              decreeNumber: val,
            });
          }}
          fieldName={"decree-number"}
        />
      </Grid>
      <Grid width={"100%"}>
        <TextField
          label={t("reclamationletternumber")}
          value={filterData.reclamationLetterNumber ?? ""}
          onChange={(val: string) => {
            setFilterData({
              ...filterData,
              reclamationLetterNumber: val,
            });
          }}
          fieldName={"reclamation-letter-number"}
        />
      </Grid>
      <Grid width={"100%"}>
        <Select
          label={t("status")}
          value={filterData.status ?? ""}
          data={[
            { label: t("inprogress"), value: "IN_PROGRESS" },
            { label: t("completed"), value: "COMPLETED" },
            { label: t("unfulfilled"), value: "UNFULFILLED" },
            { label: t("partiallycompleted"), value: "PARTIALLY_COMPLETED" },
          ]}
          onChange={(val) => {
            setFilterData({
              ...filterData,
              status: val,
            });
          }}
          data-testid={"status-select"}
        />
      </Grid>
      <Grid width={"100%"}>
        <Select
          label={t("result")}
          value={filterData.result ?? ""}
          data={[
            { label: t("conclusion"), value: "CONCLUSION" },
            { label: t("termextension"), value: "TERM_EXTENSION" },
            { label: t("fined"), value: "FINED" },
            { label: t("sentletter"), value: "SENT_LETTER" },
            { label: t("meeting"), value: "MEETING" },
            { label: t("onsiteinspection"), value: "ONSITE_INSPECTION" },
            { label: t("needsrespond"), value: "NEEDS_RESPOND" },
            { label: t("pending"), value: "PENDING" },
            { label: t("other"), value: "OTHER" },
            { label: t("notaccepted"), value: "NOT_ACCEPTED" },
            { label: t("done"), value: "DONE" },
          ]}
          onChange={(val) => {
            setFilterData({
              ...filterData,
              result: val,
            });
          }}
          data-testid={"result-select"}
        />
      </Grid>
      <Grid width={"100%"}>
        <Select
          data={[
            { label: t("followup"), value: "FOLLOWUP" },
            { label: t("recommendation"), value: "RECOMMENDATION" },
          ]}
          value={filterData.searchIn ?? "FOLLOWUP"}
          onChange={(value) => {
            setFilterData({
              ...filterData,
              searchIn: value ?? "FOLLOWUP",
            });
          }}
          data-testid={"follow-recommendation-select"}
        />
      </Grid>
      <Grid
        width={"100%"}
        style={{ display: "flex", alignItems: "center", gap: 8 }}
      >
        <IconButton
          sx={{
            padding: "2px",
          }}
          onClick={() => {
            setIsFilterActive(true);
            onFilterClick(filterData);
            setSelectedFollowUpRow(null);
          }}
          disabled={Object.keys(filterData).length === 0}
          data-testid={"filter-button"}
        >
          <StyledActiveFilterDot
            className={`${isFilterActive ? "activeFilter" : ""}`}
          />
          <StyledFilterListRoundedIcon
            isDisable={Object.keys(filterData).length === 0}
          />
        </IconButton>
        <IconButton
          sx={{
            padding: "2px",
          }}
          onClick={() => {
            onFilterClick({});
            setFilterData({});
            setSelectedFis([]);
            setSelectedFollowUpRow(null);
            setIsFilterActive(false);
          }}
          data-testid={"clear-button"}
        >
          <StyledClearRoundedIcon
            isDisable={Object.keys(filterData).length === 0}
          />
        </IconButton>
        <GhostBtn
          onClick={() => onExportClick()}
          endIcon={<GetAppRoundedIcon />}
          data-testid={"export-button"}
        >
          {t("export")}
        </GhostBtn>
      </Grid>
    </Grid>
  );
};

export default memo(EmsFollowupToolbar);
