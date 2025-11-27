import FilterChip from "../../common/Chip/FilterChip";
import Popover from "@mui/material/Popover";
import { Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { FC, useState } from "react";
import { getFormattedDateValue } from "../../../util/appUtil";
import useConfig from "../../../hoc/config/useConfig";
import { styled } from "@mui/material/styles";

const StyledPopper = styled(Popover)({
  "& .MuiPaper-root": {
    boxShadow:
      "0px 5px 5px -3px rgb(80 80 80 / 12%), " +
      "0px 8px 10px 1px rgb(80 80 80 / 12%), " +
      "0px 3px 14px 2px rgb(80 80 80 / 12%)",
    borderRadius: "4px",
    color: "#FFFFFF",
    marginTop: "3px",
    background: "#2C3644",
    padding: "4px",
  },
});

const StyledPopperItem = styled(Typography)({
  fontWeight: 400,
  fontSize: "11px",
  lineHeight: "16px",
  textTransform: "capitalize",
  padding: "4px",
  cursor: "pointer",
  whiteSpace: "nowrap",
  overflow: "hidden",
  maxWidth: "120px",
  textOverflow: "ellipsis",
  lineBreak: "anywhere",
  "&:hover": {
    background: "#414A56",
  },
});

const StyledChipIcon = styled(CloseIcon)({
  color: "#9AA7BE",
  fontSize: 15,
});

interface FilteredDataDisplayProps {
  result: [string[]] | [];
  deleteChip: (data: string[]) => void;
}

const FilteredDataDisplay: FC<FilteredDataDisplayProps> = ({
  result,
  deleteChip,
}) => {
  const { getDateFormat } = useConfig();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  let getValue = (data: string[]) => {
    let type = data[0];
    let value = data[1];
    if (data) {
      if (type === "dateBefore" || type === "dateAfter") {
        return getFormattedDateValue(value, getDateFormat(true));
      }

      return value;
    }
  };

  return (
    <>
      <FilterChip
        data={["", `Other ${result.length - 3} Filters`]}
        handleClick={handleClick}
        maxWidth={"80px"}
        chipKey={"others-dropdown"}
      />
      <StyledPopper
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        {result.slice(3).map((filterItem: string[], index: number) => {
          return (
            <StyledPopperItem
              key={index}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
              minWidth={"100px"}
              data-testid={filterItem?.[0] + "-item"}
            >
              <span
                style={{
                  maxWidth: "90%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                data-testid={"value"}
              >
                {getValue(filterItem)}
              </span>
              <StyledChipIcon onClick={() => deleteChip(filterItem)} />
            </StyledPopperItem>
          );
        })}
      </StyledPopper>
    </>
  );
};

export default FilteredDataDisplay;
