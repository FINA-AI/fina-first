import ClosableModal from "../../../common/Modal/ClosableModal";
import { Box } from "@mui/system";
import TextField from "../../../common/Field/TextField";
import Select from "../../../common/Field/Select";
import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PrimaryBtn from "../../../common/Button/PrimaryBtn";
import GhostBtn from "../../../common/Button/GhostBtn";
import AddIcon from "@mui/icons-material/Add";
import { useDropzone } from "react-dropzone";
import { FiType } from "../../../../types/fi.type";
import { styled } from "@mui/material/styles";
import isEmpty from "lodash/isEmpty";
import { useSnackbar } from "notistack";

interface selectedElementTypes {
  exportFileTemplateName?: string;
  id?: number;
  fiType?: string;
  active?: boolean;
  sheetStartRow?: number;
}

interface EmsFileConfigurationAddModalProps {
  isAddModalOpen: boolean;
  setIsAddModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  addNewConfig: (payload: FormData, id: number) => void;
  fiTypes: FiType[];
  selectedElement: selectedElementTypes | null;
  setSelectedElement: React.Dispatch<React.SetStateAction<null>>;
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

const EmsFileConfigurationAddModal: FC<EmsFileConfigurationAddModalProps> = ({
  isAddModalOpen,
  setIsAddModalOpen,
  addNewConfig,
  fiTypes,
  selectedElement,
  setSelectedElement,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    noClick: true,
    disabled: false,
    noKeyboard: true,
    accept: [".xlsx"],
  });

  const [file, setFile] = useState<
    | {
        path?: string;
      }
    | any
  >({});
  const [data, setData] = useState(selectedElement);
  const [errorFields, setErrorFields] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    if (selectedElement) {
      setData(selectedElement);
    } else {
      setData({ active: false });
    }
  }, []);

  useEffect(() => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      errorFields["file"] = false;
    }
  }, [acceptedFiles]);

  const appendFormData = (
    formData: FormData,
    key: string,
    value: string | number | boolean | Blob | undefined
  ) => {
    if (value !== undefined) {
      formData.append(key, value.toString());
    }
  };

  const isMandatoryFieldsEmpty = () => {
    const errorFields: { [k: string]: boolean } = {};
    if (data) {
      if (!file.path && !data["exportFileTemplateName"]) {
        errorFields["file"] = true;
      }
      if (!data["fiType"]) errorFields["fiType"] = true;
      if (!data["sheetStartRow"]) errorFields["sheetStartRow"] = true;
    }
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
        setSelectedElement(null);
      }}
      open={isAddModalOpen}
      width={500}
      title={data?.id ? t("edit") : t("add")}
    >
      <StyledModalContent>
        <Select
          data={fiTypes.map((item) => ({ label: item.code, value: item.code }))}
          label={t("fiType")}
          onChange={(value) => {
            setData({ ...data, fiType: value });
          }}
          value={data?.fiType}
          isError={errorFields["fiType"]}
          data-testid={"fi-type-select"}
        />
        <Select
          data={[
            { label: t("active"), value: "active" },
            { label: t("passive"), value: "passive" },
          ]}
          onChange={(value) => {
            setData({ ...data, active: value === "active" });
          }}
          value={data?.active ? "active" : "passive"}
          label={t("status")}
          data-testid={"status-select"}
        />
        <TextField
          width="100%"
          label={t("sheetStartRow")}
          value={data?.sheetStartRow?.toString() || ""}
          onChange={(val: string) => {
            setData({
              ...data,
              sheetStartRow: val === "" ? undefined : Number(val),
            });
            if (val) errorFields["sheetStartRow"] = false;
          }}
          pattern={/^\d*$/}
          isError={errorFields["sheetStartRow"]}
          fieldName={"sheet-start-row"}
        />
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
          sx={{
            "& .MuiFormControl-root": {
              width: "100%",
            },
          }}
        >
          <TextField
            onChange={() => {}}
            value={file?.path ?? data?.exportFileTemplateName}
            readOnly={true}
            isError={errorFields["file"]}
            fieldName={"attachment-name"}
          />
          <Box {...getRootProps()}>
            <input {...getInputProps()} data-testid={"attachment-input"} />
            <PrimaryBtn
              onClick={open}
              startIcon={<AddIcon />}
              children={<>{t("browseFiles")}</>}
              style={{ height: "34px" }}
              data-testid={"add-attachment-button"}
            />
          </Box>
        </Box>
      </StyledModalContent>
      <StyledFooter>
        <GhostBtn
          onClick={() => {
            setIsAddModalOpen(false);
            setSelectedElement(null);
          }}
          data-testid={"cancel-button"}
        >
          {t("cancel")}
        </GhostBtn>
        <PrimaryBtn
          backgroundColor={"rgb(41, 98, 255)"}
          onClick={() => {
            if (!isMandatoryFieldsEmpty()) {
              const formData = new FormData();
              formData.append("exportFileTemplate", file);
              appendFormData(formData, "fiType", data?.fiType);
              appendFormData(formData, "active", data?.active);
              appendFormData(formData, "sheetStartRow", data?.sheetStartRow);
              appendFormData(formData, "id", data?.id ?? 0);
              appendFormData(
                formData,
                "exportFileTemplateName",
                file.path ?? file?.path ?? data?.exportFileTemplateName
              );

              addNewConfig(formData, data?.id ?? 0);
              setSelectedElement(null);
              setIsAddModalOpen(false);
            }
          }}
          data-testid={"save-button"}
        >
          {t("save")}
        </PrimaryBtn>
      </StyledFooter>
    </ClosableModal>
  );
};

export default EmsFileConfigurationAddModal;
