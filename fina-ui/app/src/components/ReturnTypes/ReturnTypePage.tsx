import { Grid, Paper } from "@mui/material";
import React from "react";
import ReturnTypeComponent from "./ReturnType";
import { styled } from "@mui/material/styles";
import { ReturnType } from "../../types/returnDefinition.type";

interface ReturnTypePageProps {
  addNewReturnTypeModal: boolean;
  setAddNewReturnTypeModal: (value: boolean) => void;
  data: ReturnType[];
  returnTypeDeleteHandler(returnTypeId: number): void;
  saveReturnTypes(data: ReturnType): void;
}

const StyledRoot = styled(Grid)({
  overflow: "hidden",
  height: "100%",
  display: "flex",
  flexDirection: "column",
});

const StyledGridContainer = styled(Grid)({
  height: "100%",
  display: "flex",
});

const StyledPaper = styled(Paper)({
  width: "100%",
  height: "100%",
  boxShadow: "none",
  overflowY: "auto",
  padding: "8px 12px",
});

const ReturnTypePage: React.FC<ReturnTypePageProps> = ({
  addNewReturnTypeModal,
  setAddNewReturnTypeModal,
  data,
  saveReturnTypes,
  returnTypeDeleteHandler,
}) => {
  return (
    <StyledRoot>
      <StyledGridContainer>
        <StyledPaper>
          <ReturnTypeComponent
            data={data}
            isAddNew={addNewReturnTypeModal}
            setIsAddNew={setAddNewReturnTypeModal}
            saveReturnTypes={saveReturnTypes}
            returnTypeDeleteHandler={returnTypeDeleteHandler}
          />
        </StyledPaper>
      </StyledGridContainer>
    </StyledRoot>
  );
};

export default ReturnTypePage;
