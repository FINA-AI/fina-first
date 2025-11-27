import ToolbarListSearch from "../../../../../Catalog/MiniCatalog/ListSearch";
import MiniPaging from "../../../../../common/Paging/MiniPaging";
import { useParams } from "react-router-dom";
import FILegalPersonItemCustomList from "./FILegalPersonItemCustomList";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import FILegalPersonRightSide from "./FILegalPersonRightSide";
import ListSkeleton from "../../../../Skeleton/ListSkeleton/ListSkeleton";
import FiLegalPersonSkeleton from "../../../../Skeleton/FiLegalPerson/FiLegalPersonSkeleton";
import React, { useState } from "react";
import withLoading from "../../../../../../hoc/withLoading";
import { styled } from "@mui/material/styles";
import { LegalPersonDataType } from "../../../../../../types/legalPerson.type";
import {
  BeneficiariesDataType,
  CriminalRecordDataType,
  ManagersDataType,
  SharesDataType,
} from "../../../../../../types/fi.type";
import { PhysicalPersonDataType } from "../../../../../../types/physicalPerson.type";

const StyledLeftContainer = styled(Grid)(({ theme }: any) => ({
  height: "100%",
  borderRight: theme.palette.borderColor,
}));

const StyledPages = styled(Box)(({ theme }: any) => ({
  width: "100%",
  display: "flex",
  justifyContent: "center",
  boxShadow: "3px -20px 8px -4px #BABABA1A",
  height: theme.general.footerHeight,
  borderBottomLeftRadius: "8px",
}));

const StyledDrawerContainer = styled(Box)({
  height: "100%",
  display: "flex",
  flexDirection: "column",
});

interface FILegalPersonItemPageProps {
  tabName: string;
  onFilter: (search: string) => void;
  onPersonSelect: (person: LegalPersonDataType) => void;
  legalPersons: LegalPersonDataType[];
  legalPersonsLength: number;
  pagingPage: number;
  onPagingLimitChange?: (limit: number) => void;
  setPagingPage: (page: number) => void;
  pagingLimit: number;
  currentLegalPerson?: LegalPersonDataType;
  beneficiarySaveFunction: (data: BeneficiariesDataType[]) => void;
  onSaveCriminalRecordFunction: (
    data: LegalPersonDataType,
    criminalRecords: CriminalRecordDataType
  ) => void;
  onSaveOtherShareFunction: (
    data: LegalPersonDataType,
    shares: SharesDataType[]
  ) => void;
  onSaveManagerFunction: (
    data: LegalPersonDataType,
    managers: ManagersDataType[]
  ) => void;
  openNewLegalPersonItem: (obj: any) => void;
  openNewPhysicalPersonItem: (obj: any) => void;
  submitSuccess: (data: LegalPersonDataType) => void;
  isEdit: boolean;
  setIsEdit: (val: boolean) => void;
  onSave: (data?: LegalPersonDataType) => void;
  selectedPerson: LegalPersonDataType;
  setSelectedPerson: (val: LegalPersonDataType) => void;
  saveEdit: () => void;
  setIsCancelModalOpen: (val: boolean) => void;
  getAllFIPhysicalPersons: () => void;
  allLegalPersons: LegalPersonDataType[];
  allPhysicalPerson: PhysicalPersonDataType[];
  isPersonInfoLoading: boolean;
  isPersonListLoading: boolean;
  legalPersonData: LegalPersonDataType;
  fiId: number;
}

const FILegalPersonItemPage: React.FC<FILegalPersonItemPageProps> = ({
  tabName,
  onFilter,
  onPersonSelect,
  legalPersons,
  legalPersonsLength,
  pagingPage,
  setPagingPage,
  pagingLimit,
  currentLegalPerson,
  beneficiarySaveFunction,
  onSaveCriminalRecordFunction,
  onSaveOtherShareFunction,
  onSaveManagerFunction,
  openNewLegalPersonItem,
  openNewPhysicalPersonItem,
  submitSuccess,
  isEdit,
  setIsEdit,
  onSave,
  selectedPerson,
  setSelectedPerson,
  saveEdit,
  getAllFIPhysicalPersons,
  setIsCancelModalOpen,
  allLegalPersons = [],
  allPhysicalPerson = [],
  isPersonInfoLoading,
  isPersonListLoading,
  legalPersonData,
  fiId,
}) => {
  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const { legalPersonItemId } = useParams<{ legalPersonItemId: string }>();

  const ItemLeftSide = () => {
    return (
      <StyledDrawerContainer>
        <div>
          <ToolbarListSearch
            onFilter={onFilter}
            to={`/fi/${fiId}/${tabName}`}
            height={55}
          />
        </div>
        <div
          style={{
            height: "100%",
            overflow: "auto",
          }}
        >
          {isPersonListLoading ? (
            <ListSkeleton listItemCount={8} />
          ) : (
            <FILegalPersonItemCustomList
              onSelect={onPersonSelect}
              data={legalPersons}
              itemId={legalPersonItemId}
            />
          )}
        </div>
        <StyledPages>
          <MiniPaging
            totalNumOfRows={legalPersonsLength}
            initialedPage={pagingPage}
            onPageChange={(number) => setPagingPage(number)}
            initialRowsPerPage={pagingLimit}
          />
        </StyledPages>
      </StyledDrawerContainer>
    );
  };

  return (
    <Box height={"100%"}>
      <Grid
        container
        sx={{ borderRadius: "8px", height: "100%", boxSizing: "border-box" }}
      >
        <StyledLeftContainer item xs={2} data-testid={"left-container"}>
          {ItemLeftSide()}
        </StyledLeftContainer>
        <Grid
          item
          xs={10}
          sx={{ height: "100%", borderRadius: 8 }}
          data-testid={"right-container"}
        >
          {isPersonInfoLoading ? (
            <FiLegalPersonSkeleton />
          ) : (
            <FILegalPersonRightSide
              submitSuccess={submitSuccess}
              isEdit={isEdit}
              setIsEdit={setIsEdit}
              onSave={onSave}
              selectedPerson={selectedPerson}
              setSelectedPerson={setSelectedPerson}
              saveEdit={saveEdit}
              currentLegalPerson={currentLegalPerson}
              beneficiarySaveFunction={beneficiarySaveFunction}
              onSaveCriminalRecordFunction={onSaveCriminalRecordFunction}
              onSaveOtherShareFunction={onSaveOtherShareFunction}
              onSaveManagerFunction={onSaveManagerFunction}
              openNewLegalPersonItem={openNewLegalPersonItem}
              openNewPhysicalPersonItem={openNewPhysicalPersonItem}
              legalPersons={legalPersons}
              getAllFIPhysicalPersons={getAllFIPhysicalPersons}
              setIsCancelModalOpen={setIsCancelModalOpen}
              allLegalPersons={allLegalPersons}
              allPhysicalPerson={allPhysicalPerson}
              legalPersonData={legalPersonData}
              isConfirmModal={isConfirmModal}
              setIsConfirmModal={setIsConfirmModal}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default withLoading(FILegalPersonItemPage);
