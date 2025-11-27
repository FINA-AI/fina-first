import { Paper, ToggleButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import CheckIcon from "@mui/icons-material/Check";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import TextField from "../../../common/Field/TextField";
import Select from "../../../common/Field/Select";
import MDTChooser from "../../../MDT/MDTChooser/MDTChooser";
import { styled } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import {
  ReturnDefinitionTable,
  ReturnDefinitionType,
} from "../../../../types/returnDefinition.type";
import { MdtNode } from "../../../../types/mdt.type";

interface Props {
  currentTable: ReturnDefinitionTable;
  setEditMode: (mode: boolean) => void;
  currentReturnDefinition: ReturnDefinitionType;
  onSave(newTable: ReturnDefinitionTable, param: any): void;
}

const StyledRoot = styled(Paper)(({ theme }: { theme: any }) => ({
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.paperBackground,
  height: "100%",
  boxShadow: "none !important",
  width: "100%",
  padding: "0px",
  marginTop: 10,
}));

const StyledPrimaryText = styled(Typography)(({ theme }: { theme: any }) => ({
  color: theme.palette.textColor,
  fontSize: 14,
  fontWeight: 500,
}));

const StyledCancelText = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  padding: 0,
  paddingRight: 4,
  color:
    theme.palette.mode === "light"
      ? "rgba(104, 122, 158, 0.8)"
      : "rgba(140,156,192,0.8)",
  borderRight: "1px solid rgba(104, 122, 158, 0.8)",
  cursor: "pointer",
}));

const StyledSaveBox = styled(Box)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: 12,
  marginLeft: 4,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
}));

const StyledEditHeader = styled(Box)(({ theme }: { theme: any }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: theme.palette.borderColor,
  paddingBottom: "10px",
  paddingTop: "10px",
}));

const StyledEditHeaderItems = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingRight: 15,
});

const StyledFiledBox = styled(Box)({
  marginTop: 10,
  width: "100%",
});

const StyledToggleButtonWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  padding: "5px 10px",
});

const StyledFieldsWrapper = styled(Box)(({ theme }: { theme: any }) => ({
  borderBottom: theme.palette.borderColor,
  padding: "10px 10px",
}));

const StyledEditToggleButtons = styled(ToggleButton)(
  ({ theme }: { theme: any }) => ({
    height: 25,
    width: "100%",
    padding: "3px 5px 3px 5px",
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: 500,
    textTransform: "capitalize",
    border: "1px solid #707C93",
    "&:hover": {
      backgroundColor: theme.palette.buttons.primary.hover,
    },
    borderRadius: 30,
    marginRight: "10px",
  })
);

const StyledToggleContainer = styled(Box)<{ selected: boolean }>(
  ({ theme, selected }) => ({
    ...(selected && {
      "& .MuiToggleButton-root": {
        color: "#FFFFFF !important",
        backgroundColor: theme.palette.primary.main,
      },
    }),
  })
);

const ReturnDefinitionsTableCardEdit: React.FC<Props> = ({
  currentTable,
  setEditMode,
  currentReturnDefinition,
  onSave,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const isAddNew = !currentTable?.code;

  const [newTable, setNewTable] = useState<ReturnDefinitionTable>({
    ...currentTable,
    code: currentTable?.code ?? "",
    visibleLevel: currentTable?.visibleLevel ?? 9,
    type: currentTable?.type ?? "",
    node: currentTable?.node ?? null,
    evalType: currentTable?.evalType ?? "UNKNOWN",
    returnDefinition: {
      id: currentReturnDefinition && currentReturnDefinition.id,
    },
  });

  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const properties = ["UNKNOWN", "SUM", "AVERAGE", "MAX", "MIN"];

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onNodeSelect = (node: MdtNode) => {
    setNewTable({ ...newTable, node: node });
    handleClose();
  };

  return (
    <StyledRoot>
      <StyledEditHeader>
        <StyledPrimaryText pl={"15px"}>
          {t(isAddNew ? "addNew" : `edit`) +
            (!isAddNew ? ` ${currentTable.code}` : "")}
        </StyledPrimaryText>
        <StyledEditHeaderItems>
          <StyledCancelText onClick={() => setEditMode(false)}>
            {t("cancel")}
          </StyledCancelText>
          <StyledSaveBox
            onClick={() => {
              if (newTable.code?.trim().length) {
                onSave(newTable, currentTable);
              } else {
                enqueueSnackbar(t("codeIsRequired"), { variant: "warning" });
              }
            }}
          >
            <Typography fontSize={"inherit"} mr={"3px"}>
              {t("save")}
            </Typography>
            <CheckIcon fontSize={"inherit"} />
          </StyledSaveBox>
        </StyledEditHeaderItems>
      </StyledEditHeader>
      <StyledFieldsWrapper>
        <Box>
          <TextField
            onChange={(val: string) => {
              setNewTable({
                ...newTable,
                code: val,
              });
            }}
            value={currentTable.code}
            label={t("code")}
            size={"small"}
          />
        </Box>
        <StyledFiledBox>
          <Select
            onChange={(val) => {
              setNewTable({
                ...newTable,
                visibleLevel: Number(val),
              });
            }}
            value={currentTable?.visibleLevel >= 10 ? 11 : 9}
            data={[
              { label: t("up"), value: 11 },
              { label: t("down"), value: 9 },
            ]}
            label={t("summeryrow")}
            size={"small"}
            isError={newTable.type === "VCT" && !newTable.visibleLevel}
          />
        </StyledFiledBox>
        <StyledFiledBox>
          <Select
            onChange={(val) => {
              setNewTable({
                ...newTable,
                type: val,
              });
            }}
            label={t("returnType")}
            size={"small"}
            value={currentTable.type ? currentTable.type : ""}
            data={[
              { label: "UNKNOWN", value: "UNKNOWN" },
              { label: "MCT", value: "MCT" },
              { label: "VCT", value: "VCT" },
              { label: "NT", value: "NT" },
            ]}
          />
        </StyledFiledBox>
        <StyledFiledBox>
          <MDTChooser
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            handleClose={handleClose}
            onNodeSelect={onNodeSelect}
            value={newTable.node}
            foldersOnly={true}
          />
        </StyledFiledBox>
      </StyledFieldsWrapper>
      <StyledToggleButtonWrapper>
        {newTable.type === "VCT" && (
          <Box display={"flex"}>
            {properties.map((item, index) => {
              return (
                <StyledToggleContainer
                  selected={newTable.evalType === item}
                  key={index}
                >
                  <StyledEditToggleButtons
                    onClick={() => {
                      setNewTable({
                        ...newTable,
                        evalType: item,
                      });
                    }}
                    value={newTable.evalType ? newTable.evalType : ""}
                    selected={newTable.evalType === item}
                  >
                    {t(item)}
                  </StyledEditToggleButtons>
                </StyledToggleContainer>
              );
            })}
          </Box>
        )}
      </StyledToggleButtonWrapper>
    </StyledRoot>
  );
};

export default ReturnDefinitionsTableCardEdit;
