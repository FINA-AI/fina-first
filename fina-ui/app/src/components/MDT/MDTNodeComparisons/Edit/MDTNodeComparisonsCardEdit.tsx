import { Box, Divider, Grid, IconButton, Typography } from "@mui/material";
import TextField from "../../../common/Field/TextField";
import { useTranslation } from "react-i18next";
import GhostBtn from "../../../common/Button/GhostBtn";
import CheckIcon from "@mui/icons-material/Check";
import React, { useRef, useState } from "react";
import CodeArea from "../../CodeArea/CodeArea";
import AddIcon from "@mui/icons-material/Add";
import Popover from "@mui/material/Popover";
import ErrorTemplatePopover from "./ErrorTemplatePopover";
import InputBase from "@mui/material/InputBase";
import ConditionsPopover from "./ConditionsPopover";
import MTDComparisonConditions from "../MTDComparisonConditions";
import MDTChooser from "../../MDTChooser/MDTChooser";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import Select from "../../../common/Field/Select";
import { styled } from "@mui/system";
import { UIEventType } from "../../../../types/common.type";
import { MDTComparisonData, MdtNode } from "../../../../types/mdt.type";

interface MDTNodeComparisonsCardEditProps {
  setIsOpen: (isOpen: boolean) => void;
  onSaveFunction: (data: MDTComparisonData) => void | { hasError: boolean };
  currComparison: MDTComparisonData;
  validMdtCodes: string[];
  isComparisonRule?: boolean;
  onNodeChange?: (node: MdtNode | null) => void;
  selectedNode?: MdtNode | null;
  editCancelFunction?: () => void;
  setComparisonCardData?: (data: MDTComparisonData) => void;
  disabledMdtChooser?: boolean;
}

const StyledContainerBox = styled(Box)(({ theme }) => ({
  margin: "8px 0px",
  borderRadius: 4,
  backgroundColor: theme.palette.paperBackground,
}));

const StyledHeaderBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  borderBottom: theme.palette.borderColor,
  padding: "12px 18px",
  alignItems: "center",
}));

const StyledErrorTemplate = styled("fieldset")(({ theme }) => ({
  color: "#2C3644",
  justifyContent: "space-between",
  margin: "8px 0px 12px 0",
  border: theme.palette.borderColor,
  borderRadius: 4,
  display: "flex",
  alignItems: "center",
  "& input": {
    fontSize: "12px",
  },
}));

const StyledErrorTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: "11px",
  fontWeight: 500,
  lineHeight: "16px",
}));

const StyledTitleTypography = styled(Typography)(() => ({
  fontWeight: 500,
  fontSize: "13px",
}));

