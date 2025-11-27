import React, { useEffect, useState } from "react";
import GroupAccordion from "./GroupAccordion";
import { loadUsersAndGroups } from "../../api/services/userManagerService";
import { Box, Grid, Skeleton } from "@mui/material";
import SearchField from "../common/Field/SearchField";
import UserItem from "./UserItem";
import { UserAndGroup } from "../../types/user.type";

interface UserAndGroupsProps {
  data: UserAndGroup[];
  selectedUsers: UserAndGroup[];
  setSelectedUsers: (data: UserAndGroup[]) => void;
  filterCurrentUsers: UserAndGroup[];
}

const UserAndGroups: React.FC<UserAndGroupsProps> = ({
  data = [],
  selectedUsers = [],
  setSelectedUsers = () => {},
  filterCurrentUsers,
}) => {
  const [items, setItems] = useState(data);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data.length === 0) {
      setLoading(true);
      loadUsersFunction();
    }
  }, []);

  const loadUsersFunction = () => {
    loadUsersAndGroups().then((res) => {
      const data = res.data;
      setLoading(false);
      if (data) {
        setItems(data);
      }
    });
  };

  const checkCallback = (
    isGroup: boolean,
    item: UserAndGroup,
    parent: UserAndGroup | null,
    checked: boolean
  ) => {
    if (isGroup) {
      if (checked) {
        setSelectedUsers(
          item.users.slice().concat(selectedUsers) as UserAndGroup[]
        );
      } else {
        setSelectedUsers(
          selectedUsers.filter(
            (u) => !item.users.some((usr) => usr.id === u.id)
          )
        );
      }
    } else {
      if (checked) {
        selectedUsers.push(item);
        setSelectedUsers([...selectedUsers]);
      } else {
        setSelectedUsers(selectedUsers.filter((u) => u.id !== item.id));
      }
    }
  };

  const ComponentSkeleton = () => {
    return (
      <Box
        display={"flex"}
        flex={1}
        style={{
          paddingLeft: 50,
          paddingRight: 50,
        }}
        flexDirection={"column"}
      >
        <Skeleton
          height={70}
          style={{
            marginBottom: "30px",
          }}
        />

        <Grid
          container
          spacing={3}
          style={{
            paddingLeft: "20px",
            paddingRight: "20px",
            overflow: "hidden !important",
          }}
        >
          {Array(10)
            .fill(0)
            .map((v, index) => {
              return (
                <Grid container spacing={3} key={index + "" + v}>
                  <Grid item xs={1}>
                    <Skeleton height={40} />
                  </Grid>
                  <Grid item xs={10}>
                    <Skeleton height={40} />
                  </Grid>
                  <Grid item xs={1}>
                    <Skeleton height={40} />
                  </Grid>
                </Grid>
              );
            })}
        </Grid>
      </Box>
    );
  };

  return loading ? (
    <ComponentSkeleton />
  ) : (
    <Box>
      <SearchField
        style={{
          width: "100%",
          height: "40px",
          marginBottom: "22px",
          "& input::placeholder": {
            fontSize: "14px",
          },
        }}
        withFilterButton={false}
      />
      <Box padding={0}>
        {items.map((item, index) => {
          if (!item.group) {
            let show = true;
            if (filterCurrentUsers) {
              show = filterCurrentUsers.some((f) => f.id === item.id);
            }
            return (
              show && (
                <UserItem
                  index={index}
                  selectedItem={item}
                  selectionCallback={(selectedItem, selected) => {
                    checkCallback(false, selectedItem, null, selected);
                  }}
                  name={item.description}
                  secondaryName={item.login}
                  key={"" + item.login + item.id}
                  selected={selectedUsers.some((i) => i.id === item.id)}
                />
              )
            );
          }
          return (
            <GroupAccordion
              index={index}
              groupItem={item}
              hideEmptyGroup={!!filterCurrentUsers}
              items={
                filterCurrentUsers
                  ? item.users.filter((g) =>
                      filterCurrentUsers.some((f) => f.id === g.id)
                    )
                  : item.users
              }
              title={item.description}
              key={item.id}
              checkCallback={checkCallback}
              selectedUsers={item.users.filter((u) =>
                selectedUsers.some((user) => user.id === u.id)
              )}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default UserAndGroups;
