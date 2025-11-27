import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/system";
import ReturnDefinitionsGeneralInfo from "./ReturnDefinitionsDetails/ReturnDefinitionsGeneralInfo/ReturnDefinitionsGeneralInfo";
import ReturnDefinitionsGeneralInfoEdit from "./ReturnDefinitionsDetails/ReturnDefinitionsGeneralInfo/ReturnDefinitionsGeneralInfoEdit";
import { Paper, Slide, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ReturnDefinitionsTable from "./ReturnDefinitionsDetails/ReturnDefinitionsTable/ReturnDefinitionsTable";
import { styled } from "@mui/material/styles";
import CheckIcon from "@mui/icons-material/Check";
import {
  ReturnDefinitionTable,
  ReturnDefinitionType,
  ReturnType,
} from "../../types/returnDefinition.type";

interface ReturnDefinitionsDetailsProps {
  isDetailPageOpen: boolean;
  setIsDetailPageOpen: (value: boolean) => void;
  currentReturnDefinition: ReturnDefinitionType;
  GeneralInfoEditMode: boolean;
  setGeneralInfoEditMode: (value: boolean) => void;
  saveReturnDefinition: (data: ReturnDefinitionType) => void;
  returnTypes: ReturnType[];
  setCurrentReturnDefinition: (rd: ReturnDefinitionType | {}) => void;
  tables: ReturnDefinitionTable[];
  setTables: (tables: ReturnDefinitionTable[]) => void;
  reorderReturnDefinitionTables: VoidFunction;
}

const StyledRoot = styled(Paper)(({ theme }: { theme: any }) => ({
  display: "flex",
  flexDirection: "column",
  overflow: "auto",
  opacity: 1,
  height: "100%",
  width: `700px`,
  position: "absolute",
  top: 0,
  right: 0,
  zIndex: theme.zIndex.drawer - 2,
  borderLeft: theme.palette.borderColor,
  borderTop: theme.palette.borderColor,
  backgroundColor: theme.palette.paperBackground,
}));

const StyledGeneralInfo = styled(Box)(({ theme }: { theme: any }) => ({
  backgroundColor: theme.palette.paperBackground,
  position: "sticky",
  top: 0,
  zIndex: 999999999,
  padding: "15px 0px",
}));

const StyledTableText = styled(Typography)(({ theme }: { theme: any }) => ({
  color: theme.palette.textColor,
  fontWeight: 600,
  padding: "0 10px",
  paddingBottom: "10px",
}));

const StyledSaveBox = styled(Box)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: 12,
  marginLeft: 4,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
}));

const StyledCancel = styled(Typography)(({ theme }) => ({
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

const ReturnDefinitionsDetails: React.FC<ReturnDefinitionsDetailsProps> = ({
  isDetailPageOpen,
  setIsDetailPageOpen,
  currentReturnDefinition,
  GeneralInfoEditMode,
  setGeneralInfoEditMode,
  saveReturnDefinition,
  returnTypes,
  tables,
  setTables,
  reorderReturnDefinitionTables,
}) => {
  const { t } = useTranslation();
  const [isAddNewTableOpen, setIsAddNewTableOpen] = useState(false);
  const [showReorderTableSave, setShowReorderTableSave] = useState(false);
  const [data, setData] = useState<ReturnDefinitionType>(
    {} as ReturnDefinitionType
  );
  const originalTablesRef = useRef<ReturnDefinitionTable[]>([]);

  useEffect(() => {
    if (!!currentReturnDefinition) {
      setData(currentReturnDefinition);
    }
    setShowReorderTableSave(false);
    originalTablesRef.current = tables;
    setIsAddNewTableOpen(false);
  }, [currentReturnDefinition]);

  const onCancel = () => {
    setTables(currentReturnDefinition?.tables ?? []);
    setIsAddNewTableOpen(false);
  };

  return (
    <Slide direction="left" in={isDetailPageOpen} timeout={600}>
      <StyledRoot>
        <StyledGeneralInfo>
          {!GeneralInfoEditMode ? (
            <ReturnDefinitionsGeneralInfo
              data={currentReturnDefinition}
              setIsDetailPageOpen={setIsDetailPageOpen}
              setGeneralInfoEditMode={setGeneralInfoEditMode}
              setData={setData}
            />
          ) : (
            <ReturnDefinitionsGeneralInfoEdit
              data={data}
              setData={setData}
              setGeneralInfoEditMode={setGeneralInfoEditMode}
              saveReturnDefinition={saveReturnDefinition}
              returnTypes={returnTypes}
              setIsDetailPageOpen={setIsDetailPageOpen}
              onCancel={onCancel}
              tables={tables}
            />
          )}
        </StyledGeneralInfo>
        <Box
          sx={(theme) => ({
            padding: "15px 0px",
            backgroundColor:
              theme.palette.mode === "light" ? "#F0F4FF" : "#414a60",
          })}
        >
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginRight: "20px",
            }}
          >
            <StyledTableText>{t("table")}</StyledTableText>
            {showReorderTableSave && (
              <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <StyledCancel
                  onClick={() => {
                    setTables([...originalTablesRef.current]);
                    setShowReorderTableSave(false);
                  }}
                >
                  {t("cancel")}
                </StyledCancel>
                <StyledSaveBox
                  onClick={async () => {
                    await reorderReturnDefinitionTables();
                    setTables([...originalTablesRef.current]);
                    setShowReorderTableSave(false);
                  }}
                >
                  <Typography fontSize={"inherit"} mr={"3px"}>
                    {t("save")}
                  </Typography>
                  <CheckIcon fontSize={"inherit"} />
                </StyledSaveBox>
              </Box>
            )}
          </Box>

          <Box height={"100%"} p={"0 10px"}>
            {data && (
              <ReturnDefinitionsTable
                tables={tables}
                setTables={setTables}
                currentReturnDefinition={data}
                setCurrentReturnDefinition={setData}
                saveReturnDefinition={saveReturnDefinition}
                generalInfoEditMode={GeneralInfoEditMode}
                setIsAddNewOpen={setIsAddNewTableOpen}
                isAddNewOpen={isAddNewTableOpen}
                setShowReorderTableSave={setShowReorderTableSave}
              />
            )}
          </Box>
        </Box>
      </StyledRoot>
    </Slide>
  );
};

export default ReturnDefinitionsDetails;
