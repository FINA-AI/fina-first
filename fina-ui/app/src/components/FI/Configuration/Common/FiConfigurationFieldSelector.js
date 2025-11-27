import { DialogContent, DialogContentText } from "@mui/material";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DraggableListContainer from "./DraggableListContainer";
import { DragDropContext } from "react-beautiful-dnd";
import { Box } from "@mui/system";
import { styled } from "@mui/material/styles";
import { DroppableTypes } from "../../../../types/common.type";

const StyledColumnsLabel = styled(DialogContentText)(({ theme }) => ({
  color: theme.palette.textColor,
  paddingBottom: "8px",
  fontSize: "14px",
  fontWeight: "500",
  margin: "0px 0px 0px 0px !important",
}));

const StyledColumnBox = styled(Box)({
  marginLeft: 10,
  overflowY: "auto",
  overflowX: "hidden",
  paddingTop: "0px !important",
  paddingLeft: "0px !important",
  paddingRight: "0px !important",
  display: "flex",
  flexDirection: "row",
  flex: 1,
  height: "100%",
});

const StyledContent = styled(DialogContent)(({ theme }) => ({
  display: "flex",
  overflow: "hidden",
  borderBottom: theme.palette.borderColor,
}));

const StyledListContainer = styled(Box)({
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  "& .MuiBox-root": {
    height: "100%",
    margin: 0,
  },
  "& .MuiList-root": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
});

/**
 * @param {String} columns[].title - Field indicates column name.
 * @param {Boolean} columns[].hidden - Field indicates whether the given column is hidden or not.
 *
 * @param list
 * @param startIndex
 * @param endIndex
 */

export const reorder = (list = [], startIndex, endIndex) => {
  const result = list;
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  result.map((r, index) => {
    r.sequence = index;
    return r;
  });

  return result;
};

const FiConfigurationFieldSelector = ({
  columns = [],
  stepIndex,
  validateFunction,
  isEdit,
}) => {
  const { t } = useTranslation();
  const [items, setItems] = useState(
    columns
      .map((c) => {
        c.id = "source-" + c?.key;
        return c;
      })
      .sort((a, b) => a.isSelected - b.isSelected)
  );

  const [destinationColumns, setDestinationColumns] = useState([
    ...items
      .filter((c) => c.isSelected && c.stepperIndex === stepIndex)
      .map((c) => ({
        ...c,
        id: "destination-" + c?.key,
      }))
      .sort((a, b) => a.sequence - b.sequence),
  ]);

  useEffect(() => {
    if (validateFunction) {
      validateFunction(items);
    }
  }, [items]);

  const handleTransfer = (item, sequence) => {
    const isSource = !item.isSelected;
    let cols = items.sort((a, b) => a.sequence - b.sequence);
    const index = items.findIndex((c) => c.key === item.key);
    cols[index].isSelected = !cols[index].isSelected;
    cols[index].stepperIndex = cols[index].isSelected ? stepIndex : null;

    if (isSource) {
      const tmp = [...destinationColumns];
      tmp.push(cols[index]);

      cols = reorder(items, index, items.length - 1);

      const destCols = [
        ...(sequence >= 0 ? reorder(tmp, tmp.length - 1, sequence) : tmp),
      ].map((c) =>
        c.key === item.key ? { ...item, id: "destination-" + item.key } : c
      );
      setDestinationColumns(destCols);
    } else {
      const lastCheckedItemIndex = items.findIndex((c) => c.isSelected);

      cols = reorder(
        items,
        index,
        lastCheckedItemIndex === -1 ? cols.length - 1 : lastCheckedItemIndex
      );
      destinationColumns.splice(
        destinationColumns.findIndex((dc) => dc.id === item.id),
        1
      );

      setDestinationColumns([...destinationColumns]);
    }
    setItems(cols);
  };

  const onDragEnd = ({ destination, source, draggableId }) => {
    // dropped outside the list
    if (!destination) return;

    const sInd = source.droppableId;
    const dInd = destination.droppableId;

    if (sInd === DroppableTypes.DESTINATION_LIST) {
      source.index = destinationColumns.findIndex(
        (item) => item?.id === draggableId
      );
    }
    if (dInd === DroppableTypes.DESTINATION_LIST) {
      source.index = items.findIndex((item) => item?.id === draggableId);
    }

    // In Same List
    if (sInd === dInd) {
      let sourceKey = destinationColumns[source.index]?.key;
      let destinationKey = destinationColumns[destination.index]?.key;
      const newItems = reorder(
        sInd === DroppableTypes.SOURCE_LIST ? items : destinationColumns,
        source.index,
        destination.index
      );

      if (sInd === DroppableTypes.SOURCE_LIST) {
        setItems(newItems);
      } else {
        setDestinationColumns(newItems);
        if (!isEdit) {
          const list = reorder(
            items,
            items.indexOf(items.find((item) => item.key === sourceKey)),
            items.indexOf(items.find((item) => item.key === destinationKey))
          );
          setItems(list);
        }
      }
    } else {
      //From Source To Destination
      if (sInd === DroppableTypes.SOURCE_LIST) {
        handleTransfer(items[source.index], destination.index);
      } else {
        //From Destination to source
        handleTransfer(destinationColumns[source.index]);
      }
    }
  };

  const onFilter = (searchValue, items) => {
    return !searchValue
      ? []
      : items.filter((item) =>
          item?.headerName?.toLowerCase().includes(searchValue)
        );
  };

  return (
    <StyledContent>
      <DragDropContext onDragEnd={onDragEnd}>
        <StyledColumnBox>
          <StyledListContainer>
            <StyledColumnsLabel>{t("availableFields")}</StyledColumnsLabel>

            <DraggableListContainer
              data={items}
              isSourceColumn={true}
              handleTransfer={handleTransfer}
              idProperty={"id"}
              onFilter={onFilter}
            />
          </StyledListContainer>
        </StyledColumnBox>

        <StyledColumnBox>
          <StyledListContainer>
            <StyledColumnsLabel>{t("selectedFields")}</StyledColumnsLabel>
            <DraggableListContainer
              data={destinationColumns}
              isSourceColumn={false}
              handleTransfer={handleTransfer}
              idProperty={"id"}
              onFilter={onFilter}
            />
          </StyledListContainer>
        </StyledColumnBox>
      </DragDropContext>
    </StyledContent>
  );
};

FiConfigurationFieldSelector.propTypes = {
  columns: PropTypes.array.isRequired,
  stepIndex: PropTypes.any,
  validateFunction: PropTypes.func,
  isEdit: PropTypes.bool.isRequired,
};

export default React.memo(FiConfigurationFieldSelector);
