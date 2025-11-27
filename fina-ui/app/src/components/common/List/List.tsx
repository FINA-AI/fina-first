import {
  Box,
  ListItemButton,
  ListItemText,
  Paper,
  Tooltip,
} from "@mui/material";
import List from "@mui/material/List";
import React, { useRef, useState } from "react";
import InfoPopover from "../InfoPopover/InfoPopover";
import { styled } from "@mui/material/styles";

interface CustomListProps {
  onSelect: (item: any) => void;
  idName?: string;
  data: any;
  dateFormat?: string;
  itemId: string;
}

const StyledRootBox = styled(Box)(({ theme }: any) => ({
  width: "100%",
  height: "100%",
  "& .MuiList-root ": {
    backgroundColor: theme.palette.paperBackground,
  },
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  width: "100%",
  height: "72px",
  padding: "12px",
  borderBottom: (theme as any).palette.borderColor,
  boxShadow: theme.palette.mode === "dark" ? "" : "0px 1px 0px #EAEBF0;",
  "&.Mui-focusVisible": {
    backgroundColor: "none",
  },
  "&.Mui-selected": {
    "& p": {
      color: "#FFF",
    },
  },
}));

const StyledListItemText = styled(ListItemText)(() => ({
  "& .MuiListItemText-primary": {
    fontWeight: 500,
    fontSize: "13px",
    lineHeight: "20px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    marginBottom: "4px",
  },
  "& .MuiListItemText-secondary": {
    fontWeight: 400,
    fontSize: "11px",
    lineHeight: "16px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
}));

const StyledDivider = styled("span")(() => ({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

const CustomList: React.FC<CustomListProps> = ({
  data,
  onSelect,
  itemId,
  idName = "id",
}) => {
  const [hasTooltip, setHasTooltip] = useState(false);
  const rootRef = useRef();

  const onMouseEnterFunction = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    setHasTooltip(
      event.currentTarget.scrollWidth > event.currentTarget.clientWidth
    );
  };

  const getTextWithTooltip = (text: string) => {
    return (
      <span onMouseEnter={(event) => onMouseEnterFunction(event)}>
        <Tooltip title={hasTooltip ? text : ""} arrow>
          <StyledDivider>{text}</StyledDivider>
        </Tooltip>
      </span>
    );
  };

  return (
    <StyledRootBox
      component={Paper}
      ref={rootRef}
      display="flex"
      flexDirection="column"
    >
      <Box flex={1}>
        <List component="nav" disablePadding data-testid={"catalog-list"}>
          {data.map((item: any, i: number) => {
            return (
              <StyledListItemButton
                key={"reference-" + i}
                autoFocus={itemId == item.originalData[idName]}
                dense
                selected={itemId == item.originalData[idName]}
                onClick={() => onSelect(item.originalData)}
                data-testid={`catalog-` + i}
              >
                <StyledListItemText
                  primary={getTextWithTooltip(item.primaryText)}
                  secondary={getTextWithTooltip(item.secondaryText)}
                />
                <InfoPopover
                  info={item.details}
                  isActive={itemId == item.originalData[idName]}
                />
              </StyledListItemButton>
            );
          })}
        </List>
      </Box>
    </StyledRootBox>
  );
};

export default React.memo(CustomList);
