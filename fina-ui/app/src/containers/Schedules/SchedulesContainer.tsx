import SchedulesPage from "../../components/Schedules/SchedulesPage";
import { useTranslation } from "react-i18next";
import React, { FC, memo, useEffect, useRef, useState } from "react";
import {
  deleteMultipleSchedules,
  deleteSchedule,
  editSchedule,
  loadSchedules,
} from "../../api/services/scheduleService";
import useConfig from "../../hoc/config/useConfig";
import { FilterTypes, getFormattedDateValue } from "../../util/appUtil";
import { useSnackbar } from "notistack";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { loadFiTree } from "../../api/services/fi/fiService";
import {
  getReturnDefinitions,
  getReturnTypes,
} from "../../api/services/returnsService";
import FIFilter from "../../components/common/Filter/FIFilter";
import ReturnDefinitionFilter from "../../components/common/Filter/ReturnDefinitionFilter";
import { getPeriodTypes } from "../../api/services/periodTypesService";
import PeriodTypeFilter from "../../components/common/Filter/PeriodTypeFilter";
import { connect } from "react-redux";
import ReturnTypeAutocompleteFilter from "../../components/common/Filter/ReturnTypeAutocompleteFilter";
import {
  columnFilterConfigType,
  GridColumnType,
} from "../../types/common.type";
import { ScheduleType } from "../../types/schedule.type";
import { FiType } from "../../types/fi.type";
import {
  ReturnDefinitionType,
  ReturnType,
} from "../../types/returnDefinition.type";
import { PeriodType } from "../../types/period.type";

interface SchedulesContainerProps {
  viewMode: boolean;
  onScheduleSelectFunction: any;
  selectedSchedules: any[];
  state: any;
  columnsProp: any[];
}

