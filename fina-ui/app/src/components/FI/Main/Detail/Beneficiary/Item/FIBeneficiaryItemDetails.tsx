import React, { useEffect, useState } from "react";
import DetailForm, {
  FORM_STATE,
} from "../../../../../common/Detail/DetailForm";
import { ITEM_TYPE } from "../../../../../common/Detail/DetailItem";
import { useTranslation } from "react-i18next";
import ShareContainer from "../../../../../../containers/FI/Main/PhysicalPerson/ShareContainer";
import EducationContainer from "../../../../../../containers/FI/Main/PhysicalPerson/EducationContainer";
import RecommendationContainer from "../../../../../../containers/FI/Main/PhysicalPerson/RecommendationContainer";
import CriminalRecordContainer from "../../../../../../containers/FI/Main/PhysicalPerson/CriminalRecordContainer";
import PositionContainer from "../../../../../../containers/FI/Main/PhysicalPerson/PositionContainer";
import FILegalPersonItemBeneficiary from "../../LegalPerson/Item/FILegalPersonItemBeneficiary";
import FILegalPersonItemManager from "../../LegalPerson/Item/FILegalPersonItemManager";
import FILegalPersonItemShare from "../../LegalPerson/Item/FILegalPersonItemShare";
import Box from "@mui/material/Box";
import { bindActionCreators, Dispatch } from "redux";
import { setFiPersonEditChanged } from "../../../../../../redux/actions/fiPhysicalPersonActions";
import { connect } from "react-redux";
import PhysicalPersonLinkButton from "../../../../../common/Button/PhysicalPersonLinkButton";
import { useSnackbar } from "notistack";
import { loadFirstLevel } from "../../../../../../api/services/regionService";
import { useParams } from "react-router-dom";
import { BeneficiariesDataType } from "../../../../../../types/fi.type";
import { PhysicalPersonDataType } from "../../../../../../types/physicalPerson.type";
import { LegalPersonDataType } from "../../../../../../types/legalPerson.type";
import { FinalBeneficiaryType } from "./FIBeneficiaryItem";

interface FIBeneficiaryItemDetailsProps {
  selectedBeneficiary: BeneficiariesDataType;
  physicalPersons: PhysicalPersonDataType[];
  selectedLegalPerson?: LegalPersonDataType;
  selectedPhysicalPerson?: PhysicalPersonDataType;
  finallBeneficiaryData: FinalBeneficiaryType[];
  setFinallBeneficiaryData: (data: FinalBeneficiaryType[]) => void;
  saveGeneral: (data: FinalBeneficiaryType[], onCancel: () => void) => void;
  personType: string | null;
  finallBeneficiaryFormState: string;
  setFinallBeneficiaryFormState: (state: string) => void;
}

