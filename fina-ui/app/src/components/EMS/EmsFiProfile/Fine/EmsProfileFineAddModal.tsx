import React, { useState } from "react";
import { Box } from "@mui/system";
import { EmsFineDataType } from "../../../../types/emsFineDataType";
import ClosableModal from "../../../common/Modal/ClosableModal";
import { FieldSize } from "../../../../types/common.type";
import GhostBtn from "../../../common/Button/GhostBtn";
import { useTranslation } from "react-i18next";
import { SanctionFineType } from "../../../../types/sanction.type";
import CustomAutoComplete from "../../../common/Field/CustomAutoComplete";
import Select from "../../../common/Field/Select";
import TextField from "../../../common/Field/TextField";
import NumberField from "../../../common/Field/NumberField";
import { getLanguage } from "../../../../util/appUtil";
import PrimaryLoadingButton from "../../../common/Button/PrimaryLoadingButton";
import { styled } from "@mui/material/styles";

interface EmsProfileFineAddModalProps {
  currFine: EmsFineDataType | undefined;
  fineTypes: SanctionFineType[];
  onCancelClick: () => void;
  onSaveClick: (fine: EmsFineDataType) => void;
  viewMode?: boolean;
}

const StyledModalBox = styled(Box)({
  padding: "14px 16px",
  display: "flex",
  justifyContent: "space-between",
  height: "100%",
  boxSizing: "border-box",
  flexDirection: "column",
});

const EmsProfileFineAddModal: React.FC<EmsProfileFineAddModalProps> = ({
  currFine,
  onCancelClick,
  fineTypes = [],
  onSaveClick,
  viewMode = false,
}) => {
  const { t } = useTranslation();
  const langCode = getLanguage();

  const [loading, setLoading] = useState<boolean>(false);

  const getFineTypeDescription = (fineType: SanctionFineType) => {
    let result = "";
    if (fineType.rule) {
      result += fineType.rule + " - ";
    }
    if (fineType.article) {
      result += fineType.article + " - ";
    }
    if (fineType.paragraph) {
      result += fineType.paragraph + " - ";
    }
    if (fineType.subParagraph) {
      result += fineType.subParagraph + " - ";
    }
    if (fineType.names && fineType.names[langCode]) {
      result += fineType.names[langCode];
    }

    return result;
  };

  const [selectedFineType, setSelectedFineType] = useState<
    SanctionFineType | undefined
  >(currFine?.fineType);
  const [datOject, setDataObject] = useState<EmsFineDataType | undefined>(
    currFine
  );

  const onChangeValue = (key: string, value: any) => {
    const tmp = {
      ...datOject,
      [key]: value,
    };

    setDataObject(tmp as EmsFineDataType);
  };

  const isSaveButtonDisabled = (data: any) => {
    if (!selectedFineType) {
      return true;
    }
    let isValid = !!data?.finePrice && !!data?.amount;

    return !isValid;
  };

  return (
    <>
      <ClosableModal
        open={true}
        height={500}
        width={500}
        title={!!currFine ? t("edit") : t("add")}
        onClose={onCancelClick}
      >
        <StyledModalBox>
          <Box data-testid={"type-input-container"}>
            <CustomAutoComplete
              disabled={viewMode}
              label={t("type")}
              data={fineTypes}
              selectedItem={currFine?.fineType}
              displayFieldFunction={(option) => {
                return getFineTypeDescription(option);
              }}
              valueFieldName="id"
              onChange={(v) => {
                setSelectedFineType(v);
                onChangeValue("fineType", v);
              }}
              size={FieldSize.SMALL}
            />
          </Box>
          <Box>
            <Select
              size={"small"}
              onChange={(v) => {
                onChangeValue("finePrice", v);
              }}
              disabled={viewMode || !selectedFineType?.id}
              value={"" + datOject?.finePrice}
              label={t("fineprice")}
              data={
                selectedFineType?.price.map((p) => {
                  return { label: p.toString(), value: p };
                }) ?? []
              }
              data-testid={"fine-price-select"}
            />
          </Box>
          <Box>
            <NumberField
              isDisabled={viewMode}
              label={t("amount")}
              value={datOject?.amount}
              size={"small"}
              onChange={(v) => {
                onChangeValue("amount", v);
              }}
              pattern={/^\d*$/}
              fieldName={"amount-input"}
            />
          </Box>
          <Box>
            <TextField
              label={t("rule")}
              isDisabled={true}
              value={selectedFineType?.rule}
              onChange={() => {}}
              size={"small"}
              isError={false}
              fieldName={"rule"}
            />
          </Box>
          <Box>
            <TextField
              isDisabled={true}
              label={t("article")}
              value={selectedFineType?.article}
              onChange={() => {}}
              size={"small"}
              isError={false}
              fieldName={"article"}
            />
          </Box>
          <Box>
            <TextField
              isDisabled={true}
              label={t("paragraph")}
              value={selectedFineType?.paragraph}
              onChange={() => {}}
              size={"small"}
              isError={false}
              fieldName={"paragraph"}
            />
          </Box>
          <Box>
            <TextField
              isDisabled={true}
              label={t("subparagraph")}
              value={selectedFineType?.subParagraph}
              onChange={() => {}}
              size={"small"}
              isError={false}
              fieldName={"sub-paragraph"}
            />
          </Box>
          <Box>
            <TextField
              multiline={true}
              label={t("description")}
              value={datOject?.description}
              onChange={(value: string) => onChangeValue("description", value)}
              size={"small"}
              isError={false}
              isDisabled={viewMode}
              fieldName={"description"}
            />
          </Box>
          <Box
            sx={{
              paddingTop: "10px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <GhostBtn
              style={{ marginRight: "10px" }}
              onClick={onCancelClick}
              data-tsetid={"cancel-button"}
            >
              {t("cancel")}
            </GhostBtn>
            <PrimaryLoadingButton
              text={t("save")}
              loading={loading}
              onClick={async () => {
                if (datOject) {
                  setLoading(true);
                  await onSaveClick(datOject);
                  setLoading(false);
                }
              }}
              disabled={isSaveButtonDisabled(datOject)}
              data-tsetid={"save-button"}
            />
          </Box>
        </StyledModalBox>
      </ClosableModal>
    </>
  );
};

export default EmsProfileFineAddModal;
