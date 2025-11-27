import React, { useEffect, useState } from "react";
import { Box, styled } from "@mui/system";
import { Typography } from "@mui/material";
import MDTNodeGeneralInfo from "./MDTGeneralInfo/MDTNodeGeneralInfo";
import { useTranslation } from "react-i18next";
import MDTEquation from "./MDTGeneralInfo/MDTEquation";
import ConnectedNodes from "./ConnectedNodes/ConnectedNodes";
import ConnectedForms from "./ConnectedForms/ConnectedForms";
import MDTNodeComparisonsContainer from "../../containers/MDT/MDTNodeComparisonsContainer";
import MDTDetailsMDTChooser from "./MDTGeneralInfo/MDTDetailsMDTChooser";
import { MDTDependency, MdtNode, MDTNodeType } from "../../types/mdt.type";
import SimpleLoadMask from "../common/SimpleLoadMask";

interface MDTNodeDetailsProps {
  currentNode: MdtNode | null;
  connectedNodes: MDTDependency[];
  connectedForms: MDTDependency[];
  validMdtCodes: string[];
  editMode: boolean;
  setEditMode: (edit: boolean) => void;
  setCurrentNode: React.Dispatch<React.SetStateAction<MdtNode | null>>;
  onMdtNodeDetailsCloseButtonClick: () => void;
  toggleMainCardWidth: () => void;
  isMinimized: boolean;
  hasAmendPermission: boolean;
  setExpandPath: (path: number[]) => void;

  saveMDT(node: MdtNode | null, setData?: (node: MdtNode) => void): void;
}

export interface ListElementNode {
  code?: string;
  name?: string;
  type?: string;
}

const StyledRootBox = styled(Box)(() => ({
  display: "flex",
  height: "100%",
  flexDirection: "column",
  overflow: "auto",
  boxShadow: "rgba(53, 47, 47, 0.03) -10px 0px 12px 0px",
}));

const StyledGeneralInfoBox = styled(Box)(({ theme }: { theme: any }) => ({
  padding: "12px",
  borderTop: theme.palette.mode === "light" && theme.general.border,
  position: "sticky",
  top: 0,
  backgroundColor: theme.palette.paperBackground,
  zIndex: theme.zIndex.drawer - 2,
}));

const StyledComparisonBox = styled(Box)(({ theme }: { theme: any }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.primary.light : "#FFFFFF",
  padding: "12px",
  borderTop: theme.palette.mode === "light" && theme.general.border,
}));

const StyledConnectionsBox = styled(Box)(({ theme }: { theme: any }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#3C4D68" : "",
  padding: "12px",
  borderTop: theme.palette.mode === "light" && theme.general.border,
}));

const StyledTypography = styled(Typography)(({ theme }: { theme: any }) => ({
  color: theme.palette.mode === "dark" ? "#FFF" : "#2C3644",
  fontWeight: 600,
  fontSize: "12px",
  lineHeight: "18px",
}));

const StyledMinimizedBox = styled(Box, {
  shouldForwardProp: (prop: string) => !prop.startsWith("_"),
})<{ _node: any }>(
  ({ theme, _node }) =>
    (_node?.type === MDTNodeType.VARIABLE ||
      _node?.type === MDTNodeType.LIST) && {
      padding: "12px",
      borderTop:
        theme.palette.mode === "light" && (theme as any).general.border,
    }
);

