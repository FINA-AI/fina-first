import ClosableModal from "../../common/Modal/ClosableModal";
import { Box } from "@mui/system";
import TextField from "../../common/Field/TextField";
import Select from "../../common/Field/Select";
import EmsTagField from "../Common/EmsTagField";
import { Typography } from "@mui/material";
import CheckboxBtn from "../../common/Checkbox/CheckboxBtn";
import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import GhostBtn from "../../common/Button/GhostBtn";
import { getLanguage } from "../../../util/appUtil";
import { InspectionColumnData } from "../../../types/inspection.type";
import { styled } from "@mui/material/styles";
import isEmpty from "lodash/isEmpty";
import { useSnackbar } from "notistack";

interface InspectionColumnDataProps {
  id?: number;
  type?: string;
  names?: { [key: string]: string };
  visible?: boolean;
  listValues?: string[] | string;
}

interface EmsInspectionColumnAddModalProps {
  isAddModalOpen: boolean;
  setIsAddModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedOptions: string[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<any>>;
  inspectionTypes: string[];
  addNewInspectionColumn: (data: InspectionColumnData) => void;
  selectedElement?: InspectionColumnDataProps;
}

const StyledModalContent = styled(Box)({
  display: "flex",
  flexDirection: "column",
  padding: "16px",
  gap: 8,
});

const StyledFooter = styled(Box)(({ theme }: any) => ({
  padding: 8,
  display: "flex",
  justifyContent: "center",
  gap: 8,
  ...theme.modalFooter,
}));

const EmsInspectionColumnAddModal: FC<EmsInspectionColumnAddModalProps> = ({
  isAddModalOpen,
  setIsAddModalOpen,
  selectedOptions,
  setSelectedOptions,
  inspectionTypes,
  addNewInspectionColumn,
  selectedElement,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [data, setData] = useState<InspectionColumnDataProps | undefined>(
    selectedElement
  );
  const [errorFields, setErrorFields] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    setData(selectedElement && selectedElement);
  }, [selectedElement]);

  const isAutocompleteDisabled = () => {
    return data?.type !== "LIST";
  };

  useEffect(() => {
    if (selectedElement?.id) {
      setSelectedOptions(selectedElement.listValues ?? []);
    }
  }, [selectedElement]);

  const getName = () => {
    if (data?.names) {
      if (data?.names[getLanguage()]) {
        return data?.names[getLanguage()];
      } else {
        return data.names[0];
      }
    }
  };

  const isMandatoryFieldsEmpty = () => {
    const errorFields: { [k: string]: boolean } = {};

    if (!data || !(data?.names && data.names[getLanguage()]))
      errorFields["names"] = true;
    if (!data || !data["type"]) errorFields["type"] = true;

    setErrorFields(errorFields);
    if (!isEmpty(errorFields)) {
      enqueueSnackbar(t("mandatoryFieldsAreEmpty"), {
        variant: "error",
      });
      return true;
    }
    return false;
  };

  return (
    <ClosableModal
      onClose={() => {
        setIsAddModalOpen(false);
        setSelectedOptions([]);
        setData({});
      }}
      open={isAddModalOpen}
      width={500}
      title={data?.id ? t("edit") : t("add")}
    >
      <StyledModalContent>
        <TextField
          width={"100%"}
          label={t("name")}
          value={getName()}
          onChange={(val: string) => {
            setData({ ...data, names: { [getLanguage()]: val } });
            errorFields["names"] = false;
          }}
          isError={errorFields["names"]}
          fieldName={"name"}
        />
        <Select
          data={inspectionTypes?.map((item) => ({
            label: t(item),
            value: item,
          }))}
          value={data?.type ?? ""}
          label={t("type")}
          onChange={(val: any) => {
            setData({ ...data, type: val });
            errorFields["type"] = false;
          }}
          isError={errorFields["type"]}
          data-testid={"type-select"}
        />
        <EmsTagField
          label={t("listvalue")}
          selectedOptions={selectedOptions}
          onChange={(value) => {
            setSelectedOptions(value);
            setData({ ...data, listValues: value });
          }}
          disabled={isAutocompleteDisabled()}
        />
        <Box style={{ display: "flex", alignItems: "center" }}>
          <Typography style={{ fontSize: 14 }}>{t("visible")}</Typography>
          <CheckboxBtn
            checked={data?.visible ?? false}
            onClick={() => {
              setData({ ...data, visible: !data?.visible });
            }}
            data-testid={"visible-checkbox"}
          />
        </Box>
      </StyledModalContent>
      <StyledFooter>
        <PrimaryBtn
          backgroundColor={"rgb(41, 98, 255)"}
          onClick={() => {
            if (!isMandatoryFieldsEmpty()) {
              addNewInspectionColumn(data as InspectionColumnData);
              setIsAddModalOpen(false);
              setSelectedOptions([]);
              setData({});
            }
          }}
          data-testid={"save-button"}
        >
          {t("save")}
        </PrimaryBtn>
        <GhostBtn
          onClick={() => {
            setIsAddModalOpen(false);
            setSelectedOptions([]);
            setData({});
          }}
          data-testid={"cancel-button"}
        >
          {t("cancel")}
        </GhostBtn>
      </StyledFooter>
    </ClosableModal>
  );
};

export default EmsInspectionColumnAddModal;
