import MDTNodeComparisons from "../../components/MDT/MDTNodeComparisons/MDTNodeComparisons";
import React, { useEffect, useState } from "react";
import {
  deleteNodeComparison,
  getNodeComparisons,
  saveNodeComparison,
} from "../../api/services/MDTService";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { MDTComparisonData, MdtNode } from "../../types/mdt.type";
import { Comparison } from "../../types/comparison.type";

interface MDTNodeComparisonsContainerProps {
  currentNode: MdtNode | null;
  validMdtCodes: string[];
  hasAmendPermission: boolean;
}

const MDTNodeComparisonsContainer: React.FC<
  MDTNodeComparisonsContainerProps
> = ({ currentNode, validMdtCodes, hasAmendPermission }) => {
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { openErrorWindow } = useErrorWindow();

  useEffect(() => {
    if (currentNode) {
      loadMDTComparisons();
    }
  }, [currentNode?.id]);

  const loadMDTComparisons = () => {
    setLoading(true);
    getNodeComparisons(currentNode?.id)
      .then((resp) => {
        setComparisons(resp.data.list);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => setLoading(false));
  };

  const onSaveFunction = (
    data: MDTComparisonData,
    setIsAddNewOpen: (open: boolean) => void
  ) => {
    let newComparison = { ...data, node: currentNode };
    saveNodeComparison(newComparison)
      .then((resp) => {
        setComparisons([...comparisons, resp.data]);
        enqueueSnackbar(t("saved"), {
          variant: "success",
        });
        if (setIsAddNewOpen) {
          setIsAddNewOpen(false);
        }
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const onEditSaveFunction = (data: MDTComparisonData) => {
    saveNodeComparison(data)
      .then((resp) => {
        setComparisons(
          comparisons.map((item) => (item.id === data.id ? resp.data : item))
        );
        enqueueSnackbar(t("saved"), {
          variant: "success",
        });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const onDeleteFunction = (data: MDTComparisonData) => {
    deleteNodeComparison(data.id, currentNode?.id)
      .then(() => {
        setComparisons(comparisons.filter((item) => item.id !== data.id));
        enqueueSnackbar(t("deleted"), {
          variant: "success",
        });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  return (
    <MDTNodeComparisons
      onDeleteFunction={onDeleteFunction}
      onEditSaveFunction={onEditSaveFunction}
      onSaveFunction={onSaveFunction}
      comparisons={comparisons}
      validMdtCodes={validMdtCodes}
      currentNode={currentNode}
      loading={loading}
      selectedNode={currentNode}
      hasAmendPermission={hasAmendPermission}
    />
  );
};

export default MDTNodeComparisonsContainer;
