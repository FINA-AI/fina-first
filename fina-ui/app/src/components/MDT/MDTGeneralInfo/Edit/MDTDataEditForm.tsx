import { Box } from "@mui/system";
import TextField from "../../../common/Field/TextField";
import React from "react";
import { useTranslation } from "react-i18next";
import { MdtNode } from "../../../../types/mdt.type";

interface MDTDataEditFormProps {
  data: MdtNode;
  setData: (data: MdtNode) => void;
}

const MDTDataEditForm: React.FC<MDTDataEditFormProps> = ({ data, setData }) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        marginTop: "10px",
      }}
    >
      <TextField
        label={t("value")}
        value={data.equation}
        onChange={(val: string) => setData({ ...data, equation: val })}
        size={"small"}
      />
    </Box>
  );
};

export default MDTDataEditForm;
