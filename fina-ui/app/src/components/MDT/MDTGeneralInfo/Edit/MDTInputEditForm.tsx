import { Box } from "@mui/system";
import Select from "../../../common/Field/Select";
import React from "react";
import { useTranslation } from "react-i18next";
import { MdtNode, MDTNodeDataType } from "../../../../types/mdt.type";

interface MDTInputEditFormProps {
  data: MdtNode;
  setData: (data: MdtNode) => void;
}

const MDTInputEditForm: React.FC<MDTInputEditFormProps> = ({
  data,
  setData,
}) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ marginTop: "10px" }}>
      <Select
        label={t("dataType")}
        value={data.dataType}
        data={[
          { label: "Unknown", value: MDTNodeDataType.UNKNOWN },
          { label: "Numeric", value: MDTNodeDataType.NUMERIC },
          { label: "Text", value: MDTNodeDataType.TEXT },
          { label: "Date", value: MDTNodeDataType.DATE },
          { label: "Date Time", value: MDTNodeDataType.DATE_TIME },
        ]}
        onChange={(val) => {
          setData({ ...data, dataType: val });
        }}
        size={"small"}
      />
    </Box>
  );
};

export default MDTInputEditForm;
