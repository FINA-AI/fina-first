import { Box } from "@mui/system";
import { IconButton, Typography } from "@mui/material";
import DoubleArrowRoundedIcon from "@mui/icons-material/DoubleArrowRounded";
import React from "react";
import GridTable from "../../common/Grid/GridTable";
import GridNameCell from "../Main/GridNameCell";
import { getFormattedDateValue, getLanguage } from "../../../util/appUtil";
import { useTranslation } from "react-i18next";
import useConfig from "../../../hoc/config/useConfig";
import { SideMenuType, UserFile } from "../../../types/userFileSpace.type";
import { styled } from "@mui/material/styles";

interface UserFileItemSideBarProps {
  setSideMenu: (menu: SideMenuType) => void;
  data: UserFile[];
  downloadUserFileHandler: (
    val: UserFile,
    e:
      | React.MouseEvent<HTMLAnchorElement, MouseEvent>
      | React.MouseEvent<HTMLSpanElement, MouseEvent>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
}

const StyledRoot = styled(Box)(({ theme }: any) => ({
  display: "flex",
  height: "100%",
  flexDirection: "column",
  backgroundColor: theme.palette.paperBackground,
}));

const StyledHeader = styled(Box)(({ theme }: any) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: 10,
  borderTop: theme.palette.borderColor,
  borderBottom: theme.palette.borderColor,
  alignItems: "center",
}));

const StyledTitle = styled(Typography)(({ theme }: any) => ({
  fontWeight: 600,
  fontSize: 13,
  lineHeight: "20px",
  color: theme.palette.textColor,
}));

const StyledTableWrapper = styled(Box)(({ theme }: any) => ({
  borderRight: theme.palette.borderColor,
  borderLeft: theme.palette.borderColor,
}));

const UserFileItemSideBar: React.FC<UserFileItemSideBarProps> = ({
  setSideMenu,
  data,
  downloadUserFileHandler,
}) => {
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();
  const langCode = getLanguage();

  let columns = [
    {
      field: "name",
      headerName: t("name"),
      renderCell: (value: string, row: UserFile) => {
        return (
          <Box display={"flex"} alignItems={"center"}>
            <GridNameCell
              value={value}
              innerPage={true}
              downloadUserFileHandler={downloadUserFileHandler}
              row={row}
            />
          </Box>
        );
      },
    },
    {
      field: "descriptions",
      headerName: t("description"),
      renderCell: (value: { lc: string; dc: string }[]) => {
        return value.find((desc: any) => desc?.lc === langCode)?.dc;
      },
    },
    {
      field: "lastModified",
      headerName: t("modifiedDate"),
      hideCopy: true,
      renderCell: (value: number) =>
        getFormattedDateValue(value, getDateFormat(true)),
    },
  ];

  return (
    <StyledRoot data-testid={"file-item-sidebar"}>
      <StyledHeader data-testid={"header"}>
        <StyledTitle>File Version</StyledTitle>
        <IconButton
          onClick={() => {
            setSideMenu({ open: false, row: null });
          }}
          data-testid={"close-button"}
        >
          <DoubleArrowRoundedIcon
            sx={(theme: any) => ({ color: "#C2CAD8", ...theme.smallIcon })}
            fontSize={"small"}
          />
        </IconButton>
      </StyledHeader>
      <Box p={"20px"}>
        <StyledTableWrapper>
          <GridTable
            loading={false}
            columns={columns}
            rows={data}
            setRows={() => {}}
            selectedRows={[]}
          />
        </StyledTableWrapper>
      </Box>
    </StyledRoot>
  );
};

export default UserFileItemSideBar;
