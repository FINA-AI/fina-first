import React, { useCallback, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import {
  deleteFI,
  deleteFIs,
  loadCountedFisByFilter,
  loadFisByType,
  loadFiTypes,
  loadLegalFormTypes,
} from "../../api/services/fi/fiService";
import {
  BASE_REST_URL,
  FilterTypes,
  getFormattedDateValue,
  NumOfRowsPerPage,
} from "../../util/appUtil";
import useConfig from "../../hoc/config/useConfig";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import FIMainPage from "../../components/FI/Main/FIMainPage";
import FILegalFormFilter from "../../components/FI/FILegalFormFilter";
import CountryFilter from "../../components/common/Filter/CountryFilter";
import { getCountryItemByParentId } from "../../api/services/regionService";
import { bindActionCreators, Dispatch } from "redux";
import { updateState } from "../../redux/actions/stateActions";
import ActiveCell from "../../components/common/ActiveCell";
import { useLocation } from "react-router-dom";
import {
  FiDataType,
  FiTypeDataType,
  LegalFormEntityInfo,
} from "../../types/fi.type";
import {
  columnFilterConfigType,
  CountryDataTypes,
  GridColumnType,
} from "../../types/common.type";

interface FIContainerProps {
  state: any;
  setState: React.Dispatch<React.SetStateAction<any>>;
  fi: FiDataType;
}

const FIContainer = ({ state, setState, fi }: FIContainerProps) => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const reload = query.get("reload");
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();
  const { openErrorWindow } = useErrorWindow();

  const [countryData, setCountryData] = useState<CountryDataTypes[]>([]);
  const [countryLoading, setCountryLoading] = useState<boolean>(false);

  const getStateFilterValue = (key: string) => {
    if (state && state.filters) {
      return state.filters[key];
    }
  };
  const columnFilterConfig = [
    {
      field: "name",
      type: FilterTypes.string,
      name: "NAME",
      value: getStateFilterValue("NAME"),
    },
    {
      field: "code",
      type: FilterTypes.string,
      name: "CODE",
      value: getStateFilterValue("CODE"),
    },
    {
      field: "identificationCode",

      type: FilterTypes.string,
      name: "IDENTIFICATION_CODE",
      value: getStateFilterValue("IDENTIFICATION_CODE"),
    },
    {
      field: "legalForm",
      type: FilterTypes.string,
      name: "LEGAL_FORM",
      value: getStateFilterValue("LEGAL_FORM"),
      renderFilter: (_: any, onFilterClick: any, onClear: any) => {
        return (
          <FILegalFormFilter
            onClickFunction={onFilterClick}
            defaultValue={legalFormData.find(
              (item) => item.code === getStateFilterValue("LEGAL_FORM")
            )}
            closeFilter={onClear}
          />
        );
      },
    },
    {
      field: "licenseCode",

      type: FilterTypes.string,
      name: "LICENCE_CODE",
      value: getStateFilterValue("LICENCE_CODE"),
    },
    {
      field: "registrationDate",

      type: FilterTypes.date,
      name: "REGISTER",
      start: getStateFilterValue("REGISTER_FROM_DATE"),
      end: getStateFilterValue("REGISTER_TO_DATE"),
    },
    {
      field: "region",
      type: FilterTypes.country,
      name: FilterTypes.country,
      value: getStateFilterValue(FilterTypes.country),
      renderFilter: (columnsFilter: any, onFilterClick: any, onClear: any) => {
        return (
          <CountryFilter
            onClickFunction={onFilterClick}
            defaultValue={
              columnsFilter.find((el: any) => el.name === FilterTypes.country)
                ?.value
            }
            closeFilter={onClear}
            data={countryData ?? []}
            loading={countryLoading}
          />
        );
      },
    },
    {
      field: "addressString",

      type: FilterTypes.string,
      name: "ADDRESS",
      value: getStateFilterValue("ADDRESS"),
    },
    {
      field: "modifiedAt",
      type: FilterTypes.date,
      name: "CHANGE",
      start: getStateFilterValue("CHANGE_FROM_DATE"),
      end: getStateFilterValue("CHANGE_FROM_DATE"),
    },
    {
      field: "representativePerson",
      type: FilterTypes.string,
      name: "REPRESENTATIVE_PERSON",
      value: getStateFilterValue("REPRESENTATIVE_PERSON"),
    },
  ];

  const columnHeader = useCallback((): GridColumnType[] => {
    return [
      {
        field: "name",
        headerName: t("name"),
        width: 200,
        fixed: true,
        filter: columnFilterConfig.find((item) => item.field === "name"),
      },
      {
        field: "code",
        headerName: t("code"),
        width: 140,
        filter: columnFilterConfig.find((item) => item.field === "code"),
      },
      {
        field: "identificationCode",
        headerName: t("fiMainId"),
        width: 140,
        filter: columnFilterConfig.find(
          (item) => item.field === "identificationCode"
        ),
      },
      {
        field: "disable",
        headerName: t("status"),
        width: 140,
        hideBackground: true,
        renderCell: (value: boolean) => (
          <ActiveCell active={!value}>
            {!value ? t("active") : t("inactive")}
          </ActiveCell>
        ),
        filter: columnFilterConfig.find((item) => item.field === "disable"),
      },
      {
        field: "legalForm",
        headerName: t("legalForm"),
        width: 173,
        renderCell: (value: string) => {
          return t(value);
        },
        filter: columnFilterConfig.find((item) => item.field === "legalForm"),
      },
      {
        field: "licenseCode",
        headerName: t("licenseCode"),
        width: 173,
        filter: columnFilterConfig.find((item) => item.field === "licenseCode"),
      },
      {
        field: "registrationDate",
        headerName: t("registrationDate"),
        hideCopy: true,
        renderCell: (value: number) =>
          getFormattedDateValue(value, getDateFormat(true)),
        width: 145,
        filter: columnFilterConfig.find(
          (item) => item.field === "registrationDate"
        ),
      },
      {
        field: "region",
        headerName: t("region"),
        fixed: false,
        width: 230,
        renderCell: (value: CountryDataTypes) => value?.name,
        filter: columnFilterConfig.find((item) => item.field === "region"),
      },
      {
        field: "addressString",
        headerName: t("address"),
        width: 270,
        filter: columnFilterConfig.find(
          (item) => item.field === "addressString"
        ),
      },
      {
        field: "modifiedAt",
        headerName: t("changeDate"),
        hideCopy: true,
        renderCell: (value: number) =>
          getFormattedDateValue(value, getDateFormat(true)),
        width: 161,
        filter: columnFilterConfig.find((item) => item.field === "modifiedAt"),
      },
      {
        field: "representativePerson",
        headerName: t("representativePerson"),
        width: 215,
        filter: columnFilterConfig.find(
          (item) => item.field === "representativePerson"
        ),
      },
    ];
  }, []);

  const { enqueueSnackbar } = useSnackbar();
  const [columns, setColumns] = useState<GridColumnType[]>([]);
  const [fiTypes, setFiTypes] = useState<FiTypeDataType[]>([]);
  const [selectedFIType, setSelectedFIType] = useState<FiTypeDataType>();
  const [rows, setRows] = useState<FiDataType[]>([]);
  const [selectedRows, setSelectedRows] = useState<FiDataType[]>([]);
  const [activeFIMainToolbar, setActiveFIMainToolbar] = useState<boolean>(true);
  const [filterObject, setFilterObject] = useState({});
  const [loading, setLoading] = useState(true);
  const [loader, setLoader] = useState(true);
  const [countedFis, setCountedFis] = useState(null);
  const [legalFormData, setLegalFormData] = useState<LegalFormEntityInfo[]>([]);

  // paging
  const [catalogLength, setCatalogsLength] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [pagingLimit, setPagingLimit] = useState(
    NumOfRowsPerPage.INITIAL_ROWS_PER_PAGE
  );

  useEffect(() => {
    if (reload === "true" && selectedFIType) {
      setSelectedFIType({ ...selectedFIType });
    }
  }, [reload]);

  useEffect(() => {
    if (fi?.id) {
      setRows([...rows.map((row) => (row.id === fi.id ? fi : row))]);
    }
  }, [fi]);

  const loadLegalFortData = () => {
    loadLegalFormTypes()
      .then((resp) => {
        let types = resp.data.map((item: LegalFormEntityInfo) => {
          return { ...item, description: t(item.code) };
        });
        setLegalFormData(types);
      })
      .catch((error) => {
        openErrorWindow(error, t("error"), true);
      });
  };

  const loadFisByTypeFunction = (id: number, filter?: any) => {
    setLoader(true);
    let filters = filter ? filter : filterObject;
    loadFisByType(id, activePage, pagingLimit, filters)
      .then((res) => {
        const data = res.data;
        if (data) {
          setCatalogsLength(data.totalResults);
          setRows(data.list);
        }
        if (Object.keys(filters).length !== 0) {
          getFiTypesCount(filters);
        } else {
          setCountedFis(null);
        }
      })
      .catch((error) => {
        openErrorWindow(error, t("error"), true);
      })
      .finally(() => {
        setLoading(false);
        setLoader(false);
      });
  };

  const loadCountry = () => {
    if (!countryData.length) {
      setCountryLoading(true);
      getCountryItemByParentId(0)
        .then((resp) => {
          setCountryData(resp.data);
        })
        .catch((error) => enqueueSnackbar(error, { variant: "error" }))
        .finally(() => setCountryLoading(false));
    }
  };

  const reloadFi = (data: FiDataType) => {
    if (selectedFIType) {
      if (selectedFIType.code === data.fiTypeModel.code) {
        setRows([data, ...rows]);
      }
    }
  };

  const loadFiTypesFunction = () => {
    loadFiTypes(false)
      .then((res) => {
        setFiTypes(res.data);
        const fiType = res.data.length > 0 ? res.data[0] : null;
        setSelectedFIType(fiType);
        loadLegalFortData();
        if (!fiType) {
          setLoading(false);
          setLoader(false);
        }
      })
      .catch((error) => enqueueSnackbar(error, { variant: "error" }));
  };

  useEffect(() => {
    setLoader(true);
    loadFiTypesFunction();
    loadCountry();
    setColumns(columnHeader());
  }, []);

  useEffect(() => {
    if (selectedFIType) {
      loadFisByTypeFunction(selectedFIType.id);
    }
  }, [pagingLimit, activePage]);

  useEffect(() => {
    if (selectedFIType) {
      setActivePage(1);
      if (state && state.filters) {
        loadFisByTypeFunction(selectedFIType.id, state.filters);
      } else {
        loadFisByTypeFunction(selectedFIType.id);
      }
      setSelectedRows([]);
    }
  }, [selectedFIType]);

  const onPagingLimitChange = (limit: number) => {
    setActivePage(1);
    setPagingLimit(limit);
  };

  const deleteFIFunction = (row: FiDataType) => {
    deleteFI(row.id)
      .then(() => {
        const r = rows.filter(function (value) {
          return value.id !== row.id;
        });
        setRows(r);
        enqueueSnackbar(t("deleted"), { variant: "success" });
      })
      .catch((err) => openErrorWindow(err, t("error"), true));
  };

  useEffect(() => {
    if (state && state.columns) {
      let newCols = [];
      for (let item of state.columns) {
        let headerCell = columnHeader().find((el) => item.field === el.field);
        if (headerCell) {
          headerCell.hidden = item.hidden;
          headerCell.fixed = item.fixed;
          newCols.push(headerCell);
        }
      }
      setColumns(newCols);
    } else {
      setColumns([...columnHeader()]);
    }
  }, [t]);

  useEffect(() => {
    setActiveFIMainToolbar(selectedRows.length > 1);
  }, [selectedRows]);

  const selectedRowsLen = () => {
    return selectedRows.length;
  };

  const deleteSelectedRows = () => {
    let array = selectedRows.map((item) => item.id);
    deleteFIs(array)
      .then(() => {
        const r = rows.filter(function (row) {
          if (!array.includes(row.id)) return row;
        });
        setRows(r);
        enqueueSnackbar(t("deleted"), { variant: "success" });
        cancelSelectedRows();
      })
      .catch((err) => openErrorWindow(err, t("error"), true));
  };

  const cancelSelectedRows = () => {
    setSelectedRows([]);
  };

  const FilterOnChangeFunction = (obj: columnFilterConfigType[]) => {
    const filter: Record<string, any> = {};

    for (const o of obj) {
      if (o.value) {
        if (o.type === FilterTypes.country) {
          filter[FilterTypes.country] = o.value;
        } else {
          filter[o.name!] = o.value;
        }
      } else if (o.type === FilterTypes.date) {
        if (o.start) {
          filter[o.name! + "_FROM_DATE"] = o.start;
        }
        if (o.end) {
          filter[o.name! + "_TO_DATE"] = o.end;
        }
      }
    }

    if (filter[FilterTypes.country]) {
      filter["regionIds"] = [filter[FilterTypes.country].id];
    }

    setFilterObject(filter);
    setActivePage(1);

    const fiTableCustomization = {
      key: "fiTableCustomization",
      updatedState: {
        ...state?.["fiTableCustomization"],
        filters: filter,
      },
    };

    setState(fiTableCustomization);
    if (obj)
      selectedFIType?.id && loadFisByTypeFunction(selectedFIType.id, filter);
  };

  const getFiTypesCount = (filters: Record<string, any>) => {
    loadCountedFisByFilter(filters)
      .then((res) => {
        setCountedFis(res.data);
      })
      .catch((error) => openErrorWindow(error, t("error"), true));
  };

  const onExport = () => {
    if (!selectedFIType) return;

    let url = "/fi/export?";
    let params: {
      [key: string]: string | number | number[];
    } = {};

    if (selectedRows && selectedRows.length > 0) {
      params = {
        fiTypeId: selectedFIType.id,
        fiIds: selectedRows.map((r) => r.id),
      };
    } else {
      params = {
        fiTypeId: selectedFIType.id,
      };
    }

    if (Object.keys(params).length !== 0) {
      for (const property in params) {
        if (Array.isArray(params[property])) {
          const queryParam = `${property}=${(params[property] as number[]).join(
            `&${property}=`
          )}`;
          url += queryParam;
        } else {
          url += `${property}=${params[property]}`;
        }
        url += "&";
      }
    }
    window.open(BASE_REST_URL + url, "_blank");
  };

  const orderRowByHeader = (
    cellName: keyof FiDataType,
    arrowDirection: string
  ) => {
    let sortDirection = arrowDirection === "up" ? 1 : -1;

    setRows((prevPersons) =>
      [...prevPersons].sort((a, b) => {
        let valueA;
        let valueB;

        switch (cellName) {
          case "region":
            valueA = a.region?.name ?? "";
            valueB = b.region?.name ?? "";
            break;
          case "legalForm":
            valueA = a.legalForm ?? "";
            valueB = b.legalForm ?? "";
            break;
          default:
            valueA = a[cellName] ?? "";
            valueB = b[cellName] ?? "";
        }

        return (valueA > valueB ? 1 : valueA < valueB ? -1 : 0) * sortDirection;
      })
    );
  };

  return (
    <FIMainPage
      reloadFi={reloadFi}
      deleteSelectedRows={deleteSelectedRows}
      cancelSelectedRows={cancelSelectedRows}
      selectedRowsLen={selectedRowsLen}
      fiTypes={fiTypes}
      selectedFIType={selectedFIType}
      setSelectedFiType={setSelectedFIType}
      columns={columns}
      columnFilterConfig={columnFilterConfig}
      rows={rows}
      setRows={setRows}
      selectedRows={selectedRows}
      setSelectedRows={setSelectedRows}
      setActivePage={setActivePage}
      setRowPerPage={onPagingLimitChange}
      catalogLength={catalogLength}
      pagingPage={activePage}
      initialRowsPerPage={pagingLimit}
      deleteFIFunction={deleteFIFunction}
      activeFIMainToolbar={activeFIMainToolbar}
      FilterOnChangeFunction={FilterOnChangeFunction}
      loading={loading}
      loader={loader}
      isDefault={!!state}
      countedFis={countedFis}
      setColumns={setColumns}
      onExport={onExport}
      loadFisByTypeFunction={loadFisByTypeFunction}
      orderRowByHeader={orderRowByHeader}
    />
  );
};

const mapStateToProps = (state: any) => ({
  fi: state.getIn(["fi", "fi"]),
  state: state.getIn(["state", "fiTableCustomization"]),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setState: bindActionCreators(updateState, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(FIContainer);
