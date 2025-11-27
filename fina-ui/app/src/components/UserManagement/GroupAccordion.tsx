import Box from "@mui/material/Box";
import React, { useEffect, useMemo, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PeopleIcon from "@mui/icons-material/People";
import { Checkbox, Tooltip } from "@mui/material";
import { AutoSizer, List, WindowScroller } from "react-virtualized";
import UserItem from "./UserItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useTheme } from "@mui/material/styles";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import { styled } from "@mui/system";
import { UserAndGroup, UserType } from "../../types/user.type";

interface GroupAccordionProps {
  groupItem: UserAndGroup;
  items: UserType[];
  title: string;
  selectedUsers: UserType[];
  hideEmptyGroup?: boolean;
  scrollElement?: any;
  onExpand?: (expanded: boolean, item: UserAndGroup) => void;
  expanded?: boolean;
  singleSelect?: boolean;
  size?: string;
  checkCallback(
    isGroup: boolean,
    item: UserType,
    parent: UserAndGroup | null,
    checked: boolean
  ): void;
  index: number;
}

const StyledRootBox = styled(Box)<{ _isSelected: boolean }>(
  ({ theme, _isSelected }) => ({
    "& .MuiAccordionSummary-content.Mui-expanded": {
      height: "36px",
      alignItems: "center",
    },
    "& .MuiAccordionSummary-content": {
      margin: 0,
      justifyContent: "space-between",
      minWidth: 0,
    },
    "& .MuiAccordionSummary-root": {
      minHeight: "0px !important",
      height: "36px",
      backgroundColor: _isSelected && theme.palette.action.select,
    },
    "& .MuiPaper-root": {
      borderRadius: "0px !important",
      boxShadow: "none !important",
    },
  })
);

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#2A3341",
  "& b": {},
  "& svg": {
    height: "24px",
    color: theme.palette.mode === "dark" ? "#5D789A" : "#323232",
  },
  "& .MuiAccordionSummary-expandIconWrapper": {
    "& .MuiSvgIcon-root": {
      display: "none",
    },
  },
}));

const StyledKeyboardArrowUpIcon = styled(KeyboardArrowUpIcon)<{
  _size?: string;
}>(({ _size }) => ({
  width: _size === "small" ? "16px" : "24px",
  height: _size === "small" ? "16px" : "24px",
}));
const StyledKeyboardArrowDownIcon = styled(KeyboardArrowDownIcon)<{
  _size?: string;
}>(({ _size }) => ({
  width: _size === "small" ? "16px" : "24px",
  height: _size === "small" ? "16px" : "24px",
}));
const StyledPeopleIcon = styled(PeopleIcon)<{ _size?: string }>(
  ({ _size }) => ({
    width: _size === "small" ? "16px" : "24px",
    height: _size === "small" ? "16px" : "24px",
  })
);

const StyledParagraph = styled("p")(({ theme }) => ({
  lineBreak: "anywhere",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  margin: "0px 5px 0px 0px",
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "20px",
  textTransform: "capitalize",
  color: theme.palette.textColor,
}));

const StyledSecondaryText = styled("p")(({ theme }) => ({
  fontSize: 11,
  opacity: theme.palette.mode === "light" ? "60%" : "",
  lineHeight: "16px",
  margin: "0px 5px 0px 0px",
  lineBreak: "anywhere",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  color:
    theme.palette.mode === "dark"
      ? "#ABBACE !important"
      : theme.palette.textColor,
}));

const StyledCheckboxBox = styled(Box)(({ theme }) => ({
  display: "flex",
  "& .MuiTypography-root": {
    fontSize: 12,
    lineHeight: "16px",
    color: "#6B7C98",
    display: "flex",
  },
  "& .MuiButtonBase-root": {
    padding: 0,
    "& svg": {
      color: "#B3BED0",
      borderRadius: "4px",
      marginRight: 0,
    },
  },
  "& .Mui-checked": {
    "& .MuiSvgIcon-root": {
      color: theme.palette.primary.main,
    },
  },
}));

const StyledCheckbox = styled(Checkbox)<{ _size?: string }>(({ _size }) => ({
  "& .MuiSvgIcon-root": {
    width: _size === "small" ? "16px" : "",
    height: _size === "small" ? "16px" : "",
  },
}));

const StyledAccordionDetails = styled(AccordionDetails)(() => ({
  display: "flex",
  flexDirection: "column",
  padding: "0px 0px 0px 0px",
}));

const StyledAccordionSummary = styled(AccordionSummary)<{ _size?: string }>(
  ({ theme, _size }) => ({
    display: "flex",
    alignItems: "center",
    fontSize: _size === "small" ? "11px" : "14px",
    justifyContent: "space-between",
    paddingLeft: "0px",
    borderBottom: theme.palette.borderColor,
  })
);

const StyledCountSPan = styled("span")(({ theme }) => ({
  margin: "0px 5px 0px 0px",
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "20px",
  textTransform: "capitalize",
  color: theme.palette.textColor,
}));

