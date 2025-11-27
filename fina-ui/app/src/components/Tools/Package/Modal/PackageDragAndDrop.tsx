import { Box } from "@mui/system";
import { DragDropContext } from "react-beautiful-dnd";
import { DialogContent, DialogContentText } from "@mui/material";
import DraggableListContainer from "../../../FI/Configuration/Common/DraggableListContainer";
import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import { PackageReturnDefinitionType } from "../../../../types/tools.type";
import { DroppableTypes } from "../../../../types/common.type";

interface PackageDragAndDropProps {
  filteredReturnDefinitions: PackageReturnDefinitionType[];
  setFilteredReturnDefinitions: (data: PackageReturnDefinitionType[]) => void;
  displayColumns: PackageReturnDefinitionType[];
  setDisplayColumns: (data: PackageReturnDefinitionType[]) => void;
}

const StyledDragAndDropBox = styled(Box)(({ theme }: any) => ({
  border: theme.palette.borderColor,
  borderRadius: "4px",
  display: "flex",
  height: "188px",
  overflow: "hidden",
  padding: "16px 8px",
  margin: "4px 4px 8px 4px",
}));

const StyledColumnBox = styled(DialogContent)({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  padding: "0px 8px 0px 8px !important",
});

const StyledColumnsLabel = styled(DialogContentText)(({ theme }: any) => ({
  color: theme.palette.labelColor,
  fontSize: 12,
  lineHeight: "18px",
  fontWeight: 600,
}));

const PackageDragAndDrop: React.FC<PackageDragAndDropProps> = ({
  filteredReturnDefinitions,
  setFilteredReturnDefinitions,
  displayColumns,
  setDisplayColumns,
}) => {
  const { t } = useTranslation();
  const reorder = (
    list: PackageReturnDefinitionType[] = [],
    startIndex: number,
    endIndex: number
  ) => {
    const result = list;
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    result.map((r, index) => {
      r.sequence = index;
      return r;
    });

    return result;
  };

  const handleTransfer = (
    item: PackageReturnDefinitionType,
    sequence?: number
  ) => {
    const isSource = !item.isSelected;
    let cols = filteredReturnDefinitions.sort(
      (a: any, b: any) => a.sequence - b.sequence
    );
    const index = filteredReturnDefinitions.findIndex((c) => c.id === item.id);
    cols[index].isSelected = !cols[index].isSelected;

    if (isSource) {
      const tmp = [...displayColumns];
      tmp.push(cols[index]);

      cols = reorder(
        filteredReturnDefinitions,
        index,
        filteredReturnDefinitions?.length - 1
      );

      let destCols = [
        ...(typeof sequence === "number" && sequence >= 0
          ? reorder(tmp, tmp.length - 1, sequence)
          : tmp),
      ].map((c) =>
        c.id === item.id ? { ...item, dndId: "source-" + item.id } : c
      );
      setDisplayColumns(destCols);
    } else {
      const lastCheckedItemIndex = filteredReturnDefinitions?.findIndex(
        (c) => c.isSelected
      );

      cols = reorder(
        filteredReturnDefinitions,
        index,
        lastCheckedItemIndex === -1 ? cols.length - 1 : lastCheckedItemIndex
      );
      displayColumns.splice(
        displayColumns.findIndex((dc) => dc.dndId === item.dndId),
        1
      );

      setDisplayColumns([...displayColumns]);
    }
    setFilteredReturnDefinitions(cols);
  };

  const onDragEnd = ({ destination, source, draggableId }: any) => {
    if (!destination) return;

    const sInd = source.droppableId;
    const dInd = destination.droppableId;

    if (sInd === DroppableTypes.DESTINATION_LIST) {
      source.index = displayColumns.findIndex(
        (item) => item.dndId === draggableId
      );
    }
    if (dInd === DroppableTypes.DESTINATION_LIST) {
      source.index = filteredReturnDefinitions.findIndex(
        (item) => item.dndId === draggableId
      );
    }

    if (sInd === dInd) {
      const newItems = reorder(
        sInd === "source-list" ? filteredReturnDefinitions : displayColumns,
        source.index,
        destination.index
      );

      if (sInd === "source-list") {
        setFilteredReturnDefinitions(newItems);
      } else {
        setDisplayColumns(newItems);
      }
    } else {
      if (sInd === "source-list") {
        handleTransfer(
          filteredReturnDefinitions[source.index],
          destination.index
        );
      } else {
        handleTransfer(displayColumns[source.index]);
      }
    }
  };

  const onFilter = (searchValue: string, items: any) => {
    return !searchValue
      ? []
      : items.filter((item: any) =>
          item?.headerName?.toLowerCase().includes(searchValue)
        );
  };

  return (
    <StyledDragAndDropBox>
      <DragDropContext onDragEnd={onDragEnd}>
        <StyledColumnBox data-hidden={true} data-testid={"source-container"}>
          <StyledColumnsLabel>{t("hidden")}</StyledColumnsLabel>
          <DraggableListContainer
            data={filteredReturnDefinitions}
            isSourceColumn={true}
            handleTransfer={handleTransfer}
            idProperty={"dndId"}
            onFilter={onFilter}
          />
        </StyledColumnBox>
        <StyledColumnBox
          data-hidden={false}
          data-testid={"destination-container"}
        >
          <StyledColumnsLabel>{t("selected")}</StyledColumnsLabel>
          <DraggableListContainer
            data={displayColumns}
            isSourceColumn={false}
            handleTransfer={handleTransfer}
            idProperty={"dndId"}
            hasColumnFreeze={false}
            onFilter={onFilter}
          />
        </StyledColumnBox>
      </DragDropContext>
    </StyledDragAndDropBox>
  );
};

export default PackageDragAndDrop;
