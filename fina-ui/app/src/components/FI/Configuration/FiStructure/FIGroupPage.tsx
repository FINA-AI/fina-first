import { Grid } from "@mui/material";
import FiCriterionList from "./FiCriterionList";
import FiGroupsList from "./FiGroupsList";
import FIStructureSkeleton from "../../Skeleton/Configuration/FIStructure/FIStructureSkeleton";
import React from "react";
import { FiStructureDataType } from "../../../../types/fi.type";

interface FIGroupPageProps {
  loading: boolean;
  groupData: FiStructureDataType[];
  selectedCriterion?: FiStructureDataType;
  setSelectedCriterion: (item: FiStructureDataType | undefined) => void;
  deleteFiFunction: (selectedItem: FiStructureDataType) => void;
  onSaveGroup: (group: FiStructureDataType) => void;
  addNewFormOpen: boolean;
  setAddNewFormOpen: (value: boolean) => void;
  isDeleteConfirmOpen: boolean;
  setIsDeleteConfirmOpen: (value: boolean) => void;
  onSaveCriterion: (criterion: FiStructureDataType) => void;
  makeDefault: (criterion: FiStructureDataType) => void;
  deleteFiParentFunction: () => void;
  data: FiStructureDataType[];
  isParentDelModalOpen: boolean;
  setIsParentDelModalOpen: (value: boolean) => void;
  listAddNewFormOpen: boolean;
  setListAddNewFormOpen: (value: boolean) => void;
  listEditMode: boolean;
  setListEditMode: (value: boolean) => void;
  groupLoading: boolean;
}

const FIGroupPage: React.FC<FIGroupPageProps> = ({
  loading,
  groupData,
  selectedCriterion,
  setSelectedCriterion,
  deleteFiFunction,
  onSaveGroup,
  addNewFormOpen,
  setAddNewFormOpen,
  isDeleteConfirmOpen,
  setIsDeleteConfirmOpen,
  onSaveCriterion,
  makeDefault,
  deleteFiParentFunction,
  data,
  isParentDelModalOpen,
  setIsParentDelModalOpen,
  listAddNewFormOpen,
  setListAddNewFormOpen,
  listEditMode,
  setListEditMode,
  groupLoading,
}) => {
  return (
    <>
      {loading ? (
        <FIStructureSkeleton />
      ) : (
        <Grid container direction={"row"} height={"100%"}>
          <Grid item xs={2} height={"100%"}>
            <FiCriterionList
              selectedItem={selectedCriterion}
              setSelectedItem={setSelectedCriterion}
              onSaveCriterion={onSaveCriterion}
              makeDefault={makeDefault}
              deleteFiParentFunction={deleteFiParentFunction}
              data={data}
              isParentDelModalOpen={isParentDelModalOpen}
              setIsParentDelModalOpen={setIsParentDelModalOpen}
              listAddNewFormOpen={listAddNewFormOpen}
              setListAddNewFormOpen={setListAddNewFormOpen}
              listEditMode={listEditMode}
              setListEditMode={setListEditMode}
            />
          </Grid>
          <Grid item xs={10} height={"100%"}>
            <FiGroupsList
              selectedCriterion={selectedCriterion}
              data={groupData}
              deleteFiFunction={deleteFiFunction}
              onSaveGroup={onSaveGroup}
              addNewFormOpen={addNewFormOpen}
              setAddNewFormOpen={setAddNewFormOpen}
              isDeleteConfirmOpen={isDeleteConfirmOpen}
              setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
              groupLoading={groupLoading}
            />
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default FIGroupPage;
