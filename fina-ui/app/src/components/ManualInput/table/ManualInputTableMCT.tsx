import React, { useEffect } from "react";
import ManualInputTableMCTVirtualized from "./ManualInputTableMCTVirtualized";
import { useTheme } from "@mui/material/styles";
import {
  MiProcess,
  MiTable,
  MiTableRow,
} from "../../../types/manualInput.type";

interface ManualInputTableMCTProps {
  tableInfo: MiTable;
  miProcess: MiProcess;
  getFormattedValue: (value: string) => string;
  dateFormat: string;
  dateTimeFormat: string;
  scrollElement: HTMLElement | null;
  calculatedTableWidth: number;
}

const ManualInputTableMCT: React.FC<ManualInputTableMCTProps> = ({
  tableInfo,
  miProcess,
  getFormattedValue,
  dateFormat,
  dateTimeFormat,
  scrollElement,
  calculatedTableWidth,
}) => {
  const header = tableInfo.rows[0].rowItems;
  const theme = useTheme();

  const virtualizedHeader = () => {
    const result: any = [];

    header.forEach((headerItem, index) => {
      result.push({
        label: headerItem.description,
        dataKey: "column_" + index,
        maxWidth: index === 0 ? 300 : 300,
        minWidth: 300,
        height: "100%",
        flexGrow: 1,
        overflow: index === 0 && "visible",
        position: index === 0 && "sticky",
        left: index === 0 && "0",
        zIndex: index === 0 && "999999999",
        fontSize: "10px",
        color: "grey",
        fontWeight: "bold",
        marginLeft: 0,
        background: (theme as any).palette.paperBackground,
      });
    });

    return result;
  };

  const vHeader = virtualizedHeader();

  const virtualizedRows = () => {
    const result: MiTableRow[] = [];

    tableInfo.rows.forEach((row, rowIndex) => {
      if (rowIndex > 0) {
        // skip header
        const vRowItem: any = {
          id: rowIndex,
          rowItems: row.rowItems,
        };
        row.rowItems.forEach((r, i) => {
          vRowItem["column_" + i] = r.value;
        });
        result.push(vRowItem);
      }
    });

    return result;
  };

  const vRows = virtualizedRows();

  useEffect(() => {
    miProcess.recalculateAll();
  }, []);

  return (
    scrollElement && (
      <ManualInputTableMCTVirtualized
        tableInfo={tableInfo}
        miProcess={miProcess}
        getFormattedValue={getFormattedValue}
        dateFormat={dateFormat}
        dateTimeFormat={dateTimeFormat}
        scrollElement={scrollElement}
        rowCount={vRows.length}
        rowGetter={({ index }: { index: number }) => vRows[index]}
        columns={vHeader}
        calculatedTableWidth={calculatedTableWidth}
      />
    )
  );
};

export default ManualInputTableMCT;
