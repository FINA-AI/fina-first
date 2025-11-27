import { bindActionCreators, Dispatch } from "redux";
import {
  changefiLegalPersonPagingLimitAction,
  changefiLegalPersonPagingPageAction,
} from "../../../../redux/actions/fiLegalPersonActions";
import { connect } from "react-redux";
import FILegalPersonConfigurationMainPage from "../../../../components/FI/Configuration/LegalPerson/Main/FILegalPersonConfigurationMainPage";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  createLegalPerson,
  deletePersons,
  loadLegalPersons,
  restoreLegalPerson,
} from "../../../../api/services/legalPersonService";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import { useSnackbar } from "notistack";
import ActiveCell from "../../../../components/common/ActiveCell";
import { FilterTypes } from "../../../../util/appUtil";
import CountryFilter from "../../../../components/common/Filter/CountryFilter";
import { getCountryItemByParentId } from "../../../../api/services/regionService";
import {
  columnFilterConfigType,
  CountryDataTypes,
  FilterType,
  GridColumnType,
} from "../../../../types/common.type";
import { LegalPersonDataType } from "../../../../types/legalPerson.type";

interface Props {
  setPagingPage: (page: number) => void;
  setPagingLimit: (limit: number) => void;
  pagingPage: number;
  pagingLimit: number;
}

const FILegalPersonConfigurationContainer: React.FC<Props> = ({
  setPagingLimit,
  setPagingPage,
  pagingLimit,
  pagingPage,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { openErrorWindow } = useErrorWindow();
  const [countryData, setCountryData] = useState<CountryDataTypes[]>([]);
  const [countryLoading, setCountryLoading] = useState(false);
  const [configLegalPersons, setConfigLegalPersons] = useState<
    LegalPersonDataType[]
  >([]);
  const [personsLength, setPersonsLength] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>({});
  const [restoreModalOpen, setRestoreModalOpen] = useState(false);
  const [restorePerson, setRestorePerson] = useState<LegalPersonDataType>();

  const columnFilterConfig: columnFilterConfigType[] = [
    {
      field: "name",
      type: FilterTypes.string,
      name: "name",
    },
    {
      type: FilterTypes.number,
      field: "identificationNumber",
      name: "idNumber",
    },
    {
      type: FilterTypes.country,
      name: "countryId",
      field: "country",
      renderFilter: (columnsFilter, onFilterClick, onClear) => {
        return (
          <CountryFilter
            onClickFunction={onFilterClick}
            defaultValue={
              columnsFilter.find((el: any) => el.name === "country")?.value
            }
            closeFilter={onClear}
            data={countryData ? countryData : []}
            loading={countryLoading}
          />
        );
      },
    },
    {
      field: "status",
      type: FilterTypes.list,
      name: "status",
      filterArray: [
        { label: t("active"), value: "ACTIVE" },
        { label: t("inactive"), value: "INACTIVE" },
      ],
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
      field: "country",
      headerName: t("country"),
      fixed: false,
      renderCell: (value: CountryDataTypes) => {
        return <span>{t(value?.name)}</span>;
      },
    },
    {
      field: "status",
      headerName: t("status"),
      hideCopy: true,
      renderCell: (value: string) => {
        return (
          <ActiveCell
            active={String(value).toLowerCase() === "active"}
            style={{
              width: 80,
              color: !value ? "red" : undefined,
            }}
          >
            {value ? t(value.toLowerCase()) : t("inactive")}
          </ActiveCell>
        );
      },
    },
  ];

  const [columns, setColumns] = useState(columnHeader);

  useEffect(() => {
    setColumns(columnHeader);
    if (countryData && countryData.length === 0) {
      loadCountry();
    }
  }, [t]);

  useEffect(() => {
    if (pagingLimit > 0) {
      loadLegalPersonsData(filter);
    }
  }, [pagingLimit, pagingPage, filter]);

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

  const onPagingLimitChange = (limit: number) => {
    setPagingPage(1);
    setPagingLimit(limit);
  };

  const loadLegalPersonsData = (columnFilter: FilterType) => {
    setLoading(true);
    loadLegalPersons(pagingPage, pagingLimit, columnFilter)
      .then((res) => {
        const data = res.data;
        if (data) {
          setPersonsLength(data.totalResults);
          setConfigLegalPersons(data.list);
        }
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => setLoading(false));
  };

  const addRow = async (legalPerson: LegalPersonDataType) => {
    await createLegalPerson(legalPerson)
      .then((resp) => {
        setConfigLegalPersons([resp.data, ...configLegalPersons]);
        enqueueSnackbar(t("personCreateSuccess"), {
          variant: "success",
        });
      })
      .catch((err) => {
        if (err.response.data.code === "ENTITY_PROGRAMMATICALLY_DELETED") {
          setRestorePerson(legalPerson);
          setRestoreModalOpen(true);
        } else {
          openErrorWindow(err, t("error"), true);
        }
      });
  };

  const onRestorePersonClick = () => {
    restoreLegalPerson(0, restorePerson)
      .then((resp) => {
        setConfigLegalPersons([resp.data, ...configLegalPersons]);
        enqueueSnackbar(t("personCreateSuccess"), {
          variant: "success",
        });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const deleteRow = async (row: LegalPersonDataType) => {
    deletePersons([row.id])
      .then(() => {
        setConfigLegalPersons(
          configLegalPersons.filter((r) => r.id !== row.id)
        );
        enqueueSnackbar(t("deleted"), {
          variant: "success",
        });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const filterOnChangeFunction = (obj: FilterType) => {
    const result = obj.reduce((acc: FilterType, item: FilterType) => {
      if (!!item.value) {
        acc[item.name] =
          typeof item.value === "object" ? item.value.id : item.value;
      }
      return acc;
    }, {});

    setPagingPage(1);
    setFilter(result);
  };

  const orderRowByHeader = (cellName: string, arrowDirection: string) => {
    let sortDirection = arrowDirection === "up" ? 1 : -1;

    setConfigLegalPersons((prevPersons) =>
      [...prevPersons].sort((a, b) => {
        let valueA =
          cellName === "country" ? a.country?.name : (a as any)[cellName];
        let valueB =
          cellName === "country" ? b.country?.name : (b as any)[cellName];

        return (valueA > valueB ? 1 : valueA < valueB ? -1 : 0) * sortDirection;
      })
    );
  };

  return (
    <FILegalPersonConfigurationMainPage
      pagingPage={pagingPage}
      pagingLimit={pagingLimit}
      onPagingLimitChange={onPagingLimitChange}
      setPagingPage={setPagingPage}
      personsLength={personsLength}
      loading={loading}
      setLoading={setLoading}
      columns={columns}
      columnFilterConfig={columnFilterConfig}
      configLegalPersons={configLegalPersons}
      setConfigLegalPersons={setConfigLegalPersons}
      addRow={addRow}
      deleteRow={deleteRow}
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
  pagingPage: state.get("fiLegalPerson").pagingPage,
  pagingLimit: state.get("fiLegalPerson").pagingLimit,
});

const dispatchToProps = (dispatch: Dispatch) => ({
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
  dispatchToProps
)(FILegalPersonConfigurationContainer);
