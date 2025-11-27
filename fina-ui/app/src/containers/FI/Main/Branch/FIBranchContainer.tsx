import { useTranslation } from "react-i18next";
import useConfig from "../../../../hoc/config/useConfig";
import { FilterTypes, getFormattedDateValue } from "../../../../util/appUtil";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import FIBranch from "../../../../components/FI/Main/Detail/Branch/FIBranch";
import {
  deleteBranch,
  deleteFiMultiBranch,
  loadByType,
} from "../../../../api/services/fi/fiBranchService";
import { loadBranchTypesWithCount } from "../../../../api/services/fi/fiBranchTypeService";
import { useSnackbar } from "notistack";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import Box from "@mui/material/Box";
import PhysicalPersonLinkButton from "../../../../components/common/Button/PhysicalPersonLinkButton";
import CountryFilter from "../../../../components/common/Filter/CountryFilter";
import { getCountryItemByParentId } from "../../../../api/services/regionService";
import { FI_BRANCH_TABLE_KEY } from "../../../../api/TableCustomizationKeys";
import { Typography } from "@mui/material";
import {
  BranchDataType,
  BranchTypes,
  FiDataType,
} from "../../../../types/fi.type";
import {
  columnFilterConfigType,
  CountryDataTypes,
  FilterType,
  GridColumnType,
} from "../../../../types/common.type";
import { TFunction } from "i18next";
import { bindActionCreators, Dispatch } from "redux";
import { setFI } from "../../../../redux/actions/fiActions";

interface FIBranchContainerProps {
  fiId: number;
  fi: FiDataType;
  setFi: (fi: FiDataType) => void;
  pageRef: React.RefObject<HTMLDivElement | null>;
  state: any;
}

