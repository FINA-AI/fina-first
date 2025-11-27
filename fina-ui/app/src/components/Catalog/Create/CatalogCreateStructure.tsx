import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import DeleteIcon from "@mui/icons-material/Delete";
import SelectorBtn from "../../common/Button/SelectorBtn";
import CheckboxBtn from "../../common/Checkbox/CheckboxBtn";
import TextField from "../../common/Field/TextField";
import Select from "../../common/Field/Select";
import { useTranslation } from "react-i18next";
import { FieldDataType } from "../../../util/component/fieldUtil";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { Box } from "@mui/material";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import * as React from "react";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { CatalogCreateStructureRow } from "../../../types/catalog.type";

interface CatalogCreateStructureProps {
  structureRowsRef: Partial<CatalogCreateStructureRow>[];
  isDisabled: boolean;
  activeStep: number;
  isEdit: boolean;
  checkDateFormat(format?: string): boolean;
  reorderRows(rows: Partial<CatalogCreateStructureRow>[]): void;
  onStructureRowRemove(rowIndex?: number): void;
  onStructureRowAdd(object: Partial<CatalogCreateStructureRow>): void;
  onStructureRowsChange(object: Partial<CatalogCreateStructureRow>): void;
}

const dataTypes = [
  {
    label: "String",
    value: FieldDataType._STRING,
  },
  {
    label: "Number",
    value: FieldDataType._NUMBER,
  },
  {
    label: "Date",
    value: FieldDataType._DATE,
  },
  {
    label: "Integer",
    value: FieldDataType._INTEGER,
  },
];

const StyledRoot = styled(Box)({
  padding: 16,
  height: "100%",
  width: "100%",
  boxSizing: "border-box",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  "& .MuiFormControlLabel-root": {
    marginRight: "12px",
  },
  "& .MuiListItem-secondaryAction": {
    paddingRight: "0 !important",
  },
  "& .MuiCheckbox-root": {
    padding: "0px",
    paddingRight: "5px",
  },
  "& .MuiFormControl-root": {
    paddingRight: "8px",
  },
  "& .MuiButton-root": {
    left: "82%",
  },
  "& .MuiListItem-container": {
    paddingTop: "8px",
    height: "36px",
    "&:first-child": {
      paddingTop: "0px",
    },
  },
  "& .MuiListItem-root": {
    padding: "6px",
    "& .MuiButtonBase-root": {
      padding: "0px 8px",
      "&:hover": {
        background: "none",
      },
    },
  },
});

const StyledCheckboxContainer = styled(Box)({
  marginLeft: "4px",
  display: "inline-flex",
  height: "32px",
});

const StyledDeleteIconButton = styled(IconButton)(() => ({
  right: "10px",
  padding: "0px",
  cursor: "pointer",
  "& .MuiButtonBase-root": {
    padding: "0px",
  },
  "& .MuiSvgIcon-root": {
    color: "#FF4128",
  },
  display: "none",
}));

const commonItemStyles = {
  boxSizing: "border-box",
  alignItems: "center",
  "&:hover": {
    "& #deleteIcon": {
      display: "block",
    },
    "& #filler": {
      display: "none",
    },
  },
};

const StyledListItem = styled(ListItem)(
  ({ theme, isDragging }: { theme?: any; isDragging: boolean }) => ({
    ...(isDragging
      ? ({ background: theme.palette.paperBackground } as any)
      : ({ ...commonItemStyles } as any)),
  })
);

const StyledItemBox = styled(Box)({
  ...(commonItemStyles as any),
});

const StyledAddNewButtonContainer = styled(Box)({
  width: "100%",
  position: "sticky",
  top: -10,
  zIndex: 9999,
  "& .MuiButton-root": {
    margin: "0px !important",
  },
});

const StyledRowsContainer = styled(Box)({
  height: "190px",
  overflowX: "hidden",
  overflowY: "auto",
  top: "10px",
  position: "relative",
});

