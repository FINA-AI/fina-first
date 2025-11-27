import { Box } from "@mui/system";
import React, { useState } from "react";
import { FieldSize, GridColumnType } from "../../../../types/common.type";
import EmsFileConfigurationDetailHeader from "./EmsFileConfigurationDetailHeader";
import EmsFileConfigurationDetailAddModal from "./EmsFileConfigurationDetailAddModal";
import {
  EmsFileConfigurationDetailDataType,
  FineType,
} from "../../../../types/emsFileConfiguration.type";
import GridTable from "../../../common/Grid/GridTable";
import { styled } from "@mui/material/styles";

interface EmsFIleConfigurationDetailsProps {
  columns: GridColumnType[];
  data: EmsFileConfigurationDetailDataType[];
  setData: (val: EmsFileConfigurationDetailDataType[]) => void;
  loading: boolean;
  addNewAtribute: (data: EmsFileConfigurationDetailDataType) => void;
  removeAtribute: (id: number) => void;
  selectedFileId?: number;
  numberToExcelColumn: (value: number) => void;
  fineTypes: FineType[];
  setColumns: React.Dispatch<React.SetStateAction<GridColumnType[]>>;
}

const StyledRoot = styled(Box)(({ theme }: any) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  boxSizing: "border-box",
  minHeight: "0px",
  backgroundColor: theme.palette.paperBackground,
}));

const StyledGridWrapper = styled(Box)({
  height: "100%",
  borderRadius: 4,
  minHeight: "0px",
});

const EmsFIleConfigurationDetail: React.FC<
  EmsFIleConfigurationDetailsProps
> = ({
  data,
  columns,
  loading,
  addNewAtribute,
  removeAtribute,
  selectedFileId,
  numberToExcelColumn,
  fineTypes,
  setColumns,
  setData,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);

  const handleRowOnClick = (row: any, deselect: any) => {
    if (deselect) {
      setSelectedElement(null);
    } else {
      setSelectedElement({
        ...row,
        sanctionFineType: fineTypes.find(
          (item) => item.id === row.sanctionFineTypeId
        ),
      });
    }
  };

  return (
    <StyledRoot>
      <EmsFileConfigurationDetailHeader
        setIsAddModalOpen={setIsAddModalOpen}
        setSelectedElement={setSelectedElement}
        removeAtribute={removeAtribute}
        selectedElement={selectedElement}
        selectedFileId={selectedFileId}
        setColumns={setColumns}
        columns={columns}
      />
      <StyledGridWrapper>
        <GridTable
          size={FieldSize.SMALL}
          columns={columns}
          rows={data}
          setRows={setData}
          loading={loading}
          selectedRows={selectedElement ? [selectedElement] : []}
          rowOnClick={handleRowOnClick}
        />
      </StyledGridWrapper>
      {isAddModalOpen && selectedFileId && (
        <EmsFileConfigurationDetailAddModal
          isAddModalOpen={isAddModalOpen}
          setIsAddModalOpen={setIsAddModalOpen}
          selectedElement={selectedElement}
          setSelectedElement={setSelectedElement}
          addNewAtribute={addNewAtribute}
          selectedFileId={selectedFileId}
          numberToExcelColumn={numberToExcelColumn}
          fineTypes={fineTypes}
        />
      )}
    </StyledRoot>
  );
};

export default EmsFIleConfigurationDetail;
