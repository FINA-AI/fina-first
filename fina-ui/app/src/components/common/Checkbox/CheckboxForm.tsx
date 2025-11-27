import { Radio } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";

interface ListElementType {
  name: string;
  value: string;
}

interface CheckboxFormProps {
  list: ListElementType[];
  handleChange: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  initValue: string;
}

const StyledBoxItem = styled(Box)(({ theme }: any) => ({
  borderBottom: theme.palette.borderColor,
  height: 36,
}));

const StyledRadio = styled(Radio)(() => ({
  color: "#C3CAD8",
  padding: "0px",
  "&.Mui-checked": {
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  "&:hover": {
    backgroundColor: "transparent",
  },
}));

const CheckboxForm: React.FC<CheckboxFormProps> = ({
  list,
  handleChange,
  initValue,
}) => {
  const [checked, setChecked] = useState<string>(initValue);
  const isRadioChecked = (el: ListElementType) => {
    if (checked) {
      return checked === el.value;
    } else {
      return initValue === el.value;
    }
  };

  return (
    <Box
      display={"flex"}
      width={"100%"}
      flexDirection={"column"}
      data-testid={"checkbox-form"}
    >
      {list.map((el, i) => (
        <StyledBoxItem
          key={i}
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          padding={"0px 16px"}
          data-testid={`checkbox-row-${i + 1}`}
        >
          {el.name}
          <StyledRadio
            onChange={(e) => {
              handleChange(e.target.value, e);
              setChecked(e.target.value);
            }}
            value={el.value}
            checked={isRadioChecked(el)}
            size={"small"}
            data-testid={`checkbox-` + (i + 1)}
          />
        </StyledBoxItem>
      ))}
    </Box>
  );
};

export default CheckboxForm;
