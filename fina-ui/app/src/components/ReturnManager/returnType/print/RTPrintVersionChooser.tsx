import { Box, ToggleButton } from "@mui/material";
import React from "react";
import { returnVersionDataType } from "../../../../types/returnVersion.type";
import { ReturnReportPrintObjectType } from "../../../../types/returnDefinition.type";
import { styled } from "@mui/material/styles";

const StyledToggleButton = styled(ToggleButton)(({ theme }: any) => ({
  height: 25,
  width: "fit-content",
  padding: "4px 8px",
  color: theme.palette.primary.main,
  fontSize: 12,
  fontWeight: 500,
  lineHeight: "16px",
  textTransform: "capitalize",
  border: theme.palette.borderColor,
  borderRadius: 13,
  marginRight: 8,
}));

interface ReturnTypePrintRVersionProps {
  returnVersions: returnVersionDataType[];
  onChange: (
    key: keyof ReturnReportPrintObjectType,
    value: number | undefined
  ) => void;
  selectedVersionId: number | undefined;
}
const RTPrintVersionChooser: React.FC<ReturnTypePrintRVersionProps> = ({
  returnVersions,
  onChange,
  selectedVersionId,
}) => {
  return (
    <Box display={"flex"} data-testid={"versions-container"}>
      {returnVersions.map((item, index) => {
        return (
          <StyledToggleButton
            value={item.id}
            key={index}
            selected={item?.id === selectedVersionId}
            onClick={() => {
              onChange("versionId", item?.id);
            }}
            data-testid={"button-" + index}
          >
            {item.code}
          </StyledToggleButton>
        );
      })}
    </Box>
  );
};

export default RTPrintVersionChooser;
