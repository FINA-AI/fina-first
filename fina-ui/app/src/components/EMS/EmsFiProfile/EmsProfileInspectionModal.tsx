import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ClosableModal from "../../common/Modal/ClosableModal";
import Box from "@mui/material/Box";
import { Grid } from "@mui/material";
import GhostBtn from "../../common/Button/GhostBtn";
import CheckIcon from "@mui/icons-material/Check";
import CustomAutoComplete from "../../common/Field/CustomAutoComplete";
import Select from "../../common/Field/Select";
import DatePicker from "../../common/Field/DatePicker";
import TextField from "../../common/Field/TextField";
import EmsDocumentsGrid from "../Common/EmsDocumentsGrid";
import EmsProfileInspectorGrid from "./EmsProfileInspector/EmsProfileInspectorGrid";
import { BASE_URL, getLanguage } from "../../../util/appUtil";
import { loadProfileInspectionDocument } from "../../../api/services/ems/EmsProfileInspectionService";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import EmsTagField from "../Common/EmsTagField";
import { FieldSize } from "../../../types/common.type";
import {
  EmsFiProfileInspectionType,
  InspectorDataType,
  ViolationType,
} from "../../../types/emsFiProfile.type";
import { FiType } from "../../../types/fi.type";
import { connect } from "react-redux";
import EmsProfileInspectionViolationGrid from "./EmsProfileInspector/EmsProfileInspectionViolationGrid";
import {
  EmsInspectionType,
  InspectionColumnData,
} from "../../../types/inspection.type";
import EmsProfileInspectionColumnFields from "./EmsProfileInspector/EmsProfileInspectionColumnFields";
import { styled } from "@mui/material/styles";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import { Config } from "../../../types/config.type";

interface EmsProfileInspectionModalProps {
  inspectionModal: {
    viewMode: boolean;
    isOpen: boolean;
    editMode: boolean;
  };
  setInspectionModal: React.Dispatch<React.SetStateAction<any>>;
  fis: FiType[];
  selectedInspectionRow: any;
  statusTypes: string[];
  saveProfileInspection: (
    data: EmsFiProfileInspectionType,
    payLoad: FormData | null
  ) => Promise<void>;
  config: Config;
  inspectionColumns: InspectionColumnData[] | null;
  inspectors: InspectorDataType[];
  inspectionTypes: EmsInspectionType[];
}

const StyledFooter = styled(Box)(({ theme }: any) => ({
  padding: 10,
  paddingRight: 20,
  ...theme.modalFooter,
}));

const StyledDatePickerWrapper = styled(Box)({
  display: "flex",
  margin: "16px 0px 16px 16px",
  gap: "5px",
});

const StyledInspectionPeriodWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "5px",
  width: "100%",
});

