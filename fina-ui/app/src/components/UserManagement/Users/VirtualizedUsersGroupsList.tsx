import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { darken, styled } from "@mui/system";
import { Box, ListItemButton } from "@mui/material";
import UserIcon from "./Common/UserIcon";
import Tooltip from "../../common/Tooltip/Tooltip";
import { useTranslation } from "react-i18next";
import GroupsIcon from "@mui/icons-material/Groups";
import ToolbarListSearch from "../../Catalog/MiniCatalog/ListSearch";
import { VariableSizeList } from "react-window";
import { UserTypeEnum } from "../../../types/user.type";
import ListItem from "@mui/material/ListItem";
import { AutoSizer } from "react-virtualized";

interface VirtualizedUsersGroupsListProps {
  onUserSelectChange: (item: any) => void;
  user: any;
  userFullName: string;
  userLogin: string;
  onFilter: (item: any) => void;
  usersGroupsData: any;
  scrollToIndex: number;
  setScrollToIndex: (item: number) => void;
  isNewUser: boolean;
}

const StyledActiveUserBox = styled(Box, {
  shouldForwardProp: (prop: string) => !prop.startsWith("_"),
})<{ _active: boolean }>(({ theme, _active }) => ({
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  "& .MuiTypography-root": {
    fontSize: "11px",
    lineHeight: "12px",
    fontWeight: 500,
    color: _active
      ? `${theme.palette.mode === "dark" ? "#1F2532" : "#FFF"} !important`
      : theme.palette.mode === "dark"
      ? "#ABBACE"
      : "#98A7BC",
  },
}));

const StyledNameTypography = styled(Typography, {
  shouldForwardProp: (prop: string) => !prop.startsWith("_"),
})<{ _isActive: boolean }>(
  ({ theme, _isActive }: { theme: any; _isActive: boolean }) => ({
    fontSize: "13px",
    lineHeight: "20px",
    fontWeight: 500,
    marginBottom: "5px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: _isActive
      ? `${theme.palette.mode === "dark" ? "#1F2532" : "#FFF"} !important`
      : theme.palette.mode === "dark"
      ? "#F5F7FA"
      : undefined, // Ensure there is a fallback value
  })
);

const StyledDescriptionTypography = styled(Typography, {
  shouldForwardProp: (prop: string) => !prop.startsWith("_"), // Prevents `_isActive` from being passed to DOM
})<{ _isActive: boolean }>(({ theme, _isActive }) => ({
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  fontSize: "11px",
  lineHeight: "16px",
  fontWeight: 400,
  width: "100%",
  color: _isActive
    ? `${theme.palette.mode === "dark" ? "#1F2532" : "#FFF"} !important`
    : theme.palette.mode === "dark"
    ? "#ABBACE"
    : "inherit", // Added a fallback
}));

const StyledListItem = styled(ListItem, {
  shouldForwardProp: (prop: string) => !prop.startsWith("_"), // Prevents `_isActive` from being passed to DOM
})<{ _isActive: boolean; _isGroupItem: boolean }>(
  ({ theme, _isActive, _isGroupItem }) => ({
    height: "70px",
    minHeight: "70px",
    display: "flex",
    gap: "10px",
    // flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    borderBottom: theme.palette.borderColor,
    boxSizing: "border-box",
    cursor: "pointer",
    "&.Mui-focusVisible": {
      backgroundColor: "none",
    },
    "&.Mui-selected": {
      color: "#FFF",
      "& p": {
        color: "#FFF",
      },
    },
    "&:hover": {
      backgroundColor: _isActive
        ? theme.palette.primary.main
        : darken(theme.palette.buttons.secondary.hover ?? "#fbfbfb", 0.1),
    },
    backgroundColor: _isGroupItem
      ? _isActive
        ? theme.palette.primary.main
        : darken(theme.palette.paperBackground, 0.1)
      : _isActive
      ? theme.palette.primary.main
      : "inherit",
  })
);

const StyledListItemButton = styled(ListItemButton)({
  display: "flex",
  gap: "10px",
});

const StyledGroupIcon = styled(GroupsIcon)(({ theme }) => ({
  color: theme.palette.iconColor,
}));

const ITEM_SIZE = 70;

const NewUserListItem = ({ userFullName, userLogin }: any) => {
  return (
    <StyledListItem key={"reference0"} _isActive={true} _isGroupItem={false}>
      <UserIcon
        selectedUser={{ id: 0 }}
        user={{ userType: UserTypeEnum.FINA_USER, blocked: false, id: 0 }}
      />
      <Box overflow={"hidden"}>
        <StyledNameTypography _isActive={true}>
          <span>{userLogin}</span>
        </StyledNameTypography>
        <StyledDescriptionTypography _isActive={true}>
          <span>{userFullName}</span>
        </StyledDescriptionTypography>
      </Box>
    </StyledListItem>
  );
};

const ListItemComponent = ({ item, onUserSelectChange, user, index }: any) => {
  const { t } = useTranslation();
  const isActive = user?.uniqueId === item?.uniqueId;

  return (
    <StyledListItem
      key={"key" + item?.uniqueId}
      _isActive={isActive}
      _isGroupItem={item.isGroupMember}
      onClick={() => {
        onUserSelectChange(item);
      }}
      data-testid={"item-" + index}
    >
      <Box>
        <UserIcon selectedUser={user} user={item} />
      </Box>
      <Box overflow={"hidden"}>
        <StyledActiveUserBox _active={isActive}>
          <Box>
            <Typography>{t("finaUser")}</Typography>
          </Box>
        </StyledActiveUserBox>
        <Tooltip title={`${item.login}`}>
          <Box
            sx={{
              display: "flex",
              width: "100%",
            }}
          >
            <StyledNameTypography _isActive={isActive} data-testid={"code"}>
              {item.group === undefined
                ? item.login
                : item.group === false
                ? item.code
                : item.login}
            </StyledNameTypography>
          </Box>
        </Tooltip>
        <Tooltip title={`${item.description}`}>
          <StyledDescriptionTypography
            _isActive={isActive}
            data-testid={"description"}
          >
            {item.description}
          </StyledDescriptionTypography>
        </Tooltip>
      </Box>
    </StyledListItem>
  );
};

