import ReturnToXMLPage from "../../../components/Tools/ReturnToXML/ReturnToXMLPage";
import { postReturnToXML } from "../../../api/services/toolsService";
import { useState } from "react";
import { ReturnToXMLData } from "../../../types/tools.type";

const ReturnToXMLContainer = () => {
  const [saving, setSaving] = useState(false);
  const convertReturnToXML = (data: ReturnToXMLData) => {
    setSaving(true);
    postReturnToXML(data).then(() => {
      setSaving(false);
    });
  };

  return (
    <ReturnToXMLPage convertReturnToXML={convertReturnToXML} loading={saving} />
  );
};

export default ReturnToXMLContainer;
