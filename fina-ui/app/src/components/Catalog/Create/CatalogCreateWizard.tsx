import React, { useEffect, useRef, useState } from "react";
import { useSnackbar } from "notistack";
import Wizard from "../../Wizard/Wizard";
import ClosableModal from "../../common/Modal/ClosableModal";
import CatalogCreateGeneralInfo from "./CatalogCreateGeneralInfo";
import CatalogCreateStructure from "./CatalogCreateStructure";
import { useTranslation } from "react-i18next";
import CatalogCreateMetaDataInfo from "./CatalogCreateMetaDataInfo";
import { checkDateFormat } from "../../../util/appUtil";
import isEmpty from "lodash/isEmpty";
import {
  CatalogCreateGeneral,
  CatalogCreateMeta,
  CatalogCreateStructureRow,
} from "../../../types/catalog.type";

interface CatalogCreateWizardProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isEdit?: boolean;
  rowsToEdit?: any;
  editMetaInfo?: any;
  generalInfo?: any;
  onSave(
    generalInfo: CatalogCreateGeneral,
    metaInfo: Partial<CatalogCreateMeta>,
    rows: Partial<CatalogCreateStructureRow>[],
    successCallback: VoidFunction,
    errorCallback: VoidFunction
  ): void;
}

const initialGeneralInfoItem = {
  code: "",
  name: "",
  abbreviation: "",
  number: "",
  source: "",
};

const initialCatalogRow: Partial<CatalogCreateStructureRow> = {
  itemIdx: 0,
  name: "",
  type: "STRING",
  format: "",
  key: true,
  required: true,
  id: 0,
};

