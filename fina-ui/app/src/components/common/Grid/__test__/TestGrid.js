import React, { useState } from "react";
import GridTable from "../GridTable";
import PropTypes from "prop-types";

export const testData = [
  { name: "TBC", someDate: new Date("2022-1-10").getTime(), someNumber: 13 },
  {
    name: "Bank of Georgia",
    someDate: new Date("2022-2-11").getTime(),
    someNumber: 42,
  },
  {
    name: "Halyk Bank",
    someDate: new Date("2021-3-13").getTime(),
    someNumber: 777,
  },
];

export const columns = [
  { field: "name", headerName: "name", minWidth: 400 },
  { field: "someDate", headerName: "someDate" },
  { field: "someNumber", headerName: "someNumber" },
];

const TestGrid = ({
  rowEditFunction,
  rowDeleteFunction,
  rowDownloadFunction,
}) => {
  const [data, setData] = useState(testData);
  const [loading] = useState(false);

  return (
    <GridTable
      columns={columns}
      rows={data}
      setRows={setData}
      selectedRows={[]}
      setSelectedRows={() => {}}
      copyCellFunction={false}
      rowEditFunction={rowEditFunction}
      rowDeleteFunction={rowDeleteFunction}
      rowDownloadFunction={rowDownloadFunction}
      loading={loading}
    />
  );
};

TestGrid.propTypes = {
  rowEditFunction: PropTypes.func,
  rowDeleteFunction: PropTypes.func,
  rowDownloadFunction: PropTypes.func,
};

export default TestGrid;
