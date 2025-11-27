import { Box, Typography } from "@mui/material";
import React, { ReactElement, useState } from "react";
import Tooltip from "../Tooltip/Tooltip";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import useConfig from "../../../hoc/config/useConfig";
import { getFormattedDateValue } from "../../../util/appUtil";
import { styled } from "@mui/system";

interface FilterChipProps {
  maxWidth?: string;
  data: [string, string];
  icon?: ReactElement;
  handleClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  name?: string;
  chipKey?: string;
}

const Container = styled(Box)(({ theme }) => ({
  boxSizing: "border-box",
  width: "fit-content",
  height: 24,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "0px 4px",
  border: `${theme.palette.borderColor}`,
  borderRadius: 2,
  padding: "4px 8px",
  backgroundColor: theme.palette.mode === "dark" ? "#384354" : "inherit",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  cursor: "pointer",
}));

const Title = styled(Typography)(({ theme }) => ({
  boxSizing: "border-box",
  fontWeight: 400,
  fontSize: 13,
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#2C3644",
  paddingRight: 2,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  textTransform: "capitalize",
}));

const StyledArrowDropDownIcon = styled(ArrowDropDownIcon)(() => ({
  color: "#98A7BC",
  width: "16px",
  height: "16px",
}));

const FilterChip: React.FC<FilterChipProps> = ({
  data,
  icon,
  maxWidth,
  handleClick,
  name,
  chipKey,
}) => {
  const [tooltip, setTooltip] = useState<boolean>(false);
  const { getDateFormat } = useConfig();

  const onMouseEnterFunction = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    setTooltip(
      event.currentTarget.scrollWidth > event.currentTarget.clientWidth
    );
  };

  let getValue = () => {
    if (data) {
      let type = data[0];
      let value = data[1];
      if (data) {
        if (type === "dateBefore" || type === "dateAfter") {
          return getFormattedDateValue(value, getDateFormat(true));
        }

        return value.toLowerCase();
      }
    } else if (name) {
      return name;
    }
  };

  return (
    <Box display={"flex"} alignItems={"center"}>
      <Tooltip title={tooltip ? getValue() : ""} arrow>
        <Container
          onMouseEnter={(event) => onMouseEnterFunction(event)}
          onClick={(event) => handleClick && handleClick(event)}
          data-testid={chipKey + "-chip"}
        >
          <Title maxWidth={maxWidth} data-testid={"value"}>
            {getValue()}
          </Title>
          {icon}
          {handleClick && <StyledArrowDropDownIcon />}
        </Container>
      </Tooltip>
    </Box>
  );
};

export default FilterChip;
