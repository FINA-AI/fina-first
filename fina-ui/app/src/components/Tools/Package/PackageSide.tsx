import { Box } from "@mui/system";
import { IconButton, Paper, Slide, Typography } from "@mui/material";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import GridTable from "../../common/Grid/GridTable";
import { useTranslation } from "react-i18next";
import React from "react";
import { styled } from "@mui/material/styles";
import { SideMenuType } from "./PackagePage";
import { ReturnDefinitionType } from "../../../types/returnDefinition.type";
import { OSTPackage } from "../../../types/tools.type";

interface PackageSideProps {
  sideMenu: SideMenuType;
  setSideMenu: (data: SideMenuType) => void;
}

const StyledRoot = styled(Paper)(({ theme }: any) => ({
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  transition: "400ms",
  opacity: 1,
  borderTop: theme.palette.borderColor,
  height: "100%",
  width: `700px`,
  position: "absolute",
  top: 0,
  right: 0,
  zIndex: theme.zIndex.modal,
  borderLeft: theme.palette.borderColor,
  backgroundColor: theme.palette.paperBackground,
}));

const StyledContent = styled(Box)(({ theme }: any) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  borderBottom: theme.palette.borderColor,
}));

const StyledCloseIcon = styled(DoubleArrowIcon)({
  color: "#C2CAD8",
  width: "20px",
  height: "20px",
});

const StyledIcon = styled(IconButton)({
  "&.MuiButtonBase-root ": {
    padding: "2px",
  },
});

const StyledTable = styled(Box)({
  padding: "12px",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
});

const StyledHeader = styled(Box)({
  padding: "0px 12px 12px 12px",
  display: "flex",
});

const StyledMainText = styled(Typography)(({ theme }: any) => ({
  color: theme.palette.textColor,
  fontWeight: 500,
  fontSize: "13px",
  lineHeight: "20px",
}));

const StyledSecondaryText = styled(Typography)({
  color: "#9AA7BE",
  fontWeight: 400,
  paddingLeft: "8px",
  fontSize: "12px",
  lineHeight: "20px",
});

const StyledMainHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: "14px 12px 8px 12px",
  color: theme.palette.primary.main,
  alignItems: "center",
}));

const StyledTypeBox = styled(Box)(({ theme }) => ({
  height: "16px",
  borderRadius: "2px",
  background: theme.palette.mode === "light" ? "#F0F4FF" : "#4a4d62",
}));

const StyledMainBox = styled(Box)(({ theme }: any) => ({
  border: theme.palette.borderColor,
  borderTop: "0px",
  borderRadius: "2px",
  overflow: "hidden",
}));

const PackageSide: React.FC<PackageSideProps> = ({ sideMenu, setSideMenu }) => {
  const { t } = useTranslation();
  const columns = [
    {
      field: "description",
      headerName: t("description"),
      minWidth: 70,
    },
    {
      field: "code",
      headerName: t("code"),
      minWidth: 130,
    },
  ];

  const setRows = (rows: ReturnDefinitionType[]) => {
    setSideMenu({
      ...sideMenu,
      row: { ...sideMenu?.row, returnDefinitions: rows } as OSTPackage,
    });
  };

  return (
    <Slide direction="left" in={sideMenu.open} timeout={600}>
      <StyledRoot data-testid={"package-side-menu"}>
        {sideMenu.open && (
          <>
            <StyledContent data-testid={"header"}>
              <StyledMainHeader>
                <StyledTypeBox>
                  {sideMenu?.row?.type && sideMenu?.row?.type?.length > 0 && (
                    <Typography
                      fontSize={"11px"}
                      lineHeight={"12px"}
                      padding={"2px 4px 2px 4px"}
                      data-testid={"type"}
                    >
                      {sideMenu?.row?.type}
                    </Typography>
                  )}
                </StyledTypeBox>
                <StyledIcon
                  onClick={() => setSideMenu({ open: false, row: null })}
                  data-testid={"close-button"}
                >
                  <StyledCloseIcon />
                </StyledIcon>
              </StyledMainHeader>
              <StyledHeader>
                <StyledMainText data-testid={"code"}>
                  {sideMenu?.row?.code}
                </StyledMainText>
                <StyledSecondaryText data-testid={"note"}>
                  {sideMenu?.row?.note}
                </StyledSecondaryText>
              </StyledHeader>
            </StyledContent>
            <StyledTable>
              <StyledMainBox>
                <GridTable
                  columns={columns}
                  rows={
                    sideMenu?.row
                      ? [
                          ...sideMenu?.row?.returnDefinitions?.map((item) => {
                            return {
                              ...item,
                              description: item.name,
                              code: item.code,
                            };
                          }),
                        ]
                      : []
                  }
                  setRows={setRows}
                  selectedRows={[]}
                />
              </StyledMainBox>
            </StyledTable>
          </>
        )}
      </StyledRoot>
    </Slide>
  );
};

export default PackageSide;
