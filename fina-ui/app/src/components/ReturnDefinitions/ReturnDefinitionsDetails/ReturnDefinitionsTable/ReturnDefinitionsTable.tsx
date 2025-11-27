import ReturnDefinitionsTableCard from "./ReturnDefinitionsTableCard";
import { Box } from "@mui/system";
import ReturnDefinitionsTableCardEdit from "./ReturnDefinitionsTableCardEdit";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import useConfig from "../../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../../api/permissions";
import { styled } from "@mui/material/styles";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import React from "react";
import {
  ReturnDefinitionTable,
  ReturnDefinitionType,
} from "../../../../types/returnDefinition.type";

interface ReturnDefinitionsTableProps {
  tables: ReturnDefinitionTable[];
  setTables: (tables: ReturnDefinitionTable[]) => void;
  setCurrentReturnDefinition: React.Dispatch<
    React.SetStateAction<ReturnDefinitionType>
  >;
  currentReturnDefinition: ReturnDefinitionType;
  saveReturnDefinition: (data: ReturnDefinitionType) => void;
  generalInfoEditMode: boolean;
  isAddNewOpen: boolean;
  setIsAddNewOpen: (value: boolean) => void;
  setShowReorderTableSave: (value: boolean) => void;
}

const StyledAddNewBox = styled(Box)(({ theme }: { theme: any }) => ({
  padding: "8px 16px",
  color: theme.palette.primary.main,
  lineHeight: "16px",
  fontSize: "11px",
  fontWeight: 400,
  background: theme.palette.paperBackground,
  borderRadius: "4px",
  border: theme.palette.borderColor,
  marginTop: "8px",
  cursor: "pointer",
  "&:hover": {
    border: `1px solid ${theme.palette.primary.main}`,
  },
}));

const StyledAddNewBtn = styled(Box)({
  cursor: "pointer",
  display: "flex",
  width: "fit-content",
  "& .MuiSvgIcon-root": {
    width: "15px",
    height: "15px",
    marginLeft: "5px",
  },
});

const ReturnDefinitionsTable: React.FC<ReturnDefinitionsTableProps> = ({
  tables,
  setTables,
  currentReturnDefinition,
  setCurrentReturnDefinition,
  saveReturnDefinition,
  generalInfoEditMode,
  isAddNewOpen,
  setIsAddNewOpen,
  setShowReorderTableSave,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { hasPermission } = useConfig();

  const onSave = (newTable: ReturnDefinitionTable, index: number) => {
    const { node, code, type, visibleLevel } = newTable;
    const saveAllowed =
      type === "VCT"
        ? Boolean(node && code && type && visibleLevel)
        : Boolean(node && code && type);

    if (saveAllowed) {
      let updatedTables;

      if (isAddNewOpen) {
        updatedTables = [...tables, newTable];
      } else {
        if (index === -1) {
          updatedTables = [...tables, newTable];
        } else {
          updatedTables = tables.map((item, i) =>
            i === index ? newTable : item
          );
        }
      }

      if (!currentReturnDefinition.id) {
        setCurrentReturnDefinition({
          ...currentReturnDefinition,
          tables: updatedTables,
        });
      } else {
        saveReturnDefinition({
          ...currentReturnDefinition,
          tables: updatedTables,
        });
      }

      setTables(updatedTables);
      setIsAddNewOpen(false);
    } else {
      const requiredFields =
        ": " +
        [
          !newTable.code && t("code"),
          !newTable.visibleLevel && t("summeryrow"),
          !newTable.type && t("returnType"),
          !newTable.node && t("chooseMDTFile"),
        ]
          .filter(Boolean)
          .join(", ");

      enqueueSnackbar([t("requiredFieldsAreEmpty"), requiredFields], {
        variant: "error",
      });
    }
  };
  const onDelete = (tableIndex: number) => {
    setTables(tables.filter((_, index) => index !== tableIndex));
  };

  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    if (!destination || source.index === destination.index) return;

    const reordered: ReturnDefinitionTable[] = reorder(
      tables,
      source.index,
      destination.index
    );

    const updatedTables = reordered.map((item, index) => ({
      ...item,
      sequence: index + 1,
    }));

    setTables(updatedTables);
    setShowReorderTableSave(true);
  };

  const reorder = (
    list: ReturnDefinitionTable[],
    startIndex: number,
    endIndex: number
  ) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  return (
    <Box width="100%">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="return-definitions">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {tables
                ?.sort((a, b) => a.sequence - b.sequence)
                .map((item, index) => (
                  <Draggable
                    key={index}
                    draggableId={`table-${index}`}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <ReturnDefinitionsTableCard
                          currentTable={item}
                          currentReturnDefinition={currentReturnDefinition}
                          isDeleteHidden={!generalInfoEditMode}
                          onSave={(newTable) => onSave(newTable, index)}
                          onDelete={() => onDelete(index)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {isAddNewOpen ? (
        <ReturnDefinitionsTableCardEdit
          currentTable={{} as ReturnDefinitionTable}
          setEditMode={setIsAddNewOpen}
          currentReturnDefinition={currentReturnDefinition}
          onSave={onSave}
        />
      ) : (
        <>
          {hasPermission(PERMISSIONS.FINA_RETURN_DEFINITION_AMEND) && (
            <StyledAddNewBox
              onClick={() => {
                setIsAddNewOpen(true);
              }}
            >
              <StyledAddNewBtn>
                {t("addNew")} <AddIcon />
              </StyledAddNewBtn>
            </StyledAddNewBox>
          )}
        </>
      )}
    </Box>
  );
};

export default ReturnDefinitionsTable;
