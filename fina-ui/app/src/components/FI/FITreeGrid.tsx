import React, { useCallback, useEffect, useState } from "react";
import { loadFiTree } from "../../api/services/fi/fiService";
import { useSnackbar } from "notistack";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import VirtualTreeGrid from "../common/TreeGrid/VirtualTreeGrid";
import FolderIcon from "@mui/icons-material/Folder";
import { Checkbox, Tooltip } from "@mui/material";
import MainGridSkeleton from "./Skeleton/GridSkeleton/MainGridSkeleton";
import SearchField from "../common/Field/SearchField";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { styled, useTheme } from "@mui/material/styles";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import uniqBy from "lodash/uniqBy";
import { FiType } from "../../types/fi.type";
import { FiTree } from "../../types/fiTree.type";

const commonIconStyles = (size: TreeSize) => ({
  width: size === "small" ? "16px" : "20px",
  height: size === "small" ? "16px" : "20px",
  "& .MuiSvgIcon-root": {
    width: size === "small" ? "16px" : "20px",
    height: size === "small" ? "16px" : "20px",
  },
});

const StyledRoot = styled(Box)({
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
});

const StyledDescription = styled(Box)({
  whiteSpace: "nowrap",
  overflow: "hidden",
  lineBreak: "anywhere",
  textOverflow: "ellipsis",
  width: "100%",
});

const StyledCode = styled(Box)({
  whiteSpace: "nowrap",
  overflow: "hidden",
  lineBreak: "anywhere",
  textOverflow: "ellipsis",
});

const StyledCheckbox = styled(Checkbox, {
  shouldForwardProp: (prop) => prop !== "treeSize",
})<{ treeSize: TreeSize }>(({ treeSize }) => ({
  ...commonIconStyles(treeSize),
}));

const StyledFolderIcon = styled(FolderIcon, {
  shouldForwardProp: (prop) => prop !== "size",
})<{ size: TreeSize }>(({ size }) => ({
  ...commonIconStyles(size),
}));

const StyledFolderOpenIcon = styled(FolderOpenIcon, {
  shouldForwardProp: (prop) => prop !== "size",
})<{ size: TreeSize }>(({ size }) => ({
  ...commonIconStyles(size),
}));

const StyledAssignmentIcon = styled(AssignmentIcon, {
  shouldForwardProp: (prop) => prop !== "size",
})<{ size: TreeSize }>(({ size }) => ({
  ...commonIconStyles(size),
}));

type TreeSize = "small" | "default";

interface FITreeGridProps {
  data?: FiType[] | FiTree[];
  checkedRows?: FiType[];
  onChange: (checked: FiType[] | null, all?: FiType[]) => void;
  singleSelect?: boolean;
  backgroundColor?: string;
  checkboxColor?: string;
  size?: TreeSize;
  defaultExpanded?: boolean;
  fiTypesOnly?: boolean;
}

interface NodeRow extends FiType {
  level?: number;
  leaf?: boolean;
  uniqueId: string;
  parentId?: number;
  expanded?: boolean;
}

interface FiDataItem {
  parent: NodeRow;
  fis: NodeRow[];
}

