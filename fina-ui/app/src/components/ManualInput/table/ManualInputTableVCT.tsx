import React, { useEffect, useState } from "react";
import { deleteRow, insertRow } from "../../../api/services/manualInputService";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import ManualInputTableVCTVirtualized from "./ManualInputTableVCTVirtualized";
import List from "@mui/material/List";
import {
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
} from "@mui/material";
import { EjectSharp } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import "./MiVirtualGridStyles.css";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/system";
import {
  MiProcess,
  MiTable,
  MiTableColumn,
  MiTableRow,
} from "../../../types/manualInput.type";
import { UIEventType } from "../../../types/common.type";
import { Return } from "../../../types/return.type";
import { ReturnStatus } from "../../../types/returnManager.type";

export interface ManualInputTableVCTProps {
  tableInfo: MiTable;
  miProcess: MiProcess;
  getFormattedValue: (value: string) => string;
  dateFormat: string;
  dateTimeFormat: string;
  scrollElement: HTMLElement | null;
  calculatedTableWidth: number;
  tables: MiTable[];
  setTables: (tables: MiTable[]) => void;
  setIsLoadMask: (isLoading: boolean) => void;
  setIsLoading: React.Dispatch<
    React.SetStateAction<{ skeleton: boolean; mask: boolean }>
  >;
  currentReturn: Return;
}

const CustomListItem = styled(ListItemButton)(({ theme }) => ({
  padding: "0px 12px 6px 8px",
  "& .MuiTypography-root": {
    fontSize: "12px",
  },
  "& .MuiSvgIcon-root": {
    height: "16px",
  },
  "& .MuiListItemIcon-root": {
    minWidth: "28px",
  },
  "&:hover": {
    color: theme.palette.primary.main,
    "& .MuiListItemIcon-root": {
      color: theme.palette.primary.main,
    },
  },
  "&.Mui-selected": {},
}));