const FIBeneficiaryItemDetails: React.FC<FIBeneficiaryItemDetailsProps> = ({
  selectedBeneficiary,
  physicalPersons,
  selectedLegalPerson,
  selectedPhysicalPerson,
  finallBeneficiaryData,
  setFinallBeneficiaryData,
  saveGeneral,
  personType,
  finallBeneficiaryFormState,
  setFinallBeneficiaryFormState,
}) => {
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [countryData, setCountryData] = useState([]);
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { beneficiaryItemId } = useParams<{ beneficiaryItemId: string }>();

  useEffect(() => {
    initCountries();
  }, []);

  const initCountries = async () => {
    await loadFirstLevel()
      .then((resp) => {
        setCountryData(resp.data);
      })
      .catch((error) => enqueueSnackbar(error, { variant: "error" }));
  };

  const finallBeneficiaryFormItems: any[] = [
    {
      name: t("idAndName"),
      dataIndex: "person",
      displayFieldName: "name",
      secondaryDisplayFieldName: "identificationNumber",
      secondaryDisplayFieldLabel: t("legalPersonId"),
      hidden: finallBeneficiaryFormState === FORM_STATE.VIEW,
      type: ITEM_TYPE.PERSONSELECT,
      gridItem: 6,
      listData: physicalPersons,
      required: true,
    },
    {
      name: t("beneficiaryName"),
      dataIndex: "beneficiaryName",
      hidden: !(finallBeneficiaryFormState === FORM_STATE.VIEW),
      type: ITEM_TYPE.STRING,
      renderCell: (obj: any) => {
        return <PhysicalPersonLinkButton id={obj.person?.id} />;
      },
    },
    {
      name: t("beneficiaryId"),
      dataIndex: "beneficiaryId",
      hidden: !(finallBeneficiaryFormState === FORM_STATE.VIEW),
      type: ITEM_TYPE.STRING,
    },
  ];

  const onCancel = () => {
    if (
      selectedBeneficiary &&
      Object.keys(selectedBeneficiary).length !== 0 &&
      selectedBeneficiary.finalBeneficiaries
    ) {
      const finallBeneficiaryArray: FinalBeneficiaryType[] =
        selectedBeneficiary.finalBeneficiaries.map((o) => ({
          id: o.id,
          beneficiaryId: o.physicalPerson?.identificationNumber ?? "",
          beneficiaryName: o.physicalPerson?.name ?? "",
          person: o.physicalPerson ?? null,
          sharePercentage: o.sharePercentage ?? 0,
        }));

      setFinallBeneficiaryData(finallBeneficiaryArray);
    } else {
      setFinallBeneficiaryData([]);
    }
  };

  const onSave = (editedItems: FinalBeneficiaryType[]) => {
    let isAllFieldValid = true;

    editedItems.forEach((item: any) => {
      if (!item["errors"]) {
        item["errors"] = {};
      }

      if (!item.person) {
        isAllFieldValid = false;
        item["errors"]["person"] = true;
      } else {
        item["errors"]["person"] = false;
      }
    });

    setConfirmOpen(false);
    if (isAllFieldValid) {
      saveGeneral(editedItems, onCancel);
      setFinallBeneficiaryFormState(FORM_STATE.VIEW);
    } else {
      setFinallBeneficiaryData([...editedItems]);
      enqueueSnackbar(t("requiredFieldsAreEmpty"), { variant: "error" });
    }
  };

  const getBeneficiaryOtherDetails = () => {
    if (selectedBeneficiary) {
      if (selectedBeneficiary.legalPerson) {
        let selectedPerson: LegalPersonDataType = selectedLegalPerson!;
        return (
          <>
            <FILegalPersonItemBeneficiary
              currentLegalPerson={selectedPerson}
              physicalPerson={[]}
              legalPersons={[]}
              beneficiarySaveFunction={() => {}}
              openLegalPersonPage={true}
              isEditValid={false}
            />
            <FILegalPersonItemManager
              selectedPerson={selectedPerson}
              physicalPerson={[]}
              onSaveManagerFunction={() => {}}
              openLegalPersonPage={true}
              isEditValid={false}
            />
            <FILegalPersonItemShare
              selectedPerson={selectedPerson}
              legalPersons={[]}
              onSaveOtherShareFunction={() => {}}
              openLegalPersonPage={true}
              isEditValid={false}
            />
            <CriminalRecordContainer
              onSaveCriminalRecordFunction={() => {}}
              selectedPerson={selectedPerson}
              setSelectedPerson={() => {}}
              isEditValid={false}
            />
          </>
        );
      } else {
        let selectedPerson: PhysicalPersonDataType = selectedPhysicalPerson!;

        return (
          <>
            <ShareContainer
              selectedPerson={selectedPerson}
              setSelectedPerson={() => {}}
              isEditValid={false}
            />
            <EducationContainer
              selectedPerson={selectedPerson}
              setSelectedPerson={() => {}}
              isEditValid={false}
            />
            <RecommendationContainer
              selectedPerson={selectedPerson}
              setSelectedPerson={() => {}}
              openPhysicalPersonPage={true}
              isEditValid={false}
            />
            <CriminalRecordContainer
              onSaveCriminalRecordFunction={() => {}}
              selectedPerson={selectedPerson}
              setSelectedPerson={() => {}}
              isEditValid={false}
            />
            <PositionContainer
              selectedPerson={selectedPerson}
              setSelectedPerson={() => {}}
              isEditValid={false}
            />
          </>
        );
      }
    }
  };

  return (
    <>
      {personType === "legalPerson" && (
        <>
          <DetailForm
            title={t("fiBeneficiaryFinalBeneficiaries")}
            name={"fiBeneficiaryFinalBeneficiaries"}
            formItems={finallBeneficiaryFormItems}
            data={finallBeneficiaryData ? finallBeneficiaryData : []}
            formState={finallBeneficiaryFormState}
            setFormState={(val) => setFinallBeneficiaryFormState(val)}
            onCancel={onCancel}
            onSave={onSave}
            isOpen={isConfirmOpen}
            setIsOpen={setConfirmOpen}
            isEditValid={true}
            isCancelModalOpen={isCancelModalOpen}
            setIsCancelModalOpen={setIsCancelModalOpen}
            countryData={countryData}
            hideActionButtons={Number(beneficiaryItemId) <= 0}
            onValueChangeExternal={(finalBeneficiary: FinalBeneficiaryType[]) =>
              setFinallBeneficiaryData(finalBeneficiary)
            }
          />
        </>
      )}
      <Box>{getBeneficiaryOtherDetails()}</Box>
    </>
  );
};

const reducer = "fiPhysicalPerson";

const mapStateToProps = (state: any) => ({
  isEditValid: state.get(reducer).isEditValid,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onIsEditChange: bindActionCreators(setFiPersonEditChanged, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FIBeneficiaryItemDetails);
