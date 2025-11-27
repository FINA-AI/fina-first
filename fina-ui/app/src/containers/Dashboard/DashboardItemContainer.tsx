import DashboardItemPage from "../../components/Dashboard/DashbordItem/DashboardItemPage";
import {
  deleteDashlet,
  getDashlets,
} from "../../api/services/dashboardService";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { FilterTypes } from "../../util/appUtil";
import { DashletType } from "../../types/dashboard.type";
import { FilterType } from "../../types/common.type";
import { useSnackbar } from "notistack";

const DashboardItemContainer = ({
  onDashletEdit,
}: {
  onDashletEdit(data: DashletType): void;
}) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState<boolean>(true);
  const [pagingPage, setPagingPage] = useState(1);
  const [pagingLimit, setPagingLimit] = useState(25);
  const [totalResults, setTotalResults] = useState(0);
  const [data, setData] = useState<DashletType[]>([]);
  const [filterObject, setFilterObject] = useState({});
  const [sortObject, setSortObject] = useState<{ field: string; dir: string }>({
    field: "code",
    dir: "desc",
  });

  useEffect(() => {
    getPaginatedData();
  }, [pagingPage, pagingLimit, filterObject, sortObject]);

  const getFilterValue = (key: string): string | undefined => {
    return filterObject[key as keyof typeof filterObject];
  };

  const columnFilterConfig = [
    {
      dataIndex: "name",
      type: FilterTypes.string,
      name: "name",
      field: "name",
      value: getFilterValue("name"),
    },
    {
      dataIndex: "code",
      type: FilterTypes.string,
      name: "code",
      field: "code",
      value: getFilterValue("code"),
    },
    {
      dataIndex: "type",
      type: FilterTypes.list,
      name: "type",
      field: "metaInfoJson",
      value: getFilterValue("type"),
      filterArray: [
        { label: t("chart"), value: "CHART" },
        { label: t("table"), value: "TABLE" },
      ],
    },
    {
      dataIndex: "chartType",
      type: FilterTypes.list,
      name: "chartType",
      value: getFilterValue("chartType"),
      field: "chartType",
      filterArray: [
        { label: t("bar"), value: "BARCHART" },
        { label: t("pieChart"), value: "PIECHART" },
        { label: t("column"), value: "COLUMN" },
        { label: t("simpleAreaChart"), value: "SIMPLEAREACHART" },
        { label: t("simpleBarChart"), value: "SIMPLEBARCHART" },
        { label: t("simpleLineChart"), value: "SIMPLELINECHART" },
        { label: t("stackedAreaChart"), value: "STACKEDAREACHART" },
        { label: t("stackedBarChart"), value: "STACKEDBARCHART" },
        { label: t("radar"), value: "RADAR" },
      ],
    },
  ];
  const columns = [
    {
      field: "name",
      headerName: t("name"),
      filter: columnFilterConfig.find((item) => item.field === "name"),
    },

    {
      field: "code",
      headerName: t("code"),
      filter: columnFilterConfig.find((item) => item.field === "code"),
    },
    {
      field: "metaInfoJson",
      headerName: t("type"),
      renderCell: (value: string, row: DashletType) => {
        const obj = JSON.parse(row.metaInfoJson);
        return obj.selectedType;
      },
      hideCopy: true,
      filter: columnFilterConfig.find((item) => item.field === "metaInfoJson"),
    },
    {
      field: "chartType",
      headerName: t("chartType"),
      renderCell: (value: string, row: DashletType) => {
        const obj = JSON.parse(row.metaInfoJson);
        return obj.selectedType === "TABLE" ? "TABLE" : obj.selectedChart || "";
      },
      hideCopy: true,
      filter: columnFilterConfig.find((item) => item.field === "chartType"),
    },
    {
      field: "dataQuery",
      headerName: t("query"),
      hideSort: true,
    },
  ];

  const getPaginatedData = () => {
    setLoading(true);
    getDashlets(
      pagingPage,
      pagingLimit,
      filterObject,
      sortObject.field,
      sortObject.dir
    )
      .then((resp) => {
        if (resp.data.list) {
          setData(resp.data.list);
          setTotalResults(resp.data.totalResults);
        }
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onPagingLimitChange = (limit: number) => {
    setPagingPage(1);
    setPagingLimit(limit);
  };

  const deleteDashletHandler = (
    dashletId: number,
    selectedItem: DashletType,
    sideMenu: { open: boolean; row: null | DashletType },
    setSelectedItem: React.Dispatch<React.SetStateAction<DashletType | null>>
  ) => {
    deleteDashlet(dashletId)
      .then(() => {
        setData(
          data.filter((item: DashletType) => {
            if (selectedItem?.id) {
              return item.id !== selectedItem?.id;
            } else {
              return item.id !== sideMenu.row?.id;
            }
          })
        );
        enqueueSnackbar(t("deleted"), { variant: "success" });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => {
        setSelectedItem(null);
      });
  };

  const filterOnChangeFunction = (obj: FilterType[]) => {
    const filter: Record<string, string> = {};

    for (let o of obj) {
      if (o.value) {
        filter[o.name] = o.value;
      }
    }
    setPagingPage(1);
    setFilterObject(filter);
  };

  const orderRowByHeader = (cellName: string, arrowDirection: string) => {
    let sortField = cellName;

    if (cellName === "metaInfoJson") {
      sortField = "type";
    }
    setSortObject({
      field: sortField,
      dir: arrowDirection === "up" ? "asc" : "desc",
    });
  };

  return (
    <DashboardItemPage
      onDashletEdit={onDashletEdit}
      dashlets={data}
      columnHeaders={columns}
      loading={loading}
      setDashlets={setData}
      deleteDashletHandler={deleteDashletHandler}
      onPagingLimitChange={onPagingLimitChange}
      setPagingPage={setPagingPage}
      totalResults={totalResults}
      pagingPage={pagingPage}
      pagingLimit={pagingLimit}
      filterOnChangeFunction={filterOnChangeFunction}
      orderRowByHeader={orderRowByHeader}
      columnFilterConfig={columnFilterConfig}
    />
  );
};

export default DashboardItemContainer;
