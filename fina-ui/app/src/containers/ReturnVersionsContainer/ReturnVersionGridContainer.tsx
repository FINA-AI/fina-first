import GridTable from "../../components/common/Grid/GridTable";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { getVersions } from "../../api/services/versionsService";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { ReturnVersion } from "../../types/importManager.type";

interface ReturnVersionGridContainerProps {
  onCheckFunc: (rows: ReturnVersion[]) => void;
  rowOnCLick: (
    row: ReturnVersion,
    checked: boolean,
    checkedRows: ReturnVersion[]
  ) => void;
  defaultData?: ReturnVersion[];
  checkedRows?: ReturnVersion[];
}

const ReturnVersionGridContainer: React.FC<ReturnVersionGridContainerProps> = ({
  onCheckFunc,
  defaultData,
  rowOnCLick,
  checkedRows = [],
}) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();

  const [data, setData] = useState<ReturnVersion[]>([]);

  useEffect(() => {
    if (defaultData) {
      setData(defaultData);
    } else {
      initReturnVersions();
    }
  }, [defaultData]);

  const initReturnVersions = () => {
    getVersions()
      .then((res) => {
        setData(res.data);
      })
      .catch((e) => {
        openErrorWindow(e, t("error"), true);
      });
  };

  const [columns] = useState([
    {
      field: "code",
      headerName: t("code"),
    },
    {
      field: "description",
      headerName: t("description"),
    },
  ]);

  return (
    <GridTable
      columns={columns}
      rows={data}
      setRows={() => {}}
      checkboxEnabled={true}
      checkboxSelection={true}
      onCheckboxClick={(
        currRow: ReturnVersion,
        selectedRows: ReturnVersion[]
      ) => {
        onCheckFunc(selectedRows);
      }}
      rowOnClick={rowOnCLick}
      selectedRows={checkedRows}
    />
  );
};

export default ReturnVersionGridContainer;
