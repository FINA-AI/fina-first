import DetailForm, {
  FORM_STATE,
} from "../../../../components/common/Detail/DetailForm";
import { ITEM_TYPE } from "../../../../components/common/Detail/DetailItem";
import { useTranslation } from "react-i18next";
import { updateFiPerson } from "../../../../api/services/fi/fiPersonService";
import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { PhysicalPersonDataType } from "../../../../types/physicalPerson.type";
import { EducationDataType } from "../../../../types/fi.type";

interface EducationContainerProps {
  selectedPerson?: PhysicalPersonDataType;
  setSelectedPerson: (person: PhysicalPersonDataType) => void;
  isEditValid?: boolean;
}

const EducationContainer: React.FC<EducationContainerProps> = ({
  selectedPerson,
  setSelectedPerson,
  isEditValid = true,
}) => {
  const { t } = useTranslation();
  const { id } = useParams<{
    id: string;
  }>();

  const [educationFormState, setEducationFormState] = useState(FORM_STATE.VIEW);
  const [educationData, setEducationData] = useState<EducationDataType[]>([]);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [originalEducationData, setOriginalEducationData] = useState<
    EducationDataType[]
  >([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (selectedPerson?.education) {
      const mappedEducation = selectedPerson.education.map((item) => ({
        ...item,
        certificates: item.certificates,
      }));
      setEducationData(mappedEducation);
      setOriginalEducationData(mappedEducation);
    }
  }, [selectedPerson]);

  const educationFormItems = [
    {
      name: t("instituteName"),
      dataIndex: "instituteName",
      type: ITEM_TYPE.STRING,
      required: true,
    },
    {
      name: t("academicDegreeLevel"),
      dataIndex: "academicDegreeLevel",
      type: ITEM_TYPE.LIST,
      listData: [
        { label: t("BACHELOR"), value: "BACHELOR" },
        { label: t("MASTER"), value: "MASTER" },
        { label: t("SPECIALIST_DEGREE"), value: "SPECIALIST_DEGREE" },
        { label: t("PHD"), value: "PHD" },
      ],
    },
    {
      name: t("educationLevel"),
      dataIndex: "educationLevel",
      type: ITEM_TYPE.LIST,
      listData: [
        { label: t("BASIC"), value: "BASIC" },
        { label: t("SECONDARY_INCOMPLETE"), value: "SECONDARY_INCOMPLETE" },
        { label: t("SECONDARY_COMPLETE"), value: "SECONDARY_COMPLETE" },
        { label: t("SECONDARY_PROFESSIONAL"), value: "SECONDARY_PROFESSIONAL" },
        { label: t("ADVANCED"), value: "ADVANCED" },
      ],
    },
    {
      name: t("speciality"),
      dataIndex: "speciality",
      type: ITEM_TYPE.STRING,
    },
    {
      name: t("completeCourseName"),
      dataIndex: "completeCourseName",
      type: ITEM_TYPE.STRING,
    },
    {
      name: t("seminarOrganizer"),
      dataIndex: "seminarOrganizer",
      type: ITEM_TYPE.STRING,
    },
    {
      name: t("trainingPlace"),
      dataIndex: "trainingPlace",
      type: ITEM_TYPE.STRING,
    },
    {
      name: t("completionDate"),
      dataIndex: "completionDate",
      type: ITEM_TYPE.DATE,
    },
    {
      name: t("certificates"),
      dataIndex: "certificates",
      type: ITEM_TYPE.LIST,
      listData: [
        { label: t("yes"), value: "true" },
        { label: t("no"), value: "false" },
      ],
    },
    {
      name: t("supportDocuments"),
      dataIndex: "supportDocuments",
      type: ITEM_TYPE.STRING,
    },
  ];

  const onCancelEducation = () => {
    setEducationData(originalEducationData?.map((item) => ({ ...item })));
  };

  const onSaveEducation = async (editedData: any) => {
    let isAllFieldValid = true;
    editedData.forEach((item: any) => {
      if (!item["errors"]) {
        item["errors"] = {};
      }
      if (!item.instituteName) {
        isAllFieldValid = false;
        item["errors"]["instituteName"] = true;
      } else {
        item["errors"]["instituteName"] = false;
      }
    });

    if (isAllFieldValid) {
      let personResp = await updateFiPerson(id, {
        ...selectedPerson,
        education: editedData,
      });

      const education = personResp.data?.education.map(
        (item: EducationDataType) => {
          return { ...item, certificates: item.certificates.toString() };
        }
      );

      selectedPerson!.education = education;
      setSelectedPerson(personResp.data);
      setEducationData(education);
      setOriginalEducationData(education);
      changeFormState(FORM_STATE.VIEW);
    } else {
      setEducationData([...editedData]);
      enqueueSnackbar(t("requiredFieldsAreEmpty"), {
        variant: "error",
      });
    }

    setConfirmOpen(false);
  };

  const changeFormState = (value: string) => {
    setEducationFormState(value);
  };

  return (
    <Fragment>
      <DetailForm
        title={t("education")}
        name={"education"}
        formItems={educationFormItems}
        data={educationData}
        formState={educationFormState}
        setFormState={changeFormState}
        onCancel={onCancelEducation}
        onSave={onSaveEducation}
        isOpen={isConfirmOpen}
        setIsOpen={setConfirmOpen}
        isEditValid={isEditValid}
        isCancelModalOpen={isCancelModalOpen}
        setIsCancelModalOpen={setIsCancelModalOpen}
      />
    </Fragment>
  );
};

export default EducationContainer;
