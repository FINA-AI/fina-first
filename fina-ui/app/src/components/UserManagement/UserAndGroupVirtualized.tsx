import React, { Suspense, useEffect, useRef, useState } from "react";
import { loadUsersAndGroups } from "../../api/services/userManagerService";
import { AutoSizer, List, WindowScroller } from "react-virtualized";
import SearchField from "../common/Field/SearchField";
import UserAndGroupSkeleton from "./UserAndGroupSkeleton";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/system";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SimpleLoadMask from "../common/SimpleLoadMask";
import { UserAndGroup, UserType } from "../../types/user.type";

const UserItem = React.lazy(() => import("./UserItem"));
const GroupAccordion = React.lazy(() => import("./GroupAccordion"));

interface UserAndGroupVirtualizedProps {
  data?: UserAndGroup[] | null;
  selectedUsers?: UserAndGroup[];
  setSelectedUsers: (users: UserAndGroup[]) => void;
  filterCurrentUsers?: UserAndGroup[];
  singleSelect?: boolean;
  size: string;
  height?: number;
  usersLoading?: boolean;
  onlyExternals: boolean;
  excludeFilterHidden?: boolean;
}

const StyledWrapperBox = styled(Box)(({ theme }) => ({
  borderBottom: theme.palette.borderColor,
  padding: "8px 8px 8px 12px",
  alignItems: "center",
  justifyContent: "space-between",
  display: "flex",
  height: "100%",
}));

const StyledContainerDiv = styled("div")<{ _height: number; ref: any }>(
  ({ _height }) => ({
    height: _height,
    width: "100%",
    overflow: "auto",
  })
);

