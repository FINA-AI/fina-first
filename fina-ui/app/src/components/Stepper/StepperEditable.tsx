import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "../common/Tooltip/Tooltip";
import SteppedEditableItem from "./StepperEditableItem";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";
import { StepItemType } from "../FI/Configuration/Branch/Create/FiConfigurationCreateBranchContainer";
import React from "react";

const MAX_ITEM_COUNT = 4;

interface SteppedEditableProps {
  setActiveStepIndex: (index: number) => void;
  stepItems: StepItemType[];
  setStepItems: (data: StepItemType[]) => void;
  isRemoveAllowed(stepIndex: number): boolean;
  onRemoveStep(stepIndex: number): void;
  onStepAdd(stepIndex: number): void;
}

const StyledAddIconWrapper = styled(Box)(() => ({
  height: 74,
  display: "inline-flex",
  alignItems: "center",
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  width: 10,
  height: 10,
  "&:hover": {
    background: theme.palette.primary.light,
  },
}));

const SteppedEditable: React.FC<SteppedEditableProps> = ({
  setActiveStepIndex,
  onStepAdd,
  onRemoveStep,
  stepItems,
  setStepItems,
  isRemoveAllowed,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const setLabel = (index: number, value: string) => {
    const tmpStepItems = [...stepItems];
    const stepItemIndex = tmpStepItems.findIndex(
      (tmpItem) => tmpItem.index === index
    );
    tmpStepItems[stepItemIndex].label = value;
    setStepItems(tmpStepItems);
  };

  const onStepClick = (index: number) => {
    const tmpStepItems = [...stepItems];

    const init = (stepItem: StepItemType) => {
      stepItem.isSelected = stepItem.index === index;
      if (stepItem.isSelected) {
        setActiveStepIndex(stepItem.index);
      }
    };

    tmpStepItems.forEach((stepItem) => init(stepItem));
    setStepItems(tmpStepItems);
  };

  const onAddNewStep = () => {
    if (stepItems.length < MAX_ITEM_COUNT) {
      const maxIndex = Math.max.apply(
        Math,
        stepItems.map(function (stepItem) {
          return stepItem.index;
        })
      );

      const stepItem = {
        index: maxIndex + 1,
        isSelected: true,
        label: `New Step (${stepItems.length + 1})`,
        stepIndexLabel: stepItems.length + 1,
      };
      onStepAdd(stepItem.index);

      let tmpStepItems = [...stepItems];
      tmpStepItems.forEach((tmpStepItem) => (tmpStepItem.isSelected = false));
      tmpStepItems.push(stepItem);
      setStepItems(tmpStepItems);
      setActiveStepIndex(stepItem.index);
    }
  };

  const onRemoveExistingStep = (index: number) => {
    if (stepItems.length > 1 && isRemoveAllowed(index)) {
      let tmpStepItems = [...stepItems];
      const toRemove = tmpStepItems.find(
        (stepItem) => stepItem.index === index
      );

      if (toRemove) onRemoveStep(toRemove.index);

      const selectNew = toRemove?.isSelected;

      tmpStepItems = tmpStepItems.filter(
        (stepItem) => stepItem.index !== index
      );
      if (selectNew) {
        tmpStepItems[tmpStepItems.length - 1].isSelected = true;
        setActiveStepIndex(tmpStepItems[tmpStepItems.length - 1].index);
      }

      tmpStepItems.forEach(
        (tmpStepItem, i) => (tmpStepItem["stepIndexLabel"] = i + 1)
      );

      setStepItems(tmpStepItems);
    } else {
      enqueueSnackbar(t("fiConfigurationStepRemoveWarning"), {
        variant: "warning",
      });
    }
  };

  return (
    <Grid container direction={"row"} width={"100%"}>
      <Grid item xs={11}>
        <Grid container justifyContent="center" spacing={7}>
          {stepItems.map((step) => {
            return (
              <Grid item key={step.index + "stepItemWrapper"}>
                <SteppedEditableItem
                  key={step.index}
                  label={step.label}
                  setLabel={setLabel}
                  index={step.index}
                  circleLabel={step.stepIndexLabel}
                  isSelected={step.isSelected}
                  onSelect={onStepClick}
                  onRemove={onRemoveExistingStep}
                  isRemovable={stepItems.length > 1}
                />
              </Grid>
            );
          })}
        </Grid>
      </Grid>
      {stepItems.length < MAX_ITEM_COUNT && (
        <Grid item>
          <StyledAddIconWrapper>
            <Tooltip title={t("addNew")}>
              <StyledIconButton onClick={onAddNewStep} size="large">
                <AddIcon sx={{ fontSize: 18 }} color={"primary"} />
              </StyledIconButton>
            </Tooltip>
          </StyledAddIconWrapper>
        </Grid>
      )}
    </Grid>
  );
};

export default SteppedEditable;
