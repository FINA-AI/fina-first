import { Box, styled } from "@mui/system";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Divider from "@mui/material/Divider";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import React, { useCallback, useEffect, useState } from "react";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import MTDComparisonConditions from "./MTDComparisonConditions";
import { useTranslation } from "react-i18next";
import MDTNodeComparisonsCardEdit from "./Edit/MDTNodeComparisonsCardEdit";
import CodeArea from "../CodeArea/CodeArea";
import DeleteForm from "../../common/Delete/DeleteForm";
import { MDTComparisonData, MdtNode } from "../../../types/mdt.type";
import { Comparison } from "../../../types/comparison.type";

interface MDTNodeComparisonsCardProps {
  data: Comparison;
  index: number;
  validMdtCodes: string[];
  editMode?: boolean;
  editCancelFunction?: VoidFunction;
  isComparisonRule?: boolean;
  selectedNode?: MdtNode | null;
  setComparisonCardData?: (comparison: Comparison) => void;
  disabledMdtChooser?: boolean;
  hasAmendPermission?: boolean;
  onDeleteFunction(data: MDTComparisonData): void;
  onNodeChange?(node: MdtNode | null): void;
  onEditSaveFunction(data: MDTComparisonData): void;
}

const StyledAccordion = styled(Accordion)<{ isComparisonRule?: boolean }>(
  ({ theme, expanded, isComparisonRule }) => ({
    height: 300,
    overflowY: "auto",
    overflowX: "hidden",
    width: "100%",
    boxShadow: (theme as any).shadows[1],
    ...(isComparisonRule && {
      backgroundColor: theme.palette.primary.main,
    }),
    ...(!isComparisonRule &&
      expanded && {
        border: `1px solid ${theme.palette.secondary.main}`,
      }),
    ...(!isComparisonRule &&
      !expanded && {
        color: theme.palette.text.secondary,
      }),
  })
);

