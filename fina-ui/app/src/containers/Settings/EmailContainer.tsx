import EmailPage from "../../components/Settings/Email/EmailPage";
import { Property } from "../../types/settings.type";
import React from "react";

interface EmailContainerProps {
  onChange: (key: string, value: string) => void;
  data: Property[];
}

const EmailContainer: React.FC<EmailContainerProps> = ({
  onChange,
  data,
}: any) => {
  return <EmailPage onChange={onChange} data={data} />;
};

export default EmailContainer;
