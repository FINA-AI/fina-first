import FILegalPersonRightSide from "../../../Main/Detail/LegalPerson/Item/FILegalPersonRightSide";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import withLoading from "../../../../../hoc/withLoading";
import NoRecordIndicator from "../../../../common/NoRecordIndicator/NoRecordIndicator";
import { LegalPersonDataType } from "../../../../../types/legalPerson.type";
import { PhysicalPersonDataType } from "../../../../../types/physicalPerson.type";

interface Props {
  saveModalOpen: boolean;
  setSaveModalOpen: (value: boolean) => void;
  selectedLegalPerson: LegalPersonDataType;
  beneficiarySaveFunction: (data: any) => void;
  onSaveCriminalRecordFunction: (data: any) => void;
  onSaveOtherShareFunction: (data: any) => void;
  onSaveManagerFunction: (data: any) => void;
  allPhysicalPerson: PhysicalPersonDataType[];
  allLegalPersons: LegalPersonDataType[];
  updateLegalPersonFunction: (data: LegalPersonDataType) => void;
  query: URLSearchParams;
  legalPersonData?: any;
  edit: boolean;
  setEdit: (value: boolean) => void;
  setIsCancelModalOpen: (value: boolean) => void;
  deleteLegalPersonConfigurationSide: () => void;
  changeLegalPersonDetailsEditMode: (value: boolean) => void;
  legalPersonDetailsEditMode: any;
}

const FILegalPersonConfigurationItemDetail: React.FC<Props> = ({
  saveModalOpen,
  setSaveModalOpen,
  selectedLegalPerson,
  beneficiarySaveFunction,
  onSaveCriminalRecordFunction,
  onSaveOtherShareFunction,
  onSaveManagerFunction,
  allPhysicalPerson,
  allLegalPersons,
  updateLegalPersonFunction,
  query,
  legalPersonData,
  edit,
  setEdit,
  setIsCancelModalOpen,
  deleteLegalPersonConfigurationSide,
  changeLegalPersonDetailsEditMode,
  legalPersonDetailsEditMode,
}) => {
  const [legalPersonInfo, setLegalPersonInfo] =
    useState<LegalPersonDataType>(selectedLegalPerson);

  const update = () => {
    updateLegalPersonFunction(legalPersonInfo);
    setEdit(false);
  };

  useEffect(() => {
    const queryEdit = query.get("edit");
    setEdit(Boolean(queryEdit && queryEdit !== "false"));
    setLegalPersonInfo(selectedLegalPerson);
  }, [selectedLegalPerson]);

  return (
    <Box height={"100%"}>
      {selectedLegalPerson && legalPersonInfo ? (
        <FILegalPersonRightSide
          onSaveCriminalRecordFunction={onSaveCriminalRecordFunction}
          onSave={update}
          legalPersons={allLegalPersons}
          allPhysicalPerson={allPhysicalPerson}
          openNewPhysicalPersonItem={() => {}}
          openNewLegalPersonItem={() => {}}
          allLegalPersons={allLegalPersons}
          currentLegalPerson={selectedLegalPerson}
          beneficiarySaveFunction={beneficiarySaveFunction}
          onSaveManagerFunction={onSaveManagerFunction}
          getAllFIPhysicalPersons={() => {}}
          onSaveOtherShareFunction={onSaveOtherShareFunction}
          selectedPerson={legalPersonInfo}
          setSelectedPerson={(data) => setLegalPersonInfo(data)}
          configurationMode={true}
          isEdit={edit}
          setIsEdit={setEdit}
          legalPersonData={legalPersonData}
          setIsCancelModalOpen={setIsCancelModalOpen}
          setIsConfirmModal={setSaveModalOpen}
          isConfirmModal={saveModalOpen}
          deleteLegalPersonConfigurationSide={
            deleteLegalPersonConfigurationSide
          }
          changeLegalPersonDetailsEditMode={changeLegalPersonDetailsEditMode}
          legalPersonDetailsEditMode={legalPersonDetailsEditMode}
        />
      ) : (
        <NoRecordIndicator />
      )}
    </Box>
  );
};

export default withLoading(FILegalPersonConfigurationItemDetail);
