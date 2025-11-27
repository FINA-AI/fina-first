import ClosableModal from "../../../common/Modal/ClosableModal";
import React, { FC, useEffect, useState } from "react";
import TextField from "../../../common/Field/TextField";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/system";
import { Checkbox, Typography } from "@mui/material";
import GhostBtn from "../../../common/Button/GhostBtn";
import PrimaryBtn from "../../../common/Button/PrimaryBtn";
import CustomAutoComplete from "../../../common/Field/CustomAutoComplete";
import { ReturnDefinitionType } from "../../../../types/returnDefinition.type";
import {
  SubMatrixDataType,
  SubMatrixSaveDataType,
} from "../../../../types/matrix.type";
import { useParams } from "react-router-dom";

import { styled } from "@mui/material/styles";

export const StyledFooter = styled(Box)(({ theme }: { theme: any }) => ({
  display: "flex",
  justifyContent: "end",
  gap: "8px",
  ...theme.modalFooter,
}));

interface SubMatrixAddModalProps {
  isAddModalOpen: boolean;
  returns: ReturnDefinitionType[];
  onClose: () => void;
  selectedRow?: SubMatrixDataType;
  onSaveSubMatrix: (subMatrixData: SubMatrixSaveDataType) => void;
}

interface UserParams {
  matrixId: string;
}

const SubMatrixAddModal: FC<SubMatrixAddModalProps> = ({
  isAddModalOpen,
  returns,
  onClose,
  selectedRow,
  onSaveSubMatrix,
}) => {
  const { matrixId } = useParams<UserParams>();
  const { t } = useTranslation();
  const [dataObj, setDataObj] = useState<SubMatrixSaveDataType>({
    mainMatrix: { id: parseInt(matrixId) },
  });

  useEffect(() => {
    if (selectedRow) {
      setDataObj({
        ...selectedRow,
        mainMatrix: { id: selectedRow.mainMatrix.id },
        returnDefinitionName: selectedRow.returnDefinition.name,
      });
    }
  }, [selectedRow?.id]);

  const onReturnDefinitionChange = (item: ReturnDefinitionType) => {
    let type: string = "";
    let foundMCT = false;
    let foundVCT = false;
    if (item.tables && item.tables.length === 1) {
      type = item.tables[0].type;
    } else if (item.tables && item.tables.length > 1) {
      item.tables.forEach((table) => {
        if (table.type === "MCT") {
          foundMCT = true;
        } else if (table.type === "VCT") {
          foundVCT = true;
        }
      });
      if (foundMCT && foundVCT) {
        type = "MIXED";
      } else if (foundMCT) {
        type = "MCT";
      } else if (foundVCT && !foundMCT && item.tables.length > 1) {
        type = "MULTIVCT";
      }
    } else {
      type = "UNKNOWN";
    }
    setDataObj({
      ...dataObj,
      matrixTableType: type,
      returnDefinitionName: item.name,
      returnDefinition: { id: item.id },
    });
  };

  const isFormValid = (): boolean => {
    return (
      dataObj.mainMatrix != null &&
      dataObj.matrixTableType != null &&
      dataObj.returnDefinition != null &&
      dataObj.sheetName != null &&
      dataObj.sheetName.length > 0
    );
  };

  const clearAutocomplete = () => {
    const data = { ...dataObj };
    delete data.matrixTableType;
    delete data.returnDefinitionName;
    delete data.returnDefinition;
    setDataObj(data);
  };

  return (
    <ClosableModal
      onClose={onClose}
      open={isAddModalOpen}
      title={selectedRow?.id ? t("edit") : t("addNew")}
      width={400}
    >
      <>
        <Box p={2} display={"flex"} flexDirection={"column"} gap={2}>
          <CustomAutoComplete
            label={t("returndefinition")}
            data={returns}
            selectedItem={selectedRow?.returnDefinition ?? {}}
            displayFieldName={"code"}
            displayFieldFunction={(item) => {
              return `${item.returnType.code} / ${item.code} - ${item.name}`;
            }}
            onClear={() => {
              clearAutocomplete();
            }}
            valueFieldName={"id"}
            onChange={(item) => {
              if (!item) {
                clearAutocomplete();
                return;
              }
              onReturnDefinitionChange(item);
            }}
            virtualized={true}
            disabled={!!selectedRow}
          />
          <TextField
            label={t("returndefinitionname")}
            readOnly={true}
            value={dataObj.returnDefinitionName}
            isDisabled={!!selectedRow}
          />
          <TextField
            label={t("returndefinitiontype")}
            value={dataObj.matrixTableType}
            readOnly={true}
            isDisabled={!!selectedRow}
          />
          <TextField
            value={dataObj.sheetName}
            onChange={(val: string) => {
              setDataObj({ ...dataObj, sheetName: val });
            }}
            label={t("sheetname")}
          />
          <Box display={"flex"} alignItems={"center"} paddingLeft={"4px"}>
            <Typography>{t("isprotected")}</Typography>
            <Checkbox
              checked={dataObj.protected ?? false}
              onChange={(event, checked) => {
                setDataObj({ ...dataObj, protected: checked });
              }}
            />
          </Box>
        </Box>
        <StyledFooter>
          <GhostBtn onClick={onClose}>{t("close")}</GhostBtn>
          <PrimaryBtn
            disabled={!isFormValid()}
            onClick={() => {
              let data = { ...dataObj };
              delete data.returnDefinitionName;
              onSaveSubMatrix(data);
              onClose();
            }}
          >
            {t("save")}
          </PrimaryBtn>
        </StyledFooter>
      </>
    </ClosableModal>
  );
};

export default SubMatrixAddModal;