const SchedulesContainer: FC<SchedulesContainerProps> = ({
  viewMode,
  onScheduleSelectFunction,
  selectedSchedules,
  state,
  columnsProp,
}) => {
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();
  const { enqueueSnackbar } = useSnackbar();
  const { openErrorWindow } = useErrorWindow();

  const [data, setData] = useState<ScheduleType[]>([]);
  const [returns, setReturns] = useState<ReturnDefinitionType[]>([]);
  const [returnTypes, setReturnTypes] = useState<ReturnType[]>([]);
  const [periodTypes, setPeriodTypes] = useState<PeriodType[]>([]);

  const [selectedRows, setSelectedRows] = useState<ScheduleType[]>([]);
  const [columns, setColumns] = useState<GridColumnType[]>([]);
  const [fiTreeData, setFiTreeData] = useState<FiType[]>();

  //paging
  const [pagingPage, setPagingPage] = useState(1);
  const [pagingLimit, setPagingLimit] = useState(25);
  const [dataQuantity, setDataQuantity] = useState(0);

  //modals
  const [deleteSelectedRowsModal, setDeleteSelectedRowsModal] = useState(false);
  const [deleteAllModal, setDeleteAllModal] = useState(false);
  const [scheduleDeleteErrorModal, setScheduleDeleteErrorModal] =
    useState(false);

  const [filter, setFilter] = useState<any>({
    page: pagingPage,
    limit: pagingLimit,
    sortField: "",
    sortDirection: "",
    loadAllPeriodData: false,
  });
  const [editDueDateDisable, setEditDueDateDisable] = useState(true);
  const [loading, setLoading] = useState(true);
  const pageDataRef = useRef<ScheduleType[]>([]);
  const allSelectedRowsRef = useRef<ScheduleType[]>([]);

  useEffect(() => {
    if (state !== undefined && state.columns.length !== 0) {
      let newCols: GridColumnType[] = [];
      for (let item of state.columns) {
        let headerCell = columnHeader.find((el) => item.field === el.field);
        headerCell.hidden = item.hidden;
        headerCell.fixed = item.fixed;
        newCols.push(headerCell);
      }
      setColumns(newCols);
    } else {
      setColumns(columnHeader);
    }
  }, [t, state]);

  useEffect(() => {
    getReturns();
    loadReturnTypes();
    loadPeriodTypes();
    loadFITreeData();
  }, []);

  useEffect(() => {
    loadData();
  }, [pagingPage, pagingLimit, filter]);

  const loadData = async () => {
    await loadScheduleData(filter);

    const selectedRows = viewMode
      ? selectedSchedules
      : allSelectedRowsRef.current;

    if (selectedRows?.length) {
      const selectedRowsOnPage = pageDataRef.current.filter((currRow) =>
        selectedRows.some((selRow) => selRow.id === currRow.id)
      );
      setSelectedRows(selectedRowsOnPage);
    } else {
      setSelectedRows([]);
    }
  };

  const onPagingLimitChange = (limit: number) => {
    setFilter({ ...filter, page: 1, limit: limit });
    setPagingLimit(limit);
  };
  const onPageChange = (number: number) => {
    setSelectedRows([]);
    setPagingPage(number);
    setFilter({ ...filter, page: number });
  };

  const columnFilterConfig = [
    {
      field: "returnDefinition.code",
      type: FilterTypes.fis,
      name: "return",
      renderFilter: (
        columnsFilter: columnFilterConfigType[],
        onFilterClick: () => void,
        onClear: () => void
      ) => {
        return (
          <ReturnDefinitionFilter
            onClickFunction={onFilterClick}
            data={returns}
            label={t("returnDefinition")}
            closeFilter={onClear}
            defaultValue={
              columnsFilter.find((el) => el.name === "return")?.value
            }
            loading={false}
            singleSelect={true}
            isGrid={false}
          />
        );
      },
    },
    {
      field: "period.fromDate",
      type: FilterTypes.datePicker,
      name: "periodFrom",
    },
    {
      field: "period.toDate",
      type: FilterTypes.datePicker,
      name: "periodTo",
    },
    {
      field: "period.periodType.code",
      type: FilterTypes.fis,
      name: "periodType",
      renderFilter: (
        columnsFilter: columnFilterConfigType[],
        onFilterClick: () => void,
        onClear: () => void
      ) => {
        return (
          <PeriodTypeFilter
            onClickFunction={onFilterClick}
            data={periodTypes}
            label={t("periodType")}
            closeFilter={onClear}
            defaultValue={
              columnsFilter.find((el) => el.name === "periodType")?.value
            }
          />
        );
      },
    },
    {
      field: "fi.code",
      type: FilterTypes.fis,
      name: "fiIds",
      renderFilter: (
        columnsFilter: columnFilterConfigType[],
        onFilterClick: () => void,
        onClear: () => void
      ) => {
        return (
          <FIFilter
            label={t("nameOfBank")}
            onClickFunction={onFilterClick}
            defaultValue={
              columnsFilter.find((el) => el.name === "fiIds")?.value
            }
            closeFilter={onClear}
            data={fiTreeData}
          />
        );
      },
    },
    {
      field: "returnDefinition.returnType.code",
      type: FilterTypes.fis,
      name: "returnType",
      renderFilter: (
        columnsFilter: columnFilterConfigType[],
        onFilterClick: () => void,
        onClear: () => void,
        value: any
      ) => {
        return (
          <ReturnTypeAutocompleteFilter
            onClickFunction={onFilterClick}
            data={returnTypes}
            label={t("returnTypes")}
            closeFilter={onClear}
            defaultValue={value}
          />
        );
      },
    },
    {
      field: "delay",
      type: FilterTypes.number,
      name: "delay",
    },
    {
      field: "delayHour",
      type: FilterTypes.number,
      name: "delayHour",
    },
    {
      field: "delayMinute",
      type: FilterTypes.number,
      name: "delayMinute",
    },
    {
      field: "comment",
      type: FilterTypes.string,
      name: "comment",
    },
  ];

  let columnHeader = columnsProp
    ? columnsProp
    : [
        {
          field: "returnDefinition.code",
          headerName: t("code"),
          flex: 1,
          copyFunction: (row: ScheduleType) => {
            return row?.returnDefinition?.code;
          },
        },
        {
          field: "period.fromDate",
          headerName: t("periodFrom"),
          flex: 1,
          renderCell: (date: Date) => {
            return getFormattedDateValue(date, getDateFormat(true));
          },
          copyFunction: (row: ScheduleType) => {
            return getFormattedDateValue(
              row?.period?.fromDate,
              getDateFormat(true)
            );
          },
        },
        {
          field: "period.toDate",
          headerName: t("periodTo"),
          flex: 1,
          renderCell: (date: Date) => {
            return getFormattedDateValue(date, getDateFormat(true));
          },
          copyFunction: (row: ScheduleType) => {
            return getFormattedDateValue(
              row?.period?.toDate,
              getDateFormat(true)
            );
          },
        },
        {
          field: "period.periodType.code",
          headerName: t("periodTypeCode"),
          flex: 1,
          copyFunction: (row: ScheduleType) => {
            return row?.period?.periodType?.code;
          },
        },
        {
          field: "period.periodType.name",
          headerName: t("periodTypeName"),
          flex: 1,
          copyFunction: (row: ScheduleType) => {
            return row?.period?.periodType?.name;
          },
        },
        {
          field: "returnDefinition.name",
          headerName: t("definitionName"),
          flex: 1,
          copyFunction: (row: ScheduleType) => {
            return row?.returnDefinition?.name;
          },
        },
        {
          field: "fi.code",
          headerName: t("fiCode"),
          flex: 1,
          copyFunction: (row: ScheduleType) => {
            return row?.fi?.code;
          },
        },
        {
          field: "fi.name",
          headerName: t("fiName"),
          flex: 1,
          copyFunction: (row: ScheduleType) => {
            return row?.fi?.name;
          },
        },
        {
          field: "returnDefinition.returnType.code",
          headerName: t("returnType"),
          flex: 1,
          copyFunction: (row: ScheduleType) => {
            return row?.returnDefinition?.returnType?.code;
          },
        },
        {
          field: "delay",
          headerName: t("dueDate"),
          flex: 1,
        },
        {
          field: "delayHour",
          headerName: t("dueHour"),
          flex: 1,
        },
        {
          field: "delayMinute",
          headerName: t("dueMinute"),
          flex: 1,
        },
        {
          field: "comment",
          headerName: t("comment"),
          flex: 1,
        },
      ];

  const loadFITreeData = () => {
    let data = fiTreeData;

    if (!fiTreeData) {
      loadFiTree()
        .then((res) => {
          setFiTreeData(res.data);
          data = res.data;
        })
        .catch((error) => enqueueSnackbar(error, { variant: "error" }));
    }
    return data;
  };
  const loadScheduleData = async (filteredData: any) => {
    setLoading(true);
    let gridFilters = {
      ...filteredData,
      sortField: filter.sortField,
      sortDirection: filter.sortDirection,
    };
    const response = await loadSchedules(
      filter.page,
      filter.limit,
      gridFilters
    );
    const data = response.data.list;
    setDataQuantity(data.length);
    setData(data);
    pageDataRef.current = data;
    setLoading(false);
  };
  const deleteSelectedRows = () => {
    let scheduleIds = allSelectedRowsRef.current.map((item) => item.id);

    setLoading(true);

    deleteMultipleSchedules(scheduleIds)
      .then(() => {
        if (selectedRows.length === pagingLimit) {
          loadData();
        } else {
          setData([
            ...data.filter((row) => !selectedRows.some((r) => r.id === row.id)),
          ]);
        }
        cancelDelete();
        setDeleteSelectedRowsModal(false);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), false);
        setDeleteSelectedRowsModal(false);
      })
      .finally(() => setLoading(false));
  };

  const cancelDelete = () => {
    setSelectedRows([]);
    allSelectedRowsRef.current = [];
  };

  const deleteAllRows = () => {
    setData([]);
    setDeleteAllModal(false);
  };

  const deleteRow = (row: ScheduleType) => {
    deleteSchedule(row.id)
      .then(() => {
        setData([...data.filter((r) => r.id !== row.id)]);
        enqueueSnackbar(t("deleted"), {
          variant: "success",
        });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const getReturns = () => {
    getReturnDefinitions()
      .then((resp) => {
        setReturns(resp.data);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const loadReturnTypes = () => {
    getReturnTypes()
      .then((res) => {
        setReturnTypes(res.data);
      })
      .catch((e) => {
        openErrorWindow(e, t("error"), true);
      });
  };

  const loadPeriodTypes = () => {
    getPeriodTypes()
      .then((res) => {
        setPeriodTypes(res.data);
      })
      .catch((e) => {
        openErrorWindow(e, t("error"), true);
      });
  };

  const getValueFromArray = (arr: any, fieldName: string, key: string) => {
    let obj = arr.find((item: { name: string }) => item.name === fieldName);
    if (obj) {
      if (fieldName === "returnType") {
        return obj.value?.id;
      } else if (obj.type === FilterTypes.fis && obj.value) {
        return obj.value[0]?.[key];
      }

      return obj[key];
    }

    return null;
  };

  const filterOnChangeFunction = (obj: any) => {
    let columnFilters = {
      fiIDs: obj.find((item: { name: string }) => item.name === "fiIds")
        ? obj
            .find((item: { name: string }) => item.name === "fiIds")
            .value?.map((item: { id: number }) => item.id)
        : null,
      rdId: obj.find((item: { name: string }) => item.name === "return")
        ? obj.find((item: { name: string }) => item.name === "return").value?.id
        : "",
      returnTypeId: getValueFromArray(obj, "returnType", "id"),
      periodTypeId: getValueFromArray(obj, "periodType", "id"),
      periodFrom: getValueFromArray(obj, "periodFrom", "date"),
      periodTo: getValueFromArray(obj, "periodTo", "date"),
      delay: getValueFromArray(obj, "delay", "value"),
      delayHour: getValueFromArray(obj, "delayHour", "value"),
      delayMinute: getValueFromArray(obj, "delayMinute", "value"),
      comment: getValueFromArray(obj, "comment", "value"),
      loadAllPeriodData: getValueFromArray(obj, "loadAllPeriodData", "value"),
    };
    if (
      columnFilters["loadAllPeriodData"] === undefined ||
      columnFilters["loadAllPeriodData"] === null
    ) {
      columnFilters["loadAllPeriodData"] = filter.loadAllPeriodData;
    }

    const filteredObj = Object.fromEntries(
      Object.entries(columnFilters).filter(
        ([_, value]) =>
          value !== null && value !== undefined && String(value).trim() !== ""
      )
    );

    let result = { page: 1, limit: 25, ...filteredObj };
    delete filteredObj["loadAllPeriodData"];
    setEditDueDateDisable(!Boolean(Object.keys(filteredObj).length > 0));
    setFilter(result);
    if (result) {
      loadScheduleData(result);
    }
  };

  const onDataUpdateCallBackFunction = (
    schedule: any,
    isSingle: boolean,
    onClose: () => void
  ) => {
    if (isSingle) {
      setData(
        data.map((item) => {
          return item.id === schedule.id ? schedule : item;
        })
      );
    } else {
      if (filter.fiIDs) {
        filter.fiIds = filter.fiIDs;
        delete filter.fiIDs;
      }
      let result = { ...schedule, ...filter };
      editSchedule(result)
        .then(() => {
          const updatedData = data.map((item) => ({
            ...item,
            delay: schedule.newDueDate || item.delay,
            delayHour: schedule.newDueDateHour || item.delayHour,
            delayMinute: schedule.newDueDateMinute || item.delayMinute,
            comment: schedule.newComment || item.comment,
          }));
          setData(updatedData);
          onClose();
          enqueueSnackbar(t("saved"), { variant: "success" });
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
        });
    }
  };

  return (
    <SchedulesPage
      column={columns}
      setColumn={setColumns}
      rows={data}
      setRows={setData}
      selectedRows={selectedRows}
      setSelectedRows={setSelectedRows}
      deleteSelectedRows={deleteSelectedRows}
      cancelDelete={cancelDelete}
      deleteAllRows={deleteAllRows}
      deleteSelectedRowsModal={deleteSelectedRowsModal}
      setDeleteSelectedRowsModal={setDeleteSelectedRowsModal}
      deleteAllModal={deleteAllModal}
      setDeleteAllModal={setDeleteAllModal}
      scheduleDeleteErrorModal={scheduleDeleteErrorModal}
      setScheduleDeleteErrorModal={setScheduleDeleteErrorModal}
      deleteRow={deleteRow}
      viewMode={viewMode}
      onScheduleSelectFunction={onScheduleSelectFunction}
      onPagingLimitChange={onPagingLimitChange}
      filter={filter}
      onPageChange={onPageChange}
      loading={loading}
      fis={fiTreeData}
      returns={returns}
      loadScheduleData={loadScheduleData}
      onDataUpdateCallBackFunction={onDataUpdateCallBackFunction}
      filterOnChangeFunction={filterOnChangeFunction}
      columnFilterConfig={columnFilterConfig}
      returnTypes={returnTypes}
      periodTypes={periodTypes}
      editDueDateDisable={editDueDateDisable}
      setFilter={setFilter}
      dataQuantity={dataQuantity}
      allSelectedRowsRef={allSelectedRowsRef}
    />
  );
};

const mapStateToProps = (state: any) => ({
  state: state.getIn(["state", "scheduleDefinitionTableCustomization"]),
});
const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(memo(SchedulesContainer));
