import EmsInspectionColumnPage from "../../components/EMS/EmsInpectionColumn/EmsInspectionColumnPage";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  deleteInspectionColumn,
  loadInspectionColumns,
  loadInspectionColumnTypes,
  postInspectionColumn,
  putInspectionColumn,
} from "../../api/services/ems/emsInspectionColumnService";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { getLanguage } from "../../util/appUtil";
import { InspectionColumnData } from "../../types/inspection.type";
import { GridColumnType } from "../../types/common.type";
import { connect } from "react-redux";
import { useSnackbar } from "notistack";

interface EmsInspectionColumnContainerProps {
  state: any;
}

const EmsInspectionColumnContainer: FC<EmsInspectionColumnContainerProps> = ({
  state,
}) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState<InspectionColumnData[]>([]);
  const [loading, setLoading] = useState(true);
  const [inspectionTypes, setInspectionTypes] = useState<string[]>([]);
  const [selectedElement, setSelectedElement] = useState();

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
  const initData = async () => {
    try {
      setLoading(true);
      const res = await loadInspectionColumns();
      setData(res.data);
    } catch (err) {
      openErrorWindow(err, t("error"), true);
    } finally {
      setLoading(false);
    }
  };

  const initInspectionTypes = async () => {
    try {
      const res = await loadInspectionColumnTypes();
      setInspectionTypes(res.data);
    } catch (err) {
      openErrorWindow(err, t("error"), true);
    }
  };

  const addNewInspectionColumn = async (newItemData: InspectionColumnData) => {
    try {
      if (newItemData?.id) {
        const res = await putInspectionColumn(newItemData);
        setData(
          data.map((item) => {
            if (item.id === newItemData.id) {
              return res.data;
            }
            return item;
          })
        );
        setSelectedElement(res.data);
        enqueueSnackbar(t("addNewItem"), {
          variant: "success",
        });
      } else {
        await postInspectionColumn(newItemData);
        initData();
        enqueueSnackbar(t("addNewItem"), {
          variant: "success",
        });
      }
    } catch (err: any) {
      openErrorWindow(err, t("error"), true);
    }
  };

  const removeInspectionColumn = async (id: number) => {
    try {
      await deleteInspectionColumn(id);
      setData(data.filter((i) => i.id !== id));
      setSelectedElement(undefined);
      enqueueSnackbar(t("delete"), {
        variant: "success",
      });
    } catch (e) {
      openErrorWindow(e, t("error"), true);
    }
  };

  let headerColumns = [
    {
      field: "names",
      headerName: t("name"),
      minWidth: 40,
      hideSort: true,
      renderCell: (value: any) => {
        if (value[getLanguage()]) {
          return value[getLanguage()];
        } else {
          if (Object.keys(value).length > 0) {
            return Object.values(value)[0];
          }
          return "NONAME";
        }
      },
    },
    {
      field: "columnId",
      headerName: t("column"),
      minWidth: 85,
      renderCell: (value: number) => {
        return `${t("column")} ${value}`;
      },
    },
    {
      field: "type",
      headerName: t("type"),
      minWidth: 85,
    },
    {
      field: "listValues",
      headerName: t("listValues"),
      minWidth: 85,
      hideSort: true,
      renderCell: (value: any[]) => {
        return value?.join();
      },
    },
    {
      field: "visible",
      headerName: t("visible"),
      minWidth: 30,
      renderCell: (value: boolean, row: any) => {
        return row.visible ? (
          <VisibilityIcon style={{ height: 16, width: 16, color: "#8695b1" }} />
        ) : (
          <VisibilityOffIcon
            style={{ height: 16, width: 16, color: "#8695b1" }}
          />
        );
      },
    },
  ];

  const [columns, setColumns] = useState<GridColumnType[]>(headerColumns);

  useEffect(() => {
    initData();
    initInspectionTypes();
  }, []);

  return (
    <EmsInspectionColumnPage
      columns={columns}
      setColumns={setColumns}
      data={data}
      loading={loading}
      inspectionTypes={inspectionTypes}
      addNewInspectionColumn={addNewInspectionColumn}
      initData={initData}
      removeInspectionColumn={removeInspectionColumn}
      selectedElement={selectedElement}
      setSelectedElement={setSelectedElement}
      setData={setData}
    />
  );
};

const mapStateToProps = (state: any) => ({
  state: state.getIn(["state", "emsInspectionColumnsTableCustomization"]),
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmsInspectionColumnContainer);
