import RCSDetailPage from "../../components/ReturnCreationSchedule/ReturnCreationScheduleDetail/RCSDetailPage";
import { useHistory, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { bindActionCreators } from "redux";
import { changeRCSPagingPageAction } from "../../redux/actions/returnCreationScheduleActions";
import { connect } from "react-redux";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import {
  loadReturnCreationSchedules,
  loadSchedules,
} from "../../api/services/returnCreationScheduleService";
import RCSModalStatusCell from "../../components/ReturnCreationSchedule/RCSModalStatusCell";
import { getFormattedDateValue } from "../../util/appUtil";
import useConfig from "../../hoc/config/useConfig";
import { ReturnSchedule } from "../../types/returnCreationSchedule.type";
import { ScheduleType } from "../../types/schedule.type";

interface Props {
  pagingPage: number;
  setPagingPage: (page: number) => void;
  pagingLimit: number;
}

const ReturnCreationScheduleDetailContainer: React.FC<Props> = ({
  pagingPage,
  setPagingPage,
  pagingLimit,
}) => {
  const history = useHistory();
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const { getDateFormat } = useConfig();
  const { returncreationId }: any = useParams();

  const [totalResults, setTotalResults] = useState(0);
  const [returnCreationSchedules, setReturnCreationSchedules] =
    useState<ReturnSchedule[]>();
  const [filterString, setFilterString] = useState("");
  const [data, setData] = useState<ScheduleType[]>([]);
  const [loading, setLoading] = useState(true);

  const columnHeader = [
    {
      field: "definitionCode",
      headerName: t("definitionCode"),
      minWidth: 80,
      hideCopy: true,
    },
    {
      field: "periodFrom",
      headerName: t("periodFrom"),
      minWidth: 80,
      hideCopy: true,
      renderCell: (value: number) =>
        getFormattedDateValue(value, getDateFormat(true)),
    },
    {
      field: "periodTo",
      headerName: t("periodTo"),
      minWidth: 80,
      hideCopy: true,
      renderCell: (value: number) =>
        getFormattedDateValue(value, getDateFormat(true)),
    },
    {
      field: "fiCode",
      headerName: t("fiCode"),
      minWidth: 80,
      hideCopy: true,
    },
    {
      field: "dueDate",
      headerName: t("dueDate"),
      minWidth: 80,
      hideCopy: true,
    },
    {
      field: "status",
      headerName: t("status"),
      minWidth: 120,
      hideCopy: true,
      renderCell: (value: string) => {
        return <RCSModalStatusCell value={value} />;
      },
    },
  ];
  const [columns, setColumns] = useState(columnHeader);

  useEffect(() => {
    initReturnCreationSchedules(null);
  }, [pagingPage]);

  useEffect(() => {
    setColumns(columnHeader);
    getSchedules(returncreationId);
  }, []);

  const changeSchedule = (returnSchedule: ReturnSchedule) => {
    history.push({
      pathname: `/returncreationschedule/${returnSchedule.id}`,
      state: { taskName: returnSchedule?.taskName },
    });
    getSchedules(returnSchedule.id);
  };

  const onListSelect = (item: ReturnSchedule) => {
    changeSchedule(item);
  };

  const initReturnCreationSchedules = (filterValue: string | null) => {
    loadReturnCreationSchedules(
      pagingPage,
      pagingLimit,
      filterValue ?? filterString
    )
      .then((res) => {
        const data = res.data.list;
        setReturnCreationSchedules(data);
        setTotalResults(res.data.totalResults);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const filterReturnCreationSchedules = (searchString: string) => {
    if (searchString !== null && searchString !== filterString) {
      setFilterString(searchString);

      if (pagingPage > 1) {
        setPagingPage(1);
      } else {
        initReturnCreationSchedules(searchString);
      }
    }
  };

  const getSchedules = (id: number) => {
    setLoading(true);
    loadSchedules(id)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => setLoading(false));
  };

  return (
    <RCSDetailPage
      data={data}
      setData={setData}
      onListSelect={onListSelect}
      columns={columns}
      pagingPage={pagingPage}
      pagingLimit={pagingLimit}
      totalResults={totalResults}
      setPagingPage={setPagingPage}
      returnCreationSchedules={returnCreationSchedules}
      loading={loading}
      onFilterChange={filterReturnCreationSchedules}
      getSchedules={getSchedules}
    />
  );
};

const mapStateToProps = (state: any) => ({
  pagingPage: state.get("returnCreationSchedule").pagingPage,
  pagingLimit: state.get("returnCreationSchedule").pagingLimit,
});

const dispatchToProps = (dispatch: any) => ({
  setPagingPage: bindActionCreators(changeRCSPagingPageAction, dispatch),
});

export default connect(
  mapStateToProps,
  dispatchToProps
)(ReturnCreationScheduleDetailContainer);
