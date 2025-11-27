import { Box } from "@mui/system";
import { IconButton, Paper, Typography } from "@mui/material";
import DoubleArrowRoundedIcon from "@mui/icons-material/DoubleArrowRounded";
import { useTranslation } from "react-i18next";
import CodeArea from "../../MDT/CodeArea/CodeArea";
import React from "react";
import { DashletType } from "../../../types/dashboard.type";
import { styled } from "@mui/material/styles";

interface DashboardItemSidebarProps {
  setSideMenu: React.Dispatch<
    React.SetStateAction<{ open: boolean; row: DashletType | null }>
  >;
  data: DashletType | null;
  setSelectedRows: React.Dispatch<React.SetStateAction<DashletType[]>>;
}

const StyledRoot = styled(Paper)(({ theme }: any) => ({
  display: "flex",
  height: "100%",
  flexDirection: "column",
  backgroundColor: theme.palette.paperBackground,
}));

const StyledHeader = styled(Box)(({ theme }: any) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: 10,
  borderBottom: theme.palette.borderColor,
  borderTop: theme.palette.borderColor,
  alignItems: "center",
}));

const StyledDoubleArrowIcon = styled(DoubleArrowRoundedIcon)(
  ({ theme }: any) => ({
    color: "#C2CAD8",
    ...theme.smallIcon,
  })
);

const DashboardItemSidebar: React.FC<DashboardItemSidebarProps> = ({
  setSideMenu,
  data,
  setSelectedRows,
}) => {
  const { t } = useTranslation();

  return (
    <StyledRoot data-testid={"dashlet-sidebar"}>
      <StyledHeader data-testid={"header"}>
        <Typography fontWeight={600} fontSize={"13px"}>
          {t("preview")}
        </Typography>
        <IconButton
          onClick={() => {
            setSideMenu({ open: false, row: null });
            setSelectedRows([]);
          }}
          data-testid={"close-button"}
        >
          <StyledDoubleArrowIcon fontSize={"small"} />
        </IconButton>
      </StyledHeader>
      <Box height={"100%"} overflow={"auto"} p={"10px"}>
        <Box>
          <Typography>{`${t("name")}: ${data?.name}`}</Typography>
        </Box>
        <Box mt={"10px"}>
          <CodeArea
            editorContent={data?.dataQuery ? data.dataQuery : ""}
            editMode={false}
            isSQLEditor={true}
            height={"100%"}
            setEditorContent={() => {}}
            setHasErrors={() => {}}
            dataTestId={`code-area-${data?.id}`}
          />
        </Box>
      </Box>
    </StyledRoot>
  );
};

export default DashboardItemSidebar;
