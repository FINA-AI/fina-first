import { Autocomplete, Popper, TextField } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import React, { useEffect, useRef, useState } from "react";
import {
  getDocuments,
  getFilteredCategories,
  getLegislativeCategories,
} from "../../../api/services/legislativeDocumentService";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import { useTranslation } from "react-i18next";
import { TreeItem, TreeView } from "@mui/x-tree-view";
import { styled } from "@mui/material/styles";
import { CategoryAttachmentType } from "../../../types/legislativeDocument.type";
import { CatalogCreateMeta } from "../../../types/catalog.type";

interface LegislativeDocChooserProps {
  metaInfo?: Partial<CatalogCreateMeta>;
  setValueFunction: any;
  size?: string;
  width?: string;
}

interface LegislativeCategory {
  documentCount: number;
  documents: any[];
  id: number;
  level: number;
  name: string;
  nameStrId: number;
  version: number;
  leaf: boolean;
  children: LegislativeCategory[];
}

type SelectedElementType = {
  id: any;
  fileName: string;
};

const commonIconStyles = {
  color: "#98A7BC",
  paddingLeft: "8px",
};

const StyledAutocomplete = styled(Autocomplete)<{
  _size?: string;
  width?: string;
}>(
  ({
    theme,
    _size,
    width,
  }: {
    theme: any;
    _size?: string;
    width?: string;
  }) => ({
    "& .MuiSvgIcon-root": {
      ...theme.smallIcon,
    },
    "& .MuiAutocomplete-option": {
      padding: "0px !important",
      backgroundColor: `${theme.palette.paperBackground} !important`,
    },
    "& .MuiAutocomplete-listbox": {
      padding: "0px !important",
      backgroundColor: `${theme.palette.paperBackground} !important`,
    },
    "& .MuiInputBase-root": {
      width: width ? `${width}px` : "100%",
      height: _size === "default" ? "36px" : "32px",
    },
    "& .MuiInputLabel-root": {
      top: `${_size === "default" ? "2px" : "4px"} !important`,
      "&[data-shrink='false']": {
        top: `${_size === "default" ? "-5px" : "-7px"} !important`,
      },
    },
  })
);

const StyledTreeView = styled(TreeView)(({ theme }: any) => ({
  "& .MuiTreeItem-content": {
    padding: "0px !important",
    borderBottom: theme.palette.borderColor,
    minHeight: 32,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    "&:hover": {
      backgroundColor: `${
        theme.palette.mode === "dark" ? "#3C4D68" : "#EAEBF0"
      } !important`,
    },
  },
  "& .MuiTreeItem-label": {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    lineHeight: "16px",
    fontSize: 11,
  },
  "& .MuiCollapse-root": {
    marginLeft: 0,
  },
  "& .Mui-expanded": {
    color: `${theme.palette.primary.main} !important`,
    backgroundColor: theme.palette.paperBackground,
  },
  "& .Mui-focused": {
    backgroundColor: `${theme.palette.paperBackground} !important`,
  },
  "& .Mui-selected": {
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? theme.palette.buttons.secondary.hover
          : "rgba(80,80,80, 0.05)",
    },
  },
  "& .MuiTreeItem-iconContainer": {
    display: "flex !important",
  },
  "& .MuiTreeView-root": {
    width: "100%",
  },
  width: "100%",
}));

const StyledTreeItem = styled(TreeItem)<{ isRowSelected: boolean }>(
  ({ theme, isRowSelected }: { theme: any; isRowSelected: boolean }) => ({
    background: isRowSelected
      ? theme.palette.action.select
      : theme.palette.paperBackground,
    color: theme.palette.textColor,
    lineHeight: "16px",
    fontSize: 11,
    margin: "0 4px",
    width: "100%",
    borderRadius: isRowSelected ? "4px" : "",
  })
);

const StyledPopper = styled(Popper)(({ theme }: any) => ({
  position: "fixed",
  boxShadow: theme.palette.paperBoxShadow,
  borderRadius: "4px",
  "& .MuiAutocomplete-listbox": {
    maxHeight: "100%",
    padding: "0px ",
    "& :hover": {
      borderRadius: "4px",
    },

    "& .MuiAutocomplete-option": {
      fontWeight: 400,
      fontSize: "11px",
      lineHeight: "16px",
      color: "#2C3644",
      padding: 0,
      backgroundColor: `${theme.palette.paperBackground} !important`,
    },
    backgroundColor: `${theme.palette.paperBackground} !important`,

    height: 300,
  },
}));