const GroupAccordion: React.FC<GroupAccordionProps> = ({
  groupItem,
  items,
  title,
  checkCallback,
  selectedUsers = [],
  hideEmptyGroup = false,
  scrollElement,
  onExpand,
  expanded,
  singleSelect,
  size,
  index,
}) => {
  const [selectedItems, setSelectedItems] = useState<UserType[]>(selectedUsers);
  const [tooltip, setTooltip] = useState(false);

  const theme = useTheme();
  const onMouseEnterFunction = (event: any) => {
    setTooltip(event.target.scrollWidth > event.target.clientWidth);
  };

  useEffect(() => {
    setSelectedItems(selectedUsers);
  }, [selectedUsers]);

  const selectItemsFunc = (checked: boolean) => {
    checkCallback(true, groupItem, null, checked);
    if (!checked) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items);
    }
  };

  const getRootSelected = useMemo(() => {
    return selectedItems.length === items.length && items.length > 0;
  }, [selectedItems, items]);

  const rowRenderer = ({ index, style }: { index: number; style: any }) => {
    return (
      <div key={index} style={style}>
        <UserItem
          index={index}
          selectedItem={items[index]}
          selectionCallback={(selectedItem, selected) => {
            if (selected) {
              const selectedChildren = [selectedItem, ...selectedItems];
              setSelectedItems(selectedChildren);
            } else {
              const indx = selectedItems.findIndex(
                (i) => i.id === selectedItem.id
              );
              const tmp = [...selectedItems];
              tmp.splice(indx, 1);
              setSelectedItems(tmp);
            }
            checkCallback(false, items[index], groupItem, selected);
          }}
          name={items[index].description}
          secondaryName={items[index].login}
          key={items[index].login}
          selected={selectedItems.some((i) => i.id === items[index].id)}
          size={size}
          hasParent={true}
        />
      </div>
    );
  };

  const getItemContainerWidth = () => {
    let userCountLength = items.length.toString().length * 5;
    return `calc(100% - ${150 + userCountLength}px)`;
  };

  return hideEmptyGroup && items.length === 0 ? null : (
    <StyledRootBox _isSelected={selectedUsers.length > 0}>
      <StyledAccordion
        expanded={expanded}
        onChange={(event, expanded) => {
          onExpand?.(expanded, groupItem);
        }}
        data-testid={"group-" + index}
      >
        <StyledAccordionSummary
          _size={size}
          sx={{
            background:
              theme.palette.mode === "dark" && getRootSelected
                ? (theme as any).palette.action.select
                : "inherit",
          }}
          expandIcon={<ExpandMoreIcon />}
          id="admin"
        >
          <Box
            width={"calc(100% - 34px)"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"flex-start"}
            paddingLeft={"16px"}
            boxSizing={"border-box"}
          >
            {expanded ? (
              <StyledKeyboardArrowUpIcon
                _size={size}
                style={{
                  marginRight: "8px",
                  color: getRootSelected
                    ? theme.palette.primary.main
                    : (theme as any).palette.iconColor,
                }}
              />
            ) : (
              <StyledKeyboardArrowDownIcon
                _size={size}
                style={{
                  marginRight: "8px",
                  color: getRootSelected
                    ? theme.palette.primary.main
                    : (theme as any).palette.iconColor,
                }}
              />
            )}
            <StyledPeopleIcon
              _size={size}
              style={{
                marginRight: "10px",
                color: getRootSelected
                  ? theme.palette.primary.main
                  : (theme as any).palette.iconColor,
              }}
            />
            <Box display={"flex"} maxWidth={getItemContainerWidth()}>
              <Tooltip title={tooltip ? title : ""}>
                <StyledParagraph
                  onMouseEnter={(event) => onMouseEnterFunction(event)}
                  data-testid={"title"}
                >
                  {title}
                </StyledParagraph>
              </Tooltip>
            </Box>
            <StyledSecondaryText
              data-testid={"code"}
            >{`(${groupItem.code})`}</StyledSecondaryText>
            <StyledCountSPan data-testid={"amount"}>
              ({items.length})
            </StyledCountSPan>
          </Box>
          {!singleSelect && (
            <StyledCheckboxBox>
              <StyledCheckbox
                _size={size}
                indeterminate={
                  items.length > 0 &&
                  selectedItems.length !== items.length &&
                  selectedItems.length > 0
                }
                checked={getRootSelected}
                onChange={(e) => {
                  selectItemsFunc(e.target.checked);
                }}
                indeterminateIcon={
                  <IndeterminateCheckBoxIcon
                    style={{ color: theme.palette.primary.main }}
                  />
                }
                onClick={(e) => e.stopPropagation()}
                name="select"
                data-testid={"checkbox"}
              />
            </StyledCheckboxBox>
          )}
        </StyledAccordionSummary>
        <StyledAccordionDetails>
          {expanded && (
            <WindowScroller scrollElement={scrollElement}>
              {({ scrollTop, registerChild }) => (
                <AutoSizer disableHeight={true}>
                  {({ width }) => {
                    return (
                      <div ref={(el: any) => registerChild(el)}>
                        <List
                          autoHeight
                          height={scrollElement.clientHeight}
                          rowCount={items.length}
                          rowHeight={36}
                          rowRenderer={rowRenderer}
                          scrollTop={scrollTop}
                          width={width}
                        />
                      </div>
                    );
                  }}
                </AutoSizer>
              )}
            </WindowScroller>
          )}
        </StyledAccordionDetails>
      </StyledAccordion>
    </StyledRootBox>
  );
};

export default GroupAccordion;
