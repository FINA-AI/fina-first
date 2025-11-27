import Main from "../../components/Tools/Main";
import { memo, useState } from "react";

const ToolsContainer = () => {
  const [activeTab, setActiveTab] = useState<string>("");
  return <Main activeTab={activeTab} setActiveTab={setActiveTab} />;
};

export default memo(ToolsContainer);
