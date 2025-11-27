import { Backdrop, Box, CircularProgress, Paper } from "@mui/material";
import Grid from "@mui/material/Grid";
import TabNavigation from "../../common/Navigation/TabNavigation";
import { UserRouteName } from "./Common/UserRoutes";
import UserManagerBreadcrumb from "../UserManagerBreadcrumb";
import UserManagerMiniInfo from "../UserMangerGenerelInfo/UserManagerMiniInfo";
import UsersTabPanel from "./UsersTabPanel";
import React, { useState } from "react";
import RelationsModal from "./RelationsModal";
import { styled } from "@mui/system";
import VirtualizedUsersGroupsContainer from "../../../containers/UserManager/VirtualizedUsersGroupsContainer";
import {
  NewUserInfo,
  UserAndGroup,
  UserType,
  UserTypeWithUIProps,
} from "../../../types/user.type";
import { Config } from "../../../types/config.type";
import { Group } from "../../../types/group.type";

const StyledPaper = styled(Paper)(({ theme }: any) => ({
  borderRadius: theme.rounded.smallRadius,
  width: "100%",
  height: "100%",
  boxShadow: "none",
}));

const StyledGridContainer = styled(Grid)(({ theme }: any) => ({
  marginTop: 0,
  paddingTop: 0,
  position: "relative",
  overflow: "hidden",
  borderRadius: theme.rounded.smallRadius,
}));

const StyledGridItem = styled(Grid)(() => ({
  paddingTop: 0,
  height: "100%",
}));

interface UsersItemPageProps {
  editMode: boolean;
  onCancelFunction: VoidFunction;
  onEditFunction: (editMode: boolean) => void;
  currUser: Partial<UserTypeWithUIProps>;
  setCurrUser: React.Dispatch<
    React.SetStateAction<Partial<UserTypeWithUIProps> | null>
  >;
  activeTabName?: string;
  onTabClickFunction: (route: string) => void;
  newUserInfo: NewUserInfo;
  loading: boolean;
  config: Config;
  usersData: UserType[];
  usersGroupsData: UserAndGroup[];
  setUsersGroupsData: (data: UserAndGroup[]) => void;
  openRestoreModal: boolean;
  setOpenRestoreModal: React.Dispatch<React.SetStateAction<boolean>>;
  restoreUserFunction: VoidFunction;
  formValidationHelper: any;
  requiredFields: string[];
  userId: string;
  usersGroupsDataRef: React.MutableRefObject<UserAndGroup[]>;
  groups: Group[];
  resetUserData(object: Partial<UserType>): void;
  onSaveFunction(formValidationHelper: any): void;
  setUserData(object: Partial<UserType>): void;
  changeNewUserInfo(key: string, value: string): void;
  onUserSelectChange(item: UserType): void;
  deleteUserFunction(userId: number): Promise<void>;
}

const UsersItemPage: React.FC<UsersItemPageProps> = ({
  editMode,
  loading,
  currUser,
  setCurrUser,
  activeTabName,
  onTabClickFunction,
  onSaveFunction,
  onCancelFunction,
  onEditFunction,
  setUserData,
  newUserInfo,
  changeNewUserInfo,
  onUserSelectChange,
  config,
  deleteUserFunction,
  usersGroupsData,
  setUsersGroupsData,
  openRestoreModal,
  setOpenRestoreModal,
  restoreUserFunction,
  formValidationHelper,
  requiredFields,
  resetUserData,
  userId,
  usersGroupsDataRef,
  groups,
}) => {
  const getActiveTabs = () => {
    let allRoutesNames = Object.values(UserRouteName);

    if (!config.ecmEnable) {
      allRoutesNames = allRoutesNames.filter(
        (name) => name !== UserRouteName.ECM
      );
    }

    if (config?.properties?.matrixMappingSource !== "DATABASE") {
      allRoutesNames = allRoutesNames.filter(
        (name) => name !== UserRouteName.MATRIX
      );
    }

    return allRoutesNames;
  };
  const [tab, setTab] = useState(activeTabName);

  return (
    <Box
      overflow={"hidden"}
      height={"100%"}
      display={"flex"}
      flexDirection={"column"}
      data-testid={"users-item-page"}
    >
      <div>
        <UserManagerBreadcrumb
          name={currUser?.login}
          linkName={"users"}
          setEditMode={onEditFunction}
        />
      </div>
      <Box flex={1} display={"flex"} flexDirection={"column"}>
        <StyledPaper
          hidden={activeTabName === UserRouteName.GENERAL || currUser.id === -1}
        >
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <UserManagerMiniInfo
              editMode={editMode}
              onCancelFunction={onCancelFunction}
              onSaveFunction={onSaveFunction}
              onEditFunction={onEditFunction}
              currItem={currUser}
              disabledSaveBtn={loading}
              deleteUserFunction={deleteUserFunction}
              formValidationHelper={formValidationHelper}
            />
          </Box>
        </StyledPaper>
        <Box pt={"10px"} pb={"10px"}>
          <TabNavigation
            tabs={getActiveTabs()}
            activeTabName={activeTabName}
            onTabClickFunction={(route) => {
              setTab(route);
              onTabClickFunction(route);
            }}
            scrollButtonsShow={false}
          />
        </Box>
      </Box>
      <StyledGridContainer
        container
        spacing={1}
        height={"100%"}
        direction={"row"}
      >
        <StyledGridItem item xs={3}>
          <StyledPaper
            sx={{ display: "flex", flexDirection: "column" }}
            data-testid={"users-and-groups-list"}
          >
            <VirtualizedUsersGroupsContainer
              currUser={currUser}
              userLogin={newUserInfo.userLogin}
              userFullName={newUserInfo.userFullName}
              onUserSelectChange={onUserSelectChange}
              usersGroupsData={usersGroupsData}
              setUsersGroupsData={setUsersGroupsData}
              usersGroupsDataRef={usersGroupsDataRef}
              isNewUser={Number(userId) === 0}
            />
          </StyledPaper>
        </StyledGridItem>
        <StyledGridItem item xs={9}>
          <StyledPaper>
            <UsersTabPanel
              editMode={editMode}
              currUser={currUser}
              onEditFunction={onEditFunction}
              onCancelFunction={onCancelFunction}
              onSaveFunction={onSaveFunction}
              setUserData={setUserData}
              changeNewUserInfo={changeNewUserInfo}
              config={config}
              setCurrUser={setCurrUser}
              deleteUserFunction={deleteUserFunction}
              formValidationHelper={formValidationHelper}
              requiredFields={requiredFields}
              tabName={tab}
              resetUserData={resetUserData}
              userId={userId}
              groups={groups}
            />
          </StyledPaper>
        </StyledGridItem>
        <Backdrop
          sx={{
            marginLeft: 1,
            marginTop: 1,
            borderRadius: "8px",
            color: "#fff",
            position: "absolute",
            "&.MuiBackdrop-root": {
              backgroundColor: "rgb(128,128,128,0.3)",
            },
            zIndex: 2000,
          }}
          open={!!loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        {openRestoreModal && (
          <RelationsModal
            setOpenRelationWarningModal={setOpenRestoreModal}
            openRelationWarningModal={openRestoreModal}
            onSave={() => restoreUserFunction()}
            title={"entityprogramaticalldeleted"}
            saveOnClose={false}
          />
        )}
      </StyledGridContainer>
    </Box>
  );
};

export default React.memo(UsersItemPage);
