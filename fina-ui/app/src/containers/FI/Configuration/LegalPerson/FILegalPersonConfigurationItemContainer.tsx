import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import {
  changefiLegalPersonPagingLimitAction,
  changefiLegalPersonPagingPageAction,
} from "../../../../redux/actions/fiLegalPersonActions";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import {
  getAllLegalPersonSimple,
  getLegalPersonById,
} from "../../../../api/services/fi/fiLegalPersonService";
import { useTranslation } from "react-i18next";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import FILegalPersonConfigurationItemPage from "../../../../components/FI/Configuration/LegalPerson/Item/FILegalPersonConfigurationItemPage";
import {
  deletePersons,
  loadLegalPersons,
  updateLegalPerson,
} from "../../../../api/services/legalPersonService";
import { loadAllPersons } from "../../../../api/services/fi/fiPersonService";
import InfoModal from "../../../../components/common/Modal/InfoModal";
import { CheckListIcon } from "../../../../api/ui/icons/CheckListIcon";
import ConfirmModal from "../../../../components/common/Modal/ConfirmModal";
import { useSnackbar } from "notistack";
import menuLink from "../../../../api/ui/menuLink";
import { LegalPersonDataType } from "../../../../types/legalPerson.type";
import { PhysicalPersonDataType } from "../../../../types/physicalPerson.type";
import { FilterType } from "../../../../types/common.type";
import {
  CriminalRecordDataType,
  ManagersDataType,
  SharesDataType,
} from "../../../../types/fi.type";
import { CancelIcon } from "../../../../api/ui/icons/CancelIcon";

interface Props {
  setPagingPage: (page: number) => void;
  tabName: string;
  pagingPage: number;
  setPagingLimit: (limit: number) => void;
  pagingLimit: number;
}