const UserAndGroupVirtualized: React.FC<UserAndGroupVirtualizedProps> = ({
  data = [],
  selectedUsers = [],
  setSelectedUsers = () => {},
  filterCurrentUsers,
  singleSelect = false,
  size = "default",
  height = 200,
  usersLoading = false,
  onlyExternals = false,
  excludeFilterHidden = false,
}) => {
  const [items, setItems] = useState<UserAndGroup[]>([]);
  const [filteredItems, setFilteredItems] = useState<UserAndGroup[]>([]);
  const [loading, setLoading] = useState({
    skeleton: usersLoading,
    mask: false,
  });
  const [expandedIndex, setExpandedIndex] = useState<number[]>([]);
  const [scrollElement, setScrollElement] = useState<any>();
  const [expandedItems, setExpandedItems] = useState<UserAndGroup[]>([]);
  const [searchText, setSearchText] = useState("");
  const [excludeDeleted, setExcludeDeleted] = useState(true);
  const { t } = useTranslation();

  const tableRef = useRef<any>();

  useEffect(() => {
    if (!data || data?.length === 0) {
      loadUsersFunction(excludeDeleted);
    } else {
      setItems(data);
      setFilteredItems(data);
    }
  }, []);

  useEffect(() => {
    if (filterCurrentUsers) {
      setItems(filterCurrentUsers);
      setFilteredItems(filterCurrentUsers);
    }
  }, [filterCurrentUsers]);

  useEffect(() => {
    tableRef.current?.recomputeRowHeights();
  }, [expandedIndex, items]);

  const onSearchValueChange = (searchText: string) => {
    if (!searchText) {
      setExpandedItems([]);
      setExpandedIndex([]);
      setItems([...filteredItems]);
    } else {
      const arr = [...getModifiedDataBySearchValue(searchText, filteredItems)];
      let newGroups = arr.filter((f) => f.group && f.users.length > 0);
      let newUsers = arr.filter((u) => !u.group);

      setExpandedItems([...newGroups]);
      setExpandedIndex([...newGroups.map((g, index) => index)]);
      setItems([...newGroups, ...newUsers]);
    }
  };

  const getModifiedDataBySearchValue = (
    searchValue: string,
    data: UserAndGroup[]
  ) => {
    const searchText = searchValue?.toLowerCase();

    if (!searchText) return data;

    let arr: UserAndGroup[] = [
      ...data
        .filter((item) => item.group)
        .map((group) => {
          return { ...group, users: [] };
        }),
    ];

    data.forEach((item) => {
      if (item.users) {
        let users = item.users.filter(
          (user) =>
            user.description?.toLowerCase().includes(searchText) ||
            user.login?.toLowerCase().includes(searchText)
        );
        arr = [
          ...arr.map((group) => {
            return group.id === item.id
              ? { ...group, users: [...users] }
              : group;
          }),
        ];
      }

      if (!item.group) {
        let users =
          item.description?.toLowerCase().includes(searchText) ||
          item.code?.toLowerCase().includes(searchText);
        if (users) {
          arr = [...arr, item];
        }
      }
    });

    return arr;
  };

  const loadUsersFunction = (excludeDeletedParam: boolean) => {
    loadUsersAndGroups(onlyExternals, excludeDeletedParam).then((res) => {
      const fetchedData: UserAndGroup[] = res.data;

      if (filterCurrentUsers) {
        setItems([
          ...getModifiedDataBySearchValue(searchText, filterData(fetchedData)),
        ]);
      } else {
        const modifiedData = [
          ...getModifiedDataBySearchValue(searchText, fetchedData),
        ];
        setItems(modifiedData);
        setFilteredItems(fetchedData);
      }
      setLoading({ ...loading, mask: false });
    });
  };

  const handleVisibilityToggle = () => {
    const newExcludeDeleted = !excludeDeleted;
    setExcludeDeleted(newExcludeDeleted);
    setLoading({ ...loading, mask: true });
    loadUsersFunction(newExcludeDeleted);
  };

  const filterData = (data: UserAndGroup[]) => {
    const users = data.filter((item) => {
      return (
        !item.group &&
        filterCurrentUsers &&
        filterCurrentUsers.some((u) => u.id === item.id)
      );
    });

    const groups = data.filter((g) => g.group);
    groups.forEach((g) => {
      const users = g.users.filter((u) =>
        (filterCurrentUsers ?? []).some((fu) => fu.id == u.id)
      );
      g.users = users;
    });

    return groups.filter((g) => g.users.length > 0).concat(users);
  };

  const checkCallback = (
    isGroup: boolean,
    item: UserAndGroup,
    parent: any,
    checked: boolean
  ) => {
    if (singleSelect) {
      setSelectedUsers(checked ? [item] : []);
    } else {
      if (isGroup) {
        if (checked) {
          setSelectedUsers(
            item.users.slice().concat(selectedUsers) as UserAndGroup[]
          );
        } else {
          setSelectedUsers(
            selectedUsers.filter(
              (u: UserAndGroup) => !item.users.some((usr) => usr.id === u.id)
            )
          );
        }
      } else {
        if (checked) {
          selectedUsers.push(item);
          setSelectedUsers([...selectedUsers]);
        } else {
          setSelectedUsers(
            selectedUsers.filter((u: UserType) => u.id !== item.id)
          );
        }
      }
    }
  };

  const onExpand = (
    expanded: boolean,
    groupItem: UserAndGroup,
    index: number
  ) => {
    if (expanded) {
      setExpandedItems([groupItem, ...expandedItems]);
      setExpandedIndex([index, ...expandedIndex]);
    } else {
      setExpandedItems([...expandedItems.filter((i) => i.id !== groupItem.id)]);
      setExpandedIndex(expandedIndex.filter((i) => i !== index));
    }
  };

  const rowRenderer = ({ index, style }: { index: number; style: any }) => {
    const item = items[index];

    return (
      <Suspense>
        <div key={index} style={style}>
          {item.group ? (
            item.users.length > 0 && (
              <GroupAccordion
                scrollElement={scrollElement}
                onExpand={(expanded: boolean, groupIdem: UserAndGroup) => {
                  onExpand(expanded, groupIdem, index);
                }}
                groupItem={item}
                hideEmptyGroup={!!filterCurrentUsers}
                items={item.users}
                title={item.description}
                key={item.id}
                checkCallback={checkCallback}
                selectedUsers={item.users.filter((u) =>
                  selectedUsers.some((user: UserAndGroup) => user.id === u.id)
                )}
                expanded={expandedItems.some((it) => it.id === item.id)}
                singleSelect={singleSelect}
                size={size}
                index={index}
              />
            )
          ) : (
            <UserItem
              selectedItem={item}
              selectionCallback={(
                selectedItem: UserAndGroup,
                selected: boolean
              ) => {
                checkCallback(false, selectedItem, null, selected);
              }}
              name={item.description}
              secondaryName={item.login || item?.code}
              key={"" + item.login + item.id}
              selected={!!selectedUsers.find((i: UserType) => i.id === item.id)}
              size={size}
              index={index}
            />
          )}
        </div>
      </Suspense>
    );
  };

  const getRowHeight = ({ index }: { index: number }) => {
    return expandedIndex.includes(index)
      ? items[index].users.length * 36 + 36
      : items[index].group && items[index].users.length === 0
      ? 0
      : 36;
  };

  return (
    <Box
      display={"flex"}
      flex={1}
      id={"RootContainer"}
      flexDirection={"column"}
      position={"relative"}
      data-testid={"userAndGroupVirtualized-container"}
    >
      {loading.mask && <SimpleLoadMask loading={true} color={"primary"} />}
      <StyledWrapperBox>
        {!excludeFilterHidden &&
          (!excludeDeleted ? (
            <RemoveRedEyeIcon
              onClick={handleVisibilityToggle}
              style={{ cursor: "pointer", paddingRight: "6px" }}
              data-testid={"visibility-toggle-button"}
            />
          ) : (
            <VisibilityOffIcon
              onClick={handleVisibilityToggle}
              style={{ cursor: "pointer", paddingRight: "6px" }}
              data-testid={"invisibility-toggle-button"}
            />
          ))}

        <SearchField
          defaultValue={searchText}
          text={t("search")}
          withFilterButton={false}
          onFilterChange={(val) => {
            setSearchText(val);
            onSearchValueChange(val);
          }}
          width={"100%"}
          onClear={() => {
            setSearchText("");
            onSearchValueChange("");
          }}
        />
      </StyledWrapperBox>
      <StyledContainerDiv
        _height={height}
        ref={setScrollElement}
        data-testid={"list-container"}
      >
        {loading.skeleton ? (
          <UserAndGroupSkeleton />
        ) : (
          <WindowScroller scrollElement={scrollElement}>
            {({ height, isScrolling, registerChild, scrollTop }) => (
              <div>
                <div
                  ref={
                    registerChild as (instance: HTMLDivElement | null) => void
                  }
                >
                  <AutoSizer disableHeight>
                    {({ width }) => (
                      <List
                        ref={tableRef}
                        autoHeight
                        height={height ? height : 0}
                        isScrolling={isScrolling}
                        rowCount={items.length}
                        rowHeight={getRowHeight}
                        rowRenderer={rowRenderer}
                        scrollTop={scrollTop}
                        width={width}
                      />
                    )}
                  </AutoSizer>
                </div>
              </div>
            )}
          </WindowScroller>
        )}
      </StyledContainerDiv>
    </Box>
  );
};

export default UserAndGroupVirtualized;
