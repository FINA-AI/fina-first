import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import TreeGrid from "../../../common/TreeGrid/TreeGrid";
import { useTranslation } from "react-i18next";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { loadFileSpaces } from "../../../../api/services/fileRepositoryService";
import { connect } from "react-redux";
import {
  getDefaultDateFormat,
  getFormattedDateValue,
} from "../../../../util/appUtil";
import { styled } from "@mui/material/styles";
import { ReportSchedule } from "../../../../types/reportGeneration.type";
import { UserFile } from "../../../../types/userFileSpace.type";
import { TreeState } from "../../../../types/common.type";
import { Config } from "../../../../types/config.type";

interface ScheduleRepositoryFolderChooserProps {
  schedulesData: ReportSchedule;
  config: Config;
  setSchedulesData: (data: ReportSchedule) => void;
  size?: string;
  treeState: TreeState;
  setTreeState: (state: TreeState) => void;
}

const StyledRoot = styled(Box, {
  shouldForwardProp: (prop: string) => !prop.startsWith("_"),
})<{ _size: string; _width?: number }>(({ theme, _size, _width }) => ({
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
  "& .MuiInputBase-root": {
    width: _width ? `${_width}px` : "100%",
    height: _size === "default" ? "36px" : "32px",
  },
  "& .MuiInputLabel-root": {
    top: `${_size === "default" ? "2px" : "4px"} !important`,
    "&[data-shrink='false']": {
      top: `${_size === "default" ? "-5px" : "-7px"} !important`,
    },
  },
  "& .MuiSvgIcon-root": {
    ...(theme as any).smallIcon,
    color: "#98A7BC",
    padding: "1px 4px",
  },
  "& .MuiOutlinedInput-input": {
    padding: "10px 0 10px 14px!important",
  },
  "& .MuiOutlinedInput-root": {
    height: _size === "small" ? "32px" : "36px",
    "& .MuiSelect-select": {
      display: "flex",
      alignItems: "center",

      fontWeight: 500,
      lineHeight: "16px",
      fontSize: _size === "default" ? "12px" : "11px",
      textTransform: "capitalize",
      color: "#596D89",
    },
  },
}));

const PaperProps = (theme: any) => ({
  width: "inherit",
  boxSizing: "border-box",
  borderRight: `4px solid ${theme.palette.paperBackground}`,
  borderLeft: `4px solid ${theme.palette.paperBackground}`,
  overflow: "hidden",
});

const StyledChipBox = styled(Box)(({ theme }: { theme: any }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#3c4d68" : "#FFF",
  color: theme.palette.textColor,
  padding: "2px 4px",
  border: theme.palette.borderColor,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginRight: 2,
}));

const StyledListText = styled("span")(({ theme }) => ({
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "20px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  lineBreak: "anywhere",
  textOverflow: "ellipsis",
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#2C3644",
}));

const StyledFiledListItem = styled(Box)({
  cursor: "pointer",
  display: "flex",
  "& .MuiSvgIcon-root": {
    color: "#98A7BC",
    width: "20px",
    height: "20px",
    marginRight: "8px",
  },
});

const StyledFolderListItem = styled(StyledFiledListItem)({});

const ScheduleRepositoryFolderChooser: React.FC<
  ScheduleRepositoryFolderChooserProps
> = ({
  treeState,
  setTreeState,
  schedulesData,
  setSchedulesData,
  config,
  size = "default",
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  const [selectedRows, setSelectedRows] = useState<UserFile[]>([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (schedulesData.isChecked && data.length === 0) {
      loadRepositoryFiles(0, "root");
    }
  }, [schedulesData.isChecked]);

  useEffect(() => {
    setSchedulesData({ ...schedulesData, repositoryFolder: selectedRows });
  }, [selectedRows]);

  const renderFile = (row: UserFile) => {
    return (
      <StyledFiledListItem>
        <StickyNote2Icon style={{ color: "#2962FF", marginRight: "16px" }} />
        <StyledListText>{row.name}</StyledListText>
      </StyledFiledListItem>
    );
  };

  const renderFolder = (row: UserFile) => {
    return (
      <StyledFolderListItem>
        <FolderOpenIcon style={{ color: "#FF8D00", marginRight: "16px" }} />
        <StyledListText>{row.name}</StyledListText>
      </StyledFolderListItem>
    );
  };

  const loadRepositoryFiles = (start: number, nodeId: string) => {
    loadFileSpaces(start, 25, nodeId)
      .then((resp) => {
        const response = resp.data;
        setData(
          response.list.map((item: UserFile) => ({
            ...item,
            descriptions: item.descriptions.find(
              (desc) => desc.lc === config.language
            )?.dc,
            parentId: nodeId === "root" ? 0 : item.parentId,
          }))
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getChildren = async (nodeId: string) => {
    let result;
    await loadFileSpaces(0, 25, nodeId).then((resp) => {
      result = resp.data.list;
    });

    return result;
  };

  const fetchFunction = async (
    parentId: number,
    data: UserFile,
    row: UserFile
  ) => {
    if (!row) {
      return data;
    } else {
      let childrenData = await getChildren(row.id);
      return childrenData;
    }
  };

  const [columns] = useState([
    {
      title: t("name"),
      dataIndex: "descriptions",
      renderer: (value: string, row: UserFile) => {
        return row.file ? renderFile(row) : renderFolder(row);
      },
    },

    {
      title: t("creationDate"),
      dataIndex: "lastModified",
      renderer: (value: number) => {
        return (
          <span>{getFormattedDateValue(value, getDefaultDateFormat())}</span>
        );
      },
    },
  ]);

  const rowSelectHandler = (row: UserFile, rows: UserFile[]) => {
    setSelectedRows(rows);
  };

  return (
    <>
      <StyledRoot _size={size}>
        <FormControl variant={"outlined"} disabled={!schedulesData.isChecked}>
          <InputLabel>{t("repositoryFolder")}</InputLabel>
          <Select
            value={
              schedulesData.repositoryFolder &&
              schedulesData.repositoryFolder.length > 0
                ? "folders"
                : ""
            }
            onChange={() => {}}
            label={t("repositoryFolder")}
            multiple={false}
            data-testid={"repositoryFolder-select"}
            MenuProps={{
              PaperProps: {
                sx: (theme) => PaperProps(theme),
              },
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "left",
              },
            }}
          >
            <MenuItem style={{ display: "none" }} value={"folders"}>
              {schedulesData.repositoryFolder?.map((item) => {
                return (
                  <>
                    <StyledChipBox>{item.name}</StyledChipBox>
                  </>
                );
              })}
            </MenuItem>
            <Box key={"la"}>
              <Box width={"100%"} height={"300px"} marginTop={"5px"}>
                <TreeGrid
                  treeState={treeState}
                  setTreeState={setTreeState}
                  fetchFunction={fetchFunction}
                  data={data}
                  columns={columns}
                  idName={"id"}
                  parentIdName={"parentId"}
                  rootId={0}
                  loading={loading}
                  selectedElements={selectedRows}
                  hideCheckBox={true}
                  size={"small"}
                  hideActionBtn={true}
                  rowSelectHandler={rowSelectHandler}
                />
              </Box>
            </Box>
          </Select>
        </FormControl>
      </StyledRoot>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  config: state.get("config").config,
});

export default connect(mapStateToProps)(ScheduleRepositoryFolderChooser);
