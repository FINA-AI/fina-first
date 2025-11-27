import React, { useEffect, useState } from "react";
import FiLegalTypeInfo from "../../../../components/FI/Main/Detail/GeneralInfo/FiLegalTypeInfo";
import PropTypes from "prop-types";
import {
  loadEconomicEntityTypes,
  loadEquityFormTypes,
  loadLegalFormTypes,
  loadManagementFormTypes,
} from "../../../../api/services/fi/fiService";

const FiLegalTypeInfoContainer = ({ fi, editMode, onValueChange }) => {
  const [legalFormData, setLegalFormData] = useState([]);
  const [economicEntityData, setEconomicEntityData] = useState([]);
  const [equityFormData, setEquityFormData] = useState([]);
  const [managementFormData, setManagementFromData] = useState([]);

  useEffect(() => {
    loadLegalFormTypes().then((resp) => setLegalFormData(resp.data));
    loadEconomicEntityTypes().then((resp) => setEconomicEntityData(resp.data));
    loadEquityFormTypes().then((resp) => setEquityFormData(resp.data));
    loadManagementFormTypes().then((resp) => setManagementFromData(resp.data));
  }, []);

  return (
    <FiLegalTypeInfo
      additionalInfo={fi?.additionalInfo}
      editMode={editMode}
      onValueChange={onValueChange}
      legalFormData={legalFormData}
      economicEntityData={economicEntityData}
      equityFormData={equityFormData}
      managementFormData={managementFormData}
    />
  );
};

FiLegalTypeInfoContainer.propTypes = {
  fi: PropTypes.object,
  editMode: PropTypes.bool,
  onValueChange: PropTypes.func.isRequired,
};

export default FiLegalTypeInfoContainer;
