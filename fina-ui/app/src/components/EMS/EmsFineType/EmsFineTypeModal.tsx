import ClosableModal from "../../common/Modal/ClosableModal";
import React, { useState } from "react";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import TextField from "../../common/Field/TextField";
import GhostBtn from "../../common/Button/GhostBtn";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import FiTypeSelect from "../../FI/Common/FiType/FiTypeSelect";
import { SanctionFineType } from "../../../types/sanction.type";
import { FiType } from "../../../types/fi.type";
import { FieldSize } from "../../../types/common.type";
import { getLanguage } from "../../../util/appUtil";
import EmsTagField from "../Common/EmsTagField";
import { styled } from "@mui/material/styles";

interface EmsFineTypeModalProps {
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
  currFineType: SanctionFineType | null;
  fiTypes: FiType[];
  onSubmit: (value: SanctionFineType) => void;
}

const StyledModalBox = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  height: "100%",
  boxSizing: "border-box",
  flexDirection: "column",
});

const StyledFieldsBox = styled(Box)({
  padding: "14px 16px",
  display: "flex",
  justifyContent: "space-between",
  height: "100%",
  boxSizing: "border-box",
  flexDirection: "column",
});

const StyledFooter = styled(Box)(({ theme }: any) => ({
  paddingTop: "10px",
  display: "flex",
  justifyContent: "flex-end",
  ...theme.modalFooter,
}));

const EmsFineTypeModal: React.FC<EmsFineTypeModalProps> = ({
  setOpenModal,
  openModal,
  currFineType,
  fiTypes,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const [fineType, setFineType] = useState<SanctionFineType | any>(
    currFineType
      ? currFineType
      : {
          names: {},
          fiType: null,
          rule: "",
          article: "",
          paragraph: "",
          subParagraph: "",
          price: [],
        }
  );

  const langCode = getLanguage();

  const [selectedOptions, setSelectedOptions] = useState(
    currFineType ? currFineType.price : []
  );

  const onChangeValue = (key: string, value: string | object) => {
    const tmp = {
      ...fineType,
      [key]: value,
    };
    setFineType(tmp);
  };

  const onSubmitFunc = () => {
    setOpenModal(false);
    onSubmit(fineType);
  };

  const isFormValid = () => {
    return (
      fineType.fiType &&
      fineType.names[langCode] &&
      fineType.rule &&
      fineType.article &&
      fineType.paragraph &&
      fineType.price.length > 0
    );
  };

  return (
    <ClosableModal
      open={openModal}
      height={500}
      width={500}
      title={currFineType ? t("edit") : t("add")}
      onClose={() => {
        setOpenModal(false);
      }}
    >
      <StyledModalBox>
        <StyledFieldsBox>
          <Box>
            <FiTypeSelect
              size={FieldSize.SMALL}
              selectedItem={fiTypes?.find(
                (item: FiType) => item.code === fineType?.fiType
              )}
              isError={false}
              disabled={!!currFineType}
              onChange={(value: string) => onChangeValue("fiType", value)}
            />
          </Box>
          <Box>
            <TextField
              label={t("description")}
              value={fineType?.names[langCode]}
              onChange={(value: string) => {
                const existingNames = fineType?.names;
                onChangeValue("names", { ...existingNames, [langCode]: value });
              }}
              size={"small"}
              isError={false}
              fieldName={"description"}
            />
          </Box>
          <Box>
            <TextField
              label={t("rule")}
              value={fineType?.rule}
              onChange={(value: string) => onChangeValue("rule", value)}
              size={"small"}
              isError={false}
              fieldName={"rule"}
            />
          </Box>
          <Box>
            <TextField
              label={t("article")}
              value={fineType?.article}
              onChange={(value: string) => onChangeValue("article", value)}
              size={"small"}
              isError={false}
              fieldName={"article"}
            />
          </Box>
          <Box>
            <TextField
              label={t("paragraph")}
              value={fineType?.paragraph}
              onChange={(value: string) => onChangeValue("paragraph", value)}
              size={"small"}
              isError={false}
              fieldName={"paragraph"}
            />
          </Box>
          <Box>
            <TextField
              label={t("subparagraph")}
              value={fineType?.subParagraph}
              onChange={(value: string) => onChangeValue("subParagraph", value)}
              size={"small"}
              isError={false}
              fieldName={"sub-paragraph"}
            />
          </Box>
          <Box>
            <EmsTagField
              label={t("fineprice")}
              selectedOptions={selectedOptions}
              size={FieldSize.SMALL}
              onChange={(value: any) => {
                setSelectedOptions(value);
                onChangeValue("price", value);
              }}
              numbersOnly={true}
            />
          </Box>
        </StyledFieldsBox>
        <StyledFooter>
          <GhostBtn
            style={{ marginRight: "10px" }}
            onClick={() => {
              setOpenModal(false);
            }}
            data-testid={"cancel-button"}
          >
            {t("cancel")}
          </GhostBtn>
          <PrimaryBtn
            disabled={!isFormValid()}
            onClick={() => onSubmitFunc()}
            data-testid={"save-button"}
          >
            {t("save")}
          </PrimaryBtn>
        </StyledFooter>
      </StyledModalBox>
    </ClosableModal>
  );
};

export default EmsFineTypeModal;
