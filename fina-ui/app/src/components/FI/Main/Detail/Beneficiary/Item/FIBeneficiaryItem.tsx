import { Box, Grid } from "@mui/material";
import MiniPaging from "../../../../../common/Paging/MiniPaging";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { SaveIcon } from "../../../../../../api/ui/icons/SaveIcon";
import ConfirmModal from "../../../../../common/Modal/ConfirmModal";
import FIBeneficiaryList from "./FIBeneficiaryList";
import { useSnackbar } from "notistack";
import ToolbarListSearch from "../../../../../Catalog/MiniCatalog/ListSearch";
import ShareholderSkeleton from "../../../../Skeleton/Shareholder/ShareholderSkeleton";
import ShareholderListSkeleton from "../../../../Skeleton/Shareholder/ShareholderListSkeleton";
import FIBeneficiaryHistoryContainer from "../../../../../../containers/FI/Main/Beneficiary/FIBeneficiaryHistoryContainer";
import FIBeneficiaryDetailHeader from "./Header/FIBeneficiaryDetailHeader";
import FIBeneficiaryDetails from "./FIBeneficiaryDetails";
import { FORM_STATE } from "../../../../../common/Detail/DetailForm";
import { styled } from "@mui/material/styles";
import { BeneficiariesDataType } from "../../../../../../types/fi.type";
import { LegalPersonDataType } from "../../../../../../types/legalPerson.type";
import { PhysicalPersonDataType } from "../../../../../../types/physicalPerson.type";
import { CancelIcon } from "../../../../../../api/ui/icons/CancelIcon";

const StyledContentContainer = styled(Grid)({
  borderRadius: "8px",
  height: "100%",
  boxSizing: "border-box",
});

const StyledDrawerContainer = styled(Grid)({
  height: "100%",
  display: "flex",
  flexDirection: "column",
});

const StyledPages = styled(Box)(({ theme }: any) => ({
  width: "100%",
  display: "flex",
  justifyContent: "center",
  boxShadow: "3px -20px 8px -4px #BABABA1A",
  height: theme.general.footerHeight,
  borderBottomLeftRadius: "8px",
}));

const StyledLeftContainer = styled(Grid)(({ theme }: any) => ({
  height: "100%",
  borderRight: theme.palette.borderColor,
}));

const StyledHistoryContainer = styled(Box)({
  width: 350,
  height: "100%",
  position: "absolute",
  top: 0,
  right: 0,
  transitionDuration: "0.5s",
  zIndex: 99999,
  transition: "linear 1s",
});

interface FIBeneficiaryItemProps {
  tabName: string;
  pagingPage: number;
  onPagingLimitChange?: (limit: number) => void;
  pagingLimit: number;
  setPagingPage: (page: number) => void;
  beneficiariesLength: number;
  beneficiaries: BeneficiariesDataType[];
  fiId: string | number;
  beneficiaryItemId?: string;
  selectedBeneficiary?: BeneficiariesDataType;
  onSaveFunction: (data: BeneficiariesDataType) => Promise<boolean>;
  changeSelectedRow: (row: BeneficiariesDataType) => void;
  legalPersons: LegalPersonDataType[];
  physicalPersons: PhysicalPersonDataType[];
  redirectMainPage: () => void;
  openLegalPersonItemPage: (id: number) => void;
  openPhysicalPersonItemPage: (id: number) => void;
  setGeneralInfoEditMode: (editMode: boolean) => void;
  generalInfoEditMode: boolean;
  setPhysicalPersons: (persons: PhysicalPersonDataType[]) => void;
  setLegalPersons: (persons: LegalPersonDataType[]) => void;
  loading?: boolean;
  listLoading?: boolean;
  setSelectedBeneficiary: (beneficiary: BeneficiariesDataType) => void;
  setOriginalSelectedBeneficiary: (beneficiary: BeneficiariesDataType) => void;
  originalSelectedBeneficiary?: BeneficiariesDataType;
  onFilter: (filter: string) => void;
  filterValue?: string;
}

