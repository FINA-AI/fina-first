import CEMSPage from "../../components/CEMS/CEMSPage";
import {
  deleteInspection,
  loadInspections,
  saveInspection,
} from "../../api/services/CEMSInspectionsService";
import React, { useEffect, useState } from "react";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import useConfig from "../../hoc/config/useConfig";
import {
  BASE_REST_URL,
  FilterTypes,
  getFormattedDateValue,
} from "../../util/appUtil";
import InspectionStatusCell from "../../components/CEMS/InspectionStatusCell";
import { useHistory } from "react-router-dom";
import FIFilter from "../../components/common/Filter/FIFilter";
import { loadFiTree } from "../../api/services/fi/fiService";
import UsersFilter from "../../components/common/Filter/UsersFilter";
import { loadUsersAndGroups } from "../../api/services/userManagerService";
import { Box } from "@mui/system";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import PreviewIcon from "@mui/icons-material/Preview";
import { Typography } from "@mui/material";
import { CEMSStatusList } from "../../components/CEMS/CEMSConstants";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { CEMS_BASE_PATH } from "../../components/CEMS/CEMSRouter";
import { useTheme } from "@mui/material/styles";

const CEMSInspectionContainer = ({ state }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { openErrorWindow } = useErrorWindow();
  const { enqueueSnackbar } = useSnackbar();
  const { getDateFormat } = useConfig();
  const [fiData, setFIData] = useState();
  const [fiLoading, setFILoading] = useState(true);
  const [usersData, setUsersData] = useState();
  const [usersLoading, setUsersLoading] = useState(true);
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagingPage, setPagingPage] = useState(1);
  const [pagingLimit, setPagingLimit] = useState(25);
  const [totalResults, setTotalResults] = useState(0);
  const [gridFilter, setGridFilter] = useState({});
  const theme = useTheme();

  const columnFilterConfig = [
    {
      field: "fi",
      type: FilterTypes.fis,
      name: "fiIds",
      renderFilter: (columnsFilter, onFilterClick, onClear) => {
        let data = loadFI();
        return (
          <FIFilter
            label={t("nameOfBank")}
            onClickFunction={onFilterClick}
            defaultValue={
              columnsFilter.find((el) => el.name === "fiIds")?.value
            }
            closeFilter={onClear}
            data={data}
            loading={fiLoading}
          />
        );
      },
    },
    {
      type: FilterTypes.users,
      name: "managerIds",
      field: "manager",
      renderFilter: (columnsFilter, onFilterClick, onClear) => {
        loadUsersAndGroupFunction();
        return (
          <UsersFilter
            label={t("headOfInspection")}
            onClickFunction={onFilterClick}
            defaultValue={
              columnsFilter.find((el) => el.name === "managerIds")?.value
            }
            closeFilter={onClear}
            data={usersData ? [...usersData] : []}
            loading={usersLoading}
          />
        );
      },
    },
    {
      type: FilterTypes.list,
      name: "type",
      field: "type",
      value: "",
      filterArray: [
        { label: t("COMPLEX_CHECK"), value: "COMPLEX_CHECK" },
        { label: t("TARGETED_VERIFICATION"), value: "TARGETED_VERIFICATION" },
        { label: t("TOPIC_CHECK"), value: "TOPIC_CHECK" },
      ],
    },
    {
      type: FilterTypes.datePicker,
      name: "startDate",
      field: "startDate",
    },
    {
      type: FilterTypes.datePicker,
      name: "endDate",
      field: "endDate",
    },
    {
      type: FilterTypes.list,
      name: "phase",
      field: "phase",
      value: "",
      filterArray: [
        {
          label: t("phase") + " 1",
          value: "1",
        },
        {
          label: t("phase") + " 2",
          value: "2",
        },
      ],
    },
    {
      type: FilterTypes.list,
      name: "recommendationStatuses",
      field: "recommendationList",
      value: "",
      filterArray: CEMSStatusList(),
    },
    {
      type: FilterTypes.list,
      name: "decisionStatuses",
      field: "decisions",
      value: "",
      filterArray: CEMSStatusList(),
    },
    {
      type: FilterTypes.list,
      name: "sanctionStatuses",
      field: "sanctionsStatuses",
      value: "",
      filterArray: CEMSStatusList(),
    },
  ];

  const getColumnsData = () => [
    {
      field: "fi",
      headerName: t("nameOfBank"),
      minWidth: 140,
      renderCell: (value) => {
        return <span>{t(value?.name)}</span>;
      },
    },
    {
      field: "id",
      headerName: t("code"),
      fixed: false,
      minWidth: 80,
    },
    {
      field: "manager",
      headerName: t("headOfInspection"),
      fixed: false,
      minWidth: 145,
      renderCell: (value) => {
        return <span>{t(value?.description)}</span>;
      },
    },
    {
      field: "type",
      headerName: t("typeOfInspection"),
      fixed: false,
      minWidth: 150,
      renderCell: (value) => {
        return <span>{t(value)}</span>;
      },
    },
    {
      field: "startDate",
      headerName: t("startDate"),
      fixed: false,
      minWidth: 90,
      hideCopy: true,
      renderCell: (value) => {
        return <span>{getFormattedDateValue(value, getDateFormat(true))}</span>;
      },
    },
    {
      field: "endDate",
      headerName: t("endDate"),
      fixed: false,
      minWidth: 90,
      hideCopy: true,
      renderCell: (value) => {
        return <span>{getFormattedDateValue(value, getDateFormat(true))}</span>;
      },
    },
    {
      field: "phase",
      headerName: t("phase"),
      fixed: false,
      minWidth: 140,
      hideCopy: true,
      renderCell: (phase) => {
        const style = {
          color: phase === 1 ? "#8695B1" : "#84628B",
          marginRight: 5,
          fontSize: 20,
        };
        return (
          <Box
            display={"flex"}
            flexDirection={"row"}
            style={{
              backgroundColor:
                theme.palette.mode === "dark" ? "#344258" : "#EAEBF0",
              paddingLeft: 12,
              paddingRight: 12,
              paddingTop: 4,
              paddingBottom: 4,
              border: theme.palette.borderColor,
            }}
          >
            {phase === 1 ? (
              <AvTimerIcon style={style} />
            ) : (
              <PreviewIcon style={style} />
            )}
            <Typography
              style={{
                color:
                  theme.palette.mode === "light"
                    ? phase === 1
                      ? "#8695B1"
                      : "#84628B"
                    : phase === 1
                    ? "#FFF"
                    : "#84628B",
                fontWeight: 500,
                fontSize: 12,
              }}
            >
              {t("phase") + " " + phase}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "recommendationList",
      headerName: t("emsRecommendation"),
      fixed: false,
      minWidth: 140,
      hideCopy: true,
      hideSort: true,
      renderCell: (value) => {
        return <InspectionStatusCell type={"recommendation"} list={value} />;
      },
    },
    {
      field: "decisions",
      headerName: t("order"),
      fixed: false,
      minWidth: 140,
      hideCopy: true,
      hideSort: true,
      renderCell: (value) => {
        return <InspectionStatusCell type={"order"} list={value} />;
      },
    },
    {
      field: "sanctionsStatuses",
      headerName: t("sanction"),
      fixed: false,
      minWidth: 140,
      hideCopy: true,
      hideSort: true,
      renderCell: (value) => {
        return <InspectionStatusCell type={"sanction"} list={value} />;
      },
    },
  ];

  const [columns, setColumns] = useState(getColumnsData());

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
    setColumns(getColumnsData());
  }, [theme.palette.mode]);

  useEffect(() => {
    loadData();
  }, [pagingPage, pagingLimit, gridFilter]);

  const loadFI = () => {
    let data = fiData;
    if (!fiData) {
      setFILoading(true);
      loadFiTree()
        .then((res) => {
          setFIData(res.data);
          data = res.data;
          setFILoading(false);
        })
        .catch((error) => enqueueSnackbar(error), { variant: "error" });
    }
    return data;
  };

  const loadUsersAndGroupFunction = () => {
    let data = usersData;
    if (!usersData) {
      setUsersLoading(true);
      loadUsersAndGroups()
        .then((res) => {
          setUsersData(res.data);
          data = res.data;
          setUsersLoading(false);
        })
        .catch((error) => enqueueSnackbar(error), { variant: "error" });
    }

    return data;
  };

  const loadData = (customFilter) => {
    setLoading(true);
    let filter = { ...gridFilter, ...customFilter };
    loadInspections(pagingPage, pagingLimit, filter)
      .then((resp) => {
        setInspections(resp.data.list);
        setTotalResults(resp.data.totalResults);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onSaveClickFunction = (inspection) => {
    saveInspection(inspection)
      .then(() => {
        enqueueSnackbar(t("saved"), {
          variant: "success",
        });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const onDeleteFunction = (inspectionIds) => {
    deleteInspection(inspectionIds)
      .then(() => {
        if (inspectionIds.length > 1)
          setInspections(
            inspections.filter((row) => !inspectionIds.includes(row.id))
          );
        else
          setInspections(
            inspections.filter((row) => row.id !== inspectionIds[0])
          );

        enqueueSnackbar(t("deleted"), {
          variant: "success",
        });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const onPagingLimitChange = (limit) => {
    setPagingPage(1);
    setPagingLimit(limit);
  };

  const onFilterClickFunc = (customFilter) => {
    loadData(customFilter);
  };

  const filterOnChangeFunction = (obj) => {
    let filter = {};

    for (let o of obj) {
      switch (o.type) {
        case FilterTypes.list:
          if (o.value) {
            if (o.name === "type") filter[o.name] = o.value;
            else filter[o.name] = [o.value];
          }
          break;
        case FilterTypes.datePicker:
          if (o.date) {
            filter[o.name] = o.date;
          }
          break;
        case FilterTypes.users:
          if (o.value?.length !== 0)
            filter[o.name] = o.value?.map((item) => item.id);
          break;
        case FilterTypes.fis:
          if (o.value?.length !== 0)
            filter[o.name] = o.value?.map((item) => item.id);
          break;
      }
    }
    if (
      Object.keys(filter).length === 0 &&
      Object.keys(gridFilter).length === 0
    )
      return;
    setGridFilter(filter);
  };

  const orderRowByHeader = (cellName, arrowDirection) => {
    if (
      cellName === "recommendationList" ||
      cellName === "decisions" ||
      cellName === "sanctionsStatuses"
    )
      return;
    let fieldName = cellName === "code" ? "id" : cellName;
    let sortDirection = arrowDirection === "up" ? "asc" : "desc";
    setGridFilter({
      ...gridFilter,
      sortField: fieldName,
      sortDirection: sortDirection,
    });
  };

  const onExport = (selectedRows) => {
    let filters = { ...gridFilter };
    if (selectedRows && selectedRows.length > 0) {
      filters = {
        ...gridFilter,
        inspectionIds: selectedRows.map((row) => row.id),
      };
    }
    let url = "/cems/export/inspections?";
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

  const addNewFunction = () => {
    history.push(`/${CEMS_BASE_PATH}/inspection/0`);
  };

  return (
    <CEMSPage
      inspections={inspections}
      setInspections={setInspections}
      onSaveClickFunction={onSaveClickFunction}
      onDeleteFunction={onDeleteFunction}
      loading={loading}
      columns={columns}
      setColumns={setColumns}
      columnFilterConfig={columnFilterConfig}
      totalResults={totalResults}
      pagingPage={pagingPage}
      pagingLimit={pagingLimit}
      setPagingPage={setPagingPage}
      onPagingLimitChange={onPagingLimitChange}
      filterOnChangeFunction={filterOnChangeFunction}
      orderRowByHeader={orderRowByHeader}
      onExport={onExport}
      addNewFunction={addNewFunction}
      onFilterClickFunc={onFilterClickFunc}
    />
  );
};
const mapStateToProps = (state) => ({
  state: state.getIn(["state", "cemsInspectionTableCustomization"]),
});

CEMSInspectionContainer.propTypes = {
  state: PropTypes.array,
  setState: PropTypes.func,
};
export default connect(mapStateToProps, {})(CEMSInspectionContainer);
