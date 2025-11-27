import VirtualTreeGrid from "../../../common/TreeGrid/VirtualTreeGrid";
import { Box } from "@mui/system";
import { FiGroupModel } from "../../../../types/fi.type";
import React from "react";
import { TreeGridColumnType } from "../../../../types/common.type";

interface Props {
  data: FiGroupModel[];
  columns: TreeGridColumnType[];
  defaultCheckedRows: any;
  loading: boolean;
  onChange(checkedRows: FiGroupModel[]): void;
  fetchFunction(row: FiGroupModel): Promise<FiGroupModel[]>;
}

const ReportGenerationGroupPage: React.FC<Props> = ({
  data,
  fetchFunction,
  columns,
  onChange,
  defaultCheckedRows,
}) => {
  return (
    <Box height={"100%"} width={"100%"} style={{ overflow: "hidden" }}>
      <VirtualTreeGrid
        withCheckbox={true}
        columns={columns}
        data={data.filter((item) => item.parentId === 0)}
        loadChildrenFunction={fetchFunction}
        checkboxOnChange={onChange}
        size={"small"}
        checkboxIdProperty={"id"}
        defaultCheckedRows={defaultCheckedRows}
      />
    </Box>
  );
};

export default ReportGenerationGroupPage;
