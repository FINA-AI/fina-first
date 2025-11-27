import ClosableModal from "../../../common/Modal/ClosableModal";
import { Box } from "@mui/system";
import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PrimaryBtn from "../../../common/Button/PrimaryBtn";
import GhostBtn from "../../../common/Button/GhostBtn";
import TextField from "../../../common/Field/TextField";
import Select from "../../../common/Field/Select";
import { getEmsConfigDetailCellObjects } from "../../../../api/services/ems/emsFIleConfigService";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import { getLanguage } from "../../../../util/appUtil";
import {
  EmsFileConfigurationDetailDataType,
  FineType,
} from "../../../../types/emsFileConfiguration.type";
import CustomAutoComplete from "../../../common/Field/CustomAutoComplete";
import { FieldSize } from "../../../../types/common.type";
import { SanctionFineType } from "../../../../types/sanction.type";
import { styled } from "@mui/material/styles";

interface EmsFileConfigurationDetailAddModalProps {
  isAddModalOpen: boolean;
  setIsAddModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedElement: EmsFileConfigurationDetailDataType | null;
  setSelectedElement: React.Dispatch<React.SetStateAction<null>>;
  addNewAtribute: (data: EmsFileConfigurationDetailDataType) => void;
  selectedFileId: number;
  numberToExcelColumn: (value: number) => void;
  fineTypes: FineType[];
}

const StyledModalContent = styled(Box)({
  display: "flex",
  flexDirection: "column",
  padding: "16px",
  gap: 8,
});

const StyledFooter = styled(Box)(({ theme }: any) => ({
  padding: 8,
  display: "flex",
  justifyContent: "center",
  gap: 8,
  ...theme.modalFooter,
}));

const EmsFileConfigurationDetailAddModal: FC<
  EmsFileConfigurationDetailAddModalProps
