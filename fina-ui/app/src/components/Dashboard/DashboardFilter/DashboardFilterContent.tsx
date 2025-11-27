import Box from "@mui/material/Box";
import React, { FC, useMemo } from "react";
import {
  columnFilterConfigType,
  FilterType,
  GridColumnType,
} from "../../../types/common.type";
import { DashletDataType } from "../../../types/dashboard.type";
import GridTable from "../../common/Grid/GridTable";
import { styled } from "@mui/material/styles";

interface DashboardFilterProps {
  generateColumns: GridColumnType[];
  generateColumnsConfig: columnFilterConfigType[];
  loading: boolean;
  filterOnChangeFunction: (value: FilterType[]) => void;
  previewData: DashletDataType[];
  setPreviewData: (val: DashletDataType[]) => void;
}

const StyledItemBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
  width: "100%",
});

const StyledContentWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: 16,
  boxSizing: "border-box",
  minHeight: 0,
  height: "100%",
});

const StyledGirdWrapper = styled(Box)({
  boxSizing: "border-box",
  overflow: "auto",
  maxHeight: 400,
  width: "100%",
  height: "100%",
});

const DashboardFilterContent: FC<DashboardFilterProps> = ({
  generateColumns,
  generateColumnsConfig,
  loading,
  filterOnChangeFunction,
  previewData,
  setPreviewData,
}) => {
  const RenderGrid = useMemo(() => {
    return (
      <GridTable
        columns={generateColumns}
        columnFilterConfig={generateColumnsConfig}
        rows={previewData}
        setRows={setPreviewData}
        selectedRows={[]}
        size={"small"}
        disableRowSelection={true}
        viewMode={true}
        filterOnChangeFunction={filterOnChangeFunction}
        loading={loading}
        virtualized={true}
      />
    );
  }, [previewData, loading, generateColumnsConfig]);

  return (
    <StyledItemBox>
      <StyledContentWrapper>
        <StyledGirdWrapper>{RenderGrid}</StyledGirdWrapper>
      </StyledContentWrapper>
    </StyledItemBox>
  );
};

export default DashboardFilterContent;
