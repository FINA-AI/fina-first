import ReportGenerationGroupPage from "../../../components/ReportManager/Generate/ReportGenerationGroup/ReportGenerationGroupPage";
import React, { useEffect, useState } from "react";
import {
  load,
  loadAll,
  loadChildren,
} from "../../../api/services/fi/fiStructureService";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import { useTranslation } from "react-i18next";
import { FiGroupModel } from "../../../types/fi.type";

interface ReportGenerationGroupContainerProps {
  onCheckFunc: (data: any) => void;
  rows?: any;
  isDestination: boolean;
  reportGenerationTypesData?: any;
}

const ReportGenerationGroupContainer: React.FC<
  ReportGenerationGroupContainerProps
> = ({ onCheckFunc, rows, isDestination, reportGenerationTypesData }) => {
  const [data, setData] = useState<FiGroupModel[]>([]);
  const [root, setRoot] = useState<FiGroupModel[]>([]);
  const [loading, setLoading] = useState(true);
  const { openErrorWindow } = useErrorWindow();
  const [checkedRows, setCheckedRows] = useState<any>([]);
  const { t } = useTranslation();

  const [columns] = useState([
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
  ]);

  useEffect(() => {
    if (!isDestination) {
      init();
    }
  }, []);

  useEffect(() => {
    if (isDestination) {
      let r = rows.filter((item: any) =>
        item.parentId === 0 ? item.children.length > 0 : true
      );

      let checkedRowsArr = [];
      for (let item of r) {
        if (item.parentId === 0) {
          item.children = r.filter((child: any) => child.parentId === item.id);
        }

        if (checkedRows.find((i: any) => i === item.id)) {
          checkedRowsArr.push(item);
        }
      }
      setCheckedRows(checkedRowsArr.map((item) => item.id));
      setData(r);
    }
  }, [rows]);

  const init = () => {
    if (reportGenerationTypesData && reportGenerationTypesData["Peer"]) {
      let parent = reportGenerationTypesData["Peer"].parent;
      let children: FiGroupModel[] = reportGenerationTypesData["Peer"].children;

      let result: FiGroupModel[] = [];
      let root = parent.map((item: any) => {
        return { ...item, level: 0, leaf: false, expanded: true };
      });
      setRoot([...root]);

      let childrenArray = children.map((item) => {
        return { ...item, level: 1, leaf: true, id: item.id + "_child" };
      });

      for (let row of root) {
        let children: FiGroupModel[] = childrenArray.filter(
          (item) => item.parentId === row.id
        );
        let item = { ...row, children: children };
        result.push(item);
        result = result.concat(children);
      }
      setData(result);
    } else {
      load()
        .then((response) => {
          let result: FiGroupModel[] = [];
          let root: FiGroupModel[] = response.data.map((item: FiGroupModel) => {
            return { ...item, level: 0, leaf: false, expanded: true };
          });
          setRoot([...root]);
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
                result.push(item);
                result = result.concat(children);
              }

              setData([...result]);
            })
            .catch((err) => {
              openErrorWindow(err, t("Warning"), true, "warning");
            })
            .finally(() => setLoading(false));
        })
        .catch((err) => {
          openErrorWindow(err, t("Warning"), true, "warning");
        });
    }
  };

  const fetchFunction = async (row: FiGroupModel) => {
    let parentId = row.id;
    if (isDestination) {
      return data;
    }

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

  const onChange = (checkedRows: FiGroupModel[]) => {
    setCheckedRows(checkedRows);
    if (checkedRows.length === 0) return onCheckFunc([]);

    let arr = checkedRows.map((item: any) => {
      let obj = String(item).includes("child")
        ? { ...data.find((child) => child.id === item) }
        : { ...data.find((parent) => parent.id === item) };
      return { ...obj };
    });

    if (!isDestination) {
      let result: FiGroupModel[] = [];
      for (let row of root) {
        let children: any[] = arr.filter((item) => item.parentId === row.id);
        let item = {
          ...row,
          children: children,
          export: true,
          leaf: false,
        };
        result.push(item);
        result = result.concat(children);
      }
      onCheckFunc(result);
    } else {
      onCheckFunc([...arr.filter((item) => item.parentId !== 0)]);
    }
  };

  return (
    <ReportGenerationGroupPage
      data={data}
      loading={loading}
      fetchFunction={fetchFunction}
      columns={columns}
      onChange={onChange}
      defaultCheckedRows={checkedRows}
    />
  );
};

export default ReportGenerationGroupContainer;
