import React, { useEffect, useState } from "react";
import { GroupRouteName } from "./Common/GroupRoutes";
import GroupPermissionsContainer from "../../../containers/UserManager/Group/Permissions/GroupPermissionsContainer";
import GroupVersionContainer from "../../../containers/UserManager/Group/GroupVersionContainer";
import GroupMDTPage from "./MDT/GroupMDTPage";
import GroupReturnsPage from "./Returns/GroupReturnsPage";
import GroupReportsContainer from "../../../containers/UserManager/Group/Reports/GroupReportsContainer";
import GroupFIContainer from "../../../containers/UserManager/Group/FI/GroupFIContainer";
import GroupUsersContainer from "../../../containers/UserManager/Group/Users/GroupUsersContainer";
import GroupMatrixPage from "./Matrix/GroupMatrixPage";
import { Group } from "../../../types/group.type";

/* eslint-disable react/prop-types */
interface GroupsTabPanelProps {
  editMode: boolean;
  setGroupData: (object: Partial<Group>) => void;
  groupData: Partial<Group>;
  groupId: string;
  tabName?: string;
}

const GroupsTabPanel: React.FC<GroupsTabPanelProps> = React.memo(
  ({ editMode, setGroupData, groupData, tabName, groupId }) => {
    const [openedTabs, setOpenedTabs] = useState([GroupRouteName.PERMISSIONS]);

    useEffect(() => {
      if (
        tabName &&
        Object.values(GroupRouteName).indexOf(tabName) >= 0 &&
        openedTabs.indexOf(tabName) < 0
      ) {
        setOpenedTabs([...openedTabs, tabName]);
      }
    }, [tabName]);

    const getComponent = (name: string) => {
      switch (name) {
        case GroupRouteName.PERMISSIONS:
          return (
            <GroupPermissionsContainer
              editMode={editMode}
              groupData={groupData}
              setGroupData={setGroupData}
              tabName={tabName}
              groupId={groupId}
            />
          );
        case GroupRouteName.USERS:
          return (
            <GroupUsersContainer
              editMode={editMode}
              groupData={groupData}
              setGroupData={setGroupData}
              tabName={tabName}
              groupId={groupId}
            />
          );
        case GroupRouteName.FI:
          return (
            <GroupFIContainer
              editMode={editMode}
              setGroupData={setGroupData}
              currentGroupData={groupData}
              tabName={tabName}
              groupId={groupId}
            />
          );
        case GroupRouteName.MDT:
          return (
            <GroupMDTPage
              editMode={editMode}
              setGroupData={setGroupData}
              currentGroupData={groupData}
              tabName={tabName}
            />
          );
        case GroupRouteName.RETURNS:
          return (
            <GroupReturnsPage
              editMode={editMode}
              setGroupData={setGroupData}
              currentGroupData={groupData}
              tabName={tabName}
            />
          );
        case GroupRouteName.REPORTS:
          return (
            <GroupReportsContainer
              editMode={editMode}
              setGroupData={setGroupData}
              currentGroupData={groupData}
              tabName={tabName}
              groupId={groupId}
            />
          );
        case GroupRouteName.VERSION:
          return (
            <GroupVersionContainer
              editMode={editMode}
              setGroupData={setGroupData}
              currentGroupData={groupData}
              tabName={tabName}
            />
          );
        case GroupRouteName.MATRIX:
          return (
            <GroupMatrixPage
              editMode={editMode}
              setGroupData={setGroupData}
              currentGroupData={groupData}
              tabName={tabName}
            />
          );
        default:
          return <div>TODO</div>;
      }
    };

    return (
      <div
        style={{
          height: "100%",
        }}
      >
        {openedTabs.map((tabItem, index) => {
          return (
            <div
              style={{
                height: "100%",
              }}
              key={index}
              role={"tabpanel"}
              hidden={tabItem !== tabName}
              id={`simple-tabpanel-${tabItem}`}
              aria-labelledby={`simple-tab-${tabItem}`}
            >
              {getComponent(tabItem)}
            </div>
          );
        })}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.groupData === nextProps.groupData &&
      prevProps.editMode === nextProps.editMode &&
      nextProps.tabName === prevProps.tabName
    );
  }
);

export default React.memo(GroupsTabPanel);
