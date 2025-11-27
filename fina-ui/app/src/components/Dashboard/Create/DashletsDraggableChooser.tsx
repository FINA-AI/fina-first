import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  DragDropContextProps,
  Draggable,
  Droppable,
} from "react-beautiful-dnd";
import { Box } from "@mui/system";
import { Grid } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import DashletAutocomplete from "./DashletAutocomplete";
import {
  DashboardColumnType,
  DashletType,
} from "../../../types/dashboard.type";
import { styled } from "@mui/material/styles";

interface ColumnType {
  id: string | number;
  list: DashletType[];
}
interface DashletsDraggableChooserProps {
  selectedLayout: { id: number; name: string; len: number };
  dashlets: DashletType[];
  setDashlets: (value: DashletType[]) => void;
  columns: DashboardColumnType;
  setColumns: React.Dispatch<React.SetStateAction<DashboardColumnType>>;
}

const StyledDraggableContainer = styled(Grid)(({ theme }) => ({
  padding: "8px",
  border: `1px solid ${
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.32)" : "#EAEBF0"
  }`,
  background: theme.palette.mode === "dark" ? "inherit" : "#F9F9F9",
  borderRadius: "4px",
  maxHeight: "330px",
  overflow: "hidden auto",
  flexDirection: "column",
  flex: "1",
  overflowY: "auto",
  display: "flex",
  height: "100%",
}));

const StyledAddNewBox = styled(Box)(({ theme }) => ({
  display: "flex",
  padding: "4px 8px",
  color: theme.palette.primary.main,
  fontWeight: 500,
  fontSize: "12px",
  lineHeight: "16px",
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: "13px",
  alignItems: "center",
  cursor: "pointer",
  maxWidth: "fit-content",
  "& .MuiSvgIcon-root": {
    color: theme.palette.primary.main,
    width: "16px",
    height: "16px",
  },
}));

const StyledDraggableItemContainer = styled(Box)(({ theme }) => ({
  border: `1px solid ${
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.32)" : "#EAEBF0"
  }`,
  borderRadius: "13px",
  background: (theme as any).palette.paperBackground,
  display: "flex",
  width: "100%",
  marginBottom: "5px",
}));

const StyledDraggableItem = styled(Box)({
  padding: "4px 8px",
  fontWeight: 500,
  fontSize: "12px",
  lineHeight: "16px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
});

const StyledTextBox = styled(Box)({
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  lineBreak: "anywhere",
  fontWeight: 500,
  fontSize: "12px",
  lineHeight: "16px",
  textTransform: "capitalize",
});

const StyledClearIcon = styled(ClearIcon)({
  color: "#98A7BC",
  width: "16px",
  height: "16px",
  position: "relative",
  right: "0px",
  cursor: "default",
  padding: "2px",
});