const VirtualizedUsersGroupsList: React.FC<VirtualizedUsersGroupsListProps> = ({
  onUserSelectChange,
  user,
  userFullName,
  userLogin,
  onFilter,
  usersGroupsData,
  scrollToIndex,
  setScrollToIndex,
  isNewUser,
}) => {
  const firstExpandedGroupId = useMemo(() => {
    let groupId = 0;

    usersGroupsData.some((item: any) => {
      if (item.group) {
        if (item?.users.some((u: any) => u.id === user.id)) {
          groupId = item.id;
          return true;
        }
      }
    });

    return groupId;
  }, [usersGroupsData, user.id]);

  const listRef = useRef<any>(null);
  const [items, setItems] = useState<any>([]);
  const [expandedGroupIds] = useState<any>(
    new Set(firstExpandedGroupId ? [firstExpandedGroupId] : [])
  );

  useEffect(() => {
    if (expandedGroupIds.size > 0) {
      let newItems = [...usersGroupsData];
      expandedGroupIds.forEach((id: number) => {
        const findIndex = newItems.findIndex(
          (g: any) => g.group && g.id === id
        );
        newItems = expandGroupAndUpdateItems(findIndex, id, newItems);
      });
      setItems(newItems);
      const findIndex = newItems.findIndex(
        (item: any) => item.uniqueId === user.uniqueId
      );
      setScrollToIndex(findIndex === -1 ? 0 : findIndex);
    } else {
      let findIndex = usersGroupsData.findIndex(
        (item: any) => !item.group && item.id === user.id
      );
      setItems(usersGroupsData);
      setScrollToIndex(findIndex === -1 ? 0 : findIndex);
    }

    if (user.id < 0) setScrollToIndex(0);
  }, [usersGroupsData]);

  useEffect(() => {
    if (listRef.current) {
      return listRef.current.scrollToItem(scrollToIndex, "start");
    }
  }, [scrollToIndex]);

  const handleGroupExpandUnExpand = (
    groupId: number,
    index: number,
    cutAmount: number
  ) => {
    if (expandedGroupIds.has(groupId)) {
      items.splice(index + 1, cutAmount);
      expandedGroupIds.delete(groupId);
      setItems([...items]);
    } else {
      const updatedItems = expandGroupAndUpdateItems(index, groupId, items);
      setItems(updatedItems);
    }
  };

  const expandGroupAndUpdateItems = (
    index: number,
    groupId: number,
    items: any
  ) => {
    if (index < 0) return items;
    const insertItems =
      items
        .find((item: any) => item.group && item.id === groupId)
        ?.users.map((user: any) => ({ ...user, isGroupMember: true })) || [];

    let firstPart = items.slice(0, index + 1);
    let secondPart = items.slice(index + 1);

    const updatedItems = [...firstPart, ...insertItems, ...secondPart];
    expandedGroupIds.add(groupId);

    return updatedItems;
  };

  const getItemSize = useCallback((): number => {
    return ITEM_SIZE;
  }, [items]);

  const Row = useCallback(
    ({ index, style }: any) => {
      const item: any = items[index];

      if (item.group) {
        return (
          <div style={style}>
            <StyledListItemButton
              sx={{
                pointerEvents: item.users?.length > 0 ? "auto" : "none",
                height: ITEM_SIZE,
              }}
              onClick={() =>
                handleGroupExpandUnExpand(item.id, index, item?.users?.length)
              }
              data-testid={"item-" + index}
            >
              <StyledGroupIcon fontSize={"large"} />
              <Typography component="span" data-testid={"code"}>
                {item.code}
              </Typography>
              <Typography
                component="span"
                data-testid={"users-amount"}
              >{` (${item?.users?.length})`}</Typography>
              <ExpandMoreIcon
                sx={{
                  marginLeft: "auto",
                  transform: expandedGroupIds.has(item.id) && "rotate(180deg)",
                  display: item?.users?.length > 0 ? "block" : "none",
                }}
              />
            </StyledListItemButton>
          </div>
        );
      } else {
        return (
          <div style={style}>
            <ListItemComponent
              item={item}
              user={user}
              onUserSelectChange={onUserSelectChange}
              index={index}
            />
          </div>
        );
      }
    },
    [items, user]
  );

  return (
    <>
      <Box>
        <ToolbarListSearch
          to={"/usermanager/users"}
          onFilter={onFilter}
          height={55}
        />
      </Box>
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {isNewUser && (
          <NewUserListItem userFullName={userFullName} userLogin={userLogin} />
        )}
        <AutoSizer>
          {({ height, width }) => (
            <VariableSizeList
              style={{ scrollBehavior: "smooth" }}
              height={height}
              width={width}
              itemCount={items?.length || 0}
              itemSize={getItemSize}
              ref={listRef}
            >
              {Row}
            </VariableSizeList>
          )}
        </AutoSizer>
      </Box>
    </>
  );
};

export default VirtualizedUsersGroupsList;
