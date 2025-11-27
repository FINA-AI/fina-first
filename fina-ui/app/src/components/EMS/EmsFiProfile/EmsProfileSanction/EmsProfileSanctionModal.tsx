import Box from "@mui/system/Box";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ClosableModal from "../../../common/Modal/ClosableModal";
import GhostBtn from "../../../common/Button/GhostBtn";
import PrimaryBtn from "../../../common/Button/PrimaryBtn";
import CheckIcon from "@mui/icons-material/Check";
import Select from "../../../common/Field/Select";
import { Grid } from "@mui/material";
import TextField from "../../../common/Field/TextField";
import DatePicker from "../../../common/Field/DatePicker";
import EmsDocumentsGrid from "../../Common/EmsDocumentsGrid";
import {
  loadFineStatusType,
  loadSanctionDocument,
} from "../../../../api/services/ems/emsProfileSanctionService";
import { BASE_URL, getLanguage } from "../../../../util/appUtil";
import {
  EmsFiProfileSanctionType,
  InspectorDataType,
} from "../../../../types/emsFiProfile.type";
import { loadInspectors } from "../../../../api/services/ems/EmsProfileInspectionService";
import { EmsFineSubStatus } from "../../../../types/emsFineDataType";
import NumberField from "../../../common/Field/NumberField";
import { SanctionDataType } from "../../../../types/sanction.type";
import { styled } from "@mui/material/styles";

interface EmsProfileSanctionModalProps {
  showAddModal: { isShow: boolean; viewMode: boolean };
  setShowAddModal: React.Dispatch<React.SetStateAction<any>>;
  sanctionTypes: SanctionDataType[];
  currSanction?: EmsFiProfileSanctionType;
  sanctionTypeStatuses: string[];
  fineStatusses: string[];
  submitSanction: (data: any, payload: FormData | null) => void;
  fiCode: string;
}

const StyledFooter = styled(Box)(({ theme }: any) => ({
  padding: 10,
  paddingRight: 20,
  ...theme.modalFooter,
}));

