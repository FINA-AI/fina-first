import { Box } from "@mui/system";
import Select from "../../../common/Field/Select";
import React from "react";
import { useTranslation } from "react-i18next";
import { MdtNode } from "../../../../types/mdt.type";

interface MDTNodeEditFormProps {
  data: MdtNode;
  setData: (data: MdtNode) => void;
}

const MDTNodeEditForm: React.FC<MDTNodeEditFormProps> = ({ data, setData }) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        marginTop: "10px",
      }}
    >
      <Select
        label={t("evaluationMethod")}
        value={data.evalMethod}
        data={[
          { label: "Unknown", value: "UNKNOWN" },
          { label: "Sum", value: "SUM" },
          { label: "Average", value: "AVERAGE" },
          { label: "Max", value: "MAX" },
          { label: "Min", value: "MIN" },
        ]}
        onChange={(val) => {
          setData({ ...data, evalMethod: val });
        }}
        size={"small"}
      />
    </Box>
  );
};

export default MDTNodeEditForm;
