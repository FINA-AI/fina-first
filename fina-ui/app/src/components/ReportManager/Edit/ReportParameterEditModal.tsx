import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
} from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { styled, Theme } from "@mui/material/styles";
import { loadParameterData } from "../../../api/services/reportService";
import { StoredReportGridData } from "../../../types/report.type";
import ReportGenerationWizardMovementContainer from "../Generate/ReportGenerationWizardMovementContainer";
import { Parameter } from "../../../types/reportGeneration.type";
import ReportEditDataChooser from "./ReportEditDataChooser";
import ReportEditModalToolbar from "./ReportEditModalToolbar";
import {
  configureUpDownActions,
  constructParameterValues,
  getDestinationData,
  getSourceData,
  loadReportParameterData,
  onDataSequenceChange,
} from "./ReportParameterEditHelper";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import { useTranslation } from "react-i18next";
import { validate } from "../../../containers/ReportManager/Util/ReportMarameterChooserValidator";
import { WarningInfo } from "../Generate/ReportGenerationWizard";
import { FiTree } from "../../../types/fiTree.type";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import { ReportParameterType } from "../Generate/ParameterTypeNames";

interface ReportParameterEditModalProps {
  open: boolean;
  handleClose: () => void;
  selectedItem?: StoredReportGridData;
  reportId: number;
  updateParameter: (
    parameter: Parameter,
    paramName: string,
    reportId: number,
    isIterator: boolean
  ) => boolean;
}

interface ReportParameterData {
  sourceSelections: any[];
  destinationSelections: any[];
}

interface ActionButtonsState {
  leftEnabled: boolean;
  rightEnabled: boolean;
  upEnabled: boolean;
  downEnabled: boolean;
}

const StyledToolbar = styled(Box)(({ theme }: { theme: any }) => ({
  paddingRight: "10px",
  paddingLeft: "10px",
  borderBottom: theme.palette.borderColor,
}));

const StyledDialogActions = styled(DialogActions)(
  ({ theme }: { theme: Theme }) => ({
    boxShadow: "3px -20px 8px -4px #BABABA1A",
    zIndex: theme.zIndex.drawer + 1,
  })
);

const StyledMessageBox = styled(Box)(({ theme }: any) => ({
  paddingLeft: 15,
  color: theme.palette.primary.main,
}));

