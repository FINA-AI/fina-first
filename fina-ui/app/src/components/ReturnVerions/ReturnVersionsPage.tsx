import { Grid, Paper } from "@mui/material";
import React from "react";
import ReturnVersion from "./ReturnVersion";
import { styled } from "@mui/material/styles";
import { ReturnVersion as IReturnVersion } from "../../types/importManager.type";

interface ReturnVersionsPageProps {
  addNewReturnVersionsModal: boolean;
  setAddNewReturnVersionsModal: (value: boolean) => void;
  data?: IReturnVersion[];
  saveReturnVersions: (versions: IReturnVersion | null) => void;
  returnVersionsDeleteHandler(returnTypeId: number): void;
}

const StyledRoot = styled(Grid)({
  overflow: "hidden",
  height: "100%",
  display: "flex",
  flexDirection: "column",
});

const StyledPaper = styled(Paper)({
  width: "100%",
  height: "100%",
  boxShadow: "none",
  overflowY: "auto",
  padding: "8px 12px",
});

const StyledGridContainer = styled(Grid)({
  height: "100%",
  display: "flex",
});

const ReturnVersionsPage: React.FC<ReturnVersionsPageProps> = ({
  addNewReturnVersionsModal,
  setAddNewReturnVersionsModal,
  data,
  saveReturnVersions,
  returnVersionsDeleteHandler,
}) => {
  return (
    <StyledRoot>
      <StyledGridContainer>
        <StyledPaper>
          <ReturnVersion
            data={data}
            addNewModalOpen={addNewReturnVersionsModal}
            setAddNewModalOpen={setAddNewReturnVersionsModal}
            saveReturnVersions={saveReturnVersions}
            returnVersionsDeleteHandler={returnVersionsDeleteHandler}
          />
        </StyledPaper>
      </StyledGridContainer>
    </StyledRoot>
  );
};

export default ReturnVersionsPage;
