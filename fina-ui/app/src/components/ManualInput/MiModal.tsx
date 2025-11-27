import React, { useEffect, useState } from "react";
import manualInputProcess from "./process/manualInputProcess";
import numeral from "numeral";
import { Box } from "@mui/system";
import { loadMiInfo } from "../../api/services/manualInputService";
import ClosableModal from "../common/Modal/ClosableModal";
import { getFormattedDateValue } from "../../util/appUtil";
import GhostBtn from "../common/Button/GhostBtn";
import { useTranslation } from "react-i18next";
import PrimaryBtn from "../common/Button/PrimaryBtn";
import SaveIcon from "@mui/icons-material/Save";
import { DialogActions, IconButton } from "@mui/material";
import Badge from "@mui/material/Badge";
import MiNotePopover from "./MiNotePopover";
import EventNoteIcon from "@mui/icons-material/EventNote";
import Tooltip from "../common/Tooltip/Tooltip";
import ManualInputTable from "./table/ManualInputTable";
import MiSkeleton from "./MiSkeleton";
import { connect } from "react-redux";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { styled } from "@mui/material/styles";
import { UIEventType } from "../../types/common.type";
import { MiData, MiProcess, MiTable } from "../../types/manualInput.type";
import { Return } from "../../types/return.type";
import { Config } from "../../types/config.type";
import { ReturnStatus } from "../../types/returnManager.type";

interface MiModalProps {
  selectedReturn: Return;
  config: Config;
  setMiModalOpen: (state: { open: boolean; canAmend: boolean }) => void;
  isSidebarOpen?: boolean;
  canAmend: boolean;

  saveAndProcessHandler(
    tables: MiTable[],
    returnId: number,
    versionId: number,
    noteValue: string,
    parentRowId: number
  ): Promise<Boolean>;
}

const StyledFooter = styled(DialogActions)(({ theme }) => ({
  ...(theme as any).modalFooter,
  overflow: "hidden",
  padding: "8px 16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "end",
}));

const StyledManualInputTableWrapper = styled(Box)(
  ({ theme }: { theme: any }) => ({
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    color: theme.palette.textColor,
    fontWeight: 500,
    fontSize: "12px",
    lineHeight: "20px",
    background: theme.palette.paperBackground,
    overflow: "auto",
    "&::-webkit-scrollbar-thumb": {
      background: "#8695B1",
    },
    "&::-webkit-scrollbar": {
      backgroundColor: "#EAEBF0",
      width: "0.7em",
      height: "0.7em",
    },
  })
);

const StyledClosableModal = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  width: "100%",
  height: "100%",
});

