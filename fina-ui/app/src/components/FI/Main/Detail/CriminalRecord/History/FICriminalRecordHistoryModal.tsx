import React, { useState } from "react";
import FIHistoryModal from "../../../../../common/Modal/FIHistoryModal";
import { FI_CRIMINAL_HISTORY_TABLE_KEY } from "../../../../../../api/TableCustomizationKeys";
import { GridColumnType } from "../../../../../../types/common.type";

interface FICriminalRecordHistoryModalProps {
  filterOnChangeFunction?: (filter: any) => void;
  columns: GridColumnType[];
  data: any[];
  onCloseHistoryClick: () => void;
  loading: boolean;
  setColumns: React.Dispatch<React.SetStateAction<GridColumnType[]>>;
}

const FICriminalRecordHistoryModal: React.FC<
  FICriminalRecordHistoryModalProps
> = ({
  filterOnChangeFunction,
  columns,
  data,
  onCloseHistoryClick,
  loading,
  setColumns,
}) => {
  const [pagingPage, setPagingPage] = useState<number>(1);
  const [pagingLimit, setPagingLimit] = useState<number>(25);
  const [totalResults] = useState<number>(0);

  const onPagingLimitChange = (limit: number) => {
    setPagingPage(1);
    setPagingLimit(limit);
  };

  return (
    <FIHistoryModal
      onCloseHistoryClick={onCloseHistoryClick}
      data={data}
      filterOnChangeFunction={filterOnChangeFunction}
      columns={columns}
      totalResults={totalResults}
      pagingPage={pagingPage}
      onPagingLimitChange={onPagingLimitChange}
      setPagingPage={setPagingPage}
      pagingLimit={pagingLimit}
      loading={loading}
      setColumns={setColumns}
      tableKey={FI_CRIMINAL_HISTORY_TABLE_KEY}
    />
  );
};

export default FICriminalRecordHistoryModal;
