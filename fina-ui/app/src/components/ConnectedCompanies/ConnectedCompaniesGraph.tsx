import React, { useEffect, useState } from "react";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import HelpIcon from "@mui/icons-material/Help";
import RemoveIcon from "@mui/icons-material/Remove";
import ReactFlow, {
  Controls,
  Edge,
  MarkerType,
  MiniMap,
  useEdgesState,
  useNodesState,
} from "react-flow-renderer";
import { Box, IconButton, Popover, Select } from "@mui/material";
import Divider from "@mui/material/Divider";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useTranslation } from "react-i18next";
import CircleIcon from "@mui/icons-material/Circle";
import MenuItem from "@mui/material/MenuItem";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import Tooltip from "../../components/common/Tooltip/Tooltip";
import { loadConnectionGraph } from "../../api/services/legalPersonService";
import { useParams } from "react-router-dom";
import withLoading from "../../hoc/withLoading";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CustomEdgeIcon from "./CustomEdgeIcon";
import { styled, useTheme } from "@mui/material/styles";
import {
  ConnectedCompaniesDataType,
  GraphEdgeType,
} from "../../types/connectedCompanies.type";
import { LegalPersonDataType } from "../../types/legalPerson.type";

const StyledRootBox = styled(Box)(() => ({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
}));

const StyledInnerBox = styled(Box)(() => ({
  display: "flex",
  width: "100%",
  flexDirection: "row",
  float: "right",
  justifyContent: "flex-end",
}));

const StyledNodeDescription = styled(Box)(() => ({
  fontSize: "13px",
  padding: "10px 12px",
  fontWeight: 400,
  lineHeight: "16px",
  textTransform: "capitalize",
}));

const StyledNodeKey = styled("span")(() => ({
  color: "#AFAFAF",
  marginRight: "2px",
}));

const StyledNodeValue = styled("span")(() => ({
  color: "#FFFFFF",
  marginLeft: "2px",
}));

const StyledGraphInfoContainer = styled(Box)(({ theme }: { theme: any }) => ({
  display: "flex",
  justifyContent: "center",
  padding: "12px",
  flexDirection: "column",
  border: theme.palette.borderColor,
}));

const StyledGraphInfoTitleBox = styled(Box)(() => ({
  color: "#FFFFFF",
  fontWeight: 600,
  fontSize: "11px",
  lineHeight: "150%",
  textTransform: "capitalize",
  marginBottom: "15px",
}));

const StyledGraphPrimaryText = styled(Box)(() => ({
  fontSize: "10px",
  fontWeight: 400,
  lineHeight: "130%",
  marginBottom: "13px",
  "& .MuiSvgIcon-root": {
    width: "8px",
    height: "8px",
    marginRight: "5px",
  },
}));

const StyledGraphSecondaryText = styled(Box)(() => ({
  fontSize: "10px",
  fontWeight: 400,
  lineHeight: "130%",
  marginBottom: "5px",
  display: "flex",
  alignItems: "center",
}));

const StyledSelect = styled(Select)(({ theme }: { theme: any }) => ({
  paddingLeft: "0px",
  background: theme.palette.paperBackground,
  margin: "4px 8px 4px 4px",
  width: "auto",
  "& .MuiSelect-select": {
    width: "150px",
    height: "20px",
    background: theme.palette.paperBackground,
    borderRadius: "2px",
    padding: "4px 8px 4px 4px",
    fontSize: "11px",
    lineHeight: "16px",
    fontWeight: 400,
    display: "flex",
    alignItems: "center",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    padding: "0px",
  },
}));

const StyledSelectSpan = styled("span")(() => ({
  padding: "4px 0px 4px 8px",
  fontSize: "11px",
  lineHeight: "16px",
  fontWeight: 400,
  display: "flex",
  alignItems: "center",
  color: "#8695B1",
}));

const StyledDoubleArrow = styled(IconButton)(({ theme }) => ({
  "& .MuiSvgIcon-root": {
    color: theme.palette.mode === "dark" ? "#C3CAD8" : "#a3adbb",
    border: "none",
    borderRadius: "2px",
    background: "none",
  },
}));

