import React, { FC, useState } from "react";
import { Box } from "@mui/material";
import TextField from "../../common/Field/TextField";
import Select from "../../common/Field/Select";
import DeleteIcon from "@mui/icons-material/Delete";
import { filterNodes } from "../../../api/services/MDTService";
import { MDTSearchField } from "../../MDT/Tree/MDTSearchField";
import { DefinitionTableDataType } from "../../../types/matrix.type";
import { MdtNode } from "../../../types/mdt.type";
import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";
import Tooltip from "../../common/Tooltip/Tooltip";

const StyledRoot = styled(Box)<{ isSelected: boolean }>(
  ({ theme, isSelected }: { theme: any; isSelected: boolean }) => ({
    position: "relative",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    border: theme.palette.borderColor,
    borderTop: "none",
    height: "30px",
    background: isSelected ? "#e1eaff" : "transparent",
    userSelect: isSelected ? "none" : "auto",
    "&:hover": {
      "& .deleteIcon": {
        display: "block",
      },
    },
  })
);
const StyledInnerBox = styled(Box)<{
  modified: boolean;
}>(({ modified }) => ({
  display: "flex",
  alignItems: "center",
  padding: "5px 10px",
  overflow: "hidden",
  height: "30px",
  color: modified ? "orange" : "",
  flex: 1,
}));

const StyledDeleteIcon = styled(DeleteIcon)({
  position: "absolute",
  color: "#FF4128",
  cursor: "pointer",
  right: "15px",
  display: "none",
});

const StyledModifiedSign = styled(Box)({
  width: "8px",
  height: "8px",
  background: "orange",
  visibility: "visible",
  borderRadius: "50%",
  marginLeft: "5px",
});

const StyledNotModifiedSign = styled(Box)({
  width: "8px",
  height: "8px",
  background: "orange",
  visibility: "hidden",
  borderRadius: "50%",
  marginLeft: "5px",
});

const StyledCheckBoxRoot = styled(Checkbox)({
  padding: "0",
  display: "block !important",
  color: "#C2CAD8",
  "& .MuiSvgIcon-root": {
    display: "block !important",
    width: "20px",
    height: "20px",
  },
  "& .MuiDivider-root": {
    display: "block !important",
  },
  width: "fit-content",
});

const StyledSpan = styled("span")({
  cursor: "default",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  overflow: "hidden",
});

interface SubMatrixReturnDetailsRowProps {
  row: DefinitionTableDataType;
  style: any;
  setDeleteModal: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      row: DefinitionTableDataType;
      index?: number;
      loading: boolean;
    }>
  >;
  updateRow: () => void;
  saveValidation: (row: DefinitionTableDataType) => void;
  dataTypeCell: { label: string; value: string }[];
  index: number;
  isChecked: boolean;
  isSelected: boolean;

  handleSingleCheckedRow(row: DefinitionTableDataType, value: boolean): void;

  onContextMenuHandler(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    row: DefinitionTableDataType
  ): void;
}

const SubMatrixDefinitionTableRow: FC<SubMatrixReturnDetailsRowProps> = ({
  row,
  style,
  setDeleteModal,
  updateRow,
  saveValidation,
  dataTypeCell,
  index,
  isChecked,
  handleSingleCheckedRow,
  onContextMenuHandler,
  isSelected,
}) => {
  const [isEditMode, setEditMode] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<MdtNode[]>([]);
  const [loadingNodes, setLoadingNodes] = useState(false);

  const onChangeValue = (
    key: string,
    value: string | { code: string; name: string; id: number }
  ) => {
    if (key === "mdtNode" && typeof value === "object") {
      const { code, name, id } = value;
      row["mdtNodeCode"] = code;
      row["mdtNodeDescription"] = name;
      row["mdtNodeId"] = id;
      row["node"] = {
        id,
        code,
        name,
      } as MdtNode;
      updateRow();
    } else {
      (row as DefinitionTableDataType)[key] = value;
    }
    row["isDirty"] = true;
    saveValidation(row);
  };

  return (
    <StyledRoot
      isSelected={isSelected}
      style={style}
      onClick={() => {
        setEditMode(true);
      }}
      onContextMenu={(event: any) => onContextMenuHandler(event, row)}
    >
      <Box sx={{ paddingLeft: "14px" }}>
        <StyledCheckBoxRoot
          checked={isChecked}
          onChange={(e: any) => {
            handleSingleCheckedRow(row, e.target.checked);
          }}
          onClick={(e: any) => e.stopPropagation()}
        />
      </Box>
      {!isEditMode && !row.isDirty ? (
        <>
          <StyledInnerBox modified={row.isDirty ?? false} style={{ flex: 2 }}>
            <Tooltip title={row.mdtNodeCode || ""} arrow>
              <StyledSpan>{row.mdtNodeCode}</StyledSpan>
            </Tooltip>
          </StyledInnerBox>
          <StyledInnerBox modified={row.isDirty ?? false} style={{ flex: 2 }}>
            <Tooltip title={row.mdtNodeDescription || ""} arrow>
              <StyledSpan>{row.mdtNodeDescription}</StyledSpan>
            </Tooltip>
          </StyledInnerBox>
          <StyledInnerBox modified={row.isDirty ?? false}>
            {row.cell}
          </StyledInnerBox>
          <StyledInnerBox modified={row.isDirty ?? false}>
            {row.dataType}
          </StyledInnerBox>
        </>
      ) : (
        <>
          <StyledInnerBox modified={row.isDirty ?? false} style={{ flex: 2 }}>
            <MDTSearchField
              loading={loadingNodes}
              data={filteredData}
              virtualized={true}
              selectedItem={row.mdtNodeCode || ""}
              onInputChange={(v) => {
                delete row.mdtNodeCode;
                if (v) {
                  setLoadingNodes(true);
                  filterNodes(v, false, ["INPUT", "LIST"]).then((resp) => {
                    setFilteredData(resp.data);
                    setLoadingNodes(false);
                  });
                }
              }}
              onChange={(v) => {
                onChangeValue("mdtNode", v);
              }}
              displayFieldFunction={(option: { code: string }) => {
                return `${option.code}`;
              }}
            />
            {row.isDirty ? <StyledModifiedSign /> : <StyledNotModifiedSign />}
          </StyledInnerBox>
          <StyledInnerBox modified={row.isDirty ?? false} style={{ flex: 2 }}>
            <StyledInnerBox modified={row.isDirty ?? false}>
              <Tooltip title={row.mdtNodeDescription || ""} arrow>
                <StyledSpan>{row.mdtNodeDescription}</StyledSpan>
              </Tooltip>
            </StyledInnerBox>
          </StyledInnerBox>
          <StyledInnerBox modified={row.isDirty ?? false}>
            <TextField
              size={"small"}
              value={row?.cell}
              onChange={(v: string) => onChangeValue("cell", v)}
              dirtable={true}
              isDirty={row.isDirty}
            />
          </StyledInnerBox>
          <StyledInnerBox
            modified={row.isDirty ?? false}
            style={{ paddingRight: "40px" }}
          >
            <Select
              data={dataTypeCell}
              value={row.dataType ?? ""}
              onChange={(v) => {
                onChangeValue("dataType", v);
              }}
              size={"small"}
            />
            <StyledModifiedSign />
          </StyledInnerBox>
        </>
      )}
      <StyledDeleteIcon
        className={"deleteIcon"}
        onClick={(e: any) => {
          e.stopPropagation();
          setDeleteModal((prevState) => ({
            ...prevState,
            open: true,
            row,
            index,
          }));
        }}
      />
    </StyledRoot>
  );
};

export default SubMatrixDefinitionTableRow;
