import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import React, { useState } from "react";
import { Box, styled } from "@mui/system";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import OffsetListItem from "../../../components/ReportManager/Generate/ReportGenerationOffset/OffsetListItem";
import { OffsetItem } from "../../../types/reportGeneration.type";

interface OffsetContainerProps {
  onAddNew: (rows: OffsetItem[]) => void;
}

const StyledRoot = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
  overflowX: "hidden",
}));

const StyledAddNewWrapper = styled("div")(({ theme }) => ({
  borderBottom: theme.palette.borderColor,
  display: "flex",
  padding: "8px 24px",
  cursor: "pointer",
  height: 30,
  alignItems: "center",
}));

const StyledAddRoundedIcon = styled(AddRoundedIcon)(({ theme }) => ({
  ...(theme as any).smallIcon,
  color: "#2962FF",
}));

const StyledAddNew = styled(Typography)(() => ({
  fontSize: 11,
  fontWeight: "16px",
  color: "#2962FF",
  marginLeft: 4,
}));

const OffsetContainer: React.FC<OffsetContainerProps> = ({ onAddNew }) => {
  const { t } = useTranslation();

  const [listData, setListData] = useState<OffsetItem[]>([]);
  const [editableItem, setEditableItem] = useState<Partial<OffsetItem>>({});

  function handleOnDragEnd(result: DropResult) {
    if (!result.destination) return;

    const items = Array.from(listData);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setListData(items);
    onAddNew(items);
  }

  return (
    <StyledRoot>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="characters">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ listStyle: "none", padding: 0, margin: 0 }}
            >
              {listData.map((item, index) => {
                return (
                  <OffsetListItem
                    item={item}
                    index={index}
                    setEditableItem={setEditableItem}
                    editableItem={editableItem}
                    setListData={setListData}
                    listData={listData}
                    onAddNew={onAddNew}
                  />
                );
              })}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <StyledAddNewWrapper
        onClick={() => {
          setListData([
            ...listData,
            { name: "", id: Math.floor(Math.random() * 10000) + 1 },
          ]);
          onAddNew([
            ...listData,
            { name: "", id: Math.floor(Math.random() * 10000) + 1 },
          ]);
        }}
        data-testid={"create-button"}
      >
        <StyledAddRoundedIcon />
        <StyledAddNew>{t("addNew")}</StyledAddNew>
      </StyledAddNewWrapper>
    </StyledRoot>
  );
};

export default OffsetContainer;
