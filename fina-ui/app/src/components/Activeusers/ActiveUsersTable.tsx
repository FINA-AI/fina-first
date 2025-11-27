import GridTable from "../common/Grid/GridTable";
import React from "react";
import { GridColumnType } from "../../types/common.type";
import { ActiveUserType } from "../../types/activeUser.type";

interface ActiveUsersTableProps {
  data: ActiveUserType[];
  setData: React.Dispatch<React.SetStateAction<ActiveUserType[]>>;
  columns: GridColumnType[];
  orderRowByHeader: (cellName: string, arrowDirection: string) => void;
}

const ActiveUsersTable: React.FC<ActiveUsersTableProps> = ({
  data,
  setData,
  columns,
  orderRowByHeader,
}) => {
  return (
    <GridTable
      columns={columns}
      rows={data}
      setRows={setData}
      size={"small"}
      orderRowByHeader={orderRowByHeader}
    />
  );
};

export default ActiveUsersTable;
