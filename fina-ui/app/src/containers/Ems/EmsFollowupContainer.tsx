import React, { FC } from "react";
import EmsFollowUp from "../../components/EMS/EmsFollowUp/EmsFollowUp";
import {
  createFollowUp,
  deleteFollowUp,
  updateFollowUp,
} from "../../api/services/ems/emsFollowUpService";
import { FollowUpType } from "../../types/followUp.type";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { useTranslation } from "react-i18next";
import { DeleteFormType } from "../../types/common.type";
import { useSnackbar } from "notistack";

interface EmsFollowupContainerProps {
  selectedFollowUpRow: FollowUpType | null;
  setSelectedFollowUpRow: React.Dispatch<
    React.SetStateAction<FollowUpType | null>
  >;
  followUpData: FollowUpType[];
  setData: React.Dispatch<React.SetStateAction<FollowUpType[]>>;
  loading: boolean;
  followUpDataLength: number;
  setFollowUpPagingPage: React.Dispatch<React.SetStateAction<number>>;
  followUpPagingPage: number;
  setFollowUpPagingLimit: React.Dispatch<React.SetStateAction<number>>;
  followUpPagingLimit: number;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onRefreshClick: (filter: any) => void;
}

const EmsFollowupContainer: FC<EmsFollowupContainerProps> = ({
  selectedFollowUpRow,
  setSelectedFollowUpRow,
  followUpData,
  setData,
  loading,
  followUpDataLength,
  setFollowUpPagingPage,
  followUpPagingPage,
  setFollowUpPagingLimit,
  followUpPagingLimit,
  setLoading,
  onRefreshClick,
}) => {
  const { openErrorWindow } = useErrorWindow();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const onDeleteFollowUp = (
    deleteModal: DeleteFormType,
    setDeleteModal: React.Dispatch<React.SetStateAction<DeleteFormType | null>>
  ): void => {
    setLoading(true);
    let id = deleteModal.selectedRow.id;
    deleteFollowUp(id)
      .then(() => {
        setData([...followUpData.filter((row) => row.id !== id)]);
        setSelectedFollowUpRow(null);
        enqueueSnackbar(t("deleted"), { variant: "success" });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => {
        setLoading(false);
        setDeleteModal((prevModal) => ({
          ...prevModal,
          isOpen: false,
          selectedRow: null,
        }));
      });
  };

  const onRefresh = (): void => {
    onRefreshClick({});
  };

  const onCreateFollowUp = (
    data: FollowUpType,
    setIsCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  ): void => {
    setLoading(true);
    createFollowUp(data)
      .then((resp) => {
        setData([resp.data, ...followUpData]);
        setIsCreateModalOpen(false);
        enqueueSnackbar(t("saved"), {
          variant: "success",
        });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onUpdateFollowUp = (
    data: FollowUpType,
    setIsCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  ): void => {
    setLoading(true);
    updateFollowUp(data.id, data)
      .then((res) => {
        setData([
          ...followUpData.map((row) => {
            return row.id === data.id ? res.data : row;
          }),
        ]);
        setIsCreateModalOpen(false);
        enqueueSnackbar(t("saved"), {
          variant: "success",
        });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const orderRowByHeader = (cellName: string, arrowDirection: string) => {
    const sortDirection = arrowDirection === "up" ? 1 : -1;

    const getValue = (row: any) => {
      const inspectionFields = [
        "fiCode",
        "fiName",
        "decreeNumber",
        "decreeDate",
        "reclamationLetterNumber",
        "reclamationLetterDate",
      ];

      if (inspectionFields.includes(cellName)) {
        return row.inspection?.[cellName];
      }

      return row[cellName];
    };

    setData((prevRows: any[]) =>
      [...prevRows].sort((a, b) => {
        const valueA = getValue(a);
        const valueB = getValue(b);

        if (valueA > valueB) return 1 * sortDirection;
        if (valueA < valueB) return -1 * sortDirection;
        return 0;
      })
    );
  };

  return (
    <EmsFollowUp
      setPagingPage={setFollowUpPagingPage}
      setPagingLimit={setFollowUpPagingLimit}
      rowsLen={followUpDataLength}
      loading={loading}
      rows={followUpData}
      pagingLimit={followUpPagingLimit}
      pagingPage={followUpPagingPage}
      setSelectedFollowUpRow={setSelectedFollowUpRow}
      selectedFollowUpRow={selectedFollowUpRow}
      deleteFollowUp={onDeleteFollowUp}
      onRefresh={onRefresh}
      onCreateFollowUp={onCreateFollowUp}
      onUpdateFollowUp={onUpdateFollowUp}
      orderRowByHeader={orderRowByHeader}
    />
  );
};

export default EmsFollowupContainer;
