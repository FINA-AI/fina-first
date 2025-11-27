import EmsFIleConfigurationDetail from "../../../components/EMS/EmsFileConfiguration/Details/EmsFIleConfigurationDetail";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import {
  deleteAtribute,
  getEmsConfigDetails,
  getEmsConfigDetailSanctionFineTypes,
  postEmsConfigDetail,
  putAtribute,
} from "../../../api/services/ems/emsFIleConfigService";
import { getLanguage } from "../../../util/appUtil";
import { GridColumnType } from "../../../types/common.type";
import {
  EmsFileConfigurationDetailDataType,
  FineType,
} from "../../../types/emsFileConfiguration.type";
import { connect } from "react-redux";

interface EmsFileConfigDetailContainerProps {
  selectedFileId?: number;
  state: any;
}

const EmsFileConfigDetailContainer: React.FC<
  EmsFileConfigDetailContainerProps
> = ({ selectedFileId, state }) => {
  const { openErrorWindow } = useErrorWindow();
  const { t } = useTranslation();

  useEffect(() => {
    if (state !== undefined && state.columns.length !== 0) {
      let newCols = [];
      for (let item of state.columns) {
        let headerCell = columns.find((el) => item.field == el.field);
        if (headerCell) {
          headerCell.hidden = item.hidden;
          headerCell.fixed = item.fixed;
          newCols.push(headerCell);
        }
      }
      setColumns(newCols);
    } else {
      setColumns(headerColumns);
    }
  }, [state]);

  useEffect(() => {
    initData();
  }, [selectedFileId]);

  useEffect(() => {
    initEmsConfigDetailSanctionTypes();
  }, []);

  const [data, setData] = useState<EmsFileConfigurationDetailDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [fineTypes, setFineTypes] = useState<FineType[]>([]);

  const numberToExcelColumn = (value: number) => {
    let column = "";
    while (value > 0) {
      const modulo = (value - 1) % 26;
      column = String.fromCharCode(65 + modulo) + column;
      value = Math.floor((value - modulo) / 26);
    }
    return column;
  };

  const initEmsConfigDetailSanctionTypes = async () => {
    try {
      const res = await getEmsConfigDetailSanctionFineTypes();
      setFineTypes(res.data.list);
    } catch (err) {
      openErrorWindow(err, t("error"), true);
    }
  };

  const initData = async () => {
    try {
      setLoading(true);
      if (selectedFileId) {
        const res = await getEmsConfigDetails(selectedFileId);
        setData(res.data);
      }
    } catch (err) {
      openErrorWindow(err, t("error"), true);
    } finally {
      setLoading(false);
    }
  };

  const addNewAtribute = async (
    newItem: EmsFileConfigurationDetailDataType
  ) => {
    try {
      if (newItem.id) {
        const res = await putAtribute(newItem);
        setData(data.map((item) => (item.id === newItem.id ? res.data : item)));
      } else {
        const res = await postEmsConfigDetail(newItem);
        setData([...data, res.data]);
      }
    } catch (err) {
      openErrorWindow(err, t("error"), true);
    }
  };

  const removeAtribute = async (id: number) => {
    try {
      await deleteAtribute(id);
      setData(data.filter((item) => item.id !== id));
    } catch (err) {
      openErrorWindow(err, t("error"), true);
    }
  };

  let headerColumns = [
    {
      field: "cellColumn",
      headerName: t("cellcolumn"),
      minWidth: 40,
      renderCell: (value: number) => {
        let column = numberToExcelColumn(value);
        return column;
      },
    },
    {
      field: "cellObject",
      headerName: t("cellobject"),
      minWidth: 85,
      renderCell: (value: any) => {
        let valueToLabel: Record<string, string> = {
          "0": "inspection",
          "1": "sanction",
          "2": "sanctionfine",
          "3": "fiexportonly",
        };
        return t(valueToLabel[value]);
      },
    },
    {
      field: "cellObjectField",
      headerName: t("cellobjectfield"),
      minWidth: 85,
    },
    {
      field: "cellObjectFieldTypeName",
      headerName: t("cellobjectfieldtypename"),
      minWidth: 85,
      renderCell: (value: any) => {
        let valueToLabel: Record<string, string> = {
          INTEGER: "wholenumber",
          DOUBLE: "floatingpointnumber",
          DATE: "sanctionfine",
          STRING: "text",
        };
        return t(valueToLabel[value]);
      },
    },
    {
      field: "sanctionFineTypeName",
      headerName: t("sanctionfinetypename"),
      minWidth: 85,
      hideCopy: true,
      renderCell: (value: any) => {
        if (value)
          if (value[getLanguage()]) {
            return value[getLanguage()];
          } else {
            return value[0];
          }
      },
    },
    {
      field: "sanctionFinePrice",
      headerName: t("sanctionfineprice"),
      minWidth: 85,
    },
    {
      field: "mandatory",
      headerName: t("mandatory"),
      minWidth: 85,
      renderCell: (value: boolean) => {
        if (value) {
          return t("mandatory");
        } else {
          return t("optional");
        }
      },
    },
    {
      field: "cellObjectFieldFormat",
      headerName: t("cellobjectfieldformat"),
      minWidth: 85,
    },
  ];

  const [columns, setColumns] = useState<GridColumnType[]>(headerColumns);

  return (
    <EmsFIleConfigurationDetail
      data={data}
      setData={setData}
      loading={loading}
      columns={columns}
      addNewAtribute={addNewAtribute}
      removeAtribute={removeAtribute}
      selectedFileId={selectedFileId}
      numberToExcelColumn={numberToExcelColumn}
      fineTypes={fineTypes}
      setColumns={setColumns}
    />
  );
};

const mapStateToProps = (state: any) => ({
  state: state.getIn([
    "state",
    "emsFileConfigurationAttributeTableCustomization",
  ]),
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmsFileConfigDetailContainer);
