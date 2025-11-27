import { Box, styled } from "@mui/system";
import { Grid } from "@mui/material";
import UserVersionCard from "./UserVersionCard";
import CardGridSkeleton from "../../../FI/Skeleton/Configuration/CardGridSkeleton";
import React from "react";
import { GroupVersion } from "../../../../types/group.type";

interface UserVersionProps {
  versions: GroupVersion[];
  editMode: boolean;
  loading: boolean;
  checkBoxOnChange(
    type: string,
    checked: boolean,
    versionItem: GroupVersion
  ): void;
}

const StyledGridItem = styled(Grid)(() => ({
  width: "100%",
  height: "100%",
  display: "flex",
  overflow: "auto",
  flexWrap: "wrap",
  alignContent: "flex-start",
}));

const UserVersion: React.FC<UserVersionProps> = ({
  versions,
  checkBoxOnChange,
  editMode,
  loading,
}) => {
  return (
    <Box height={"100%"} display={"flex"} width={"100%"}>
      <Box
        height={"100%"}
        borderRadius={"2px"}
        width={"100%"}
        padding={"8px 12px"}
        display={"flex"}
        overflow={"scroll"}
      >
        <StyledGridItem container xs={12} item>
          {loading ? (
            <CardGridSkeleton cardNumber={versions.length} />
          ) : (
            versions.length !== 0 &&
            versions.map((versionItem, index) => {
              return (
                <UserVersionCard
                  key={index}
                  versionItem={versionItem}
                  checkBoxOnChange={checkBoxOnChange}
                  editMode={editMode}
                />
              );
            })
          )}
        </StyledGridItem>
      </Box>
    </Box>
  );
};

export default UserVersion;
