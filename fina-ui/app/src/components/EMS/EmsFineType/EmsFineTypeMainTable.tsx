import { Box } from "@mui/system";
import React from "react";
import { GridColumnType } from "../../../types/common.type";
import { FiType } from "../../../types/fi.type";
import { SanctionFineType } from "../../../types/sanction.type";
import GridTable from "../../common/Grid/GridTable";
import EmsFineTypeHeader from "./EmsFineTypeHeader";
import withLoading from "../../../hoc/withLoading";
import { styled } from "@mui/material/styles";

interface EmsFineTypeMainTableProps {
  columns: GridColumnType[];
  data: SanctionFineType[];
  fiTypes: FiType[];
  setData: (value: SanctionFineType[]) => void;
  setCurrFineType: (value: SanctionFineType | null) => void;
  activeTab: string | null;
  setActiveTab: (value: string) => void;
  loading: boolean;
  orderRowByHeader: (cellName: string, arrowDirection: string) => void;
}

const StyledRoot = styled(Box)({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
});

const EmsFineTypeMainTable: React.FC<EmsFineTypeMainTableProps> = ({
  columns,
  fiTypes,
  data,
  setData,
  setCurrFineType,
  activeTab,
  setActiveTab,
  loading,
  orderRowByHeader,
}) => {
  return (
    <StyledRoot>
      <EmsFineTypeHeader
        fiTypes={fiTypes}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <StyledRoot>
        <GridTable
          columns={columns}
          rows={data}
          setRows={setData}
          size={"small"}
          rowOnClick={(row: any, deselect: any) => {
            if (deselect) {
              setCurrFineType(null);
            } else {
              setCurrFineType(row);
            }
          }}
          loading={loading}
          orderRowByHeader={orderRowByHeader}
        />
      </StyledRoot>
    </StyledRoot>
  );
};

export default withLoading(EmsFineTypeMainTable);
