import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Split from "react-split";
import { useTranslation } from "react-i18next";
import RTPrintPeriodChooser from "./RTPrintPeriodChooser";
import PrimaryBtn from "../../../common/Button/PrimaryBtn";
import DescriptionIcon from "@mui/icons-material/Description";
import { BASE_URL } from "../../../../util/appUtil";
import ReturnTypePrintModalFi from "./RTPrintFiChooser";
import ReturnTypePrintModalRDefinition from "./RTPrintDefinitionChooser";
import RTPrintVersionChooser from "./RTPrintVersionChooser";
import { returnVersionDataType } from "../../../../types/returnVersion.type";
import {
  ReturnDefinitionType,
  ReturnReportPrintObjectType,
  ReturnType,
} from "../../../../types/returnDefinition.type";
import { loadAll } from "../../../../api/services/fi/fiStructureService";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import { styled } from "@mui/material/styles";
import { FiType } from "../../../../types/fi.type";
import { loadFiTreeData } from "../../../../api/services/ems/emsFisService";

const StyledContainer = styled(Box)({
  height: "100%",
  display: "flex",
  flexDirection: "column",
});

const StyledBackdrop = styled(Backdrop)(({ theme }: any) => ({
  zIndex: theme.zIndex.modal + 1,
  color: theme.palette.primary.main,
  position: "absolute",
  "&.MuiBackdrop-root": {
    backgroundColor: "rgb(128,128,128,0.3)",
  },
}));

const StyledBody = styled(Split)({
  display: "flex",
  padding: "12px 16px 12px 12px",
  height: 482,
  overflow: "hidden",
  boxSizing: "border-box",
  width: "100%",
  "& .gutter": {
    width: "2px !important",
    cursor: "col-resize",
  },
});
const StyledGridContainer = styled(Box)(({ theme }: any) => ({
  display: "flex",
  flexDirection: "column",
  borderRadius: 4,
  background: theme.palette.mode === "dark" ? "#253143" : "#F9F9F9",
  marginLeft: 8,
  overflow: "hidden",
  boxSizing: "border-box",
  height: "100%",
  width: "100%",
  border: theme.palette.borderColor,
  boxShadow:
    theme.palette.mode === "dark" ? "0px 0px 10px 4px rgb(21 23 27 / 90%)" : "",
}));

const StyledGridTitle = styled(Typography)({
  fontWeight: 600,
  fontSize: 12,
  lineHeight: "18px",
});

const StyledGridHeader = styled(Box)(({ theme }: any) => ({
  borderBottom: theme.palette.borderColor,
  width: "100%",
  height: 38,
  boxSizing: "border-box",
  display: "flex",
  alignItems: "center",
  padding: 12,
}));

const StyledFooter = styled(Box)(({ theme }: any) => ({
  ...theme.modalFooter,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "8px 16px",
  boxSizing: "border-box",
}));

interface ReturnTypePrintFormProps {
  returnVersions: returnVersionDataType[];
  returnDefinitions: ReturnDefinitionType[];
  returnTypes: ReturnType[];
}

