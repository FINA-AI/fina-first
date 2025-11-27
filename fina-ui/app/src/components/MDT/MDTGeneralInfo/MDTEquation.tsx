import { Box, styled } from "@mui/system";
import { CircularProgress, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import CodeArea from "../CodeArea/CodeArea";
import CheckIcon from "@mui/icons-material/Check";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import { MdtNode } from "../../../types/mdt.type";

interface MDTEquationPropTypes {
  currentNode: MdtNode;
  validMdtCodes: string[];
  onCancel: VoidFunction;
  hasAmendPermission: boolean;
  onSave(val: string): void;
}

const StyledHeaderTypography = styled(Typography)(() => ({
  fontWeight: 600,
  fontSize: "12px",
  lineHeight: "18px",
}));

const StyledCancelTypography = styled(Typography)(() => ({
  fontSize: 12,
  padding: 0,
  paddingRight: 4,
  color: "rgba(104, 122, 158, 0.8)",
  borderRight: "1px solid rgba(104, 122, 158, 0.8)",
  cursor: "pointer",
}));

const StyledSaveBox = styled(Box)(() => ({
  color: "#289E20",
  fontSize: 12,
  marginLeft: 4,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
}));

const MDTEquation: React.FC<MDTEquationPropTypes> = ({
  currentNode,
  validMdtCodes,
  onSave,
  onCancel,
  hasAmendPermission,
}) => {
  const { t } = useTranslation();

  const [equationEdit, setEquationEdit] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const { openErrorWindow } = useErrorWindow();

  const equationValueRef = useRef<any>(currentNode.equation);

  const onEquationChange = (value: string) => {
    !value ? setLoading(false) : setLoading(true);

    equationValueRef.current = value;
  };

  useEffect(() => {
    setEquationEdit(false);
    equationValueRef.current = currentNode.equation;
  }, [currentNode]);

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        marginBottom={"8px"}
      >
        <StyledHeaderTypography>{t("equation")}</StyledHeaderTypography>
        {!equationEdit ? (
          hasAmendPermission && (
            <EditIcon
              sx={{
                color: "#8695B1",
                width: "16px",
                height: "16px",
              }}
              fontSize={"small"}
              onClick={() => setEquationEdit(true)}
            />
          )
        ) : (
          <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
            <StyledCancelTypography
              onClick={() => {
                setEquationEdit(false);
                onCancel();
              }}
            >
              {t("cancel")}
            </StyledCancelTypography>
            <StyledSaveBox
              sx={{
                pointerEvents:
                  !equationValueRef.current || loading ? "none" : "auto",
                opacity: !equationValueRef.current ? 0.5 : 1,
              }}
              onClick={async () => {
                let equation = equationValueRef.current;

                if (equation && hasErrors) {
                  openErrorWindow(
                    { response: { data: { message: t("equationHasErrors") } } },
                    t("equationHasErrors"),
                    true
                  );
                } else {
                  await onSave(equation);
                  setEquationEdit(false);
                }
              }}
            >
              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    height: "13px",
                    width: "36px",
                    "& .MuiCircularProgress-root": {
                      width: "13px !important",
                      height: "13px !important",
                    },
                  }}
                >
                  <CircularProgress thickness={3} />
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "36px",
                    gap: "3px",
                  }}
                >
                  <Typography fontSize={"inherit"}>{t("save")}</Typography>
                  <CheckIcon fontSize={"inherit"} />
                </Box>
              )}
            </StyledSaveBox>
          </Box>
        )}
      </Box>
      <Box>
        <CodeArea
          editorContent={equationValueRef?.current}
          setEditorContent={onEquationChange}
          expandOption={true}
          editMode={equationEdit}
          height={150}
          validMDTCODES={validMdtCodes}
          setHasErrors={setHasErrors}
          setLoading={setLoading}
          dataTestId={`code-area-${currentNode?.id}`}
        />
      </Box>
    </>
  );
};

export default MDTEquation;
