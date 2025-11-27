import { Box } from "@mui/system";
import { Grid } from "@mui/material";
import ToolbarListSearch from "../../../../Catalog/MiniCatalog/ListSearch";
import { MiniPagingMemo } from "../../../../common/Paging/MiniPaging";
import FIPersonConfigurationItemList from "./FIPersonConfigurationItemList";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../../../../common/Modal/ConfirmModal";
import FiPhysicalPersonListSkeleton from "../../../Skeleton/FiPerson/FiPhysicalPersonListSkeleton";
import ConnectionsModal from "../../../Common/ConnectionsModal";
import FIPersonConfigurationMainDetail from "./FIPersonConfigurationMainDetail";
import { styled } from "@mui/material/styles";
import { PhysicalPersonDataType } from "../../../../../types/physicalPerson.type";
import { CountryDataTypes } from "../../../../../types/common.type";
import { LegalPersonDataType } from "../../../../../types/legalPerson.type";
import { CancelIcon } from "../../../../../api/ui/icons/CancelIcon";

const StyledContentContainer = styled(Grid)(({ theme }: any) => ({
  backgroundColor: theme.palette.paperBackground,
  borderRadius: "8px",
  height: "100%",
  boxSizing: "border-box",
}));

const StyledLeftContainer = styled(Grid)(({ theme }: any) => ({
  height: "100%",
  borderRight: theme.palette.borderColor,
}));

const StyledDrawerContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  height: "100%",
});

const StyledListContainer = styled(Box)({
  height: "100%",
  overflow: "auto",
});

const StyledPages = styled(Box)(({ theme }: any) => ({
  width: "100%",
  display: "flex",
  justifyContent: "center",
  boxShadow:
    theme.palette.mode === "dark"
      ? "3px -20px 8px -4px #dddddd17"
      : "3px -20px 8px -4px #BABABA1A",
  height: theme.general.footerHeight,
  backgroundColor: theme.palette.paperBackground,
  borderBottomLeftRadius: "4px",
}));

const StyledGridItem = styled(Grid)({
  height: "100%",
  width: "100%",
  display: "flex",
});

interface ConfirmModalState {
  isOpened: boolean;
  personId?: number;
}

interface Props {
  persons: PhysicalPersonDataType[];
  tabName: string;
  onFilter: (value: string) => void;
  onClearFilters: () => void;
  personsLength: number;
  pagingPage: number;
  onPagingLimitChange?: (limit: number) => void;
  pagingLimit: number;
  setPagingPage: (page: number) => void;
  loading?: boolean;
  onPersonSelect: (id: number) => void;
  selectedPerson?: PhysicalPersonDataType;
  setSelectedPerson: (person: PhysicalPersonDataType) => void;
  countries: CountryDataTypes[];
  companies: LegalPersonDataType[];
  deletePerson: () => void;
  updatePerson: (person: PhysicalPersonDataType) => Promise<void>;
  defaultEditMode?: boolean;
  setPersons: React.Dispatch<React.SetStateAction<PhysicalPersonDataType[]>>;
  loadingMask: boolean;
  setLoadingMask: (val: boolean) => void;
}

