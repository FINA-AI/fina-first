import { Box, Grid } from "@mui/material";
import React from "react";
import GroupCards from "./GroupCards";
import UserManagerMainTabPanel from "../Users/UserManagerMainTabPanel";
import { useHistory } from "react-router-dom";
import withLoading from "../../../hoc/withLoading";
import { styled } from "@mui/system";
import { Group } from "../../../types/group.type";

interface GroupsPageProps {
  groups: Group[];
  loading: boolean;
}

const StyledRootBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  width: "100%",
  boxSizing: "border-box",
  borderRadius: "4px",
  backgroundColor: theme.palette.paperBackground,
}));

const StyledBodyBox = styled(Box)(() => ({
  height: "100%",
  overflow: "auto",
  borderBottomRightRadius: "4px",
  borderBottomLeftRadius: "4px",
  padding: "4px 8px",
}));

const GroupsPage: React.FC<GroupsPageProps> = ({ groups }) => {
  const history = useHistory();

  const addNewUser = () => {
    history.push(`/usermanager/groups/${0}/permissions`);
  };

  return (
    <StyledRootBox data-testid={"groups-page"}>
      <UserManagerMainTabPanel
        tabName={"groups"}
        onDeleteButtonClick={() => {}}
        addNewUser={addNewUser}
      />
      <StyledBodyBox>
        <Grid container>
          {groups.map((group, index) => (
            <GroupCards key={index} group={group} index={index} />
          ))}
        </Grid>
      </StyledBodyBox>
    </StyledRootBox>
  );
};

export default withLoading(GroupsPage);