const FITreeGrid: React.FC<FITreeGridProps> = ({
  data,
  checkedRows = [],
  onChange,
  singleSelect = false,
  checkboxColor,
  size = "default",
  defaultExpanded,
  fiTypesOnly = false,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState<boolean>(true);
  const [fiData, setFiData] = useState<FiDataItem[]>([]);
  const [rootData, setRootData] = useState<NodeRow[]>([]);
  const [originalFIData, setOriginalFIData] = useState<FiDataItem[]>([]);
  const [checkedFis, setCheckedFis] = useState<NodeRow[]>([]);
  const [checkedParentsUniqueIds] = useState<Set<string>>(new Set());

  useEffect(() => loadData(), [data]);

  //filter and return only FI objects not FI Types !!!
  const onChangeWrapper = (data: NodeRow[] | null) => {
    if (data) {
      onChange(
        data.filter((item) => item.level === 1),
        data
      );
    } else {
      onChange(data);
    }
  };

  const loadData = () => {
    if (data) {
      const modifiedData = generateDataUniqueIds(data);
      configFiData(modifiedData);
      setRootData([
        ...modifiedData.map((d) => ({ ...d.parent, expanded: false })),
      ]);

      let result: any[] = [];
      if (defaultExpanded) {
        modifiedData.forEach((fi) => {
          const collapsed =
            rootData.find((item) => item.id === fi.parent.id)?.expanded ===
            false;
          result.push({
            ...fi.parent,
            level: 0,
            expanded: !collapsed,
            children: fi.fis.map((item) => ({ ...item, leaf: true })),
            leaf: false,
          });
        });
      } else {
        result = [...modifiedData.map((d) => ({ ...d.parent }))];
      }
      setRootData(result);
      setLoading(false);
    } else {
      loadFiTypesFunction();
    }
  };

  const generateDataUniqueIds = (data: any): FiDataItem[] => {
    return data.map((fi: any) => ({
      parent: { ...fi.parent, uniqueId: fi.parent.code },
      fis: fi.fis.map((child: FiType) => ({
        ...child,
        uniqueId: `${fi.parent.code}-${child.code}-${child.id}`,
      })),
    }));
  };

  const loadFiTypesFunction = () => {
    loadFiTree()
      .then((res) => {
        setLoading(false);
        const modifiedData = generateDataUniqueIds(res.data);
        configFiData(modifiedData);
        setRootData([...modifiedData.map((fi) => fi.parent)]);
      })
      .catch((error) => enqueueSnackbar(error, { variant: "error" }));
  };

  const configFiData = (data: FiDataItem[]) => {
    let result = [
      ...data.map((fi) => {
        let fis = [
          ...fi.fis.map((child) => {
            return { ...child, parentId: fi.parent.id };
          }),
        ];
        let parent = { ...fi.parent, parentId: 0 };

        return { parent: parent, fis: fis };
      }),
    ];
    setFiData([...result]);
    setOriginalFIData([...result]);

    if (checkedRows?.length > 0) {
      let modifiedCheckedRows = addFullySelectedParents(result);
      setCheckedFis([...modifiedCheckedRows]);
    } else {
      setCheckedFis([]);
    }

    setLoading(false);
  };

  const addFullySelectedParents = (result: FiDataItem[]): any[] => {
    let updatedCheckedRows = [...checkedRows];
    const parentIds: any[] = Array.from(
      new Set(checkedRows.map((row: any) => row.parentId))
    );
    parentIds.forEach((id) => {
      const parentFI = result.find((item) => item.parent.id === id);
      if (!parentFI) return;
      const checkedFisAmount = checkedRows.filter(
        (fi: any) => fi.parentId === id
      ).length;
      if (parentFI.fis.length === checkedFisAmount) {
        updatedCheckedRows.push(parentFI.parent);
      }
    });
    return updatedCheckedRows;
  };

  const fetchDataTree = (node: NodeRow) => {
    const fiItem = fiData.find((fi) => fi.parent.id === node.id);
    return (
      fiItem?.fis.map((r: any) => {
        r.level = node.level ? node.level + 1 : 1;
        r.leaf = r.type !== 1;
        return r;
      }) || []
    );
  };

  const onCheckBoxClick = (
    event: React.ChangeEvent<HTMLInputElement>,
    row: NodeRow
  ) => {
    event.stopPropagation();
    const isChecked = event.target.checked;

    if (singleSelect) {
      setCheckedFis(isChecked ? [row] : []);
      onChangeWrapper(isChecked ? [row] : null);
      return;
    }

    if (isChecked) {
      if (row.level === 0) {
        const children = fiData.find((f) => f.parent.id === row.id)?.fis;
        const fis = children ? uniqBy([...checkedFis, ...children], "id") : [];
        const arr = [...fis, row];
        const result = [
          ...arr.filter((item, index) => arr.indexOf(item) === index),
        ];
        setCheckedFis(result);
        onChangeWrapper(result);
      } else {
        const result = [...checkedFis, row];
        setCheckedFis(result);
        onChangeWrapper(result);
        updateParentCheckedStatus(row, result);
      }
    } else {
      if (row.level === 0) {
        const result = checkedFis.filter(
          (f) => f.id !== row.id && f.parentId !== row.id
        );
        setCheckedFis(result);
        onChangeWrapper(result);
        checkedParentsUniqueIds.delete(row.uniqueId);
      } else {
        const result = checkedFis.filter(
          (f) => f.id !== row.id && f.id !== row.parentId
        );
        setCheckedFis(result);
        onChangeWrapper(result);
        updateParentCheckedStatus(row, result);
      }
    }
  };

  const updateParentCheckedStatus = useCallback(
    (row: NodeRow, result: NodeRow[]) => {
      const checkedChildrenSize = result.filter(
        (child) => child.parentId === row.parentId
      ).length;
      const fi = fiData.find((f) => f.parent.id === row.parentId);
      if (!fi) return;
      const childrenSize = fi.fis.length;
      if (checkedChildrenSize === childrenSize) {
        checkedParentsUniqueIds.add(fi.parent.uniqueId);
      } else {
        checkedParentsUniqueIds.delete(fi.parent.uniqueId);
      }
    },
    [fiData]
  );

  const onSearchValueChange = (searchText: string) => {
    if (!searchText) {
      loadData();
      return;
    }

    let filteredItems = [...originalFIData]
      .map((item) => ({
        ...item,
        fis: item.fis.filter(
          (fi) =>
            fi.name.toLowerCase().includes(searchText.toLowerCase()) ||
            fi.code.toLowerCase().includes(searchText.toLowerCase())
        ),
      }))
      .filter((item) => item.fis.length > 0);

    let newRootData: NodeRow[] = [];
    filteredItems.forEach((item) => {
      newRootData = [
        ...newRootData,
        { ...item.parent, expanded: true },
        ...item.fis.map((fi) => ({ ...fi, leaf: true, level: 1 })),
      ];
    });
    setRootData(newRootData);
    setFiData(filteredItems);
  };

  const fiCheckbox = useCallback(
    (row: NodeRow) => {
      const isChecked =
        checkedFis.some((fi) => fi.uniqueId === row.uniqueId) ||
        checkedParentsUniqueIds.has(row.uniqueId);

      return (
        <span>
          <StyledCheckbox
            data-testid={`tree-grid-row-checkbox-${row?.parentId}-${row?.id}`}
            treeSize={size}
            size={size === "small" ? "small" : "medium"}
            onClick={(event) => {
              event.stopPropagation();
              onCheckBoxClick(event as any, row);
            }}
            onDoubleClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
            }}
            checked={isChecked}
            indeterminate={
              !isChecked &&
              row.level === 0 &&
              !!checkedFis.find((fi) => fi.parentId === row.id)
            }
          />
        </span>
      );
    },
    [checkedFis, fiData]
  );

  const treeIcons = {
    expandedIcon: () => (
      <StyledFolderIcon
        style={{ color: theme.palette.primary.main }}
        size={size}
      />
    ),
    folder: () => (
      <StyledFolderOpenIcon
        style={{ color: theme.palette.secondary.light }}
        size={size}
      />
    ),
    leaf: () => (
      <StyledAssignmentIcon
        style={{ color: theme.palette.secondary.light }}
        size={size}
      />
    ),
  };

  const columnHeader = [
    {
      title: t("code"),
      dataIndex: "code",
      width: 200,
      sortable: true,
      renderer: (
        value: string,
        row: NodeRow,
        index: number,
        expanded?: boolean
      ) => (
        <Box width="100%" display="flex" alignItems="center">
          <Box display="flex" marginRight="10px">
            {row.leaf
              ? treeIcons.leaf()
              : expanded
              ? treeIcons.expandedIcon()
              : treeIcons.folder()}
          </Box>
          <Tooltip title={value} arrow>
            <StyledCode>{value}</StyledCode>
          </Tooltip>
        </Box>
      ),
    },
    {
      title: t("description"),
      dataIndex: "name",
      width: 100,
      flex: 2,
      renderer: (
        value: string,
        row: NodeRow,
        index: number,
        expanded?: boolean
      ) => (
        <Box
          width="100%"
          alignItems="center"
          display="flex"
          color={expanded ? "#2962FF" : ""}
        >
          <Tooltip title={value} arrow>
            <StyledDescription>{value}</StyledDescription>
          </Tooltip>
        </Box>
      ),
    },
    {
      title: "",
      dataIndex: "permission",
      width: 40,
      renderer: (value: any, row: NodeRow) => {
        return (singleSelect && row.level === 0) ||
          (fiTypesOnly && row.level! > 0) ? null : (
          <Box display="flex" justifyContent="center" alignItems="center">
            {fiCheckbox(row)}
          </Box>
        );
      },
    },
  ];

  return (
    <StyledRoot>
      {loading ? (
        <MainGridSkeleton
          columns={columnHeader.slice(0, 2)}
          checkboxEnabled={true}
        />
      ) : (
        <>
          <Box
            sx={{
              paddingLeft: "20px",
              paddingRight: "20px",
              marginTop: "4px",
              marginBottom: "4px",
            }}
          >
            <SearchField
              withFilterButton={false}
              onFilterChange={onSearchValueChange}
              onClear={loadData}
            />
          </Box>
          <VirtualTreeGrid
            columns={columnHeader}
            data={rootData}
            loadChildrenFunction={fetchDataTree}
            checkboxColor={checkboxColor}
            size={size}
            treeIcons={treeIcons}
            withCheckbox={false}
            defaultCheckedRows={checkedFis}
            checkboxSelection={true}
            idProperty="uniqueId"
          />
        </>
      )}
    </StyledRoot>
  );
};

export default FITreeGrid;
