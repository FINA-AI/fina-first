import GridTable from "../../common/Grid/GridTable";
import { useTranslation } from "react-i18next";
import { Box, styled } from "@mui/system";
import { MDTDependency } from "../../../types/mdt.type";
import React from "react";

interface ConnectedFormsProps {
  connectedForms: MDTDependency[];
}

const StyledBox = styled(Box)(({ theme }) => ({
  marginTop: 20,
  ...(theme.palette.mode === "light" && {
    border: (theme as any).general.border,
    borderTop: "hidden",
    borderRadius: 8,
  }),
}));

const ConnectedForms: React.FC<ConnectedFormsProps> = ({ connectedForms }) => {
  const { t } = useTranslation();
  const columns = [
    {
      field: "code",
      headerName: t("code"),
    },
    {
      field: "description",
      headerName: t("name"),
      hideCopy: true,
    },
    {
      field: "usedBy",
      headerName: t("table"),
      hideCopy: true,
    },
  ];

  return (
    <StyledBox>
      <GridTable
        columns={columns}
        rows={connectedForms ? connectedForms : []}
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

export default ConnectedForms;
