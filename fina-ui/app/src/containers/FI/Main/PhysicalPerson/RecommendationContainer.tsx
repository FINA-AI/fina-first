import DetailForm, {
  FORM_STATE,
} from "../../../../components/common/Detail/DetailForm";
import { useTranslation } from "react-i18next";
import { ITEM_TYPE } from "../../../../components/common/Detail/DetailItem";
import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  loadAllPersons,
  updateFiPerson,
} from "../../../../api/services/fi/fiPersonService";
import PhysicalPersonLinkButton from "../../../../components/common/Button/PhysicalPersonLinkButton";
import { useSnackbar } from "notistack";
import { PhysicalPersonDataType } from "../../../../types/physicalPerson.type";
import { RecommendationDataType } from "../../../../types/fi.type";

interface RecommendationContainerProps {
  selectedPerson?: PhysicalPersonDataType;
  setSelectedPerson: (person: PhysicalPersonDataType) => void;
  isEditValid?: boolean;
  openPhysicalPersonPage?: boolean;
  allPersons?: PhysicalPersonDataType[];
}

const RecommendationContainer: React.FC<RecommendationContainerProps> = ({
  selectedPerson,
  setSelectedPerson,
  isEditValid = true,
  openPhysicalPersonPage,
  allPersons,
}) => {
  const { t } = useTranslation();
  const { id } = useParams<{
    id: string;
  }>();

  const [recommendationFormState, setRecommendationFormState] = useState(
    FORM_STATE.VIEW
  );
  const [recommendationData, setRecommendationData] = useState<
    RecommendationDataType[]
  >([]);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [originalRecommendations, setOriginalRecommendations] =
    useState<RecommendationDataType[]>();
  const { enqueueSnackbar } = useSnackbar();
  const [persons, setPersons] = useState<PhysicalPersonDataType[]>(
    allPersons ?? []
  );

  useEffect(() => {
    if (selectedPerson && selectedPerson.recommendations) {
      setRecommendationData(
        selectedPerson.recommendations.map((item) => ({ ...item }))
      );
      setOriginalRecommendations(
        selectedPerson.recommendations.map((item) => ({ ...item }))
      );
    }
  }, [selectedPerson]);

  useEffect(() => {
    if (allPersons) {
      setPersons(allPersons);
    } else {
      loadAllPersons().then((resp) => {
        setPersons(resp.data.list);
      });
    }
  }, [allPersons]);

  const recommendationFormItems = [
    {
      name: t("recommender"),
      dataIndex: "recommender",
      type: ITEM_TYPE.OBJECT,
      key: "name",
      hidden: !(recommendationFormState === FORM_STATE.VIEW),
      renderCell: (obj: any) => {
        return (
          !openPhysicalPersonPage && (
            <PhysicalPersonLinkButton id={obj?.recommender?.id} />
          )
        );
      },
    },
    {
      name: t("identificationNumber"),
      dataIndex: "identificationNumber",
      type: ITEM_TYPE.STRING,
      hidden: !(recommendationFormState === FORM_STATE.VIEW),
      renderCell: (obj: any) => {
        return obj.recommender?.identificationNumber;
      },
    },
    {
      name: t("idAndRecommenderName"),
      dataIndex: "recommender",
      displayFieldName: "name",
      secondaryDisplayFieldName: "identificationNumber",
      type: ITEM_TYPE.PERSONSELECT,
      size: "default",
      hidden: recommendationFormState === FORM_STATE.VIEW,
      gridItem: 6,
      listData: persons,
      required: true,
    },
    {
      name: t("passportNumber"),
      dataIndex: "passportNumber",
      type: ITEM_TYPE.STRING,
    },
    {
      name: t("recommendationDate"),
      dataIndex: "recommendationDate",
      type: ITEM_TYPE.DATE,
    },
    {
      name: t("recommenderWorkspace"),
      dataIndex: "recommenderWorkspace",
      type: ITEM_TYPE.STRING,
    },
    {
      name: t("cooperationPlace"),
      dataIndex: "cooperationPlace",
      type: ITEM_TYPE.STRING,
    },
    {
      name: t("phone"),
      dataIndex: "phone",
      type: ITEM_TYPE.STRING,
    },
  ];

  const onCancelRecommendation = async () => {
    if (originalRecommendations) {
      setRecommendationData(
        originalRecommendations.map((item) => ({ ...item }))
      );
    } else {
      setRecommendationData([]);
    }
  };

  const onSaveRecommendation = async (editedData: any) => {
    let isAllFieldValid = true;
    editedData.forEach((item: any) => {
      if (!item["errors"]) {
        item["errors"] = {};
      }
      if (!item.recommender) {
        isAllFieldValid = false;
        item["errors"]["recommender"] = true;
      } else {
        item["errors"]["recommender"] = false;
      }
    });

    if (isAllFieldValid) {
      let personResp = await updateFiPerson(id, {
        ...selectedPerson,
        recommendations: editedData,
      });
      selectedPerson!.recommendations = personResp.data.recommendations;
      setSelectedPerson(personResp.data);
      setRecommendationData(personResp.data?.recommendations);
      setOriginalRecommendations(personResp.data?.recommendations);
      changeFormState(FORM_STATE.VIEW);
    } else {
      setRecommendationData([...editedData]);
      enqueueSnackbar(t("requiredFieldsAreEmpty"), {
        variant: "error",
      });
    }
    setConfirmOpen(false);
  };

  const changeFormState = (value: string) => {
    setRecommendationFormState(value);
  };

  return (
    <Fragment>
      <DetailForm
        title={t("recommendation")}
        name={"recommendation"}
        formItems={recommendationFormItems}
        data={recommendationData}
        formState={recommendationFormState}
        setFormState={changeFormState}
        onCancel={onCancelRecommendation}
        onSave={onSaveRecommendation}
        isOpen={isConfirmOpen}
        setIsOpen={setConfirmOpen}
        isEditValid={isEditValid}
        isCancelModalOpen={isCancelModalOpen}
        setIsCancelModalOpen={setIsCancelModalOpen}
      />
    </Fragment>
  );
};

export default RecommendationContainer;
