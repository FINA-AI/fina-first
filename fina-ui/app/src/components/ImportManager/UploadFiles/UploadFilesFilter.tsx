import { Grid } from "@mui/material";
import UserAndGroupVirtualizedSelect from "../../UserManagement/UserAndGroupVirtualizedSelect";
import FIChooserSelect from "../../FI/FIChooserSelect";
import TextField from "../../common/Field/TextField";
import { useTranslation } from "react-i18next";
import Select from "../../common/Field/Select";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import React, { FC, useState } from "react";
import PeriodPicker from "./PeriodPicker/PeriodPicker";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import GhostBtn from "../../common/Button/GhostBtn";
import { UploadFileFilterType } from "../../../types/uploadFile.type";
import { UserAndGroup } from "../../../types/user.type";
import { FiType } from "../../../types/fi.type";

interface UploadFilesFilterProps {
  initData: (filters: any) => void;
  filterStatuses: { name: string; status: string }[];
  setFilterData: React.Dispatch<React.SetStateAction<UploadFileFilterType>>;
}

const UploadFilesFilter: FC<UploadFilesFilterProps> = ({
  initData,
  filterStatuses,
  setFilterData,
}) => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<UploadFileFilterType>({});
  const [selectedUsers, setSelectedUsers] = useState<UserAndGroup[]>([]);
  const [fis, setFis] = useState<FiType[]>([]);
  const [period, setPeriod] = useState<
    undefined | { start: Date | null; end: Date | null }
  >(undefined);

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <UserAndGroupVirtualizedSelect
          label={t("users")}
          setSelectedUsers={(val: UserAndGroup[]) => {
            setFilters({ ...filters, users: val.map((item: any) => item.id) });
            setSelectedUsers(val);
          }}
          selectedUsers={selectedUsers}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          label={t("filename")}
          value={filters.fileName}
          onChange={(val: string) => {
            setFilters({ ...filters, fileName: val });
          }}
        />
      </Grid>
      <Grid item xs={4}>
        <Select
          label={t("status")}
          value={filters.status}
          data={[{ name: "NONE", status: "" }, ...filterStatuses].map(
            (item: { name: string; status: string }) => {
              return { label: item.name, value: item.status };
            }
          )}
          onChange={(val: string) => {
            setFilters({ ...filters, status: val });
          }}
        />
      </Grid>
      <Grid item xs={4}>
        <FIChooserSelect
          width={"100%"}
          label={t("fi")}
          checkedRows={fis}
          onChange={(val) => {
            setFilters({ ...filters, fis: val.map((item: any) => item.code) });
            setFis(val);
          }}
        />
      </Grid>
      <Grid item xs={4}>
        <PeriodPicker
          label={t("uploadTime")}
          dateFormat={"yyyy-MM-dd"}
          value={period}
          setValue={(value: { start: Date | null; end: Date | null }) => {
            setPeriod(value);
            setFilters({
              ...filters,
              periodStart: value["start"],
              periodEnd: value["end"],
            });
          }}
        />
      </Grid>
      <Grid item xs={4}>
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <PrimaryBtn
              style={{ width: "100%" }}
              onClick={() => {
                initData(filters);
                setFilterData(filters);
              }}
            >
              {t("filter")}
            </PrimaryBtn>
          </Grid>
          <Grid item xs={2} display={"flex"} style={{ cursor: "pointer" }}>
            <GhostBtn
              onClick={() => {
                initData({});
                setFilters({});
                setFilterData({});
                setFis([]);
                setPeriod(undefined);
                setSelectedUsers([]);
              }}
              disabled={!Object.keys(filters).length}
              endIcon={<CloseRoundedIcon />}
            >
              {t("clear")}
            </GhostBtn>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default UploadFilesFilter;