const MDTNodeDetails: React.FC<MDTNodeDetailsProps> = ({
  connectedNodes,
  connectedForms,
  validMdtCodes,
  editMode,
  saveMDT,
  setEditMode,
  currentNode,
  onMdtNodeDetailsCloseButtonClick,
  setCurrentNode,
  toggleMainCardWidth,
  isMinimized,
  hasAmendPermission,
  setExpandPath,
}) => {
  const { t } = useTranslation();
  const [data, setData] = useState<MdtNode>({} as MdtNode);
  const [originalData, setOriginalData] = useState<MdtNode | null>(currentNode);
  const [listElementNode, setListElementNode] = useState<ListElementNode>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentNode) {
      setOriginalData(currentNode);
      setData(currentNode);
    }
  }, [currentNode]);
  useEffect(() => {
    const node = getNodeFromConnectedNodes();
    setListElementNode(node);
  }, [connectedNodes]);

  const isUsedByAnotherNode = connectedNodes.some(
    (n) => n.usedBy === "Used By"
  );

  const onSave = async (val: string) => {
    if (!editMode) {
      await saveMDT({ ...data, equation: val });
      setOriginalData((prev) => (prev ? { ...prev, equation: val } : prev));
      setData({ ...data, equation: val });
    } else {
      setCurrentNode((prev) => (prev ? { ...prev, equation: val } : prev));
    }
  };

  const getNodeFromConnectedNodes = () => {
    const equation = currentNode?.equation;
    const connectedNode = connectedNodes.find(
      (node) => node.id?.toString() == equation
    );
    return {
      name: connectedNode?.description,
      code: connectedNode?.code,
      type: connectedNode?.type,
    };
  };

  const clearSelectedMdtNode = () => {
    if (currentNode?.equation !== data.equation) {
      const node = getNodeFromConnectedNodes();
      setListElementNode(node);
    }
  };

  const GetEditComponents = () => {
    switch (data?.type) {
      case MDTNodeType.VARIABLE:
        return (
          currentNode && (
            <MDTEquation
              currentNode={currentNode}
              validMdtCodes={validMdtCodes}
              onSave={(val) => {
                onSave(val);
              }}
              onCancel={() => {
                setData((prev) => (prev ? { ...prev } : prev));
                setCurrentNode((prev) => (prev ? { ...prev } : prev));
              }}
              hasAmendPermission={hasAmendPermission}
            />
          )
        );
      case MDTNodeType.LIST:
        return (
          <MDTDetailsMDTChooser
            currentNode={data}
            setCurrentNode={setData}
            editMode={editMode}
            listElementNode={listElementNode}
            setListElementNode={setListElementNode}
          />
        );
      default: {
      }
    }
  };

  return (
    <>
      {data && (
        <StyledRootBox data-testid={"mdt-node-details"}>
          <StyledGeneralInfoBox data-testid={"general-info"}>
            <MDTNodeGeneralInfo
              data={data}
              setData={setData}
              editMode={editMode}
              setEditMode={setEditMode}
              saveMDT={(node) => saveMDT(node, setData)}
              originalData={originalData}
              onMdtNodeDetailsCloseButtonClick={
                onMdtNodeDetailsCloseButtonClick
              }
              clearSelectedMdtNode={clearSelectedMdtNode}
              toggleFunction={toggleMainCardWidth}
              isMinimized={isMinimized}
              hasAmendPermission={hasAmendPermission}
              isUsedByAnotherNode={isUsedByAnotherNode}
            />
          </StyledGeneralInfoBox>
          {!isMinimized && (
            <>
              <StyledMinimizedBox _node={data}>
                {GetEditComponents()}
              </StyledMinimizedBox>
              {data?.type !== MDTNodeType.NODE &&
                data?.type !== MDTNodeType.DATA && (
                  <StyledComparisonBox>
                    <StyledTypography>{t("comparison")}</StyledTypography>
                    <Box height={"100%"}>
                      <MDTNodeComparisonsContainer
                        currentNode={currentNode}
                        validMdtCodes={validMdtCodes}
                        hasAmendPermission={hasAmendPermission}
                      />
                    </Box>
                  </StyledComparisonBox>
                )}
              <StyledConnectionsBox>
                <Box>
                  <StyledTypography>{t("connectedNodes")}</StyledTypography>
                  <Box>
                    <ConnectedNodes
                      connectedNodes={connectedNodes}
                      setExpandPath={setExpandPath}
                      setLoading={setLoading}
                    />
                  </Box>
                </Box>
              </StyledConnectionsBox>
              <StyledConnectionsBox>
                <Box>
                  <StyledTypography>{t("connectedForm")}</StyledTypography>
                  <Box>
                    <ConnectedForms connectedForms={connectedForms} />
                  </Box>
                </Box>
              </StyledConnectionsBox>
            </>
          )}
          {loading && <SimpleLoadMask loading={true} color={"primary"} />}
        </StyledRootBox>
      )}
    </>
  );
};

export default MDTNodeDetails;