> = ({
  isAddModalOpen,
  setIsAddModalOpen,
  selectedElement,
  setSelectedElement,
  addNewAtribute,
  selectedFileId,
  numberToExcelColumn,
  fineTypes,
}) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const langCode = getLanguage();

  const [data, setData] = useState(selectedElement ?? {});
  const [cellObjects, setCellObjects] = useState<
    { name: string; type: string }[]
  >([]);
  const [cellObjectValue, setCellObjectValue] = useState<number | null>(null);

  const isFineTypeDisabled =
    cellObjectValue !== 2 || data.cellObjectField !== "amount";

  useEffect(() => {
    if (data.id) {
      initCellObjects(Number(data.cellObject));
      setCellObjectValue(Number(data.cellObject));
    }
  }, []);

  const initCellObjects = async (id: number) => {
    try {
      const res = await getEmsConfigDetailCellObjects(id);
      setCellObjects(res.data);
    } catch (err) {
      openErrorWindow(err, t("error"), true);
    }
  };

  const cellObjectSelectionData = [
    { label: t("inspection"), value: "0" },
    { label: t("sanction"), value: "1" },
    { label: t("sanctionfine"), value: "2" },
    {
      label: t("fiexportonly"),
      value: "3",
    },
  ];

  const isValidData = () => {
    if (data !== null) {
      const basicChecks =
        data.cellColumn &&
        data.cellObject !== undefined &&
        data.cellObjectField &&
        data.cellObjectFieldTypeName &&
        data.mandatory !== undefined;

      if (data.cellObject === "2") {
        return !Boolean(
          basicChecks && data.sanctionFineType?.id && data.sanctionFinePrice
        );
      } else {
        return !Boolean(basicChecks);
      }
    }
    return true;
  };

  const getFineTypeDescription = (fineType: SanctionFineType) => {
    let result = "";
    if (fineType.rule) {
      result += fineType.rule + " - ";
    }
    if (fineType.article) {
      result += fineType.article + " - ";
    }
    if (fineType.paragraph) {
      result += fineType.paragraph + " - ";
    }
    if (fineType.subParagraph) {
      result += fineType.subParagraph + " - ";
    }
    if (fineType.names && fineType.names[langCode]) {
      result += fineType.names[langCode];
    }

    return result;
  };

  const getFilePriceData = () => {
    let tmp = fineTypes.find((item) => item.id === data.sanctionFineType?.id);
    return tmp?.price?.map((item) => ({
      label: item.toString(),
      value: item.toString(),
    }));
  };

  const getCellObjectFieldType = () => {
    switch (data.cellObjectFieldTypeName) {
      case "INTEGER":
        return "0";
      case "DOUBLE":
        return "1";
      case "DATE":
        return "2";
      case "STRING":
        return "4";
    }
  };

  const columnToNumber = (column: string = "") => {
    let length = column.length;
    let number = 0;
    for (let i = 0; i < length; i++) {
      number *= 26;
      number += column.charCodeAt(i) - "A".charCodeAt(0) + 1;
    }
    return number;
  };

  const getCellColumnValue = () => {
    if (data.cellColumn) {
      let value: number | string = data.cellColumn;

      if (typeof value === "number") {
        let column = numberToExcelColumn(value);
        if (typeof column === "string") {
          return column;
        }
      } else {
        return data.cellColumn.toString();
      }
    } else {
      return "";
    }
  };

  const onClearFineType = () => {
    setData({ ...data, sanctionFineType: {} as FineType });
  };

  return (
    <ClosableModal
      onClose={() => {
        setIsAddModalOpen(false);
        setSelectedElement(null);
      }}
      open={isAddModalOpen}
      width={500}
      title={data.id ? t("edit") : t("add")}
    >
      <StyledModalContent>
        <TextField
          label={t("cellcolumn")}
          value={getCellColumnValue()}
          onChange={(value: string) => {
            setData((prev: any) => ({
              ...prev,
              cellColumn: value.toUpperCase(),
            }));
          }}
          pattern={/^[a-zA-Z]*$/}
          fieldName={"cell-column"}
        />
        <Select
          label={t("cellobject")}
          data={cellObjectSelectionData}
          value={data.cellObject !== undefined ? String(data.cellObject) : ""}
          onChange={(val) => {
            initCellObjects(+val);
            setCellObjectValue(+val);
            setData({
              ...data,
              cellObject: val,
              cellObjectField: "",
            });
          }}
          data-testid={"cell-object-select"}
        />
        <Select
          label={t("cellobjectfield")}
          data={cellObjects.map((item) => ({
            label: t(item.name),
            value: item.name,
          }))}
          maxHeight={300}
          onChange={(val) => {
            setData({ ...data, cellObjectField: val });
          }}
          value={data.cellObjectField ? data.cellObjectField : ""}
          disabled={cellObjects.length === 0}
          data-testid={"cell-object-field-select"}
        />
        <CustomAutoComplete
          disabled={isFineTypeDisabled}
          label={t("finetype")}
          data={isFineTypeDisabled ? [] : fineTypes}
          selectedItem={!isFineTypeDisabled ? data?.sanctionFineType : ""}
          displayFieldFunction={(option) => {
            return getFineTypeDescription(option);
          }}
          valueFieldName="id"
          onChange={(val) => {
            setData({ ...data, sanctionFineType: val });
          }}
          onClear={onClearFineType}
          size={FieldSize.SMALL}
        />

        <Select
          label={t("fineprice")}
          data={getFilePriceData() ?? []}
          value={
            cellObjectValue === 2 && data.sanctionFinePrice
              ? String(data.sanctionFinePrice)
              : ""
          }
          onChange={(val) => {
            setData({ ...data, sanctionFinePrice: +val });
          }}
          disabled={cellObjectValue !== 2 || !data?.sanctionFineType?.id}
          data-testid={"fine-price-select"}
        />
        <Select
          label={t("type")}
          data={[
            { label: t("wholeNumber"), value: "INTEGER" },
            { label: t("floatingPoingNumber"), value: "DOUBLE" },
            { label: t("date"), value: "DATE" },
            { label: t("text"), value: "STRING" },
          ]}
          value={data.cellObjectFieldTypeName}
          onChange={(val) => {
            setData({ ...data, cellObjectFieldTypeName: val });
          }}
          disabled={!data.cellObjectField}
          data-testid={"type-select"}
        />
        <Select
          label={`${t("mandatory")} / ${t("optional")}`}
          value={
            data.mandatory !== undefined
              ? data.mandatory === true
                ? "mandatory"
                : "optional"
              : ""
          }
          data={[
            { label: t("mandatory"), value: "mandatory" },
            { label: t("optional"), value: "optional" },
          ]}
          onChange={(val) => {
            if (val === "mandatory") {
              setData({ ...data, mandatory: true });
            } else {
              setData({ ...data, mandatory: false });
            }
          }}
          data-testid={"mandatory-optional-select"}
        />
        <TextField
          label={t("cellFormat")}
          value={data.cellObjectFieldFormat}
          onChange={(val: string) => {
            setData({ ...data, cellObjectFieldFormat: val });
          }}
          fieldName={"cell-format"}
        />
      </StyledModalContent>
      <StyledFooter>
        <PrimaryBtn
          backgroundColor={"rgb(41, 98, 255)"}
          onClick={() => {
            const newObj = {
              cellObjectField: data.cellObjectField,
              cellObjectFieldTypeName: data.cellObjectFieldTypeName,
              cellObjectFieldFormat: data.cellObjectFieldFormat,
              cellObject: Number(data.cellObject),
              cellColumn:
                typeof data.cellColumn === "number"
                  ? data.cellColumn
                  : columnToNumber(String(data.cellColumn) ?? ""),
              fileConfigurationId: selectedFileId,
              cellObjectFieldType: getCellObjectFieldType(),
              sanctionFineTypeId: data.sanctionFineType?.id,
              sanctionFinePrice: data.sanctionFinePrice,
              sanctionFineTypeName: data.sanctionFineType?.names,
              mandatory: data.mandatory,
              id: data.id,
            };
            addNewAtribute(newObj);
            setSelectedElement(null);
            setIsAddModalOpen(false);
          }}
          disabled={isValidData()}
          data-testid={"save-button"}
        >
          {t("save")}
        </PrimaryBtn>
        <GhostBtn
          onClick={() => {
            setIsAddModalOpen(false);
            setSelectedElement(null);
          }}
          data-testid={"cancel-button"}
        >
          {t("cancel")}
        </GhostBtn>
      </StyledFooter>
    </ClosableModal>
  );
};

export default EmsFileConfigurationDetailAddModal;
