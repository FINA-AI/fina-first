import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import { useTranslation } from "react-i18next";
import {
  deletePerson,
  filterConnections,
  getPersonById,
  loadAllPersons,
  updatePerson,
} from "../../../../api/services/personService";
import {
  changefiPhysicalPersonPagingLimitAction,
  changefiPhysicalPersonPagingPageAction,
} from "../../../../redux/actions/fiPhysicalPersonActions";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import FIPersonConfigurationItemPage from "../../../../components/FI/Configuration/Person/Item/FIPersonConfigurationItemPage";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { loadFirstLevel } from "../../../../api/services/regionService";
import { getAllLegalPersonSimple } from "../../../../api/services/fi/fiLegalPersonService";
import menuLink from "../../../../api/ui/menuLink";
import { FiConfigurationTabs } from "../../../../components/FI/fiTabs";
import { PhysicalPersonDataType } from "../../../../types/physicalPerson.type";
import { CountryDataTypes } from "../../../../types/common.type";
import { LegalPersonDataType } from "../../../../types/legalPerson.type";
import {
  CriminalRecordDataType,
  EducationDataType,
  PositionDataType,
  RecommendationDataType,
  SharesDataType,
} from "../../../../types/fi.type";

interface Props {
  tabName: string;
  setPagingPage: (page: number) => void;
  setPagingLimit: (limit: number) => void;
  pagingPage: number;
  pagingLimit: number;
}

const FIPersonConfigurationItemContainer: React.FC<Props> = ({
  tabName,
  setPagingPage,
  setPagingLimit,
  pagingPage,
  pagingLimit,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { openErrorWindow } = useErrorWindow();
  const { t } = useTranslation();
  const history = useHistory();
  const { personItemId } = useParams<{
    personItemId: string;
  }>();
  const useQuery = () => {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
  };
  let query = useQuery();

  const [loading, setLoading] = useState(true);
  const [persons, setPersons] = useState<PhysicalPersonDataType[]>([]);
  const [selectedPerson, setSelectedPerson] =
    useState<PhysicalPersonDataType>();
  const [personLength, setPersonLength] = useState(0);
  const [countries, setCountries] = useState<CountryDataTypes[]>([]);
  const [companies, setCompanies] = useState<LegalPersonDataType[]>([]);
  const [loadingMask, setLoadingMask] = useState(true);

  useEffect(() => {
    if (pagingLimit > 0) {
      initPersons();
    }
  }, [pagingLimit, pagingPage]);

  useEffect(() => {
    loadCountries();
    getAllLegalPersonSimple()
      .then((resp) => {
        setCompanies(resp.data);
      })
      .catch((error) => openErrorWindow(error, t("error"), true));
  }, []);

  useEffect(() => {
    getPerson(personItemId);
  }, [personItemId]);

  const initPersons = async (filters = {}) => {
    setLoading(true);
    await loadAllPersons(pagingPage, pagingLimit, false, true, filters)
      .then((resp) => {
        setPersons(resp.data.list);
        setLoading(false);
        setPersonLength(resp.data.totalResults);
      })
      .catch((error) => openErrorWindow(error, t("error"), true))
      .finally(() => setLoadingMask(false));
  };

  const loadCountries = async () => {
    await loadFirstLevel()
      .then((resp) => {
        setCountries(resp.data);
      })
      .catch((error) => openErrorWindow(error, t("error"), true));
  };

  const getPerson = async (personId: string) => {
    await getPersonById(personId)
      .then((resp) => {
        const newData: PhysicalPersonDataType = {
          ...resp.data,
          recommendations: resp.data.recommendations?.sort(
            (a: RecommendationDataType, b: RecommendationDataType) =>
              b.id - a.id
          ),
          shares: resp.data.shares?.sort(
            (a: SharesDataType, b: SharesDataType) => b.id - a.id
          ),
          education: resp.data.education?.sort(
            (a: EducationDataType, b: EducationDataType) => b.id - a.id
          ),
          criminalRecords: resp.data.criminalRecords?.sort(
            (a: CriminalRecordDataType, b: CriminalRecordDataType) =>
              b.id - a.id
          ),
          positions: resp.data.positions?.sort(
            (a: PositionDataType, b: PositionDataType) => b.id - a.id
          ),
        };
        setSelectedPerson(newData);
      })
      .catch((error) => openErrorWindow(error, t("error"), true))
      .finally(() => setLoadingMask(false));
  };

  const deletePersonById = async () => {
    if (!selectedPerson) return;
    const newPersons = persons.filter((p) => p.id !== selectedPerson.id);
    try {
      await deletePerson(selectedPerson.id);
      if (newPersons.length !== 0) {
        setPersons(newPersons);
        history.push(
          `${menuLink.configuration}/${FiConfigurationTabs.PHYSYCALPERSON}`
        );
      }
      enqueueSnackbar(t("deleted"), { variant: "success" });
    } catch (error) {
      openErrorWindow(error, t("error"), true);
    }
  };

  const onPagingLimitChange = (limit: number) => {
    setPagingPage(1);
    setPagingLimit(limit);
  };

  const onFilterClick = (filterValue: string) => {
    initPersons({ name: filterValue });
  };

  const onClearFilters = () => {
    if (!selectedPerson) return;
    filterConnections(selectedPerson.id).then((resp) => {
      setSelectedPerson({ ...selectedPerson, connections: resp.data });
    });
  };

  const update = async (data: PhysicalPersonDataType) => {
    if (!selectedPerson) return;
    try {
      const resp = await updatePerson(data);
      setSelectedPerson({
        ...resp.data,
        connections: selectedPerson.connections,
      });
      setPersons(
        persons.map((person) =>
          person.id === data.id
            ? {
                ...person,
                identificationNumber: data.identificationNumber,
                status: data.status,
                name: data.name,
              }
            : person
        )
      );
      enqueueSnackbar(t("personEditSuccess"), { variant: "success" });
    } catch (error) {
      openErrorWindow(error, t("error"), true);
    }
  };
  const onPersonSelectChange = (personId: number) => {
    history.push(`${menuLink.configuration}/${tabName}/${personId}`);
  };

  return (
    <FIPersonConfigurationItemPage
      tabName={tabName}
      pagingPage={pagingPage}
      setPagingPage={setPagingPage}
      pagingLimit={pagingLimit}
      onPagingLimitChange={onPagingLimitChange}
      loading={loading}
      persons={persons}
      onFilter={onFilterClick}
      onClearFilters={onClearFilters}
      personsLength={personLength}
      onPersonSelect={onPersonSelectChange}
      selectedPerson={selectedPerson}
      setSelectedPerson={setSelectedPerson}
      countries={countries}
      companies={companies}
      deletePerson={deletePersonById}
      updatePerson={update}
      defaultEditMode={eval(query.get("edit") ?? "false")}
      setPersons={setPersons}
      loadingMask={loadingMask}
      setLoadingMask={setLoadingMask}
    />
  );
};

const mapStateToProps = (state: any) => ({
  pagingPage: state.get("fiPhysicalPerson").pagingPage,
  pagingLimit: state.get("fiPhysicalPerson").pagingLimit,
});

const dispatchToProps = (dispatch: Dispatch) => ({
  setPagingPage: bindActionCreators(
    changefiPhysicalPersonPagingPageAction,
    dispatch
  ),
  setPagingLimit: bindActionCreators(
    changefiPhysicalPersonPagingLimitAction,
    dispatch
  ),
});

export default connect(
  mapStateToProps,
  dispatchToProps
)(FIPersonConfigurationItemContainer);
