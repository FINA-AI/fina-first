import React, { useEffect, useState } from "react";
import { Box } from "@mui/system";
import { Checkbox, Typography } from "@mui/material";

import { getFormattedDateValue } from "../../../../../../util/appUtil";
import useConfig from "../../../../../../hoc/config/useConfig";
import DatePicker from "../../../../../common/Field/DatePicker";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import FILicenseCommentField from "./FILicenseCommentField";
import AccordionDetails from "@mui/material/AccordionDetails";
import TextButton from "../../../../../common/Button/TextButton";
import {
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import {
  BankingOperationsDataType,
  CommentType,
} from "../../../../../../types/fi.type";

const StyledRoot = styled(Box)(({ theme }) => ({
  padding: "12px 0px",
  backgroundColor: theme.palette.mode === "light" ? "#F9F9F9" : "#384354",
  display: "flex",
  flexDirection: "column",
  width: "100%",
}));

const StyledBankOperationHead = styled(Box)(({ theme }: any) => ({
  color: theme.palette.textColor,
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "20px",
}));

const StyledOperationItemDate = styled(Box)({
  marginTop: "8px",
  float: "right",
  color: "#8695B1",
  fontWeight: 400,
  fontSize: "11px",
  lineHeight: "145%",
});

const StyledAddBox = styled(Box)({
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

const StyledCheckbox = styled(Checkbox)({
  padding: "0px",
  marginRight: "8px",
  color: "rgb(194, 202, 216)",
  "& .MuiSvgIcon-root": {
    width: "18px",
    height: "20px",
  },
});

const StyledOperationItemDateContainer = styled(Box)({
  maxWidth: "170px",
  color: "#8695B1",
  fontWeight: 400,
  fontSize: "11px",
  lineHeight: "145%",
  float: "right",
  marginTop: "10px",
  "& .MuiOutlinedInput-input": {
    color: "#2C3644",
    fontWeight: 500,
    fontSize: "11px",
    lineHeight: "145%",
    textTransform: "capitalize",
  },
  "& .MuiSvgIcon-root": {
    width: "20px",
    height: "20px",
  },
});

const StyledCommentContainer = styled(Box)(({ theme }) => ({
  marginTop: "12px",
  padding: "12px 20px",
  border: `1px solid ${theme.palette.mode === "dark" ? "#525a85" : "#EAEBF0"}`,
  backgroundColor: theme.palette.mode === "dark" ? "#414c5d" : "#F9F9F9",
  borderRadius: "4px",
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

const StyledAddIcon = styled(AddIcon)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: 14,
  cursor: "pointer",
}));

interface OperationType {
  id: number;
  active: boolean;
  comments: CommentType[];
  changeDate: number | null;
  bankingOperation: BankingOperationsDataType;
}

interface FILicenseBankOperationSubItemsProps {
  subItem: BankingOperationsDataType;
  bankOperationStatus: boolean;
  bankOperationEditMode: boolean;
  operations: OperationType[];
  subItemIndex: number;
  generalEditMode: boolean;
  setGeneralEditMode: (val: boolean) => void;
  deleteBankingOperationCommentFunc: (id: number) => void;
  saveBankingOperationCommentFunc: (
    comment: CommentType,
    operationId: number
  ) => Promise<{ data: CommentType }>;
}

const FILicenseBankOperationSubItems: React.FC<
  FILicenseBankOperationSubItemsProps
> = ({
  subItem,
  bankOperationStatus,
  bankOperationEditMode,
  operations,
  subItemIndex,
  generalEditMode,
  setGeneralEditMode,
  deleteBankingOperationCommentFunc,
  saveBankingOperationCommentFunc,
}) => {
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();

  const [checked, setChecked] = useState(false);
  const [date, setDate] = useState<number | null>(null);
  const [item, setItem] = useState<OperationType | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [disableAddOrEdit, setDisableAddOrEdit] = useState(false);

  useEffect(() => {
    let res = operations.find(
      (opItem) => opItem.bankingOperation.id === subItem.id
    );
    if (res) {
      setDate(res.changeDate);
      setItem({ ...res });
      setComments([...res.comments.sort((a, b) => b.id - a.id)]);
      setChecked(true);
    } else {
      setComments([]);
      setChecked(false);
    }
  }, [subItem, operations]);

  const onCheckBoxClickChange = () => {
    if (!checked) {
      if (item) {
        operations.push({ ...item, changeDate: date });
      } else {
        operations.push({
          active: true,
          comments: [],
          id: (subItemIndex + 1) * -1,
          bankingOperation: { ...subItem },
          changeDate: date ?? Date.now(),
        });
      }
    } else {
      const objId = item ? item.id : (subItemIndex + 1) * -1;
      for (let i = operations.length - 1; i >= 0; i--) {
        if (operations[i].id === objId) {
          operations.splice(i, 1);
        }
      }
    }
    setChecked(!checked);
  };

  const addNewComment = () => {
    const comment: CommentType = {
      id: comments.length > 0 ? (comments.length + 1) * -1 : -1,
      modifiedAt: null,
      comment: "",
    };
    setComments([comment, ...comments]);
    setGeneralEditMode(true);
  };

  const onDeleteComment = async (item: CommentType) => {
    if (item.id > 0) {
      await deleteBankingOperationCommentFunc(item.id);
    }
    let comArray = comments.filter((c) => c.id !== item.id);
    setComments([...comArray]);
  };

  const onCancel = (comment: CommentType) => {
    if (comment.id < 1) {
      let comArray = comments.filter(
        (commentItem) => commentItem.id !== comment.id
      );
      setComments([...comArray]);
    }
    setDisableAddOrEdit(false);
    setGeneralEditMode(false);
  };

  const commentSave = async (
    commentItem: CommentType
  ): Promise<CommentType | null> => {
    let response = null;
    let res = operations.find(
      (opItem) => opItem.bankingOperation.id === subItem.id
    );

    if (res) {
      await saveBankingOperationCommentFunc(commentItem, res.id).then(
        (resp) => {
          if (resp) {
            setComments([
              ...comments.map((com) => {
                return com.id <= 0 ? resp.data : com;
              }),
            ]);
            setDisableAddOrEdit(false);
            response = resp.data;
          }
        }
      );
    }

    return response;
  };

  return (
    <StyledRoot>
      <Box display={"flex"} flexDirection={"column"}>
        <Box>
          <StyledBankOperationHead
            display={"flex"}
            justifyContent={"space-between"}
            marginTop={"12px"}
          >
            <Box paddingRight={"8px"}>
              <StyledCheckbox
                checked={checked}
                disabled={!bankOperationStatus || !bankOperationEditMode}
                onClick={onCheckBoxClickChange}
              />
              {subItem.description}
            </Box>
            <Box minWidth={"fit-content"}></Box>
          </StyledBankOperationHead>
          <Box
            display={"flex"}
            justifyContent={"flex-end"}
            marginRight={"100px"}
          >
            {checked && bankOperationEditMode && (
              <StyledOperationItemDateContainer>
                <DatePicker
                  value={date}
                  size={"small"}
                  onChange={(value) => setDate(value.getTime())}
                />
              </StyledOperationItemDateContainer>
            )}
            {Boolean(date) && !bankOperationEditMode && (
              <StyledOperationItemDate>
                {getFormattedDateValue(date, getDateFormat(true))}
              </StyledOperationItemDate>
            )}
          </Box>
        </Box>
      </Box>
      <Box marginTop={"10px"} display={"flex"} flexDirection={"column"}>
        <Box>
          <StyledAddBox>
            <Box
              onClick={() => {
                bankOperationStatus &&
                  !disableAddOrEdit &&
                  !generalEditMode &&
                  checked &&
                  addNewComment();
              }}
              display={"flex"}
              alignItems={"center"}
              style={{
                gap: "8px",
                opacity:
                  generalEditMode ||
                  disableAddOrEdit ||
                  !bankOperationStatus ||
                  !checked
                    ? 0.6
                    : 1,
              }}
            >
              <StyledAddNewButtonText>{t("addComment")}</StyledAddNewButtonText>
              <StyledAddIcon />
            </Box>
          </StyledAddBox>
        </Box>
        <Box marginLeft={"30px"}>
          {comments && comments.length > 0 && (
            <StyledCommentContainer>
              <StyledAccordionBox>
                <Accordion expanded={expanded}>
                  <AccordionSummary>
                    <FILicenseCommentField
                      commentItem={comments[0]}
                      onCommentSaveFunction={commentSave}
                      key={0}
                      onDeleteComment={onDeleteComment}
                      onCancel={(comment) => onCancel(comment)}
                      disableAddOrEdit={disableAddOrEdit}
                      setDisableAddOrEdit={setDisableAddOrEdit}
                      firstChild={true}
                      hideActionButtons={generalEditMode}
                      setGeneralEditMode={setGeneralEditMode}
                      generalEditMode={generalEditMode}
                      index={0}
                    />
                  </AccordionSummary>
                  <AccordionDetails>
                    {comments.map((commentItem, index) => {
                      return (
                        index > 0 && (
                          <FILicenseCommentField
                            commentItem={commentItem}
                            generalEditMode={generalEditMode}
                            key={index}
                            index={index + 1}
                            onCommentSaveFunction={commentSave}
                            onDeleteComment={onDeleteComment}
                            onCancel={(comment) => onCancel(comment)}
                            disableAddOrEdit={disableAddOrEdit}
                            setDisableAddOrEdit={setDisableAddOrEdit}
                            hideActionButtons={generalEditMode}
                            setGeneralEditMode={setGeneralEditMode}
                          />
                        )
                      );
                    })}
                  </AccordionDetails>
                </Accordion>
                {comments.length > 1 && (
                  <div>
                    <TextButton
                      onClick={() => setExpanded(!expanded)}
                      endIcon={
                        expanded ? (
                          <KeyboardArrowUpRounded />
                        ) : (
                          <KeyboardArrowDownRounded />
                        )
                      }
                    >
                      {expanded ? t("seeLess") : t("seeMore")}
                    </TextButton>
                  </div>
                )}
              </StyledAccordionBox>
            </StyledCommentContainer>
          )}
        </Box>
      </Box>
    </StyledRoot>
  );
};

export default FILicenseBankOperationSubItems;
