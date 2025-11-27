import React, { useEffect, useState } from "react";
import PeriodTypesPage from "../../components/PeriodDefinition/PeriodTypes/PeriodTypesPage";
import {
  getPeriodTypes,
  periodTypesDelete,
  periodTypesPost,
  periodTypesPut,
} from "../../api/services/periodTypesService";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { useTranslation } from "react-i18next";
import { PeriodType } from "../../types/period.type";
import { useSnackbar } from "notistack";

interface PeriodTypesContainerProps {
  addNewModalOpen: boolean;
  setAddNewModalOpen: (isOpen: boolean) => void;
}

const PeriodTypesContainer: React.FC<PeriodTypesContainerProps> = ({
  addNewModalOpen,
  setAddNewModalOpen,
}) => {
  const { openErrorWindow } = useErrorWindow();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const [data, setData] = useState<PeriodType[]>([]);

  useEffect(() => {
    initPeriodTypes();
  }, []);

  const initPeriodTypes = async () => {
    getPeriodTypes()
      .then((res) => {
        setData(res.data);
      })
      .catch((e) => {
        openErrorWindow(e, t("error"), true);
      });
  };

  const savePeriodTypes = (data: PeriodType) => {
    if (!data.id) {
      periodTypesPost(data)
        .then(() => {
          initPeriodTypes();
          enqueueSnackbar(t("saved"), {
            variant: "success",
          });
        })
        .catch((e) => {
          openErrorWindow(e, t("error"), true);
        });
    } else {
      periodTypesPut(data, data.id)
        .then(() => {
          initPeriodTypes();
          enqueueSnackbar(t("saved"), {
            variant: "success",
          });
        })
        .catch((e) => {
          openErrorWindow(e, t("error"), true);
        });
    }
  };

  const periodTypeDeleteHandler = (periodTypeId: number) => {
    periodTypesDelete(periodTypeId)
      .then(() => {
        const newArr = data.filter((item) => {
          return item.id !== periodTypeId;
        });
        setData(newArr);
        enqueueSnackbar(t("deleted"), {
          variant: "success",
        });
      })
      .catch((e) => {
        openErrorWindow(e, t("error"), true);
      });
  };

  return (
    <PeriodTypesPage
      addNewModalOpen={addNewModalOpen}
      setAddNewModalOpen={setAddNewModalOpen}
      data={data}
      savePeriodTypes={savePeriodTypes}
      periodTypeDeleteHandler={periodTypeDeleteHandler}
    />
  );
};

export default PeriodTypesContainer;
