import UserMDTContainer from "../../../../containers/UserManager/MDT/UserMDTContainer";
import React, { memo } from "react";
import { GroupRouteName } from "../Common/GroupRoutes";
import { Group } from "../../../../types/group.type";

interface GroupMDTPageProps {
  editMode: boolean;
  currentGroupData: Partial<Group>;
  setGroupData: (object: Partial<Group>) => void;
  tabName?: string;
}

const GroupMDTPage: React.FC<GroupMDTPageProps> = ({
  currentGroupData,
  setGroupData,
  editMode,
  tabName,
}) => {
  return (
    <UserMDTContainer
      groupMode={true}
      editMode={editMode}
      setData={setGroupData}
      currData={currentGroupData}
      tabName={tabName}
    />
  );
};

export default memo(GroupMDTPage, (prevProps, nextProps) => {
  if (nextProps.tabName === GroupRouteName.MDT) {
    return prevProps.editMode === nextProps.editMode;
  }
  return true;
});
