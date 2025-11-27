import { Box, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ConnectedCompaniesGraph from "./ConnectedCompaniesGraph";
import ConnectedCompaniesConnectionInfo from "./ConnectedCompaniesConnectionInfo";
import ConnectedCompaniesGeneralInfo from "./ConnectedCompaniesGeneralInfo";
import { styled } from "@mui/material/styles";
import { FiTypeDataType } from "../../types/fi.type";
import { ConnectedCompaniesDataType } from "../../types/connectedCompanies.type";
import { Edge } from "react-flow-renderer";

const StyledMainLayout = styled(Box)(({ theme }: { theme: any }) => ({
  padding: "16px",
  backgroundColor: theme.palette.bodyBackgroundColor,
  height: "100%",
  width: "100%",
  boxSizing: "border-box",
  overflow: "hidden",
}));

const StyledRoot = styled(Box)(({ theme }: { theme: any }) => ({
  backgroundColor: theme.palette.bodyBackgroundColor,
  height: "100%",
  boxSizing: "border-box",
  display: "flex",
  width: "100%",
  flexDirection: "column",
}));

const StyledHeaderText = styled(Typography)(({ theme }: { theme: any }) => ({
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "24px",
  color: theme.palette.textColor,
  display: "inline",
  marginBottom: 16,
}));

const StyledGridContainer = styled(Grid)({
  boxSizing: "border-box",
  marginTop: 0,
  paddingTop: 0,
  overflow: "hidden",
  height: "100%",
  width: "100%",
  marginLeft: 0,
  borderRadius: 8,
});

const StyledGridItem = styled(Grid)({
  height: "100%",
  overflow: "hidden",
  borderRadius: "0px !important",
  padding: "0px !important",
});

const StyledNetworkChartsPaper = styled(Paper)(({ theme }: { theme: any }) => ({
  backgroundColor: theme.palette.paperBackground,
  height: "100%",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledChart = styled("div")(({ theme }: { theme: any }) => ({
  height: "100%",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& .react-flow__node": {
    fontSize: "12px",
    fontWeight: 400,
    lineHeight: "150%",
    padding: "8px 15px",
    minWidth: "200px",
    width: "fit-content",
    maxWidth: "500px",
    lineBreak: "anywhere",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  "& .react-flow__edge-path:hover": {
    strokeWidth: "6px !important",
    cursor: "pointer",
  },
  "& .react-flow__controls-button": {
    marginBottom: "3px",
    borderBottom: "none",
    backgroundColor:
      theme.palette.mode === "light" ? "#FFFFFF" : "rgba(240, 242, 243, 0.7)",
    borderRadius: "2px",
  },
  "& .react-flow__controls": {
    boxShadow: "none",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  "& .react-flow__handle-bottom": {
    visibility: "hidden",
  },
  "& .react-flow__handle-top": {
    visibility: "hidden",
  },
  "& .react-flow__attribution": {
    left: "0 !Important",
    display: "none",
  },
}));

const StyledPaper = styled(Paper)({
  width: "100%",
  height: "100%",
  boxShadow: "none",
  borderRadius: 0,
  display: "flex",
  overflowY: "auto",
  overflowX: "hidden",
});

interface ConnectedCompaniesPageProps {
  getEdgeInformation: (edge: Edge) => void;
  saveConnectionDetails: (connection: ConnectedCompaniesDataType) => void;
  selectedItem: ConnectedCompaniesDataType | null;
  setSelectedItem: React.Dispatch<
    React.SetStateAction<ConnectedCompaniesDataType | null>
  >;
  fiTypes: FiTypeDataType[];
}

const ConnectedCompaniesPage: React.FC<ConnectedCompaniesPageProps> = ({
  getEdgeInformation,
  saveConnectionDetails,
  selectedItem,
  setSelectedItem,
  fiTypes,
}) => {
  const { t } = useTranslation();

  const [isNodeInfoOpen, setIsNodeInfoOpen] = useState(false);
  const [isEdgeInfoOpen, setIsEdgeInfoOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  const onEdgeClickFunction = (edge: Edge) => {
    getEdgeInformation(edge);
    setIsEdgeInfoOpen(true);
    setIsNodeInfoOpen(false);
  };

  return (
    <StyledMainLayout display={"flex"} flexDirection={"column"} height={"100%"}>
      <StyledRoot>
        <StyledHeaderText>{t("connectedCompanies")}</StyledHeaderText>
        <StyledGridContainer
          container
          spacing={1}
          height={"100%"}
          direction={"row"}
          xs={12}
          item
        >
          <StyledGridItem
            item
            xs={isNodeInfoOpen || isEdgeInfoOpen ? 9 : 12}
            height={"100%"}
            width={"100%"}
          >
            <StyledNetworkChartsPaper>
              <StyledChart>
                <ConnectedCompaniesGraph
                  setIsNodeInfoOpen={setIsNodeInfoOpen}
                  isNodeInfoOpen={isNodeInfoOpen}
                  isEdgeInfoOpen={isEdgeInfoOpen}
                  setIsEdgeInfoOpen={setIsEdgeInfoOpen}
                  onEdgeClickFunction={onEdgeClickFunction}
                  selectedItem={selectedItem}
                  setSelectedItem={setSelectedItem}
                  loading={loading}
                  setLoading={setLoading}
                  fiTypes={fiTypes}
                />
              </StyledChart>
            </StyledNetworkChartsPaper>
          </StyledGridItem>
          <StyledGridItem
            item
            xs={!isNodeInfoOpen && !isEdgeInfoOpen ? 0 : 3}
            display={!isNodeInfoOpen && !isEdgeInfoOpen ? "none" : undefined}
          >
            <StyledPaper>
              {isEdgeInfoOpen && selectedItem && (
                <ConnectedCompaniesConnectionInfo
                  edge={selectedItem}
                  setIsEdgeInfoOpen={setIsEdgeInfoOpen}
                  saveConnectionDetails={saveConnectionDetails}
                />
              )}
              {isNodeInfoOpen && selectedItem && (
                <ConnectedCompaniesGeneralInfo
                  selectedItem={selectedItem}
                  setIsRightSideOpen={setIsNodeInfoOpen}
                />
              )}
            </StyledPaper>
          </StyledGridItem>
        </StyledGridContainer>
      </StyledRoot>
    </StyledMainLayout>
  );
};

export default ConnectedCompaniesPage;
