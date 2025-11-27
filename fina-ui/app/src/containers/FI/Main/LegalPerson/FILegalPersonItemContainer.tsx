import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import {
  changefiLegalPersonFilter,
  changefiLegalPersonPagingLimitAction,
  changefiLegalPersonPagingPageAction,
  setFILegalPersonLoadingAction,
  setFILegalPersonsListLoadingAction,
} from "../../../../redux/actions/fiLegalPersonActions";
import FILegalPersonItemPage from "../../../../components/FI/Main/Detail/LegalPerson/Item/FILegalPersonItemPage";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import {
  addLegalPerson,
  getAllLegalPersonSimple,
  getLegalPersonById,
  loadLegalPersons,
  updateLegalPerson,
} from "../../../../api/services/fi/fiLegalPersonService";
import { loadAllPersons } from "../../../../api/services/fi/fiPersonService";
import { useTranslation } from "react-i18next";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import ConfirmModal from "../../../../components/common/Modal/ConfirmModal";
import { CheckListIcon } from "../../../../api/ui/icons/CheckListIcon";
import InfoModal from "../../../../components/common/Modal/InfoModal";
import { FITabs } from "../../../../components/FI/fiTabs";
import { LegalPersonDataType } from "../../../../types/legalPerson.type";
import { PhysicalPersonDataType } from "../../../../types/physicalPerson.type";
import {
  BeneficiariesDataType,
  CriminalRecordDataType,
  ManagersDataType,
  SharesDataType,
} from "../../../../types/fi.type";
import { CancelIcon } from "../../../../api/ui/icons/CancelIcon";

const copySelectedPerson = (
  from: LegalPersonDataType,
  to: LegalPersonDataType
) => {
  return {
    ...to,
    id: from.id,
    identificationNumber: from.identificationNumber,
    name: from.name,
    status: from.status,
    registrationNumber: from.registrationNumber,
    residentStatus: from.residentStatus,
    metaInfo: from.metaInfo,
    contactInfo: from.contactInfo,
    country: from.country,
    bank: from.bank,
    shares: from.shares,
    managers: from.managers,
    criminalRecords: from.criminalRecords,
    beneficiaries: from.beneficiaries,
  };
};

interface FILegalPersonItemContainerProps {
  filterValue: string;
  isEditValid: boolean;
  pagingPage: number;
  pagingLimit: number;
  isPersonInfoLoading: boolean;
  isPersonListLoading: boolean;
  setFilterValue: (value: string) => void;
  setPagingPage: (page: number) => void;
  setPagingLimit: (limit: number) => void;
  setFiPersonsLoading: (loading: boolean) => void;
  setFiPersonsListLoading: (loading: boolean) => void;
  tabName: string;
  fiId: number;
  isEdit: boolean;
  setIsEdit: (val: boolean) => void;
  originalSelectedPerson?: LegalPersonDataType;
  setOriginalSelectedPerson: (person: LegalPersonDataType | undefined) => void;
}

