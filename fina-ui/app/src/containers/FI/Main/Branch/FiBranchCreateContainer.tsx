import React, { useEffect, useState } from "react";
import { loadBranchTypes } from "../../../../api/services/fi/fiBranchTypeService";
import {
  loadFirstLevel,
  loadPaths,
} from "../../../../api/services/regionService";
import FIBranchForm from "../../../../components/FI/Main/Detail/Branch/FiBranchForm";
import { save } from "../../../../api/services/fi/fiBranchService";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import { loadAllPersons } from "../../../../api/services/fi/fiPersonService";
import { BranchDataType, BranchTypes } from "../../../../types/fi.type";
import { CountryDataTypes } from "../../../../types/common.type";
import { PhysicalPersonDataType } from "../../../../types/physicalPerson.type";

const MANDATORY_FIELDS = ["code", "regionModel"];

interface FiBranchCreateContainerProps {
  setOpen: () => void;
  selectedType: BranchTypes;
  submitCallback: (
    result: BranchDataType,
    selectedType: BranchTypes,
    isNew: boolean,
    isDelete: boolean
  ) => void;
  modalInfo: {
    open: boolean;
    selectedFiBranch: BranchDataType | null;
  };
  fiId: number;
}

const FiBranchCreateContainer: React.FC<FiBranchCreateContainerProps> = ({
  setOpen,
  selectedType,
  submitCallback,
  modalInfo,
  fiId,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { openErrorWindow } = useErrorWindow();

  const [branchTypes, setBranchTypes] = useState<BranchTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [regions, setRegions] = useState<
    {
      label: string;
      value: CountryDataTypes;
    }[]
  >();
  const [persons, setPersons] = useState<PhysicalPersonDataType[]>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [formObj, setFormObj] = useState<BranchDataType>(
    modalInfo.selectedFiBranch ??
      ({
        disable: false,
        isStorageAvailable: false,
      } as BranchDataType)
  );
  const [selectedValue, setSelectedValue] = useState<BranchTypes>(selectedType);
  const [countries, setCountries] = useState<CountryDataTypes[]>([]);
  const [allStepsValidation, setAllStepsValidation] = useState<
    {
      [step: number]: boolean;
    }[]
  >([]);
  const [errorFields, setErrorFields] = useState<string[]>([]);

  useEffect(() => {
    fetchBranchTypes();
    fetchRegions();
    fetchPersons();
    fetchCountries();
  }, []);

  useEffect(() => {
    if (selectedValue?.id != null) {
      setFormObj((prev) => ({
        ...prev,
        fiBranchTypeId: selectedValue.id!,
        bankId: fiId,
      }));
      allStepsValidation.length = 0;
      errorFields.length = 0;
      selectedValue?.steps?.forEach((_, index) => {
        allStepsValidation.push({ [index]: true });
      });
    }
  }, [selectedValue]);

  const fetchBranchTypes = async () => {
    let res = await loadBranchTypes();
    setBranchTypes(res.data);
  };

  const fetchCountries = () => {
    loadFirstLevel()
      .then((resp) => {
        setCountries(resp.data);
      })
      .catch((error) => enqueueSnackbar(error, { variant: "error" }));
  };

  const fetchRegions = async () => {
    setLoading(true);
    await loadPaths()
      .then((res) => {
        setRegions(
          res.data.map((e: CountryDataTypes) => ({
            label: e.name,
            value: e,
          }))
        );
      })
      .finally(() => setLoading(false));
  };

  const fetchPersons = async () => {
    setLoading(true);
    await loadAllPersons(-1, -1, true)
      .then((res) => {
        setPersons(res.data.list);
      })
      .finally(() => setLoading(false));
  };

  const submit = async () => {
    // validate last step
    validateStepFields(selectedValue.steps.length - 1);

    let hasError = errorFields.length > 0;

    if (!hasError) {
      await save(formObj)
        .then((resp) => {
          submitCallback(resp.data, selectedValue, !Boolean(formObj.id), false);
          close();
          enqueueSnackbar(t("saved"), { variant: "success" });
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
        });
    } else {
      enqueueSnackbar(t("mandatoryFieldsAreEmpty"), { variant: "error" });
    }
  };

  const close = () => {
    setOpen();
    setIsEdit(false);
  };

  const onAddNewPerson = (personItem: PhysicalPersonDataType) => {
    if (!persons) return;
    setPersons([personItem, ...persons]);
  };

  const updateErrorFields = (
    field: string,
    valid: boolean,
    stepIndex: number
  ) => {
    if (valid) {
      const index = errorFields.indexOf(field);
      if (index > -1) errorFields.splice(index, 1);
    } else if (!errorFields.includes(field)) {
      errorFields.push(field);
    }

    if (selectedValue?.steps?.length - 1 === stepIndex) {
      setErrorFields([...errorFields]);
    }
  };

  const validateStepFields = (stepIndex: number) => {
    const steps = selectedValue?.steps;
    const stepMandatoryFields: string[] = [];

    steps?.[stepIndex].columns.forEach((column) => {
      if (MANDATORY_FIELDS.includes(column.key)) {
        stepMandatoryFields.push(column.key);
        updateErrorFields(
          column.key,
          !!(formObj as any)[column.key],
          stepIndex
        );
      }
    });

    return !stepMandatoryFields.some(
      (field) => !Boolean((formObj as Record<string, any>)[field])
    );
  };

  const handleOnNext = (prevStep: number, currStep: number) => {
    const start = Math.min(prevStep, currStep);
    const end = Math.max(prevStep, currStep);
    const skippedSteps: number[] = [];
    for (let i = start; i < end; i++) {
      skippedSteps.push(i);
    }

    let stepIsValid = true;

    skippedSteps.forEach((stepIndex) => {
      stepIsValid = validateStepFields(stepIndex);
      const stepValidation = allStepsValidation.find((obj) =>
        obj.hasOwnProperty(stepIndex)
      );
      if (stepValidation) stepValidation[stepIndex] = stepIsValid;
    });

    setAllStepsValidation([...allStepsValidation]);
  };

  return (
    formObj && (
      <FIBranchForm
        branchTypes={branchTypes}
        close={close}
        regions={regions}
        persons={persons}
        onAddNewPerson={onAddNewPerson}
        formObj={formObj}
        setFormObj={setFormObj}
        submit={submit}
        selectedValue={selectedValue}
        setSelectedValue={setSelectedValue}
        isEdit={isEdit}
        selectedType={selectedType}
        loading={loading}
        editFiBranchId={modalInfo.selectedFiBranch?.id}
        setIsEdit={setIsEdit}
        countries={countries}
        handleOnNext={handleOnNext}
        allStepsValidation={allStepsValidation}
        errorFields={errorFields}
        MANDATORY_FIELDS={MANDATORY_FIELDS}
      />
    )
  );
};

export default FiBranchCreateContainer;
