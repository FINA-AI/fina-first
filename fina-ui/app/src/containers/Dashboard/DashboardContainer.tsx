import DashboardMainPage from "../../components/Dashboard/DashboardMainPage";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import {
  createDashboard,
  deleteDashboard,
  getDashboards,
  updateDashboard,
} from "../../api/services/dashboardService";
import { useSnackbar } from "notistack";
import {
  DashboardType,
  DashletType,
  UpdateDashboardType,
} from "../../types/dashboard.type";

export interface DashboardContainerHandles {
  HandleUpdateDashboardDashlet(data: DashletType): void;
}

const DashboardContainer = forwardRef<DashboardContainerHandles, {}>(
  (props, ref) => {
    const { t } = useTranslation();
    const { openErrorWindow } = useErrorWindow();
    const [dashboards, setDashboards] = useState<DashboardType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedDashboard, setSelectedDashboard] = useState<DashboardType>(
      {} as DashboardType
    );
    const { enqueueSnackbar } = useSnackbar();
    const [openDashboardModal, setOpenDashboardModal] = useState<{
      open: boolean;
      editMode: boolean;
    }>({
      open: false,
      editMode: false,
    });
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<number>(0);

    const getDashletConfig = (
      dashletList: DashletType[],
      dashboardConfigJson: { layout: { columns: Array<[number, number]> } }
    ) => {
      let result: { [key: string]: { id: number; list: DashletType[] } } = {};
      if (dashboardConfigJson) {
        dashboardConfigJson.layout.columns.forEach((item, index) => {
          let list: DashletType[] = [];
          for (let dashlet of dashletList) {
            if (item.includes(Number(dashlet.id))) {
              list.push(dashlet);
            }
          }
          list = list.sort(function (a, b) {
            return item.indexOf(a.id) - item.indexOf(b.id);
          });
          result[`Column${index + 1}`] = { id: index + 1, list: list };
        });
      } else {
        result["Column1"] = { id: 1, list: dashletList };
      }
      return result;
    };

    const initFunction = () => {
      getDashboards()
        .then((resp) => {
          let data = resp.data;
          if (data) {
            let result: DashboardType[] = [];
            data.forEach((dashboard: DashboardType) => {
              result.push({
                ...dashboard,
                id: dashboard.id,
                name: dashboard.name,
                dashboardLayout: dashboard.columnSize,
                dashlets: getDashletConfig(
                  dashboard.dashletList,
                  JSON.parse(dashboard.configJson)
                ),
              });
            });
            setDashboards(result);
            setSelectedDashboard(result[0]);
          }
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    useEffect(() => {
      initFunction();
    }, []);

    const onSelectDashboard = (dashboard: DashboardType) => {
      if (dashboard.id !== selectedDashboard?.id)
        setSelectedDashboard(dashboard);
    };

    const deleteDashboardFunction = () => {
      if (selectedDashboard) {
        deleteDashboard(selectedDashboard.id)
          .then(() => {
            enqueueSnackbar(t("deleted"), { variant: "success" });
            let results = dashboards.filter(
              (dashboard: DashboardType) =>
                dashboard.id !== selectedDashboard.id
            );
            setDashboards(results);
            setSelectedDashboard(results[0]);
            setActiveTab(0);
            setDeleteModal(false);
          })
          .catch((err) => {
            openErrorWindow(err, t("error"), true);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    };

    const createDashboardsConfiguration = (data: UpdateDashboardType) => {
      let list: DashletType[] = [];
      let columns: number[][] = [];
      Object.values(data.dashlets).forEach(
        (column: { id: number | string; list: DashletType[] }) => {
          columns.push([
            ...column.list.map((dashlet: DashletType) => dashlet.id),
          ]);
          list = [...list, ...column.list];
        }
      );

      return {
        id: data.id ? data.id : 0,
        name: data.dashboardName,
        columnSize: data.layout.name,
        nameStrId: 0,
        code: data.code,
        dashletList: [...list],
        configJson: JSON.stringify({ layout: { columns: columns } }),
      };
    };

    const onSaveDashboard = (dashboard: UpdateDashboardType) => {
      createDashboard(createDashboardsConfiguration(dashboard))
        .then((resp) => {
          let data = resp.data;
          if (data) {
            let newDashobard = {
              ...dashboard,
              ...data,
              id: data.id,
              name: data.name,
              dashboardLayout: data.columnSize,
            };

            if (!selectedDashboard) {
              setSelectedDashboard(newDashobard);
            }

            setDashboards([...dashboards, newDashobard]);
            enqueueSnackbar(t("saved"), { variant: "success" });
          }
        })
        .catch((error) => {
          openErrorWindow(error, t("error"), true);
        });
    };

    const onEditDashboard = (dashboard: UpdateDashboardType) => {
      updateDashboard(createDashboardsConfiguration(dashboard))
        .then((resp) => {
          let data = resp.data;
          if (data) {
            let newDashobard = {
              ...dashboard,
              ...data,
              id: data.id,
              name: data.name,
              dashboardLayout: data.columnSize,
            };

            if (selectedDashboard?.id === data.id) {
              setSelectedDashboard(newDashobard);
            }

            setDashboards([
              ...dashboards.map((dashboard: DashboardType) => {
                return dashboard.id === data.id ? newDashobard : dashboard;
              }),
            ]);
            enqueueSnackbar(t("saved"), { variant: "success" });
          }
        })
        .catch((error) => {
          openErrorWindow(error, t("error"), true);
        });
    };

    useImperativeHandle(ref, () => ({
      HandleUpdateDashboardDashlet,
    }));

    const HandleUpdateDashboardDashlet = useCallback(
      (data: DashletType) => {
        setSelectedDashboard((prevDashboard) =>
          updateDashboardDashlet(prevDashboard, data)
        );
        setDashboards((prevDashboards) =>
          prevDashboards.map((dashboard) => {
            const containsDashlet = dashboard.dashletList.some(
              (d) => d.id === data.id
            );
            return containsDashlet
              ? updateDashboardDashlet(dashboard, data)
              : dashboard;
          })
        );
      },
      [selectedDashboard, dashboards]
    );

    const updateDashboardDashlet = useCallback(
      (dashboard: DashboardType, updatedDashlet: DashletType) => {
        if (!dashboard?.dashlets) return dashboard;

        const updatedDashletList = dashboard.dashletList.map((dashlet) =>
          dashlet.id === updatedDashlet.id ? updatedDashlet : dashlet
        );

        const updatedDashlets = Object.fromEntries(
          Object.entries(dashboard.dashlets).map(([columnKey, column]) => {
            const updatedList = column.list.map((item) =>
              item.id === updatedDashlet.id ? updatedDashlet : item
            );
            return [columnKey, { ...column, list: updatedList }];
          })
        );

        return {
          ...dashboard,
          dashletList: updatedDashletList,
          dashlets: updatedDashlets,
        };
      },
      [selectedDashboard, dashboards]
    );

    return (
      <DashboardMainPage
        dashboards={dashboards}
        loading={loading}
        selectedDashboard={selectedDashboard}
        onSelectDashboard={onSelectDashboard}
        openDashboardModal={openDashboardModal}
        setOpenDashboardModal={setOpenDashboardModal}
        deleteDashboard={deleteDashboardFunction}
        onSaveDashboard={onSaveDashboard}
        onEditDashboard={onEditDashboard}
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    );
  }
);

export default DashboardContainer;
