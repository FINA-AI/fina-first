import { MoreHoriz } from "@mui/icons-material";
import { MenuItem, Select } from "@mui/material";
import React, { useState } from "react";
import { PaginationTypes } from "../../../util/appUtil";
import { AutoSizer, List } from "react-virtualized";
import { UsePaginationItem } from "@mui/material/usePagination";
import { styled } from "@mui/material/styles";

interface MiniNavigationProps {
  index: number;
  lowerBound: number;
  upperBound: number;
  type: string;
  visibilityLimit?: number;
  localOptions: number[];
  setLocalOptions: (options: number[]) => void;
  handleOnClick: (val: number) => void;
  items?: UsePaginationItem[];
  count: number;
}

interface RowRendererTypes {
  index: number;
  style: React.CSSProperties;
}

const MenuProps = {
  PaperProps: {
    sx: {
      backgroundColor: "white !important",
      borderRadius: "4px",
      minWidth: "unset",
      maxHeight: "244px",
      width: "40px",
      overflow: "hidden",
      marginTop: "-50px !important",
      position: "fixed",
      display: "flex",
      boxSizing: "border-box",
      height: "250px",
      "& .MuiList-root": {
        padding: "0px !important",
        border: "unset",
        display: "flex !important",
        flexDirection: "column",
        overflow: "auto",
        width: "100%",
        "&::-webkit-scrollbar": {
          width: 0,
          height: "100%",
        },
      },
    },
  },
};

const StyledSelect = styled(Select)(() => ({
  "& .MuiSelect-select": {
    padding: "0px 0px 0px 0px",
    backgroundColor: "transparent !important",
    width: "50px",
    minWidth: "unset",
    height: "-webkit-fill-available",
    paddingRight: "0px !important",
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }: any) => ({
  width: "34px !important",
  height: "34px",
  border: theme.palette.borderColor,
  borderRadius: "4px",
  justifyContent: "center !important",
  marginBottom: "5px",
  position: "relative",
  left: "2.6px",
  fontSize: "14px",
  "& .MuiSvgIcon-root": {
    width: "22px !important",
    height: "22px !important",
  },
  "& .MuiTouchRipple-root": {
    color: "transparent",
  },
  "&:hover": {
    border: `1px solid ${
      theme.palette.mode === "dark" ? "#5D789A" : theme.palette.primary.main
    }`,
    backgroundColor: "transparent",
  },
}));

const MiniNavigation: React.FC<MiniNavigationProps> = ({
  index,
  lowerBound,
  type,
  localOptions,
  setLocalOptions,
  handleOnClick,
  items,
  count,
}) => {
  const [openStartEllipsis, setOpenStartEllipsis] = useState(false);
  const [openEndEllipsis, setOpenEndEllipsis] = useState(false);

  const localLowerBound = lowerBound;

  const initializeLocalOptions = () => {
    let end;
    if (items) {
      end = items.find((item) => {
        if (
          item.page != null &&
          item.type === "page" &&
          item.page > localLowerBound
        ) {
          return item;
        }
      });
    }

    let pages = Array.from({ length: count }, (_, i) => i + 1);
    const filteredSecondArray = pages.slice(
      localLowerBound - 1,
      (end?.page as number) - 1
    );
    setLocalOptions(filteredSecondArray);
  };

  const handleOnOpen = () => {
    handleOpenEllipsis(true);
    initializeLocalOptions();
  };

  const handleOpenEllipsis = (value: boolean) => {
    type === PaginationTypes.START_ELLIPSIS
      ? setOpenStartEllipsis(value)
      : setOpenEndEllipsis(value);
  };

  const rowRenderer = ({ index, style }: RowRendererTypes) => {
    const item = localOptions[index];
    return (
      <div key={index} style={{ ...style }}>
        <StyledMenuItem
          key={`item-${index}`}
          value={String(item)}
          onClick={() => {
            handleOnClick(item);
            handleOpenEllipsis(false);
          }}
          data-testid={`page-${item}-button`}
        >
          {String(item)}
        </StyledMenuItem>
      </div>
    );
  };

  return (
    <StyledSelect
      key={`pagination-item-${index}`}
      variant="outlined"
      IconComponent={MoreHoriz}
      MenuProps={MenuProps}
      value={""}
      onOpen={() => handleOnOpen()}
      onClose={() => handleOpenEllipsis(false)}
      open={
        type === PaginationTypes.START_ELLIPSIS
          ? openStartEllipsis
          : openEndEllipsis
      }
      data-testid={`mini-pagination`}
    >
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            rowCount={localOptions.length}
            rowHeight={40}
            width={width}
            rowRenderer={rowRenderer}
            style={{ overflowX: "hidden", scrollbarWidth: "none" }}
          />
        )}
      </AutoSizer>
    </StyledSelect>
  );
};

export default MiniNavigation;