const FILegalPersonItemContainer: React.FC<FILegalPersonItemContainerProps> = ({
  filterValue,
  setFilterValue,
  setPagingPage,
  tabName,
  pagingPage,
  setPagingLimit,
  pagingLimit,
  originalSelectedPerson,
  setOriginalSelectedPerson,
  isPersonInfoLoading,
  isPersonListLoading,
  setFiPersonsListLoading,
  setFiPersonsLoading,
  isEdit,
  setIsEdit,
  fiId,
}) => {
  const [legalPersons, setLegalPersons] = useState<LegalPersonDataType[]>([]);
  const [allLegalPersons, setAllLegalPersons] = useState<LegalPersonDataType[]>(
    []
  );
  const [allPhysicalPerson, setAllPhysicalPersons] = useState<
    PhysicalPersonDataType[]
  >([]);
  const [legalPersonsLength, setLegalPersonsLength] = useState<number>(0);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false);
  const [selectedPerson, setSelectedPerson] = useState<LegalPersonDataType>(
    {} as LegalPersonDataType
  );
  const [nextPersonId, setNextPersonId] = useState<number>(0);
  const [isPersonChangeModal, setIsPersonChangeModal] =
    useState<boolean>(false);
  const [isPercentageInfoModalOpen, setPercentageInfoModalOpen] =
    useState<boolean>(false);
  const [mask, setMask] = useState<boolean>(false);

  const { openErrorWindow } = useErrorWindow();
  const { enqueueSnackbar } = useSnackbar();
  let { legalPersonItemId } = useParams<{ legalPersonItemId: string }>();
  const history = useHistory();
  const { t } = useTranslation();

  const legalPersonData = { contactInfo: {} };

  useEffect(() => {
    getAllLegalPersonsData();
    getAllPhysicalPersonsData();
  }, []);

  const getAllFIPhysicalPersons = () => {
    setFiPersonsLoading(true);
    loadAllPersons(-1, -1, true)
      .then((res) => {
        const data = res.data;
        if (data) {
          setAllPhysicalPersons(data.list);
        }
        setFiPersonsLoading(false);
      })
      .catch((error) => {
        setFiPersonsLoading(false);
        enqueueSnackbar(error, { variant: "error" });
      });
  };

  const getAllFILegalPersons = () => {
    setFiPersonsLoading(true);
    getAllLegalPersonSimple()
      .then((res) => {
        const data = res.data;
        if (data) {
          setAllLegalPersons([...data]);
        }
        setFiPersonsLoading(false);
      })
      .catch((error) => {
        setFiPersonsLoading(false);
        enqueueSnackbar(error, { variant: "error" });
      });
  };

  useEffect(() => {
    if (originalSelectedPerson?.id) {
      let selectedPersonIndex = legalPersons.findIndex(
        (e) => e.id === originalSelectedPerson.id
      );
      setLegalPersons([
        ...legalPersons.slice(0, selectedPersonIndex),
        selectedPerson,
        ...legalPersons.slice(selectedPersonIndex + 1, legalPersons.length),
      ]);
    } else {
      setLegalPersons([
        selectedPerson,
        ...legalPersons.slice(1, legalPersons.length),
      ]);
    }
  }, [selectedPerson]);

  const getAllLegalPersonsData = () => {
    if (allLegalPersons.length === 0) {
      getAllFILegalPersons();
    }
  };

  const getAllPhysicalPersonsData = () => {
    if (allPhysicalPerson.length === 0) {
      getAllFIPhysicalPersons();
    }
  };

  useEffect(() => {
    fetchLegalPeron();
    setOriginalSelectedPerson(undefined);
  }, [legalPersonItemId]);

  const fetchLegalPeron = async () => {
    try {
      setFiPersonsLoading(true);
      const res = await getLegalPersonById(legalPersonItemId);
      const newData = {
        ...res.data,
        beneficiaries: res.data.beneficiaries.sort(
          (a: BeneficiariesDataType, b: BeneficiariesDataType) => b.id - a.id
        ),
        shares: res.data.shares.sort(
          (a: SharesDataType, b: SharesDataType) => b.id - a.id
        ),
        managers: res.data.managers.sort(
          (a: ManagersDataType, b: ManagersDataType) => b.id - a.id
        ),
        criminalRecords: res.data.criminalRecords.sort(
          (a: CriminalRecordDataType, b: CriminalRecordDataType) => b.id - a.id
        ),
      };
      setOriginalSelectedPerson(newData);
      setSelectedPerson(copySelectedPerson(newData, selectedPerson));
      setFiPersonsLoading(false);
    } catch (e) {
      openErrorWindow(e, t("error"), true);
    }
  };

  useEffect(() => {
    if (pagingLimit > 0) {
      getFILegalPersons();
    }
  }, [pagingLimit, pagingPage]);

  const getFILegalPersons = () => {
    setFiPersonsListLoading(true);
    loadLegalPersons(pagingPage, pagingLimit, fiId, filterValue)
      .then((res) => {
        const data = res.data;
        if (data) {
          setLegalPersonsLength(data.totalResults);
          setLegalPersons(data.list);
        }
        setFiPersonsListLoading(false);
      })
      .catch((err) => {
        setFiPersonsListLoading(false);
        enqueueSnackbar(err, { variant: "error" });
      });
  };

  const onFilterClick = (searchValue: string) => {
    if (!searchValue || (searchValue && searchValue.trim().length > 3)) {
      setPagingPage(1);
      setFilterValue(searchValue);
    }
  };

  const onPagingLimitChange = (limit: number) => {
    setPagingPage(1);
    setPagingLimit(limit);
  };

  const changePerson = (legalPersonItemId: number) => {
    history.push(`/fi/${fiId}/legalperson/${legalPersonItemId}`);
  };

  const onPersonSelect = (item: LegalPersonDataType) => {
    setNextPersonId(item.id);
    if (isEdit) {
      setIsPersonChangeModal(true);
      return;
    }
    setIsEdit(false);
    setOriginalSelectedPerson(item);
    changePerson(item.id);
  };

  const saveEdit = async () => {
    setMask(true);
    let contactInfo: any = {
      ...selectedPerson.contactInfo,
      ...legalPersonData.contactInfo,
    };
    try {
      let res = await updateLegalPerson(
        fiId,
        copySelectedPerson(
          { ...selectedPerson, ...legalPersonData, contactInfo },
          originalSelectedPerson!
        )
      );
      setOriginalSelectedPerson(res.data);
      setIsEdit(false);
      setSelectedPerson(res.data);
      enqueueSnackbar(t("legalPersonEditedSuccess"), { variant: "success" });
    } catch (e) {
      openErrorWindow(e, null, true);
    } finally {
      setMask(false);
    }
  };

  const beneficiarySaveFunction = (data: BeneficiariesDataType[]) => {
    let tmp = { ...originalSelectedPerson };
    tmp.beneficiaries = data;
    saveInfo(tmp);
  };

  const onSaveCriminalRecordFunction = (
    data: CriminalRecordDataType,
    criminalRecordData: CriminalRecordDataType
  ) => {
    let newData = { ...data, criminalRecords: criminalRecordData };
    saveInfo(newData);
  };

  const onSaveOtherShareFunction = (
    data: SharesDataType,
    otherSharesData: SharesDataType
  ) => {
    let newData = { ...data, shares: otherSharesData ? otherSharesData : [] };
    saveInfo(newData);
  };

  const onSaveManagerFunction = (
    data: ManagersDataType,
    managerData: ManagersDataType[]
  ) => {
    let newData = { ...data, managers: managerData ? managerData : {} };
    saveInfo(newData);
  };

  const saveInfo = async (data: any) => {
    await addLegalPerson(data, fiId)
      .then((res) => {
        enqueueSnackbar(t("saved"), { variant: "success" });
        setSelectedPerson({ ...res.data });
        setOriginalSelectedPerson(res.data);
      })
      .catch((error) => {
        const errorResp = error && error.response && error.response.data;
        if (errorResp && errorResp.code === "INVALID_VALUE") {
          setSelectedPerson({ ...selectedPerson });
          setPercentageInfoModalOpen(true);
        } else {
          openErrorWindow(error, t("error"), true);
        }
      });
  };

  const submitSuccess = (personItem: LegalPersonDataType) => {
    let persons = [...legalPersons];
    setLegalPersons([personItem].concat(persons));
  };

  const openNewLegalPersonItem = (obj: any) => {
    if (obj) {
      history.push(`/fi/${fiId}/${tabName}/${obj.company.id}`);
    }
  };

  const openNewPhysicalPersonItem = (obj: any) => {
    if (obj) {
      history.push(`/fi/${fiId}/${FITabs.PHYSYCALPERSON}/${obj.manager.id}`);
    }
  };

  const cancelModalHandler = () => {
    setSelectedPerson(
      copySelectedPerson(originalSelectedPerson!, selectedPerson)
    );
    setIsEdit(false);
    setIsCancelModalOpen(false);
  };

  const onSave = async (data?: LegalPersonDataType) => {
    setMask(true);
    try {
      let contInfo = { ...selectedPerson.contactInfo, ...data?.contactInfo };
      let res = await updateLegalPerson(fiId, {
        ...selectedPerson,
        ...legalPersonData,
        contactInfo: contInfo,
      });
      changePerson(res.data.id);
      let legalPersonResp = await loadLegalPersons(
        pagingPage,
        pagingLimit,
        fiId
      );
      setLegalPersons(legalPersonResp.data.list);
      enqueueSnackbar(t("legalPersonCreateSuccess"), { variant: "success" });
    } catch (e) {
      openErrorWindow(e, null, true);
    } finally {
      setMask(false);
    }
  };

  const personChangeHandler = () => {
    setIsEdit(false);
    changePerson(nextPersonId);
    setIsPersonChangeModal(false);
  };

  return (
    <>
      <FILegalPersonItemPage
        tabName={tabName}
        onFilter={onFilterClick}
        onPersonSelect={onPersonSelect}
        legalPersons={legalPersons}
        legalPersonsLength={legalPersonsLength}
        pagingPage={pagingPage}
        onPagingLimitChange={onPagingLimitChange}
        setPagingPage={setPagingPage}
        pagingLimit={pagingLimit}
        allPhysicalPerson={allPhysicalPerson}
        allLegalPersons={allLegalPersons}
        currentLegalPerson={originalSelectedPerson}
        beneficiarySaveFunction={beneficiarySaveFunction}
        onSaveCriminalRecordFunction={onSaveCriminalRecordFunction}
        submitSuccess={submitSuccess}
        onSaveOtherShareFunction={onSaveOtherShareFunction}
        onSaveManagerFunction={onSaveManagerFunction}
        openNewLegalPersonItem={openNewLegalPersonItem}
        openNewPhysicalPersonItem={openNewPhysicalPersonItem}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        onSave={onSave}
        selectedPerson={selectedPerson}
        setSelectedPerson={setSelectedPerson}
        saveEdit={saveEdit}
        setIsCancelModalOpen={setIsCancelModalOpen}
        getAllFIPhysicalPersons={getAllFIPhysicalPersons}
        isPersonInfoLoading={isPersonInfoLoading}
        isPersonListLoading={isPersonListLoading}
        legalPersonData={legalPersonData}
        loading={mask}
      />
      <ConfirmModal
        isOpen={isPersonChangeModal}
        setIsOpen={setIsPersonChangeModal}
        onConfirm={personChangeHandler}
        confirmBtnTitle={t("confirm")}
        headerText={t("cancel")}
        bodyText={t("cancelBodyText")}
        additionalBodyText={t("changes")}
        icon={<CancelIcon />}
      />
      <ConfirmModal
        isOpen={isCancelModalOpen}
        setIsOpen={setIsCancelModalOpen}
        onConfirm={cancelModalHandler}
        confirmBtnTitle={t("confirm")}
        headerText={t("cancel")}
        bodyText={t("cancelBodyText")}
        additionalBodyText={t("changes")}
        icon={<CancelIcon />}
      />
      {isPercentageInfoModalOpen && (
        <InfoModal
          bodyText={t("shareSumErrorMessage")}
          icon={<CheckListIcon />}
          onOkButtonClick={() => {
            setPercentageInfoModalOpen(false);
          }}
          isOpen={isPercentageInfoModalOpen}
          setIsOpen={setPercentageInfoModalOpen}
        />
      )}
    </>
  );
};

const reducer = "fiLegalPerson";

const mapStateToProps = (state: any) => ({
  filterValue: state.get(reducer).filterValue,
  isEditValid: state.get(reducer).isEditValid,
  pagingPage: state.get(reducer).pagingPage,
  pagingLimit: state.get(reducer).pagingLimit,
  isPersonInfoLoading: state.getIn([reducer, "isFiLegalPersonsLoading"]),
  isPersonListLoading: state.getIn([reducer, "isFiLegalPersonsListLoading"]),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setFiPersonsLoading: bindActionCreators(
    setFILegalPersonLoadingAction,
    dispatch
  ),
  setFiPersonsListLoading: bindActionCreators(
    setFILegalPersonsListLoadingAction,
    dispatch
  ),
  setFilterValue: bindActionCreators(changefiLegalPersonFilter, dispatch),
  setPagingPage: bindActionCreators(
    changefiLegalPersonPagingPageAction,
    dispatch
  ),
  setPagingLimit: bindActionCreators(
    changefiLegalPersonPagingLimitAction,
    dispatch
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FILegalPersonItemContainer);
