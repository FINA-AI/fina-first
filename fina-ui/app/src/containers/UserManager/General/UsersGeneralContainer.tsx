import UsersGeneral from "../../../components/UserManagement/Users/General/UsersGeneral";
import React, { memo } from "react";
import { UserRouteName } from "../../../components/UserManagement/Users/Common/UserRoutes";
import { UserType, UserTypeWithUIProps } from "../../../types/user.type";
import { Config } from "../../../types/config.type";
import { Group } from "../../../types/group.type";

interface UsersGeneralContainerProps {
  currUser: Partial<UserTypeWithUIProps>;
  editMode: boolean;
  onSaveFunction: (formValidationHelper: any) => void;
  onCancelFunction: VoidFunction;
  onEditFunction: (editMode: boolean) => void;
  config: Config;
  setCurrUser: React.Dispatch<
    React.SetStateAction<Partial<UserTypeWithUIProps> | null>
  >;
  formValidationHelper: any;
  requiredFields: string[];
  userId: string;
  groups: Group[];
  tabName?: string;
  resetUserData(object: Partial<UserType>): void;
  deleteUserFunction(userId: number): Promise<void>;
  setUserData(object: Partial<UserType>): void;
  changeNewUserInfo(key: string, value: string): void;
}

const UsersGeneralContainer: React.FC<UsersGeneralContainerProps> = ({
  currUser,
  editMode,
  onSaveFunction,
  onCancelFunction,
  onEditFunction,
  changeNewUserInfo,
  setUserData,
  config,
  setCurrUser,
  deleteUserFunction,
  formValidationHelper,
  requiredFields,
  resetUserData,
  userId,
  groups,
}) => {
  return (
    <UsersGeneral
      groups={groups}
      currUser={currUser}
      editMode={editMode}
      onEditFunction={onEditFunction}
      onCancelFunction={onCancelFunction}
      onSaveFunction={onSaveFunction}
      changeNewUserInfo={changeNewUserInfo}
      setUserData={setUserData}
      config={config}
      setCurrUser={setCurrUser}
      deleteUserFunction={deleteUserFunction}
      requiredFields={requiredFields}
      formValidationHelper={formValidationHelper}
      resetUserData={resetUserData}
      userId={userId}
    />
  );
};

export default memo(UsersGeneralContainer, (prevProps, nextProps) => {
  if (nextProps.tabName === UserRouteName.GENERAL) {
    return (
      prevProps.currUser.id === nextProps.currUser.id &&
      prevProps.editMode === nextProps.editMode &&
      prevProps.currUser?.login === nextProps.currUser?.login &&
      prevProps.groups === nextProps.groups
    );
  }
  return true;
});
