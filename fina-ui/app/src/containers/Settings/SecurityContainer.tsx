import SecurityPage from "../../components/Settings/Security/SecurityPage";
import React from "react";
import { Property } from "../../types/settings.type";

interface SecurityContainerProps {
  data: Property[];
  onChangeSecurity?: (key: string, value: string) => void;
}

const SecurityContainer: React.FC<SecurityContainerProps> = ({
  data,
  onChangeSecurity,
}) => {
  return <SecurityPage data={data} onChangeSecurity={onChangeSecurity} />;
};

export default SecurityContainer;
