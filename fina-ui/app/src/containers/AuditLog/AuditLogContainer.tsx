import { useTranslation } from "react-i18next";
import AuditLogPage from "../../components/AuditLog/AuditLogPage";
import React, { useEffect, useState } from "react";
import { loadAuditLogData } from "../../api/services/auditLogService";
import { connect } from "react-redux";
import {
  BASE_REST_URL,
  FilterTypes,
  getFormattedDateValue,
} from "../../util/appUtil";
import useConfig from "../../hoc/config/useConfig";
import EntityNameFilter from "../../components/AuditLog/EntityNameFilter";
import {
  columnFilterConfigType,
  ConfigType,
  FilterType,
  GridColumnType,
  SortInfoType,
} from "../../types/common.type";
import { AuditLogDataType } from "../../types/auditLog.type";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";

interface AuditLogContainerProps {
  state: any;
  config: ConfigType;
}

interface Filter {
  page: number;
  limit: number;

  [key: string]: number | string;
}

const AuditLogContainer: React.FC<AuditLogContainerProps> = ({
  state,
  config,
}) => {
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();
  const { openErrorWindow } = useErrorWindow();
  let sortDisabled =
    config.properties["fina2.auditlog.sort.disabled"] === "true";

  const columnFilterConfig: columnFilterConfigType[] = [
    {
      type: FilterTypes.dateAndTimePicker,
      name: "relevanceTime",
      field: "relevanceTime",
    },
    {
      field: "actorId",
      type: FilterTypes.string,
      name: "actorId",
      value: "",
    },
    {
      field: "operationType",
      type: FilterTypes.list,
      name: "operationType",
      value: "",
      filterArray: [
        { label: t("CREATE"), value: "CREATE" },
        { label: t("DELETE"), value: "DELETE" },
        { label: t("EDIT"), value: "EDIT" },
        { label: t("LOGIN"), value: "LOGIN" },
        { label: t("GENERATE"), value: "GENERATE" },
        { label: t("PROCESS"), value: "PROCESS" },
        { label: t("EXPORT"), value: "EXPORT" },
      ],
    },
    {
      field: "entityName",
      name: "entityName",
      type: FilterTypes.string,
      renderFilter: (
        columnsFilter: FilterType[],
        onFilterClick: (result: string | number) => void,
        onClear: () => void
      ) => {
        return (
          <EntityNameFilter
            defaultValue={
              columnsFilter.find((el) => el.name === "entityName")?.value
            }
            onFilterClick={onFilterClick}
            onClear={onClear}
          />
        );
      },
    },
    {
      field: "entityProperty",
      type: FilterTypes.string,
      name: "entityProperty",
      value: "",
    },
    {
      field: "entityPropertyOldValue",
      type: FilterTypes.string,
      name: "oldValue",
      value: "",
    },
    {
      field: "entityPropertyNewValue",
      type: FilterTypes.string,
      name: "newValue",
      value: "",
    },
    {
      field: "clientName",
      type: FilterTypes.list,
      name: "clientName",
      value: "",
      filterArray: [
        { label: t("FINA"), value: "FINA" },
        { label: t("SP"), value: "SP" },
        { label: t("ADDON-EXCEL"), value: "ADDON-EXCEL" },
        { label: t("ADDON-AOO"), value: "ADDON-AOO" },
      ],
    },
  ];

  let [columns, setColumns] = useState<GridColumnType[]>([
    {
      field: "id",
      headerName: t("recordId"),
      hideSort: sortDisabled,
    },
    {
      field: "relevanceTime",
      headerName: t("date"),
      hideCopy: true,
      renderCell: (relevanceTime: number) => {
        return getFormattedDateValue(relevanceTime, getDateFormat(false));
      },
      hideSort: sortDisabled,
    },
    {
      field: "actorId",
      headerName: t("actorIdIp"),
      hideCopy: true,
      hideSort: sortDisabled,
    },
    {
      field: "operationType",
      headerName: t("action"),
      hideCopy: true,
      hideSort: sortDisabled,
    },
    {
      field: "entityName",
      headerName: t("objectName"),
      hideCopy: true,
      hideSort: sortDisabled,
    },
    {
      field: "entityProperty",
      headerName: t("property"),
      hideSort: true,
    },
    {
      field: "entityPropertyOldValue",
      headerName: t("oldValue"),
      hideSort: sortDisabled,
    },
    {
      field: "entityPropertyNewValue",
      headerName: t("newValue"),
      hideSort: sortDisabled,
    },
    {
      field: "clientName",
      headerName: t("client"),
      hideSort: sortDisabled,
    },
  ]);

  const [data, setData] = useState<AuditLogDataType[]>([]);
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<Filter>({
    page: 1,
    limit: 25,
    sortField: "id",
    sortDirection: "desc",
  });

  const [sortInfo, setSortInfo] = useState<SortInfoType>({
    sortField: "relevanceTime",
    sortDir: "desc",
  });

  const onExport = () => {
    let url = "/audit/export?";
    for (const key in filter) {
      if (key !== "limit" && key !== "page") {
        url += `${key}=${filter[key]}&`;
      }
    }
    window.open(BASE_REST_URL + url.slice(0, -1), "_blank");
  };

  useEffect(() => {
    if (state !== undefined && state.columns.length !== 0) {
      let newCols = [];
      for (let item of state.columns) {
        let headerCell = columns.find((el) => item.field == el.field);
        if (headerCell) {
          headerCell.hidden = item.hidden;
          headerCell.fixed = item.fixed;
          newCols.push(headerCell);
        }
      }
      setColumns(newCols);
    }
  }, [state]);

  useEffect(() => {
    setDataLoading(true);
    loadAuditLogData(filter, sortInfo)
      .then((resp) => {
        const data = resp.data.list;
        setData(data);
      })
      .catch((error) => {
        openErrorWindow(error, t("error"), true);
      })
      .finally(() => setDataLoading(false));
  }, [filter, sortInfo]);

  const onPagingLimitChange = (limit: number) => {
    setFilter({ ...filter, page: 1, limit: limit });
  };
  const onPageChange = (number: number) =>
    setFilter({ ...filter, page: number });

  const filterOnChangeFunction = (obj: FilterType[]) => {
    let filterObj: Filter = {
      page: 1,
      limit: 25,
    };

    for (let o of obj) {
      if (o.name === "relevanceTime") {
        if (o.start) {
          filterObj["relevanceTimeFrom"] = o.start;
        }
        if (o.end) {
          filterObj["relevanceTimeTo"] = o.end;
        }
      } else if (o.value && o.name) {
        filterObj[o.name] = o.value;
      }
    }
    const paging = { limit: filter.limit, page: filter.page };

    setFilter({ ...paging, ...filterObj });
  };

  const onSort = (sortField: string, arrowDirection: string) => {
    let sortDir = arrowDirection === "down" ? "desc" : "asc";
    setSortInfo({ sortField, sortDir });
  };

  return (
    <AuditLogPage
      columns={columns}
      columnFilterConfig={columnFilterConfig}
      data={data}
      setData={setData}
      filter={filter}
      onPagingLimitChange={onPagingLimitChange}
      onPageChange={onPageChange}
      dataLoading={dataLoading}
      filterOnChangeFunction={filterOnChangeFunction}
      setColumns={setColumns}
      onExport={onExport}
      onSort={onSort}
    />
  );
};

const mapStateToProps = (state: any) => ({
  state: state.getIn(["state", "auditLogTableCustomization"]),
});

export default connect(mapStateToProps, {})(AuditLogContainer);
