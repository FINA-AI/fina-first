import EmsFileImportPage from "../../components/EMS/EmsFileImport/EmsFileImportPage";
import { BASE_URL, getFormattedDateValue } from "../../util/appUtil";
import IconButton from "@mui/material/IconButton";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import React, { useEffect, useState } from "react";
import { GridColumnType } from "../../types/common.type";
import { useTranslation } from "react-i18next";
import useConfig from "../../hoc/config/useConfig";
import {
  importFile,
  loadData,
} from "../../api/services/ems/emsFileImportService";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { fileImportDataType } from "../../types/fileImport.type";
import { loadFiTypes } from "../../api/services/fi/fiService";
import { connect } from "react-redux";
import EmsFileImportStatusCell from "../../components/EMS/EmsFileImport/EmsFileImportStatusCell";

interface EmsFileImportContainerProps {
  state: any;
}

const EmsFileImportContainer: React.FC<EmsFileImportContainerProps> = ({
  state,
}) => {
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();
  const { openErrorWindow } = useErrorWindow();

  const [pagingPage, setPagingPage] = useState(1);
  const [pagingLimit, setPagingLimit] = useState(25);
  const [rowsLen, setRowsLen] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<fileImportDataType[]>([]);
  const [fiTypes, setFiTypes] = useState([]);
  const [error, setError] = useState<{
    open: boolean;
    errors: any;
    warnings: any;
  }>({
    open: false,
    errors: [],
    warnings: [],
  });

  let headerColumns = [
    {
      field: "fileName",
      headerName: t("filename"),
      minWidth: 40,
      hideCopy: true,
    },
    {
      field: "fileContent",
      minWidth: 85,
      hideCopy: true,
      hideSort: true,
      renderCell: (value: any, row: any) => {
        return (
          <IconButton
            onClick={() => {
              window.open(
                BASE_URL + `/rest/ems/v1/file/import/${row.id}`,
                "_blank"
              );
            }}
            style={{ width: 16, height: 16 }}
          >
            <CloudDownloadIcon style={{ width: 16, height: 16 }} />
          </IconButton>
        );
      },
    },
    {
      field: "uploadTime",
      headerName: t("uploadtime"),
      minWidth: 85,
      hideCopy: true,
      renderCell: (value: number) => {
        return <span>{getFormattedDateValue(value, getDateFormat(true))}</span>;
      },
    },
    {
      field: "author",
      headerName: t("author"),
      minWidth: 85,
      hideCopy: true,
    },
    {
      field: "statusName",
      headerName: t("status"),
      minWidth: 85,
      hideCopy: true,
      renderCell: (value: string, row: fileImportDataType) => {
        return <EmsFileImportStatusCell value={value} fileId={row.id} />;
      },
    },
  ];

  const [columns, setColumns] = useState<GridColumnType[]>(headerColumns);

  useEffect(() => {
    getFiTypes();
  }, []);

  useEffect(() => {
    if (state !== undefined && state.columns.length !== 0) {
      let newCols = [];
      for (let item of state.columns) {
        let headerCell = columns.find((el) => item.field == el.field);
        if (headerCell) {
          headerCell.hidden = item.hidden;
          headerCell.fixed = item.fixed;
          newCols.push(headerCell);
        }
      }
      setColumns(newCols);
    }
  }, [state]);

  useEffect(() => {
    init();
  }, [pagingPage, pagingLimit]);

  const init = () => {
    setLoading(true);
    loadData(pagingPage, pagingLimit)
      .then((res) => {
        const resData = res.data;
        setRowsLen(resData.totalResults);
        setRows([...resData.list]);
        setLoading(false);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const getFiTypes = async () => {
    try {
      const res = await loadFiTypes(false);
      setFiTypes(res.data);
    } catch (err) {
      openErrorWindow(err, t("error"), true);
    }
  };

  const addNewConfig = async (payload: FormData) => {
    try {
      setLoading(true);
      const res = await importFile(payload);
      if (res.data.errors.length > 0 || res.data.warnings.length > 0) {
        setError({
          open: true,
          errors: res.data.errors,
          warnings: res.data.warnings,
        });
      }
      setRows([res.data, ...rows]);
    } catch (err) {
      openErrorWindow(err, t("error"), true);
    } finally {
      setLoading(false);
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
    <EmsFileImportPage
      columns={columns}
      setRowPerPage={onPagingLimitChange}
      pagingPage={pagingPage}
      setActivePage={setPagingPage}
      initialRowsPerPage={pagingLimit}
      rowsLen={rowsLen}
      loading={loading}
      rows={rows}
      setRows={setRows}
      onRefresh={onRefresh}
      fiTypes={fiTypes}
      addNewConfig={addNewConfig}
      error={error}
      setError={setError}
      setColumns={setColumns}
    />
  );
};

const mapStateToProps = (state: any) => ({
  state: state.getIn(["state", "emsFileImportTableCustomization"]),
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmsFileImportContainer);
