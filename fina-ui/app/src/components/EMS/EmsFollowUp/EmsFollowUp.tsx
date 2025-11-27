import EmsFollowUpGrid from "./EmsFollowUpGrid";
import { FollowUpType } from "../../../types/followUp.type";
import { DeleteFormType } from "../../../types/common.type";
import React from "react";

interface EmsFollowUpProps {
  setPagingPage: React.Dispatch<React.SetStateAction<number>>;
  setPagingLimit: React.Dispatch<React.SetStateAction<number>>;
  rowsLen: number;
  loading: boolean;
  rows: FollowUpType[];
  pagingLimit: number;
  pagingPage: number;
  selectedFollowUpRow: FollowUpType | null;
  setSelectedFollowUpRow: React.Dispatch<
    React.SetStateAction<FollowUpType | null>
  >;
  onRefresh: () => void;
  deleteFollowUp: (
    deleteModal: DeleteFormType,
    setDeleteModal: React.Dispatch<React.SetStateAction<DeleteFormType | null>>
  ) => void;
  onCreateFollowUp: (
    data: FollowUpType,
    setIsCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
  onUpdateFollowUp: (
    data: FollowUpType,
    setIsCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
  orderRowByHeader: (cellName: string, arrowDirection: string) => void;
}

const EmsFollowUp: React.FC<EmsFollowUpProps> = ({
  rows,
  rowsLen,
  setPagingLimit,
  setPagingPage,
  loading,
  pagingLimit,
  pagingPage,
  selectedFollowUpRow,
  setSelectedFollowUpRow,
  deleteFollowUp,
  onRefresh,
  onCreateFollowUp,
  onUpdateFollowUp,
  orderRowByHeader,
}: EmsFollowUpProps) => {
  return (
    <div style={{ height: "100%" }}>
      <EmsFollowUpGrid
        setPagingPage={setPagingPage}
        setPagingLimit={setPagingLimit}
        rowsLen={rowsLen}
        loading={loading}
        rows={rows}
        pagingLimit={pagingLimit}
        pagingPage={pagingPage}
        deleteFollowUp={deleteFollowUp}
        onRefresh={onRefresh}
        onCreateFollowUp={onCreateFollowUp}
        onUpdateFollowUp={onUpdateFollowUp}
        setSelectedFollowUpRow={setSelectedFollowUpRow}
        selectedFollowUpRow={selectedFollowUpRow}
        orderRowByHeader={orderRowByHeader}
      />
    </div>
  );
};

export default EmsFollowUp;
