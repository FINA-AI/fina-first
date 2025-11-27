import React, { useEffect, useState } from "react";
import { Box, Paper, Stack } from "@mui/material";
import PrimaryBtn from "../../../../../common/Button/PrimaryBtn";
import GhostBtn from "../../../../../common/Button/GhostBtn";
import TextField from "../../../../../common/Field/TextField";
import Select from "../../../../../common/Field/Select";
import CustomAutoComplete from "../../../../../common/Field/CustomAutoComplete";
import DoneIcon from "@mui/icons-material/Done";
import { useTranslation } from "react-i18next";
import {
  getLicenseTypes,
  saveLicense,
} from "../../../../../../api/services/licenseService";
import { useSnackbar } from "notistack";
import useErrorWindow from "../../../../../../hoc/ErrorWindow/useErrorWindow";
import { styled } from "@mui/material/styles";
import { FiDataType, LicensesDataType } from "../../../../../../types/fi.type";

interface FILicenseFormProps {
  onCancel: () => void;
  fi: FiDataType;
  licenses: LicensesDataType[];
  setLicenses: (licenses: LicensesDataType[]) => void;
}

interface LicenseType {
  id: number;
  name?: string;
}

interface FormDataType {
  code?: string;
  status?: string;
  licenseTypes?: LicenseType | "";
}

const StyledModalBox = styled(Box)(({ theme }: any) => ({
  width: 700,
  borderRadius: 0,
  ...theme.modalHeader,
  ...theme.ModalBody,
}));

const StyledFooter = styled(Box)(({ theme }: any) => ({
  display: "flex",
  justifyContent: "flex-end",
  ...theme.modalFooter,
}));

const FILicenseForm: React.FC<FILicenseFormProps> = ({
  onCancel,
  fi,
  licenses,
  setLicenses,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { openErrorWindow } = useErrorWindow();

  const [license, setLicense] = useState<LicenseType[]>([]);
  const [data, setData] = useState<FormDataType>({
    code: undefined,
    status: undefined,
    licenseTypes: undefined,
  });

  const setValue = (key: keyof FormDataType, value: any) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const licenseStatuses = [
    {
      label: t("ACTIVE"),
      value: "ACTIVE",
    },
    {
      label: t("INACTIVE"),
      value: "SUSPENDED",
    },
  ];

  useEffect(() => {
    getLicenseTypes()
      .then((resp) => {
        setLicense(
          resp.data.map((lic: LicenseType) => ({
            ...lic,
            name: lic.name ?? "",
          }))
        );
      })
      .catch((error) => openErrorWindow(error, t("error"), true));
  }, []);

  const onSubmit = () => {
    if (!data.licenseTypes || !data.status || !data.code) {
      enqueueSnackbar(t("mandatoryFieldsAreEmpty"), { variant: "error" });
      Object.keys(data).forEach((key) => {
        if ((data as any)[key] === undefined) {
          setData((prevData) => ({ ...prevData, [key]: "" }));
        }
      });
      return;
    }

    const date = new Date();
    saveLicense({
      id: 0,
      code: data.code,
      licenceStatus: data.status,
      creationDate: date.getTime(),
      licenseType: { id: (data.licenseTypes as LicenseType).id },
      fiModel: { code: fi?.code },
    })
      .then((resp) => {
        enqueueSnackbar(t("addNewItem"), { variant: "success" });
        setLicenses([...licenses, resp.data]);
        onCancel();
      })
      .catch((error) => openErrorWindow(error, t("error"), true));
  };

  return (
    <Box>
      <StyledModalBox component={Paper}>
        <Stack>
          <Select
            data-testid={"status-select"}
            size={"default"}
            label={t("status")}
            data={licenseStatuses}
            onChange={(value) => {
              setValue("status", value);
            }}
            isError={data.status === undefined ? false : !data.status}
          />
          <Box marginTop={"12px"}>
            <TextField
              fieldName={"code"}
              size={"default"}
              label={t("code")}
              maxLength={12}
              onChange={(value: string) => {
                setValue("code", value);
              }}
              isError={data.code === undefined ? false : !data.code}
            />
          </Box>
          <Box marginTop={"12px"} data-testid={"name-select-container"}>
            <CustomAutoComplete
              fieldName={"name"}
              selectedItem={data && data.licenseTypes ? data.licenseTypes : {}}
              valueFieldName={"id"}
              size={"default"}
              label={t("name")}
              displayFieldName={"name"}
              data={license}
              onChange={(value) => {
                setValue("licenseTypes", value);
              }}
              onClear={() => setValue("licenseTypes", "")}
              allowInvalidInputSelection
              isError={
                data.licenseTypes === undefined ? false : !data.licenseTypes
              }
            />
          </Box>
        </Stack>
      </StyledModalBox>
      <StyledFooter>
        <GhostBtn
          onClick={onCancel}
          style={{ marginRight: "5px" }}
          height={32}
          data-testid={"cancelBtn"}
        >
          {t("cancel")}
        </GhostBtn>
        <PrimaryBtn
          onClick={onSubmit}
          style={{ height: "32px" }}
          data-testid={"saveBtn"}
          endIcon={<DoneIcon />}
          disabled={data.licenseTypes === null}
        >
          {t("save")}
        </PrimaryBtn>
      </StyledFooter>
    </Box>
  );
};

export default FILicenseForm;
