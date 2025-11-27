import SubMatrixPage from "../../components/Matrix/SubMatrix/SubMatrixPage";
import { GridColumnType } from "../../types/common.type";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/system";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import HorizontalRuleOutlinedIcon from "@mui/icons-material/HorizontalRuleOutlined";
import {
  deleteSubMatrix,
  getSubMatrix,
  saveSubMatrix,
} from "../../api/services/matrixService";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import {
  SubMatrixDataType,
  SubMatrixSaveDataType,
} from "../../types/matrix.type";
import { getReturnDefinitions } from "../../api/services/returnsService";
import { ReturnDefinitionType } from "../../types/returnDefinition.type";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";

const SubMatrixContainer = () => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState<SubMatrixDataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [returns, setReturns] = useState<ReturnDefinitionType[]>([]);

  let { matrixId }: { matrixId: string } = useParams();

  useEffect(() => {
    setColumns(columnHeader);
    loadSubMatrix();
    getReturns();
  }, []);
  const columnHeader: GridColumnType[] = [
    {
      field: "returnDefinition.code",
      headerName: t("code"),
    },
    {
      field: "returnDefinition.name",
      headerName: t("name"),
    },
    {
      field: "returnDefinition.returnType.code",
      headerName: t("returnType"),
    },
    { field: "matrixTableType", headerName: t("type") },
    {
      field: "protected",
      headerName: t("protected"),
      renderCell: (value: boolean) => {
        return (
          <Box
            style={{
              backgroundColor: value ? "#ebf5e9" : "#f5e9e9",
              borderRadius: "100%",
              padding: "3px",
              display: "flex",
            }}
          >
            {value ? (
              <DoneOutlinedIcon
                style={{
                  fontSize: "small",
                  color: "#289E20",
                }}
              />
            ) : (
              <HorizontalRuleOutlinedIcon
                style={{ fontSize: "small", color: "#ff0600" }}
              />
            )}
          </Box>
        );
      },
    },
    {
      field: "returnDefinition.tables",
      headerName: t("tables"),
      renderCell: (value: any, row: any) => {
        let length = row.returnDefinition.tables.length;
        return <span>{length}</span>;
      },
    },
    {
      field: "sheetName",
      headerName: t("sheetname"),
    },
  ];

  const [columns, setColumns] = useState<GridColumnType[]>(columnHeader);

  const getReturns = () => {
    getReturnDefinitions().then((resp) => {
      setReturns(resp.data);
    });
  };

  const subMatrixDeleteHandler = async (id: number) => {
    try {
      await deleteSubMatrix(id);
      setData(data.filter((item) => item.id !== id));
      enqueueSnackbar(t("deleted"), {
        variant: "success",
      });
    } catch (e) {
      openErrorWindow(e, t("error"), true);
    }
  };

  const onSaveSubMatrix = async (subMatrixData: SubMatrixSaveDataType) => {
    try {
      if (!subMatrixData.id) {
        const res = await saveSubMatrix(subMatrixData);
        setData([...data, res.data]);
      } else {
        const res = await saveSubMatrix(subMatrixData);
        const newData = data.map((item) => {
          if (item.id === res.data.id) {
            return res.data;
          }
          return item;
        });
        setData(newData);
      }
      enqueueSnackbar(subMatrixData.id ? t("edited") : t("saved"), {
        variant: "success",
      });
    } catch (e) {
      openErrorWindow(e, t("error"), true);
    }
  };

  const loadSubMatrix = () => {
    setLoading(true);
    getSubMatrix(+matrixId)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <SubMatrixPage
      columns={columns}
      data={data}
      setData={setData}
      loading={loading}
      returns={returns}
      subMatrixDeleteHandler={subMatrixDeleteHandler}
      onSaveSubMatrix={onSaveSubMatrix}
    />
  );
};

export default SubMatrixContainer;
