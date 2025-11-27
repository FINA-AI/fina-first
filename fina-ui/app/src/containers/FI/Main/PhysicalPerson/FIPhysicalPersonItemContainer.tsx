import FIPhysicalPersonItemPage from "../../../../components/FI/Main/Detail/Person/Item/FIPhysicalPersonItemPage";
import React, { Fragment, useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import {
  createFiPerson,
  loadAllPersons,
  loadFiPerson,
  loadFiPhysicalPersons,
  updateFiPerson,
} from "../../../../api/services/fi/fiPersonService";
import { loadFirstLevel } from "../../../../api/services/regionService";
import ConfirmModal from "../../../../components/common/Modal/ConfirmModal";
import { useTranslation } from "react-i18next";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import {
  changefiPhysicalPersonFilter,
  changefiPhysicalPersonPagingLimitAction,
  changefiPhysicalPersonPagingPageAction,
  setFiPersonEdit,
  setFiPersonEditChanged,
  setFiPersonInfoLoadingAction,
  setFiPersonsLoadingAction,
} from "../../../../redux/actions/fiPhysicalPersonActions";
import { SaveIcon } from "../../../../api/ui/icons/SaveIcon";
import { getAllLegalPersonSimple } from "../../../../api/services/fi/fiLegalPersonService";
import { getPersonById } from "../../../../api/services/personService";
import { PhysicalPersonDataType } from "../../../../types/physicalPerson.type";
import {
  CriminalRecordDataType,
  EducationDataType,
  PositionDataType,
  RecommendationDataType,
  SharesDataType,
} from "../../../../types/fi.type";
import { CountryDataTypes } from "../../../../types/common.type";
import { LegalPersonDataType } from "../../../../types/legalPerson.type";
import { CancelIcon } from "../../../../api/ui/icons/CancelIcon";

const copyMainPersonData = (
  from: PhysicalPersonDataType,
  to: PhysicalPersonDataType
) => {
  return {
    ...to,
    id: from.id,
    fiPersonId: from.fiPersonId,
    identificationNumber: from.identificationNumber,
    name: from.name,
    passportNumber: from.passportNumber,
    status: from.status,
    residentStatus: from.residentStatus,
    citizenship: from.citizenship,
    nameStrId: from.nameStrId,
    connectedFis: from.connectedFis,
    connections: from.connections,
    criminalRecords: from.criminalRecords,
    education: from.education,
    positions: from.positions,
    recommendations: from.recommendations,
    shares: from.shares,
  };
};

interface FIPhysicalPersonItemContainerProps {
  tabName: string;
  isPersonsLoading: boolean;
  setFiPersonsLoading: (isLoading: boolean) => void;
  isPersonInfoLoading: boolean;
  setFiPersonInfoLoading: (isLoading: boolean) => void;
  setPagingPage: (page: number) => void;
  setPagingLimit: (limit: number) => void;
  pagingPage: number;
  pagingLimit: number;
  filterValue: string;
  setFilterValue: (value: string) => void;
  isEditValid: {
    education: boolean;
    share: boolean;
    main: boolean;
    position: boolean;
    criminalRecord: boolean;
    recommendation: boolean;
  };
  setIsEditValid: (
    value: FIPhysicalPersonItemContainerProps["isEditValid"]
  ) => void;
  onIsEditChange: (isEdit: boolean, section: string) => void;
  fiId: number;
}

const FIPhysicalPersonItemContainer: React.FC<
  FIPhysicalPersonItemContainerProps
> = ({
  tabName,
  isPersonsLoading,
  setFiPersonsLoading,
  isPersonInfoLoading,
  setFiPersonInfoLoading,
  setPagingPage,
  setPagingLimit,
  pagingPage,
  pagingLimit,
  filterValue,
  setFilterValue,
  isEditValid,
  setIsEditValid,
  onIsEditChange,
  fiId,
}) => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);

  const [persons, setPersons] = useState<PhysicalPersonDataType[]>([]);
  const [personsLength, setPersonsLength] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [countries, setCountries] = useState<CountryDataTypes[]>([]);
  const [selectedPerson, setSelectedPerson] =
    useState<PhysicalPersonDataType>();
  const [personMain, setPersonMain] = useState<PhysicalPersonDataType>();
  const [isCancelOpen, setCancelOpen] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [isCancelForPersonChangeOpen, setCancelForPersonChangeOpen] =
    useState(false);
  const [nextPersonId, setNextPersonId] = useState(0);
  const id = fiId;
  let { personItemId } = useParams<{
    personItemId: string;
  }>();
  const history = useHistory();
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const [companies, setCompanies] = useState<LegalPersonDataType[]>([]);
  const [allPersons, setAllPersons] = useState<PhysicalPersonDataType[]>([]);
  const [mask, setMask] = useState(false);

  useEffect(() => {
    loadAllPersons()
      .then((resp) => {
        setAllPersons(resp.data.list);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setFiPersonsLoading(true);
    getAllLegalPersonSimple()
      .then((resp) => {
        setCompanies(resp.data);
        setFiPersonsLoading(false);
      })
      .catch(() => setFiPersonsLoading(true));
  }, []);

  const loadPerson = (id: number) => {
    getPersonById(id)
      .then((res) => {
        if (selectedPerson) {
          setSelectedPerson({
            ...selectedPerson,
            shares: res.data.shares,
            education: res.data.education,
            recommendations: res.data.recommendations,
            criminalRecords: res.data.criminalRecords,
            positions: res.data.positions,
          });
        }
        setPersonMain({ ...res.data });
      })
      .catch((error) => {
        openErrorWindow(error, t("error"), true);
      });
  };

  useEffect(() => {
    loadCountries();
  }, []);

  useEffect(() => {
    fetchFiPerson();
    setIsEditValid({
      education: true,
      share: true,
      main: true,
      position: true,
      criminalRecord: true,
      recommendation: true,
    });

    setIsEdit(query.get("edit") === "true");
  }, [personItemId]);

  useEffect(() => {
    if (!personMain) return;
    if (selectedPerson?.id) {
      let selectedPersonIndex = persons.findIndex(
        (e) => e.id === selectedPerson.id
      );
      setPersons([
        ...persons.slice(0, selectedPersonIndex),
        personMain,
        ...persons.slice(selectedPersonIndex + 1, persons.length),
      ]);
    } else {
      setPersons([personMain, ...persons.slice(1, persons.length)]);
    }
  }, [personMain]);

  useEffect(() => {
    if (pagingLimit > 0) {
      getFIPhysicalPersons();
    }
  }, [pagingLimit, pagingPage, filterValue]);

  const loadCountries = async () => {
    await loadFirstLevel()
      .then((resp) => {
        setCountries(resp.data);
      })
      .catch((error) => openErrorWindow(error, null, true));
  };

  const save = async () => {
    if (selectedPerson?.id) {
      try {
        let personResp = await updateFiPerson(
          id,
          copyMainPersonData(personMain!, selectedPerson)
        );
        setSelectedPerson(personResp.data);
        changeEditState(false);
        setMask(false);
      } catch (e) {
        openErrorWindow(e, null, true);
      }
    } else {
      try {
        let personResp = await createFiPerson(
          id,
          copyMainPersonData(personMain!, selectedPerson!)
        );
        changePerson(personResp.data.fiPersonId);
        changeEditState(false);
        let loadPersonResp = await loadFiPhysicalPersons(
          pagingPage,
          pagingLimit,
          id
        );
        setPersons(loadPersonResp.data.list);
        setMask(false);
      } catch (e) {
        openErrorWindow(e, null, true);
      }
    }
  };

  const onSave = async (person: PhysicalPersonDataType) => {
    setPersonMain(person);

    const isMissingFields =
      !person.identificationNumber ||
      !person.name ||
      !person.passportNumber ||
      !person.status ||
      !person.residentStatus ||
      !person.citizenship?.id;

    if (isMissingFields) {
      openErrorWindow(t("mandatoryFieldsAreEmpty"), null, true);
      return;
    }

    setConfirmOpen(true);
  };

  const cancel = () => {
    setPersonMain(copyMainPersonData(selectedPerson!, personMain!));
    changeEditState(false);
  };

  const changeEditState = (value: boolean) => {
    setIsEdit(value);
    onIsEditChange(value, "main");
  };

  const onCancel = () => {
    if (isMainChanged()) {
      setCancelOpen(true);
    } else {
      cancel();
    }
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

  const getFIPhysicalPersons = () => {
    setFiPersonsLoading(true);
    loadFiPhysicalPersons(pagingPage, pagingLimit, id, filterValue)
      .then((res) => {
        const data = res.data;
        if (data) {
          setPersonsLength(data.totalResults);
          setPersons(data.list);
        }
        setFiPersonsLoading(false);
      })
      .catch((error) => {
        setFiPersonsLoading(false);
        openErrorWindow(error, null, true);
      });
  };

  const fetchFiPerson = async () => {
    setFiPersonInfoLoading(true);
    let res = await loadFiPerson(id, personItemId);
    const newData = {
      ...res.data,
      recommendations: res.data.recommendations?.sort(
        (a: RecommendationDataType, b: RecommendationDataType) => b.id - a.id
      ),
      shares: res.data.shares?.sort(
        (a: SharesDataType, b: SharesDataType) => b.id - a.id
      ),
      education: res.data.education?.sort(
        (a: EducationDataType, b: EducationDataType) => b.id - a.id
      ),
      criminalRecords: res.data.criminalRecords?.sort(
        (a: CriminalRecordDataType, b: CriminalRecordDataType) => b.id - a.id
      ),
      positions: res.data.positions?.sort(
        (a: PositionDataType, b: PositionDataType) => b.id - a.id
      ),
    };
    setFiPersonInfoLoading(false);
    setSelectedPerson(newData);
    setPersonMain(copyMainPersonData(newData, personMain!));
  };

  const changePerson = (fiPersonId: number) => {
    history.push(`/fi/${id}/physicalperson/${fiPersonId}`);
  };

  const onPersonSelect = (item: PhysicalPersonDataType) => {
    setNextPersonId(item.fiPersonId);
    if (isMainChanged()) {
      setCancelForPersonChangeOpen(true);
      return;
    } else if (
      !isEditValid.share ||
      !isEditValid.education ||
      !isEditValid.criminalRecord ||
      !isEditValid.position ||
      !isEditValid.recommendation
    ) {
      setCancelForPersonChangeOpen(true);
      return;
    }

    changePerson(item.fiPersonId);
  };

  const isMainChanged = () => {
    if (!selectedPerson || !personMain) return false;

    return (
      selectedPerson.identificationNumber !== personMain.identificationNumber ||
      selectedPerson.name !== personMain.name ||
      selectedPerson.passportNumber !== personMain.passportNumber ||
      selectedPerson.status !== personMain.status ||
      selectedPerson.residentStatus !== personMain.residentStatus ||
      selectedPerson.citizenship?.id !== personMain.citizenship?.id
    );
  };

  const onConfirm = () => {
    save();
    setConfirmOpen(false);
  };

  const onSaveCriminalRecord = async (
    data: PhysicalPersonDataType,
    criminalRecord: CriminalRecordDataType,
    id: number
  ) => {
    return await updateFiPerson(id, {
      ...data,
      criminalRecords: criminalRecord,
    });
  };

  return (
    <Fragment>
      <FIPhysicalPersonItemPage
        onFilter={onFilterClick}
        pagingPage={pagingPage}
        pagingLimit={pagingLimit}
        personsLength={personsLength}
        onPagingLimitChange={onPagingLimitChange}
        setPagingPage={setPagingPage}
        persons={persons}
        tabName={tabName}
        personMain={personMain}
        setPersonMain={setPersonMain}
        save={onSave}
        cancel={onCancel}
        setCancelOpen={setCancelOpen}
        countries={countries}
        isEdit={isEdit}
        setIsEdit={changeEditState}
        onPersonSelect={onPersonSelect}
        isPersonsLoading={isPersonsLoading}
        isPersonInfoLoading={isPersonInfoLoading}
        selectedPerson={selectedPerson}
        setSelectedPerson={setSelectedPerson}
        isMainEditValid={isEditValid.main}
        onSaveCriminalRecord={onSaveCriminalRecord}
        companies={companies}
        allPersons={allPersons}
        configurationMode={false}
        setAllPersons={setAllPersons}
        loadPerson={loadPerson}
        loading={mask}
      />
      <ConfirmModal
        isOpen={isCancelForPersonChangeOpen}
        setIsOpen={setCancelForPersonChangeOpen}
        onConfirm={() => {
          changePerson(nextPersonId);
          setIsEditValid({
            education: true,
            share: true,
            main: true,
            position: true,
            criminalRecord: true,
            recommendation: true,
          });
          setCancelForPersonChangeOpen(false);
        }}
        confirmBtnTitle={t("confirm")}
        headerText={t("cancel")}
        additionalBodyText={t("changes")}
        bodyText={t("cancelBodyText")}
        icon={<CancelIcon />}
      />
      <ConfirmModal
        isOpen={isCancelOpen}
        setIsOpen={setCancelOpen}
        onConfirm={() => {
          cancel();
          setCancelOpen(false);
        }}
        confirmBtnTitle={t("confirm")}
        headerText={t("cancelHeaderText")}
        bodyText={t("cancelBodyText")}
        additionalBodyText={t("changes")}
        icon={<CancelIcon />}
      />
      <ConfirmModal
        isOpen={isConfirmOpen}
        setIsOpen={setConfirmOpen}
        onConfirm={onConfirm}
        confirmBtnTitle={t("save")}
        headerText={t("saveHeaderText")}
        bodyText={t("saveBodyText")}
        icon={<SaveIcon />}
        additionalBodyText={t("changes")}
      />
    </Fragment>
  );
};

const reducer = "fiPhysicalPerson";

const mapStateToProps = (state: any) => ({
  isPersonsLoading: state.getIn([reducer, "isFiPhysicalPersonsLoading"]),
  isPersonInfoLoading: state.getIn([reducer, "ifFiPhysicalPersonInfoLoading"]),
  pagingPage: state.get(reducer).pagingPage,
  pagingLimit: state.get(reducer).pagingLimit,
  filterValue: state.get(reducer).filterValue,
  isEditValid: state.get(reducer).isEditValid,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setFiPersonsLoading: bindActionCreators(setFiPersonsLoadingAction, dispatch),
  setFiPersonInfoLoading: bindActionCreators(
    setFiPersonInfoLoadingAction,
    dispatch
  ),
  setPagingPage: bindActionCreators(
    changefiPhysicalPersonPagingPageAction,
    dispatch
  ),
  setPagingLimit: bindActionCreators(
    changefiPhysicalPersonPagingLimitAction,
    dispatch
  ),
  setFilterValue: bindActionCreators(changefiPhysicalPersonFilter, dispatch),
  setIsEditValid: bindActionCreators(setFiPersonEdit, dispatch),
  onIsEditChange: bindActionCreators(setFiPersonEditChanged, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FIPhysicalPersonItemContainer);
