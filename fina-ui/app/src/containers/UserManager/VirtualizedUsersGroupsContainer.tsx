import React, { useCallback, useEffect, useState } from "react";
import VirtualizedUsersGroupsList from "../../components/UserManagement/Users/VirtualizedUsersGroupsList";

interface VirtualizedUsersGroupsContainerProps {
  currUser: any;
  userLogin: string;
  userFullName: string;
  onUserSelectChange: (item: any) => void;
  usersGroupsData: any;
  setUsersGroupsData: (item: any) => void;
  usersGroupsDataRef: any;
  isNewUser: boolean;
}

const VirtualizedUsersGroupsContainer: React.FC<
  VirtualizedUsersGroupsContainerProps
> = ({
  currUser,
  userLogin,
  userFullName,
  onUserSelectChange,
  usersGroupsData,
  setUsersGroupsData,
  usersGroupsDataRef,
  isNewUser,
}) => {
  const [scrollToIndex, setScrollToIndex] = useState(0);
  const [filterValue, setFilterValue] = useState<string | null>(null);

  useEffect(() => {
    if (filterValue?.trim()) {
      onFilter(filterValue?.trim());
      setScrollToIndex(scrollToIndex === 0 ? -1 : 0);
    } else if (filterValue !== null) {
      setUsersGroupsData([...usersGroupsDataRef.current]);
    }
  }, [filterValue]); // currUser

  const onFilter = useCallback(
    (filterValue: string) => {
      setUsersGroupsData(filterByCode(filterValue));
    },
    [usersGroupsData, currUser, filterValue]
  );

  const filterByCode = useCallback(
    (filterCode: string) => {
      return usersGroupsDataRef.current.reduce((acc: any[], item: any) => {
        if (item.group === true) {
          const filteredUsers = item.users.filter((user: any) =>
            user.login?.toLowerCase().includes(filterCode)
          );
          if (filteredUsers.length > 0) {
            acc.push({ ...item, users: filteredUsers });
          }
        } else if (
          item.login?.toLowerCase().includes(filterCode) ||
          item.code?.toLowerCase().includes(filterCode)
        ) {
          acc.push(item);
        }
        return acc;
      }, []);
    },
    [usersGroupsData, currUser, filterValue]
  );

  return (
    <>
      <VirtualizedUsersGroupsList
        usersGroupsData={usersGroupsData}
        user={currUser ? currUser : {}}
        userLogin={userLogin}
        userFullName={userFullName}
        onUserSelectChange={onUserSelectChange}
        onFilter={(v: string) => setFilterValue(v)}
        scrollToIndex={scrollToIndex}
        setScrollToIndex={setScrollToIndex}
        isNewUser={isNewUser}
      />
    </>
  );
};

export default React.memo(VirtualizedUsersGroupsContainer);
