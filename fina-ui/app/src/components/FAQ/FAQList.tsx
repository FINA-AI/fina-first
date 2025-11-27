import { Box } from "@mui/system";
import TreeGrid from "../common/TreeGrid/TreeGrid";
import React, { FC, useState } from "react";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import Tooltip from "../common/Tooltip/Tooltip";
import { FaqListDataType } from "../../types/faq.type";
import { TreeGridStateType } from "../../types/common.type";
import { styled } from "@mui/material/styles";

interface FAQListProps {
  treeState: TreeGridStateType;
  setTreeState: React.Dispatch<React.SetStateAction<TreeGridStateType>>;
  data: FaqListDataType[];
  fetchListData: (
    rowId: number,
    data: FaqListDataType[],
    row: FaqListDataType
  ) => void;
  rowSelectHandler: (
    row: FaqListDataType,
    rows: FaqListDataType[],
    isKeyboardShortcutKeyClicked: boolean,
    deselect: boolean
  ) => void;
}

const StyledListText = styled("span")({
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "20px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  lineBreak: "anywhere",
  textOverflow: "ellipsis",
  maxWidth: 250,
});

const FAQList: FC<FAQListProps> = ({
  treeState,
  setTreeState,
  data,
  fetchListData,
  rowSelectHandler,
}) => {
  const [defaultExpandedRowsIds] = useState([-1]);

  const renderListName = (row: FaqListDataType) => {
    return (
      <Tooltip title={row.name}>
        <StyledListText>{row.name}</StyledListText>
      </Tooltip>
    );
  };

  const renderFile = (row: FaqListDataType) => {
    return (
      <Box
        sx={{
          cursor: "pointer",
          display: "flex",
          "& .MuiSvgIcon-root": {
            color: "#98A7BC",
            width: "20px",
            height: "20px",
            marginRight: "8px",
          },
        }}
      >
        <StickyNote2Icon />
        {renderListName(row)}
      </Box>
    );
  };

  const renderFolder = (row: FaqListDataType) => {
    return (
      <Box
        sx={{
          cursor: "pointer",
          display: "flex",
          "& .MuiSvgIcon-root": {
            color: "#98A7BC",
            width: "20px",
            height: "20px",
            marginRight: "8px",
          },
        }}
      >
        <FolderOpenIcon />
        {renderListName(row)}
      </Box>
    );
  };

  const [columns] = useState([
    {
      dataIndex: "name",
      renderer: (value: string, row: FaqListDataType) => {
        return row.leaf ? renderFile(row) : renderFolder(row);
      },
    },
  ]);

  return (
    <Box height={"100%"} overflow={"hidden"} data-testid={"faq-list-container"}>
      <TreeGrid
        treeState={treeState}
        setTreeState={setTreeState}
        fetchFunction={fetchListData}
        defaultExpandedRowsIds={defaultExpandedRowsIds}
        data={data}
        columns={columns}
        rowSelectHandler={rowSelectHandler}
        idName={"id"}
        parentIdName={"parentId"}
        rootId={0}
        rowDeleteFunction={() => {}}
        hideActionBtn={true}
        hideHeader={true}
        hideCheckBox={true}
        singleSelect={true}
        loading={false}
        emptyIcon={false}
      />
    </Box>
  );
};

export default FAQList;