export interface FinalBeneficiaryType {
  id: number;
  beneficiaryId?: string;
  beneficiaryName: string;
  sharePercentage: number | null;
  person?: any;
}

const FIBeneficiaryItem: React.FC<FIBeneficiaryItemProps> = ({
  tabName,
  pagingPage,
  pagingLimit,
  setPagingPage,
  beneficiariesLength,
  beneficiaries,
  fiId,
  beneficiaryItemId,
  selectedBeneficiary,
  onSaveFunction,
  changeSelectedRow,
  legalPersons = [],
  physicalPersons = [],
  redirectMainPage,
  openLegalPersonItemPage,
  openPhysicalPersonItemPage,
  setGeneralInfoEditMode,
  generalInfoEditMode,
  setPhysicalPersons,
  setLegalPersons,
  loading,
  listLoading,
  setSelectedBeneficiary,
  setOriginalSelectedBeneficiary,
  originalSelectedBeneficiary,
  onFilter,
  filterValue,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [activeStatus, setActiveStatus] = useState<string | boolean>("");
  const [personType, setPersonType] = useState<string | null>(null);
  const [selectedTypeItem, setSelectedTypeItem] = useState<
    LegalPersonDataType | PhysicalPersonDataType
  >();
  const [share, setShare] = useState<number | null | string>(null);
  const [currency, setCurrency] = useState<string | null>(null);
  const [shareNominal, setShareNominal] = useState<number | null | string>(
    null
  );
  const [date, setDate] = useState<number>();
  const [personTypeData, setPersonTypeData] = useState<
    LegalPersonDataType | PhysicalPersonDataType | null
  >(null);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [finallBeneficiaryData, setFinallBeneficiaryData] = useState<
    FinalBeneficiaryType[]
  >([]);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [selectedHistory, setSelectedHistory] =
    useState<BeneficiariesDataType | null>(null);
  const [shareholdersHistory, setShareholdersHistory] = useState<
    BeneficiariesDataType[]
  >([]);
  const [shareholdersHistoryLength, setShareholdersHistoryLength] =
    useState<number>(0);
  const [finallBeneficiaryFormState, setFinallBeneficiaryFormState] = useState(
    FORM_STATE.VIEW
  );

  const onSelectHistory = (history: BeneficiariesDataType) => {
    if (selectedBeneficiary && history) {
      let res = {
        ...history,
        legalPerson: selectedBeneficiary.legalPerson,
        physicalPerson: selectedBeneficiary.physicalPerson,
      };
      setSelectedBeneficiary(res);
    }
  };

  useEffect(() => {
    setSelectedHistory(null);
    setOpenHistoryModal(false);
    setShareholdersHistory([]);
  }, [originalSelectedBeneficiary]);

  const onPersonTypeChange = (value: string) => {
    setPersonType(value);
    setSelectedTypeItem(undefined);
  };

  useEffect(() => {
    if (selectedBeneficiary && Object.keys(selectedBeneficiary).length !== 0) {
      setShare(selectedBeneficiary.share || null);
      setCurrency(selectedBeneficiary.currency || null);
      setShareNominal(selectedBeneficiary.nominal);
      setDate(selectedBeneficiary.creationDate);
      setActiveStatus(selectedBeneficiary.active);
      if (selectedBeneficiary.finalBeneficiaries) {
        let finallBeneficiaryArray = [];
        for (let o of selectedBeneficiary.finalBeneficiaries) {
          finallBeneficiaryArray.push({
            id: o.id,
            beneficiaryId: o.person?.identificationNumber,
            beneficiaryName: o.person ? o.person?.name : "",
            sharePercentage: o.share ? o.share : null,
            person: o.person,
          });
        }
        setFinallBeneficiaryData(finallBeneficiaryArray);
      }
      if (selectedBeneficiary.physicalPerson) {
        setSelectedTypeItem(selectedBeneficiary.physicalPerson || undefined);
        setPersonTypeData(selectedBeneficiary.physicalPerson);
        setPersonType("physicalPerson");
      } else {
        setSelectedTypeItem(selectedBeneficiary.legalPerson || undefined);
        setPersonTypeData(selectedBeneficiary.legalPerson ?? null);
        setPersonType("legalPerson");
      }
    }
  }, [selectedBeneficiary]);

  const cancelGeneralEdit = () => {
    setGeneralInfoEditMode(false);
    setIsCancelModalOpen(false);
    if (!selectedBeneficiary) {
      redirectMainPage();
    }
  };

  const saveGeneral = (beneficiaries: FinalBeneficiaryType[] | null) => {
    const isNullOrEmptyObject = (obj: any) =>
      obj == null || (typeof obj === "object" && Object.keys(obj).length === 0);

    let finalBeneficiaryResult: {
      id: number;
      person: PhysicalPersonDataType;
    }[] = [];

    if (beneficiaries) {
      const finalBeneficiariesFiltered = beneficiaries.filter(
        (item) => item.person !== undefined
      );

      for (const o of finalBeneficiariesFiltered) {
        const id = o.id ? o.id : 0;
        finalBeneficiaryResult.push({
          id,
          person: o.person,
        });
      }
    }

    let result: any = {
      id: selectedBeneficiary ? selectedBeneficiary.id : 0,
      fiId: fiId,
      share: share,
      nominal: shareNominal,
      creationDate: date,
      active: activeStatus ? activeStatus : false,
      currency: currency,
      legalPerson: personType === "legalPerson" ? personTypeData : null,
      physicalPerson: personType === "physicalPerson" ? personTypeData : null,
      finalBeneficiaries:
        personType === "legalPerson" && finallBeneficiaryData
          ? finalBeneficiaryResult
          : null,
      fiPersonId: 0,
    };
    if (
      !result.currency ||
      !result.share ||
      (isNullOrEmptyObject(result.legalPerson) &&
        isNullOrEmptyObject(result.physicalPerson)) ||
      !selectedTypeItem ||
      typeof result.active !== "boolean"
    ) {
      result.share === null && setShare("");
      result.currency === null && setCurrency("");
      selectedTypeItem === null && setSelectedTypeItem(undefined);
      personType === null && setPersonType("");
      activeStatus === null && setActiveStatus("");
      enqueueSnackbar(t("requiredFieldsAreEmpty"), { variant: "error" });
    } else {
      onSaveFunction(result).then((success) => {
        if (success) {
          setGeneralInfoEditMode(false);
        }
      });
    }
    setConfirmOpen(false);
    setShareholdersHistory([]);
    setShareholdersHistoryLength(0);
    setFinallBeneficiaryFormState(FORM_STATE.VIEW);
  };

  const ItemLeftSide = () => {
    return (
      <StyledDrawerContainer data-testid={"left-container"}>
        <div>
          <ToolbarListSearch
            onFilter={(searchValue) => {
              onFilter(searchValue);
            }}
            filterValue={filterValue}
            to={`/fi/${fiId}/${tabName}`}
            height={55}
          />
        </div>
        <div style={{ height: "100%", overflow: "auto" }}>
          <FIBeneficiaryList
            data={beneficiaries}
            onSelect={changeSelectedRow}
            itemId={beneficiaryItemId}
          />
        </div>
        <StyledPages>
          <MiniPaging
            totalNumOfRows={beneficiariesLength}
            initialedPage={pagingPage}
            onPageChange={(number) => setPagingPage(number)}
            initialRowsPerPage={pagingLimit}
          />
        </StyledPages>
      </StyledDrawerContainer>
    );
  };

  const getIdentificationCodeForCopy = () => {
    if (selectedBeneficiary) {
      return selectedBeneficiary.physicalPerson
        ? selectedBeneficiary.physicalPerson?.identificationNumber
        : selectedBeneficiary.legalPerson?.identificationNumber;
    }
  };

  return (
    <Box height="100%" data-testid={"beneficiary-item-page"}>
      <StyledContentContainer container>
        <StyledLeftContainer item xs={2}>
          {listLoading ? <ShareholderListSkeleton /> : ItemLeftSide()}
        </StyledLeftContainer>

        <Grid
          item
          xs={10}
          position={"relative"}
          sx={{ height: "100%", paddingBottom: "100px", borderRadius: "8px" }}
          data-testid={"right-container"}
        >
          <StyledHistoryContainer
            style={{
              transform: openHistoryModal ? "translate(0)" : "translate(350px)",
            }}
          >
            {openHistoryModal && (
              <FIBeneficiaryHistoryContainer
                open={openHistoryModal}
                setOpen={setOpenHistoryModal}
                setSelectedHistory={setSelectedHistory}
                selectedHistory={selectedHistory}
                beneficiaryId={selectedBeneficiary?.id}
                setShareholders={setShareholdersHistory}
                shareholders={shareholdersHistory}
                shareholdersHistoryLength={shareholdersHistoryLength}
                setShareholdersHistoryLength={setShareholdersHistoryLength}
                onSelectHistory={onSelectHistory}
              />
            )}
          </StyledHistoryContainer>
          {loading && listLoading && <ShareholderSkeleton />}
          {(!loading || !listLoading) && (
            <FIBeneficiaryDetailHeader
              generalInfoEditMode={generalInfoEditMode}
              onPersonTypeChange={onPersonTypeChange}
              personType={personType}
              selectedBeneficiary={selectedBeneficiary}
              setActiveStatus={setActiveStatus}
              activeStatus={activeStatus}
              setIsCancelModalOpen={setIsCancelModalOpen}
              setSelectedBeneficiary={setSelectedBeneficiary}
              setOriginalSelectedBeneficiary={setOriginalSelectedBeneficiary}
              setConfirmOpen={setConfirmOpen}
              getIdentificationCodeForCopy={getIdentificationCodeForCopy}
              selectedHistory={selectedHistory}
              setSelectedHistory={setSelectedHistory}
              setOpenHistoryModal={setOpenHistoryModal}
              setGeneralInfoEditMode={setGeneralInfoEditMode}
              legalPersons={legalPersons}
              selectedTypeItem={selectedTypeItem}
              setSelectedTypeItem={setSelectedTypeItem}
              setPersonTypeData={setPersonTypeData}
              physicalPersons={physicalPersons}
              openPhysicalPersonItemPage={openPhysicalPersonItemPage}
              setPhysicalPersons={setPhysicalPersons}
              setLegalPersons={setLegalPersons}
              originalSelectedBeneficiary={originalSelectedBeneficiary}
              openLegalPersonItemPage={openLegalPersonItemPage}
            />
          )}

          {(!loading || !listLoading) && (
            <FIBeneficiaryDetails
              share={share}
              generalInfoEditMode={generalInfoEditMode}
              setShare={setShare}
              setCurrency={setCurrency}
              currency={currency}
              shareNominal={shareNominal}
              setShareNominal={setShareNominal}
              date={date}
              setDate={setDate}
              selectedBeneficiary={selectedBeneficiary}
              selectedTypeItem={selectedTypeItem}
              physicalPersons={physicalPersons}
              finallBeneficiaryData={finallBeneficiaryData}
              setFinallBeneficiaryData={setFinallBeneficiaryData}
              saveGeneral={saveGeneral}
              personType={personType}
              finallBeneficiaryFormState={finallBeneficiaryFormState}
              setFinallBeneficiaryFormState={setFinallBeneficiaryFormState}
            />
          )}
        </Grid>
      </StyledContentContainer>
      <ConfirmModal
        isOpen={isConfirmOpen}
        setIsOpen={setConfirmOpen}
        onConfirm={() => {
          saveGeneral(finallBeneficiaryData);
        }}
        confirmBtnTitle={t("save")}
        headerText={t("saveHeaderText")}
        bodyText={t("saveBodyText")}
        icon={<SaveIcon />}
        additionalBodyText={t("changes")}
      />
      <ConfirmModal
        isOpen={isCancelModalOpen}
        setIsOpen={setIsCancelModalOpen}
        onConfirm={cancelGeneralEdit}
        confirmBtnTitle={t("confirm")}
        headerText={t("cancel")}
        bodyText={t("cancelBodyText")}
        additionalBodyText={t("changes")}
        icon={<CancelIcon />}
      />
    </Box>
  );
};

export default FIBeneficiaryItem;
