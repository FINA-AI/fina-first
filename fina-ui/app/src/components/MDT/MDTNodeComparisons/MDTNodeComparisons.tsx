import { Box, styled } from "@mui/system";
import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import React, { useEffect, useState } from "react";
import MDTNodeComparisonsCard from "./MDTNodeComparisonsCard";
import MDTNodeComparisonsCardEdit from "./Edit/MDTNodeComparisonsCardEdit";
import { MDTComparisonData, MdtNode } from "../../../types/mdt.type";
import { Comparison } from "../../../types/comparison.type";

interface MDTNodeComparisonsProps {
  onSaveFunction: (
    data: MDTComparisonData,
    setIsAddNewOpen: (open: boolean) => void
  ) => void;
  comparisons: Comparison[];
  validMdtCodes: string[];
  selectedNode: MdtNode | null;
  currentNode: MdtNode | null;
  hasAmendPermission: boolean;
  loading: boolean;
  onEditSaveFunction(data: MDTComparisonData): void;
  onDeleteFunction(data: MDTComparisonData): void;
}

const StyledAddNewBox = styled(Box)(() => ({ theme }) => ({
  display: "flex",
  justifyContent: "end",
  padding: "8px 16px",
  color: "#FFF",
  lineHeight: "16px",
  fontSize: "11px",
  fontWeight: 400,
  background: theme.palette.paperBackground,
  borderRadius: "4px",
  border: `1px solid ${theme.palette.mode === "dark" ? "#2D3747" : "#EAECF0"}`,
  marginTop: "8px",
  "&:hover": {
    border: theme.palette.borderColor,
    backgroundColor: theme.palette.action.hover,
  },
}));
const StyledAddNewBtn = styled(Box, {
  shouldForwardProp: (prop: string) => !prop.startsWith("_"),
})<{ _currentNodeId?: number }>(() => ({ theme, _currentNodeId }) => ({
  cursor: "pointer",
  display: "flex",
  width: "fit-content",
  color:
    _currentNodeId && _currentNodeId < 0
      ? "rgba(0, 0, 0, 0.26)"
      : theme.palette.primary.main,
  "& .MuiSvgIcon-root": {
    width: "15px",
    height: "15px",
    marginLeft: "5px",
  },
}));

const MDTNodeComparisons: React.FC<MDTNodeComparisonsProps> = ({
  onDeleteFunction,
  onSaveFunction,
  onEditSaveFunction,
  comparisons,
  validMdtCodes,
  selectedNode,
  currentNode,
  hasAmendPermission,
}) => {
  const { t } = useTranslation();
  const [isAddNewOpen, setIsAddNewOpen] = useState(false);

  useEffect(() => {
    setIsAddNewOpen(false);
  }, [currentNode?.id]);

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      height={"100%"}
      width={"100%"}
    >
      {comparisons.map((item, index) => {
        return (
          <MDTNodeComparisonsCard
            data={item}
            index={index}
            key={`${currentNode?.id}-${item?.id}`}
            onEditSaveFunction={onEditSaveFunction}
            onDeleteFunction={onDeleteFunction}
            validMdtCodes={validMdtCodes}
            hasAmendPermission={hasAmendPermission}
          />
        );
      })}
      {isAddNewOpen ? (
        <MDTNodeComparisonsCardEdit
          key={`${currentNode?.id}-${currentNode?.code}`}
          setIsOpen={setIsAddNewOpen}
          onSaveFunction={(data) => onSaveFunction(data, setIsAddNewOpen)}
          validMdtCodes={validMdtCodes}
          currComparison={
            {
              node: selectedNode,
              condition: "EQUALS",
            } as MDTComparisonData
          }
        />
      ) : (
        hasAmendPermission && (
          <StyledAddNewBox>
            <StyledAddNewBtn
              _currentNodeId={currentNode?.id}
              onClick={() => {
                currentNode && currentNode?.id > 0 && setIsAddNewOpen(true);
              }}
              data-testid={"addNewBtn"}
            >
              {t("addNew")} <AddIcon />
            </StyledAddNewBtn>
          </StyledAddNewBox>
        )
      )}
    </Box>
  );
};

export default MDTNodeComparisons;
