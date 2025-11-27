import React, { useEffect, useMemo, useState } from "react";
import FITreeGrid from "../../FI/FITreeGrid";
import { FiTree } from "../../../types/fiTree.type";
import { FiType } from "../../../types/fi.type";

interface ReportFiTreeProps {
  data?: FiTree[];
  expanded: boolean;
  checkedFis?: FiType[];
  onSelectionChange?: (checkedRows: FiType[], allRows?: FiType[]) => void;
}

const ReportFiTree: React.FC<ReportFiTreeProps> = ({
  data,
  expanded,
  checkedFis,
  onSelectionChange,
}) => {
  const [fiTreeData, setFiTreeData] = useState<FiTree[]>([]);

  useEffect(() => {
    if (data) {
      setFiTreeData(data);
    }
  }, [data]);

  const getMemoizedFis = useMemo(() => {
    return fiTreeData.filter((child) => child.fis && child.fis.length > 0);
  }, [fiTreeData]);

  return (
    <FITreeGrid
      onChange={(selectedRows: any, allRows) => {
        onSelectionChange && onSelectionChange(selectedRows, allRows);
      }}
      checkedRows={checkedFis}
      data={getMemoizedFis}
      defaultExpanded={expanded}
    />
  );
};

export default ReportFiTree;
