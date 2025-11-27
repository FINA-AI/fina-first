import { useTranslation } from "react-i18next";
import { Box } from "@mui/system";
import GridTable from "../common/Grid/GridTable";
import React from "react";
import useConfig from "../../hoc/config/useConfig";
import { PERMISSIONS } from "../../api/permissions";
import { Property } from "../../types/settings.type";
import { SearchInfo } from "./SettingsPage";

interface SettingsAsGridTableProps {
  setData: (data: Property[]) => void;
  data: Property[];
  loading: boolean;
  searchedInfo: SearchInfo;
}

const SettingsAsGridTable: React.FC<SettingsAsGridTableProps> = ({
  data,
  setData,
  loading,
  searchedInfo,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();

  const highlightFilteredWord = (row: any, key: string) => {
    if (row[key].toLowerCase().includes(searchedInfo.searchedValue)) {
      const parts = row[key].split(
        new RegExp(`(${searchedInfo.searchedValue})`, "gi")
      );

      return parts.map((part: string, index: number) => {
        const searchValue = searchedInfo?.searchedValue?.toLowerCase();
        // Apply the mark tag to the parts that match the filter
        if (searchValue && part.toLowerCase().includes(searchValue)) {
          let rowIndex = data.findIndex((item) => item.id === row.id);
          return (
            <mark
              key={index}
              style={{
                backgroundColor:
                  rowIndex === searchedInfo.hopIndex ? "#FF9632" : "",
              }}
            >
              {part}
            </mark>
          );
        }
        return <span key={index}>{part}</span>;
      });
    }
    return <span>{row[key]}</span>;
  };

  let columnHeaders = [
    {
      field: "key",
      headerName: t("key"),
      flex: 1,
      renderCell: (v: string, row: Property) => {
        const exists = data.find((k) => k.key === v)?.value;
        let highlightData = searchedInfo.searchedRows.find(
          (item) => row.id === item.id
        );

        const value = highlightData
          ? highlightFilteredWord(highlightData, "key")
          : v;

        if (exists) {
          return value;
        } else {
          return <div style={{ color: "red" }}>{value}</div>;
        }
      },
    },
    {
      field: "value",
      headerName: t("value"),
      editable: hasPermission(PERMISSIONS.FINA_SECURITY_AMEND),
      hideCopy: true,
      hideSort: true,
      flex: 1,
      renderCell: (v: string, row: Property) => {
        if (row.immutableData && row.immutableData.value !== row.value) {
          return <div style={{ color: "orange" }}>{v}</div>;
        }

        return v;
      },
    },
    {
      field: "description",
      headerName: t("description"),
      flex: 1,
      renderCell: (v: string, row: Property) => {
        let highlightData = searchedInfo.searchedRows.find(
          (item) => row.id === item.id
        );
        return highlightData
          ? highlightFilteredWord(highlightData, "description")
          : v;
      },
    },
  ];

  return (
    <Box width={"100%"} height={"100%"}>
      <GridTable
        size={"small"}
        columns={columnHeaders}
        rows={data}
        setRows={setData}
        disableRowSelection={true}
        checkboxEnabled={false}
        loading={loading}
        virtualized={true}
        scrollToIndex={searchedInfo.hopIndex}
      />
    </Box>
  );
};

export default SettingsAsGridTable;
