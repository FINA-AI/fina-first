import SubMatrixOptionsPage from "../../components/Matrix/SubMatrixOptions/SubMatrixOptionsPage";
import {
  getSubmatrixOptions,
  updateSubMatrixOption,
} from "../../api/services/matrixService";
import { useEffect, useState } from "react";
import { SubMatrixOptionsDataType } from "../../types/matrix.type";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";

const SubMatrixOptionsContainer = () => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState<SubMatrixOptionsDataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  let { subMatrixId }: { subMatrixId: string } = useParams();

  useEffect(() => {
    loadSubMatrixOptions();
  }, []);

  const loadSubMatrixOptions = () => {
    setLoading(true);
    getSubmatrixOptions(+subMatrixId)
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

  const onSave = (submitData: SubMatrixOptionsDataType) => {
    updateSubMatrixOption(+subMatrixId, submitData)
      .then((resp) => {
        const newData = data.map((item: SubMatrixOptionsDataType) =>
          item.id === submitData.id ? resp.data : item
        );
        setData(newData);
        enqueueSnackbar(t("edited"), {
          variant: "success",
        });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  return <SubMatrixOptionsPage data={data} loading={loading} onSave={onSave} />;
};

export default SubMatrixOptionsContainer;
