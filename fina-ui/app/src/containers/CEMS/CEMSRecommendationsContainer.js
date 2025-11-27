import React, { useEffect, useState } from "react";
import CEMSRecommendationsPage from "../../components/CEMS/CEMSRecommendation/CEMSRecommendationsPage";
import {
  deleteCEMSRecommendations,
  loadCEMSRecommendations,
} from "../../api/services/CEMSRecommendationsService";
import { useTranslation } from "react-i18next";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { useSnackbar } from "notistack";
import useConfig from "../../hoc/config/useConfig";
import TourRoundedIcon from "@mui/icons-material/TourRounded";
import { Box } from "@mui/material";
import {
  BASE_REST_URL,
  FilterTypes,
  getFormattedDateValue,
} from "../../util/appUtil";
import CustomCEMSStatusCell from "../../components/CEMS/CEMSRecommendation/CustomCEMSStatusCell";
import { useParams } from "react-router-dom";
import { loadInspection } from "../../api/services/CEMSInspectionsService";
import { CEMSStatusList } from "../../components/CEMS/CEMSConstants";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const CEMSRecommendationsContainer = ({ state }) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const { enqueueSnackbar } = useSnackbar();
  const { getDateFormat } = useConfig();
  let { inspectionId } = useParams();
  const columnFilterConfig = [
    {
      field: "executionPeriod",
      type: FilterTypes.date,
      name: "Date",
    },
    {
      field: "status",
      type: FilterTypes.list,
      name: "status",
      value: "",
      filterArray: CEMSStatusList(),
    },
  ];

  const columnsData = [
    {
      field: "id",
      headerName: t("code"),
      minWidth: 140,
      renderCell: (value, row) => {
        return (
          <Box display={"flex"} alignItems={"center"}>
            <TourRoundedIcon
              fontSize={"small"}
              style={{
                color: row.type === "RECOMMENDATION" ? "#289E20" : "#FF8D00",
                marginRight: 5,
              }}
            />
            <span>{value}</span>
          </Box>
        );
      },
    },
    {
      field: "executionPeriod",
      headerName: t("executionPeriod"),
      minWidth: 140,
      hideCopy: true,
      renderCell: (value) => {
        return <span>{getFormattedDateValue(value, getDateFormat(true))}</span>;
      },
    },
    {
      field: "fiResponsiblePersons",
      headerName: t("responsiblePerson"),
      renderCell: (value, row) => {
        return row.fiResponsiblePersons[0]?.fullName;
      },
    },
    {
      field: "number",
      headerName: t("number"),
    },
    {
      field: "status",
      headerName: t("status"),
      hideCopy: true,
      renderCell: (value) => {
        return <CustomCEMSStatusCell val={value} />;
      },
    },
  ];
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [filter, setFilter] = useState({
    page: 1,
    limit: 25,
    sortField: "recordCreateDate",
    sortDirection: "desc",
  });
  const [inspection, setInspection] = useState();
  const [columns, setColumns] = useState(columnsData);

  useEffect(() => {
    setColumns(columnsData);
  }, [t]);

  useEffect(() => {
    if (state !== undefined && state.columns.length !== 0) {
      let newCols = [];
      for (let item of state.columns) {
        let headerCell = columns.find((el) => item.field === el.field);
        headerCell.hidden = item.hidden;
        headerCell.fixed = item.fixed;
        newCols.push(headerCell);
      }
      setColumns(newCols);
    }
  }, [state]);

  useEffect(() => {
    initRecommendations();
  }, [filter]);

  const onPagingLimitChange = (limit) => {
    setFilter({ ...filter, page: 1, limit: limit });
  };

  const orderRowByHeader = (cellName, arrowDirection) => {
    let sortDir = arrowDirection === "down" ? "desc" : "asc";
    cellName !== "fiResponsiblePersons" &&
      setFilter({ ...filter, sortField: cellName, sortDirection: sortDir });
  };

  const initInspection = () => {
    loadInspection(inspectionId)
      .then((res) => {
        const data = res.data;
        setInspection({ ...data });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const gridFilterChangeHandler = (obj) => {
    let gridFilter = {};
    let originalFilter = { ...filter };

    for (let o of obj) {
      switch (o.type) {
        case FilterTypes.list:
          if (o.value) gridFilter[o.name] = o.value;
          else delete originalFilter[o.name];
          break;
        case FilterTypes.date:
          if (o.start) {
            gridFilter["from" + o.name] = o.start;
          } else delete originalFilter["from" + o.name];
          if (o.end) {
            gridFilter["to" + o.name] = o.end;
          } else delete originalFilter["to" + o.name];
          break;
      }
    }

    setFilter({ ...originalFilter, ...gridFilter });
  };

  const onExport = (selectedRows) => {
    let url = "/cems/export/recommendations?";
    let params;
    if (selectedRows && selectedRows.length > 0) {
      params = { recommendationIds: selectedRows.map((r) => r.id) };
    }

    if (Object.keys(params).length !== 0) {
      for (const property in params) {
        if (Array.isArray(params[property])) {
          let queryParam =
            property + "=" + params[property].join("&" + property + "=");
          url += queryParam;
        } else {
          url += `${property}=${params[property]}`;
        }
        url += "&";
      }
    }
    window.open(BASE_REST_URL + url, "_blank");
  };

  const initRecommendations = () => {
    setLoading(true);
    loadCEMSRecommendations(inspectionId, filter)
      .then((res) => {
        const data = res.data;
        setData(data.list);
        setTotalResults(res.data.totalResults);
        initInspection();
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => setLoading(false));
  };

  const deleteRecommendationHandler = (ids) => {
    deleteCEMSRecommendations(ids)
      .then(() => {
        if (ids.length > 1) {
          setData(data.filter((row) => !ids.includes(row.id)));
        } else {
          setData(data.filter((row) => row.id !== ids[0]));
        }
        enqueueSnackbar(t("deleted"), {
          variant: "success",
        });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => setLoading(false));
  };

  return (
    <CEMSRecommendationsPage
      loading={loading}
      columns={columns}
      columnFilterConfig={columnFilterConfig}
      setColumns={setColumns}
      data={data}
      totalResults={totalResults}
      onPagingLimitChange={onPagingLimitChange}
      deleteRecommendationHandler={deleteRecommendationHandler}
      filterOnChangeFunction={gridFilterChangeHandler}
      setFilter={setFilter}
      filter={filter}
      inspection={inspection}
      onExport={onExport}
      orderRowByHeader={orderRowByHeader}
    />
  );
};

const mapStateToProps = (state) => ({
  state: state.getIn(["state", "cemsRecommendationTableCustomization"]),
});

CEMSRecommendationsContainer.propTypes = {
  state: PropTypes.array,
  setState: PropTypes.func,
};
export default connect(mapStateToProps, {})(CEMSRecommendationsContainer);
