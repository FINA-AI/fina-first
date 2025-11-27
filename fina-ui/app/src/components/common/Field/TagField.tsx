import {
  Checkbox,
  Chip,
  OutlinedInput,
  Select,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import React, { useEffect, useRef, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { FIELD_VARIANT } from "../../../util/component/fieldUtil";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import TextField from "./TextField";
import { Box } from "@mui/system";
import { styled } from "@mui/material/styles";

interface TagFieldProps {
  disabled?: boolean;
  label?: string;
  data?: dataType[];
  selectedValues?: string[];
  size?: string;
  onChange: (selectedValues: string[]) => void;
  width?: number;
  variant?: "filled" | "outlined" | "standard";
  filter?: boolean;
  chipWidth: number;
}

interface dataType {
  key: string;
  value: string;
}

const StyledFormControl = styled(FormControl)<{
  _width?: number;
  _size?: string;
}>(({ _width, _size, theme }) => ({
  "& .MuiInputBase-root": {
    width: _width ? `${_width}px` : "100%",
    height: _size === "default" ? "36px" : "32px",
  },
  "& .MuiInputLabel-root": {
    top: `${_size === "default" ? "-5px" : "-7px"} !important`,
    "&[data-shrink='true']": {
      top: `${_size === "default" ? "2px" : "4px"} !important`,
    },
  },
  "& .MuiSvgIcon-root, &.Mui-disabled .MuiSvgIcon-root": {
    ...(theme as any).smallIcon,
    color: (theme as any).palette.iconColor,
    padding: "1px 4px",
  },
  "& .MuiOutlinedInput-input": {
    padding: "10px 0 10px 14px!important",
  },
  "& .MuiOutlinedInput-root": {
    height: _size === "small" ? "32px" : "36px",
    background:
      theme.palette.mode === "dark"
        ? "rgba(52, 66, 88, 1)"
        : (theme as any).palette.paperBackgroundColor,
    "& .MuiSelect-select": {
      display: "flex",
      alignItems: "center",

      fontWeight: 500,
      fontSize: _size === "default" ? "12px" : "11px",
      textTransform: "capitalize",
      color: "#596D89",
      height: "20px",
    },
  },
}));

const StyledSelectMenuContainer = styled(Box)(() => ({
  maxHeight: "300px",
  overflowY: "auto",
  width: "100%",
  boxSizing: "border-box",
}));

const StyledMenuItem = styled(MenuItem)(({ theme }: any) => ({
  display: "flex",
  padding: 5,
  ...theme.selectOption,
}));

const StyledChip = styled(Chip)(() => ({
  borderRadius: 1,
  fontWeight: 400,
  fontSize: 11,
  cursor: "pointer",
}));

const StyledCheckBox = styled(Checkbox)<{ _size?: string }>(({ _size }) => ({
  padding: 5,
  "& .MuiSvgIcon-root": {
    width: _size === "small" ? "16px" : "",
    height: _size === "small" ? "16px" : "",
  },
}));

const TagField: React.FC<TagFieldProps> = ({
  width,
  size,
  label,
  disabled,
  data = [],
  selectedValues,
  variant = FIELD_VARIANT,
  onChange,
  filter,
  chipWidth = 180,
  ...props
}) => {
  const filterFieldValue = useRef("");

  const [filteredData, setFilteredData] = useState<dataType[]>([]);
  const [originalData, setOriginalData] = useState<dataType[]>([]);

  useEffect(() => {
    setFilteredData([...data]);
    setOriginalData([...data]);
  }, [data]);

  const [selectedKeys, setSelectedKeys] = useState(
    selectedValues ? selectedValues : []
  );

  const isChecked = (key: string) => {
    return selectedKeys.indexOf(key) > -1;
  };

  const getLabelByKey = (key: string) => {
    return data.find((d) => d.key === key)?.value;
  };

  const handleChange = (menuItem: dataType) => {
    let selectedMenuItems = [...selectedKeys];
    if (selectedMenuItems.find((item) => item === menuItem.key)) {
      selectedMenuItems = selectedMenuItems.filter(
        (item) => item !== menuItem.key
      );
    } else {
      selectedMenuItems.push(menuItem.key);
    }
    setSelectedKeys([...selectedMenuItems]);
    onChange(selectedMenuItems);
  };

  const onFilterChange = (val: string) => {
    filterFieldValue.current = val;
    let filData = originalData.filter((item: dataType) =>
      item.value.toLowerCase().includes(val.toLowerCase())
    );
    setFilteredData([...filData]);
  };

  return (
    <StyledFormControl variant={variant} _width={width} _size={size}>
      {label && <InputLabel htmlFor={label}>{label}</InputLabel>}
      <Select
        fullWidth={true}
        disabled={disabled}
        // size={"default"}
        onChange={() => {}}
        value={selectedKeys}
        multiple
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => {
          return (
            <Stack direction="row" spacing={1}>
              {selected.map((key) => {
                const label = getLabelByKey(key);
                return (
                  <Tooltip key={key} placement={"bottom-end"} title={label}>
                    <StyledChip
                      key={key}
                      label={label}
                      size="small"
                      style={{ width: chipWidth }}
                    />
                  </Tooltip>
                );
              })}
            </Stack>
          );
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              width: "170px",
              boxSizing: "border-box",
              paddingLeft: "4px",
              paddingRight: "4px",
              marginTop: "5px",
              overflow: "hidden",
            },
          },
        }}
        IconComponent={KeyboardArrowDownIcon}
        {...props}
      >
        {filter && (
          <Box paddingBottom={"5px"}>
            <TextField
              onChange={onFilterChange}
              value={filterFieldValue.current}
            />
          </Box>
        )}
        <StyledSelectMenuContainer>
          {filteredData.map((v: dataType) => (
            <StyledMenuItem
              key={v.key}
              value={v.key}
              onClick={() => handleChange(v)}
            >
              <StyledCheckBox
                size={"small"}
                _size={size}
                checked={isChecked(v.key)}
              />
              <Typography
                noWrap={true}
                sx={{ maxWidth: "100%", overflow: "hidden" }}
              >
                {v.value}
              </Typography>
            </StyledMenuItem>
          ))}
        </StyledSelectMenuContainer>
      </Select>
    </StyledFormControl>
  );
};

export default TagField;
