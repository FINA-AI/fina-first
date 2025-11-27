import { Box } from "@mui/material";
import Paging from "../../common/Paging/Paging";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import GridTable from "../../common/Grid/GridTable";
import DeleteForm from "../../common/Delete/DeleteForm";
import UserManagerMainTabPanel from "./UserManagerMainTabPanel";
import ActionBtn from "../../common/Button/ActionBtn";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useConfig from "../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../api/permissions";
import { styled } from "@mui/system";
import { UserType } from "../../../types/user.type";
import {
  columnFilterConfigType,
  FilterType,
  GridColumnType,
  UIEventType,
} from "../../../types/common.type";

interface UsersPageProps {
  loading: boolean;
  users: UserType[];
  usersLength: number;
  pagingPage?: number;
  pagingLimit?: number;
  setPagingPage: (page: number) => void;
  columns?: GridColumnType[];
  selectedUsers: UserType[];
  setSelectedUsers: (users: UserType[]) => void;
  addNewUser: VoidFunction;
  columnFilterConfig: columnFilterConfigType[];
  setColumns: (columns: GridColumnType[]) => void;
  usersExportHandler(event: UIEventType): void;
  orderRowByHeader(cellName: string, arrowDirection: string): void;
  filterChangeFunc(obj: FilterType): void;
  onRowEditClick(row: UserType): void;
  rowOnClick(row: UserType): void;
  deleteUsersFunction(userIds: number[]): void;
  deleteUserFunction(userId?: number): void;
  onPagingLimitChange(limit: number): void;
}

const StyledRootBox = styled(Box)(({ theme }) => ({
  height: "100%",
  width: "100%",
  boxSizing: "border-box",
  marginTopBottom: "20px",
  borderRadius: "4px",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.paperBackground,
}));

const StyledBodyBox = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  paddingTop: 0,
  overflow: "hidden",
}));

const StyledPagingBox = styled(Box)(({ theme }: any) => ({
  ...theme.pagePaging({ size: "default" }),
}));

const UsersPage: React.FC<UsersPageProps> = ({
  loading,
  users = [],
  usersLength,
  onPagingLimitChange,
  pagingPage,
  pagingLimit,
  setPagingPage,
  columns = [],
  columnFilterConfig = [],
  deleteUserFunction,
  deleteUsersFunction,
  selectedUsers = [],
  setSelectedUsers,
  rowOnClick,
  addNewUser,
  onRowEditClick,
  filterChangeFunc,
  orderRowByHeader,
  usersExportHandler,
  setColumns,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();

  const [selectedUser, setSelectedUser] = useState<number>();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isMultiDelete, setIsMultiDelete] = useState(false);

  let actionButtons = (row: UserType, index: number) => {
    return (
      <>
        {hasPermission(PERMISSIONS.USER_AMEND) && (
          <ActionBtn
            onClick={() => {
              onRowEditClick(row);
            }}
            children={<EditIcon />}
            rowIndex={index}
            buttonName={"edit"}
          />
        )}

        {hasPermission(PERMISSIONS.USER_DELETE) && (
          <ActionBtn
            onClick={() => {
              setSelectedUser(row.id);
              setIsDeleteConfirmOpen(true);
            }}
            children={<DeleteIcon />}
            color={"#FF735A"}
            rowIndex={index}
            buttonName={"delete"}
          />
        )}
      </>
    );
  };

  const onMultiDeleteCancel = () => {
    setSelectedUsers([]);
    setIsMultiDelete(false);
  };

  return (
    <StyledRootBox>
      <Box>
        <UserManagerMainTabPanel
          tabName={"users"}
          onDeleteButtonClick={() => {
            setIsDeleteConfirmOpen(true);
            setIsMultiDelete(true);
          }}
          addNewUser={addNewUser}
          usersExportHandler={usersExportHandler}
          columns={columns}
          setColumns={setColumns}
          selectedItems={selectedUsers}
          onMultiDeleteCancel={onMultiDeleteCancel}
        />
      </Box>
      <StyledBodyBox height={"100%"}>
        <GridTable
          columns={columns}
          columnFilterConfig={columnFilterConfig}
          rows={users}
          setRows={() => {}}
          selectedRows={selectedUsers}
          onCheckboxClick={(_: UserType, selectedRows: UserType[]) =>
            setSelectedUsers(selectedRows)
          }
          rowOnClick={(row: UserType) => rowOnClick(row)}
          loading={loading}
          checkboxEnabled={true}
          actionButtons={actionButtons}
          filterOnChangeFunction={filterChangeFunc}
          orderRowByHeader={orderRowByHeader}
        />
      </StyledBodyBox>
      <StyledPagingBox>
        <Paging
          onRowsPerPageChange={(number) => onPagingLimitChange(number)}
          onPageChange={(number) => setPagingPage(number)}
          totalNumOfRows={usersLength}
          initialPage={pagingPage}
          initialRowsPerPage={pagingLimit}
        />
      </StyledPagingBox>

      {isDeleteConfirmOpen && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={t(
            `${selectedUsers && selectedUsers.length > 1 ? "users" : "user"}`
          )}
          isDeleteModalOpen={isDeleteConfirmOpen}
          setIsDeleteModalOpen={setIsDeleteConfirmOpen}
          onDelete={() => {
            isMultiDelete
              ? deleteUsersFunction(selectedUsers.map((u) => u.id))
              : deleteUserFunction(selectedUser);
            setIsDeleteConfirmOpen(false);
            if (isMultiDelete) setIsMultiDelete(false);
          }}
          showConfirm={false}
        />
      )}
    </StyledRootBox>
  );
};

export default UsersPage;
