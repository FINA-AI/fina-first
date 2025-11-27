import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { processReturns } from "../../api/services/returnsService";
import SimpleLoadMask from "../common/SimpleLoadMask";
import { Return } from "../../types/return.type";
import { TreeState } from "../../types/common.type";
import { ProcessedResult, ReturnStatus } from "../../types/returnManager.type";
import ReturnProcessResultModal from "./ReturnProcessResultModal";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";

interface ReturnProcessModalProps {
  onClose: VoidFunction;
  selectedReturns: Return[];
  openProcessModal: boolean;
  returnsData: Return[];
  setTreeState: React.Dispatch<React.SetStateAction<TreeState<Return[]>>>;
}

const ReturnProcessModal: React.FC<ReturnProcessModalProps> = ({
  onClose,
  openProcessModal,
  selectedReturns,
  returnsData,
  setTreeState,
}) => {
  const { t } = useTranslation();
  const [data, setData] = useState<ProcessedResult[]>([]);
  const [processTime, setProcessTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const { openErrorWindow } = useErrorWindow();

  useEffect(() => {
    const modifiedReturns = modifyReturnsArray();
    processReturnsData(modifiedReturns);
  }, []);

  const modifyReturnsArray = () => {
    let returnsData = Array.isArray(selectedReturns)
      ? [...selectedReturns]
      : [selectedReturns];

    returnsData = [
      ...returnsData.map((ret) => (ret.group ? { ...ret, id: 0 } : ret)),
    ];

    return returnsData;
  };

  const processReturnsData = (returns: Return[]) => {
    setIsProcessing(true);

    const start = performance.now();
    let end;

    processReturns(returns)
      .then((resp) => {
        const data: ProcessedResult[] = [];
        let processedReturns: ProcessedResult[] = Object.values(resp.data);

        for (const value of processedReturns) {
          data.push({ ...value, id: value.returnId });
        }

        let processedIds = processedReturns.map((item) => item.returnId);

        for (let returnItem of returnsData) {
          if (returnItem.children) {
            returnItem.children = returnItem.children.map((child) => {
              if (
                processedReturns &&
                processedIds.includes(child.id as number)
              ) {
                const newStatus = processedReturns.find(
                  (item) => item.returnId === child.id
                )?.status;
                if (newStatus) child.status = newStatus as ReturnStatus;
              }

              return child;
            });
          }
        }

        setData(data);

        setTreeState((prevState) => ({
          ...prevState,
          treeData: [...returnsData],
        }));
      })
      .catch((error) => {
        onClose();
        openErrorWindow(error, t("error"), false);
      })
      .finally(() => {
        setIsProcessing(false);
        end = performance.now();
        setProcessTime(Math.ceil((end - start) / 1000));
      });
  };

  if (isProcessing) {
    return (
      <SimpleLoadMask
        loading={true}
        message={"Processing Please Wait"}
        color={"primary"}
      />
    );
  }

  return (
    <ReturnProcessResultModal
      title={t("processReturnWorkTime", { time: processTime })}
      onClose={onClose}
      data={data}
      isOpen={openProcessModal}
    />
  );
};

export default ReturnProcessModal;