const ManualInputTableVCT: React.FC<ManualInputTableVCTProps> = ({
  tableInfo,
  miProcess,
  getFormattedValue,
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
  const header = tableInfo.rows[0].rowItems;
  const [anchor, setAnchor] = useState<Element | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const theme = useTheme();

  const [anchorPosition, setAnchorPosition] = useState({
    top: 200,
    left: 400,
  });
  const [selectedRowIndex, setSelectedRowIndex] = useState(-1);

  const isActionsDisabled =
    currentReturn.status === ReturnStatus.STATUS_ACCEPTED;

  const virtualizedHeader = () => {
    const result = [];
    //Row Numberer Column
    result.push({
      label: "#",
      dataKey: "column_#",
      width: 50,
      minWidth: 50,
      maxWidth: 50,
      flexGrow: 1,
      overflow: "visible",
      position: "sticky",
      left: "0",
      zIndex: "999999999",
      marginLeft: 0,
      height: "100%",
      background: (theme as any).palette.paperBackground,
    });

    header.forEach((headerItem: any, index: number) => {
      result.push({
        label: headerItem.description,
        dataKey: "column_" + index,
        width: 300,
        minWidth: 300,
        height: "100%",
        flexGrow: 1,
        fontSize: "10px",
        color: "grey",
        fontWeight: "bold",
      });
    });

    return result;
  };

  const vHeader: MiTableColumn[] = virtualizedHeader();
  vHeader.push({
    dataKey: "column_" + vHeader.length,
    width: 100,
    minWidth: 100,
    flexGrow: 1,
  });

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

  const onDeleteRowClick = (rowIndex: number) => {
    setIsLoading((prev) => ({ ...prev, mask: true }));
    setAnchor(null);
    if (tableInfo.rows.length > 2) {
      setIsLoadMask(true);

      deleteRowCall(
        tableInfo.rows[rowIndex + 1],
        tableInfo.rows.length - 2
      ).then((res) => {
        if (res.status === 200) {
          setIsLoading((prev) => ({ ...prev, mask: false }));
          tableInfo.rows.splice(rowIndex + 1, 1);

          //update rownumber for table data
          for (let i = rowIndex; i < tableInfo.rows.length; i++) {
            let row = tableInfo.rows[i];
            row.rowItems.forEach((rItem) => {
              rItem.rowNumber = i - 1;
            });
          }

          setTables([...tables]);
          setIsLoadMask(false);
        } else {
          enqueueSnackbar("Something Bad Happened, Contact Administrator!", {
            variant: "error",
          });
        }
      });
    }
  };

  const deleteRowCall = async (row: MiTableRow, maxRowNumber: number) => {
    return await deleteRow(row, maxRowNumber);
  };

  const insertRowCall = async (row: MiTableRow, maxRowNumber: number) => {
    return await insertRow(row, maxRowNumber);
  };

  const onInsertRowClick = (above: boolean) => {
    setIsLoading((prev) => ({ ...prev, mask: true }));
    setAnchor(null);
    setIsLoadMask(true);

    let rowItem = tableInfo.rows[selectedRowIndex + 1];
    let clonedTableInfo = { ...tableInfo };
    let toBeInserted = clonedTableInfo.rows[0];
    toBeInserted.rowItems.forEach((item) => {
      if (item.dataType === "NUMERIC") {
        item.value = "0.0";
      } else {
        item.value = "";
      }
      item.value = "";
      item.nvalue = 0;
      let rNumber = above
        ? rowItem.rowItems[0].rowNumber
        : rowItem.rowItems[0].rowNumber + 1;
      item.rowNumber = rNumber < 0 ? 0 : rNumber;
    });

    insertRowCall(toBeInserted, tableInfo.rows.length - 2).then((res) => {
      if (res.status === 200) {
        setIsLoading((prev) => ({ ...prev, mask: false }));
        const insertedRow = res.data;

        tableInfo.rows.splice(
          above ? selectedRowIndex + 1 : selectedRowIndex + 2,
          0,
          insertedRow
        );
        //update rownumber for table data
        let startIndex = selectedRowIndex + (above ? 2 : 3);

        for (let i = startIndex; i < tableInfo.rows.length; i++) {
          let row = tableInfo.rows[i];
          row.rowItems.forEach((rItem) => {
            rItem.rowNumber = above ? i - 1 : i;
          });
        }
        setTables([...tables]);
        setIsLoadMask(false);
      } else {
        enqueueSnackbar("Something Bad Happened, Contact Administrator!", {
          variant: "error",
        });
      }
    });
  };

  const onContextMenuClick = (e: UIEventType, rowIndex: number) => {
    e.preventDefault();
    setAnchorPosition({ top: e.clientY, left: e.clientX });
    setAnchor(e.currentTarget);
    setSelectedRowIndex(rowIndex);
  };

  const handlePopoverClose = () => {
    setAnchor(null);
  };

  const getRowInsertComponent = () => {
    return (
      <List
        component="nav"
        aria-label="main mailbox folders"
        sx={{ paddingTop: "6px", paddingBottom: "0px" }}
      >
        <CustomListItem
          onClick={() => {
            onInsertRowClick(true);
          }}
          disabled={isActionsDisabled}
        >
          <ListItemIcon>
            <EjectSharp />
          </ListItemIcon>
          <ListItemText primary={t("insertRowAbove")} />
        </CustomListItem>
        <Divider />
        <CustomListItem
          onClick={() => {
            onInsertRowClick(false);
          }}
          disabled={isActionsDisabled}
        >
          <ListItemIcon>
            <EjectSharp style={{ transform: "rotate(-180deg)" }} />
          </ListItemIcon>
          <ListItemText primary={t("insertRowBelow")} />
        </CustomListItem>
        <Divider />
        <CustomListItem
          disabled={isActionsDisabled || tableInfo.rows.length <= 2}
          onClick={() => {
            onDeleteRowClick(selectedRowIndex);
          }}
        >
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText primary={t("deleteRow")} />
        </CustomListItem>
      </List>
    );
  };

  return (
    scrollElement && (
      <>
        <ManualInputTableVCTVirtualized
          tableInfo={tableInfo}
          miProcess={miProcess}
          getFormattedValue={getFormattedValue}
          dateFormat={dateFormat}
          dateTimeFormat={dateTimeFormat}
          scrollElement={scrollElement}
          rowCount={vRows.length}
          rowGetter={({ index }: { index: number }) => vRows[index]}
          columns={vHeader}
          onDeleteRowClick={onDeleteRowClick}
          isDeleteDisabled={isActionsDisabled}
          onContextMenuClick={onContextMenuClick}
          calculatedTableWidth={calculatedTableWidth}
        />
        <Popover
          open={!!anchor}
          anchorEl={anchor}
          onClose={handlePopoverClose}
          anchorPosition={anchorPosition}
          anchorReference="anchorPosition"
          onContextMenu={(e) => {
            e.preventDefault();
            setAnchor(null);
          }}
        >
          {getRowInsertComponent()}
        </Popover>
      </>
    )
  );
};

export default ManualInputTableVCT;
