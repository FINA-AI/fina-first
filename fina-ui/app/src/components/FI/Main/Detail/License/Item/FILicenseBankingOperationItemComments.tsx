import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import TextButton from "../../../../../common/Button/TextButton";
import FILicenseCommentField from "./FILicenseCommentField";
import useConfig from "../../../../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../../../../api/permissions";
import {
  BankingOperationsDataType,
  CommentType,
} from "../../../../../../types/fi.type";

const StyledAdd = styled(Box)({
  width: "300px",
  display: "flex",
  alignItems: "center",
  position: "relative",
});

const StyledAddNewButtonText = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 400,
  fontSize: 14,
  cursor: "pointer",
}));

const StyledAddIcon = styled(AddIcon)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: 14,
  cursor: "pointer",
}));

const StyledCommentContainer = styled(Box)(({ theme }) => ({
  marginTop: "12px",
  padding: "12px 20px",
  border: `1px solid ${theme.palette.mode === "dark" ? "#525a85" : "#EAEBF0"}`,
  borderRadius: "4px",
  backgroundColor: theme.palette.mode === "dark" ? "#414c5d" : "#F9F9F9",
}));

const StyledAccordionBox = styled(Box)({
  "& .MuiBox-root": {
    width: "100%",
  },
  "& .MuiPaper-root": {
    background: "inherit !important",
    boxShadow: "none !important",
  },
  "& .MuiAccordionSummary-root": {
    padding: "0px",
    background: "inherit !important",
    boxShadow: "none !important",
    minHeight: "inherit !important",
  },
  "& .MuiAccordionDetails-root": {
    padding: "0px",
  },
  "& .MuiAccordionSummary-content": {
    margin: "0px",
  },
});

interface Props {
  bankOperationEdit: boolean;
  setHideOperationEdit: (val: boolean) => void;
  deleteBankingOperationCommentFunc: (id: number) => void;
  saveBankingOperationCommentFunc: (
    comment: any,
    operationId: number
  ) => Promise<any>;
  operationId?: number;
  parentId?: number;
  status: boolean;
  generalEditMode: boolean;
  setGeneralEditMode: (val: boolean) => void;
  date?: number;
  operations: BankingOperationsDataType[];
  licenseDetails: {
    operations: BankingOperationsDataType[];
  };
}

