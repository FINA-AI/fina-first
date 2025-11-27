import React from "react";
import { Box } from "@mui/material";
import ActiveUsersToolbar from "./ActiveUsersToolbar";
import ActiveUsersTable from "./ActiveUsersTable";
import { GridColumnType } from "../../types/common.type";
import { ActiveUserType } from "../../types/activeUser.type";
import { styled } from "@mui/material/styles";

interface ActiveUsersPageProps {
  data: ActiveUserType[];
  setData: React.Dispatch<React.SetStateAction<ActiveUserType[]>>;
  columns: GridColumnType[];
  setColumns: React.Dispatch<React.SetStateAction<GridColumnType[]>>;
  orderRowByHeader: (cellName: string, arrowDirection: string) => void;
}

const StyledRoot = styled(Box)(({ theme }: any) => ({
  height: "100%",
  paddingBottom: "70px",
  boxSizing: "border-box",
  background: theme.palette.paperBackground,
}));

const ActiveUsersPage: React.FC<ActiveUsersPageProps> = ({
  data = [],
  setData,
  columns,
  setColumns,
  orderRowByHeader,
}) => {
  return (
    <StyledRoot>
      <div>
        <ActiveUsersToolbar
          columns={columns}
          usersCount={data.length}
          setColumns={setColumns}
        />
      </div>
      <div style={{ height: "100%" }}>
        <ActiveUsersTable
          data={data}
          columns={columns}
          setData={setData}
          orderRowByHeader={orderRowByHeader}
        />
      </div>
    </StyledRoot>
  );
};

export default ActiveUsersPage;
