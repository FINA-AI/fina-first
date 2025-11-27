import DraggableList from "./DraggableList";
import React from "react";
import { DraggableItemType } from "./DraggableListItem";

interface DraggableListContainerProps<T extends DraggableItemType> {
  data: T[];
  isSourceColumn?: boolean;
  handleTransfer: any;
  idProperty: keyof T;
  handleSwitch?: (from: number) => void;
  hasColumnFreeze?: boolean;
  maxWidth?: string;
  padding?: string;
  margin?: string;
  onFilter?: (searchValue: string, items: any) => DraggableItemType[];
}

const DraggableListContainer = <T extends DraggableItemType>({
  data,
  isSourceColumn = false,
  handleTransfer,
  idProperty,
  handleSwitch,
  hasColumnFreeze = false,
  maxWidth,
  padding,
  margin,
  onFilter,
}: DraggableListContainerProps<T>) => {
  return (
    <DraggableList
      maxWidth={maxWidth}
      padding={padding}
      items={data}
      isSourceColumn={isSourceColumn}
      handleTransfer={(item: DraggableItemType) => handleTransfer(item as T)}
      idProperty={idProperty as string}
      handleSwitch={handleSwitch}
      hasColumnFreeze={hasColumnFreeze}
      margin={margin}
      onFilter={onFilter}
    />
  );
};

export default DraggableListContainer;
