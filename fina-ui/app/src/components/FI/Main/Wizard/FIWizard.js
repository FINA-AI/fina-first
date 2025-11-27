import PropTypes from "prop-types";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ClosableModal from "../../../common/Modal/ClosableModal";
import Wizard from "../../../Wizard/Wizard";
import FiBasicInfoWizardPage from "./FiBasicInfoWizardPage";
import FiContactInfoWizardPage from "./FiContactInfoWizardPage";
import UserAndGroupVirtualized from "../../../UserManagement/UserAndGroupVirtualized";
import { useTranslation } from "react-i18next";
import { loadUsersAndGroups } from "../../../../api/services/userManagerService";
import { validateEmail } from "../../../../util/component/validationUtil";
import useConfig from "../../../../hoc/config/useConfig";

const initialBasicInfo = () => {
  return {
    code: "",
    name: "",
    shortNameString: "",
    swiftCode: "",
    identificationCode: "",
    fiType: null,
    fiGroup: null,
    legalForm: null,
    isError: {
      code: false,
      fiType: false,
      fiGroup: false,
      identificationCode: false,
      name: false,
    },
    additionalInfo: {
      businessEntity: null,
      economicEntity: null,
      equityForm: null,
      managementForm: null,
    },
  };
};

const initialContactInfo = () => {
  return {
    phone: "",
    email: "",
    addressString: "",
    region: null,
    status: null,
    isError: {
      region: false,
      status: false,
      email: false,
    },
    registrationDate: null,
    closeDate: null,
  };
};

