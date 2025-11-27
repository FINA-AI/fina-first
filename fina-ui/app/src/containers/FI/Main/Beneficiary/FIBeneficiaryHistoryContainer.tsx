import FIBeneficiaryHistoryPage from "../../../../components/FI/Main/Detail/Beneficiary/History/FIBeneficiaryHistoryPage";
import React, { useEffect, useState } from "react";
import { loadBeneficiaryHistory } from "../../../../api/services/fi/fiBeneficiaryService";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import { useTranslation } from "react-i18next";
import { BeneficiariesDataType } from "../../../../types/fi.type";

interface BeneficiaryHistoryContainerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setSelectedHistory: (history: any) => void;
  selectedHistory: BeneficiariesDataType | null;
  beneficiaryId?: number;
  shareholders: BeneficiariesDataType[];
  setShareholders: (shareholders: BeneficiariesDataType[]) => void;
  setShareholdersHistoryLength: (length: number) => void;
  shareholdersHistoryLength: number;
  onSelectHistory: (history: BeneficiariesDataType) => void;
}

const FIBeneficiaryHistoryContainer: React.FC<
  BeneficiaryHistoryContainerProps
> = ({
  open,
  setOpen,
  setSelectedHistory,
  selectedHistory,
  beneficiaryId,
  shareholders,
  setShareholders,
  setShareholdersHistoryLength,
  shareholdersHistoryLength,
  onSelectHistory,
}) => {
  const [pagingPage, setPagingPage] = useState<number>(1);
  const [pagingLimit, setPagingLimit] = useState<number>(25);
  const [loading, setLoading] = useState<boolean>(true);
  const { openErrorWindow } = useErrorWindow();
  const { t } = useTranslation();

  useEffect(() => {
    if (pagingLimit > 0 && shareholders.length === 0) {
      loadBeneficiaryHistory(beneficiaryId, pagingPage, pagingLimit)
        .then((res) => {
          let data = res.data;
          if (data) {
            setShareholders(
              data.list.map((fi: any, index: number) => ({
                ...fi.entity,
                index: index,
              }))
            );
            setShareholdersHistoryLength(data.totalResults);
          }
        })
        .catch((error) => openErrorWindow(error, t("error"), true))
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [pagingPage, pagingLimit]);

  const onPagingLimitChange = (limit: number) => {
    setPagingPage(1);
    setPagingLimit(limit);
  };

  const onPagingPageChange = (page: number) => {
    setPagingPage(page);
  };

  const onCloseHistory = () => {
    setOpen(!open);
  };

  const onChangeHistory = (history: any) => {
    setSelectedHistory(history);
    setOpen(false);
  };

  return (
    <FIBeneficiaryHistoryPage
      onCloseHistory={onCloseHistory}
      shareholders={shareholders}
      onPagingLimitChange={onPagingLimitChange}
      onPagingPageChange={onPagingPageChange}
      pagingPage={pagingPage}
      pagingLimit={pagingLimit}
      onChangeHistory={onChangeHistory}
      selectedHistory={selectedHistory}
      loading={loading}
      shareholdersHistoryLength={shareholdersHistoryLength}
      onSelectHistory={onSelectHistory}
    />
  );
};

export default FIBeneficiaryHistoryContainer;