const LegislativeDocChooser: React.FC<LegislativeDocChooserProps> = ({
  setValueFunction,
  size = "default",
  width = "100%",
  metaInfo,
}) => {
  const { openErrorWindow } = useErrorWindow();
  const { t } = useTranslation();

  const ref = useRef();
  const [categories, setCategories] = useState<LegislativeCategory[]>([]);
  const [selectedElement, setSelectedElement] = useState<SelectedElementType>({
    fileName: "",
    id: -1,
  });
  const [error, setError] = useState(false);

  const [expanded, setExpanded] = useState<any[]>([]);

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (
      metaInfo?.legislativeDocument &&
      metaInfo?.legislativeDocument?.fileName
    ) {
      setSelectedElement({
        fileName: metaInfo?.legislativeDocument?.fileName,
        id: metaInfo?.legislativeDocument?.id + "_child",
      });
      setError(false);
    } else if (!selectedElement.fileName) {
      setError(false);
    }
  }, [metaInfo]);

  const getCategories = () => {
    getLegislativeCategories()
      .then((res) => {
        const arr = res.data.map((item: LegislativeCategory) => {
          return {
            ...item,
            level: 1,
          };
        });
        setCategories(arr);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const filterCategoryHandler = (filter: string) => {
    getFilteredCategories(filter)
      .then((res) => {
        let tmp: LegislativeCategory[] = res.data.map(
          (item: LegislativeCategory) => {
            return {
              ...item,
              level: 1,
              leaf: false,
              children: item.documents.map((item: CategoryAttachmentType) => {
                return {
                  ...item,
                  name: item.fileName,
                  leaf: true,
                  level: 2,
                  id: `${item.id}_child`,
                };
              }),
            };
          }
        );
        setExpanded(tmp.map((item: any) => item.id));
        setCategories(tmp);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const initDocuments = (row: any) => {
    if (!row.children) {
      getDocuments(row)
        .then((res) => {
          const newData = categories.map((item: LegislativeCategory) => {
            if (item.id == row) {
              return {
                ...item,
                children: [
                  ...res.data.map((item: any) => {
                    return {
                      ...item,
                      level: 2,
                      name: item.fileName,
                      leaf: true,
                      id: `${item.id}_child`,
                    };
                  }),
                ],
              };
            }
            return item;
          });
          setCategories([...newData]);
          setExpanded([...expanded, `${row}`]);
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
        });
    }
  };

  const onRowSelect = (row: any) => {
    if (row.fileName) {
      setSelectedElement({
        fileName: row.fileName,
        id: row.id,
      });
    }
    setValueFunction({ ...row, id: row.id.split("_")[0] });
  };

  const handleToggle = (event: any, nodeIds: string[]) => {
    const nodeId = nodeIds[0];
    let selectedRow = categories.find((node: any) => node.id == nodeId);
    if (selectedRow?.level === 1 || !nodeId) {
      event.stopPropagation();
      event.preventDefault();
    }

    if (selectedRow?.level === 1) {
      if (nodeId && !selectedRow.children) {
        initDocuments(nodeId);
      }
    }
    let isChild = nodeId?.split("_")[1];

    if (!isChild || isChild !== "child") {
      setExpanded(nodeIds);
    }
  };

  let optionIndex = 0;

  const drawTree = (children: LegislativeCategory[]) => {
    if (children) {
      return children.map((d) => (
        <StyledTreeItem
          key={`${d.id}_${d.name}`}
          nodeId={`${d.id}`}
          label={d.name}
          defaultChecked={true}
          isRowSelected={d.id === selectedElement.id}
          icon={d.leaf ? <div /> : ""}
          onClick={() => {
            d.level === 2 && onRowSelect(d);
          }}
          data-testid={"option-" + optionIndex++}
        >
          {d.children && d.children.length > 0 ? drawTree(d.children) : <div />}
        </StyledTreeItem>
      ));
    }
  };

  const onChange = (v: string) => {
    if (metaInfo?.fileName && metaInfo?.fileName !== v && !v) {
      setError(true);
    }
    setSelectedElement({
      fileName: v,
      id: -1,
    });
    if (!v) {
      getCategories();
      setExpanded([]);
    }
    if (v?.length >= 3) {
      filterCategoryHandler(v);
    }
  };

  const handleBlur = () => {
    if (
      selectedElement?.fileName &&
      selectedElement?.fileName !== metaInfo?.legislativeDocument?.fileName
    ) {
      setError(true);
      setValueFunction({ fileName: undefined });
    } else {
      setError(false);
      setValueFunction({});
    }
  };

  return (
    <>
      <StyledAutocomplete
        _size={size}
        width={width}
        ref={ref}
        inputValue={selectedElement.fileName}
        isOptionEqualToValue={() => true}
        options={categories}
        getOptionLabel={(option: any) => {
          return option.name;
        }}
        ListboxProps={{
          style: {},
        }}
        PopperComponent={(props) => <StyledPopper {...props} />}
        filterOptions={(options: any) =>
          options.filter((option: any) => option.level === 1)
        }
        data-testid={"legislative-doc-chooser"}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            error={error}
            label={t("legislativeDatabaseFile")}
            variant="outlined"
            InputProps={{
              ...params.InputProps,
            }}
            onChange={(e) => {
              onChange(e.target.value);
            }}
            onBlur={handleBlur}
          />
        )}
        onChange={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onInputChange={(event, value, reason) => {
          if (reason === "clear") {
            setSelectedElement({ fileName: "", id: -1 });
            setValueFunction({});
            setError(false);
          } else {
            return;
          }
        }}
        renderOption={(props, option: any) => (
          <div {...(props as any)}>
            <StyledTreeView
              defaultCollapseIcon={
                <ExpandMoreIcon sx={{ ...commonIconStyles }} />
              }
              defaultExpandIcon={
                <ChevronRightIcon sx={{ ...commonIconStyles }} />
              }
              expanded={expanded}
              onNodeToggle={handleToggle}
            >
              {drawTree([option])}
            </StyledTreeView>
          </div>
        )}
      />
    </>
  );
};

export default LegislativeDocChooser;
