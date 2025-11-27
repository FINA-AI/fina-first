import React, { useEffect, useState } from "react";

import SteppedEditable from "../../../Stepper/StepperEditable";
import FiConfigurationFieldSelector from "./FiConfigurationFieldSelector";
import { Box } from "@mui/material";
import {
  ColumnType,
  StepItemType,
} from "../Branch/Create/FiConfigurationCreateBranchContainer";
import { BranchTypes } from "../../../../types/fi.type";

interface FiConfigurationStepCreatorProps {
  columns: ColumnType[];
  stepItems: StepItemType[];
  setStepItems: (data: StepItemType[]) => void;
  editBranchTypeItem?: BranchTypes | null;
  selectors: any;
  setSelectors: any;
  isEdit: boolean;
}

const FiConfigurationStepCreator: React.FC<FiConfigurationStepCreatorProps> = ({
  columns,
  stepItems,
  setStepItems,
  editBranchTypeItem,
  selectors,
  setSelectors,
  isEdit,
}) => {
  const getSelector = (stepIndex: number) => {
    return {
      stepIndex,
      selector: (
        <FiConfigurationFieldSelector
          key={stepIndex}
          columns={columns}
          stepIndex={stepIndex}
          isEdit={isEdit}
        />
      ),
    };
  };

  const [activeStepIndex, setActiveStepIndex] = useState(1);
  const [currentSelector, setCurrentSelector] = useState<any>();

  const onStepAdd = (stepIndex: number) => {
    const tmpSelectors = [...selectors];
    tmpSelectors.push(getSelector(stepIndex));
    setSelectors(tmpSelectors);
  };

  const onRemoveStep = (stepIndex: number) => {
    if (isRemoveAllowed(stepIndex)) {
      let tmpSelectors = [...selectors];
      tmpSelectors = tmpSelectors.filter(
        (selectorItem) => selectorItem.stepIndex !== stepIndex
      );
      setSelectors(tmpSelectors);
    }
  };

  const isRemoveAllowed = (stepIndex: number) => {
    const hasSelectedColumn = columns.find(
      (c) => c.stepperIndex === stepIndex && c.isSelected === true
    );
    return !hasSelectedColumn;
  };

  useEffect(() => {
    const initSelector = (index: number) => {
      let selector = selectors.find((s: any) => s.stepIndex === index);
      if (!selector && columns.length > 0) {
        selector = getSelector(index);
        const tmpSelectors = [...selectors];
        tmpSelectors.push(selector);
        setSelectors(tmpSelectors);
      }
      selectors.forEach((s: any) => (s.isSelected = s.stepIndex === index));
      stepItems.forEach((s) => (s.isSelected = s.index === index));
      setCurrentSelector(selector);
    };

    if (!editBranchTypeItem) {
      initSelector(activeStepIndex);
    } else {
      editBranchTypeItem.steps.forEach((element) => {
        initSelector(element.index);
      });
    }
  }, [activeStepIndex, editBranchTypeItem, columns]);

  return (
    <Box
      width={"100%"}
      display={"flex"}
      flexDirection={"column"}
      height={"100%"}
    >
      <SteppedEditable
        stepItems={stepItems}
        setStepItems={setStepItems}
        setActiveStepIndex={setActiveStepIndex}
        onStepAdd={onStepAdd}
        onRemoveStep={onRemoveStep}
        isRemoveAllowed={isRemoveAllowed}
      />
      {currentSelector && currentSelector.selector}
    </Box>
  );
};

export default FiConfigurationStepCreator;
