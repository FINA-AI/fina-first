import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import ToolbarListSearch from "../../../../../Catalog/MiniCatalog/ListSearch";
import { MiniPagingMemo } from "../../../../../common/Paging/MiniPaging";
import { useParams } from "react-router-dom";
import FIPhysicalPersonItemCustomList from "./FIPhysicalPersonItemCustomList";
import FIPhysicalPersonItemRight from "./FIPhysicalPersonItemRight";
import FiPhysicalPersonListSkeleton from "../../../../Skeleton/FiPerson/FiPhysicalPersonListSkeleton";
import FiPhysicalPersonSkeleton from "../../../../Skeleton/FiPerson/FiPhysicalPersonSkeleton";
import withLoading from "../../../../../../hoc/withLoading";
import { styled } from "@mui/material/styles";
import { PhysicalPersonDataType } from "../../../../../../types/physicalPerson.type";
import React from "react";
import { CountryDataTypes } from "../../../../../../types/common.type";
import { CriminalRecordDataType } from "../../../../../../types/fi.type";
import { LegalPersonDataType } from "../../../../../../types/legalPerson.type";

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

const StyledPagesBox = styled(Box)(({ theme }: any) => ({
  width: "100%",
  display: "flex",
  justifyContent: "center",
  boxShadow: "3px -20px 8px -4px #BABABA1A",
  height: theme.general.footerHeight,
  borderBottomLeftRadius: "8px",
}));

interface FIPhysicalPersonItemPageProps {
  configurationMode: boolean;
  onFilter: (searchValue: string) => void;
  pagingPage: number;
  pagingLimit: number;
  personsLength: number;
  onPagingLimitChange?: (limit: number) => void;
  setPagingPage: (page: number) => void;
  tabName: string;
  persons: PhysicalPersonDataType[];
  personMain?: PhysicalPersonDataType;
  setPersonMain: React.Dispatch<React.SetStateAction<PhysicalPersonDataType>>;
  save: () => void;
  cancel?: () => void;
  setCancelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  countries: CountryDataTypes[];
  isEdit: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  isPersonInfoLoading: boolean;
  selectedPerson?: PhysicalPersonDataType;
  setSelectedPerson: React.Dispatch<
    React.SetStateAction<PhysicalPersonDataType>
  >;
  isMainEditValid: boolean;
  isPersonsLoading: boolean;
  onPersonSelect: (person: PhysicalPersonDataType) => void;
  onSaveCriminalRecord: (
    data: PhysicalPersonDataType | LegalPersonDataType,
    criminalRecord: CriminalRecordDataType[],
    id: number
  ) => Promise<any>;
  companies: LegalPersonDataType[];
  allPersons?: PhysicalPersonDataType[];
  setAllPersons?: React.Dispatch<
    React.SetStateAction<PhysicalPersonDataType[]>
  >;
  loadPerson?: (id: number) => void;
}

const FIPhysicalPersonItemPage: React.FC<FIPhysicalPersonItemPageProps> = ({
  configurationMode,
  onFilter,
  pagingPage,
  pagingLimit,
  personsLength,
  setPagingPage,
  tabName,
  persons,
  personMain,
  setPersonMain,
  save,
  setCancelOpen,
  countries,
  isEdit,
  setIsEdit,
  isPersonInfoLoading,
  selectedPerson,
  setSelectedPerson,
  isMainEditValid,
  isPersonsLoading,
  onPersonSelect,
  onSaveCriminalRecord,
  companies,
  allPersons,
  setAllPersons,
  loadPerson,
}) => {
  let { id, personItemId } = useParams<{
    id: string;
    personItemId: string;
  }>();

  const ItemLeftSide = () => {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div>
          <ToolbarListSearch
            onFilter={onFilter}
            to={`/fi/${id}/${tabName}`}
            height={55}
          />
        </div>
        <div
          style={{
            height: "100%",
            overflow: "auto",
          }}
        >
          {isPersonsLoading ? (
            <FiPhysicalPersonListSkeleton listItemCount={8} />
          ) : (
            <FIPhysicalPersonItemCustomList
              onSelect={onPersonSelect}
              data={persons}
              itemId={personItemId}
            />
          )}
        </div>
        <StyledPagesBox>
          <MiniPagingMemo
            totalNumOfRows={personsLength}
            initialedPage={pagingPage}
            onPageChange={(number) => setPagingPage(number)}
            initialRowsPerPage={pagingLimit}
          />
        </StyledPagesBox>
      </div>
    );
  };

  return (
    <Box height={"100%"}>
      <StyledContentContainer container>
        <StyledLeftContainer item xs={2} data-testid={"left-container"}>
          {ItemLeftSide()}
        </StyledLeftContainer>
        <Grid
          item
          xs={10}
          sx={{
            height: "100%",
            paddingBottom: isPersonInfoLoading ? "350px" : "155px",
          }}
          data-testid={"right-container"}
        >
          {isPersonInfoLoading ? (
            <FiPhysicalPersonSkeleton />
          ) : (
            <FIPhysicalPersonItemRight
              configurationMode={configurationMode}
              personMain={personMain}
              setPersonMain={setPersonMain}
              save={save}
              setCancelOpen={setCancelOpen}
              countries={countries}
              isEdit={isEdit}
              setIsEdit={setIsEdit}
              selectedPerson={selectedPerson}
              setSelectedPerson={setSelectedPerson}
              isMainEditValid={isMainEditValid}
              onSaveCriminalRecord={onSaveCriminalRecord}
              companies={companies}
              allPersons={allPersons}
              setAllPersons={setAllPersons}
              loadPerson={loadPerson}
            />
          )}
        </Grid>
      </StyledContentContainer>
    </Box>
  );
};

export default withLoading(FIPhysicalPersonItemPage);