const StyledCard = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.mode === "dark" ? "#2D3747" : "#EAECF0"}`,
  background: theme.palette.paperBackground,
  borderRadius: "4px",
  display: "flex",
  flexDirection: "column",
  padding: "10px",
}));

const StyledCardHeader = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  minHeight: "32px",
  paddingBottom: "10px",
}));

const StyledCodeSpan = styled("span")(() => ({
  lineHeight: "18px",
  fontSize: "12px",
  fontWeight: 500,
}));

const StyledNumberPatternSpan = styled("span")(() => ({
  color: "#8695B1",
  lineHeight: "13px",
  fontSize: "10px",
  fontWeight: 400,
}));

const StyledHeaderActionBtn = styled(Box)(() => ({
  "& .MuiSvgIcon-root": {
    width: "17px",
    height: "17px",
    color: "#9AA7BE",
    cursor: "pointer",
  },
}));

const StyledCardBody = styled(Box)(() => ({
  padding: "10px 0px",
  "& .MuiPaper-root": {
    width: "100%",
    boxShadow: "none",
    backgroundColor: "inherit",
  },
  "& .MuiAccordionDetails-root": {
    padding: "0px !important",
  },
  "& .Mui-expanded": {
    "& .MuiAccordionSummary-root": {
      display: "none",
    },
    "& .MuiCollapse-root": {
      minHeight: "100px",
    },
  },
  "& .MuiAccordionSummary-contentGutters": {
    margin: "0px",
  },
}));

const StyledCardFooter = styled(Box)(() => ({
  color: "#8695B1",
  lineHeight: "12px",
  fontSize: "10px",
  fontWeight: 400,
  display: "flex",
  justifyContent: "space-between",
  marginTop: "10px",
  "& .MuiSvgIcon-root": {
    color: "#FF8D00",
    width: "15px",
    height: "15px",
    marginRight: "10px",
  },
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  border: theme.palette.borderColor,
  borderBottomWidth: "0px",
}));

const StyledTemplateBox = styled(Box)(({ theme }) => ({
  textOverflow: "ellipsis!important",
  overflow: "hidden!important",
  display: "-webkit-box",
  color: theme.palette.textColor,
  "-webkit-box-orient": "vertical",
  "-webkit-line-clamp": 2,
}));

const StyledRightEquation = styled(Accordion)<{ _isComparisonRule?: boolean }>(
  ({ _isComparisonRule }) => ({
    fontWeight: 400,
    fontSize: 12,
    marginBottom: 5,
    textOverflow: "ellipsis!important",
    overflowY: "auto",
    overflowX: "hidden",
    display: "-webkit-box",
    "-webkit-box-orient": "vertical",
    "-webkit-line-clamp": 4,
    height: 300,
  })
);

const MDTNodeComparisonsCard: React.FC<MDTNodeComparisonsCardProps> = ({
  data,
  setComparisonCardData,
  index,
  onEditSaveFunction,
  validMdtCodes,
  editMode = false,
  editCancelFunction,
  isComparisonRule,
  onNodeChange,
  selectedNode,
  disabledMdtChooser = false,
  onDeleteFunction,
  hasAmendPermission,
}) => {
  const { t } = useTranslation();

  const [isEdit, setIsEdit] = useState(editMode);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    setIsEdit(editMode);
  }, [editMode]);

  const getComparisonBodyCallback = useCallback(() => {
    return <GetComparisonBody />;
  }, [data]);

  const GetComparisonBody = () => {
    let leftEquation = data?.leftEquation.replace(/\n/g, "");
    let rightEquation = data?.equation.replace(/\n/g, "");
    let equationBoxStyle = {
      width: "290px",
      display: "flex",
      alignItems: "start",
      flexDirection: "column",
      padding: "4px 8px",
      color: "#4F5863",
      fontWeight: "400",
      fontSize: "11px",
      lineHeight: "16px",
      textTransform: "none",
      lineBreak: "anywhere",
    };

    return (
      <Box display={"flex"} flexDirection={"column"}>
        <Box display={"flex"} justifyContent={"space-between"}>
          <Box sx={{ ...equationBoxStyle }}>
            <StyledAccordion elevation={1}>
              <AccordionSummary
                aria-label="Expand"
                aria-controls="additional-actions1-content"
                id="additional-actions1-header"
              >
                <CodeArea
                  editorContent={leftEquation}
                  editMode={false}
                  height={"100%"}
                  width={"100%"}
                  comparison={true}
                  readOnly={true}
                  setEditorContent={() => {}}
                  setHasErrors={() => {}}
                  validMDTCODES={validMdtCodes}
                  dataTestId={`codeArea-left-${data?.id}`}
                />
              </AccordionSummary>
              <AccordionDetails>
                <CodeArea
                  editorContent={leftEquation}
                  editMode={false}
                  height={"100%"}
                  width={"100%"}
                  comparison={true}
                  setEditorContent={() => {}}
                  setHasErrors={() => {}}
                  readOnly={true}
                  validMDTCODES={validMdtCodes}
                  dataTestId={`codeArea-left-expanded-${data?.id}`}
                />
              </AccordionDetails>
            </StyledAccordion>
          </Box>
          <Box style={{ display: "flex", alignItems: "center" }}>
            <MTDComparisonConditions condition={data?.condition} />
          </Box>
          <Box sx={{ ...equationBoxStyle }}>
            <StyledRightEquation
              _isComparisonRule={isComparisonRule}
              elevation={1}
            >
              <AccordionSummary
                aria-label="Expand"
                aria-controls="additional-actions1-content"
                id="additional-actions1-header"
              >
                <CodeArea
                  editorContent={rightEquation}
                  editMode={false}
                  height={"100%"}
                  width={"100%"}
                  comparison={true}
                  setEditorContent={() => {}}
                  setHasErrors={() => {}}
                  readOnly={true}
                  validMDTCODES={validMdtCodes}
                  dataTestId={`codeArea-right-${data?.id}`}
                />
              </AccordionSummary>
              <AccordionDetails>
                <CodeArea
                  editorContent={rightEquation}
                  editMode={false}
                  height={"100%"}
                  width={"100%"}
                  comparison={true}
                  setEditorContent={() => {}}
                  setHasErrors={() => {}}
                  readOnly={true}
                  validMDTCODES={validMdtCodes}
                  dataTestId={`codeArea-right-expanded-${data?.id}`}
                />
              </AccordionDetails>
            </StyledRightEquation>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <>
      {isEdit ? (
        <MDTNodeComparisonsCardEdit
          setIsOpen={setIsEdit}
          onSaveFunction={onEditSaveFunction}
          currComparison={data}
          validMdtCodes={validMdtCodes}
          editCancelFunction={editCancelFunction}
          isComparisonRule={isComparisonRule}
          onNodeChange={onNodeChange}
          selectedNode={selectedNode}
          setComparisonCardData={setComparisonCardData}
          disabledMdtChooser={disabledMdtChooser}
        />
      ) : (
        <Box pt={1.5} data-testid={`mdtNode-comparison-card-${data?.id}`}>
          <StyledCard key={index}>
            <StyledCardHeader>
              <Box display={"flex"} flexDirection={"column"}>
                <StyledCodeSpan>{data.node?.code}</StyledCodeSpan>
                <StyledNumberPatternSpan>
                  {data.numberPattern}
                </StyledNumberPatternSpan>
              </Box>
              {hasAmendPermission && (
                <StyledHeaderActionBtn>
                  <EditIcon
                    style={{ paddingRight: "15px" }}
                    onClick={() => {
                      setIsEdit(true);
                    }}
                    data-testid={"editBtn"}
                  />
                  <DeleteIcon
                    onClick={() => {
                      setDeleteModal(true);
                    }}
                    data-testid={"deleteBtn"}
                  />
                </StyledHeaderActionBtn>
              )}
            </StyledCardHeader>
            <StyledDivider />
            <StyledCardBody>
              {Object.keys(data).length > 0 && getComparisonBodyCallback()}
            </StyledCardBody>
            <StyledDivider />
            {data?.template && (
              <StyledCardFooter>
                <WarningAmberIcon />
                <StyledTemplateBox>{data?.template}</StyledTemplateBox>
              </StyledCardFooter>
            )}
          </StyledCard>
        </Box>
      )}
      {deleteModal && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={t("comparison")}
          isDeleteModalOpen={deleteModal}
          setIsDeleteModalOpen={setDeleteModal}
          onDelete={() => {
            onDeleteFunction(data);
            setDeleteModal(false);
          }}
        />
      )}
    </>
  );
};

export default MDTNodeComparisonsCard;