const CatalogCreateWizard: React.FC<CatalogCreateWizardProps> = ({
  isOpen,
  setIsOpen,
  onSave,
  isEdit = false,
  rowsToEdit,
  editMetaInfo,
  generalInfo,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const steps = [
    t("catalogStepCreateGeneral"),
    t("metaInfo"),
    t("catalogStepCreateStructure"),
  ];
  const [activeStep, setActiveStep] = useState(0);
  const generalInfoDataRef = useRef<CatalogCreateGeneral>(
    isEdit ? generalInfo : initialGeneralInfoItem
  );
  const metaInfoRef = useRef<Partial<CatalogCreateMeta>>(
    isEdit ? editMetaInfo : null
  );
  const [structureRows, setStructureRows] = useState<
    Partial<CatalogCreateStructureRow>[]
  >(isEdit ? rowsToEdit : [initialCatalogRow]);
  const [isGeneralInfoValid, setGeneralInfoValid] = useState(false);
  const [isStructureRowsValid, setStructureRowsValid] = useState(false);
  const [isMetaInfoValid, setIsMetaInfoValid] = useState(true);
  const [activeCatalogCreateSubmitBtn, setActiveCatalogCreateSubmitBtn] =
    useState(true);

  useEffect(() => {
    if (isEdit && rowsToEdit && rowsToEdit.length > 0) {
      metaInfoRef.current = editMetaInfo;
      setStructureRows(rowsToEdit);
      generalInfoDataRef.current = { ...generalInfo };
      setGeneralInfoValid(true);
      setStructureRowsValid(true);
    }
  }, [rowsToEdit]);

  const activeStepCallBack = (page: number) => {
    setActiveStep(page);
  };

  const onGeneralInfoDataChange = (key: string, value: string) => {
    generalInfoDataRef.current = {
      ...generalInfoDataRef.current,
      [key]: value,
    };
  };

  const onMetaInfoChange = (key: string, value: string) => {
    metaInfoRef.current = {
      ...metaInfoRef.current,
      [key]: value,
    };
  };

  const onStructureRowsChange = (object: CatalogCreateStructureRow) => {
    const newStructureRows = structureRows.map((row) =>
      row.itemIdx === object.itemIdx ? object : row
    );
    setStructureRows(newStructureRows);
    validateStructureRows(newStructureRows);
  };

  const reorderRows = (rows: CatalogCreateStructureRow[]) => {
    structureRows.forEach((row, index: number) => {
      structureRows[index] = rows[index];
    });
  };

  const onStructureRowAdd = (object: CatalogCreateStructureRow) => {
    structureRows.push(object);
    validateStructureRows(structureRows);
  };

  const onStructureRowRemove = (rowIndex: number) => {
    structureRows.splice(rowIndex, 1);
    validateStructureRows(structureRows);
  };

  const isValidDateFormat = (format?: string) => {
    if (format === null || format === "") return false;
    else {
      return !checkDateFormat(format);
    }
  };

  const validateStructureRows = (
    rows: Partial<CatalogCreateStructureRow>[]
  ) => {
    if (rows) {
      let valid = true;
      let isKeyProvided = false;

      for (const row of rows) {
        if (!row.name || row.name.trim().length === 0) {
          valid = false;
        }

        if (row.key && !isKeyProvided) {
          isKeyProvided = true;
        }

        if (row.type === "DATE") {
          valid = !isValidDateFormat(row.format);
        }
      }
      setStructureRowsValid(valid && isKeyProvided);
    }
  };

  const validateGeneralInfoItem = () => {
    const valid = Boolean(generalInfoDataRef.current.code);
    setGeneralInfoValid(valid);
    return valid;
  };

  const validateMetaInfoLegDataFile = () => {
    const legDocInfo = metaInfoRef?.current?.legislativeDocument;

    const valid =
      !legDocInfo ||
      isEmpty(legDocInfo) ||
      !!legDocInfo.fileName ||
      legDocInfo.fileName === null ||
      legDocInfo.id === 0;

    setIsMetaInfoValid(valid);
    return valid;
  };

  const onNext = (index: number) => {
    switch (index) {
      // validate first step GENERAL INFO
      case 0:
        return validateGeneralInfoItem();
      case 1:
        return validateMetaInfoLegDataFile();
      default:
        return true;
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setGeneralInfoValid(false);
    setStructureRowsValid(false);
    setStructureRows([initialCatalogRow]);
  };

  const onCancel = () => {
    handleClose();
  };

  const onSuccess = () => {
    setActiveCatalogCreateSubmitBtn(true);
    enqueueSnackbar(t("catalogCreateSuccess"), { variant: "success" });
    handleClose();
  };

  const onError = () => {
    setActiveCatalogCreateSubmitBtn(true);
    enqueueSnackbar(t("catalogCreateFailed"), { variant: "error" });
  };

  const onSubmit = () => {
    setActiveCatalogCreateSubmitBtn(false);
    onSave(
      generalInfoDataRef.current,
      metaInfoRef.current,
      structureRows,
      onSuccess,
      onError
    );
  };

  const getGeneralAndStructureInfoValid = () => {
    return isEdit
      ? isStructureRowsValid
      : isGeneralInfoValid && isStructureRowsValid && isMetaInfoValid;
  };

  return (
    <ClosableModal
      onClose={handleClose}
      open={isOpen}
      width={770}
      height={380}
      includeHeader={false}
      disableBackdropClick={true}
      padding={0}
    >
      <Wizard
        steps={steps}
        onCancel={onCancel}
        onSubmit={onSubmit}
        onNext={onNext}
        isSubmitDisabled={
          activeCatalogCreateSubmitBtn
            ? !getGeneralAndStructureInfoValid()
            : !activeCatalogCreateSubmitBtn
        }
        activeStepCallBack={activeStepCallBack}
      >
        <CatalogCreateGeneralInfo
          initialGeneralInfoItem={initialGeneralInfoItem}
          generalInfoDataRef={generalInfoDataRef.current}
          onGeneralInfoDataChange={onGeneralInfoDataChange}
          isDisabled={isEdit}
          activeStep={activeStep}
        />

        <CatalogCreateMetaDataInfo
          onMetaInfoChange={onMetaInfoChange}
          metaInfoRef={metaInfoRef.current}
          editMode={isEdit}
          activeStep={activeStep}
        />

        <CatalogCreateStructure
          isEdit={isEdit}
          onStructureRowsChange={onStructureRowsChange}
          onStructureRowAdd={onStructureRowAdd}
          structureRowsRef={structureRows}
          checkDateFormat={isValidDateFormat}
          onStructureRowRemove={onStructureRowRemove}
          isDisabled={isEdit}
          activeStep={activeStep}
          reorderRows={reorderRows}
        />
      </Wizard>
    </ClosableModal>
  );
};

export default CatalogCreateWizard;