const StyledPersonIconBox = styled(Box)(() => ({
  backgroundColor: "#FFFFFF",
  borderRadius: "50px",
  width: 12,
  height: 12,
  marginRight: 5,
  marginLeft: 5,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledHelpIconButton = styled(IconButton)(({ theme }) => ({
  background: "none",
  border: "none",
  height: "16px",
  width: "16px",
  color:
    theme.palette.mode === "light" ? "#2B3748" : "rgba(240, 242, 243, 0.7)",
}));

const MenuProps = {
  PaperProps: {
    sx: {
      padding: "0px 12px !important",
      // transform: "matrix(1, 0, 0, 1, -23, 0) !important",
      "& .MuiMenuItem-root": {
        background: "inherit",
        fontSize: "11px",
        lineHeight: "16px",
        fontWeight: 400,
        textTransform: "capitalize",
        padding: "4px",
        minWidth: "200px",
      },
      "& .Mui-selected": {
        background: "rgba(255, 255, 255, 0.1)",
      },
      "& .MuiMenuItem-root:hover": {
        background: "#FFFFFF0D",
      },
    },
  },
};

const colorPallete = [
  "#8378F7",
  "#AC4DF6",
  "#B760F5",
  "#F88CEF",
  "#E15891",
  "#DE6257",
  "#AD8144",
  "#888F38",
  "#61973B",
  "#3D9B45",
  "#3C9972",
  "#3D959D",
  "#FEC751",
];

const edgeTypes = {
  edgeIcon: CustomEdgeIcon,
};

interface ConnectedCompaniesGraphProps {
  setIsNodeInfoOpen: (value: boolean) => void;
  isNodeInfoOpen: boolean;
  onEdgeClickFunction: (edge: Edge) => void;
  setIsEdgeInfoOpen: (value: boolean) => void;
  isEdgeInfoOpen: boolean;
  selectedItem: ConnectedCompaniesDataType | null;
  setSelectedItem: React.Dispatch<
    React.SetStateAction<ConnectedCompaniesDataType | null>
  >;
  loading: boolean;
  setLoading: (value: boolean) => void;
  fiTypes: string[];
}

const ConnectedCompaniesGraph: React.FC<ConnectedCompaniesGraphProps> = ({
  setIsNodeInfoOpen,
  isNodeInfoOpen,
  onEdgeClickFunction,
  setIsEdgeInfoOpen,
  isEdgeInfoOpen,
  selectedItem,
  setSelectedItem,
  loading,
  setLoading,
  fiTypes,
}) => {
  const { t } = useTranslation();
  const theme: any = useTheme();

  const [filterDependencyType, setFilterDependencyType] =
    useState<string>("ALL");
  const [elk, setElk] = useState<any>();

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [data, setData] = useState([]);
  const { legalPersonId } = useParams<{ legalPersonId: string }>();
  const { openErrorWindow } = useErrorWindow();

  useEffect(() => {
    setLoading(true);
    if (elk) {
      init();
    }
  }, [filterDependencyType, elk]);

  useEffect(() => {
    import("elkjs").then((ELK) => {
      setElk(new ELK.default());
    });
  }, []);

  const onEdgeLineSelected = (edge: Edge) => {
    setEdges(
      edges.map((item) => {
        return { ...item, animated: edge.id == item.id };
      })
    );
  };

  const init = () => {
    loadConnectionGraph(Number(legalPersonId))
      .then((resp) => {
        setData(resp.data);
        const data: ConnectedCompaniesDataType[] = resp.data;
        const dependentNodes = new Map();

        let initialNodes = data.map((bank) => {
          let nodeT = "default";

          bank.dependencies?.forEach((bd) =>
            dependentNodes.set(bd.legalPerson.id, bd)
          );

          return {
            id: String(bank.source.id),
            type: nodeT,
            data: {
              label: getNodeLabel(
                bank.source.name,
                bank.source.fiType?.code,
                bank
              ),
            },
            position: { x: null, y: null },
            style: getNodeStyle(bank.source),
            sourcePosition: nodeT !== "output" ? "bottom" : "",
            targetPosition: nodeT !== "input" ? "top" : "",
            width: 500,
            height: 75,
          };
        });

        dependentNodes.forEach((bank) => {
          const nodeT: string = "default";
          if (!initialNodes.find((n) => n.id === bank.legalPerson.id)) {
            initialNodes.push({
              id: String(bank.legalPerson.id),
              type: nodeT,
              data: {
                label: getNodeLabel(
                  bank.legalPerson.name,
                  bank.legalPerson.fiType?.code,
                  {
                    ...bank,
                    source: bank.legalPerson,
                  }
                ),
              },
              position: { x: null, y: null },
              style: getNodeStyle(bank.legalPerson),
              sourcePosition: nodeT !== "output" ? "bottom" : "",
              targetPosition: nodeT !== "input" ? "top" : "",
              width: 500,
              height: 75,
            });
          }
        });

        let initialEdges: Edge[] = [];
        for (let o of data) {
          const dependencies = o.dependencies ?? [];
          let currentBankChild = dependencies
            .filter(
              (d) =>
                d.legalPerson.id !== o.source.id &&
                (filterDependencyType !== "ALL"
                  ? d.dependencyType !== filterDependencyType ||
                    d.dependencyType === "BOTH"
                  : true) &&
                !initialEdges.find(
                  (item) =>
                    item.target === String(d.legalPerson.id) &&
                    item.source === String(o.source.id)
                )
            )
            .map((bank): Edge => {
              const isShare = bank.dependencyType === "AFFILIATED";
              return {
                id: String(bank.legalPerson.id) + o.source.id,
                source: String(bank.legalPerson.id),
                target: String(o.source.id),
                label: "",
                type: bank.dependencyType === "BOTH" ? "edgeIcon" : undefined,
                animated: false,
                markerEnd: {
                  type: MarkerType.Arrow,
                  color:
                    isShare || bank.dependencyType === "BOTH"
                      ? "#2962FF"
                      : "#FD6B0A",
                  strokeWidth:
                    isShare || bank.dependencyType === "BOTH" ? 3 : 0,
                },
                style: {
                  stroke:
                    !isShare && bank.dependencyType !== "BOTH"
                      ? "#FD6B0A"
                      : "#2962FF",
                  strokeWidth: 2,
                },
                data: {
                  connectionType: bank.dependencyType,
                },
              };
            });

          initialEdges = [...initialEdges, ...currentBankChild];
        }
        setEdges(initialEdges);

        const graph = {
          id: "root",
          layoutOptions: { "elk.algorithm": "layered" },
          children: [...initialNodes],
          edges: initialEdges,
        };
        if (!elk) {
          return;
        }

        elk
          .layout(graph)
          .then((res: any) => {
            setNodes(
              res.children
                .map((child: any) => {
                  return { ...child, position: { x: child.x, y: child.y } };
                })
                .filter((node: any) =>
                  initialEdges.some(
                    (edge: Edge) =>
                      edge.source === node.id || edge.target === node.id
                  )
                )
            );
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => setLoading(false));
  };

  const handleClick = (event: {
    currentTarget: React.SetStateAction<HTMLElement | null>;
  }) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const getGraphDetailInfo = () => {
    return (
      <StyledGraphInfoContainer>
        <StyledGraphInfoTitleBox>{t("fiTypes")}</StyledGraphInfoTitleBox>
        {fiTypes.map((type: string, index: number) => {
          return (
            <StyledGraphPrimaryText key={index}>
              <CircleIcon style={{ color: getColor(type) }} /> {t(type)}
            </StyledGraphPrimaryText>
          );
        })}
        <StyledGraphPrimaryText>{t("connect")}</StyledGraphPrimaryText>
        <StyledGraphSecondaryText>
          <RemoveIcon style={{ color: "#2962FF" }} /> {t("connectWithShare")}
        </StyledGraphSecondaryText>
        <StyledGraphSecondaryText>
          <RemoveIcon style={{ color: "#FF8D00" }} /> {t("connectWithManager")}
        </StyledGraphSecondaryText>
        <StyledGraphSecondaryText>
          <StyledPersonIconBox>
            <AccountCircleIcon sx={{ color: "#FF8D00", fontSize: 16 }} />
          </StyledPersonIconBox>
          {t("connectWithSharesAndManager")}
        </StyledGraphSecondaryText>
      </StyledGraphInfoContainer>
    );
  };

  const getNodeDescription = (bank: ConnectedCompaniesDataType) => {
    return (
      <StyledNodeDescription display={"flex"} flexDirection={"column"}>
        <div style={{ marginTop: "5px" }}>
          <StyledNodeKey>{t("status") + ": "}</StyledNodeKey>
          <StyledNodeValue>{t(bank.source.status)}</StyledNodeValue>
        </div>
        <div style={{ marginTop: "5px" }}>
          <StyledNodeKey>{t("companyId") + ": "}</StyledNodeKey>
          <StyledNodeValue>
            {bank.source["identificationNumber"]}
          </StyledNodeValue>
        </div>
        <div style={{ marginTop: "5px" }}>
          <StyledNodeKey>{t("country") + ": "}</StyledNodeKey>
          <StyledNodeValue>{bank.source.country?.name}</StyledNodeValue>
        </div>
      </StyledNodeDescription>
    );
  };

  const getNodeLabel = (
    text: string,
    type: string | undefined,
    bank: ConnectedCompaniesDataType
  ) => {
    return (
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        onClick={() => {
          setIsNodeInfoOpen(true);
          setIsEdgeInfoOpen(false);
          setSelectedItem(bank);
        }}
      >
        <BusinessOutlinedIcon
          style={{ marginRight: "5px", width: "19px", height: "19px" }}
        />
        {text}
        <Divider
          orientation="vertical"
          flexItem
          style={{
            margin: "3px 5px",
            background: "#FFFFFF",
          }}
        />
        {type}
        <Tooltip title={getNodeDescription(bank)} arrow={false}>
          <InfoOutlinedIcon
            style={{ marginLeft: "5px", width: "19px", height: "19px" }}
          />
        </Tooltip>
      </Box>
    );
  };

  const getColor = (type: string): string => {
    const index = fiTypes.findIndex((item) => item === type);
    if (index === -1) return "#6E60F5";
    return colorPallete[index % colorPallete.length] || "#6E60F5";
  };

  const getNodeStyle = (legalPerson: LegalPersonDataType) => {
    let color = "";
    if (legalPerson?.bank) {
      color = getColor(legalPerson?.fiType?.code ?? "");
    } else {
      color = "#4DA8DB";
    }

    return {
      backgroundColor: color,
      borderRadius: 2,
      color: "#FFFFFF",
      borderColor: color,
    };
  };

  useEffect(() => {}, [data]);

  return (
    <StyledRootBox>
      <StyledInnerBox>
        <StyledSelect
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={filterDependencyType}
          MenuProps={MenuProps}
          onChange={(event) =>
            setFilterDependencyType(event.target.value as string)
          }
          startAdornment={<StyledSelectSpan>{t("sortBy")}</StyledSelectSpan>}
        >
          <MenuItem value={"ALL"}>{t("allConnectedCompanies")}</MenuItem>
          <MenuItem value={"ASSOCIATED"}>{t("affiliatedCompanies")}</MenuItem>
          <MenuItem value={"AFFILIATED"}>{t("associatedCompanies")}</MenuItem>
        </StyledSelect>
        {!isNodeInfoOpen && !isEdgeInfoOpen && (
          <StyledDoubleArrow
            style={{
              backgroundColor: "transparent",
              border: "none",
              display: "flex",
              justifyContent: "flex-start",
            }}
            size="small"
            onClick={() => {
              if (
                selectedItem &&
                "destinationsConnectedCompanies" in selectedItem
              ) {
                setIsEdgeInfoOpen(!isEdgeInfoOpen);
                return;
              }
              setIsNodeInfoOpen(!isNodeInfoOpen);
            }}
            disabled={!selectedItem}
          >
            <KeyboardDoubleArrowLeftIcon />
          </StyledDoubleArrow>
        )}
      </StyledInnerBox>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        snapToGrid={true}
        fitView
        style={{
          backgroundColor: theme.palette.paperBackground,
        }}
        onEdgeClick={(event, edge) => {
          onEdgeClickFunction(edge as GraphEdgeType);
          onEdgeLineSelected(edge);
        }}
        hidden={loading}
        edgeTypes={edgeTypes}
        onEdgesChange={onEdgesChange}
      >
        <MiniMap
          nodeStrokeColor={(n) => n.style?.backgroundColor || "#000"}
          nodeColor={(n) => n.style?.backgroundColor || "#000"}
          nodeBorderRadius={2}
          style={{
            backgroundColor: theme.palette.paperBackground,
          }}
        />

        <Controls showInteractive={false} showFitView={false}>
          <div>
            <StyledHelpIconButton size="small" onClick={handleClick}>
              <HelpIcon />
            </StyledHelpIconButton>
            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              {getGraphDetailInfo()}
            </Popover>
          </div>
        </Controls>
      </ReactFlow>
    </StyledRootBox>
  );
};

export default withLoading(ConnectedCompaniesGraph);
