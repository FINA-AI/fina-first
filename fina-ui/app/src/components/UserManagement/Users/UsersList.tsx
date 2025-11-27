import { Box, List, ListItemButton, Typography } from "@mui/material";
import MiniPaging from "../../common/Paging/MiniPaging";
import UserIcon from "./Common/UserIcon";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import ToolbarListSearch from "../../Catalog/MiniCatalog/ListSearch";
import Tooltip from "../../common/Tooltip/Tooltip";
import { UserType, UserTypeEnum } from "../../../types/user.type";
import { styled } from "@mui/system";

interface UsersListProps {
  data: UserType[];
  pagingPage: number;
  pagingLimit: number;
  setPagingPage: (page: number) => void;
  user: UserType;
  setUser: (user: UserType) => void;
  userLogin: string;
  userFullName: string;
  onUserSelectChange: (user: UserType) => void;
  totalResults: number;
  editMode: boolean;
  onFilter(searchValue: string): void;
}

const StyledPagingBox = styled(Box)(({ theme }: any) => ({
  borderTop: theme.palette.borderColor,
  display: "flex",
  justifyContent: "center",
  height: theme.general.footerHeight,
  backgroundColor: theme.palette.paperBackground,
  borderBottomLeftRadius: "8px",
  borderBottomRightRadius: "8px",
}));

const StyledListItem = styled(ListItemButton)<{ _isActive: boolean }>(
  ({ theme, _isActive }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    borderBottom: theme.palette.borderColor,
    cursor: "pointer",
    "&.Mui-focusVisible": {
      backgroundColor: "none",
    },
    "&.Mui-selected": {
      color: "#FFF",
      "& p": {
        color: "#FFF",
      },
    },
    "&:hover": {
      backgroundColor: _isActive
        ? theme.palette.primary.main
        : theme.palette.buttons.secondary.hover,
    },
    backgroundColor: _isActive && theme.palette.primary.main,
  })
);

const StyledActiveUserBox = styled(Box, {
  shouldForwardProp: (prop: string) => !prop.startsWith("_"),
})<{ _active: boolean }>(({ theme, _active }) => ({
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  "& .MuiTypography-root": {
    fontSize: "11px",
    lineHeight: "12px",
    fontWeight: 500,
    color: _active
      ? `${theme.palette.mode === "dark" ? "#1F2532" : "#FFF"} !important`
      : theme.palette.mode === "dark"
      ? "#ABBACE"
      : "#98A7BC",
  },
}));

const StyledNameTypography = styled(Typography, {
  shouldForwardProp: (prop: string) => !prop.startsWith("_"),
})<{ _isActive: boolean }>(({ theme, _isActive }: any) => ({
  fontSize: "13px",
  lineHeight: "20px",
  fontWeight: 500,
  marginBottom: "5px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  color: _isActive
    ? `${theme.palette.mode === "dark" ? "#1F2532" : "#FFF"} !important`
    : theme.palette.mode === "dark"
    ? "#F5F7FA"
    : "",
}));

const StyledDescriptionTypography = styled(Typography)<{ _isActive: boolean }>(
  ({ theme, _isActive }: any) => ({
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontSize: "11px",
    lineHeight: "16px",
    fontWeight: 400,
    width: "100%",
    color: _isActive
      ? `${theme.palette.mode === "dark" ? "#1F2532" : "#FFF"} !important`
      : theme.palette.mode === "dark"
      ? "#ABBACE"
      : "",
  })
);

const UsersList: React.FC<UsersListProps> = ({
  data,
  pagingPage,
  pagingLimit,
  setPagingPage,
  user,
  userLogin,
  userFullName,
  onUserSelectChange,
  totalResults,
  onFilter,
  editMode,
}) => {
  const { t } = useTranslation();

  const memoizedUserList = useMemo(() => {
    return (
      <>
        {data.map((item, i) => {
          if (item.id > 0)
            return (
              <StyledListItem
                key={"reference" + i}
                _isActive={item.id === user.id}
                onClick={() => {
                  if (user.id !== item.id) onUserSelectChange(item);
                }}
                autoFocus={item.id === user.id}
              >
                <StyledActiveUserBox _active={item.id === user.id}>
                  <Box>
                    <Typography>{t("finaUser")}</Typography>
                  </Box>
                  <UserIcon selectedUser={user} user={item} />
                </StyledActiveUserBox>
                <Tooltip title={`${item.login}`}>
                  <Box
                    sx={{
                      display: "flex",
                      width: "100%",
                    }}
                  >
                    <StyledNameTypography _isActive={item.id === user.id}>
                      {item.login}
                    </StyledNameTypography>
                  </Box>
                </Tooltip>
                <Tooltip title={`${item.description}`}>
                  <StyledDescriptionTypography _isActive={item.id === user.id}>
                    {item.description}
                  </StyledDescriptionTypography>
                </Tooltip>
              </StyledListItem>
            );
        })}
      </>
    );
  }, [data, user, editMode]);

  return (
    <Box
      height={"100%"}
      boxSizing={"border-box"}
      borderRadius={"8px"}
      display={"flex"}
      flexDirection={"column"}
    >
      <Box>
        <ToolbarListSearch
          to={"/usermanager/users"}
          onFilter={onFilter}
          height={55}
        />
      </Box>
      <Box
        flex={1}
        sx={{
          width: "100%",
          overflow: "auto",
          "& .MuiButtonBase-root": {
            display: "block !Important",
          },
        }}
      >
        <Box>
          <List
            sx={{
              padding: "0px",
            }}
          >
            {user.id <= 0 && (
              <NewUserListItem
                userFullName={userFullName}
                userLogin={userLogin}
              />
            )}
            {memoizedUserList}
          </List>
        </Box>
      </Box>
      <StyledPagingBox>
        <MiniPaging
          totalNumOfRows={totalResults}
          initialedPage={pagingPage}
          onPageChange={setPagingPage}
          initialRowsPerPage={pagingLimit}
        />
      </StyledPagingBox>
    </Box>
  );
};

export default UsersList;

export const NewUserListItem = ({
  userFullName,
  userLogin,
}: {
  userFullName: string;
  userLogin: string;
}) => {
  return (
    <StyledListItem key={"reference0"} _isActive={true}>
      <UserIcon
        selectedUser={{ id: 0 }}
        user={{ userType: UserTypeEnum.FINA_USER, blocked: false, id: 0 }}
      />
      <StyledNameTypography _isActive={true}>
        <span>{userLogin}</span>
      </StyledNameTypography>
      <StyledDescriptionTypography _isActive={true}>
        <span>{userFullName}</span>
      </StyledDescriptionTypography>
    </StyledListItem>
  );
};
