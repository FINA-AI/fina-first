import { Box, IconButton, Menu } from "@mui/material";
import RecipientGridFilter from "../../../../Notifications/NotificationUserGrid/RecipientGridFilter";
import React, { ReactNode, useEffect, useState } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import { styled } from "@mui/material/styles";
import RecipientGridSortButton from "../../../../Notifications/NotificationUserGrid/RecipientGridSortButton";
import { RecipientFilterType } from "../../../../../types/messages.type";
import {
  CommRecipientType,
  CommSelectedRoot,
} from "../../../../../types/communicator.common.type";

interface CommunicatorRecipientGridToolbarProps {
  dataLength: number;
  initData: (filters?: RecipientFilterType) => void;
  selectedRootMessage: CommSelectedRoot;
  setSelectedItem: (item: CommRecipientType) => void;
  setSelectedRecipient: (item: CommRecipientType) => void;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  recipients: CommRecipientType[];
  toolbarActionButtons: ReactNode;
}

const StyledToolbar = styled(Box)(({ theme }: { theme: any }) => ({
  padding: theme.toolbar.padding,
  borderBottom: theme.palette.borderColor,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  boxSizing: "border-box",
  width: "100%",
  "& .MuiSvgIcon-root": {
    color:
      theme.palette.mode === "light" ? "rgba(104, 122, 158, 0.8)" : "#5D789A",
    cursor: "pointer",
  },
}));

const StyledToolbarFlexBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "4px",
});

const StyledMenu = styled(Menu)({
  "& .MuiPaper-root": {
    "& ul": {
      padding: "0px",
    },
  },
});

const StyledActiveFilter = styled(Box)<{ isFilterActive: boolean }>(
  ({ isFilterActive }) => ({
    ...(isFilterActive && {
      background: "#FF4128",
      width: "4px",
      height: "4px",
      borderRadius: "34px",
      position: "absolute",
      right: "0px",
      top: "1px",
    }),
  })
);

const CommunicatorRecipientGridToolbar: React.FC<
  CommunicatorRecipientGridToolbarProps
> = ({
  dataLength,
  initData,
  selectedRootMessage,
  setSelectedItem,
  recipients,
  setPage,
  setSelectedRecipient,
  toolbarActionButtons,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null);
  const openFilter = Boolean(anchorEl);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    setIsFilterActive(false);
    setFilters({});
  }, [selectedRootMessage]);
  const handleFilterOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleFilterClose = () => {
    setAnchorEl(null);
  };
  const GetFilterButton = () => {
    return (
      <span>
        <IconButton
          sx={{ border: "none" }}
          disabled={dataLength === 0 && !selectedRootMessage?.id}
          onClick={handleFilterOpen}
          data-testid={"filter-icon-button"}
        >
          <StyledActiveFilter isFilterActive={isFilterActive} />
          <FilterListIcon fontSize="medium" />
        </IconButton>
      </span>
    );
  };
  return (
    <StyledToolbar data-testid={"toolbar"}>
      <StyledToolbarFlexBox>
        <RecipientGridSortButton
          initData={initData}
          filters={filters}
          dataLength={dataLength}
        />
        {GetFilterButton()}
        <StyledMenu
          anchorEl={anchorEl}
          open={openFilter}
          onClose={handleFilterClose}
        >
          <RecipientGridFilter
            recipients={recipients}
            initData={initData}
            setPage={setPage}
            handleFilterClose={handleFilterClose}
            setFilters={setFilters}
            filters={filters}
            setIsFilterActive={setIsFilterActive}
            onSelectedRecipientChange={(val) =>
              setSelectedRecipient && setSelectedRecipient(val)
            }
            setSelectedItem={setSelectedItem}
          />
        </StyledMenu>
      </StyledToolbarFlexBox>
      <StyledToolbarFlexBox>{toolbarActionButtons}</StyledToolbarFlexBox>
    </StyledToolbar>
  );
};

export default CommunicatorRecipientGridToolbar;