const FIBranchContainer: React.FC<FIBranchContainerProps> = ({
  fiId,
  fi,
  setFi,
  state,
  pageRef,
}) => {
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();
  const { enqueueSnackbar } = useSnackbar();
  const { openErrorWindow } = useErrorWindow();

  const [data, setData] = useState<BranchDataType[]>([]);
  const [branchTypes, setBranchTypes] = useState<BranchTypes[]>([]);
  const [selectedRows, setSelectedRows] = useState<BranchDataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalSize, setTotalSize] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(25);
  const [pagingPage, setPagingPage] = useState<number>(1);
  const [selectedType, setSelectedType] = useState<BranchTypes | null>(null);
  const [columns, setColumns] = useState<GridColumnType[]>([]);

  const [columnFilterConfig, setColumnFilterConfig] = useState<
    columnFilterConfigType[]
  >([]);
  const [countryData, setCountryData] = useState<CountryDataTypes[]>();
  const [countryLoading, setCountryLoading] = useState<boolean>(false);

  const copyEnabled = [
    "address",
    "code",
    "manager",
    "shortName",
    "phone",
    "okpoCode",
    "email",
    "chiefAccountant",
    "registrationNumber",
  ];

  useEffect(() => {
    fetchTypes();
    loadCountry();
  }, [fiId]);

  useEffect(() => {
    if (selectedType?.config) {
      if (columns.length > 0) {
        setColumns([...columns]);
      } else {
        let newCols = generateColumns(selectedType.config);
        setColumns(newCols);
      }
    }
  }, [selectedType]);

  useEffect(() => {
    if (columns.length > 0) {
      if (getBranchColumnsFromLocaleState(columns)) {
        let newCols = getBranchColumnsFromLocaleState(columns);
        setColumns(newCols!);
      }
    }
  }, [t]);

  useEffect(() => {
    fetchData();
  }, [pagingPage, rowsPerPage, fiId]);

  useEffect(() => {
    if (pagingPage !== 1) {
      setPagingPage(1);
    } else {
      fetchData();
    }
  }, [selectedType, fiId]);

  const getBranchColumnsFromLocaleState = (
    cols: GridColumnType[]
  ): GridColumnType[] | undefined => {
    if (
      state &&
      selectedType &&
      state[`${FI_BRANCH_TABLE_KEY}${selectedType.code}`] &&
      state[`${FI_BRANCH_TABLE_KEY}${selectedType.code}`].columns.length !== 0
    ) {
      let newCols: GridColumnType[] = [];
      for (let item of state[`${FI_BRANCH_TABLE_KEY}${selectedType.code}`]
        .columns) {
        let headerCell = cols.find((el) => item.field === el.field);
        if (headerCell) {
          headerCell.hidden = item.hidden;
          headerCell.fixed = item.fixed;
          newCols.push(headerCell);
        }
      }
      return newCols;
    }
  };

  const loadCountry = () => {
    if (!countryData) {
      setCountryLoading(true);
      getCountryItemByParentId(0)
        .then((resp) => {
          setCountryData(resp.data);
          setCountryLoading(false);
        })
        .catch((error) => enqueueSnackbar(error, { variant: "error" }));
    }
  };

  const generateColumns = (columns?: any[]): GridColumnType[] => {
    let res = [];

    const defaultColumns = [
      {
        index: 0,
        key: "address",
        type: "String",
      },
      {
        index: 5,
        key: "code",
        type: "String",
      },
      {
        index: 13,
        key: "name",
        type: "String",
      },
    ];

    if (!columns) {
      columns = defaultColumns;
    }

    const gridWidth = pageRef?.current?.clientWidth;
    const gridColWidth = 150;
    const gridColSize = columns.length;
    let isFlexColumn = true;

    if (gridWidth !== undefined && gridColSize * gridColWidth > gridWidth) {
      isFlexColumn = false;
    }

    for (let col of columns) {
      let tmp: GridColumnType = {
        field: col.key,
        headerName: t(`branchField${col.key}`),
        width: isFlexColumn ? 0 : gridColWidth,
        hideCopy: copyEnabled.indexOf(col.key) === -1,
      };

      switch (col.type) {
        case "Date":
          tmp.renderCell = (value: any) =>
            getFormattedDateValue(value, getDateFormat(true));
          break;
        case "boolean":
        case "Boolean":
          tmp.renderCell = (value: any) => (value ? t("yes") : t("no"));
          break;
        case "Region":
        case "RegionMetaModel":
          tmp.renderCell = (value: any, row: any) => row.regionModel?.name;
          break;
        case "FiPerson":
        case "PersonMetaModel":
          tmp.renderCell = (value: any, data: any) => {
            return (
              (data.manager || data.chiefAccountant) && (
                <>
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    {data.manager !== null && col.key === "manager" && (
                      <PhysicalPersonLinkButton id={data.manager?.id} />
                    )}
                    {data.chiefAccountant !== null &&
                      col.key === "chiefAccountant" && (
                        <PhysicalPersonLinkButton
                          id={data.chiefAccountant?.id}
                        />
                      )}
                    <Typography
                      style={{
                        display: "block",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                      }}
                    >
                      {value ? value.name : ""}
                    </Typography>
                  </Box>
                </>
              )
            );
          };
          break;
      }

      res.push(tmp);
      if (col.key === "manager") {
        res.push({
          field: "manager.identificationNumber",
          headerName: t("branchFieldmanagerID"),
          width: isFlexColumn ? 0 : gridColWidth,
        });
      }

      if (col.key === "chiefAccountant") {
        res.push({
          field: "chiefAccountant.identificationNumber",
          headerName: t("branchFieldaccountantID"),
          width: isFlexColumn ? 0 : gridColWidth,
        });
      }
    }

    const filterMap = (
      item: GridColumnType,
      filterName: string,
      filterType: any,
      filterArray?: any
    ) => ({
      ...item,
      filter: {
        field: item.field,
        type: filterType,
        name: filterName,
        filterArray: filterArray || null,
      },
    });

    const generateFilterArray = (t: TFunction) => [
      { label: t("yes"), value: "true" },
      { label: t("no"), value: "false" },
    ];

    if (selectedType && selectedType.key === -1) {
      res.push({
        field: "fiBranchTypeName",
        headerName: t(`branchFieldfiBranchTypeName`),
        width: isFlexColumn ? 0 : gridColWidth,
        hideCopy: true,
      });
    }

    return res.map((item) => {
      switch (item.field) {
        case "createDate":
        case "changeDate":
        case "renewalDate":
        case "suspensionDate":
        case "closeDate":
          return filterMap(item, item.field, FilterTypes.datePicker);
        case "chiefAccountantAppointmentDate":
          return filterMap(item, "accountantAppDate", FilterTypes.datePicker);
        case "code":
        case "registrationNumber":
        case "name":
        case "shortName":
        case "comment":
        case "address":
        case "manager":
        case "email":
        case "phone":
          return filterMap(item, item.field, FilterTypes.string);
        case "chiefAccountant":
          return filterMap(item, "accountant", FilterTypes.string);
        case "chiefAccountant.identificationNumber":
          return filterMap(item, "accountantIdNumber", FilterTypes.string);
        case "manager.identificationNumber":
          return filterMap(item, "managerIdNumber", FilterTypes.string);
        case "managerAppointmentDate":
          return filterMap(item, "managerAppDate", FilterTypes.datePicker);
        case "isStorageAvailable":
          return filterMap(
            item,
            "storageAvailable",
            FilterTypes.list,
            generateFilterArray(t)
          );
        case "disable":
          return filterMap(
            item,
            "disabled",
            FilterTypes.list,
            generateFilterArray(t)
          );
        case "regionModel":
          return {
            ...item,
            filter: {
              field: "regionModel",
              type: FilterTypes.country,
              name: "regionId",
              renderFilter: (
                columnsFilter: any,
                onFilterClick: any,
                onClear: any
              ) => {
                return (
                  <CountryFilter
                    onClickFunction={onFilterClick}
                    defaultValue={
                      columnsFilter.find((el: any) => el.name === "regionId")
                        ?.value
                    }
                    closeFilter={onClear}
                    data={countryData ? countryData : []}
                    loading={countryLoading}
                  />
                );
              },
            },
          };
      }

      return item;
    });
  };

  const filterOnChangeFunction = (obj: FilterType[]) => {
    setLoading(true);
    let filter: FilterType = {};
    for (let o of obj) {
      switch (o.type) {
        case FilterTypes.datePicker:
          filter[o.name] = o.date;
          break;
        case FilterTypes.string:
          filter[o.name] = o.value;
          break;
        case FilterTypes.list:
          filter[o.name] = o.value;
          break;
        case FilterTypes.country:
          filter[o.name] = o.value;
          break;
        default:
          filter[o.name] = o.value;
          break;
      }
    }
    fetchData(filter);
  };

  const fetchData = async (filterData?: FilterType) => {
    let filter = filterData ? filterData : {};
    if (selectedType) {
      await loadByType(fiId, pagingPage, rowsPerPage, selectedType.key, filter)
        .then((res) => {
          setData(res.data.list);
          const generatedCols = generateColumns(selectedType.config);
          if (getBranchColumnsFromLocaleState(generatedCols)) {
            let newCols = getBranchColumnsFromLocaleState(generatedCols);
            updateCFCAndColumns(newCols, filter);
          } else {
            updateCFCAndColumns(generatedCols, filter);
          }

          setTotalSize(res.data.totalResults);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const fetchTypes = async () => {
    await loadBranchTypesWithCount(fiId).then((resType) => {
      let types = resType.data.sort((x: BranchTypes, y: BranchTypes) => {
        return y.count - x.count;
      });

      types = types.map((e: BranchTypes) => ({
        name: e.name ? `${e.name}` : t(`${e.code.toLowerCase()}`),
        additional: countRenderer(e.count),
        count: e.count,
        key: e.id,
        config: e.steps?.flatMap((x) => [...x.columns]),
        steps: e.steps,
        code: e.code,
      }));
      setBranchTypes(types);
      setSelectedType(types.length !== 0 ? types[0] : null);
    });
  };

  const countRenderer = (count: number) => {
    return `(${count})`;
  };

  const submitCallback = (
    result: BranchDataType,
    type: BranchTypes,
    isNewRow: boolean,
    isDelete: boolean
  ) => {
    let branchTypeAll = branchTypes.find((b) => b.key === -1);
    let selectedBranchType = branchTypes.find(
      (b) => b.key === result.fiBranchTypeId
    );
    if (branchTypeAll) {
      branchTypeAll.count = isDelete
        ? branchTypeAll.count - 1
        : isNewRow
        ? branchTypeAll.count + 1
        : branchTypeAll.count;
      branchTypeAll.additional = countRenderer(branchTypeAll.count);
    }
    if (selectedBranchType) {
      selectedBranchType.count = isDelete
        ? selectedBranchType.count - 1
        : isNewRow
        ? selectedBranchType.count + 1
        : selectedBranchType.count;
      selectedBranchType.additional = countRenderer(selectedBranchType.count);
    }

    setBranchTypes([...branchTypes]);

    if (
      selectedType &&
      (type.id === selectedType.key || selectedType.key === -1)
    ) {
      result.fiBranchTypeName = type.name;
      setData([result, ...data.filter((row) => row.id !== result.id)]);
    }
  };

  const deleteBranchFunction = async (row: BranchDataType) => {
    await deleteBranch(row.id)
      .then(() => {
        updateFiData(row);
        setData(data.filter((v) => v.id !== row.id));
        enqueueSnackbar(t("deleted"), { variant: "success" });
      })
      .catch((err) => openErrorWindow(err, t("error"), true));
  };

  const updateCFCAndColumns = (newColumns: any, filter: any) => {
    setColumnFilterConfig([
      ...newColumns.filter((gc: any) => gc.filter).map((gc: any) => gc.filter),
    ]);

    setColumns([
      ...newColumns.map((col: any) => {
        return filter.hasOwnProperty(col.filter?.name)
          ? {
              ...col,
              filter: { ...col.filter, value: filter[col.filter.name] },
            }
          : { ...col };
      }),
    ]);
  };

  const updateFiData = (row: BranchDataType) => {
    const branchTypeList = [...(fi.branchTypeCounterList ?? [])];

    for (let branchType of branchTypeList) {
      if (row.fiBranchTypeName === branchType.name) {
        branchType.count = branchType.count - 1;
        break;
      }
    }

    setFi({ ...fi, branchTypeCounterList: branchTypeList });
    if (selectedType) {
      submitCallback(
        row,
        { ...selectedType, id: selectedType.key },
        false,
        true
      );
    }
  };

  const deleteMultiBranch = async () => {
    let data = selectedRows.map((item) => item.id);
    await deleteFiMultiBranch(fiId, data)
      .then(() => {
        enqueueSnackbar(t("deleted"), { variant: "success" });
        fetchTypes();
        setSelectedRows([]);
      })
      .catch((err) => openErrorWindow(err, t("error"), true));
  };

  return (
    <FIBranch
      columns={columns}
      setColumns={setColumns}
      columnFilterConfig={columnFilterConfig}
      data={data}
      setData={setData}
      deleteBranchFunction={deleteBranchFunction}
      setSelectedRows={setSelectedRows}
      selectedRows={selectedRows}
      loading={loading}
      setActivePage={setPagingPage}
      totalSize={totalSize}
      pagingPage={pagingPage}
      initialRowsPerPage={rowsPerPage}
      setRowPerPage={setRowsPerPage}
      branchTypes={branchTypes}
      setSelectedType={setSelectedType}
      selectedType={selectedType}
      submitCallback={submitCallback}
      fiId={fiId}
      deleteMultiBranch={deleteMultiBranch}
      filterOnChangeFunction={filterOnChangeFunction}
    />
  );
};

const reducer = "fi";

const mapStateToProps = (state: any) => ({
  fi: state.getIn([reducer, "fi"]) as FiDataType,
  state: state.get("state"),
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  setFi: bindActionCreators(setFI, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(FIBranchContainer);
