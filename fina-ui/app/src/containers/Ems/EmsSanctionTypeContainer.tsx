import EmsSanctionTypePage from "../../components/EMS/EmsSanctionType/EmsSanctionTypePage";
import { useTranslation } from "react-i18next";
import {
  deleteSanctionTypes,
  getSanctionTypesList,
  loadSanctionTypes,
  postSanctionTypes,
  updateSanctionTypes,
} from "../../api/services/ems/emsSanctionService";
import { useEffect, useState } from "react";
import { SanctionDataType } from "../../types/sanction.type";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { useSnackbar } from "notistack";
import { getLanguage } from "../../util/appUtil";

const EmsSanctionTypeContainer = () => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const { enqueueSnackbar } = useSnackbar();

  const langCode = getLanguage();
  const [pagingPage, setPagingPage] = useState(1);
  const [pagingLimit, setPagingLimit] = useState(25);
  const [rowsLen, setRowsLen] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<SanctionDataType[]>([]);
  const [currSanctionType, setCurrSanctionType] =
    useState<SanctionDataType | null>(null);
  const [sanctionTypesList, setSanctionTypesList] = useState([]);

  useEffect(() => {
    init();
  }, [pagingLimit, pagingPage]);

  const columnHeader = [
    {
      field: "name",
      headerName: t("name"),
      hideCopy: true,
    },
    {
      field: "type",
      headerName: t("type"),
      hideCopy: true,
    },
  ];

  const getSanctionTypesListHandler = () => {
    getSanctionTypesList()
      .then((res) => {
        setSanctionTypesList(res.data);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const init = () => {
    setLoading(true);
    loadSanctionTypes(pagingPage, pagingLimit)
      .then((res) => {
        const resData = res.data;
        setRowsLen(resData.totalResults);
        const data: SanctionDataType[] = resData.list.map((item) => ({
          ...item,
          name: item.names[langCode] || "NONAME",
          type: item.type,
        }));
        setRows(data);
        setLoading(false);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const onSubmitHandler = (data: any) => {
    const newData = {
      id: currSanctionType ? data.id : 0,
      names: { [langCode]: data.name },
      type: data.type,
    };

    if (currSanctionType) {
      updateSanctionTypes(newData.id, newData)
        .then(() => {
          const updateData = rows.map((item) =>
            item.id === data.id ? data : item
          );
          setCurrSanctionType(data);
          setRows(updateData);
          enqueueSnackbar(t("saved"), { variant: "success" });
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
        });
    } else {
      postSanctionTypes(newData)
        .then(() => {
          enqueueSnackbar(t("addNewItem"), {
            variant: "success",
          });
          init();
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
        });
    }
  };

  const deleteHandler = () => {
    if (currSanctionType) {
      const currId = currSanctionType.id;
      deleteSanctionTypes(currId)
        .then((resp) => {
          if (resp.data.length > 0) {
            enqueueSnackbar(t("hasDependencies"), {
              variant: "error",
            });
          } else {
            const deletedRow = rows.filter((item) => item.id !== currId);
            setRows(deletedRow);
            enqueueSnackbar(t("deleted"), { variant: "success" });
          }
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
        });
    }
  };

  const onRefresh = () => {
    init();
  };

  const onPagingLimitChange = (limit: number) => {
    setPagingPage(1);
    setPagingLimit(limit);
  };

  return (
    <EmsSanctionTypePage
      columns={columnHeader}
      loading={loading}
      rowsLen={rowsLen}
      rows={rows}
      setRows={setRows}
      setRowPerPage={onPagingLimitChange}
      setActivePage={setPagingPage}
      pagingPage={pagingPage}
      initialRowsPerPage={pagingLimit}
      currSanctionType={currSanctionType}
      setCurrSanctionType={setCurrSanctionType}
      deleteHandler={deleteHandler}
      onRefresh={onRefresh}
      onSubmitHandler={onSubmitHandler}
      getSanctionTypesListHandler={getSanctionTypesListHandler}
      sanctionTypesList={sanctionTypesList}
    />
  );
};

export default EmsSanctionTypeContainer;