const ReportParameterEditModal: React.FC<ReportParameterEditModalProps> = ({
  open,
  handleClose,
  selectedItem,
  reportId,
  updateParameter,
}) => {
  const [parameterData, setParameterData] = React.useState<Parameter>();
  const [loading, setLoading] = React.useState(false);
  const [sourceData, setSourceData] = React.useState<any>();
  const [destinationData, setDestinationData] = React.useState<any>([]);
  const [parameterName, setParameterName] = React.useState<string>(
    selectedItem?.name || ""
  );
  const [actionButtonsState, setActionButtonsState] =
    React.useState<ActionButtonsState>({
      leftEnabled: false,
      rightEnabled: false,
      upEnabled: false,
      downEnabled: false,
    });
  const [warningInfo, setWarningInfo] = useState<WarningInfo>();
  const currentData = useRef<ReportParameterData>({
    sourceSelections: [],
    destinationSelections: [],
  });

  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    if (!selectedItem) {
      return;
    }

    setLoading(true);

    const resp = await loadParameterData(
      reportId,
      encodeURIComponent(selectedItem.name),
      selectedItem?.dimensionType === "iterator"
    );

    const param = resp.data;
    await initPredefinedData(param);

    setParameterData(param);
    setLoading(false);
  };

  const initPredefinedData = async (param: Parameter) => {
    const data = await loadReportParameterData(param);
    setSourceData(data.source);
    setDestinationData(data.destination);
    currentData.current = {
      sourceSelections: [],
      destinationSelections: [...data.destination],
    };
  };

  const validateRestrictions = (selectedParameter: Parameter) => {
    if (selectedParameter.name.includes("$")) {
      let selectedRows = currentData.current.sourceSelections;
      switch (selectedParameter.type) {
        case ReportParameterType.BANK:
          const parentChildMap = new Map<FiTree, any[]>();
          for (const row of currentData.current.sourceSelections) {
            const parent = sourceData.find(
              (item: any) => item.parent.id === row.parentId
            ).parent;
            const children = parentChildMap.get(parent);
            if (children) {
              children.push(row);
            } else {
              parentChildMap.set(parent, [row]);
            }
          }
          selectedRows = Array.from(parentChildMap.entries()).map(
            ([key, value]) => ({ parent: key, fis: value })
          );
          break;
      }

      const parameterValidation = validate(
        selectedParameter as Parameter,
        selectedRows,
        destinationData
      );

      if (parameterValidation.isValid) {
        setWarningInfo({
          visibility: false,
          title: "",
        });
        return true;
      } else {
        setWarningInfo({
          visibility: true,
          title: parameterValidation.message ? parameterValidation.message : "",
        });
      }
      return false;
    }

    return true;
  };

  const updateActionButtonsState = (key: string, value: boolean) => {
    setActionButtonsState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const onDataMoveRight = () => {
    const isValid = validateRestrictions(parameterData as Parameter);
    if (parameterData && isValid) {
      const result = getDestinationData(
        parameterData,
        destinationData,
        currentData.current.sourceSelections,
        sourceData
      );

      setDestinationData([...result]);
    }
  };

  const onDataMoveLeft = () => {
    if (parameterData) {
      setDestinationData(
        getSourceData(
          parameterData,
          destinationData,
          currentData.current.destinationSelections
        )
      );
      currentData.current.destinationSelections = [];
      updateActionButtonsState("leftEnabled", false);
      updateActionButtonsState("upEnabled", false);
      updateActionButtonsState("downEnabled", false);
    }
  };

  const onSourceSelectionChange = (selectedItems?: any[]) => {
    currentData.current.sourceSelections = selectedItems ? selectedItems : [];
    updateActionButtonsState("rightEnabled", !!selectedItems?.length);
  };

  const onDestinationSelectionChange = (selectedItems?: any[]) => {
    currentData.current.destinationSelections = selectedItems
      ? selectedItems
      : [];
    updateActionButtonsState("leftEnabled", !!selectedItems?.length);
    handleUpDownActionsEnable(selectedItems);
  };

  const sequenceChange = (up: boolean) => {
    const selectedItems = currentData.current.destinationSelections;

    const result = onDataSequenceChange(
      up,
      destinationData,
      selectedItems[0],
      parameterData as Parameter
    );

    setDestinationData([...result]);
    handleUpDownActionsEnable(selectedItems);
  };

  const handleUpDownActionsEnable = (selectedItems?: any) => {
    configureUpDownActions(
      selectedItems,
      parameterData as Parameter,
      destinationData,
      updateActionButtonsState
    );
  };

  const onSave = async () => {
    if (parameterData) {
      setLoading(true);
      const values = constructParameterValues(parameterData, destinationData);

      const body: any = {
        name: parameterName,
        type: parameterData?.type,
        values: values,
      };

      try {
        const resp = await updateParameter(
          body as Parameter,
          parameterData.name,
          reportId,
          selectedItem?.dimensionType === "iterator"
        );
        if (resp) {
          handleClose();
        } else {
          openErrorWindow("Error Updating Parameter", t("error"), true);
        }
      } catch (e) {
        openErrorWindow(e, t("error"), true);
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
  };

  const MemoizedToolbar = useMemo(() => {
    if (parameterData) {
      return (
        <ReportEditModalToolbar
          parameterData={parameterData}
          handleClose={handleClose}
          onParamaterNameChange={(value) => {
            setParameterName(value);
          }}
        />
      );
    }
  }, [selectedItem, reportId, parameterData, parameterName]);

  return (
    <Dialog
      disableEscapeKeyDown={true}
      onClose={(event, reason) => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          handleClose();
        }
      }}
      open={open}
      keepMounted
      aria-describedby="report parameter edit modal"
      PaperProps={{
        sx: {
          minWidth: "1100px",
          height: "750px",
        },
      }}
      data-testid={"report-parameter-edit-modal"}
    >
      {loading ? (
        <Box
          width={"100%"}
          height={"100%"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <CircularProgress />
          <StyledMessageBox>{t("loading")}</StyledMessageBox>
        </Box>
      ) : (
        <>
          <StyledToolbar>{MemoizedToolbar}</StyledToolbar>
          <DialogContent
            style={{
              height: "100%",
              padding: "0px",
            }}
          >
            <Box display={"flex"} height={"100%"} flexDirection={"column"}>
              <Grid
                container
                flexDirection={"row"}
                width={"100%"}
                height={"100%"}
              >
                <Grid
                  style={{
                    visibility: "visible",
                  }}
                  item
                  flex={1}
                  height={"100%"}
                  overflow={"auto"}
                >
                  <Box aria-label={"left container"} flex={1} height={"100%"}>
                    <Box height={"100%"} width={"100%"}>
                      {parameterData && (
                        <ReportEditDataChooser
                          parameter={parameterData}
                          data={sourceData}
                          // checkedRows={parameterData.values}
                          isDestination={false}
                          onSelect={(selectItems?: any[]) => {
                            onSourceSelectionChange(selectItems);
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </Grid>
                <Grid item width={"48px"} height={"100%"}>
                  <ReportGenerationWizardMovementContainer
                    arrowDownActive={actionButtonsState.downEnabled}
                    arrowLeftActive={actionButtonsState.leftEnabled}
                    arrowRightActive={actionButtonsState.rightEnabled}
                    arrowUpActive={actionButtonsState.upEnabled}
                    onVerticalMove={sequenceChange}
                    onHorizontalMove={(moveRight) => {
                      moveRight ? onDataMoveRight() : onDataMoveLeft();
                    }}
                    warningIconInfo={warningInfo}
                  />
                </Grid>
                <Grid item flex={1} height={"100%"} overflow={"auto"}>
                  {parameterData && destinationData && (
                    <ReportEditDataChooser
                      parameter={parameterData}
                      data={destinationData}
                      isDestination={true}
                      checkedRows={
                        currentData?.current?.destinationSelections ?? []
                      }
                      onSelect={(selectItems?: any[]) => {
                        onDestinationSelectionChange(selectItems);
                      }}
                    />
                  )}
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <StyledDialogActions>
            <PrimaryBtn onClick={onSave}>{t("save")}</PrimaryBtn>
          </StyledDialogActions>
        </>
      )}
    </Dialog>
  );
};

export default ReportParameterEditModal;
