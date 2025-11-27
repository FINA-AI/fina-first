import { Box } from "@mui/system";
import GridTable from "../../../common/Grid/GridTable";
import React, { useState } from "react";
import EmsFileConfigurationHeader from "./EmsFileConfigurationHeader";
import EmsfileconfigurationAddModal from "./EmsFileConfigurationAddModal";
import { EmsFileConfigDataTypes } from "../../../../types/inspection.type";
import { FieldSize, GridColumnType } from "../../../../types/common.type";
import { FiType } from "../../../../types/fi.type";
import { styled } from "@mui/material/styles";

interface EmsInspectionColumnPageProps {
  columns: GridColumnType[];
  data: EmsFileConfigDataTypes[];
  setData: (val: EmsFileConfigDataTypes[]) => void;
  addNewConfig: (payload: FormData, id: number) => void;
  fiTypes: FiType[];
  removeEmsConfig: (id: number) => void;
  getFileConfigs: () => void;
  loading: boolean;
  setSelectedFileId: React.Dispatch<React.SetStateAction<number | undefined>>;
  setColumns: React.Dispatch<React.SetStateAction<GridColumnType[]>>;
}

const StyledRoot = styled(Box)(({ theme }: any) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  boxSizing: "border-box",
  backgroundColor: theme.palette.paperBackground,
}));

const EmsFileConfiguration: React.FC<EmsInspectionColumnPageProps> = ({
  columns,
  data,
  setData,
  addNewConfig,
  fiTypes,
  removeEmsConfig,
  getFileConfigs,
  loading,
  setSelectedFileId,
  setColumns,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);

  const onDelete = () => {
    setSelectedElement(null);
    setSelectedFileId(undefined);
  };

  return (
    <StyledRoot>
      <EmsFileConfigurationHeader
        setIsAddModalOpen={setIsAddModalOpen}
        selectedElement={selectedElement}
        removeEmsConfig={removeEmsConfig}
        setSelectedElement={setSelectedElement}
        getFileConfigs={getFileConfigs}
        onDelete={onDelete}
        setColumns={setColumns}
        columns={columns}
      />
      <Box sx={{ height: "100%", borderRadius: 4 }}>
        <GridTable
          size={FieldSize.SMALL}
          columns={columns}
          rows={data}
          setRows={setData}
          selectedRows={selectedElement ? [selectedElement] : []}
          rowOnClick={(row: any, deselect: any) => {
            if (deselect) {
              setSelectedElement(null);
              setSelectedFileId(undefined);
            } else {
              setSelectedElement(row);
              setSelectedFileId(row.id);
            }
          }}
          loading={loading}
        />
      </Box>
      {isAddModalOpen && (
        <EmsfileconfigurationAddModal
          isAddModalOpen={isAddModalOpen}
          setIsAddModalOpen={setIsAddModalOpen}
          addNewConfig={addNewConfig}
          fiTypes={fiTypes}
          selectedElement={selectedElement}
          setSelectedElement={setSelectedElement}
        />
      )}
    </StyledRoot>
  );
};

export default EmsFileConfiguration;
