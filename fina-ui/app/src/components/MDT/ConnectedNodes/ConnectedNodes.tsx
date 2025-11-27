import GridTable from "../../common/Grid/GridTable";
import { useTranslation } from "react-i18next";
import { Box, styled } from "@mui/system";
import { MDTDependency } from "../../../types/mdt.type";
import React from "react";
import MDTTreeNodeIcon from "../Tree/MDTTreeNodeIcon";
import Tooltip from "../../common/Tooltip/Tooltip";
import { getPath } from "../../../api/services/MDTService";

interface ConnectedNodesProps {
  connectedNodes: MDTDependency[];
  setExpandPath: (path: number[]) => void;
  setLoading: (isLoad: boolean) => void;
}

const StyledBox = styled(Box)(({ theme }) => ({
  marginTop: 20,
  ...(theme.palette.mode === "light" && {
    border: (theme as any).general.border,
    borderTop: "hidden",
    borderRadius: 8,
  }),
}));

const StyledIconWrapper = styled("div")({
  cursor: "pointer",
  transition: "transform 0.2s ease",
  "&:hover": {
    transform: "scale(1.2)",
  },
});

const ConnectedNodes: React.FC<ConnectedNodesProps> = ({
  connectedNodes,
  setExpandPath,
  setLoading,
}) => {
  const { t } = useTranslation();
  const columns = [
    {
      field: "code",
      headerName: t("code"),
    },
    {
      field: "description",
      headerName: t("description"),
      hideCopy: true,
    },
    {
      field: "usedBy",
      headerName: t("relation"),
      hideCopy: true,
    },
    {
      field: "",
      headerName: t(""),
      hideCopy: true,
      hideSort: true,
      width: 50,
      renderCell: (_: string, node: MDTDependency) => {
        return (
          <Tooltip title={t("movetonode")} arrow>
            <StyledIconWrapper
              onClick={() => {
                setLoading(true);
                getPath(node.id)
                  .then((resp) => {
                    setExpandPath(resp.data);
                  })
                  .catch(() => {})
                  .finally(() => setLoading(false));
              }}
            >
              <MDTTreeNodeIcon nodeType={node.type} />
            </StyledIconWrapper>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <StyledBox>
      <GridTable
        columns={columns}
        rows={connectedNodes ? connectedNodes : []}
        selectedRows={[]}
        setRows={() => {}}
        rowOnClick={() => {}}
        loading={false}
        emptyIconStyle={{
          position: "inherit",
          padding: 10,
        }}
        size={"small"}
      />
    </StyledBox>
  );
};

export default ConnectedNodes;
