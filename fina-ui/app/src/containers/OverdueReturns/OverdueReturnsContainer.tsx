import OverdueReturnsPage from "../../components/OverdueReturns/OverdueReturnsPage";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BASE_REST_URL,
  FilterTypes,
  getDefaultDateFormat,
  getFormattedDateValue,
} from "../../util/appUtil";
import { overdueReturnsPeriodTypeList } from "../../components/OverdueReturns/overdueReturnsConstants";
import { loadOverdueReturns } from "../../api/services/overdueReturnsService";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { loadFiTypes } from "../../api/services/fi/fiService";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { OverdueReturn } from "../../types/return.type";
import { GridColumnType } from "../../types/common.type";
import { FiType } from "../../types/fi.type";

const OverdueReturnsContainer = ({ state }: any) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const [pagingPage, setPagingPage] = useState(1);
  const [pagingLimit, setPagingLimit] = useState(25);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [overdueReturnsData, setOverdueReturnsData] = useState<OverdueReturn[]>(
      []
  );
  const [gridFilter, setGridFilter] = useState({});
  const [fiTypes, setFiTypes] = useState([]);
  const [columns, setColumns] = useState<GridColumnType[]>([]);

  const columnFilterConfig = [
    {
      field: "fiCode",
      type: FilterTypes.string,
      name: "fiCode",
    },
    {
      field: "fiType",
      type: FilterTypes.list,
      name: "fiTypeId",
      filterArray: fiTypes,
    },
    {
      headerName: t("periodType"),
      type: FilterTypes.list,
      name: "periodType",
      filterArray: overdueReturnsPeriodTypeList,
    },
    {
      field: "fromDate",
      type: FilterTypes.datePicker,
      name: "fromDate",
    },
    {
      field: "toDate",
      type: FilterTypes.datePicker,
      name: "toDate",
    },
  ];

  const columnHeader: GridColumnType[] = [
    {
      field: "name",
      headerName: t("name"),
      width: 200,
      hideSort: true,
    },
    {
      field: "fiCode",
      headerName: t("fiCode"),
      width: 200,
    },
    {
      field: "fiName",
      headerName: t("fiName"),
      width: 200,
      hideSort: true,
    },
    {
      field: "fiType",
      headerName: t("fiType"),
      width: 200,
    },
    {
      field: "region",
      headerName: t("region"),
      width: 200,
      hideSort: true,
    },
    {
      field: "address",
      headerName: t("address"),
      width: 200,
      hideSort: true,
    },
    {
      field: "fiIdentificationCode",
      headerName: t("identificationCode"),
      width: 200,
      hideSort: true,
    },
    {
      field: "fiLegalForm",
      headerName: t("legalForm"),
      width: 200,
      hideSort: true,
    },
    {
      field: "periodType",
      headerName: t("periodType"),
      width: 200,
      hideSort: true,
    },
    {
      field: "returnVersion",
      headerName: t("returnVersion"),
      width: 200,
      hideSort: true,
    },
    {
      field: "fromDate",
      headerName: t("fromDate"),
      width: 200,
      renderCell: (value: number) => {
        return (
            <span>{getFormattedDateValue(value, getDefaultDateFormat())}</span>
        );
      },
    },
    {
      field: "toDate",
      headerName: t("toDate"),
      width: 200,
      renderCell: (value: number) => {
        return (
            <span>{getFormattedDateValue(value, getDefaultDateFormat())}</span>
        );
      },
    },
    {
      field: "dueDate",
      headerName: t("dueDate"),
      width: 200,
      hideSort: true,
    },
    {
      field: "dueDateHour",
      headerName: t("dueDateHour"),
      width: 200,
      hideSort: true,
    },
    {
      field: "dueDateMinute",
      headerName: t("dueDateMinute"),
      width: 200,
      hideSort: true,
    },
    {
      field: "uploadedTime",
      headerName: t("uploadTime"),
      width: 200,
      hideSort: true,
      renderCell: (value: number) => {
        return (
            <span>{getFormattedDateValue(value, getDefaultDateFormat())}</span>
        );
      },
    },
    {
      field: "delay",
      headerName: t("delay"),
      width: 200,
    },
  ];

  useEffect(() => {
    fiTypeArr();
  }, []);

  useEffect(() => {
    if (state !== undefined && state.columns.length !== 0) {
      let newCols: GridColumnType[] = [];
      for (let item of state.columns) {
        let headerCell = columnHeader.find((el) => item.field === el.field);
        if (headerCell) {
          headerCell.hidden = item.hidden;
          headerCell.fixed = item.fixed;
          newCols.push(headerCell);
        }
      }
      setColumns(newCols);
    } else {
      setColumns(columnHeader);
    }
  }, [t, fiTypes, state]);

  const fiTypeArr = () => {
    loadFiTypes(false).then((res) => {
      setFiTypes(
          res.data.map((fi: FiType) => {
            return {
              ...fi,
              value: fi.id,
              label: `${fi.code}/${fi.name}`,
            };
          })
      );
    });
  };

  const onExport = () => {
    let filters: any = { ...gridFilter };
    let url = "/overduereturns/export?";
    if (Object.keys(filters).length !== 0) {
      for (const property in filters) {
        if (Array.isArray(filters[property])) {
          let queryParam =
              property + "=" + filters[property].join("&" + property + "=");
          url += queryParam;
        } else {
          url += `${property}=${filters[property]}`;
        }
        url += "&";
      }
    }
    window.open(BASE_REST_URL + encodeURI(url), "_blank");
  };

  const filterOnChangeFunction = (obj: any) => {
    let filter: any = {};

    for (let o of obj) {
      switch (o.type) {
        case FilterTypes.list:
          if (o.value) {
            if (o.name === "periodType") filter[o.name] = o.value;
            else filter[o.name] = [o.value];
          }
          break;
        case FilterTypes.datePicker:
          if (o.date) {
            filter[o.name] = o.date;
          }
          break;
        default: {
          filter[o.name] = o.value;
        }
      }
    }
    if (
        Object.keys(filter).length === 0 &&
        Object.keys(gridFilter).length === 0
    )
      return;
    setGridFilter(filter);
  };

  useEffect(() => {
    initOverdueReturns();
  }, [pagingPage, pagingLimit, gridFilter]);

  const initOverdueReturns = (columnFilter = {}) => {
    setLoading(true);
    let filter = { ...gridFilter, ...columnFilter };
    loadOverdueReturns(pagingPage, pagingLimit, filter)
        .then((res) => {
          const modifiedList: OverdueReturn[] = res.data.list.map(
              (item: OverdueReturn, index: number) => ({
                ...item,
                id: index + 1,
              })
          );

          setOverdueReturnsData(modifiedList);
          setTotalResults(res.data.totalResults);
          setLoading(false);
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
          setLoading(false);
        });
  };

  const onPagingLimitChange = (limit: number) => {
    setPagingPage(1);
    setPagingLimit(limit);
  };

  const orderRowByHeader = (cellName: string, arrowDirection: string) => {
    let fieldName = cellName === "code" ? "id" : cellName;
    let sortDirection = arrowDirection === "up" ? "asc" : "desc";
    setGridFilter({
      ...gridFilter,
      sortField: fieldName,
      sortDirection: sortDirection,
    });
  };

  return (
      <OverdueReturnsPage
          columns={columns}
          setColumns={setColumns}
          columnFilterConfig={columnFilterConfig}
          rows={overdueReturnsData}
          onPagingLimitChange={onPagingLimitChange}
          pagingPage={pagingPage}
          pagingLimit={pagingLimit}
          setPagingPage={setPagingPage}
          totalResults={totalResults}
          loading={loading}
          filterOnChangeFunction={filterOnChangeFunction}
          setRows={setOverdueReturnsData}
          onExport={onExport}
          orderRowByHeader={orderRowByHeader}
      />
  );
};

OverdueReturnsContainer.propTypes = {
  state: PropTypes.object,
};

const mapStateToProps = (state: any) => ({
  state: state.getIn(["state", "overdueReturnsTableCustomization"]),
});
const mapDispatchToProps = () => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OverdueReturnsContainer);
