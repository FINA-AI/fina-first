import { Draggable } from "react-beautiful-dnd";
import { DragIndicator } from "@mui/icons-material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import TextField from "../../../common/Field/TextField";
import { Grid, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { OffsetItem } from "../../../../types/reportGeneration.type";
import React from "react";

interface OffsetListItemProps {
  item: OffsetItem;
  index: number;
  setEditableItem: React.Dispatch<React.SetStateAction<Partial<OffsetItem>>>;
  editableItem: Partial<OffsetItem>;
  listData: OffsetItem[];
  setListData: (data: OffsetItem[]) => void;
  onAddNew(rows: OffsetItem[]): void;
}

const StyledContentWrapper = styled(Grid)({
  "&:hover": {
    "&  .MuiGrid-root:last-child": {
      display: "flex",
      alignItems: "flex-end",
      flexDirection: "row-reverse",
    },
  },
  "& .MuiGrid-root:last-child": {
    display: "none",
  },
  padding: "8px 8px",
  display: "flex",
  width: "100%",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "pointer",
  height: 44,
});

const StyledName = styled("span")(({ theme }) => ({
  fontSize: 11,
  lineHeight: "16px",
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#2C3644",
  paddingLeft: 4,
  width: "100%",
}));

const StyledListItem = styled("li")(({ theme }) => ({
  borderBottom: (theme as any).palette.borderColor,
  display: "flex",
  alignItems: "center",
}));

const StyledDragIndicator = styled(DragIndicator)(({ theme }) => ({
  ...(theme as any).smallIcon,
  color: "#98A7BC",
  padding: "0 0 0 4px",
}));

const StyledDeleteIcon = styled(DeleteRoundedIcon)(({ theme }) => ({
  ...(theme as any).smallIcon,
  color: "#FF4128",
  padding: "0 4px",
}));

const OffsetListItem: React.FC<OffsetListItemProps> = ({
  item,
  index,
  setEditableItem,
  editableItem,
  listData,
  setListData,
  onAddNew,
}) => {
  return (
    <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
      {(provided) => (
        <StyledListItem
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => {
            setEditableItem(item);
          }}
          data-testid={"offset-item-" + index}
        >
          <StyledDragIndicator />
          <StyledContentWrapper container>
            <Grid
              item
              xs={11}
              sx={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              <span
                style={{
                  fontSize: 11,
                  lineHeight: "16px",
                  color: "#98A7BC",
                }}
              >
                {index + 1}.{" "}
              </span>
              {editableItem.id === item.id ? (
                <div style={{ marginLeft: 4, width: "100%" }}>
                  <TextField
                    onChange={(val: string) => {
                      setListData(
                        listData.map((listItem) => {
                          if (listItem.id === item.id) {
                            return { ...listItem, name: val };
                          }
                          return listItem;
                        })
                      );
                    }}
                    value={item.name}
                    onBlur={() => {
                      setEditableItem({} as OffsetItem);
                      onAddNew(listData);
                    }}
                    autoFocus
                    type={"Number"}
                    data-testid={"input-field"}
                  />
                </div>
              ) : (
                <StyledName>{item.name}</StyledName>
              )}
            </Grid>
            <Grid item xs={1}>
              <IconButton
                sx={{ margin: "5px", height: 18, width: 18 }}
                onClick={() => {
                  const updatedListData = listData.filter(
                    (listItem) => listItem.id !== item.id
                  );
                  setListData(updatedListData);
                  onAddNew(updatedListData);
                }}
              >
                <StyledDeleteIcon />
              </IconButton>
            </Grid>
          </StyledContentWrapper>
        </StyledListItem>
      )}
    </Draggable>
  );
};

export default OffsetListItem;
