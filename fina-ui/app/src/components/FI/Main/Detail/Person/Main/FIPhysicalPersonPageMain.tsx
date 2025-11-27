import { Box } from "@mui/material";
import FILegalPersonHeader from "./FIPhysicalPersonPageHeader";
import FIPhysicalPageBody from "./FIPhysicalPageBody";
import FIPhysicalPersonPageFooter from "./FIPhysicalPersonPageFooter";
import React from "react";
import { GridColumnType } from "../../../../../../types/common.type";
import { PhysicalPersonDataType } from "../../../../../../types/physicalPerson.type";

interface FIPhysicalPersonPageMainProps {
  columns: GridColumnType[];
  persons: PhysicalPersonDataType[];
  setPersons: React.Dispatch<React.SetStateAction<PhysicalPersonDataType[]>>;
  personsLength: number;
  pagingPage: number;
  pagingLimit: number;
  onPagingLimitChange: (limit: number) => void;
  setPagingPage: (page: number) => void;
  loading: boolean;
  tabName: string;
  rowEdit: (row: PhysicalPersonDataType) => void;
  rowDelete: (row: PhysicalPersonDataType) => void;
  deleteMultiPerson: (selected: PhysicalPersonDataType[]) => void;
  selectedRows: PhysicalPersonDataType[];
  setSelectedRows: React.Dispatch<
    React.SetStateAction<PhysicalPersonDataType[]>
  >;
  setColumns: React.Dispatch<React.SetStateAction<GridColumnType[]>>;
  fiId: number;
}

const FIPhysicalPersonPageMain: React.FC<FIPhysicalPersonPageMainProps> = ({
  columns,
  persons,
  personsLength,
  pagingPage,
  pagingLimit,
  onPagingLimitChange,
  setPagingPage,
  setPersons,
  loading,
  tabName,
  rowDelete,
  rowEdit,
  deleteMultiPerson,
  selectedRows,
  setSelectedRows,
  setColumns,
  fiId,
}) => {
  const deletePersons = () => {
    deleteMultiPerson(selectedRows);
  };

  return (
    <Box display={"flex"} flexDirection={"column"} height={"100%"}>
      <FILegalPersonHeader
        columns={columns}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        deleteMultyBranchsFunction={deletePersons}
        setColumns={setColumns}
      />
      <FIPhysicalPageBody
        columns={columns}
        persons={persons}
        setPersons={setPersons}
        loading={loading}
        tabName={tabName}
        rowDelete={rowDelete}
        rowEdit={rowEdit}
        setSelectedRows={setSelectedRows}
        selectedRows={selectedRows}
        fiId={fiId}
      />
      <FIPhysicalPersonPageFooter
        personsLength={personsLength}
        pagingPage={pagingPage}
        pagingLimit={pagingLimit}
        onPagingLimitChange={onPagingLimitChange}
        setPagingPage={setPagingPage}
      />
    </Box>
  );
};

export default FIPhysicalPersonPageMain;
