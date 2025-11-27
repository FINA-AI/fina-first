import React from "react";
import UserMatrixContainer from "../../../../containers/UserManager/Matrix/UserMatrixContainer";
import { Group } from "../../../../types/group.type";

interface GroupMatrixPageProps {
  editMode: boolean;
  setGroupData: (object: Partial<Group>) => void;
  currentGroupData: Partial<Group>;
  tabName?: string;
}

const GroupMatrixPage: React.FC<GroupMatrixPageProps> = ({
  editMode,
  setGroupData,
  currentGroupData,
  tabName,
}) => {
  return (
    <UserMatrixContainer
      setData={setGroupData}
      currData={currentGroupData}
      editMode={editMode}
      tabName={tabName}
      groupMode={true}
    />
  );
};

export default GroupMatrixPage;
