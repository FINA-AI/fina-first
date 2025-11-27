import { Box } from "@mui/system";
import GridTable from "../../common/Grid/GridTable";
import React, { useState } from "react";
import EmsInspectionColumnHeader from "./EmsInspectionColumnHeader";
import EmsInspectionColumnAddModal from "./EmsInspectionColumnAddModal";
import { InspectionColumnData } from "../../../types/inspection.type";
import { FieldSize, GridColumnType } from "../../../types/common.type";
import { styled } from "@mui/material/styles";

interface EmsInspectionColumnPageProps {
  columns: GridColumnType[];
  data: InspectionColumnData[];
  setData: (val: InspectionColumnData[]) => void;
  loading: boolean;
  inspectionTypes: string[];
  addNewInspectionColumn: (data: InspectionColumnData) => void;
  initData: () => void;
  removeInspectionColumn: (id: number) => void;
  selectedElement?: {
    id: number;
  };
  setSelectedElement: React.Dispatch<React.SetStateAction<any>>;
  setColumns: React.Dispatch<React.SetStateAction<GridColumnType[]>>;
}

const StyledRoot = styled(Box)(({ theme }: any) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  boxSizing: "border-box",
  backgroundColor: theme.palette.paperBackground,
}));

const EmsInspectionColumnPage: React.FC<EmsInspectionColumnPageProps> = ({
  columns,
  data,
  loading,
  inspectionTypes,
  addNewInspectionColumn,
  initData,
  removeInspectionColumn,
  selectedElement,
  setSelectedElement,
  setColumns,
  setData,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [selectedOptions, setSelectedOptions] = useState([]);

  return (
    <StyledRoot data-testid={"inspection-columns-page"}>
      <EmsInspectionColumnHeader
        setIsAddModalOpen={setIsAddModalOpen}
        initData={initData}
        removeInspectionColumn={removeInspectionColumn}
        selectedElement={selectedElement}
        setSelectedElement={setSelectedElement}
        setColumns={setColumns}
        columns={columns}
      />
      <Box sx={{ height: "100%", borderRadius: 4 }}>
        <GridTable
          size={FieldSize.SMALL}
          columns={columns}
          rows={data}
          setRows={setData}
          loading={loading}
          selectedRows={selectedElement ? [selectedElement] : []}
          rowOnClick={(row: any, deselect: any) => {
            if (deselect) {
              setSelectedElement(undefined);
            } else {
              setSelectedElement(row);
            }
          }}
        />
      </Box>
      {isAddModalOpen && (
        <EmsInspectionColumnAddModal
          isAddModalOpen={isAddModalOpen}
          setIsAddModalOpen={setIsAddModalOpen}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
          inspectionTypes={inspectionTypes}
          addNewInspectionColumn={addNewInspectionColumn}
          selectedElement={selectedElement}
        />
      )}
    </StyledRoot>
  );
};

export default EmsInspectionColumnPage;
