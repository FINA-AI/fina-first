import React from "react";
import numeral from "numeral";
import { FieldDataType } from "../../../util/component/fieldUtil";
import DatePicker from "../../common/Field/DatePicker";
import NumberField from "../../common/Field/NumberField";
import TextField from "../../common/Field/TextField";

interface CatalogDataItemProps {
  item: any;
  isDisabled: boolean;
  setChangedCatalogItems: (index: number, value: any) => void;
  index: number;
  value: string;
}

const CatalogDataItem: React.FC<CatalogDataItemProps> = ({
  item,
  isDisabled,
  index,
  setChangedCatalogItems,
  value,
}) => {
  const getValueByDataType = (value: number) => {
    const dataType = item.dataType;
    const dataFormat = item.dataFormat;

    switch (dataType) {
      case FieldDataType._INTEGER:
      case FieldDataType._NUMBER:
        if (dataFormat && value) {
          return numeral(value).value();
        }
        return value ? numeral(value).value() : value;
      case FieldDataType._DATE:
        return numeral(value).value();
      case FieldDataType._STRING:
      default:
        return value;
    }
  };

  const setStringOrNumericValue = (value: any) => {
    setChangedCatalogItems(index, getValueByDataType(value));
  };

  const setDateValue = (value: Date) => {
    setChangedCatalogItems(
      index,
      getValueByDataType(new Date(value).getTime())
    );
  };

  const getField = () => {
    const dataType = item.dataType;
    const dataFormat = item.dataFormat;

    switch (dataType) {
      case FieldDataType._NUMBER:
      case FieldDataType._INTEGER:
        return (
          <NumberField
            value={Number(value)}
            format={dataFormat}
            isDisabled={isDisabled}
            onChange={setStringOrNumericValue}
            label={item.name + (item.isRequired ? " *" : "")}
            size={"default"}
          />
        );
      case FieldDataType._DATE:
        let date = new Date(parseInt(value))?.getTime();
        return (
          <DatePicker
            value={date}
            label={item.name}
            format={dataFormat}
            onChange={setDateValue}
            isDisabled={isDisabled}
            size={"default"}
          />
        );
      case FieldDataType._STRING:
      default:
        return (
          <TextField
            value={value ? value : ""}
            onChange={setStringOrNumericValue}
            isDisabled={isDisabled}
            label={item.name + (item.isRequired ? " *" : "")}
            fieldName={item?.name}
          />
        );
    }
  };

  return getField();
};

export default CatalogDataItem;
