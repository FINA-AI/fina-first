import React from "react";
import FiConfigurationCreateBranchContainer from "./Branch/Create/FiConfigurationCreateBranchContainer";
import { FiConfigurationTabs } from "../fiTabs";
import FiConfigurationCreateManagementContainer from "./Management/Create/FiConfigurationCreateManagementContainer";
import { BranchTypes } from "../../../types/fi.type";

interface FiConfigurationCreateWizardProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  afterSubmitSuccess?: (data: any, type: "add" | "edit") => void;
  type: string;
  editItem?: BranchTypes | null;
}

const FiConfigurationCreateWizard: React.FC<
  FiConfigurationCreateWizardProps
> = ({ isOpen, setIsOpen, afterSubmitSuccess, type, editItem }) => {
  switch (type) {
    case FiConfigurationTabs.BRANCH:
      return (
        <FiConfigurationCreateBranchContainer
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          afterSubmitSuccess={afterSubmitSuccess}
          editBranchTypeItem={editItem as BranchTypes | undefined}
        />
      );
    case FiConfigurationTabs.MANAGEMENT:
      return (
        <FiConfigurationCreateManagementContainer
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          afterSubmitSuccess={afterSubmitSuccess}
          editManagementTypeItem={editItem}
        />
      );
    default:
      return null;
  }
};

export default FiConfigurationCreateWizard;