const CatalogCreateStructure: React.FC<CatalogCreateStructureProps> = ({
  isEdit,
  checkDateFormat,
  onStructureRowsChange,
  onStructureRowRemove,
  structureRowsRef,
  onStructureRowAdd,
  isDisabled,
  activeStep,
  reorderRows,
}) => {
  const { t } = useTranslation();
  const [rows, setRows] = useState<Partial<CatalogCreateStructureRow>[]>([]);

  const updateRows = () => {
    setRows([...structureRowsRef]);
  };

  useEffect(() => {
    updateRows();
  }, [isDisabled, activeStep]);

  const addRow = () => {
    const itemIdx = getRowIdx();
    const obj = {
      itemIdx,
      name: "",
      type: "STRING",
      format: "",
      key: rows.length === 0,
      required: rows.length === 0,
      id: 0,
    };
    setRows([
      ...rows,
      {
        ...obj,
      },
    ]);
    onStructureRowAdd(obj);
  };

  const removeRow = (itemIdx?: number) => {
    const filteredRows = rows.filter((row) => row.itemIdx != itemIdx);
    setRows(filteredRows);
    onStructureRowRemove(itemIdx);
  };

  const updateRow = (row: Partial<CatalogCreateStructureRow>) => {
    onStructureRowsChange(row);
    setRows((prevRows) => {
      return prevRows.map((pRow) =>
        pRow.itemIdx === row.itemIdx ? row : pRow
      );
    });
  };

  const isRequiredCheckboxDisabled = (
    row: Partial<CatalogCreateStructureRow>
  ) => {
    if (isEdit) {
      return row.id !== 0;
    } else {
      return !!row.key;
    }
  };

  const textFormatterDisabled = (row: Partial<CatalogCreateStructureRow>) => {
    if (isEdit) {
      return row.id !== 0 ? true : row.type === "STRING";
    } else {
      return row.type === "STRING";
    }
  };

  const onKeyCheckboxClick = (
    row: Partial<CatalogCreateStructureRow>,
    value: boolean
  ) => {
    let rowName = structureRowsRef?.find(
      (r) => r.itemIdx === row.itemIdx
    )?.name;
    if (value) {
      const rowArray = [...rows];
      rowArray.map((r) => (r.key = false));

      const currentRow = (r: Partial<CatalogCreateStructureRow>) =>
          r.itemIdx == row.itemIdx,
        index = rowArray.findIndex(currentRow);
      row.key = true;
      row.required = true;
      rowArray[index] = row;
      setRows(rowArray);
      updateRow({
        ...row,
        key: true,
        name: rowName,
      });
    } else {
      updateRow({
        ...row,
        key: value,
        name: rowName,
      });
    }
  };

  const onChangeDataType = (
    row: Partial<CatalogCreateStructureRow>,
    value: string
  ) => {
    if (row.key && value !== FieldDataType._STRING) {
      updateRow({ ...row, type: value, key: false });
      setRows([
        ...rows.map((rowItem) => {
          return rowItem.itemIdx === row.itemIdx
            ? { ...row, type: value, key: false }
            : rowItem;
        }),
      ]);
    } else {
      updateRow({ ...row, type: value });
      setRows([
        ...rows.map((rowItem) => {
          return rowItem.itemIdx === row.itemIdx
            ? { ...row, type: value }
            : rowItem;
        }),
      ]);
    }
  };

  const reorder = (
    list: Partial<CatalogCreateStructureRow>[] = [],
    startIndex: number,
    endIndex: number
  ) => {
    const result = list;
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    result.map((r, index) => {
      r.sequence = index;
      r.itemIdx = index;
      return r;
    });

    return result;
  };

  const drop = ({ destination, source }: { destination: any; source: any }) => {
    if (!destination) return;
    const newItems = reorder(rows, source.index, destination.index);
    setRows(newItems);
    reorderRows(newItems);
  };

  const getListItem = (
    row: Partial<CatalogCreateStructureRow>,
    index: number
  ) => {
    return (
      <StyledItemBox key={index}>
        <Draggable
          draggableId={`${index}`}
          index={index}
          isDragDisabled={false}
          key={index}
        >
          {(provided, snapshot) => (
            <StyledListItem
              isDragging={snapshot.isDragging}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              disableGutters={true}
            >
              <IconButton
                edge="start"
                size="large"
                style={{ border: "none", background: "none" }}
              >
                <DragIndicatorIcon />
              </IconButton>
              <TextField
                width={173}
                label={t("name")}
                value={row.name}
                onChange={(value: string) => {
                  updateRow({ ...row, name: value });
                }}
                fieldName={"name"}
              />
              <Select
                width={160}
                disabled={
                  (rows.filter((row) => row.type === FieldDataType._STRING)
                    .length === 1 &&
                    row.type === FieldDataType._STRING) ||
                  row.id !== 0 ||
                  row.key
                }
                label={t("dataType")}
                data={dataTypes}
                value={row.type}
                size={"default"}
                onChange={(value) => {
                  onChangeDataType(row, value);
                }}
                data-testid={"data-type-select"}
              />
              <TextField
                width={170}
                isDisabled={() => textFormatterDisabled(row)}
                isError={
                  row.type === "DATE" ? checkDateFormat(row.format) : false
                }
                label={t("dataFormat")}
                value={row.format}
                onChange={(value: string) => {
                  updateRow({
                    ...row,
                    format: value,
                  });
                }}
                fieldName={"data-format"}
              />
              <StyledCheckboxContainer>
                <CheckboxBtn
                  label={t("key")}
                  disabled={isEdit || row.type != FieldDataType._STRING}
                  onClick={(event: any) => {
                    onKeyCheckboxClick(row, event.target.checked);
                  }}
                  checked={row.key}
                  data-testid={"key-checkbox"}
                />

                <CheckboxBtn
                  label={t("isRequired")}
                  disabled={() => isRequiredCheckboxDisabled(row)}
                  onClick={(event) => {
                    setRows((prevState) => {
                      return prevState.map((r) => {
                        if (r.itemIdx === row.itemIdx) {
                          return { ...r, required: event.target.checked };
                        }
                        return r;
                      });
                    });
                    updateRow({ ...row, required: event.target.checked });
                  }}
                  checked={row.required}
                  data-testid={"required-checkbox"}
                />
                <Box display={"flex"} alignItems={"center"}>
                  {(isEdit && row.id !== 0) ||
                    (!row.key && (
                      <StyledDeleteIconButton
                        id={"deleteIcon"}
                        disabled={isEdit && row.id === 0}
                        edge="end"
                        style={{ background: "none", border: "none" }}
                        size="large"
                        onClick={() =>
                          isEdit && row.id ? null : removeRow(row.itemIdx)
                        }
                        data-testid={"delete-button"}
                      >
                        {!isEdit ? (
                          <DeleteIcon />
                        ) : (
                          row.id === 0 && <DeleteIcon />
                        )}
                      </StyledDeleteIconButton>
                    ))}
                </Box>
                <IconButton
                  id={"filler"}
                  edge="end"
                  style={{
                    display: row.key ? "block" : "",
                    background: "none",
                    border: "none",
                    width: "40px",
                  }}
                  size="large"
                />
              </StyledCheckboxContainer>
            </StyledListItem>
          )}
        </Draggable>
      </StyledItemBox>
    );
  };

  const getRowIdx = () => {
    let result = 0;
    rows.map(
      (row: any) => (result = row?.itemIdx > result ? row.itemIdx : result)
    );
    return result !== 0 || rows.length === 1 ? result + 1 : result;
  };

  return (
    <StyledRoot data-testid={"structure-container"}>
      <StyledAddNewButtonContainer>
        <SelectorBtn
          label={t("addNew")}
          onClick={addRow}
          style={{ maxWidth: "120px" }}
          data-testid={"add-new-button"}
        />
      </StyledAddNewButtonContainer>
      <DragDropContext onDragEnd={drop}>
        <StyledRowsContainer>
          <Droppable droppableId={"list"}>
            {(provided) => (
              <List
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ padding: "0px" }}
              >
                {rows && rows.map((row, index) => getListItem(row, index))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </StyledRowsContainer>
      </DragDropContext>
    </StyledRoot>
  );
};

export default CatalogCreateStructure;
