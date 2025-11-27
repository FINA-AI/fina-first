import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import DraggableListItem, { DraggableItemType } from "./DraggableListItem";
import { Droppable, DroppableProvided } from "react-beautiful-dnd";
import { Box, List } from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchField from "../../../common/Field/SearchField";
import { EmptyDataIcon } from "../../../../api/ui/icons/EmptyDataIcon";

interface DraggableListProps<T extends DraggableItemType> {
  items: T[];
  isSourceColumn?: boolean;
  handleTransfer: (item: T) => void;
  idProperty: string;
  handleSwitch?: (index: number) => void;
  hasColumnFreeze?: boolean;
  maxWidth?: string;
  padding?: string;
  margin?: string;
  onFilter?: (searchValue: string, items: any) => DraggableItemType[];
}

interface StyledBoxProps {
  _margin?: string;
  _rowsLength?: number;
}

interface StyledRootProps {
  _padding?: string;
  _maxWidth?: string;
}

const StyledRoot = styled(List, {
  shouldForwardProp: (prop: string) => !prop.startsWith("_"),
})<StyledRootProps>(({ theme, _padding, _maxWidth }) => ({
  padding: _padding || "0px",
  width: "100%",
  "&.MuiList-root": {
    display: "flex",
    overflow: "auto",
    height: "100%",
    paddingRight: "10px",
    paddingTop: "10px",
    flexDirection: "column",
    alignItems: "center",
    border: "unset",
    background: "inherit",
    "& .MuiListItem-root": {
      borderRadius: "4px",
      maxWidth: _maxWidth || "345px",
      maxHeight: "36px",
      marginBottom: "4px",
      border: `1px solid ${
        theme.palette.mode === "dark" ? "#3C4D68" : "#D0D5DD"
      }`,
      background: theme.palette.mode === "dark" ? "#2D3747" : "#EAEBF080",
      "&:hover": {
        background: theme.palette.mode === "dark" ? "#344258" : "#F2F4F7",
      },
    },
  },
}));

const StyledEmptyDataIconWrapper = styled(Box)({
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
});

const StyledEmptyIconWrapper = styled(Box)<{ rowsLength: number }>(
  ({ rowsLength }) => ({
    height: "100%",
    display: rowsLength === 0 ? "flex" : "block",
    boxSizing: rowsLength === 0 ? "border-box" : "content-box",
    flexDirection: rowsLength === 0 ? "column" : "row",
  })
);

const StyledBox = styled(Box, {
  shouldForwardProp: (prop: string) => !prop.startsWith("_"),
})<StyledBoxProps>(({ _margin, _rowsLength }) => ({
  height: "100%",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  margin: _margin || "0px",
  paddingRight: "8px",
}));

const DraggableList = <T extends DraggableItemType>({
  items,
  isSourceColumn = false,
  handleTransfer,
  idProperty,
  handleSwitch,
  hasColumnFreeze = true,
  maxWidth,
  padding,
  margin,
  onFilter,
}: DraggableListProps<T>) => {
  const [searchValue, setSearchValue] = useState("");
  const [filteredItems, setFilteredItems] = useState<DraggableItemType[]>([]);

  const onFilterChange = useCallback(
    (value: string) => {
      if (onFilter) {
        const searchValue = value?.toLowerCase();
        setSearchValue(searchValue);
        setFilteredItems([...onFilter(searchValue, items)]);
      }
    },
    [items]
  );

  useEffect(() => {
    if (searchValue) {
      onFilterChange(searchValue);
    } else if (items.length === 0) {
      setFilteredItems([]);
    }
  }, [items]);

  const displayItems = !!searchValue ? filteredItems : items;

  const hiddenSearch = !onFilter;

  return (
    <StyledBox _margin={margin} _rowsLength={displayItems.length}>
      <SearchField
        style={{
          width: "100%",
          display: hiddenSearch ? "none" : "flex",
          marginBottom: "10px",
        }}
        onClear={() => onFilterChange("")}
        withFilterButton={false}
        onFilterChange={onFilterChange}
      />
      <Droppable
        droppableId={isSourceColumn ? "source-list" : "destination-list"}
      >
        {(provided: DroppableProvided) =>
          displayItems.length > 0 ? (
            <StyledRoot
              _padding={padding}
              _maxWidth={maxWidth}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {displayItems.map((item: any, index) => (
                <DraggableListItem
                  key={String(item[idProperty])}
                  item={item}
                  index={index}
                  idProperty={idProperty}
                  isSourceColumn={isSourceColumn}
                  handleTransfer={handleTransfer}
                  handleSwitch={handleSwitch}
                  hasColumnFreeze={hasColumnFreeze}
                />
              ))}
              {provided.placeholder}
            </StyledRoot>
          ) : filteredItems.length === 0 && items.length === 0 ? (
            <StyledEmptyIconWrapper
              overflow={"hidden"}
              rowsLength={displayItems.length}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <StyledEmptyDataIconWrapper>
                <EmptyDataIcon />
              </StyledEmptyDataIconWrapper>
              <div style={{ textAlign: "center" }}>Fields are not selected</div>
              {provided.placeholder}
            </StyledEmptyIconWrapper>
          ) : (
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              Not found
            </div>
          )
        }
      </Droppable>
    </StyledBox>
  );
};

export default React.memo(DraggableList);
