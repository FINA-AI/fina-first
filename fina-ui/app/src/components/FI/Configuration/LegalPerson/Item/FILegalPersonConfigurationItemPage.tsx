import ToolbarListSearch from "../../../../Catalog/MiniCatalog/ListSearch";
import { MiniPagingMemo } from "../../../../common/Paging/MiniPaging";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import FILegalPersonConfigurationItemDetail from "./FILegalPersonConfigurationItemDetail";
import ListSkeleton from "../../../Skeleton/ListSkeleton/ListSkeleton";
import FILegalPersonItemCustomList from "../../../Main/Detail/LegalPerson/Item/FILegalPersonItemCustomList";
import menuLink from "../../../../../api/ui/menuLink";
import { styled } from "@mui/material/styles";
import { LegalPersonDataType } from "../../../../../types/legalPerson.type";
import { PhysicalPersonDataType } from "../../../../../types/physicalPerson.type";
import {
  CriminalRecordDataType,
  ManagersDataType,
  SharesDataType,
} from "../../../../../types/fi.type";

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
  boxShadow:
    theme.palette.mode === "dark"
      ? "3px -20px 8px -4px #dddddd17"
      : "3px -20px 8px -4px #BABABA1A",
  height: theme.general.footerHeight,
  backgroundColor: theme.palette.paperBackground,
  borderBottomLeftRadius: "8px",
}));

interface Props {
  onFilter: (value: string) => void;
  tabName: string;
  loading: boolean;
  onLegalPersonSelect: (legalPerson: LegalPersonDataType) => void;
  legalPersons: LegalPersonDataType[];
  legalPersonsLength: number;
  pagingPage: number;
  onPagingLimitChange?: (limit: number) => void;
  setPagingPage: (page: number) => void;
  pagingLimit: number;
  selectedLegalPerson: LegalPersonDataType | null;
  deleteLegalPerson: (id: number) => void;
  beneficiarySaveFunction: (data: any) => void;
  onSaveCriminalRecordFunction: (
    data: LegalPersonDataType,
    criminalRecordData: CriminalRecordDataType[]
  ) => void;
  onSaveOtherShareFunction: (
    data: LegalPersonDataType,
    otherSharesData: SharesDataType[]
  ) => void;
  onSaveManagerFunction: (
    data: LegalPersonDataType,
    managerData: ManagersDataType[]
  ) => void;
  allPhysicalPerson: PhysicalPersonDataType[];
  allLegalPersons: LegalPersonDataType[];
  updateLegalPersonFunction: (data: LegalPersonDataType) => void;
  defaultEditMode?: boolean;
  query?: URLSearchParams;
  legalPersonData?: any;
  setIsCancelModalOpen: (open: boolean) => void;
  isEdit: boolean;
  setIsEdit: (edit: boolean) => void;
  setLegalPersons?: (data: LegalPersonDataType[]) => void;
  changeLegalPersonDetailsEditMode: (edit: boolean) => void;
  legalPersonDetailsEditMode: boolean;
  personLoading: boolean;
}

const FILegalPersonConfigurationItemPage: React.FC<Props> = ({
  onFilter,
  tabName,
  loading,
  onLegalPersonSelect,
  legalPersons,
  legalPersonsLength,
  pagingPage,
  setPagingPage,
  pagingLimit,
  selectedLegalPerson,
  deleteLegalPerson,
  beneficiarySaveFunction,
  onSaveCriminalRecordFunction,
  onSaveOtherShareFunction,
  onSaveManagerFunction,
  allPhysicalPerson,
  allLegalPersons,
  updateLegalPersonFunction,
  defaultEditMode,
  query,
  legalPersonData,
  setIsCancelModalOpen,
  isEdit,
  setIsEdit,
  changeLegalPersonDetailsEditMode,
  legalPersonDetailsEditMode,
  personLoading,
}) => {
  const { legalPersonId } = useParams<{ legalPersonId: string }>();
  const [saveModalOpen, setSaveModalOpen] = useState(false);

  const changeLegalPerson = (legalPerson: LegalPersonDataType) => {
    onLegalPersonSelect(legalPerson);
  };

  const ItemLeftSide = () => {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div>
          <ToolbarListSearch
            onFilter={onFilter}
            to={`${menuLink.configuration}/${tabName}`}
            height={55}
          />
        </div>
        <div style={{ height: "100%", overflow: "auto" }}>
          {loading ? (
            <ListSkeleton listItemCount={legalPersonsLength} />
          ) : (
            <FILegalPersonItemCustomList
              onSelect={changeLegalPerson}
              data={legalPersons}
              itemId={legalPersonId}
            />
          )}
        </div>
        <StyledPagesBox>
          <MiniPagingMemo
            totalNumOfRows={legalPersonsLength}
            initialedPage={pagingPage}
            onPageChange={(number) => setPagingPage(number)}
            initialRowsPerPage={pagingLimit}
          />
        </StyledPagesBox>
      </div>
    );
  };

  return (
    <Box sx={{ height: "100%", overflow: "hidden" }}>
      <StyledContentContainer container>
        <StyledLeftContainer item xs={2}>
          {ItemLeftSide()}
        </StyledLeftContainer>
        <Grid item xs={10} height={"100%"}>
          <FILegalPersonConfigurationItemDetail
            setSaveModalOpen={setSaveModalOpen}
            saveModalOpen={saveModalOpen}
            selectedLegalPerson={selectedLegalPerson}
            beneficiarySaveFunction={beneficiarySaveFunction}
            onSaveCriminalRecordFunction={onSaveCriminalRecordFunction}
            onSaveOtherShareFunction={onSaveOtherShareFunction}
            onSaveManagerFunction={onSaveManagerFunction}
            allPhysicalPerson={allPhysicalPerson}
            allLegalPersons={allLegalPersons}
            updateLegalPersonFunction={updateLegalPersonFunction}
            defaultEditMode={defaultEditMode}
            query={query}
            legalPersonData={legalPersonData}
            setEdit={setIsEdit}
            edit={isEdit}
            setIsCancelModalOpen={setIsCancelModalOpen}
            deleteLegalPersonConfigurationSide={deleteLegalPerson}
            changeLegalPersonDetailsEditMode={changeLegalPersonDetailsEditMode}
            legalPersonDetailsEditMode={legalPersonDetailsEditMode}
            loading={personLoading}
          />
        </Grid>
      </StyledContentContainer>
    </Box>
  );
};

export default FILegalPersonConfigurationItemPage;
