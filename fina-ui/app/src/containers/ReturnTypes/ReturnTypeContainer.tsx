import ReturnTypePage from "../../components/ReturnTypes/ReturnTypePage";
import React, { useEffect, useState } from "react";
import {
  removeReturnType,
  returnTypesPost,
  returnTypesPut,
} from "../../api/services/returnsService";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { ReturnType } from "../../types/returnDefinition.type";

interface ReturnTypeContainerProps {
  addNewReturnTypeModal: boolean;
  setAddNewReturnTypeModal: (value: boolean) => void;
  initReturnTypes: () => Promise<ReturnType[] | undefined>;
}

const ReturnTypeContainer: React.FC<ReturnTypeContainerProps> = ({
  addNewReturnTypeModal,
  setAddNewReturnTypeModal,
  initReturnTypes,
}) => {
  const { openErrorWindow } = useErrorWindow();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState<ReturnType[]>([]);

  const init = async () => {
    let response = await initReturnTypes();
    if (response) setData(response);
  };

  useEffect(() => {
    init();
  }, []);

  const saveReturnTypes = (data: ReturnType) => {
    if (!data.id) {
      returnTypesPost(data)
        .then(() => {
          init();
          enqueueSnackbar(t("saved"), {
            variant: "success",
          });
        })
        .catch((e) => {
          openErrorWindow(e, t("error"), true);
        });
    } else {
      returnTypesPut(data)
        .then(() => {
          init();
          enqueueSnackbar(t("saved"), {
            variant: "success",
          });
        })
        .catch((e) => {
          openErrorWindow(e, t("error"), true);
        });
    }
  };

  const returnTypeDeleteHandler = (returnTypeId: number) => {
    removeReturnType(returnTypeId)
      .then(() => {
        const newArr = data.filter((item) => {
          return item.id !== returnTypeId;
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
    <ReturnTypePage
      addNewReturnTypeModal={addNewReturnTypeModal}
      setAddNewReturnTypeModal={setAddNewReturnTypeModal}
      data={data}
      saveReturnTypes={saveReturnTypes}
      returnTypeDeleteHandler={returnTypeDeleteHandler}
    />
  );
};

export default ReturnTypeContainer;
