import React from "react";
import ManualInputTableMCT from "./ManualInputTableMCT";
import ManualInputTableVCT from "./ManualInputTableVCT";
import numeral from "numeral";
import { styled } from "@mui/material/styles";
import { MiProcess, MiTable } from "../../../types/manualInput.type";
import { Return } from "../../../types/return.type";

export interface ManualInputTableProps {
  tableInfo: MiTable;
  miProcess: MiProcess;
  currentReturn: Return;
  numberFormat: string;
  dateFormat: string;
  dateTimeFormat: string;
  calculatedTableWidth: number;
  tables: MiTable[];
  setTables: (tables: MiTable[]) => void;
  setIsLoadMask: (isLoading: boolean) => void;
  scrollElement: HTMLElement | null;
  setIsLoading: React.Dispatch<
    React.SetStateAction<{ skeleton: boolean; mask: boolean }>
  >;
}

const StyledHeader = styled("span")(({ theme }) => ({
  fontSize: "12px",
  fontWeight: "bold",
  position: "sticky",
  left: 20,
  top: 20,
  color: (theme as any).palette.textColor,
}));

const ManualInputTable: React.FC<ManualInputTableProps> = ({
  tableInfo,
  miProcess,
  numberFormat,
  dateFormat,
  dateTimeFormat,
  tables,
  setTables,
  setIsLoadMask,
  scrollElement,
  calculatedTableWidth,
  setIsLoading,
  currentReturn,
}) => {
  const getFormattedValue = (inputValue: string) => {
    if (numberFormat && inputValue && !isNaN(Number(inputValue))) {
      return numeral(Number(inputValue)).format(numberFormat);
    }
    return inputValue;
  };

  const getTable = () => {
    switch (tableInfo.type) {
      case "MCT":
        return (
          <ManualInputTableMCT
            tableInfo={tableInfo}
            miProcess={miProcess}
            getFormattedValue={getFormattedValue}
            dateFormat={dateFormat}
            dateTimeFormat={dateTimeFormat}
            scrollElement={scrollElement}
            calculatedTableWidth={calculatedTableWidth}
          />
        );
      case "VCT":
        return (
          <ManualInputTableVCT
            tableInfo={tableInfo}
            miProcess={miProcess}
            getFormattedValue={getFormattedValue}
            dateFormat={dateFormat}
            dateTimeFormat={dateTimeFormat}
            tables={tables}
            setTables={setTables}
            setIsLoadMask={setIsLoadMask}
            scrollElement={scrollElement}
            calculatedTableWidth={calculatedTableWidth}
            setIsLoading={setIsLoading}
            currentReturn={currentReturn}
          />
        );
      default:
        break;
    }

    return <div> TODO - {tableInfo.type}</div>;
  };

  return (
    <div>
      <StyledHeader>{tableInfo.description}</StyledHeader>
      {getTable()}
    </div>
  );
};

export default ManualInputTable;
