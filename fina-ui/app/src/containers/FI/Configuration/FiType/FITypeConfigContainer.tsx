import FiTypeConfigMainPage from "../../../../components/FI/Configuration/FiType/FiTypeConfigMainPage";
import React, { memo, useEffect, useState } from "react";
import {
  addFiType,
  deleteFiType,
  editFiType,
  loadFiTypes,
} from "../../../../api/services/fi/fiTypesService";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { FiTypeDataType } from "../../../../types/fi.type";

const FITypeConfigContainer: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [fiTypesData, setFiTypesData] = useState<FiTypeDataType[]>([]);

  const { enqueueSnackbar } = useSnackbar();
  const { openErrorWindow } = useErrorWindow();
  const { t } = useTranslation();

  const getFiTypes = () => {
    setLoading(true);
    loadFiTypes()
      .then((res) => {
        const data = res.data as FiTypeDataType[];
        if (data) {
          setFiTypesData(data);
        }
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => setLoading(false));
  };

  const addNewFiType = async (newFiType: Partial<FiTypeDataType>) => {
    if (newFiType.code || newFiType.name) {
      await addFiType(newFiType)
        .then((resp) => {
          setFiTypesData((prev) => [...prev, resp.data as FiTypeDataType]);
          enqueueSnackbar(t("save"), {
            variant: "success",
          });
        })
        .catch((err) => openErrorWindow(err, t("error"), true));
    } else {
      openErrorWindow(t("requiredFieldsAreNotProvided"), t("error"), true);
    }
  };

  const onEditFiType = async (fiType: FiTypeDataType) => {
    setLoading(true);
    await editFiType(fiType)
      .then((resp) => {
        const updated = resp.data as FiTypeDataType;
        setFiTypesData((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item))
        );
        enqueueSnackbar(t("fiTypeEdited"), {
          variant: "success",
        });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => setLoading(false));
  };

  const onDeleteFiType = async (fiTypeId: number) => {
    await deleteFiType(fiTypeId)
      .then(() => {
        setFiTypesData((prev) => prev.filter((row) => row.id !== fiTypeId));
        enqueueSnackbar(t("deleted"), {
          variant: "success",
        });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };
  useEffect(() => {
    getFiTypes();
  }, []);

  return (
    <FiTypeConfigMainPage
      fiTypesData={fiTypesData}
      loading={loading}
      addNewFiType={addNewFiType}
      editFiType={onEditFiType}
      deleteFiType={onDeleteFiType}
    />
  );
};
export default memo(FITypeConfigContainer);
