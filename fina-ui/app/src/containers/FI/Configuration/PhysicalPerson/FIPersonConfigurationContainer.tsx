import FIPersonConfigurationMainPage from "../../../../components/FI/Configuration/Person/Main/FIPersonConfigurationMainPage";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { bindActionCreators, Dispatch } from "redux";
import {
  changefiPhysicalPersonPagingLimitAction,
  changefiPhysicalPersonPagingPageAction,
} from "../../../../redux/actions/fiPhysicalPersonActions";
import {
  createPerson,
  deletePerson,
  deletePersons,
  loadAllPersons,
  restorePhysicalPerson,
} from "../../../../api/services/personService";
import { connect } from "react-redux";
import { useSnackbar } from "notistack";
import StyledChip from "../../../../components/common/Chip/StyledChip";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import { useHistory } from "react-router-dom";
import { FilterTypes } from "../../../../util/appUtil";
import CountryFilter from "../../../../components/common/Filter/CountryFilter";
import { getCountryItemByParentId } from "../../../../api/services/regionService";
import menuLink from "../../../../api/ui/menuLink";
import {
  columnFilterConfigType,
  CountryDataTypes,
  FilterType,
  GridColumnType,
} from "../../../../types/common.type";
import {
  ConfigPhysicalPersonDataType,
  PhysicalPersonDataType,
} from "../../../../types/physicalPerson.type";
import { FiDataType } from "../../../../types/fi.type";

interface FIPersonConfigurationContainerProps {
  setPagingPage: (page: number) => void;
  setPagingLimit: (limit: number) => void;
  pagingPage: number;
  pagingLimit: number;
  tabName: string;
}

const FIPersonConfigurationContainer: React.FC<
  FIPersonConfigurationContainerProps
