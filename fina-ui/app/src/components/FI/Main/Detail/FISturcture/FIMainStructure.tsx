import { Grid } from "@mui/material";
import FIStructureList from "./FIStructureList";
import FIStructureRightSide from "./FIStructureRightSide";
import FIMainStructureSkeleton from "../../../Skeleton/FIStructure/FIMainStructureSkeleton";
import { styled } from "@mui/material/styles";
import { FiStructureDataType } from "../../../../../types/fi.type";
import React from "react";

const StyledContentContainer = styled(Grid)(({ theme }: any) => ({
  backgroundColor: theme.palette.paperBackground,
  borderRadius: "4px",
  height: "100%",
  boxSizing: "border-box",
}));

interface FIMainStructureProps {
  setCheckedItems: () => Promise<void>;
  checkedItemsData: FiStructureDataType[];
  setCheckedItemsData: React.Dispatch<
    React.SetStateAction<FiStructureDataType[]>
  >;
  setIsCancelModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  groupData: FiStructureDataType[];
  selectedItem?: FiStructureDataType;
  setSelectedItem: React.Dispatch<
    React.SetStateAction<FiStructureDataType | undefined>
  >;
  groupLoading: boolean;
  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const FIMainStructure: React.FC<FIMainStructureProps> = ({
  setCheckedItems,
  checkedItemsData,
  setCheckedItemsData,
  setIsCancelModalOpen,
  loading,
  groupData,
  selectedItem,
  setSelectedItem,
  groupLoading,
  editMode,
  setEditMode,
}) => {
  return (
    <>
      {loading ? (
        <FIMainStructureSkeleton />
      ) : (
        <StyledContentContainer container direction={"row"}>
          <Grid item xs={2} height={"100%"} data-testid={"left-container"}>
            <FIStructureList
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              editMode={editMode}
              setEditMode={setEditMode}
            />
          </Grid>
          <Grid item xs={10} height={"100%"} data-testid={"right-container"}>
            <FIStructureRightSide
              selectedCriterion={selectedItem}
              data={groupData}
              loading={loading}
              setCheckedItems={setCheckedItems}
              checkedItemsData={checkedItemsData}
              setCheckedItemsData={setCheckedItemsData}
              setIsCancelModalOpen={setIsCancelModalOpen}
              groupLoading={groupLoading}
              editMode={editMode}
              setEditMode={setEditMode}
            />
          </Grid>
        </StyledContentContainer>
      )}
    </>
  );
};

export default FIMainStructure;
