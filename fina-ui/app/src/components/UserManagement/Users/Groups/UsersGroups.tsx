import { Box, Grid } from "@mui/material";
import React from "react";
import UsersGroupCards from "../Common/UsersGroupCards";
import CardGridSkeleton from "../../../FI/Skeleton/Configuration/CardGridSkeleton";
import { styled } from "@mui/system";
import { Group } from "../../../../types/group.type";

interface UsersGroupsProps {
  groups: Group[];
  editMode: boolean;
  loading: boolean;

  onSingleCheck(group: Group): void;

  selectAll(checked: boolean): void;

  isPermitted(group: Group): boolean;
}

const StyledContainer = styled(Grid)(() => ({
  boxSizing: "border-box",
  borderRadius: "8px",
  padding: "8px 12px",
}));

const UsersGroups: React.FC<UsersGroupsProps> = ({
  groups,
  editMode,
  isPermitted,
  onSingleCheck,
  loading,
}) => {
  return (
    <Box height={"100%"} overflow={"auto"}>
      <StyledContainer container item xs={12}>
        {loading ? (
          <CardGridSkeleton cardNumber={groups.length} />
        ) : (
          groups
            .sort((a, b) => {
              if (editMode) return 0;

              const permittedA = isPermitted(a);
              const permittedB = isPermitted(b);

              if (permittedA && !permittedB) return -1;
              if (!permittedA && permittedB) return 1;

              return a.code.localeCompare(b.code, undefined, {
                sensitivity: "base",
              });
            })
            .map((group, i) => (
              <UsersGroupCards
                key={"item" + i}
                permitted={isPermitted(group)}
                name={group.code}
                text={group.description}
                editMode={editMode}
                onCheck={() => {
                  onSingleCheck(group);
                }}
                index={i}
              />
            ))
        )}
      </StyledContainer>
    </Box>
  );
};

export default UsersGroups;
