import React, { FC } from "react";
import Box from "@mui/material/Box";
import DashboardFilterContent from "./DashboardFilterContent";

import { DashletDataType } from "../../../types/dashboard.type";
import {
  columnFilterConfigType,
  GridColumnType,
} from "../../../types/common.type";

interface DashboardFilterProps {
  generateColumns: GridColumnType[];
  isFilterOpen: boolean;
  generateColumnsConfig: columnFilterConfigType[];
  loading: boolean;
  filterOnChangeFunction: (
    obj: columnFilterConfigType[],
    data?: DashletDataType[]
  ) => void;
  previewData: DashletDataType[];
  setPreviewData: (val: DashletDataType[]) => void;
}

const DashboardFilter: FC<DashboardFilterProps> = ({
  generateColumns,
  isFilterOpen,
  generateColumnsConfig,
  loading,
  filterOnChangeFunction,
  previewData,
  setPreviewData,
}) => {
  return (
    <Box display={"flex"} width={"100%"} height={"100%"}>
      {isFilterOpen && (
        <DashboardFilterContent
          generateColumns={generateColumns}
          generateColumnsConfig={generateColumnsConfig}
          loading={loading}
          filterOnChangeFunction={filterOnChangeFunction}
          previewData={previewData}
          setPreviewData={setPreviewData}
        />
      )}
    </Box>
  );
};

export default DashboardFilter;
