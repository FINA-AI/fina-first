import { Backdrop, Box, CircularProgress, Paper } from "@mui/material";
import Grid from "@mui/material/Grid";
import TabNavigation from "../../common/Navigation/TabNavigation";
import { useHistory } from "react-router-dom";
import { GroupRouteName, groupsBaseRoute } from "./Common/GroupRoutes";
import UserManagerBreadcrumb from "../UserManagerBreadcrumb";
import React, { memo, useState } from "react";
import GroupsTabPanel from "./GroupsTabPanel";
import { useTranslation } from "react-i18next";
import UserManagerGroupsMiniInfo from "../UserMangerGenerelInfo/UserManagerGroupsMiniInfo";
import GroupsList from "./GroupsList";
import ConfirmModal from "../../common/Modal/ConfirmModal";
import { styled } from "@mui/system";
import { Group } from "../../../types/group.type";
import { CancelIcon } from "../../../api/ui/icons/CancelIcon";

interface GroupsItemPageProps {
  addGroup: () => void;
  currentGroup?: Partial<Group>;
  loading: boolean;
  updateGroupFunction: VoidFunction;
  currentGroupDataRef: React.MutableRefObject<Partial<Group> | undefined>;
  groupsData: Group[];
  setGroupsData: (data: Group[]) => void;
  deleteGroupHandler: () => void;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  editMode: boolean;
  groupId: string;
  tabName?: string;
  onChangeGroupData(object: Partial<Group>): void;
}

const StyledPaper = styled(Paper)(({ theme }: any) => ({
  borderRadius: theme.rounded.smallRadius,
  width: "100%",
  height: "100%",
  boxShadow: "none",
}));

const StyledGrid = styled(Grid)(({ theme }: any) => ({
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

const StyledBackdrop = styled(Backdrop)(({ theme }) => ({
  color: theme.palette.primary.main,
  position: "absolute",
  "&.MuiBackdrop-root": {
    backgroundColor: "rgb(128,128,128,0.3)",
  },
  zIndex: 2000,
  marginLeft: 1,
  marginTop: 1,
  borderRadius: "8px",
}));

const GroupsItemPage: React.FC<GroupsItemPageProps> = ({
  addGroup,
  currentGroup,
  loading,
  onChangeGroupData,
  updateGroupFunction,
  currentGroupDataRef,
  groupsData,
  setGroupsData,
  deleteGroupHandler,
  editMode,
  setEditMode,
  groupId,
  tabName,
}) => {
  const history = useHistory();
  const { t } = useTranslation();

  const [description, setDescription] = useState("");
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [nexGroupId, setNextGroupId] = useState<number>();

  const onGroupChange = (groupId?: number) => {
    let splitPath = history.location.pathname.split("/");
    let activeTabName = splitPath[splitPath.length - 1];
    history.push(`${groupsBaseRoute}/${groupId}/${activeTabName}`);
  };

  const onGroupSelectChange = (item: Group) => {
    setNextGroupId(item.id);
    setEditMode((prevState) => {
      if (prevState) {
        setIsCancelModalOpen(true);
        return prevState;
      }
      onGroupChange(item.id);
      return prevState;
    });
  };

  const onTabClickFunction = (route: string) => {
    history.push(`${groupsBaseRoute}/${groupId}/${route}`);
  };

  const onCancelFunction = () => {
    if (Number(groupId) === 0) {
      history.push(`${groupsBaseRoute}`);
      currentGroupDataRef.current = currentGroup;
    } else {
      currentGroupDataRef.current = currentGroup;
      setEditMode(false);
    }
  };

  return (
    <Box
      overflow={"hidden"}
      height={"100%"}
      display={"flex"}
      flexDirection={"column"}
    >
      <div>
        <UserManagerBreadcrumb
          name={currentGroup?.description}
          linkName={"groups"}
        />
      </div>
      {currentGroup && (
        <Box flex={1} display={"flex"} flexDirection={"column"}>
          <StyledPaper>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <UserManagerGroupsMiniInfo
                editMode={editMode}
                setEditMode={setEditMode}
                currItem={currentGroup}
                updateGroup={updateGroupFunction}
                onCancelFunction={onCancelFunction}
                onChangeGroupData={onChangeGroupData}
                addGroup={addGroup}
                setDescription={setDescription}
                setGroupsData={setGroupsData}
                groupsData={groupsData}
                deleteGroupHandler={deleteGroupHandler}
              />
            </Box>
          </StyledPaper>
          <Box pt={"10px"} pb={"10px"}>
            <TabNavigation
              tabs={Object.values(GroupRouteName)}
              activeTabName={tabName}
              onTabClickFunction={onTabClickFunction}
              scrollButtonsShow={false}
            />
          </Box>
        </Box>
      )}

      <StyledGrid container spacing={1} height={"100%"} direction={"row"}>
        <StyledGridItem item xs={3}>
          <StyledPaper>
            <GroupsList
              onGroupSelectChange={onGroupSelectChange}
              data={groupsData}
              group={currentGroup ? currentGroup : {}}
              groupName={description}
            />
          </StyledPaper>
        </StyledGridItem>
        <StyledGridItem item xs={9}>
          <StyledPaper>
            {currentGroup && (
              <GroupsTabPanel
                editMode={editMode}
                setGroupData={onChangeGroupData}
                groupData={currentGroup}
                tabName={tabName}
                groupId={groupId}
              />
            )}
          </StyledPaper>
        </StyledGridItem>
        <StyledBackdrop open={!!loading}>
          <CircularProgress color="inherit" />
        </StyledBackdrop>
      </StyledGrid>
      {isCancelModalOpen && (
        <ConfirmModal
          isOpen={isCancelModalOpen}
          setIsOpen={setIsCancelModalOpen}
          onConfirm={() => {
            onGroupChange(nexGroupId);
            setIsCancelModalOpen(false);
            setEditMode(false);
          }}
          confirmBtnTitle={t("confirm")}
          headerText={t("cancel")}
          additionalBodyText={t("changes")}
          bodyText={t("cancelBodyText")}
          icon={<CancelIcon />}
        />
      )}
    </Box>
  );
};

export default memo(GroupsItemPage);
