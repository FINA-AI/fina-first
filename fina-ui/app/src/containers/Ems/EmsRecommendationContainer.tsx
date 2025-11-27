import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FilterTypes, getFormattedDateValue } from "../../util/appUtil";
import useConfig from "../../hoc/config/useConfig";
import { loadRecommendations } from "../../api/services/ems/emsRecommendationService";
import { loadFiTree } from "../../api/services/fi/fiService";
import FiFilter from "../../components/common/Filter/FIFilter";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import EmsRecommendationsPage from "../../components/EMS/EmsRecommendations/EmsRecommendationsPage";

import {
  recomendationDataType,
  recommendationFilterType,
} from "../../types/recomendation.type";
import { connect } from "react-redux";
import {
  columnFilterConfigType,
  ConfigType,
  GridColumnType,
} from "../../types/common.type";
import { loadSanctionTypes } from "../../api/services/ems/emsSanctionService";

interface EmsRecommendationContainerProps {
  config: ConfigType;
  state: any;
}
const EmsRecommendationContainer: React.FC<EmsRecommendationContainerProps> = ({
  config,
  state,
}) => {
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();
  const { openErrorWindow } = useErrorWindow();
  const languageKey: string = config.language || "en_US";

  const [pagingPage, setPagingPage] = useState(1);
  const [pagingLimit, setPagingLimit] = useState(25);
  const [rowsLen, setRowsLen] = useState(0);
  const [filterObject, setFilterObject] = useState<recommendationFilterType>(
    {}
  );
  const [rows, setRows] = useState<recomendationDataType[]>([]);
  const [fiData, setFiData] = useState([]);
  const [sanctionTypeArr, setSanctionTypeArr] = useState<
    { label: string; value: string | number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const columnFilterConfig: columnFilterConfigType[] = [
    {
      field: "fiName",
      type: FilterTypes.fis,
      name: "fiIds",
      renderFilter: (columnsFilter: any, onFilterClick: any, onClear: any) => {
        return (
          <FiFilter
            label={t("finame")}
            onClickFunction={onFilterClick}
            defaultValue={
              columnsFilter.find((el: any) => el.name === "fiIds")?.value
            }
            closeFilter={onClear}
            data={fiData}
          />
        );
      },
    },
    {
      field: "deliveryDate",
      type: FilterTypes.date,
      name: "DELIVERY_DATE",
    },
    {
      field: "executionDate",
      type: FilterTypes.date,
      name: "EXECUTION_DATE",
    },
    {
      field: "status",
      type: FilterTypes.list,
      name: "status",
      value: "",
      filterArray: [
        { label: t("imposed"), value: "IMPOSED" },
        { label: t("fulfilled"), value: "FULFILLED" },
        { label: t("done"), value: "DONE" },
        { label: t("appealed"), value: "APPEALED" },
        { label: t("paid"), value: "PAID" },
        { label: t("unpaid"), value: "UNPAID" },
        { label: t("annueld"), value: "ANNULLED" },
      ],
    },
    {
      field: "type",
      type: FilterTypes.list,
      name: "type",
      value: "",
      filterArray: sanctionTypeArr,
    },
  ];

  let headerColumns = [
    {
      field: "fiCode",
      headerName: t("code"),
    },
    {
      field: "fiName",
      headerName: t("finame"),
    },
    {
      field: "deliveryDate",
      headerName: t("deliverydate"),
      renderCell: (value: number) =>
        getFormattedDateValue(value, getDateFormat(true)),
    },
    {
      field: "executionDate",
      headerName: t("executiondate"),
      renderCell: (value: number) =>
        getFormattedDateValue(value, getDateFormat(true)),
    },
    {
      field: "status",
      headerName: t("status"),
      renderCell: (value: string, row: any) => {
        return row.status || row.fineStatus;
      },
    },
    {
      field: "type",
      headerName: t("type"),
    },
  ];

  const [columns, setColumns] = useState<GridColumnType[]>(headerColumns);

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
    } else {
      setColumns(headerColumns);
    }
  }, [state]);

  useEffect(() => {
    getRecommendations(filterObject);
    getSanctionType();
    getFiTypes();
  }, [pagingLimit, pagingPage]);

  const getRecommendations = (filter: recommendationFilterType) => {
    setLoading(true);
    const filterJsonFormat = JSON.stringify(filter);
    loadRecommendations(pagingPage, pagingLimit, filterJsonFormat)
      .then((res) => {
        const resData = res.data;
        setRowsLen(resData.totalResults);
        const data: recomendationDataType[] = resData.list.map((item: any) => ({
          ...item,
          type: item.type?.names?.[languageKey],
        }));
        setRows(data);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => setLoading(false));
  };

  const getSanctionType = () => {
    loadSanctionTypes(pagingPage, pagingLimit)
      .then((res) => {
        const sanctionType: { label: string; value: number }[] =
          res.data.list.map((item) => ({
            label: t(item.names?.[languageKey]),
            value: item.id,
          }));
        setSanctionTypeArr(sanctionType);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const getFiTypes = () => {
    loadFiTree()
      .then((res) => {
        setFiData(res.data);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const onPagingLimitChange = (limit: number) => {
    setPagingPage(1);
    setPagingLimit(limit);
  };

  const changeDateFormat = (date: number) => {
    let modifiedDate = getFormattedDateValue(date, getDateFormat(true));
    const parts = modifiedDate.split("/");
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    return formattedDate;
  };

  const filterOnChangeFunction = (obj: any) => {
    let filter: any = {};

    for (let o of obj) {
      if (o.value) {
        if (o.name === "status") {
          filter[o.name] = [o.value];
        } else if (o.name === "fiIds") {
          filter[o.name] = o.value.map((item: any) => item.id);
        } else {
          filter[o.name] = o.value;
        }
      } else if (o.name === "DELIVERY_DATE") {
        if (o.start) {
          filter["deliveryDateFrom"] = changeDateFormat(o.start);
        }
        if (o.end) {
          filter["deliveryDateTo"] = changeDateFormat(o.end);
        }
      } else if (o.name === "EXECUTION_DATE") {
        if (o.start) {
          filter["executionDateFrom"] = changeDateFormat(o.start);
        }
        if (o.end) {
          filter["executionDateTo"] = changeDateFormat(o.end);
        }
      }
    }
    setFilterObject(filter);
    if (obj) {
      getRecommendations(filter);
    }
  };

  return (
    <EmsRecommendationsPage
      columnFilterConfig={columnFilterConfig}
      columns={columns}
      setColumns={setColumns}
      filterOnChangeFunction={filterOnChangeFunction}
      pagingPage={pagingPage}
      setActivePage={setPagingPage}
      initialRowsPerPage={pagingLimit}
      setRowPerPage={onPagingLimitChange}
      rowsLen={rowsLen}
      rows={rows}
      loading={loading}
    />
  );
};

const mapStateToProps = (state: any) => ({
  config: state.get("config").config,
  state: state.getIn(["state", "emsRecommendationsTableCustomization"]),
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmsRecommendationContainer);
