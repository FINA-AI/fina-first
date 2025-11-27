import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { CustomStepIcon } from "../Generate/ReportGenerationWizard";
import { Parameter } from "../../../types/reportGeneration.type";
import React from "react";
import CloseBtn from "../../common/Button/CloseBtn";
import EditableLabel from "../../common/Label/EditableLabel";

const StyledRoot = styled(Box)({
  height: "100%",
  "& .MuiStepLabel-root": {
    cursor: "pointer !Important",
  },
});

const StyledStepContainer = styled(Box)({
  padding: "8px 16px",
  "& .MuiStepConnector-line": {
    display: "none",
  },
});

const StyledStepContentBox = styled(Box)({
  borderRadius: "4px",
  cursor: "pointer !important",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
  display: "flex",
  justifyContent: "center",
  maxWidth: "150px",
  "& :hover": {
    minWidth: "50px",
    borderRadius: "2px",
    "& .MuiStepLabel-iconContainer": {
      minWidth: "0px !important",
      "& div": {
        background: "inherit",
        minWidth: "0px",
        borderRadius: "25px",
      },
    },
  },
  "& .MuiStepLabel-iconContainer": {
    borderRadius: "25px",
    width: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& div": {
      display: "flex",
      "& :hover": {
        background: "inherit",
        minWidth: "0px",
        borderRadius: "25px",
      },
    },
  },
});

const StyledStepLabel = styled(StepLabel)({
  padding: "5px",
  "& .MuiStepLabel-label": {
    marginTop: "6px !important",
    maxWidth: "150px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontSize: "12px",
    lineHeight: "16px",
    fontWeight: "500",
    color: "#9AA7BE",
  },
  "& .MuiSvgIcon-root": {
    color: "#FFFFFF",
  },
});

const StyledStep = styled(Step)({
  padding: "0px 10px",
  minWidth: "150",
  maxWidth: "150px",
});

interface ReportEditModalToolbarProps {
  parameterData: Parameter;
  handleClose: () => void;
  onParamaterNameChange: (name: string) => void;
}

const ReportEditModalToolbar: React.FC<ReportEditModalToolbarProps> = ({
  parameterData,
  handleClose,
  onParamaterNameChange,
}) => {
  return (
    <StyledRoot display={"flex"} flex={1} flexDirection={"row"} height={"100%"}>
      <StyledStepContainer
        display={"flex"}
        flex={1}
        justifyContent={"center"}
        width={"100%"}
      >
        {
          <Box width={"100%"}>
            <Stepper
              activeStep={0}
              alternativeLabel
              sx={{ justifyContent: "center" }}
            >
              <StyledStep>
                <StyledStepContentBox
                  onClick={() => {
                    /*setActiveStep(index);*/
                  }}
                >
                  <StyledStepLabel
                    StepIconComponent={(props) => {
                      const newProps = {
                        ...props,
                        item: { type: parameterData?.type },
                      };
                      return <CustomStepIcon {...newProps} />;
                    }}
                  >
                    {parameterData && (
                      <EditableLabel
                        initialValue={parameterData.name}
                        save={(value) => {
                          onParamaterNameChange(value);
                        }}
                        inputName={"parameter-name"}
                      />
                    )}
                  </StyledStepLabel>
                </StyledStepContentBox>
              </StyledStep>
            </Stepper>
          </Box>
        }
      </StyledStepContainer>
      <Box display={"flex"} alignItems={"center"}>
        <CloseBtn
          onClick={() => {
            handleClose();
          }}
          size={"default"}
          style={{ color: "#9AA7BE" }}
        />
      </Box>
    </StyledRoot>
  );
};

export default ReportEditModalToolbar;
