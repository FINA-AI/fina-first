import { Box } from "@mui/system";
import VirtualTreeGrid from "../../../common/TreeGrid/VirtualTreeGrid";
import React, { useEffect, useState } from "react";
import { FiGroupModel } from "../../../../types/fi.type";
import { TreeGridColumnType } from "../../../../types/common.type";
import {
  load,
  loadAll,
  loadChildren,
} from "../../../../api/services/fi/fiStructureService";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import { useTranslation } from "react-i18next";

interface FiGroupTreeProps {
  initialData?: FiGroupModel[];
  onCheckboxClick: (rows: any[], objectRows: any[]) => void;
  checkedRows: any[];
  hideEmptyParents?: boolean;
}
const FiGroupTree: React.FC<FiGroupTreeProps> = ({
  initialData,
  onCheckboxClick,
  checkedRows,
  hideEmptyParents = true,
}) => {
  const columns: TreeGridColumnType[] = [
    {
      title: "Code",
      dataIndex: `code`,
      flex: 1,
    },
    {
      title: "Name",
      dataIndex: `name`,
      flex: 1,
    },
  ];

  const [data, setData] = useState<FiGroupModel[]>([]);

  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();

  useEffect(() => {
    if (initialData == null) {
      load()
        .then((response) => {
          let result: FiGroupModel[] = [];
          let root: FiGroupModel[] = response.data.map((item: FiGroupModel) => {
            return { ...item, level: 0, leaf: false };
          });

          loadAll()
            .then((children) => {
              let childrenArr = children.data.map((item: FiGroupModel) => {
                return {
                  ...item,
                  level: 1,
                  leaf: true,
                  id: item.id + "_child",
                };
              });

              for (let row of root) {
                let children = childrenArr.filter(
                  (item: FiGroupModel) => item.parentId === row.id
                );

                let item = { ...row, children: children };
                if (hideEmptyParents && children.length == 0) {
                  continue;
                } else {
                  result.push(item);
                }
                result = result.concat(children);
              }

              setData([...result]);
            })
            .catch((err) => {
              openErrorWindow(err, t("error"), true, "warning");
            });
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true, "warning");
        });
    } else {
      setData([...initialData]);
    }
  }, [initialData]);

  const fetchFunction = async (row: FiGroupModel) => {
    let parentId = row.id;

    if (parentId === 0) {
      return data;
    } else {
      let children: FiGroupModel[] = [];
      let res = await loadChildren(parentId);
      children = res.data.map((item: FiGroupModel) => {
        return { ...item, level: 1, leaf: true, id: item.id + "_child" };
      });

      data.map((item) => {
        return {
          ...item,
          children: item.id === parentId ? children : null,
        };
      });
      return children;
    }
  };

  return (
    <Box height={"100%"} width={"100%"} style={{ overflow: "hidden" }}>
      {data && (
        <VirtualTreeGrid
          withCheckbox={true}
          columns={columns}
          data={data}
          loadChildrenFunction={fetchFunction}
          checkboxOnChange={onCheckboxClick}
          size={"small"}
          checkboxIdProperty={"code"}
          defaultCheckedRows={checkedRows.map((r) => r.code)}
        />
      )}
    </Box>
  );
};

export default FiGroupTree;