const StyledConditionBtn = styled(Box)(() => ({
  borderRadius: 50,
  width: 28,
  height: 28,
  color: "#FFFFFF",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const StyledAddTemplateBtn = styled(IconButton)<{ variant: string }>(() => ({
  backgroundColor: "#2962FF",
  borderRadius: 12,
  width: 18,
  height: 18,
  color: "#FFFFFF",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "&:hover": {
    backgroundColor: "#2962FF",
    opacity: 0.7,
  },
}));

const StyledEquationBox = styled(Box)(({ theme }) => ({
  boxSizing: "border-box",
  borderRadius: 4,
  border: theme.palette.borderColor,
  height: 300,
  width: "100%",
  padding: "0px 8px 8px 8px",
  overflowY: "hidden",
}));

const MDTNodeComparisonsCardEdit: React.FC<MDTNodeComparisonsCardEditProps> = ({
  setIsOpen,
  onSaveFunction,
  currComparison,
  validMdtCodes,
  isComparisonRule = false,
  onNodeChange,
  selectedNode,
  editCancelFunction,
  setComparisonCardData,
  disabledMdtChooser = false,
}) => {
  const { t } = useTranslation();

  const initCurrComparisonDefaultValues = () => {
    if (currComparison?.condition?.length === 0) {
      currComparison.condition = "EQUALS";
    }

    return currComparison ? currComparison : {};
  };

  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [equationAnchor, setEquationAnchor] = useState<HTMLDivElement | null>(
    null
  );
  const [data, setData] = useState<MDTComparisonData>(
    initCurrComparisonDefaultValues() as MDTComparisonData
  );
  const [leftEquationArea, setLeftEquationArea] = useState(
    data?.leftEquation ? data?.leftEquation : ""
  );
  const [rightEquationArea, setRightEquationArea] = useState(
    data?.equation ? data?.equation : ""
  );
  const [hasErrorsLeftEquation, setHasErrorsLeftEquation] = useState(false);
  const [hasErrorsRightEquation, setHasErrorsRightEquation] = useState(true);
  const [anchorElMDTChooser, setAnchorElMDTChooser] = useState<Element | null>(
    null
  );

  const cursorPositionRef = useRef<number>(-1);
  const inputRef = useRef<any>(null);
  const preventBlurRef = useRef(false);

  const { openErrorWindow } = useErrorWindow();

  const handleSelect = (event: any) => {
    cursorPositionRef.current = event.target.selectionStart;
  };

  const handleBlur = () => {
    if (preventBlurRef.current) {
      inputRef.current.focus();
    }
  };

  const popoverOpenHandler = (event: UIEventType) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);

    preventBlurRef.current = true;

    if (inputRef.current) {
      inputRef.current.focus();
    }

    setTimeout(() => {
      preventBlurRef.current = false;
    }, 100);
  };

  const popoverCloseHandler = (value: string) => {
    setAnchorEl(null);

    if (cursorPositionRef.current < 0 || typeof value !== "string") return;

    cursorPositionRef.current += value.length + 2;
    setTimeout(() => {
      setCursorAtPosition(cursorPositionRef.current);
    }, 100);
  };

  const setCursorAtPosition = (position: number) => {
    const input = inputRef.current;
    if (input) {
      input.focus();
      input.setSelectionRange(position, position);
    }
  };

  const handleClose = (event?: UIEventType) => {
    event?.stopPropagation();
    setAnchorElMDTChooser(null);
  };

  const open = Boolean(anchorEl);
  const equationOpen = Boolean(equationAnchor);

  const onSave = async () => {
    let condition = data.condition ? data.condition : "EQUALS";
    let processStage = data.processStage ? data.processStage : "DEFAULT";
    let res = await onSaveFunction({
      ...data,
      condition,
      leftEquation: leftEquationArea,
      equation: rightEquationArea,
      processStage: processStage,
    });

    if (isComparisonRule && setComparisonCardData && res && !res.hasError) {
      setComparisonCardData({
        ...data,
        leftEquation: leftEquationArea,
        equation: rightEquationArea,
      });
    }

    setIsOpen(false);
  };

  const isValidComparison = () => {
    let valid = true;

    valid = valid && !!data?.condition && data.condition.length > 0;
    valid = valid && !(hasErrorsLeftEquation || hasErrorsRightEquation);
    valid = valid && !!data?.node?.id && data.node.id > 0;

    return valid;
  };

  return (
    <StyledContainerBox
      data-testid={`mdtNode-comparison-card-edit-${currComparison?.id}`}
    >
      <StyledHeaderBox>
        <StyledTitleTypography>{t("editMDTComparisons")}</StyledTitleTypography>

        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
          width={"150px"}
        >
          <GhostBtn
            children={t("cancel")}
            padding={"0px"}
            onClick={() => {
              editCancelFunction && editCancelFunction();
              setIsOpen(false);
            }}
            data-testid={"cancelBtn"}
          />
          <span
            style={{
              borderLeft: "1px solid #687A9E",
              height: 14,
            }}
          ></span>
          <GhostBtn
            padding={"0px"}
            disabled={!isValidComparison()}
            children={t("save")}
            endIcon={<CheckIcon fontSize={"inherit"} />}
            onClick={() => {
              if (!isValidComparison()) {
                openErrorWindow(
                  { response: { data: { message: t("equationHasErrors") } } },
                  t("equationHasErrors"),
                  true
                );
              } else {
                onSave();
              }
            }}
            data-testid={"saveBtn"}
          />
        </Box>
      </StyledHeaderBox>

      <Box
        sx={{
          padding: "12px 18px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {isComparisonRule && (
          <Box marginBottom={"10px"}>
            <MDTChooser
              anchorEl={anchorElMDTChooser}
              setAnchorEl={setAnchorElMDTChooser}
              value={selectedNode}
              handleClose={handleClose}
              onNodeSelect={(obj, _, event) => {
                if (obj.type !== "NODE") {
                  event?.stopPropagation();
                  data.node = obj;
                  setAnchorElMDTChooser(null);
                  onNodeChange?.(obj);
                  handleClose(event);
                }
              }}
              foldersOnly={false}
              disabledMdtChooser={disabledMdtChooser}
            />
          </Box>
        )}
        <TextField
          size={"small"}
          label={t("numberPattern")}
          value={data?.numberPattern || ""}
          fieldName={"numberPattern"}
          onChange={(val: string) => {
            setData({ ...data, numberPattern: val });
          }}
        />
        <Box
          sx={{
            padding: "16px 0px 8px 0px",
          }}
        >
          <Select
            size={"small"}
            onChange={(value) => setData({ ...data, processStage: value })}
            value={data.processStage || "DEFAULT"}
            data={[
              { label: t("default"), value: "DEFAULT" },
              { label: t("postProcess"), value: "POST_PROCESS" },
            ]}
            label={t("processStageChooser")}
            data-testid={"process-stage-chooser"}
          />
        </Box>

        <StyledErrorTemplate data-testid={"error-template-container"}>
          <legend style={{ paddingRight: "10px" }}>
            <StyledErrorTypography>{t("errorTemplate")}</StyledErrorTypography>
          </legend>
          <InputBase
            onBlur={handleBlur}
            inputRef={inputRef}
            onSelect={handleSelect}
            sx={{ ml: 1, flex: 1 }}
            placeholder=""
            value={data?.template}
            onChange={(event) => {
              const fieldItemValue = event.target.value;
              setData({ ...data, template: fieldItemValue });
            }}
            size={"medium"}
            data-testid={"input-field"}
          />
          <StyledAddTemplateBtn
            onClick={popoverOpenHandler}
            variant="contained"
            data-testid={"add-button"}
          >
            <AddIcon
              style={{
                fontSize: 15,
              }}
            />
          </StyledAddTemplateBtn>
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={popoverCloseHandler}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            sx={{
              "& .MuiPopover-paper": {
                backgroundColor: "#2A3341 !important",
              },
              zIndex: "999991",
            }}
            data-testid={"popover"}
          >
            <ErrorTemplatePopover
              popoverCloseHandler={popoverCloseHandler}
              errorTemplate={data?.template}
              setErrorTemplate={(val: string) => {
                setData({ ...data, template: val });
              }}
              insertPosition={cursorPositionRef.current}
            />
          </Popover>
        </StyledErrorTemplate>
        <StyledEquationBox>
          <StyledHeaderBox>
            <StyledTitleTypography>{t("equation")}</StyledTitleTypography>
          </StyledHeaderBox>
          <Grid
            container
            item
            xs={12}
            display={"flex"}
            overflow={"hidden"}
            justifyContent={"space-between"}
          >
            <Grid item xs={5.5}>
              <CodeArea
                editMode={true}
                height={170}
                validMDTCODES={validMdtCodes}
                expandOption={false}
                comparison={true}
                editorContent={leftEquationArea}
                setEditorContent={setLeftEquationArea}
                setHasErrors={setHasErrorsLeftEquation}
                dataTestId={`codeArea-left-${currComparison?.id}`}
              />
            </Grid>
            <Divider
              textAlign={"center"}
              sx={{
                color: "#DFDFDF",
                backgroundColor: "inherit",
              }}
              orientation="vertical"
              variant="middle"
              flexItem
            >
              <StyledConditionBtn
                onClick={(event) => {
                  event.stopPropagation();
                  setEquationAnchor(event.currentTarget);
                }}
                data-testid={"comparison-condition-button"}
              >
                <MTDComparisonConditions condition={data?.condition} />
              </StyledConditionBtn>
              <Popover
                open={equationOpen}
                anchorEl={equationAnchor}
                onClose={() => setEquationAnchor(null)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                sx={{
                  "& .MuiPopover-paper": {
                    backgroundColor: "#2A3341 !important",
                  },
                  zIndex: "999991",
                }}
                data-testid={"popover"}
              >
                <ConditionsPopover
                  popoverCloseHandler={() => setEquationAnchor(null)}
                  onChange={(val) => {
                    setData({ ...data, condition: val });
                  }}
                />
              </Popover>
            </Divider>
            <Grid item xs={5.5}>
              <CodeArea
                editMode={true}
                height={170}
                validMDTCODES={validMdtCodes}
                expandOption={false}
                comparison={true}
                editorContent={rightEquationArea}
                setEditorContent={setRightEquationArea}
                setHasErrors={setHasErrorsRightEquation}
                dataTestId={`codeArea-right-${currComparison?.id}`}
              />
            </Grid>
          </Grid>
        </StyledEquationBox>
      </Box>
    </StyledContainerBox>
  );
};

export default MDTNodeComparisonsCardEdit;