const EmsProfileSanctionModal: React.FC<EmsProfileSanctionModalProps> = ({
  showAddModal,
  setShowAddModal,
  sanctionTypes,
  currSanction,
  sanctionTypeStatuses,
  fineStatusses,
  submitSanction,
  fiCode,
}) => {
  const { t } = useTranslation();
  const langCode = getLanguage();

  const [sanctionData, setSanctionData] = useState(currSanction);
  const [documents, setDocuments] = useState([]);
  const [Inspectors, setInspectors] = useState<InspectorDataType[]>([]);
  const [fineStatusType, setFineStatusType] = useState<EmsFineSubStatus[]>([]);

  useEffect(() => {
    if (currSanction) getSanctionDocument();
    getInspectors();
  }, []);

  useEffect(() => {
    if (sanctionData?.status?.fineStatus) {
      getFineStatusTypeData(sanctionData?.status?.fineStatus);
    }
  }, []);

  const getSubStatusValue = () => {
    if (
      currSanction &&
      currSanction.status &&
      currSanction.status.fineSubstatus
    ) {
      if (sanctionData?.status.fineSubstatus) {
        return currSanction.status.fineSubstatus.descriptions?.[langCode];
      }
    } else {
      return (
        fineStatusType.find((item) => item.id === sanctionData?.status.id)
          ?.descriptions?.[langCode] || null
      );
    }
  };

  const getSanctionDocument = () => {
    if (currSanction) {
      loadSanctionDocument(fiCode, currSanction.id).then((res) => {
        const resDocuments = res.data;
        setDocuments(resDocuments);
      });
    }
  };

  const getFineStatusTypeData = (val: string) => {
    if (
      sanctionData?.type?.type === "FINE" ||
      sanctionData?.type?.type === "ADMINISTRATOR_FINE"
    ) {
      loadFineStatusType(val).then((res: any) => {
        let fineStatusData = res.data.list.map((item: EmsFineSubStatus) => ({
          ...item,
          label: item.descriptions ? item.descriptions[langCode] : "NONAME",
          value: item.descriptions ? item.descriptions[langCode] : "NONAME",
        }));

        setFineStatusType(fineStatusData);
      });
    }
  };

  const submitSanctionHandler = () => {
    let submitData: any = { ...sanctionData };

    submitData.status = {
      ...submitData.status,
      fineSubstatusDesc: sanctionData?.status?.fineSubstatus?.value,
      fineSubstatusId: sanctionData?.status?.fineSubstatus?.id,
    };

    if (documents.length) {
      const formData = new FormData();
      documents.forEach((file: any, index: number) => {
        if (!file?.id) {
          formData.append(
            `filedata${index}`,
            new Blob([file]),
            encodeURIComponent(file.name)
          );
        }
        formData.append("autoRename", "true");
      });
      submitSanction(submitData, formData);
    } else {
      submitSanction(submitData, null);
    }
  };

  const fileExportHandler = (id: number) => {
    window.open(BASE_URL + `/rest/ems/v1/ecm/file/${id}/content`, "_blank");
  };

  const onChangeValue = (key: string, value: any) => {
    if (key === "type") {
      setSanctionData({
        ...sanctionData!,
        status: {
          ...sanctionData?.status,
          fineSubstatus: null,
          fineSubstatusAmount: undefined,
          fineSubstatusDesc: "",
          fineSubstatusId: undefined,
          fineStatus: "",
        },
        responsiblePerson: "",
        administratorName: "",
        administratorIdNumber: "",
        [key]: value,
      });
    } else {
      setSanctionData({
        ...sanctionData!,
        [key]: value,
      });
    }
  };

  const getInspectors = () => {
    loadInspectors().then((res) => {
      const data = [...res.data.list];
      setInspectors(data);
    });
  };

  const isDisabledHandler = (type: string): boolean => {
    return !(sanctionData?.type?.type === type);
  };

  const generateStatusData = () => {
    if (
      sanctionData?.type?.type === "FINE" ||
      sanctionData?.type?.type === "ADMINISTRATOR_FINE"
    ) {
      return fineStatusses.map((item: string) => ({
        label: t(item),
        value: item,
      }));
    } else {
      return sanctionTypeStatuses.map((item: string) => ({
        label: t(item),
        value: item,
      }));
    }
  };

  const disableSave = () => {
    if (sanctionData?.type?.type === "RECOMMENDATION") {
      return !(
        sanctionData?.type?.id &&
        sanctionData?.status?.type &&
        sanctionData?.responsiblePerson
      );
    } else {
      return !(
        sanctionData?.type?.id &&
        (sanctionData?.status?.type || sanctionData?.status?.fineStatus)
      );
    }
  };
  const disableSubStatus = () => {
    return (
      !(
        (sanctionData?.type?.type === "FINE" ||
          sanctionData?.type?.type === "ADMINISTRATOR_FINE") &&
        sanctionData?.status?.fineStatus &&
        sanctionData?.status?.fineStatus !== "IMPOSED"
      ) || showAddModal.viewMode
    );
  };

  return (
    <>
      <ClosableModal
        onClose={() => {
          setShowAddModal({ viewMode: false, isShow: false });
        }}
        open={showAddModal.isShow}
        includeHeader={true}
        title={showAddModal.viewMode ? t("review") : t("edit")}
        width={700}
        disableBackdropClick={true}
      >
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"space-between"}
        >
          <Box display={"flex"}>
            <Grid container direction={"column"} spacing={2} padding={"15px"}>
              <Grid item>
                <Select
                  data={
                    sanctionTypes.map((item) => ({
                      label: item.name,
                      value: item.id ?? "",
                      type: item.type,
                    })) ?? []
                  }
                  value={sanctionData?.type?.id?.toString()}
                  label={t("type")}
                  size={"small"}
                  onChange={(val: string, data: any) => {
                    onChangeValue("type", { id: +val, type: data.type });
                  }}
                  disabled={showAddModal.viewMode}
                  data-testid={"type-select"}
                />
              </Grid>
              <Grid item>
                <TextField
                  label={t("document")}
                  value={sanctionData?.documentNumber}
                  onChange={(val: any) => onChangeValue("documentNumber", val)}
                  size={"small"}
                  isDisabled={showAddModal.viewMode}
                  fieldName={"document"}
                />
              </Grid>
              <Grid item>
                <DatePicker
                  value={sanctionData?.documentTime}
                  size={"small"}
                  label={t("documenttime")}
                  isDisabled={showAddModal.viewMode}
                  onChange={(value) => {
                    onChangeValue(
                      "documentTime",
                      value ? value.getTime().toString() : ""
                    );
                  }}
                  data-testid={"document-time"}
                />
              </Grid>
              <Grid item>
                <DatePicker
                  value={sanctionData?.deliveryDate}
                  size={"small"}
                  label={t("deliverydate")}
                  isDisabled={showAddModal.viewMode}
                  onChange={(value) => {
                    onChangeValue(
                      "deliveryDate",
                      value ? value.getTime().toString() : ""
                    );
                  }}
                  data-testid={"delivery-date"}
                />
              </Grid>
              <Grid item>
                <DatePicker
                  value={sanctionData?.paymentDate}
                  size={"small"}
                  label={t("paymentdate")}
                  isDisabled={showAddModal.viewMode}
                  onChange={(value) => {
                    onChangeValue(
                      "paymentDate",
                      value ? value.getTime().toString() : ""
                    );
                  }}
                  data-testid={"payment-date"}
                />
              </Grid>
              <Grid item>
                <NumberField
                  size={"default"}
                  label={t("duedate")}
                  value={sanctionData?.dueDate}
                  fieldName={"due-date-input"}
                  format={"#"}
                  pattern={/^(?:[1-9]\d*|0)?$/}
                  isDisabled={showAddModal.viewMode}
                  onChange={(val: any) => {
                    onChangeValue("dueDate", val);
                  }}
                />
              </Grid>
            </Grid>

            <Grid container direction={"column"} spacing={2} padding={"15px"}>
              <Grid item>
                <Select
                  data={generateStatusData()}
                  value={
                    sanctionData?.status?.fineStatus ||
                    sanctionData?.status?.type
                  }
                  label={t("status")}
                  size={"small"}
                  disabled={showAddModal.viewMode}
                  onChange={(val: any) => {
                    onChangeValue("status", {
                      ...sanctionData?.status,
                      type:
                        sanctionData?.type?.type === "FINE" ||
                        sanctionData?.type?.type === "ADMINISTRATOR_FINE"
                          ? null
                          : val,
                      fineStatus:
                        sanctionData?.type?.type === "FINE" ||
                        sanctionData?.type?.type === "ADMINISTRATOR_FINE"
                          ? val
                          : null,
                    });
                    getFineStatusTypeData(val);
                  }}
                  data-testid={"status-select"}
                />
              </Grid>
              <Grid item>
                <Select
                  data={fineStatusType.map((item) => ({
                    label: item.label ?? "",
                    value: item.value ?? "",
                    id: item.id,
                  }))}
                  label={t("substatus")}
                  size={"small"}
                  onChange={(val: any, data) => {
                    onChangeValue("status", {
                      ...sanctionData?.status,
                      fineSubstatusAmount: undefined,
                      fineSubstatus: data,
                    });
                  }}
                  value={getSubStatusValue()}
                  disabled={disableSubStatus()}
                  data-testid={"sub-status-select"}
                />
              </Grid>
              <Grid item>
                <TextField
                  type={"number"}
                  label={t("substatusvalue")}
                  value={sanctionData?.status?.fineSubstatusAmount?.toString()}
                  onChange={(val: any) => {
                    onChangeValue("status", {
                      ...sanctionData?.status,
                      fineSubstatusAmount: val,
                    });
                  }}
                  isDisabled={
                    !sanctionData?.status?.fineSubstatus?.hasInput ||
                    showAddModal.viewMode
                  }
                  size={"small"}
                  fieldName={"sub-status-value"}
                />
              </Grid>
              <Grid item>
                <Select
                  data={Inspectors.map((item) => ({
                    label: t(item.login),
                    value: item.login,
                  }))}
                  value={
                    isDisabledHandler("RECOMMENDATION")
                      ? ""
                      : sanctionData?.responsiblePerson
                  }
                  label={t("responsibleperson")}
                  size={"small"}
                  onChange={(val: any) => {
                    onChangeValue("responsiblePerson", val);
                  }}
                  disabled={isDisabledHandler("RECOMMENDATION")}
                  data-testid={"responsible-person-select"}
                />
              </Grid>
              <Grid item>
                <TextField
                  label={t("administratorname")}
                  value={
                    isDisabledHandler("ADMINISTRATOR_FINE")
                      ? ""
                      : sanctionData?.administratorName
                  }
                  onChange={(val: string) =>
                    onChangeValue("administratorName", val)
                  }
                  size={"small"}
                  isDisabled={
                    isDisabledHandler("ADMINISTRATOR_FINE") ||
                    showAddModal.viewMode
                  }
                  fieldName={"administrator-name"}
                />
              </Grid>
              <Grid item>
                <TextField
                  label={t("administratorid")}
                  value={
                    isDisabledHandler("ADMINISTRATOR_FINE")
                      ? ""
                      : sanctionData?.administratorIdNumber
                  }
                  onChange={(val: string) =>
                    onChangeValue("administratorIdNumber", val)
                  }
                  size={"small"}
                  isDisabled={
                    isDisabledHandler("ADMINISTRATOR_FINE") ||
                    showAddModal.viewMode
                  }
                  fieldName={"administrator-id"}
                />
              </Grid>
              <Grid item>
                <TextField
                  label={t("note")}
                  value={sanctionData?.status?.note}
                  size={"small"}
                  fieldName={"note"}
                  isError={false}
                  multiline={true}
                  isDisabled={showAddModal.viewMode}
                  rows={2}
                  onChange={(val: any) => {
                    onChangeValue("status", {
                      ...sanctionData?.status,
                      note: val,
                    });
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          <Box style={{ padding: "5px" }}>
            <EmsDocumentsGrid
              documents={documents}
              setDocuments={setDocuments}
              viewMode={showAddModal.viewMode}
              fileExportHandler={fileExportHandler}
            />
          </Box>

          <StyledFooter
            display={"flex"}
            justifyContent={"end"}
            alignItems={"center"}
          >
            <GhostBtn
              onClick={() => {
                setShowAddModal({ isShow: false, viewMode: false });
              }}
              style={{ marginRight: "10px" }}
              data-testid={"cancel-button"}
            >
              {t("cancel")}
            </GhostBtn>
            <PrimaryBtn
              disabled={disableSave()}
              onClick={() => {
                submitSanctionHandler();
                setShowAddModal({ isShow: false, viewMode: false });
              }}
              backgroundColor={"rgb(41, 98, 255)"}
              endIcon={
                <CheckIcon
                  sx={{
                    width: 16,
                    height: 14,
                    marginLeft: "5px",
                  }}
                />
              }
              data-testid={"save-button"}
            >
              {t("save")}
            </PrimaryBtn>
          </StyledFooter>
        </Box>
      </ClosableModal>
    </>
  );
};

export default EmsProfileSanctionModal;