const MiModal: React.FC<MiModalProps> = (props) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();

  const {
    selectedReturn,
    config,
    setMiModalOpen,
    saveAndProcessHandler,
    isSidebarOpen,
    canAmend,
  } = props;
  const [miData, setMiData] = useState<MiData>({} as MiData);
  const [tables, setTables] = useState<MiTable[]>([]);
  const [miProcess, setMiProcess] = useState<MiProcess>({} as MiProcess);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [noteValue, setNoteValue] = useState("");
  const [isLoading, setIsLoading] = useState({ skeleton: true, mask: false });

  const handleClick = (event: UIEventType) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    loadMiInfo(selectedReturn.id, selectedReturn.versionId)
      .then((resp) => {
        const miInfo: MiData = resp.data;
        setMiData(miInfo);
        setTables(miInfo.tables);

        //filter DEFAULT Comparisons
        if (miInfo.comparisons) {
          miInfo.comparisons = miInfo.comparisons.filter(
            (c) => c.processStage === "DEFAULT"
          );
        }
        setMiProcess(
          manualInputProcess(
            config.numberFormat,
            config.dateFormat,
            miInfo,
            getFloatValue,
            setTables
          )
        );
        setIsLoading({ ...isLoading, skeleton: false });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
        setIsLoading({ ...isLoading, skeleton: false });
      });
  }, [selectedReturn.id]);

  const onSaveClick = async () => {
    setIsLoading({ ...isLoading, mask: true });
    const success = await saveAndProcessHandler(
      tables,
      miData.returnId,
      miData.versionId,
      noteValue,
      selectedReturn.parentRowId
    );

    if (success) {
      setMiModalOpen({ open: false, canAmend: false });
    }
    setIsLoading({ ...isLoading, mask: false });
  };

  const getFloatValue = (itemValue: string) => {
    if (itemValue && config && config.numberFormat) {
      const numberFormat = config.numberFormat;
      const formattedValue = numeral(Number(itemValue)).format(numberFormat);
      return numeral(formattedValue).value();
    }
    return itemValue;
  };

  const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null);

  const getTableWidth = (tables: MiTable[]) => {
    let columns = 0;
    tables.map((table) => {
      let columnNumber = table.rows[0].rowItems.length;
      if (table.type === "VCT") {
        columnNumber += 1;
      }

      if (columnNumber > columns) {
        columns = columnNumber;
      }
    });

    return columns * 300;
  };

  const calculatedTableWidth = getTableWidth(tables);

  const getTitle = () => {
    const returnCode = selectedReturn.definitionCode;
    const fiCode = selectedReturn.fiCode;
    const toDate = getFormattedDateValue(selectedReturn.toDate);
    const returnTypeCode = selectedReturn.returnTypeCode;
    const versionCode = selectedReturn.versionCode;
    const periodTypeCode = selectedReturn.periodTypeCode;

    return `${returnCode} - ${fiCode} ${toDate} ${returnTypeCode} ${versionCode} ${periodTypeCode}`;
  };

  function isSaveAndProcessDisabled() {
    return (
      isLoading.mask ||
      isLoading.skeleton ||
      selectedReturn.status === ReturnStatus.STATUS_ACCEPTED
    );
  }

  return (
    <>
      <ClosableModal
        disableBackdropClick={true}
        onClose={() => setMiModalOpen({ open: false, canAmend: false })}
        open={true}
        title={getTitle()}
        width={isSidebarOpen ? "70%" : "90%"}
        height={"80%"}
        loading={isLoading.mask}
      >
        <StyledClosableModal>
          <StyledManualInputTableWrapper ref={setScrollElement}>
            {isLoading.skeleton ? (
              <MiSkeleton />
            ) : (
              <div>
                {tables.map((table) => (
                  <ManualInputTable
                    key={`${table.description}`}
                    tableInfo={table}
                    miProcess={miProcess}
                    currentReturn={selectedReturn}
                    numberFormat={config.numberFormat}
                    dateFormat={config.dateFormat}
                    dateTimeFormat={config.dateTimeFormat}
                    tables={tables}
                    setTables={setTables}
                    setIsLoadMask={(loading) => {
                      setIsLoading((prev) => ({ ...prev, mask: loading }));
                    }}
                    scrollElement={scrollElement}
                    calculatedTableWidth={calculatedTableWidth}
                    setIsLoading={setIsLoading}
                  />
                ))}
              </div>
            )}
          </StyledManualInputTableWrapper>

          <StyledFooter>
            {canAmend && (
              <>
                <Tooltip title={t("note")}>
                  <IconButton
                    onClick={handleClick}
                    disabled={isLoading.mask}
                    style={{ background: "none", border: "none" }}
                  >
                    {noteValue ? (
                      <Badge color="secondary" variant="dot">
                        <EventNoteIcon />
                      </Badge>
                    ) : (
                      <EventNoteIcon />
                    )}
                  </IconButton>
                </Tooltip>

                <PrimaryBtn
                  onClick={onSaveClick}
                  style={{ marginRight: "10px" }}
                  disabled={isSaveAndProcessDisabled()}
                  startIcon={<SaveIcon sx={{ color: "#FFFFFF" }} />}
                >
                  <span style={{ marginTop: "2px" }}>
                    {t("saveandprocess")}
                  </span>
                </PrimaryBtn>
              </>
            )}

            <GhostBtn
              onClick={() => setMiModalOpen({ open: false, canAmend: false })}
              disabled={isLoading.mask}
            >
              {t("close")}
            </GhostBtn>
          </StyledFooter>
        </StyledClosableModal>
      </ClosableModal>
      <MiNotePopover
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        noteValue={noteValue}
        setNoteValue={setNoteValue}
      />
    </>
  );
};

const mapStateToProps = (state: any) => ({
  isSidebarOpen: state.getIn(["openSidebar", "isOpen"]),
});

const mapDispatchToProps = () => ({});
export default connect(mapStateToProps, mapDispatchToProps)(MiModal);
