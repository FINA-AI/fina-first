import UserReturnsContainer from "../../../../containers/UserManager/Returns/UserManagerReturnsContainer";
import React from "react";
import { Group } from "../../../../types/group.type";

interface GroupReturnsPageProps {
  editMode: boolean;
  setGroupData: (object: Partial<Group>) => void;
  currentGroupData: Partial<Group>;
  tabName?: string;
}
const GroupReturnsPage: React.FC<GroupReturnsPageProps> = ({
  editMode,
  setGroupData,
  currentGroupData,
  tabName,
}) => {
  return (
    <UserReturnsContainer
      editMode={editMode}
      setData={setGroupData}
      currData={currentGroupData}
      groupMode={true}
      tabName={tabName}
    />
  );
};

export default GroupReturnsPage;
