import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ImportManagerCustomCell from "../../components/ImportManager/ImportManagerCustomCell";
import useConfig from "../../hoc/config/useConfig";
import {
  BASE_REST_URL,
  FilterTypes,
  getFormattedDateValue,
} from "../../util/appUtil";
import {
  loadImportedReturns,
  loadImportManagerData,
} from "../../api/services/importManagerService";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import ImportManagerMainPage from "../../components/ImportManager/ImportManager/ImportManagerMainPage";
import FIFilter from "../../components/common/Filter/FIFilter";
import { loadFiTree } from "../../api/services/fi/fiService";
import { getVersions } from "../../api/services/versionsService";
import ImportManagerUsersFilter from "../../components/ImportManager/ImportManager/ImportManagerUsersFilter";
import {
  columnFilterConfigType,
  GridColumnType,
  UIEventType,
} from "../../types/common.type";
import {
  ImportedReturn,
  ImportManagerFilter,
  ReturnVersion,
  UploadFile,
} from "../../types/importManager.type";

const ImportManagerContainer = () => {
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();
  const { openErrorWindow } = useErrorWindow();
  const [pagingPage, setPagingPage] = useState(1);
  const [pagingLimit, setPagingLimit] = useState(25);
  const [loading, setLoading] = useState(true);
  const [importManagerData, setImportManagerData] = useState<UploadFile[]>([]);
  const [list, setList] = useState<ImportedReturn[]>([]);
  const [loadingMask, setLoadingMask] = useState(false);
  const [fiData, setFIData] = useState();
  const [fiLoading, setFILoading] = useState(true);
  const [returnVersions, setReturnVersions] = useState<ReturnVersion[]>([]);
  const [columns, setColumns] = useState<GridColumnType[]>([]);

  const [filterData, setFilterData] = useState<ImportManagerFilter>(
    {} as ImportManagerFilter
  );

  const columnFilterConfig = [
    {
      field: "periodStart",
      type: FilterTypes.datePicker,
      name: "periodStart",
    },
    {
      field: "periodEnd",
      type: FilterTypes.datePicker,
      name: "periodEnd",
    },
    {
      field: "bankCode",
      type: FilterTypes.fis,
      name: "fiCodes",
      renderFilter: (
        columnsFilter: columnFilterConfigType[],
        onFilterClick: () => void,
        onClear: () => void
      ) => {
        let data = loadFI();
        return (
          <FIFilter
            label={t("nameOfBank")}
            onClickFunction={onFilterClick}
            defaultValue={
              columnsFilter.find((el) => el.name === "fiCodes")?.value
            }
            closeFilter={onClear}
            data={data}
            loading={fiLoading}
          />
        );
      },
    },
    {
      field: "versionCode",
      type: FilterTypes.list,
      name: "versionCode",
      filterArray: returnVersions.map((item) => ({
        label: item.code,
        value: item.code,
      })),
    },
    {
      field: "userCode",
      type: FilterTypes.users,
      name: "userCode",
      renderFilter: (
        columnsFilter: columnFilterConfigType[],
        onFilterClick: (userInfo: {
          login: string;
          description: string;
        }) => void,
        onClear: () => {}
      ) => {
        return (
          <ImportManagerUsersFilter
            selectedUser={filterData.user}
            onClickFunction={onFilterClick}
            closeFilter={onClear}
          />
        );
      },
    },
  ];

  const columnsHeader = [
    {
      field: "fileName",
      headerName: t("name"),
      renderCell: (value: string, row: UploadFile) => {
        return (
          <Box display={"flex"} alignItems={"center"}>
            <ImportManagerCustomCell row={row} />
            <Link
              component="button"
              display={"flex"}
              onClick={(event) =>
                downloadImportManagerFilebyId(row.fileId, event)
              }
            >
              {value}
            </Link>
          </Box>
        );
      },
    },
    {
      field: "periodStart",
      headerName: t("startPeriod"),
      renderCell: (value: string) =>
        getFormattedDateValue(value, getDateFormat(true)),
    },
    {
      field: "periodEnd",
      headerName: t("endPeriod"),
      renderCell: (value: number) =>
        getFormattedDateValue(value, getDateFormat(true)),
    },
    {
      field: "bankCode",
      headerName: t("fiCode"),
    },
    {
      field: "versionCode",
      headerName: t("returnVersion"),
    },
    {
      field: "userCode",
      headerName: t("userId"),
    },
  ];

  useEffect(() => {
    init();
  }, [pagingPage, pagingLimit, filterData]);

  useEffect(() => {
    setColumns(columnsHeader);
    loadReturnVersionData();
  }, []);

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
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
          setFILoading(false);
        });
    }
    return data;
  };

  const init = () => {
    setLoading(true);
    loadImportManagerData(pagingPage, pagingLimit, filterData)
      .then((res) => {
        setImportManagerData(res.data.list);
        setLoading(false);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
        setLoading(false);
      });
  };

  const loadReturnVersionData = () => {
    getVersions().then((resp) => {
      setReturnVersions(resp.data);
    });
  };

  const filterOnChangeFunction = (filteredData: any) => {
    let filter: any = {};
    for (let item of filteredData) {
      switch (item.type) {
        case FilterTypes.list:
          if (item.value) {
            filter[item.name] = item.value;
          }
          break;
        case FilterTypes.fis:
          if (item.value && item.value.length > 0) {
            filter[item.name] = item.value.map((item: any) => item.code);
          }
          break;
        case FilterTypes.datePicker:
          if (item.date) {
            filter[item.name] = item.date;
          }
          break;
        case FilterTypes.string:
          filter[item.name] = item.value;
          break;
        case FilterTypes.users:
          const user = item.value;
          filter.user = {};
          if (user) {
            for (const key in user) {
              filter.user[key] = user[key];
            }
            filter[item.name] = item.value?.login;
          }
          break;
        default: {
          filter[item.name] = item.value;
        }
      }
    }
    setFilterData(filter);
    setPagingPage(1);
  };

  const initImportManagerFile = (row: UploadFile) => {
    if (row?.fileId) {
      loadImportedReturns(row.fileId)
        .then((res) => {
          setList(res.data);
          setLoadingMask(false);
        })
        .catch((error) => openErrorWindow(error, t("error"), true));
    }
  };

  const onPagingLimitChange = (limit: number) => {
    setPagingPage(1);
    setPagingLimit(limit);
  };

  const downloadImportManagerFilebyId = (id: number, event: UIEventType) => {
    event.stopPropagation();
    window.open(BASE_REST_URL + `/importmanager/file/download/${id}`, "_blank");
  };

  return (
    <ImportManagerMainPage
      data={importManagerData}
      columns={columns}
      initImportManagerFile={initImportManagerFile}
      list={list}
      pagingPage={pagingPage}
      loadingMask={loadingMask}
      loading={loading}
      setData={setImportManagerData}
      setLoadingMask={setLoadingMask}
      onPagingLimitChange={onPagingLimitChange}
      setPagingPage={setPagingPage}
      columnFilterConfig={columnFilterConfig}
      filterOnChangeFunction={filterOnChangeFunction}
    />
  );
};

export default ImportManagerContainer;
