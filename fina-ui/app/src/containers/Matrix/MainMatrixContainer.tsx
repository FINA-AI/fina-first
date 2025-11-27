import React, { useEffect, useState } from "react";
import {
  deleteMatrix,
  loadMainMatrixData,
  saveMatrix,
} from "../../api/services/matrixService";
import MainMatrixPage from "../../components/Matrix/MainMatrix/MainMatrixPage";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { useTranslation } from "react-i18next";
import { MainMatrixDataType } from "../../types/matrix.type";
import { FiTypeDataType } from "../../types/fi.type";
import { PeriodDefinitionType } from "../../types/period.type";
import { returnVersionDataType } from "../../types/returnVersion.type";
import { loadFiTypes } from "../../api/services/fi/fiService";
import { getPeriodTypes } from "../../api/services/periodTypesService";
import { getVersions } from "../../api/services/versionsService";
import { useSnackbar } from "notistack";

const MainMatrixContainer = () => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<MainMatrixDataType[]>([]);
  const [fiTypes, setFiTypes] = useState<FiTypeDataType[]>([]);
  const [periodTypes, setPeriodTypes] = useState<PeriodDefinitionType[]>([]);
  const [returnVersions, setReturnVersions] = useState<returnVersionDataType[]>(
    []
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState<{
    open: boolean;
    data?: MainMatrixDataType;
  }>({ open: false });

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    initMainMatrixData();
    loadFiTypesFunction();
    loadPeriodTypes();
    loadReturnVersionData();
  }, []);

  const initMainMatrixData = () => {
    setLoading(true);
    loadMainMatrixData()
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

  const loadFiTypesFunction = () => {
    loadFiTypes(false)
      .then((res) => {
        setFiTypes(res.data);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const loadPeriodTypes = () => {
    getPeriodTypes()
      .then((result) => {
        setPeriodTypes(result.data);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const loadReturnVersionData = () => {
    getVersions()
      .then((resp) => {
        setReturnVersions(resp.data);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const deleteMainMatrix = (id: number) => {
    deleteMatrix(id)
      .then(() => {
        const newData = data.filter((item) => item.id !== id);
        setData(newData);
        enqueueSnackbar(t("deleted"), {
          variant: "success",
        });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const onSave = (matrixData: MainMatrixDataType) => {
    saveMatrix(matrixData)
      .then((resp) => {
        if (matrixData.id) {
          const newData = data.map((item: MainMatrixDataType) =>
            item.id === matrixData.id ? resp.data : item
          );
          setData(newData);
        } else {
          setData([resp.data, ...data]);
        }
        setIsAddModalOpen({ open: false });
        enqueueSnackbar(matrixData.id ? t("edited") : t("saved"), {
          variant: "success",
        });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  return (
    <MainMatrixPage
      loading={loading}
      data={data}
      fiTypes={fiTypes}
      periodTypes={periodTypes}
      returnVersions={returnVersions}
      onSave={onSave}
      deleteMainMatrix={deleteMainMatrix}
      loadMatrixData={initMainMatrixData}
      isAddModalOpen={isAddModalOpen}
      setIsAddModalOpen={setIsAddModalOpen}
    />
  );
};
export default MainMatrixContainer;
