import FolderIcon from "@mui/icons-material/Folder";
import React from "react";
import TabUnselectedIcon from "@mui/icons-material/TabUnselected";
import TableViewIcon from "@mui/icons-material/TableView";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";
import NotListedLocationIcon from "@mui/icons-material/NotListedLocation";
import { MDTNodeType } from "../../../types/mdt.type";

interface MDTTreeNodeIconProps {
  nodeType?: string;
  propsStyle?: any;
}

const MDTTreeNodeIcon: React.FC<MDTTreeNodeIconProps> = ({
  nodeType,
  propsStyle,
}) => {
  const getColor = () => {
    switch (nodeType) {
      case MDTNodeType.NODE:
        return "#FFB703";
      case MDTNodeType.INPUT:
        return "#4361EE";
      case MDTNodeType.VARIABLE:
        return "#2A9D8F";
      case MDTNodeType.LIST:
        return "#0077B6";
      case MDTNodeType.DATA:
        return "#E07A5F";
      default:
        return "#FFB703";
    }
  };

  const style = {
    color: getColor(),
    width: "20px",
    height: "20px",
    ...propsStyle,
  };

  const NodeTypeIcon = () => {
    switch (nodeType) {
      case MDTNodeType.NODE:
        return <FolderIcon style={style} />;
      case MDTNodeType.INPUT:
        return <TabUnselectedIcon style={style} />;
      case MDTNodeType.VARIABLE:
        return <TableViewIcon style={style} />;
      case MDTNodeType.LIST:
        return <FormatListNumberedIcon style={style} />;
      case MDTNodeType.DATA:
        return <ViewWeekIcon style={style} />;
      default:
        return <NotListedLocationIcon style={style} />;
    }
  };

  return <NodeTypeIcon />;
};

export default MDTTreeNodeIcon;
