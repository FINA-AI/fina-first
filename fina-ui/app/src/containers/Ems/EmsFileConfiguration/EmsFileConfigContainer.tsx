import EmsFileConfiguration from "../../../components/EMS/EmsFileConfiguration/Main/EmsFileConfiguration";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import {
  deleteEmsConfig,
  loadEmsConfig,
  postEmsConfig,
} from "../../../api/services/ems/emsFIleConfigService";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import { BASE_URL, getFormattedDateValue } from "../../../util/appUtil";
import useConfig from "../../../hoc/config/useConfig";
import { EmsFileConfigDataTypes } from "../../../types/inspection.type";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import IconButton from "@mui/material/IconButton";
import { GridColumnType } from "../../../types/common.type";
import { loadEmsFiTypes } from "../../../api/services/ems/emsFisService";
import { connect } from "react-redux";
import { useSnackbar } from "notistack";

interface EmsFileConfigContainerProps {
  setSelectedFileId: React.Dispatch<React.SetStateAction<number | undefined>>;
  state: any;
}

const EmsFileConfigContainer: React.FC<EmsFileConfigContainerProps> = ({
  setSelectedFileId,
  state,
}) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const { enqueueSnackbar } = useSnackbar();
  const { getDateFormat } = useConfig();

  const [data, setData] = useState<EmsFileConfigDataTypes[]>([]);
  const [fiTypes, setFiTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFileConfigs();
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
    } else {
      setColumns(headerColumns);
    }
  }, [state]);

  const getFiTypes = async () => {
    try {
      const res = await loadEmsFiTypes(1, 1000);
      setFiTypes(res.data);
    } catch (err) {
      openErrorWindow(err, t("error"), true);
    }
  };

  const getFileConfigs = async () => {
    try {
      setLoading(true);
      const res = await loadEmsConfig();
      setData(res.data);
    } catch (err) {
      openErrorWindow(err, t("error"), true);
    } finally {
      setLoading(false);
    }
  };

  const addNewConfig = async (payload: FormData, id: number) => {
    try {
      setLoading(true);
      const res = await postEmsConfig(payload);
      if (id > 0) {
        setData(
          data.map((i: any) => {
            if (i.id === id) {
              return res.data;
            }
            return i;
          })
        );
        return;
      }
      setData([...data, res.data]);
      enqueueSnackbar(t("addNewItem"), {
        variant: "success",
      });
    } catch (err) {
      openErrorWindow(err, t("error"), true);
    } finally {
      setLoading(false);
    }
  };
  const removeEmsConfig = async (id: number) => {
    try {
      await deleteEmsConfig(id);
      setData(data.filter((i) => i.id !== id));
      enqueueSnackbar(t("delete"), {
        variant: "success",
      });
    } catch (e) {
      openErrorWindow(e, t("error"), true);
    }
  };

  let headerColumns = [
    {
      field: "fiType",
      headerName: t("fiType"),
      minWidth: 40,
    },
    {
      field: "creationDate",
      headerName: t("creationDate"),
      minWidth: 85,
      renderCell: (value: number) => {
        return <span>{getFormattedDateValue(value, getDateFormat(true))}</span>;
      },
    },
    {
      field: "sheetStartRow",
      headerName: t("sheetStartRow"),
      minWidth: 85,
    },
    {
      field: "author",
      headerName: t("author"),
      minWidth: 85,
    },
    {
      field: "exportFileTemplateName",
      headerName: t("exportfiletemplatename"),
      minWidth: 85,
    },
    {
      field: "exportFileTemplateContent",
      minWidth: 85,
      hideCopy: true,
      hideSort: true,
      renderCell: (value: any, row: any) => {
        return (
          <IconButton
            onClick={() => {
              window.open(
                BASE_URL + `/rest/ems/v1/file/configuration/${row.id}`,
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
      field: "active",
      headerName: t("status"),
      minWidth: 85,
      renderCell: (value: boolean) => {
        return value ? (
          <div style={{ color: "green" }}>{t("active")}</div>
        ) : (
          <div style={{ color: "red" }}>{t("passive")}</div>
        );
      },
    },
  ];

  const [columns, setColumns] = useState<GridColumnType[]>(headerColumns);

  return (
    <EmsFileConfiguration
      columns={columns}
      data={data}
      setData={setData}
      addNewConfig={addNewConfig}
      fiTypes={fiTypes}
      removeEmsConfig={removeEmsConfig}
      getFileConfigs={getFileConfigs}
      loading={loading}
      setSelectedFileId={setSelectedFileId}
      setColumns={setColumns}
    />
  );
};
const mapStateToProps = (state: any) => ({
  state: state.getIn(["state", "emsFileConfigurationTableCustomization"]),
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmsFileConfigContainer);
