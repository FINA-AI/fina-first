import FIManagementPageHeader from "./FIManagementPageHeader";
import FIManagementPageBody from "./FIManagementPageBody";
import FIManagementPageFooter from "./FIManagementPageFooter";
import { Box } from "@mui/system";
import React from "react";
import { GridColumnType } from "../../../../../../types/common.type";
import {
  FiManagementType,
  ManagementDataType,
} from "../../../../../../types/fi.type";

interface FIManagementPageMainProps {
  fiId: number;
  columns: GridColumnType[];
  management: ManagementDataType[];
  setManagement: React.Dispatch<React.SetStateAction<ManagementDataType[]>>;
  managementLength: number;
  pagingPage: number;
  pagingLimit: number;
  onPagingLimitChange: (limit: number) => void;
  setPagingPage: (page: number) => void;
  loading: boolean;
  tabName: string;
  managementType: FiManagementType[];
  setSelectedManagementType: (type: FiManagementType) => void;
  selectedManagementType?: FiManagementType;
  deleteManagement: (row: ManagementDataType) => void;
  editManagement: (row: ManagementDataType) => void;
  setColumns: React.Dispatch<React.SetStateAction<GridColumnType[]>>;
  orderRowByHeader: (cellName: string, arrowDirection: string) => void;
}

const FIManagementPageMain: React.FC<FIManagementPageMainProps> = ({
  fiId,
  columns,
  management,
  setManagement,
  managementLength,
  pagingPage,
  pagingLimit,
  onPagingLimitChange,
  setPagingPage,
  loading,
  tabName,
  managementType,
  setSelectedManagementType,
  selectedManagementType,
  deleteManagement,
  editManagement,
  setColumns,
  orderRowByHeader,
}) => {
  return (
    <Box display={"flex"} flexDirection={"column"} height={"100%"}>
      <div>
        <FIManagementPageHeader
          setSelection={(obj) => setSelectedManagementType(obj)}
          columns={columns}
          setColumns={setColumns}
          managementType={managementType}
          fiId={fiId}
          selectedType={selectedManagementType}
          setManagement={setManagement}
          management={management}
        />
      </div>
      <div
        style={{
          height: "100%",
          overflow: "hidden",
        }}
      >
        <FIManagementPageBody
          fiId={fiId}
          columns={columns}
          managements={management}
          loading={loading}
          setManagements={setManagement}
          tabName={tabName}
          selectedManagementType={selectedManagementType}
          deleteManagement={deleteManagement}
          editManagement={editManagement}
          orderRowByHeader={orderRowByHeader}
        />
      </div>
      <div>
        <FIManagementPageFooter
          pagingPage={pagingPage}
          pagingLimit={pagingLimit}
          onPagingLimitChange={onPagingLimitChange}
          setPagingPage={setPagingPage}
          managementsLength={managementLength}
        />
      </div>
    </Box>
  );
};

export default FIManagementPageMain;
