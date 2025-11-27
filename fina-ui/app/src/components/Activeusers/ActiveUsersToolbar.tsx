import React, { useState } from "react";
import TableCustomizationButton from "../common/Button/TableCustomizationButton";
import { ACTIVE_USERS_TABLE_KEY } from "../../api/TableCustomizationKeys";
import { GridColumnType } from "../../types/common.type";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

interface ActiveUsersToolbarProps {
  usersCount: number;
  columns: GridColumnType[];
  setColumns: React.Dispatch<React.SetStateAction<GridColumnType[]>>;
}

const StyledRoot = styled(Box)({
  padding: "0 24px",
  height: 72,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  paddingLeft: "5px",
});

const ActiveUsersToolbar: React.FC<ActiveUsersToolbarProps> = ({
  usersCount,
  columns,
  setColumns,
}) => {
  useState(false);
  return (
    <StyledRoot>
      <span style={{ paddingLeft: "24px" }}>Active Users - {usersCount}</span>
      <span style={{ float: "right" }}>
        <TableCustomizationButton
          columns={columns}
          setColumns={setColumns}
          hasColumnFreeze={true}
          tableKey={ACTIVE_USERS_TABLE_KEY}
        />
      </span>
    </StyledRoot>
  );
};

export default ActiveUsersToolbar;
