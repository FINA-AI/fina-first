import { Box, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import CustomAutoComplete from "../../../common/Field/CustomAutoComplete";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  ReturnDefinitionType,
  ReturnReportPrintObjectType,
  ReturnType,
} from "../../../../types/returnDefinition.type";
import { styled } from "@mui/material/styles";

const StyledInlineContainer = styled(Box)(({ theme }: any) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  height: 50,
  borderBottom: theme.palette.borderColor,
  marginRight: 12,
}));

const StyledReturnContainer = styled(Box)({
  flex: 0.7,
  overflow: "hidden",
  boxSizing: "border-box",
  height: "100%",
  paddingTop: "5px",
});

const StyledRadioContainer = styled(RadioGroup)({
  display: "flex",
  position: "absolute",
  top: "10px",
  width: "100%",
});

interface ReturnTypePrintModalRDefinitionProps {
  onChange: (key: keyof ReturnReportPrintObjectType, value: number[]) => void;
  onClear: (key: keyof ReturnReportPrintObjectType) => void;
  handleReturnRadioChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => void;
  selectedReturnRadio: string;
  returnDefinitions: ReturnDefinitionType[];
  returnTypes: ReturnType[];
}

const RTPrintDefinitionChooser: React.FC<
  ReturnTypePrintModalRDefinitionProps
> = ({
  onChange,
  onClear,
  handleReturnRadioChange,
  selectedReturnRadio,
  returnDefinitions,
  returnTypes,
}) => {
  const { t } = useTranslation();

  const prependedReturnTypes = [
    { id: 0, code: t("all"), name: t("all") },
    ...returnTypes,
  ];

  return (
    <StyledRadioContainer
      aria-labelledby="demo-radio-buttons-group-label"
      name="radio-buttons-group"
      value={selectedReturnRadio}
      onChange={handleReturnRadioChange}
      style={{ position: "relative" }}
      data-testid={"definition-chooser-container"}
    >
      <StyledInlineContainer>
        <FormControlLabel
          value="rDefinition"
          control={<Radio data-testid={"return-definition-radio"} />}
          label={t("returnDefinition")}
          style={{ marginLeft: 10 }}
          data-testid={"return-definition-label"}
        />
        {selectedReturnRadio === "rDefinition" && (
          <StyledReturnContainer style={{ marginRight: 22 }}>
            <CustomAutoComplete
              disabled={false}
              label={t("returnDefinition")}
              data={returnDefinitions}
              displayFieldName={"code"}
              displayFieldFunction={(item) => {
                return `${item.returnType.code} / ${item.code} - ${item.name}`;
              }}
              valueFieldName={"id"}
              onChange={(item) => {
                onChange("definition", item?.id);
              }}
              virtualized={true}
              onClear={() => {
                onClear("definition");
              }}
            />
          </StyledReturnContainer>
        )}
      </StyledInlineContainer>
      <StyledInlineContainer>
        <FormControlLabel
          value="returnType"
          control={<Radio data-testid={"return-Type-radio"} />}
          label={t("returnType")}
          style={{ marginLeft: 10 }}
          data-testid={"return-Type-label"}
        />
        {selectedReturnRadio === "returnType" && (
          <StyledReturnContainer style={{ marginRight: 22 }}>
            <CustomAutoComplete
              disabled={false}
              label={t("returnType")}
              data={prependedReturnTypes}
              displayFieldName={"code"}
              displayFieldFunction={(item) => {
                return `${item.code} / ${item.name}`;
              }}
              valueFieldName={"id"}
              onChange={(item) => {
                if (item?.id === 0) {
                  const allReturnTypeIds = prependedReturnTypes
                    .map((rt) => rt.id)
                    .filter((id) => id !== 0);
                  onChange("returnTypeIds", allReturnTypeIds);
                } else {
                  onChange("returnTypeIds", [item?.id]);
                }
              }}
              onClear={() => {
                onClear("returnTypeIds");
              }}
            />
          </StyledReturnContainer>
        )}
      </StyledInlineContainer>
    </StyledRadioContainer>
  );
};

export default React.memo(RTPrintDefinitionChooser);
