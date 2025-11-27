import * as React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Box, ListItem } from "@mui/material";
import { DragIndicator } from "@mui/icons-material";
import CheckBoxBtn from "../../../common/Checkbox/CheckboxBtn";
import Tooltip from "../../../common/Tooltip/Tooltip";
import CloseBtn from "../../../common/Button/CloseBtn";
import SwitchBtn from "../../../common/Button/SwitchBtn";
import { styled } from "@mui/material/styles";

export interface DraggableItemType {
  isSelected?: boolean;
  fixed?: boolean;
  headerName?: string;

  [key: string]: any;
}

interface DraggableListItemProps<T extends DraggableItemType> {
  item: T;
  index: number;
  idProperty: string;
  isSourceColumn?: boolean;
  handleTransfer: (item: T) => void;
  handleSwitch?: (index: number) => void;
  hasColumnFreeze?: boolean;
}

const StyledHeaderText = styled("span")(({ theme }: any) => ({
  paddingLeft: 8,
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "20px",
  textTransform: "capitalize",
  color: theme.palette.textColor,
}));

const DraggableListItem = <T extends DraggableItemType>({
  item,
  index,
  idProperty,
  isSourceColumn,
  handleTransfer,
  handleSwitch,
  hasColumnFreeze,
}: DraggableListItemProps<T>) => {
  return (
    <Draggable
      draggableId={String(item[idProperty])}
      index={index}
      isDragDisabled={isSourceColumn && !!item.isSelected}
    >
      {(provided) => (
        <ListItem
          ref={provided.innerRef}
          data-testid={"item-" + index}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Box display="flex" flex={1}>
            <Box display="flex" alignItems="center">
              <DragIndicator
                style={{
                  cursor: "move",
                  marginRight: 8,
                  color: "rgba(104, 122, 158, 0.8)",
                  verticalAlign: "middle",
                }}
                key={index}
              />
              {isSourceColumn && (
                <CheckBoxBtn
                  onClick={() => handleTransfer(item)}
                  checked={item.isSelected}
                  size="small"
                  style={{ padding: 0, opacity: 1 }}
                  data-testid={"checkbox"}
                />
              )}
              {hasColumnFreeze && handleSwitch && (
                <div>
                  <SwitchBtn
                    onClick={() => handleSwitch(index)}
                    checked={item.fixed}
                    size="small"
                    data-testid={"switch-button"}
                  />
                </div>
              )}
              <Tooltip title={item.headerName || ""}>
                <StyledHeaderText data-testid={"column-name"}>
                  {item.headerName && item.headerName.length > 25
                    ? item.headerName.slice(0, 25) + "..."
                    : item.headerName}
                </StyledHeaderText>
              </Tooltip>
            </Box>
          </Box>
          {!isSourceColumn && (
            <div>
              <CloseBtn onClick={() => handleTransfer(item)} />
            </div>
          )}
        </ListItem>
      )}
    </Draggable>
  );
};

export default DraggableListItem;
