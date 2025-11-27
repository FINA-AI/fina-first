import EmsInspectionTypePage from "../../components/EMS/EmsInspectionType/EmsInspectionTypePage";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import {
  deleteInspectionTypes,
  loadInspectionTypes,
  postInspectionTypes,
  updateInspectionTypes,
} from "../../api/services/ems/emsInspectionService";
import { connect } from "react-redux";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { EmsInspectionType } from "../../types/inspection.type";
import { ConfigType } from "../../types/common.type";
import { useSnackbar } from "notistack";
import { getLanguage } from "../../util/appUtil";

const EmsInspectionTypeContainer = ({ config }: { config: ConfigType }) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const { enqueueSnackbar } = useSnackbar();

  const langCode = getLanguage();
  const [pagingPage, setPagingPage] = useState(1);
  const [pagingLimit, setPagingLimit] = useState(25);
  const [rowsLen, setRowsLen] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<EmsInspectionType[]>([]);

  const [currInspectionType, setCurrInspectionType] =
    useState<EmsInspectionType | null>(null);

  useEffect(() => {
    init();
  }, [pagingLimit, pagingPage]);

  const columnHeader = [
    {
      field: "names",
      headerName: t("name"),
      hideCopy: true,
    },
    {
      field: "descriptions",
      headerName: t("description"),
      hideCopy: true,
    },
  ];

  const init = () => {
    setLoading(true);
    loadInspectionTypes(pagingPage, pagingLimit)
      .then((res) => {
        const resData = res.data;
        setRowsLen(resData.totalResults);
        const data: EmsInspectionType[] = resData.list.map((item) => ({
          ...item,
          names:
            item.names[langCode] !== undefined
              ? item.names[langCode]
              : Object.values(item.names).length > 0
              ? Object.values(item.names)[0]
              : "NONAME",
          descriptions:
            item.descriptions[langCode] !== undefined
              ? item.descriptions[langCode]
              : "NONAME",
        }));
        setRows(data);
        setLoading(false);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const onSubmitHandler = (data: any) => {
    const languageKey: any = config.language;

    const newData = {
      id: currInspectionType ? data.id : 0,
      names: { [languageKey]: data.names },
      descriptions: { [languageKey]: data.descriptions },
    };

    if (currInspectionType) {
      updateInspectionTypes(newData.id, newData)
        .then(() => {
          const updateData = rows.map((item) =>
            item.id === data.id ? data : item
          );
          setCurrInspectionType(data);
          setRows(updateData);
          enqueueSnackbar(t("saved"), { variant: "success" });
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
        });
    } else {
      postInspectionTypes(newData)
        .then((res) => {
          const resDataId = res.data.list[0].id;
          setRows([...rows, { id: resDataId, ...data }]);
          enqueueSnackbar(t("addNewItem"), {
            variant: "success",
          });
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
        });
    }
  };

  const deleteHandler = () => {
    if (currInspectionType) {
      deleteInspectionTypes(currInspectionType.id)
        .then(() => {
          const deletedRow = rows.filter(
            (item) => item.id !== currInspectionType.id
          );
          setRows(deletedRow);
          enqueueSnackbar(t("deleted"), { variant: "success" });
        })
        .catch((err) => {
          if (err.response && err.response.status === 412) {
            enqueueSnackbar(t("hasDependencies"), {
              variant: "error",
            });
          } else {
            openErrorWindow(err, t("error"), true);
          }
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
    <EmsInspectionTypePage
      columns={columnHeader}
      rows={rows}
      setRows={setRows}
      setRowPerPage={onPagingLimitChange}
      pagingPage={pagingPage}
      setActivePage={setPagingPage}
      initialRowsPerPage={pagingLimit}
      rowsLen={rowsLen}
      deleteHandler={deleteHandler}
      currInspectionType={currInspectionType}
      onSubmitHandler={onSubmitHandler}
      setCurrInspectionType={setCurrInspectionType}
      loading={loading}
      onRefresh={onRefresh}
    />
  );
};

const mapStateToProps = (state: any) => ({
  config: state.get("config").config,
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmsInspectionTypeContainer);
