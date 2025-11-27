import { useTranslation } from "react-i18next";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { useSnackbar } from "notistack";
import useConfig from "../../hoc/config/useConfig";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  BASE_REST_URL,
  FilterTypes,
  getFormattedDateValue,
} from "../../util/appUtil";
import { CEMSStatusList } from "../../components/CEMS/CEMSConstants";
import CustomCEMSStatusCell from "../../components/CEMS/CEMSRecommendation/CustomCEMSStatusCell";
import {
  deleteSanctions,
  loadSanctions,
} from "../../api/services/CEMSSanctionService";
import CEMSSanctionPage from "../../components/CEMS/Sanction/CEMSSanctionPage";
import { loadInspection } from "../../api/services/CEMSInspectionsService";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const CEMSSanctionContainer = ({ state }) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const { enqueueSnackbar } = useSnackbar();
  const { getDateFormat } = useConfig();
  let { inspectionId } = useParams();

  const columnFilterConfig = [
    {
      field: "actionDate",
      type: FilterTypes.date,
      name: "actionDate",
    },
    {
      field: "executionPeriod",
      type: FilterTypes.date,
      name: "executionPeriod",
    },
    {
      field: "validityPeriodFrom",
      type: FilterTypes.date,
      name: "validityPeriod",
    },
    {
      field: "initialCourtAppealDate",
      type: FilterTypes.date,
      name: "initialCourtAppealDate",
    },
    {
      field: "finalCourtAppealDate",
      type: FilterTypes.date,
      name: "finalCourtAppealDate",
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
      field: "subjectLegalName",
      headerName: t("subjectLegalName"),
    },
    {
      field: "subjectID",
      headerName: t("subjectID"),
      hidden: true,
    },
    {
      field: "licenseNumber",
      headerName: t("licenseNumber"),
      hidden: true,
    },
    {
      field: "registrationLetterNumber",
      headerName: t("registrationLetterNumber"),
      hidden: true,
    },
    {
      field: "decisionMakingBodyCatalog",
      headerName: t("decisionMakingBodyCatalog"),
      hidden: true,
      renderCell: (obj) => {
        return obj ? obj.value : "";
      },
    },
    {
      field: "documentNumber",
      headerName: t("documentNumber"),
      hidden: true,
    },
    {
      field: "actionDate",
      headerName: t("actionDate"),
      minWidth: 140,
      hideCopy: true,
      renderCell: (value) => {
        return <span>{getFormattedDateValue(value, getDateFormat(true))}</span>;
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
      field: "validityPeriodFrom",
      headerName: t("validityPeriod"),
      minWidth: 140,
      hideCopy: true,
      renderCell: (value) => {
        return <span>{getFormattedDateValue(value, getDateFormat(true))}</span>;
      },
    },
    {
      field: "initialCourtAppealDate",
      headerName: t("initialCourtAppealDate"),
      minWidth: 140,
      hideCopy: true,
      hidden: true,
      renderCell: (value) => {
        return <span>{getFormattedDateValue(value, getDateFormat(true))}</span>;
      },
    },
    {
      field: "finalCourtAppealDate",
      headerName: t("finalCourtAppealDate"),
      minWidth: 140,
      hideCopy: true,
      hidden: true,
      renderCell: (value) => {
        return <span>{getFormattedDateValue(value, getDateFormat(true))}</span>;
      },
    },
    {
      field: "status",
      headerName: t("status"),
      hideCopy: true,
      renderCell: (value) => {
        return <CustomCEMSStatusCell val={value.key} />;
      },
    },
  ];

  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [inspection, setInspection] = useState();
  const [columns, setColumns] = useState(columnsData);
  const [filter, setFilter] = useState({
    page: 1,
    limit: 25,
    sortField: "id",
    sortDirection: "desc",
  });

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
    initSanctions();
    loadInspectionData();
  }, [filter]);

  const loadInspectionData = () => {
    loadInspection(inspectionId)
      .then((res) => {
        const data = res.data;
        setInspection({ ...data });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const onPagingLimitChange = (limit) => {
    setFilter({ ...filter, page: 1, limit: limit });
  };

  const orderRowByHeader = (cellName, arrowDirection) => {
    let sortDir = arrowDirection === "down" ? "desc" : "asc";
    cellName !== "id" &&
      setFilter({ ...filter, sortField: cellName, sortDirection: sortDir });
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
            gridFilter[o.name + "From"] = o.start;
          } else delete originalFilter[o.name + "From"];
          if (o.end) {
            gridFilter[o.name + "To"] = o.end;
          } else delete originalFilter[o.name + "To"];
          break;
      }
    }

    setFilter({ ...originalFilter, ...gridFilter });
  };

  const onExport = (selectedRows) => {
    let url = "/cems/export/sanctions?";
    let params;
    if (selectedRows && selectedRows.length > 0) {
      params = { sanctionIds: selectedRows.map((r) => r.id) };
    } else {
      params = { ...filter, inspectionId };
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

  const initSanctions = () => {
    setLoading(true);
    loadSanctions(inspectionId, filter)
      .then((res) => {
        const data = res.data;
        setData(data.list);
        setTotalResults(res.data.totalResults);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => setLoading(false));
  };

  const deleteSanctionData = (ids) => {
    deleteSanctions(ids)
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
    <CEMSSanctionPage
      loading={loading}
      columns={columns}
      columnFilterConfig={columnFilterConfig}
      data={data}
      totalResults={totalResults}
      onPagingLimitChange={onPagingLimitChange}
      deleteHandler={deleteSanctionData}
      filterOnChangeFunction={gridFilterChangeHandler}
      setFilter={setFilter}
      filter={filter}
      onExport={onExport}
      orderRowByHeader={orderRowByHeader}
      inspection={inspection}
      setColumns={setColumns}
    />
  );
};

const mapStateToProps = (state) => ({
  state: state.getIn(["state", "cemsSanctionsTableCustomization"]),
});

CEMSSanctionContainer.propTypes = {
  state: PropTypes.array,
  setState: PropTypes.func,
};
export default connect(mapStateToProps, {})(CEMSSanctionContainer);
