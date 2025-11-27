import React, { useState } from "react";
import FIHistoryModal from "../../../../../common/Modal/FIHistoryModal";
import { FI_BRANCH_HISTORY_TABLE_KEY } from "../../../../../../api/TableCustomizationKeys";
import {
  FilterType,
  GridColumnType,
} from "../../../../../../types/common.type";

interface FIBranchHistoryModalProps {
  onCloseHistoryClick: () => void;
  columns: GridColumnType[];
  data: any[];
  setColumns: (cols: GridColumnType[]) => void;
  filterOnChangeFunction: (filters: FilterType[]) => void;
}

const FIBranchHistoryModal: React.FC<FIBranchHistoryModalProps> = ({
  onCloseHistoryClick,
  columns,
  data,
  filterOnChangeFunction,
  setColumns,
}) => {
  const [pagingPage, setPagingPage] = useState(1);
  const [pagingLimit] = useState(25);
  const [totalResults] = useState(0);

  return (
    <FIHistoryModal
      onCloseHistoryClick={onCloseHistoryClick}
      data={data}
      filterOnChangeFunction={filterOnChangeFunction}
      columns={columns}
      totalResults={totalResults}
      pagingPage={pagingPage}
      setPagingPage={setPagingPage}
      pagingLimit={pagingLimit}
      setColumns={setColumns}
      tableKey={FI_BRANCH_HISTORY_TABLE_KEY}
    />
  );
};

export default FIBranchHistoryModal;