const FILegalPersonConfigurationContainer: React.FC<Props> = ({
  setPagingPage,
  tabName,
  pagingPage,
  setPagingLimit,
  pagingLimit,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { openErrorWindow } = useErrorWindow();
  const { legalPersonId } = useParams<{ legalPersonId: string }>();
  const history = useHistory();
  const { t } = useTranslation();

  const [legalPersons, setLegalPersons] = useState<LegalPersonDataType[]>([]);
  const [legalPersonsLength, setLegalPersonsLength] = useState(0);
  const [selectedLegalPerson, setSelectedLegalPerson] =
    useState<LegalPersonDataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [isPercentageInfoModalOpen, setPercentageInfoModalOpen] =
    useState(false);
  const [allPhysicalPerson, setAllPhysicalPersons] = useState<
    PhysicalPersonDataType[]
  >([]);
  const [allLegalPersons, setAllLegalPersons] = useState<LegalPersonDataType[]>(
    []
  );
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isPersonChangeModal, setIsPersonChangeModal] = useState(false);
  const [currChangePerson, setCurrChangePerson] =
    useState<LegalPersonDataType>();
  const [legalPersonDetailsEditMode, setLegalPersonDetailsEditMode] =
    useState(false);
  const [personLoading, setPersonLoading] = useState(false);
  const [filter, setFilter] = useState<FilterType>({});
  const location = useLocation();

  const useQuery = () => {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
  };
  let query = useQuery();
  const legalPersonData = { contactInfo: {} };

  useEffect(() => {
    if (pagingLimit > 0) {
      initLegalPersons(filter);
    }
  }, [pagingLimit, pagingPage, filter]);

  useEffect(() => {
    if (legalPersonId) loadLegalPerson();
  }, [legalPersonId]);

  useEffect(() => {
    getAllLegalPersons();
    getAllPhysicalPersons();
  }, []);

  useEffect(() => {
    loadLegalPerson();
  }, [t]);

  const changeLegalPersonDetailsEditMode = (open: boolean) => {
    setLegalPersonDetailsEditMode(open);
  };

  const getAllLegalPersons = () => {
    getAllLegalPersonSimple()
      .then((res) => {
        const data = res.data;
        if (data) {
          setAllLegalPersons([...data]);
        }
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
        setLoading(false);
      });
  };

  const getAllPhysicalPersons = () => {
    loadAllPersons()
      .then((res) => {
        const data = res.data;
        if (data) {
          setAllPhysicalPersons(data.list);
        }
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
        setLoading(false);
      });
  };

  const initLegalPersons = (filter: FilterType) => {
    setLoading(true);
    loadLegalPersons(pagingPage, pagingLimit, filter)
      .then((res) => {
        const data = res.data;
        if (data) {
          setLegalPersons([...data.list]);
          setLegalPersonsLength(data.totalResults);
        }
        setLoading(false);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
        setLoading(false);
      });
  };

  const loadLegalPerson = () => {
    setPersonLoading(true);
    getLegalPersonById(legalPersonId)
      .then((res) => {
        const data = res.data;
        if (data) {
          setSelectedLegalPerson(data);
        }
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => {
        setPersonLoading(false);
      });
  };

  const onFilterClick = (searchValue: string) => {
    if (!searchValue || (searchValue && searchValue.trim().length > 3)) {
      setFilter({ name: searchValue });
      setPagingPage(1);
    }
  };

  const onPagingLimitChange = (limit: number) => {
    setPagingPage(1);
    setPagingLimit(limit);
  };

  const changePerson = (legalPerson: LegalPersonDataType) => {
    if (isEdit || legalPersonDetailsEditMode) {
      setIsPersonChangeModal(true);
      setCurrChangePerson(legalPerson);
    } else personChangeHandler(legalPerson);
  };

  const personChangeHandler = (legalPersonId: LegalPersonDataType) => {
    history.push(`${menuLink.configuration}/legalperson/` + legalPersonId.id);
    setIsPersonChangeModal(false);
    setLegalPersonDetailsEditMode(false);
  };

  const deleteLegalPerson = (id: number) => {
    deletePersons([id])
      .then(() => {
        setLegalPersons(legalPersons.filter((r) => r.id != id));
        setSelectedLegalPerson(null);
        enqueueSnackbar(t("deleted"), {
          variant: "success",
        });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const updateLegalPersonFunction = (data: LegalPersonDataType) => {
    let contactInfo = { ...data.contactInfo, ...legalPersonData.contactInfo };
    let result = {
      ...selectedLegalPerson,
      ...data,
      ...legalPersonData,
      contactInfo,
    };

    if (result.beneficiaries) {
      let beneficiaries = [];
      for (let beneficiary of result.beneficiaries) {
        if (beneficiary.legalPerson) {
          beneficiary.finalBeneficiaries =
            beneficiary.finalBeneficiaries.filter((item) => item.person);
        }
        delete beneficiary["newRow"];
        delete beneficiary["errors"];
        beneficiaries.push(beneficiary);
      }
      result.beneficiaries = beneficiaries;
    }

    updateLegalPerson(result)
      .then((res) => {
        setSelectedLegalPerson(res.data);
        setLegalPersons(
          legalPersons.map((legalPeron) => {
            return legalPeron.id !== res.data.id
              ? { ...legalPeron }
              : { ...res.data };
          })
        );
      })
      .catch((error) => {
        const errorResp = error && error.response && error.response.data;
        if (errorResp && errorResp.code === "INVALID_VALUE") {
          setSelectedLegalPerson({
            ...selectedLegalPerson,
          } as LegalPersonDataType);
          setPercentageInfoModalOpen(true);
        } else {
          openErrorWindow(error, t("error"), true);
        }
      });

    history.push(`${menuLink.configuration}/legalperson/` + data.id);
  };

  const beneficiarySaveFunction = (data: any) => {
    updateLegalPersonFunction({
      ...selectedLegalPerson,
      beneficiaries: data,
    } as LegalPersonDataType);
  };

  const onSaveCriminalRecordFunction = (
    data: LegalPersonDataType,
    criminalRecordData: CriminalRecordDataType[]
  ) => {
    let newData = { ...data, criminalRecords: criminalRecordData };
    updateLegalPersonFunction(newData);
  };

  const onSaveOtherShareFunction = (
    data: LegalPersonDataType,
    otherSharesData: SharesDataType[]
  ) => {
    let newData = { ...data, shares: otherSharesData ? otherSharesData : [] };
    updateLegalPersonFunction(newData);
  };

  const onSaveManagerFunction = (
    data: LegalPersonDataType,
    managerData: ManagersDataType[]
  ) => {
    let newData = { ...data, managers: managerData ? managerData : [] };
    updateLegalPersonFunction(newData);
  };

  return (
    <>
      <FILegalPersonConfigurationItemPage
        onPagingLimitChange={onPagingLimitChange}
        tabName={tabName}
        pagingPage={pagingPage}
        onFilter={onFilterClick}
        legalPersons={legalPersons}
        onLegalPersonSelect={changePerson}
        selectedLegalPerson={selectedLegalPerson}
        deleteLegalPerson={deleteLegalPerson}
        legalPersonsLength={legalPersonsLength}
        pagingLimit={pagingLimit}
        setPagingPage={setPagingPage}
        loading={loading}
        beneficiarySaveFunction={beneficiarySaveFunction}
        onSaveCriminalRecordFunction={onSaveCriminalRecordFunction}
        onSaveOtherShareFunction={onSaveOtherShareFunction}
        onSaveManagerFunction={onSaveManagerFunction}
        allPhysicalPerson={allPhysicalPerson}
        allLegalPersons={allLegalPersons}
        updateLegalPersonFunction={updateLegalPersonFunction}
        defaultEditMode={Boolean(query.get("edit"))}
        query={query}
        legalPersonData={legalPersonData}
        setIsCancelModalOpen={setIsCancelModalOpen}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        setLegalPersons={setLegalPersons}
        changeLegalPersonDetailsEditMode={changeLegalPersonDetailsEditMode}
        legalPersonDetailsEditMode={legalPersonDetailsEditMode}
        personLoading={personLoading}
      />
      <ConfirmModal
        isOpen={isPersonChangeModal}
        setIsOpen={setIsPersonChangeModal}
        onConfirm={() =>
          currChangePerson && personChangeHandler(currChangePerson)
        }
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
          history.push(location.pathname);
          if (selectedLegalPerson)
            setSelectedLegalPerson({ ...selectedLegalPerson });
          setIsCancelModalOpen(false);
          setIsEdit(false);
        }}
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
  pagingPage: state.get(reducer).pagingPage,
  pagingLimit: state.get(reducer).pagingLimit,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
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
)(FILegalPersonConfigurationContainer);