const ReturnTypePrintForm: React.FC<ReturnTypePrintFormProps> = ({
  returnVersions = [],
  returnDefinitions = [],
  returnTypes = [],
}) => {
  const { t } = useTranslation();

  const [selectedFiRadio, setSelectedFiRadio] = useState<string>("");
  const [selectedReturnRadio, setSelectedReturnRadio] = useState<string>("");
  const [fiGroupData, setFiGroupData] = useState([]);
  const [fis, setFis] = useState<FiType[]>([]);
  const [printObject, setPrintObject] = useState<ReturnReportPrintObjectType>({
    versionId: 0,
    definition: 0,
    fiIds: 0,
    returnTypeIds: [],
    fiGroupId: 0,
    fiTypeIds: [],
    periodId: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const { openErrorWindow } = useErrorWindow();

  useEffect(() => {
    loadFiGroupData();
    loadFis();
  }, []);

  const loadFis = () => {
    loadFiTreeData().then((res) => {
      setFis(res.data);
    });
  };

  const loadFiGroupData = async () => {
    setLoading(true);
    try {
      await loadAll()
        .then((resp) => {
          setFiGroupData(resp.data);
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
        });
    } finally {
      setLoading(false);
    }
  };

  const onChange = (
    key: keyof ReturnReportPrintObjectType,
    value: number | number[] | undefined
  ) => {
    setPrintObject((prevState) => {
      const newState = { ...prevState };

      if (value !== undefined) {
        if (key === "returnTypeIds" || key === "fiTypeIds") {
          newState[key] = Array.isArray(value) ? value : [value];
        } else {
          newState[key] = value as number;
        }
      } else {
        delete newState[key];
      }

      const fisKeys: (keyof ReturnReportPrintObjectType)[] = [
        "fiIds",
        "fiGroupId",
        "fiTypeIds",
      ];

      if (fisKeys.includes(key)) {
        fisKeys.forEach((fisKey) => {
          if (fisKey !== key && newState[fisKey] !== undefined) {
            delete newState[fisKey];
          }
        });
      }

      const returnsKeys: (keyof ReturnReportPrintObjectType)[] = [
        "definition",
        "returnTypeIds",
      ];

      if (returnsKeys.includes(key)) {
        returnsKeys.forEach((returnsKey) => {
          if (returnsKey !== key && newState[returnsKey] !== undefined) {
            delete newState[returnsKey];
          }
        });
      }

      return newState;
    });
  };

  const onClear = (key: keyof ReturnReportPrintObjectType) => {
    const { [key]: _, ...newPrintObject } = printObject;
    setPrintObject(newPrintObject);
  };

  const handleFiRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedFiRadio(value);
    setPrintObject((prevState) => {
      const newState = { ...prevState };
      delete newState.fiIds;
      delete newState.fiGroupId;
      delete newState.fiTypeIds;
      return newState;
    });
  };

  const handleReturnRadioChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedReturnRadio(event.target.value);
    setPrintObject((prevState) => {
      const newState = { ...prevState };
      delete newState.definition;
      delete newState.returnTypeIds;
      return newState;
    });
  };

  const isPrintDisabled = (): boolean => {
    const hasFiSelection =
      printObject.fiIds || printObject.fiGroupId || printObject.fiTypeIds;
    const hasReturnSelection =
      printObject.definition || printObject.returnTypeIds;
    const hasPeriodId = !!printObject.periodId;
    const hasRVersionId = !!printObject.versionId;

    return !(
      hasFiSelection &&
      hasReturnSelection &&
      hasPeriodId &&
      hasRVersionId
    );
  };

  const buildQueryString = (params: Record<string, any>): string => {
    const query = new URLSearchParams();

    Object.keys(params).forEach((key) => {
      if (
        params[key] !== undefined &&
        params[key] !== null &&
        params[key] !== ""
      ) {
        if (Array.isArray(params[key])) {
          params[key].forEach((value: string | number) =>
            query.append(key, value.toString())
          );
        } else {
          query.append(key, params[key].toString());
        }
      }
    });

    return query.toString();
  };

  const printReturnTypesReport = () => {
    const {
      fiIds,
      fiGroupId,
      definition,
      returnTypeIds,
      periodId,
      versionId,
      fiTypeIds,
    } = printObject;

    const queryParams = {
      returnIds: definition ? [definition] : [],
      fiIds: fiIds ? [fiIds] : [],
      versionId: versionId,
      periodId: periodId,
      fiTypeIds: selectedFiRadio === "fiType" ? fiTypeIds : null,
      fiGroupId:
        selectedFiRadio === "fiGroup" ? (fiGroupId ? fiGroupId : null) : null,
      returnTypeIds: returnTypeIds ? returnTypeIds : null,
    };

    const queryString = buildQueryString(queryParams);
    window.open(
      BASE_URL + `/rest/ui/v1/returns/rStatus/print?${queryString}`,
      "_blank"
    );
  };

  return (
    <>
      <StyledBackdrop open={loading}>
        <CircularProgress color={"inherit"} />
      </StyledBackdrop>

      <StyledContainer flex={1}>
        <StyledBody>
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              marginRight: 10,
              minWidth: 450,
            }}
          >
            <StyledGridContainer flex={1}>
              <StyledGridHeader>
                <StyledGridTitle>{t("fi")}</StyledGridTitle>
              </StyledGridHeader>
              <StyledGridContainer
                style={{ border: "none", boxShadow: "none" }}
              >
                <ReturnTypePrintModalFi
                  onChange={onChange}
                  onClear={onClear}
                  handleFiRadioChange={handleFiRadioChange}
                  selectedFiRadio={selectedFiRadio}
                  fiGroupData={fiGroupData}
                  fis={fis}
                />
              </StyledGridContainer>
            </StyledGridContainer>

            <StyledGridContainer flex={1} style={{ marginTop: 10 }}>
              <StyledGridHeader>
                <StyledGridTitle>{t("returns")}</StyledGridTitle>
              </StyledGridHeader>
              <StyledGridContainer
                style={{ border: "none", boxShadow: "none" }}
              >
                <ReturnTypePrintModalRDefinition
                  onChange={onChange}
                  onClear={onClear}
                  selectedReturnRadio={selectedReturnRadio}
                  handleReturnRadioChange={handleReturnRadioChange}
                  returnDefinitions={returnDefinitions}
                  returnTypes={returnTypes}
                />
              </StyledGridContainer>
            </StyledGridContainer>
          </Box>

          <StyledGridContainer
            style={{ minWidth: 500 }}
            data-testid={"period-chooser-container"}
          >
            <StyledGridHeader>
              <StyledGridTitle>{t("periods")}</StyledGridTitle>
            </StyledGridHeader>
            <RTPrintPeriodChooser
              onChange={(val) => onChange("periodId", val[0])}
            />
          </StyledGridContainer>
        </StyledBody>

        <StyledFooter>
          <RTPrintVersionChooser
            onChange={onChange}
            selectedVersionId={printObject?.versionId}
            returnVersions={returnVersions}
          />
          <PrimaryBtn
            onClick={() => printReturnTypesReport()}
            disabled={isPrintDisabled()}
            endIcon={<DescriptionIcon />}
            data-testid={"print-button"}
          >
            {t("print")}
          </PrimaryBtn>
        </StyledFooter>
      </StyledContainer>
    </>
  );
};

export default React.memo(ReturnTypePrintForm);