const EmsProfileInspectionModal: React.FC<EmsProfileInspectionModalProps> = ({
  inspectionModal,
  setInspectionModal,
  fis,
  selectedInspectionRow,
  statusTypes,
  saveProfileInspection,
  config,
  inspectionColumns,
  inspectors,
  inspectionTypes,
}) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const langCode = getLanguage();

  const [inspectionData] = useState(
    selectedInspectionRow
      ? { ...selectedInspectionRow }
      : {
          status: {
            type: "PLANNED",
          },
        }
  );
  let hasPermission = config.properties["ECM_ENABLED"];

  const [documents, setDocuments] = useState<any>([]);
  const [selectedOptions, setSelectedOptions] = useState<any>([]);
  const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(true);
  const [isAML, setIsAML] = useState<boolean>(false);
  const violationsRef = useRef<ViolationType[]>([]);
  const inspectionColumnsDataRef = useRef<any[]>([]);
  const selectedInspectorsRef = useRef<any[]>([]);
  const documentsQuantity = useRef();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedInspectionRow) {
      checkInspectionValid(selectedInspectionRow);
      setSelectedOptions(
        selectedInspectionRow?.types?.map((item: any) => ({
          id: item.id,
          name: item.names[langCode],
        }))
      );
    }
  }, [selectedInspectionRow]);

  useEffect(() => {
    if (inspectionColumns) {
      for (let i = 1; i <= inspectionColumns.length; i++) {
        let obj = {
          [`column${i}`]: selectedInspectionRow
            ? selectedInspectionRow[`column${i}`]
            : "",
        };
        inspectionColumnsDataRef.current.push(obj);
      }
    }
  }, []);

  useEffect(() => {
    if (config && config.properties) {
      setIsAML(config.properties["net.fina.ems.system.impl.name"] === "AML");
      if (hasPermission) {
        getDocuments();
      }
    }
  }, [config]);

  const checkInspectionValid = (data: any) => {
    setIsSaveDisabled(
      !(
        data.decreeDate &&
        data.decreeNumber &&
        (data?.fi || data.fiCode) &&
        (data?.fi?.id || data.fiId) &&
        data.types &&
        data.types.length > 0
      )
    );
  };

  const generateFieldInspectionTypes = () => {
    return inspectionTypes.map((item: any) => {
      return {
        id: item.id,
        name: item.names,
      };
    });
  };
  const getDocuments = () => {
    if (selectedInspectionRow) {
      loadProfileInspectionDocument(
        selectedInspectionRow.fiCode,
        selectedInspectionRow.id
      )
        .then((res) => {
          const resData = res.data;
          setDocuments(resData);
          documentsQuantity.current = resData.length;
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
        });
    }
  };

  const onSubmit = async (data: EmsFiProfileInspectionType) => {
    const violations: ViolationType[] = violationsRef.current
      ? violationsRef.current.filter((item) => item.violation)
      : [];

    const mergedObject: any = {};

    inspectionColumnsDataRef.current.forEach((item: any, index: number) => {
      const key = `column${index + 1}`;
      mergedObject[key] = Object.values(item)[0];
    });

    const submitData: EmsFiProfileInspectionType = {
      ...data,
      id: inspectionModal.editMode ? selectedInspectionRow.id : 0,
      inspectors: selectedInspectorsRef.current,
      types: inspectionData["types"],
      violations: violations,
      ...mergedObject,
    };

    if (documents.length) {
      const formData = new FormData();
      documents.forEach((file: any, index: number) => {
        if (!file.id) {
          formData.append(
            `filedata${index}`,
            file,
            encodeURIComponent(file.name)
          );
          formData.append("autoRename", "true");
        }
      });
      await saveProfileInspection(submitData, formData);
    } else {
      await saveProfileInspection(submitData, null);
    }
  };

  const onChangeValue = (key: string, value: any) => {
    inspectionData[key] = value;
    checkInspectionValid(inspectionData);
  };

  const fileExportHandler = (id: number) => {
    window.open(BASE_URL + `/rest/ems/v1/ecm/file/${id}/content`, "_blank");
  };

  const getSelectedFi = () => {
    if (selectedInspectionRow) {
      return {
        id: selectedInspectionRow.fiId,
        code: selectedInspectionRow.fiCode,
        name: selectedInspectionRow.fiName,
      };
    }
  };

  const getModalTitle = () => {
    let title;
    if (selectedInspectionRow && !inspectionModal.viewMode) {
      title = t("editinspection");
    } else if (inspectionModal.viewMode && selectedInspectionRow) {
      title = t("review");
    } else {
      title = t("newinspection");
    }
    return title;
  };

  const memoizedInspectorGrid = useMemo(
    () => (
      <EmsProfileInspectorGrid
        viewMode={inspectionModal.viewMode}
        inspectors={inspectors}
        selectedInspectionRow={selectedInspectionRow}
        selectedInspectorsRef={selectedInspectorsRef}
      />
    ),
    []
  );

  const memoViolations = useMemo(() => {
    return (
      <EmsProfileInspectionViolationGrid
        data={
          selectedInspectionRow && selectedInspectionRow.violations
            ? selectedInspectionRow.violations
            : []
        }
        violationsRef={violationsRef}
        isViewMode={inspectionModal.viewMode}
      />
    );
  }, [selectedInspectionRow?.violations]);

  const getFiDisplayFieldValue = (fi: FiType) => {
    let fiName = fi.name ? fi.name : "NONAME";
    return `${fi.code} - ${fiName}`;
  };

  return (
    <ClosableModal
      onClose={() => {
        setInspectionModal({ viewMode: false, isOpen: false });
      }}
      open={inspectionModal.isOpen}
      includeHeader={true}
      title={getModalTitle()}
      height={700}
      width={950}
      disableBackdropClick={true}
      loading={loading}
    >
      <Box
        display={"flex"}
        height={"100%"}
        flexDirection={"column"}
        justifyContent={"space-between"}
      >
        <Box display={"flex"} flex={1} height={"100%"} overflow={"auto"}>
          <Grid
            container
            direction={"column"}
            spacing={2}
            padding={"15px"}
            style={{ flexWrap: "nowrap" }}
          >
            <Grid item>
              <CustomAutoComplete
                label={t("selectfi")}
                data={fis}
                selectedItem={getSelectedFi()}
                onChange={(val: any) => onChangeValue("fi", val)}
                valueFieldName={"id"}
                displayFieldFunction={getFiDisplayFieldValue}
                size={FieldSize.SMALL}
                disabled={inspectionModal.viewMode}
                virtualized={true}
              />
            </Grid>

            <Grid item>
              <EmsTagField
                label={t("type")}
                data={generateFieldInspectionTypes()}
                selectedOptions={selectedOptions}
                valueField={"id"}
                onChange={(item: any) => {
                  onChangeValue("types", item);
                }}
                displayFieldFunction={(item) => {
                  return !item.name ? "NONAME" : item.name;
                }}
                size={FieldSize.SMALL}
                editable={false}
                disabled={inspectionModal.viewMode}
              />
            </Grid>

            <StyledDatePickerWrapper>
              <StyledInspectionPeriodWrapper>
                <DatePicker
                  value={inspectionData.inspectionPeriodStart}
                  size={"small"}
                  label={t("inspectionperiodstart")}
                  isDisabled={inspectionModal.viewMode}
                  onChange={(value) => {
                    onChangeValue(
                      "inspectionPeriodStart",
                      value ? value.getTime().toString() : ""
                    );
                  }}
                  data-testid={"inspection-period-start"}
                />
                <DatePicker
                  value={inspectionData.inspectedPeriodStart}
                  size={"small"}
                  label={t("inspectedperiodstart")}
                  isDisabled={inspectionModal.viewMode}
                  onChange={(value) => {
                    onChangeValue(
                      "inspectedPeriodStart",
                      value ? value.getTime().toString() : ""
                    );
                  }}
                  data-testid={"inspected-period-start"}
                />
              </StyledInspectionPeriodWrapper>

              <StyledInspectionPeriodWrapper>
                <DatePicker
                  value={inspectionData.inspectionPeriodEnd}
                  size={"small"}
                  label={t("inspectionperiodend")}
                  isDisabled={inspectionModal.viewMode}
                  onChange={(value) => {
                    onChangeValue(
                      "inspectionPeriodEnd",
                      value ? value.getTime().toString() : ""
                    );
                  }}
                  data-testid={"inspection-period-end"}
                />
                <DatePicker
                  value={inspectionData.inspectedPeriodEnd}
                  size={"small"}
                  label={t("inspectedperiodend")}
                  isDisabled={inspectionModal.viewMode}
                  onChange={(value) => {
                    onChangeValue(
                      "inspectedPeriodEnd",
                      value ? value.getTime().toString() : ""
                    );
                  }}
                  data-testid={"inspected-period-end"}
                />
              </StyledInspectionPeriodWrapper>
            </StyledDatePickerWrapper>

            <Box style={{ display: "flex", gap: "5px", paddingLeft: "16px" }}>
              <Box style={{ flex: 1 }}>
                <TextField
                  label={t("decreenumber")}
                  value={inspectionData?.decreeNumber}
                  onChange={(val: any) => onChangeValue("decreeNumber", val)}
                  size={"small"}
                  isDisabled={inspectionModal.viewMode}
                  fieldName={"decree-number"}
                />
              </Box>

              <Box style={{ flex: 1 }}>
                <DatePicker
                  value={inspectionData.decreeDate}
                  size={"small"}
                  label={t("decreedate")}
                  isDisabled={inspectionModal.viewMode}
                  onChange={(value) => {
                    onChangeValue(
                      "decreeDate",
                      value ? value.getTime().toString() : ""
                    );
                  }}
                  data-testid={"decree-date"}
                />
              </Box>
            </Box>

            <Box
              style={{
                display: "flex",
                gap: "5px",
                paddingLeft: "16px",
                paddingTop: "5px",
              }}
            >
              <Box style={{ flex: 1 }}>
                <TextField
                  label={t("reclamationletternumber")}
                  value={inspectionData?.reclamationLetterNumber}
                  onChange={(val: any) =>
                    onChangeValue("reclamationLetterNumber", val)
                  }
                  size={"small"}
                  isDisabled={inspectionModal.viewMode}
                  fieldName={"reclamation-letter-number"}
                />
              </Box>

              <Box style={{ flex: 1 }}>
                <DatePicker
                  value={inspectionData.reclamationLetterDate}
                  size={"small"}
                  label={t("reclamationletterdate")}
                  isDisabled={inspectionModal.viewMode}
                  onChange={(value) => {
                    onChangeValue(
                      "reclamationLetterDate",
                      value ? value.getTime().toString() : ""
                    );
                  }}
                  data-testid={"reclamation-letter-date"}
                />
              </Box>
            </Box>

            <Grid item>
              <Select
                data={statusTypes.map((item) => ({
                  label: t(item),
                  value: item,
                }))}
                value={
                  selectedInspectionRow && selectedInspectionRow.status
                    ? selectedInspectionRow?.status?.type
                    : statusTypes[0]
                }
                label={t("status")}
                size={"small"}
                onChange={(val: any) => {
                  onChangeValue("status", {
                    ...inspectionData?.status,
                    type: val,
                  });
                }}
                disabled={inspectionModal.viewMode}
                data-testid={"status-select"}
              />
            </Grid>

            <Grid item>
              <TextField
                label={t("note")}
                value={
                  selectedInspectionRow ? inspectionData?.status?.note : null
                }
                size={"small"}
                fieldName={"note"}
                isError={false}
                multiline={true}
                isDisabled={inspectionModal.viewMode}
                rows={3}
                onChange={(val: any) => {
                  onChangeValue("status", {
                    ...inspectionData?.status,
                    note: val,
                  });
                }}
              />
            </Grid>
            {inspectionColumns && inspectionColumns.length > 0 && (
              <Grid item style={{ paddingTop: "16px" }}>
                <EmsProfileInspectionColumnFields
                  inspectionColumns={inspectionColumns}
                  inspectionColumnsDataRef={inspectionColumnsDataRef}
                  isViewMode={inspectionModal.viewMode}
                />
              </Grid>
            )}
          </Grid>

          <Grid
            container
            direction={"column"}
            spacing={2}
            padding={"15px"}
            style={{ flexWrap: "nowrap" }}
          >
            {!isAML ? (
              memoViolations
            ) : (
              <>
                <Grid item>
                  <TextField
                    label={t("subject")}
                    value={inspectionData?.inspectionSubject}
                    size={"small"}
                    fieldName={"subject"}
                    isError={false}
                    multiline={true}
                    isDisabled={inspectionModal.viewMode}
                    rows={2}
                    onChange={(val: any) => {
                      onChangeValue("inspectionSubject", val);
                    }}
                  />
                </Grid>

                <Grid item>
                  <TextField
                    label={t("recommendation")}
                    value={inspectionData?.recommendation}
                    size={"small"}
                    fieldName={"recommendation"}
                    isError={false}
                    multiline={true}
                    isDisabled={inspectionModal.viewMode}
                    rows={2}
                    onChange={(val: any) => {
                      onChangeValue("recommendation", val);
                    }}
                  />
                </Grid>
              </>
            )}

            <Grid item height={"100%"}>
              {memoizedInspectorGrid}
            </Grid>
            <Grid
              item
              sx={{ paddingLeft: "16px", paddingTop: "16px" }}
              height={"150px"}
            >
              <EmsDocumentsGrid
                documents={documents}
                setDocuments={setDocuments}
                viewMode={inspectionModal.viewMode}
                fileExportHandler={fileExportHandler}
              />
            </Grid>
          </Grid>
        </Box>

        <StyledFooter
          display={"flex"}
          justifyContent={"end"}
          alignItems={"center"}
          flex={0}
        >
          <GhostBtn
            onClick={() => {
              setInspectionModal({ isOpen: false, viewMode: false });
            }}
            style={{ marginRight: "10px" }}
            data-testid={"cancel-button"}
          >
            {t("cancel")}
          </GhostBtn>
          {!inspectionModal.viewMode && (
            <PrimaryBtn
              onClick={async () => {
                setLoading(true);
                await onSubmit(inspectionData);
                setLoading(false);
                setInspectionModal({ isOpen: false, viewMode: false });
              }}
              backgroundColor={"rgb(41, 98, 255)"}
              disabled={isSaveDisabled}
              endIcon={
                <CheckIcon sx={{ width: 16, height: 14, marginLeft: "5px" }} />
              }
              data-testid={"save-button"}
            >
              {t("save")}
            </PrimaryBtn>
          )}
        </StyledFooter>
      </Box>
    </ClosableModal>
  );
};

const mapStateToProps = (state: any) => ({
  config: state.get("config").config,
});

export default connect(mapStateToProps)(EmsProfileInspectionModal);