const DashletsDraggableChooser: React.FC<DashletsDraggableChooserProps> = ({
  selectedLayout,
  dashlets,
  setDashlets,
  columns,
  setColumns,
}) => {
  const { t } = useTranslation();
  const [popoverInfo, setPopoverInfo] = useState<{
    isOpen: boolean;
    selectedColumn: ColumnType;
  }>({
    isOpen: false,
    selectedColumn: {} as ColumnType,
  });

  useEffect(() => {
    if (selectedLayout) {
      initColumns();
    }
  }, [selectedLayout]);

  const handleClick = (column: ColumnType) => {
    setPopoverInfo({ isOpen: true, selectedColumn: column });
  };

  const handleClose = () => {
    setPopoverInfo({
      isOpen: false,
      selectedColumn: {} as ColumnType,
    });
  };

  const getListData = (layout: string, index: number) => {
    let result: DashletType[] = [];

    if (columns && columns[layout] && columns[layout].list) {
      result = [...columns[layout].list];
    }

    let layoutLength = selectedLayout.len;

    if (columns && columns[layout]) {
      if (
        Object.values(columns).length === 3 &&
        layoutLength === 1 &&
        index === 1
      ) {
        if (columns[`Column3`].list && columns[`Column2`].list) {
          result = [...result, ...columns[`Column3`].list];
          result = [...result, ...columns[`Column2`].list];
        }
      } else if (
        Object.values(columns).length === 3 &&
        layoutLength === 2 &&
        index === 1
      ) {
        if (columns[`Column3`].list) {
          result = [...result, ...columns[`Column3`].list];
        }
      } else if (
        Object.values(columns).length === 2 &&
        layoutLength === 1 &&
        index === 1
      ) {
        if (columns[`Column2`].list) {
          result = [...result, ...columns[`Column2`].list];
        }
      }
    }

    return result;
  };

  const initColumns = () => {
    let result: DashboardColumnType = {};
    for (let i = 1; i <= selectedLayout.len; i++) {
      let name = `Column${i}`;
      result = { ...result, [name]: { id: name, list: getListData(name, i) } };
    }

    setColumns(result);
  };

  const addDashlet = (dashlet: DashletType) => {
    let result: DashboardColumnType = { ...columns };
    const columnId = popoverInfo.selectedColumn.id;
    result[`${columnId}`].list.push(dashlet);
    setDashlets(dashlets.filter((item) => item.id !== dashlet.id));
    setColumns(result);
    handleClose();
  };

  const removeDashlet = (column: ColumnType, dashlet: DashletType) => {
    let result: DashboardColumnType = { ...columns };
    result[column.id].list = result[column.id].list.filter(
      (item: DashletType) => item.id !== dashlet.id
    );
    setColumns(result);
    setDashlets([...dashlets, dashlet]);
  };

  const onDragEnd: DragDropContextProps["onDragEnd"] = ({
    source,
    destination,
  }) => {
    // Make sure we have a valid destination
    if (destination === undefined || destination === null) return null;

    // Make sure we're actually moving the item
    if (
      source.droppableId === destination.droppableId &&
      destination.index === source.index
    )
      return null;

    // Set start and end variables
    const start = columns[source.droppableId];
    const end = columns[destination.droppableId];

    // If start is the same as end, we're in the same column
    if (start === end) {
      // Move the item within the list
      // Start by making a new list without the dragged item
      const newList = start.list.filter(
        (item, index) => index !== source.index
      );

      // Then insert the item at the right location
      newList.splice(destination.index, 0, start.list[source.index]);

      // Then create a new copy of the column object
      const newCol = {
        id: start.id,
        list: newList,
      };

      // Update the state
      setColumns((state) => ({ ...state, [newCol.id]: newCol }));
      return null;
    } else {
      // If start is different from end, we need to update multiple columns
      // Filter the start list like before
      const newStartList = start.list.filter(
        (item, index) => index !== source.index
      );

      // Create a new start column
      const newStartCol = {
        id: start.id,
        list: newStartList,
      };

      // Make a new end list array
      const newEndList = end.list;

      // Insert the item into the end list
      newEndList.splice(destination.index, 0, start.list[source.index]);

      // Create a new end column
      const newEndCol = {
        id: end.id,
        list: newEndList,
      };

      // Update the state
      setColumns((state) => ({
        ...state,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol,
      }));
      return null;
    }
  };

  const isAddNewDashelDisabled = () => {
    return !dashlets || dashlets.length === 0;
  };

  return (
    columns && (
      <DragDropContext onDragEnd={onDragEnd}>
        <Box
          display={"flex"}
          height={"100%"}
          padding={"0px 12px"}
          overflow={"hidden"}
          data-testid={"dashlets-chooser-container"}
        >
          <Grid
            container
            display={"flex"}
            height={"100%"}
            width={"100%"}
            justifyContent={"space-between"}
            flexDirection={"row"}
          >
            {Object.values(columns).map((col, columnIndex) => (
              <Droppable droppableId={col.id.toString()} key={columnIndex}>
                {(provided) => (
                  <StyledDraggableContainer
                    item
                    // xs={12 / selectedLayout.len}
                    key={columnIndex}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      marginRight:
                        columnIndex + 1 !== selectedLayout.len ? "10px" : "0px",
                    }}
                  >
                    {col.list.map((item, index) => (
                      <Draggable
                        draggableId={String(item.id)}
                        index={index}
                        key={item.id.toString()}
                      >
                        {(provided) => (
                          <StyledDraggableItemContainer
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            minWidth={"0px"}
                          >
                            <StyledDraggableItem
                              minWidth={"0px"}
                              data-testid={"item-" + index}
                            >
                              <Box display={"flex"} minWidth={"0px"}>
                                <StyledTextBox minWidth={"0px"}>
                                  {item.name}
                                </StyledTextBox>
                              </Box>
                              <StyledClearIcon
                                onClick={() => removeDashlet(col, item)}
                                data-testid={"remove-icon"}
                              />
                            </StyledDraggableItem>
                          </StyledDraggableItemContainer>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {popoverInfo?.selectedColumn.id === col.id &&
                    popoverInfo?.isOpen ? (
                      <Box maxWidth={"200px"}>
                        <DashletAutocomplete
                          label={""}
                          data={dashlets}
                          selectedItem={null}
                          displayFieldName={"name"}
                          valueFieldName={"id"}
                          onChange={(dashlet: DashletType) => {
                            if (typeof dashlet === "object") {
                              addDashlet(dashlet);
                            }
                          }}
                          size={"small"}
                          placeholder={t("typeTextHere")}
                          onClose={() =>
                            setPopoverInfo({
                              isOpen: false,
                              selectedColumn: {} as ColumnType,
                            })
                          }
                        />
                      </Box>
                    ) : (
                      <StyledAddNewBox
                        onClick={() => {
                          !isAddNewDashelDisabled() && handleClick(col);
                        }}
                        style={{ opacity: isAddNewDashelDisabled() ? 0.5 : 1 }}
                        data-testid={"add-dashlet-button"}
                      >
                        <AddIcon style={{ marginRight: "5px" }} />
                        <span>{t("addNew")}</span>
                      </StyledAddNewBox>
                    )}
                  </StyledDraggableContainer>
                )}
              </Droppable>
            ))}
          </Grid>
        </Box>
      </DragDropContext>
    )
  );
};

export default DashletsDraggableChooser;
