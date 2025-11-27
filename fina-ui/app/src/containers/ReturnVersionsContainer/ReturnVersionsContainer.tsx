import ReturnVersionsPage from "../../components/ReturnVerions/ReturnVersionsPage";
import React, { useEffect, useState } from "react";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { useTranslation } from "react-i18next";
import {
  getVersions,
  versionsDelete,
  versionsPost,
  versionsPut,
} from "../../api/services/versionsService";
import { useSnackbar } from "notistack";
import { ReturnVersion } from "../../types/importManager.type";

interface ReturnVersionsContainerProps {
  addNewReturnVersionsModal: boolean;
  setAddNewReturnVersionsModal: (value: boolean) => void;
}

const ReturnVersionsContainer: React.FC<ReturnVersionsContainerProps> = ({
  addNewReturnVersionsModal,
  setAddNewReturnVersionsModal,
}) => {
  const { openErrorWindow } = useErrorWindow();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const [data, setData] = useState<ReturnVersion[]>();

  useEffect(() => {
    initReturnVersions();
  }, []);

  const initReturnVersions = () => {
    getVersions()
      .then((res) => {
        setData(res.data);
      })
      .catch((e) => {
        openErrorWindow(e, t("error"), true);
      });
  };

  const saveReturnVersions = (data: ReturnVersion | null) => {
    if (!data?.id) {
      versionsPost(data)
        .then(() => {
          initReturnVersions();
          enqueueSnackbar(t("saved"), {
            variant: "success",
          });
        })
        .catch((e) => {
          openErrorWindow(e, t("error"), true);
        });
    } else {
      versionsPut(data, data.id)
        .then(() => {
          initReturnVersions();
          enqueueSnackbar(t("saved"), {
            variant: "success",
          });
        })
        .catch((e) => {
          openErrorWindow(e, t("error"), true);
        });
    }
  };

  const returnVersionsDeleteHandler = (returnTypeId: number) => {
    versionsDelete(returnTypeId)
      .then(() => {
        const newArr = data?.filter((item) => {
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
    <ReturnVersionsPage
      addNewReturnVersionsModal={addNewReturnVersionsModal}
      setAddNewReturnVersionsModal={setAddNewReturnVersionsModal}
      data={data}
      saveReturnVersions={saveReturnVersions}
      returnVersionsDeleteHandler={returnVersionsDeleteHandler}
    />
  );
};

export default ReturnVersionsContainer;