const FIPersonConfigurationItemPage: React.FC<Props> = ({
  onFilter,
  onClearFilters,
  tabName,
  loading,
  onPersonSelect,
  persons,
  personsLength,
  pagingPage,
  setPagingPage,
  pagingLimit,
  selectedPerson,
  setSelectedPerson,
  countries,
  companies,
  deletePerson,
  updatePerson,
  defaultEditMode = false,
  setPersons,
  loadingMask,
  setLoadingMask,
}) => {
  const { personItemId } = useParams<{
    personItemId: string;
  }>();
  const { t } = useTranslation();

  const [isEdit, setIsEdit] = useState(defaultEditMode);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [personName, setPersonName] = useState<string>("");
  const [personStatus, setPersonStatus] = useState<string>("");
  const [identificationNumber, setIdentificationNumber] = useState<string>("");
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isConnectionsModalOpen, setIsConnectionsModalOpen] = useState(false);
  const [isInformationPageOpen, setIsInformationPageOpen] = useState(true);
  const [confirmModalState, setConfirmModalState] = useState<ConfirmModalState>(
    { isOpened: false }
  );

  const openConfirmModal = (personId: number) => {
    setConfirmModalState({ isOpened: true, personId: personId });
  };

  const closeConfirmModal = () => {
    setConfirmModalState({ isOpened: false });
  };

  const changePersonSelect = (personId: number) => {
    setLoadingMask(true);
    if (isEdit) {
      openConfirmModal(personId);
    } else {
      personChangeHandler(personId);
    }
  };

  const personChangeHandler = (personId?: number) => {
    setIsEdit(false);
    onPersonSelect(personId ?? confirmModalState.personId!);
    closeConfirmModal();
  };

  useEffect(() => {
    if (selectedPerson) {
      setPersonName(selectedPerson.name ?? "");
      setPersonStatus(selectedPerson.status ?? "");
      setIdentificationNumber(selectedPerson.identificationNumber ?? "");
    }
  }, [selectedPerson, isEdit]);

  const handleConfirm = (data: any) => {
    let result: any = {
      ...selectedPerson,
      id: selectedPerson!.id!,
      identificationNumber: identificationNumber,
      passportNumber: data.passportNumber,
      citizenship: countries.find((item) => item.id === data.citizenShip),
      name: personName,
      residentStatus: data.residentStatus,
      status: personStatus,
    };
    updatePerson(result);
    setIsEdit(false);
    setSaveModalOpen(false);
  };

  const ItemLeftSide = () => {
    return (
      <StyledDrawerContainer>
        <div>
          <ToolbarListSearch
            onFilter={onFilter}
            to={`/configuration/${tabName}`}
            height={55}
          />
        </div>
        <StyledListContainer>
          {loading ? (
            <>
              <FiPhysicalPersonListSkeleton listItemCount={persons.length} />
            </>
          ) : (
            <FIPersonConfigurationItemList
              onSelect={changePersonSelect}
              selectedPerson={selectedPerson}
              setData={setPersons}
              data={persons}
              itemId={personItemId}
            />
          )}
        </StyledListContainer>
        <StyledPages>
          <MiniPagingMemo
            totalNumOfRows={personsLength}
            initialedPage={pagingPage}
            onPageChange={(number) => setPagingPage(number)}
            initialRowsPerPage={pagingLimit}
          />
        </StyledPages>
      </StyledDrawerContainer>
    );
  };
  return (
    <Box sx={{ height: "100%", overflow: "hidden" }}>
      <StyledContentContainer container>
        <StyledLeftContainer item xs={2}>
          {ItemLeftSide()}
        </StyledLeftContainer>
        <StyledGridItem item xs={10}>
          <FIPersonConfigurationMainDetail
            selectedPerson={selectedPerson}
            setSelectedPerson={setSelectedPerson}
            isEdit={isEdit}
            countries={countries}
            saveModalOpen={saveModalOpen}
            setSaveModalOpen={setSaveModalOpen}
            handleConfirm={handleConfirm}
            companies={companies}
            updatePerson={updatePerson}
            allPersons={persons}
            onClearFilters={onClearFilters}
            setIsConnectionsModalOpen={setIsConnectionsModalOpen}
            setIsInformationPageOpen={setIsInformationPageOpen}
            deletePerson={deletePerson}
            isInformationPageOpen={isInformationPageOpen}
            loader={loading}
            personName={personName}
            setPersonName={setPersonName}
            identificationNumber={identificationNumber}
            setIdentificationNumber={setIdentificationNumber}
            onFilter={onFilter}
            personStatus={personStatus}
            setPersonStatus={setPersonStatus}
            setIsCancelModalOpen={setIsCancelModalOpen}
            setIsEdit={setIsEdit}
            loading={loadingMask}
          />
        </StyledGridItem>
        <ConfirmModal
          isOpen={confirmModalState.isOpened}
          setIsOpen={closeConfirmModal}
          onConfirm={() => personChangeHandler()}
          confirmBtnTitle={t("confirm")}
          headerText={t("cancel")}
          bodyText={t("cancelBodyText")}
          additionalBodyText={t("changes")}
          icon={<CancelIcon />}
        />
        <ConfirmModal
          isOpen={isCancelModalOpen}
          setIsOpen={setIsCancelModalOpen}
          onConfirm={() => {
            setIsCancelModalOpen(false);
            setIsEdit(false);
          }}
          confirmBtnTitle={t("confirm")}
          headerText={t("cancel")}
          bodyText={t("cancelBodyText")}
          additionalBodyText={t("changes")}
          icon={<CancelIcon />}
        />

        <ConnectionsModal
          isConnectionsModalOpen={isConnectionsModalOpen}
          setIsConnectionsModalOpen={setIsConnectionsModalOpen}
          connections={selectedPerson && selectedPerson.connections}
        />
      </StyledContentContainer>
    </Box>
  );
};

export default FIPersonConfigurationItemPage;