const FIWizard = ({ isOpen, setIsOpen, onSave }) => {
  const { t } = useTranslation();
  const { config } = useConfig();

  const [isBasicInfoValid, setBasicInfoValid] = useState(false);
  const [isContactInfoValid, setContactInfoValid] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const basicInfoRef = useRef(initialBasicInfo());
  const contactInfoRef = useRef(initialContactInfo());

  const [selectedPermittedUsers, setSelectedPermittedUsers] = useState([]);
  const [selectedResponsibleUsers, setSelectedResponsibleUsers] = useState([]);
  const [usersAndGroups, setUsersAndGroups] = useState();
  const [groups, setGroups] = useState([]);
  const hasErrorFieldsRef = useRef({
    businessEntity: false,
    economicEntity: false,
    equityForm: false,
    managementForm: false,
    fiType: false,
    fiGroup: false,
    region: false,
    status: false,
  });

  const [isNextStepEnable, setIsNextEnable] = useState(null);

  const [allStepsValidation] = useState([
    { 0: true },
    { 1: true },
    { 2: true },
    { 3: true },
  ]);

  useEffect(() => {
    loadUsersFunction();
    basicInfoRef.current = initialBasicInfo();
    contactInfoRef.current = initialContactInfo();
  }, []);

  const onBasicInfoErrorChange = (data, isValid) => {
    basicInfoRef.current = data;
    setBasicInfoValid(isValid);
  };

  const onBasicInfoChange = (key, value) => {
    let result = { ...basicInfoRef.current, [key]: value };
    basicInfoRef.current = result;
    const isValid = validateFunction(
      result,
      onBasicInfoErrorChange,
      key,
      value
    );

    if (isNextStepEnable !== null) {
      setIsNextEnable(isValid);
    } else if (isValid) {
      setIsNextEnable(true);
    }
  };

  const onBasicInfoDetailChange = (key, value) => {
    let details = {
      ...basicInfoRef.current.additionalInfo,
      [key]: value || null,
    };
    basicInfoRef.current = { ...basicInfoRef.current, additionalInfo: details };
    setIsNextEnable(validateBasicInfoPage(basicInfoRef.current, key, value));
  };

  const onContactInfoErrorChange = (data, isValid) => {
    contactInfoRef.current = data;
    setContactInfoValid(isValid);
  };

  const onContactInfoChange = (key, value) => {
    let result = { ...contactInfoRef.current, [key]: value };
    contactInfoRef.current = result;
    const isValid = validateFunction(result, onContactInfoErrorChange);

    if (isNextStepEnable !== null) {
      setIsNextEnable(isValid);
    } else if (isValid) {
      setIsNextEnable(true);
    }
  };

  const loadUsersFunction = () => {
    loadUsersAndGroups().then((res) => {
      const data = res.data.map((row) => {
        return row.group
          ? {
              ...row,
              users: row.users.map((user) => {
                return { ...user, parent: row };
              }),
            }
          : row;
      });
      setGroups(data.filter((row) => row.group));
      setUsersAndGroups(data);
    });
  };

  const handleClose = () => {
    contactInfoRef.current = initialContactInfo();
    basicInfoRef.current = initialBasicInfo();
    setIsOpen(false);
  };

  const onCancel = () => {
    handleClose();
  };

  const onSubmit = () => {
    let basicInfo = basicInfoRef.current;
    let contactInfo = contactInfoRef.current;
    const fiObject = {
      id: 0,
      code: basicInfo.code,
      name: basicInfo.name,
      shortNameString: basicInfo.shortNameString,
      swiftCode: basicInfo.swiftCode,
      identificationCode: basicInfo.identificationCode,
      fiTypeModel: basicInfo.fiType,
      fiGroupModels: [basicInfo.fiGroup],
      permittedUserIds: selectedPermittedUsers.map((u) => u.id),
      userLoginModels: selectedResponsibleUsers.map((u) => u.login),
      disable: contactInfo.status.value,
      phone: contactInfo.phone,
      email: contactInfo.email,
      addressString: contactInfo.addressString,
      regionId: contactInfo.region.id,
      additionalInfo: basicInfo.additionalInfo,
      registrationDate: contactInfo.registrationDate,
      closeDate: contactInfo.closeDate,
      legalForm: basicInfo.additionalInfo?.businessEntity?.code,
    };
    onSave(fiObject);
  };

  const onChangeStep = (oldStep, currentStep) => {
    let isNextStepValid = true;

    switch (oldStep < currentStep ? oldStep : currentStep) {
      case 0:
        isNextStepValid = validateBasicInfoPage(basicInfoRef.current);
        setIsNextEnable(isNextStepValid);
        break;
      case 1:
        isNextStepValid = validateContactInfoPage(contactInfoRef.current);
        setIsNextEnable(isNextStepValid);
        break;
      case 2:
        //setSelectedResponsibleUsers([...selectedPermittedUsers]);
        break;
      default:
        break;
    }
    if (isNextStepValid) {
      setActiveStep(currentStep);
      if (currentStep === 1) {
        isNextStepValid = validateContactInfoPage(contactInfoRef.current);
        setIsNextEnable(!isNextStepValid ? null : true);
      } else {
        setIsNextEnable(true);
      }
    }

    updateAllStepsValidation();
  };

  const updateAllStepsValidation = () => {
    for (let i = 0; i < allStepsValidation.length; i++) {
      switch (i) {
        case 0:
          allStepsValidation.find((obj) => Object.hasOwn(obj, i))[i] =
            validateBasicInfoPage(basicInfoRef.current);
          break;
        case 1:
          allStepsValidation.find((obj) => Object.hasOwn(obj, i))[i] =
            validateContactInfoPage(contactInfoRef.current);
          break;
        default:
          break;
      }
    }
  };

  const onNext = (oldStep, currentStep) => {
    const hasErrors = Object.values(hasErrorFieldsRef.current).some(
      (error) => error
    );

    if (hasErrors) {
      setIsNextEnable(false);
      return;
    }

    onChangeStep(oldStep, currentStep);
  };

  const onBack = (oldStep, currentStep) => {
    onChangeStep(oldStep, currentStep);
  };

  const validateFunction = (result, setData, key = null, value = null) => {
    let isValid = true;
    const tmp = { ...result };

    Object.entries(tmp).forEach(([key, value]) => {
      let valid = true;
      if (key !== "isError" && Object.keys(tmp.isError).includes(key)) {
        if (typeof value === "object" && value !== null) {
          valid = !!(value && Object.keys(value).length > 0);
        } else {
          valid = !!(value && value.trim().length > 0);
        }
        if (key === "registrationDate" || key === "closeDate") valid = !!value;
        if (key === "email") {
          if (value) {
            isValid = validateEmail(config, value);
            valid = isValid;
          } else {
            valid = true;
          }
        }
        tmp.isError[key] = !valid;
        if (!valid) {
          isValid = false;
        }
      }
    });

    if (key !== null) {
      hasErrorFieldsRef.current = {
        ...hasErrorFieldsRef.current,
        [key]: value === null,
      };

      if (Object.values(hasErrorFieldsRef.current).includes(true)) {
        isValid = false;
      }
    }

    setData(tmp, isValid);
    return isValid;
  };

  const validateContactInfoPage = (data) => {
    return validateFunction(data, onContactInfoErrorChange);
  };

  const validateBasicInfoPage = (data, key = null, value = null) => {
    return validateFunction(data, onBasicInfoErrorChange, key, value);
  };

  const getFilteredCurrentUsers = useMemo(() => {
    let result = [];
    groups.forEach((group) => {
      let users = selectedPermittedUsers.filter(
        (user) => user.parent && user.parent.id === group.id
      );
      if (users.length > 0) {
        result.push({ ...group, users: users });
      }
    });
    result = [
      ...result,
      ...selectedPermittedUsers.filter((user) => !user.parent),
    ];
    return result;
  }, [selectedPermittedUsers]);

  return (
    <ClosableModal
      onClose={handleClose}
      open={isOpen}
      width={852}
      height={484}
      includeHeader={false}
      disableBackdropClick={true}
    >
      <Wizard
        steps={[
          t("basicInfo"),
          t("contactInfoFi"),
          t("permittedUsers"),
          t("responsibleUsers"),
        ]}
        onCancel={onCancel}
        onSubmit={onSubmit}
        onNext={onNext}
        isNextStepValid={isNextStepEnable}
        isSubmitDisabled={!isBasicInfoValid || !isContactInfoValid}
        onBack={onBack}
        allStepsValidation={allStepsValidation}
      >
        <div
          style={{
            height: "100%",
            overflow: "auto",
            padding: "16px",
          }}
        >
          <FiBasicInfoWizardPage
            basicInfo={basicInfoRef.current}
            onBasicInfoChange={onBasicInfoChange}
            onBasicInfoDetailChange={onBasicInfoDetailChange}
            activeStep={activeStep}
            isNextStepEnable={isNextStepEnable}
          />
        </div>
        <div style={{ height: "100%", overflow: "auto", padding: "16px" }}>
          <FiContactInfoWizardPage
            onContactInfoChange={onContactInfoChange}
            contactInfoRef={contactInfoRef.current}
            activeStep={activeStep}
            isNextStepEnable={isNextStepEnable}
          />
        </div>
        <div
          style={{ height: "100%", width: "100%" }}
          data-testid={"permitted-users-container"}
        >
          {usersAndGroups && (
            <UserAndGroupVirtualized
              selectedUsers={selectedPermittedUsers}
              setSelectedUsers={setSelectedPermittedUsers}
              height={310}
              data={usersAndGroups}
              size={"small"}
            />
          )}
        </div>
        <div style={{ height: "100%", width: "100%" }}>
          {usersAndGroups && (
            <UserAndGroupVirtualized
              filterCurrentUsers={getFilteredCurrentUsers}
              selectedUsers={selectedResponsibleUsers}
              setSelectedUsers={setSelectedResponsibleUsers}
              data={usersAndGroups}
              height={310}
              size={"small"}
              excludeFilterHidden={true}
            />
          )}
        </div>
      </Wizard>
    </ClosableModal>
  );
};

FIWizard.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default FIWizard;
