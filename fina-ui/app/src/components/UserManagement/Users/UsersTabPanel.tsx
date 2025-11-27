import React, { useEffect, useState } from "react";
import { UserRouteName } from "./Common/UserRoutes";
import UserReturnsContainer from "../../../containers/UserManager/Returns/UserManagerReturnsContainer";
import UsersGroupsContainer from "../../../containers/UserManager/Groups/UsersGroupsContainer";
import UsersGeneralContainer from "../../../containers/UserManager/General/UsersGeneralContainer";
import UserVersionContainer from "../../../containers/UserManager/Version/UserVersionContainer";
import UserFIContainer from "../../../containers/UserManager/FI/UserFIContainer";
import UserMDTContainer from "../../../containers/UserManager/MDT/UserMDTContainer";
import UserPermissionsContainer from "../../../containers/UserManager/Permissions/UserPermissionsContainer";
import UsersEcmContainer from "../../../containers/UserManager/Ecm/UsersEcmContainer";
import UserReportsContainer from "../../../containers/UserManager/Reports/UserReportsContainer";
import UserMatrixContainer from "../../../containers/UserManager/Matrix/UserMatrixContainer";
import EmptyUserPlaceholder from "./Common/EmptyUserPlaceholder";
import { UserType, UserTypeWithUIProps } from "../../../types/user.type";
import { Config } from "../../../types/config.type";
import { Group } from "../../../types/group.type";

/* eslint-disable react/prop-types */
interface UsersTabPanelProps {
  editMode: boolean;
  currUser: Partial<UserTypeWithUIProps>;
  onCancelFunction: VoidFunction;
  onEditFunction: (editMode: boolean) => void;
  config: Config;
  setCurrUser: React.Dispatch<
    React.SetStateAction<Partial<UserTypeWithUIProps> | null>
  >;
  formValidationHelper: any;
  requiredFields: string[];
  tabName?: string;
  userId: string;
  showMatrixTab?: boolean;
  groups: Group[];
  resetUserData(object: Partial<UserType>): void;
  deleteUserFunction(userId: number): Promise<void>;
  changeNewUserInfo(key: string, value: string): void;
  setUserData(object: Partial<UserType>): void;
  onSaveFunction(formValidationHelper: any): void;
}

const UsersTabPanel: React.FC<UsersTabPanelProps> = React.memo(
  ({
    editMode,
    currUser,
    onSaveFunction,
    onCancelFunction,
    onEditFunction,
    setUserData,
    changeNewUserInfo,
    config,
    setCurrUser,
    deleteUserFunction,
    formValidationHelper,
    requiredFields,
    tabName,
    resetUserData,
    userId,
    groups,
  }) => {
    const [openedTabs, setOpenedTabs] = useState([UserRouteName.GENERAL]);

    useEffect(() => {
      if (
        tabName &&
        Object.values(UserRouteName).indexOf(tabName) >= 0 &&
        openedTabs.indexOf(tabName) < 0
      ) {
        setOpenedTabs([...openedTabs, tabName]);
      }
    }, [tabName]);

    const getComponent = (name: string) => {
      if (currUser.id === -1) {
        return <EmptyUserPlaceholder />;
      }
      switch (name) {
        case UserRouteName.GENERAL:
          return (
            <UsersGeneralContainer
              currUser={currUser}
              editMode={editMode}
              onEditFunction={onEditFunction}
              onCancelFunction={onCancelFunction}
              onSaveFunction={onSaveFunction}
              changeNewUserInfo={changeNewUserInfo}
              setUserData={setUserData}
              tabName={tabName}
              config={config}
              setCurrUser={setCurrUser}
              deleteUserFunction={deleteUserFunction}
              formValidationHelper={formValidationHelper}
              requiredFields={requiredFields}
              resetUserData={resetUserData}
              userId={userId}
              groups={groups}
            />
          );
        case UserRouteName.PERMISSIONS:
          return (
            <UserPermissionsContainer
              editMode={editMode}
              setUserData={setUserData}
              currentUser={currUser}
              tabName={tabName}
            />
          );
        case UserRouteName.GROUPS:
          return (
            <UsersGroupsContainer
              editMode={editMode}
              currUser={currUser}
              setUserData={setUserData}
              tabName={tabName}
            />
          );
        case UserRouteName.FI:
          return (
            <UserFIContainer
              editMode={editMode}
              setUserData={setUserData}
              tabName={tabName}
              currUser={currUser}
              userId={currUser?.id}
            />
          );
        case UserRouteName.MDT:
          return (
            <UserMDTContainer
              editMode={editMode}
              currData={currUser}
              tabName={tabName}
              setData={setUserData}
            />
          );
        case UserRouteName.RETURNS:
          return (
            <UserReturnsContainer
              setData={setUserData}
              currData={currUser}
              editMode={editMode}
              tabName={tabName}
            />
          );
        case UserRouteName.REPORTS:
          return (
            <UserReportsContainer
              editMode={editMode}
              currUser={currUser}
              setUserData={setUserData}
              tabName={tabName}
            />
          );
        case UserRouteName.VERSION:
          return (
            <UserVersionContainer
              editMode={editMode}
              currUser={currUser}
              setUserData={setUserData}
              tabName={tabName}
            />
          );
        case UserRouteName.ECM:
          return config.ecmEnable ? (
            <UsersEcmContainer
              setUserData={setUserData}
              currUser={currUser}
              editMode={editMode}
              tabName={tabName}
            />
          ) : null;
        case UserRouteName.MATRIX:
          return config.properties?.matrixMappingSource === "DATABASE" ? (
            <UserMatrixContainer
              setData={setUserData}
              currData={currUser}
              editMode={editMode}
              tabName={tabName}
            />
          ) : null;
        default:
          return <UserReturnsContainer editMode={editMode} />;
      }
    };

    return (
      <div
        style={{
          height: "100%",
        }}
      >
        {openedTabs.map((tabItem) => {
          return (
            <div
              style={{
                height: "100%",
              }}
              key={tabItem}
              role={"tabpanel"}
              hidden={tabItem !== tabName}
              id={`simple-tabpanel-${tabItem}`}
              aria-labelledby={`simple-tab-${tabItem}`}
              data-testid={`${tabItem}-tab`}
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
      prevProps.currUser === nextProps.currUser &&
      prevProps.editMode === nextProps.editMode &&
      prevProps.tabName === nextProps.tabName &&
      prevProps.groups === nextProps.groups
    );
  }
);

export default UsersTabPanel;