const FILicenseBankingOperationItemComments: React.FC<Props> = ({
  bankOperationEdit,
  setHideOperationEdit,
  deleteBankingOperationCommentFunc,
  saveBankingOperationCommentFunc,
  operationId,
  parentId = 0,
  status,
  generalEditMode,
  setGeneralEditMode,
  date,
  operations,
  licenseDetails,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();

  const [commentsData, setCommentsData] = useState<CommentType[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [disableAddOrEdit, setDisableAddOrEdit] = useState(false);

  useEffect(() => {
    setHideOperationEdit(disableAddOrEdit);
  }, [disableAddOrEdit]);

  const onCancel = (comment: CommentType) => {
    if (comment.id < 1) {
      setCommentsData([...commentsData.filter((com) => com.id !== comment.id)]);
    }
    setDisableAddOrEdit(false);
    setGeneralEditMode(false);
  };

  const onDeleteComment = async (item: CommentType) => {
    if (item.id > 0) {
      await deleteBankingOperationCommentFunc(item.id);
      const updatedComments = commentsData.filter((com) => com.id !== item.id);

      licenseDetails.operations.forEach((opItem) => {
        if (opItem.bankingOperation.id === parentId) {
          opItem.comments = updatedComments;
        }
      });

      setCommentsData(updatedComments);
    }
  };

  const onAddComment = () => {
    const comment = {
      id: commentsData ? (commentsData.length + 1) * -1 : -1,
      modifiedAt: null,
      comment: "",
    };
    setCommentsData([comment, ...commentsData]);
    setDisableAddOrEdit(true);
    setGeneralEditMode(true);
  };

  useEffect(() => {
    let comments = operations.find(
      (opItem) => opItem.bankingOperation.id === parentId
    )?.comments;
    if (comments) {
      let comArray = [...comments.sort((a: any, b: any) => b.id - a.id)];
      setCommentsData([...comArray]);
    } else {
      setCommentsData([]);
    }
  }, [operations]);

  const onSave = async (obj: any, id: number) => {
    let response = null;
    if (operationId) {
      await saveBankingOperationCommentFunc(
        { ...obj, parentId: parentId },
        operationId
      ).then((resp) => {
        if (resp) {
          setCommentsData([
            ...commentsData.map((com) => {
              return com.id === id ? resp.data : com;
            }),
          ]);
          setDisableAddOrEdit(false);
          response = resp.data;
        }
      });
    }

    return response;
  };

  return (
    <Box data-testid={"comments"}>
      {hasPermission(PERMISSIONS.FI_AMEND) && (
        <Box display={"flex"} alignItems={"center"}>
          <StyledAdd
            style={{
              top: status && (bankOperationEdit || date) ? "-20px" : "",
            }}
          >
            <Box
              onClick={() => {
                !bankOperationEdit &&
                  !disableAddOrEdit &&
                  !generalEditMode &&
                  status &&
                  onAddComment();
              }}
              display={"flex"}
              alignItems={"center"}
              style={{
                gap: "8px",
                opacity:
                  bankOperationEdit ||
                  generalEditMode ||
                  disableAddOrEdit ||
                  !status
                    ? 0.6
                    : 1,
              }}
            >
              <StyledAddNewButtonText>{t("addComment")}</StyledAddNewButtonText>
              <StyledAddIcon />
            </Box>
          </StyledAdd>
        </Box>
      )}
      <Box>
        {commentsData && commentsData.length > 0 && (
          <StyledCommentContainer style={{ marginBottom: "10px" }}>
            <StyledAccordionBox>
              <Accordion expanded={expanded}>
                <AccordionSummary>
                  <FILicenseCommentField
                    commentItem={commentsData[0]}
                    key={0}
                    index={0}
                    onCommentSaveFunction={onSave}
                    onDeleteComment={onDeleteComment}
                    onCancel={(comment) => onCancel(comment)}
                    disableAddOrEdit={disableAddOrEdit || bankOperationEdit}
                    setDisableAddOrEdit={setDisableAddOrEdit}
                    firstChild={true}
                    hideActionButtons={!status || generalEditMode}
                    setGeneralEditMode={setGeneralEditMode}
                    generalEditMode={generalEditMode}
                  />
                </AccordionSummary>
                <AccordionDetails>
                  {commentsData.map((commentItem, index) => {
                    return (
                      index > 0 && (
                        <FILicenseCommentField
                          commentItem={commentItem}
                          key={index}
                          index={index + 1}
                          onCommentSaveFunction={onSave}
                          onDeleteComment={onDeleteComment}
                          onCancel={(comment) => onCancel(comment)}
                          disableAddOrEdit={
                            disableAddOrEdit || bankOperationEdit
                          }
                          setDisableAddOrEdit={setDisableAddOrEdit}
                          hideActionButtons={!status || generalEditMode}
                          setGeneralEditMode={setGeneralEditMode}
                          generalEditMode={generalEditMode}
                        />
                      )
                    );
                  })}
                </AccordionDetails>
              </Accordion>
              {commentsData.length > 1 && (
                <div>
                  <TextButton onClick={() => setExpanded(!expanded)}>
                    {expanded ? t("seeLess") : t("seeMore")}
                    {expanded ? (
                      <KeyboardArrowUpRounded />
                    ) : (
                      <KeyboardArrowDownRounded />
                    )}
                  </TextButton>
                </div>
              )}
            </StyledAccordionBox>
          </StyledCommentContainer>
        )}
      </Box>
    </Box>
  );
};

export default FILicenseBankingOperationItemComments;
