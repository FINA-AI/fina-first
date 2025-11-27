import FITreeGrid from "../../../FI/FITreeGrid";
import React, { useEffect, useMemo, useState } from "react";
import { loadFiTree } from "../../../../api/services/fi/fiService";
import { useSnackbar } from "notistack";
import { FiDataType, FiType } from "../../../../types/fi.type";
import { FiTree } from "../../../../types/fiTree.type";

interface ReportGenerationFITreeProps {
  onSelectRowFun: (rows: FiTree[]) => void;
  data?: FiTree[];
  isDestinationGrid: boolean;
  reportGenerationTypesData?: any;
  rManagerHelperType: string;
}

const ReportGenerationFITree: React.FC<ReportGenerationFITreeProps> = ({
  onSelectRowFun,
  data,
  isDestinationGrid,
  reportGenerationTypesData,
  rManagerHelperType,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [checkedRows, setCheckedRows] = useState<FiType[]>([]);
  const [fiTypes, setFiTypes] = useState<FiType[]>([]);
  const [fi, setFi] = useState<FiTree[]>([]);

  useEffect(() => {
    if (!isDestinationGrid) {
      loadFis();
    }
  }, []);

  useEffect(() => {
    if (isDestinationGrid && data) {
      setFi(data);
    }
    if (rManagerHelperType === "destination" && data) {
      let children: FiDataType[] = [];
      for (let child of data) {
        const fis = child.fis;
        if (fis) children = children.concat(fis);
      }

      let childrenIds = children.map((item) => item.id);
      let checkedRowsData = [];
      for (let row of checkedRows) {
        if (childrenIds.includes(row.id)) {
          checkedRowsData.push(row);
        }
      }

      setCheckedRows(checkedRowsData);
    }
  }, [data]);

  const loadFis = () => {
    if (reportGenerationTypesData && reportGenerationTypesData["Bank"]) {
      let result = reportGenerationTypesData["Bank"].map((item: FiTree) =>
        item?.fis.length > 0
          ? { ...item, fis: item.fis.map((fi) => ({ ...fi, level: 1 })) }
          : item
      );
      let parents: FiType[] = [];
      for (let fi of result) {
        parents.push(fi.parent);
      }
      setFiTypes(parents);
      setFi(result);
    } else {
      loadFiTree()
        .then((res) => {
          let parents = [];
          for (let fi of res.data) {
            parents.push(fi.parent);
          }
          setFiTypes(parents);
          setFi(res.data);
        })
        .catch((error) => enqueueSnackbar(error, { variant: "error" }));
    }
  };

  const onChange = (selectedRows: any, allRows: any) => {
    let res: FiTree[] = [];
    if (allRows.length === 0) return onSelectRowFun(res);
    for (let fiType of fiTypes) {
      const fis = allRows.filter(
        (child: any) => child.parentId === fiType.id && child.level !== 0
      );
      if (fis.length === 0) continue;
      res.push({
        fis: fis,
        parent: { ...fiType },
      });
    }
    onSelectRowFun(res);
  };

  const getMemoizedFis = useMemo(() => {
    return fi.filter((child) => child.fis && child.fis.length > 0);
  }, [fi]);

  return (
    <FITreeGrid
      onChange={(selectedRows: any, allRows) => {
        isDestinationGrid
          ? onSelectRowFun(selectedRows)
          : onChange(selectedRows, allRows);
        setCheckedRows(selectedRows);
      }}
      checkedRows={checkedRows}
      data={getMemoizedFis}
      defaultExpanded={isDestinationGrid}
    />
  );
};

export default ReportGenerationFITree;
