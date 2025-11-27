import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { loadManagementTypes } from "../../../../api/services/fi/fiManagementTypeService";
import { loadPaths } from "../../../../api/services/regionService";
import FiManagementForm from "../../../../components/FI/Main/Detail/Management/FiManagementForm";
import {
  addFiManagement,
  getFiManagementById,
} from "../../../../api/services/fi/fiManagementService";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import { loadAllPersons } from "../../../../api/services/fi/fiPersonService";
import { FiManagementType } from "../../../../types/fi.type";
import { PhysicalPersonDataType } from "../../../../types/physicalPerson.type";
import { CountryDataTypes } from "../../../../types/common.type";

const MANDATORY_FIELDS = ["person"];

interface FiManagementCreateContainerProps {
  fiId: number;
  setOpen: (value: boolean) => void;
  setEditFiManagementId?: (id: number | null) => void;
  editFiManagementId?: number;
  selectedType: FiManagementType;
  submitCallback: (data: any, isSameType: boolean) => void;
}

const FiManagementCreateContainer: React.FC<
  FiManagementCreateContainerProps
> = ({
  fiId,
  setOpen,
  setEditFiManagementId,
  editFiManagementId,
  selectedType,
  submitCallback,
}) => {
  const [managementTypes, setManagemenetTypes] = useState<FiManagementType[]>(
    []
  );
  const [regions, setRegions] = useState<
    {
      value: number;
      label: string;
    }[]
  >([]);
  const [persons, setPersons] = useState<PhysicalPersonDataType[]>([]);
  const [selectedValue, setSelectedValue] = React.useState<FiManagementType>(
    {} as FiManagementType
  );
  const [isRegistration, setIsRegistration] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formObj, setFormObj] = useState<any>({});
  const [allStepsValidation, setAllStepsValidation] = useState<
    {
      [key: number]: boolean;
    }[]
  >([]);
  const [errorFields, setErrorFields] = useState<string[]>([]);
  const { id } = useParams<{
    id: string;
  }>();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();

  useEffect(() => {
    if (editFiManagementId) {
      setSelectedValue(selectedType);
      getFiManagement(editFiManagementId);
      setIsRegistration(true);
      setIsEdit(true);
    } else {
      fetchManagementTypes();
    }
    fetchRegions();
    fetchPersons();
  }, []);

  useEffect(() => {
    if (!editFiManagementId && selectedValue && selectedValue.is !== -1) {
      setFormObj({ fiBranchTypeId: selectedValue.id, bankId: id });
      allStepsValidation.length = 0;
      errorFields.length = 0;
      selectedValue?.steps?.forEach((_, index) => {
        allStepsValidation.push({ [index]: true });
      });
    }
  }, [selectedValue]);

  const fetchManagementTypes = async () => {
    let res = await loadManagementTypes();
    setManagemenetTypes(res.data);
  };

  const fetchRegions = async () => {
    let res = await loadPaths();
    setRegions(
      res.data.map((e: CountryDataTypes) => ({ label: e.name, value: e.id }))
    );
  };

  const fetchPersons = async () => {
    await loadAllPersons(-1, -1).then((res) => {
      setPersons(res.data.list);
    });
  };

  const getFiManagement = async (id: number) => {
    let res = await getFiManagementById(id);
    setFormObj(res.data);
  };

  const submit = async () => {
    // validate last step
    validateStepFields(selectedValue.steps.length - 1);

    if (!formObj.person) {
      enqueueSnackbar(`${t("requiredFieldsAreEmpty")}: fi person`, {
        variant: "error",
      });
      return;
    }

    await addFiManagement(fiId, selectedValue.id, formObj)
      .then((res) => {
        let isSameType = selectedType.id === selectedValue.id;
        submitCallback(res.data, isSameType);
        close();
        enqueueSnackbar(t("saved"), { variant: "success" });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const close = () => {
    setOpen(false);
    if (setEditFiManagementId) {
      setEditFiManagementId(null);
    }
    setIsEdit(false);
  };

  const onAddNewPerson = (personItem: PhysicalPersonDataType) => {
    let tmp = [...persons];
    setPersons([personItem].concat(tmp));
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

  const validateStepFields = (stepIndex: number): boolean => {
    const steps = selectedValue?.steps;
    const stepMandatoryFields: string[] = [];

    steps[stepIndex].columns.forEach((column) => {
      if (MANDATORY_FIELDS.includes(column.key)) {
        stepMandatoryFields.push(column.key);

        updateErrorFields(
          column.key,
          !!formObj[column.key as keyof typeof formObj],
          stepIndex
        );
      }
    });

    return !stepMandatoryFields.some(
      (field) => !Boolean(formObj[field as keyof typeof formObj])
    );
  };

  const handleOnNext = (prevStep: number, currStep: number) => {
    const start = Math.min(prevStep, currStep);
    const end = Math.max(prevStep, currStep);

    const skippedSteps = Array.from(
      { length: end - start },
      (_, i) => i + start
    );

    skippedSteps.forEach((stepIndex) => {
      const valid = validateStepFields(stepIndex);
      const stepValidation = allStepsValidation.find((obj) =>
        obj.hasOwnProperty(stepIndex)
      );
      if (stepValidation) {
        stepValidation[stepIndex] = valid;
      }
    });

    setAllStepsValidation([...allStepsValidation]);
  };

  return (
    <FiManagementForm
      managementTypes={managementTypes}
      close={close}
      regions={regions}
      persons={persons}
      onAddNewPerson={onAddNewPerson}
      formObj={formObj}
      setFormObj={setFormObj}
      submit={submit}
      isRegistration={isRegistration}
      setIsRegistration={setIsRegistration}
      selectedValue={selectedValue}
      setSelectedValue={setSelectedValue}
      isEdit={isEdit}
      selectedType={selectedType}
      handleOnNext={handleOnNext}
      allStepsValidation={allStepsValidation}
      errorFields={errorFields}
      MANDATORY_FIELDS={MANDATORY_FIELDS}
    />
  );
};

const mapStateToProps = () => ({});

const dispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  dispatchToProps
)(FiManagementCreateContainer);
