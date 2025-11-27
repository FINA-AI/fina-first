import React, { useEffect, useState } from "react";
import { Select } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import { MiTableRowItem } from "../../../../types/manualInput.type";

interface ManualInputTableComboField {
  rowItem: MiTableRowItem;
}

const StyledSelect = styled(Select)(({ theme }: { theme: any }) => ({
  width: 200,
  height: 31,
  borderRadius: theme.general.borderRadius,
  border: theme.general.border,
  fontSize: "12px",
}));

const ManualInputTableComboField: React.FC<ManualInputTableComboField> = ({
  rowItem,
}) => {
  const emptyPlaceHolder = "---------NONE---------";
  const [rItem, setRItem] = useState(rowItem);

  useEffect(() => {
    setRItem(rowItem);
  }, [rowItem]);

  const handleChange = (value: any, selectedItem: any) => {
    const itemValue = value;
    if (selectedItem != null) {
      rowItem.value = itemValue;
      setRItem({ ...rowItem, value: itemValue });
    }
  };

  return (
    <StyledSelect
      value={rItem.value ? rItem.value : ""}
      onChange={(event: any) => handleChange(event.target.value, rowItem)}
    >
      <MenuItem
        key={`listElement--1`}
        style={{
          maxWidth: 200,
          display: "flex",
          justifyContent: "center",
        }}
        value={""}
      >
        {emptyPlaceHolder}
      </MenuItem>
      {rowItem.listElementValues.map((listElementValue, i) => (
        <MenuItem
          key={`listElement_${i}`}
          value={
            listElementValue.dataItemValue ? listElementValue.dataItemValue : ""
          }
        >
          {listElementValue.dataItemValue ? listElementValue.dataItemValue : ""}
        </MenuItem>
      ))}
    </StyledSelect>
  );
};

export default ManualInputTableComboField;
