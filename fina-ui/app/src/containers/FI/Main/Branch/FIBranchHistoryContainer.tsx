import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import FIBranchHistoryModal from "../../../../components/FI/Main/Detail/Branch/History/FIBranchHistoryModal";
import {
  loadAllBranchHistory,
  loadBranchHistory,
} from "../../../../api/services/fi/FiHistoryService";
import { getFormattedDateValue } from "../../../../util/appUtil";
import useConfig from "../../../../hoc/config/useConfig";
import RevisionTypeColumnField from "../../../../components/common/History/RevisionTypeColumnField";
import { FilterType, GridColumnType } from "../../../../types/common.type";
import { BranchDataType } from "../../../../types/fi.type";

interface FIBranchHistoryContainerProps {
  onCloseHistoryClick: () => void;
  columns: GridColumnType[];
  state?: { columns: StateColumn[] };
  filterOnChangeFunction: (filters: FilterType[]) => void;
  fiId: number;
  branchId: number;
}

interface HistoryEntity {
  entity: BranchDataType;
  modifiedAt: string;
  modifiedBy: string;
  revisionNumber: number;
  revisionType: string;
}

interface StateColumn {
  field: string;
  hidden?: boolean;
  fixed?: boolean;
}

const FIBranchHistoryContainer: React.FC<FIBranchHistoryContainerProps> = ({
  onCloseHistoryClick,
  columns,
  state,
  filterOnChangeFunction,
  fiId,
  branchId,
}) => {
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();

  const commonColumns: GridColumnType[] = [
    {
      field: "modifiedAt",
      headerName: t("modifiedAt"),
      minWidth: 100,
      renderCell: (value: string) =>
        getFormattedDateValue(value, getDateFormat(true)),
    },
    {
      field: "revisionType",
      headerName: t("changeType"),
      minWidth: 100,
      hideCopy: true,
      renderCell: (value: string, row: any) => (
        <div style={{ width: "100px" }}>
          <RevisionTypeColumnField
            value={(row.deleted ? "DEL" : value) as "DEL" | "ADD" | "MOD"}
          />
        </div>
      ),
    },
  ];

  const generateColumns = (): GridColumnType[] => {
    const gridWidth = 900;
    const gridColWidth = 150;
    const gridColSize = columns.length;
    const isFlexColumn = gridColSize * gridColWidth <= gridWidth;

    return [...commonColumns, ...columns].map((item) => ({
      ...item,
      width: isFlexColumn ? 0 : gridColWidth,
    }));
  };

  const [historyColumns, setHistoryColumns] = useState<GridColumnType[]>(
    generateColumns()
  );
  const [data, setData] = useState<BranchDataType[]>([]);

  useEffect(() => {
    loadBranchHistoryData();
  }, []);

  const loadBranchHistoryData = async () => {
    let resp;
    if (branchId > 0) {
      //load curent  branch history data
      resp = await loadBranchHistory(branchId);
    } else {
      //load all branch history data
      resp = await loadAllBranchHistory(fiId);
    }

    const mappedData: BranchDataType[] = resp.data.list.map(
      (d: HistoryEntity) => ({
        ...d.entity,
        modifiedAt: d.modifiedAt,
        modifiedBy: d.modifiedBy,
        revisionNumber: d.revisionNumber,
        revisionType: d.revisionType,
      })
    );

    setData(mappedData);
  };

  useEffect(() => {
    if (state && state.columns) {
      let stateCols = state.columns.map((s) => {
        return s.field;
      });
      let headerCols = historyColumns.map((s) => {
        return s.field;
      });
      if (
        state.columns.length !== 0 &&
        stateCols.every((element) => {
          return headerCols.includes(element);
        })
      ) {
        let newCols = [...commonColumns];
        for (let item of state.columns) {
          let headerCell = columns.find((el) => item.field === el.field);
          if (headerCell) {
            headerCell.hidden = item.hidden;
            headerCell.fixed = item.fixed;
            newCols.push(headerCell);
          }
        }
        setHistoryColumns(newCols);
      } else {
        setHistoryColumns([...commonColumns, ...columns]);
      }
    }
  }, [state]);

  return (
    <FIBranchHistoryModal
      onCloseHistoryClick={onCloseHistoryClick}
      columns={historyColumns}
      data={data}
      filterOnChangeFunction={filterOnChangeFunction}
      setColumns={setHistoryColumns}
    />
  );
};

const mapStateToProps = (state: any) => ({
  state: state.getIn(["state", "FIBranchesHistory"]),
});

export default connect(mapStateToProps)(FIBranchHistoryContainer);
