import ReturnCreationSchedulePage from "../../components/ReturnCreationSchedule/ReturnCreationSchedulePage";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  changeRCSPagingLimitAction,
  changeRCSPagingPageAction,
} from "../../redux/actions/returnCreationScheduleActions";
import { getVersions } from "../../api/services/versionsService";
import {
  deleteReturnCreationSchedule,
  loadReturnCreationSchedules,
  runReturnSchedule,
  saveReturnCreationSchedule,
} from "../../api/services/returnCreationScheduleService";
import RCSModalStatusCell from "../../components/ReturnCreationSchedule/RCSModalStatusCell";
import { getFormattedDateValue } from "../../util/appUtil";
import useConfig from "../../hoc/config/useConfig";
import { useSnackbar } from "notistack";
import { ReturnSchedule } from "../../types/returnCreationSchedule.type";
import { ReturnVersion } from "../../types/importManager.type";

interface Props {
  pagingPage: number;
  setPagingPage: (page: number) => void;
  pagingLimit: number;
  setPagingLimit: (pageLimit: number) => void;
}

export type DeleteModal = {
  row: ReturnSchedule;
  isOpen: boolean;
} | null;

export type AddModal = {
  isOpen: boolean;
  data: ReturnSchedule | null;
  row?: ReturnSchedule;
} | null;

const ReturnCreationScheduleContainer: React.FC<Props> = ({
  pagingPage,
  setPagingPage,
  pagingLimit,
  setPagingLimit,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { openErrorWindow } = useErrorWindow();
  const { getDateFormat } = useConfig();
  const { config }: any = useConfig();
  const [totalResults, setTotalResults] = useState(0);
  const [data, setData] = useState<ReturnSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<DeleteModal>(null);
  const [addModal, setAddModal] = useState<AddModal>(null);
  const [returnVersions, setReturnVersions] = useState<ReturnVersion[]>([]);

  const columnsHeader = [
    {
      field: "taskName",
      headerName: t("taskName"),
      minWidth: 200,
    },
    {
      field: "scheduleTime",
      headerName: t("scheduleTime"),
      minWidth: 200,
      hideCopy: true,
      renderCell: (value: number) =>
        getFormattedDateValue(value, getDateFormat(false)),
    },
    {
      field: "userName",
      headerName: t("user"),
      minWidth: 200,
      hideSort: true,
    },
    {
      field: "message",
      headerName: t("message"),
      minWidth: 200,
    },
    {
      field: "status",
      headerName: t("status"),
      minWidth: 200,
      hideCopy: true,
      renderCell: (val: string) => {
        return <RCSModalStatusCell value={val} />;
      },
    },
  ];
  const [columns, setColumns] = useState(columnsHeader);
  const [sortInfo, setSortInfo] = useState({
    sortField: "id",
    sortDir: "desc",
  });
  useEffect(() => {
    initReturnTypes();
    setColumns(columnsHeader);
  }, []);

  useEffect(() => {
    loadData();
  }, [pagingPage, pagingLimit, sortInfo]);

  const initReturnTypes = () => {
    getVersions()
      .then((res) => {
        setReturnVersions(res.data);
      })
      .catch((e) => {
        openErrorWindow(e, t("error"), true);
      });
  };

  const loadData = () => {
    setLoading(true);
    loadReturnCreationSchedules(pagingPage, pagingLimit, null, sortInfo)
      .then((res) => {
        setLoading(true);
        const data = res.data.list;
        setData(data);
        setTotalResults(res.data.totalResults);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => setLoading(false));
  };

  const onSort = (sortField: string, arrowDirection: string) => {
    let sortDir = arrowDirection === "down" ? "desc" : "asc";
    setSortInfo({ sortField, sortDir });
  };

  const onRowDeleteFunction = () => {
    if (deleteModal) {
      deleteReturnCreationSchedule([deleteModal.row.id])
        .then(() => {
          setData([...data.filter((row) => row.id !== deleteModal.row.id)]);
          enqueueSnackbar(t("deleted"), { variant: "success" });
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
        });
      setDeleteModal(null);
    }
  };

  const onPagingLimitChange = (limit: number) => {
    setPagingPage(1);
    setPagingLimit(limit);
  };

  const saveFunction = (info: ReturnSchedule) => {
    saveReturnCreationSchedule(info)
      .then((res) => {
        let newArr = [{ ...res.data, userName: config.userName }, ...data];
        setData(newArr);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => setAddModal(null));
  };

  const runFunction = (report: ReturnSchedule) => {
    runReturnSchedule([report.id])
      .then(() => {
        enqueueSnackbar(t("taskprocessed"), { variant: "success" });
      })
      .catch((error) => enqueueSnackbar(error, { variant: "error" }));
  };

  return (
    <ReturnCreationSchedulePage
      columns={columns}
      onPagingLimitChange={onPagingLimitChange}
      setPagingPage={setPagingPage}
      pagingPage={pagingPage}
      pagingLimit={pagingLimit}
      totalResults={totalResults}
      data={data}
      setData={setData}
      loading={loading}
      loadData={loadData}
      deleteModal={deleteModal}
      setDeleteModal={setDeleteModal}
      onRowDeleteFunction={onRowDeleteFunction}
      addModal={addModal}
      setAddModal={setAddModal}
      returnVersions={returnVersions}
      saveFunction={saveFunction}
      runFunction={runFunction}
      onSort={onSort}
    />
  );
};

const mapStateToProps = (state: any) => ({
  pagingPage: state.get("returnCreationSchedule").pagingPage,
  pagingLimit: state.get("returnCreationSchedule").pagingLimit,
});

const dispatchToProps = (dispatch: any) => ({
  setPagingPage: bindActionCreators(changeRCSPagingPageAction, dispatch),
  setPagingLimit: bindActionCreators(changeRCSPagingLimitAction, dispatch),
});

export default connect(
  mapStateToProps,
  dispatchToProps
)(ReturnCreationScheduleContainer);