> = ({ setPagingPage, setPagingLimit, pagingPage, pagingLimit, tabName }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { openErrorWindow } = useErrorWindow();
  const history = useHistory();
  const [countryData, setCountryData] = useState<CountryDataTypes[]>([]);
  const [countryLoading, setCountryLoading] = useState(false);
  const [configPersons, setConfigPersons] = useState<
    ConfigPhysicalPersonDataType[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [personsLength, setPersonsLength] = useState(0);
  const [restoreModalOpen, setRestoreModalOpen] = useState(false);
  const [restorePerson, setRestorePerson] =
    useState<ConfigPhysicalPersonDataType>();

  const columnFilterConfig: columnFilterConfigType[] = [
    {
      field: "name",
      type: FilterTypes.string,
      name: "name",
    },
    {
      field: "identificationNumber",
      type: FilterTypes.number,
      name: "idNumber",
    },
    {
      field: "citizenship",
      type: FilterTypes.country,
      name: "countryId",
      renderFilter: (columnsFilter: any, onFilterClick: any, onClear: any) => {
        return (
          <CountryFilter
            onClickFunction={onFilterClick}
            defaultValue={
              columnsFilter.find((el: any) => el.name === "citizenship")?.value
            }
            closeFilter={onClear}
            data={countryData}
            loading={countryLoading}
          />
        );
      },
    },
  ];

  const columnHeader: GridColumnType[] = [
    {
      field: "name",
      headerName: t("name"),
      fixed: false,
    },
    {
      field: "identificationNumber",
      headerName: t("physAndLegalPersonId"),
      fixed: false,
    },
    {
      field: "citizenship",
      headerName: t("citizenship"),
      fixed: false,
      renderCell: (value) => {
        return <span>{t(value?.name)}</span>;
      },
    },
    {
      field: "connection",
      headerName: t("connection"),
      fixed: false,
      renderCell: (value: FiDataType[]) => {
        value = value ? value : [];

        const text = `${value.length} Connections`;

        const tooltipText = value.map((v) => v.name);
        return <StyledChip label={text} tooltipTextArray={tooltipText} />;
      },
    },
  ];
  const [columns, setColumns] = useState(columnHeader);

  useEffect(() => {
    setColumns(columnHeader);
    if (countryData && countryData?.length === 0) {
      loadCountry();
    }
  }, [t]);

  useEffect(() => {
    if (pagingLimit > 0) {
      getPersons();
    }
  }, [pagingLimit, pagingPage]);

  const loadCountry = () => {
    if (!!countryData) {
      setCountryLoading(true);
      getCountryItemByParentId(0)
        .then((resp) => {
          setCountryData(resp.data);
        })
        .catch((error) => enqueueSnackbar(error, { variant: "error" }))
        .finally(() => setCountryLoading(false));
    }
  };

  const copyData = (from: PhysicalPersonDataType) => {
    return {
      name: from.name,
      identificationNumber: from.identificationNumber,
      citizenship: from.citizenship,
      connection: from.connectedFis,
      id: from.id,
    };
  };

  const isValid = (personItem: ConfigPhysicalPersonDataType) => {
    const isEmpty = (value: string) => {
      return !value || value.trim().length <= 0;
    };
    if (isEmpty(personItem.name) || isEmpty(personItem.identificationNumber)) {
      return false;
    }
    return personItem.residentStatus;
  };

  const getPersons = (columnFilter?: columnFilterConfigType) => {
    setLoading(true);
    loadAllPersons(pagingPage, pagingLimit, false, true, columnFilter)
      .then((res) => {
        const data = res.data;
        if (data) {
          setPersonsLength(data.totalResults);
          setConfigPersons(
            data.list.map((item: PhysicalPersonDataType) => copyData(item))
          );
        }
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => setLoading(false));
  };

  const onPagingLimitChange = (limit: number) => {
    setPagingPage(1);
    setPagingLimit(limit);
  };

  const addRow = async (Person: ConfigPhysicalPersonDataType) => {
    if (isValid(Person)) {
      await createPerson(0, Person)
        .then((resp) => {
          setConfigPersons([resp.data, ...configPersons]);
          enqueueSnackbar(t("personCreateSuccess"), {
            variant: "success",
          });
        })
        .catch((err) => {
          if (err.response.data.code === "ENTITY_PROGRAMMATICALLY_DELETED") {
            setRestorePerson(Person);
            setRestoreModalOpen(true);
          } else {
            openErrorWindow(err, t("error"), true);
          }
        });
    } else {
      enqueueSnackbar("Required Fields are Empty", { variant: "error" });
    }
  };

  const onRestorePersonClick = () => {
    restorePhysicalPerson(0, restorePerson)
      .then((resp) => {
        setConfigPersons([resp.data, ...configPersons]);
        enqueueSnackbar(t("personCreateSuccess"), {
          variant: "success",
        });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const deleteRow = async (row: ConfigPhysicalPersonDataType) => {
    await deletePerson(row.id)
      .then(() => {
        setConfigPersons(configPersons.filter((r) => row.id !== r.id));
        enqueueSnackbar(t("deleted"), { variant: "success" });
      })
      .catch((error) => openErrorWindow(error, t("error"), true));
  };

  const deleteMultipleRows = async () => {
    let selectedRowIds = [].map((row: any) => row.id);
    await deletePersons(selectedRowIds)
      .then(() => {
        setConfigPersons(
          configPersons.filter((r) => !selectedRowIds.includes(r.id))
        );
        enqueueSnackbar(t("deleted"), { variant: "success" });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const onPersonRowClick = (row: ConfigPhysicalPersonDataType) => {
    history.push(`${menuLink.configuration}/${tabName}/${row.id}`);
  };

  const onPersonRowEditClick = (row: ConfigPhysicalPersonDataType) => {
    history.push(`${menuLink.configuration}/${tabName}/${row.id}?edit=true`);
  };

  const filterOnChangeFunction = (obj: FilterType[]) => {
    let result: FilterType = {};
    let currFilters = obj.filter((f) => Boolean(f.value));
    for (let item of currFilters) {
      if (typeof item.value === "object") {
        result[item.name] = item.value.id;
      } else {
        result[item.name] = item.value;
      }
    }
    getPersons(result);
  };

  const orderRowByHeader = (cellName: string, arrowDirection: string) => {
    let sortDirection = arrowDirection === "up" ? 1 : -1;

    setConfigPersons((prevPersons) =>
      [...prevPersons].sort((a, b) => {
        let valueA: any =
          cellName === "citizenship"
            ? a.citizenship?.name
            : a[cellName as keyof ConfigPhysicalPersonDataType];
        let valueB: any =
          cellName === "citizenship"
            ? b.citizenship?.name
            : b[cellName as keyof ConfigPhysicalPersonDataType];

        return (valueA > valueB ? 1 : valueA < valueB ? -1 : 0) * sortDirection;
      })
    );
  };

  return (
    <FIPersonConfigurationMainPage
      loading={loading}
      setLoading={setLoading}
      columns={columns}
      columnFilterConfig={columnFilterConfig}
      pagingPage={pagingPage}
      pagingLimit={pagingLimit}
      onPagingLimitChange={onPagingLimitChange}
      setPagingPage={setPagingPage}
      personsLength={personsLength}
      configPersons={configPersons}
      setConfigPersons={setConfigPersons}
      deleteRow={deleteRow}
      addRow={addRow}
      deleteMultipleRows={deleteMultipleRows}
      onPersonRowClick={onPersonRowClick}
      onPersonRowEditClick={onPersonRowEditClick}
      filterOnChangeFunction={filterOnChangeFunction}
      restoreModalOpen={restoreModalOpen}
      setRestoreModalOpen={setRestoreModalOpen}
      onRestorePersonClick={onRestorePersonClick}
      restorePerson={restorePerson}
      orderRowByHeader={orderRowByHeader}
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
)(FIPersonConfigurationContainer);
