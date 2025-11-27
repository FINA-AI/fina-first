import React from "react";
import { Box, styled } from "@mui/system";
import { Grid } from "@mui/material";
import CardGridSkeleton from "../../../FI/Skeleton/Configuration/CardGridSkeleton";
import UserPermittedMatrixCard from "./UserPermittedMatrixCard";
import { MainMatrixDataType } from "../../../../types/matrix.type";

interface UserPermittedMatrixPageProps {
  editMode: boolean;
  data: MainMatrixDataType[];
  dataSortFunction: () => MainMatrixDataType[];
  loading: boolean;
  isPermitted: (fileGroupId?: number) => boolean;
  onSingleCheck: (fileGroupId?: number) => void;
}

const StyledBox = styled(Box)(() => ({
  height: "100%",
  boxSizing: "border-box",
}));

const UserPermittedMatrixPage: React.FC<UserPermittedMatrixPageProps> = ({
  editMode,
  data,
  dataSortFunction,
  loading,
  isPermitted,
  onSingleCheck,
}) => {
  return (
    <StyledBox display={"flex"} flexDirection={"column"}>
      <StyledBox>
        <Grid container item xs={12} height={"100%"} overflow={"auto"}>
          {loading ? (
            <CardGridSkeleton cardNumber={data.length} />
          ) : (
            dataSortFunction().map((file: MainMatrixDataType, i: number) => (
              <UserPermittedMatrixCard
                key={"item" + i}
                permitted={isPermitted(file.id)}
                editMode={editMode}
                data={file}
                onCheck={() => {
                  onSingleCheck(file.id);
                }}
              />
            ))
          )}
        </Grid>
      </StyledBox>
    </StyledBox>
  );
};

export default UserPermittedMatrixPage;
