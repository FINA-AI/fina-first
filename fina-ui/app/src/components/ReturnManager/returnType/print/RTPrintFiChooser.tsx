import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import FiTypeSelect from "../../../FI/Common/FiType/FiTypeSelect";
import { FieldSize } from "../../../../types/common.type";
import CustomAutoComplete from "../../../common/Field/CustomAutoComplete";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ReturnReportPrintObjectType } from "../../../../types/returnDefinition.type";
import { FiGroupModelType, FiType } from "../../../../types/fi.type";
import FIChooserSelect from "../../../FI/FIChooserSelect";
import { styled } from "@mui/material/styles";

const StyledInlineContainer = styled(Box)(({ theme }: any) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  height: 50,
  borderBottom: theme.palette.borderColor,
  marginRight: 12,
}));

const StyledFiContainer = styled(Box)({
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

interface ReturnTypePrintModalFiProps {
  onChange: (
    key: keyof ReturnReportPrintObjectType,
    value: number | number[] | undefined
  ) => void;
  onClear: (key: keyof ReturnReportPrintObjectType) => void;
  handleFiRadioChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => void;
  selectedFiRadio: string;
  fiGroupData: FiGroupModelType[];
  fis: FiType[];
}
const RTPrintFiChooser: React.FC<ReturnTypePrintModalFiProps> = ({
  onChange,
  onClear,
  handleFiRadioChange,
  selectedFiRadio,
  fiGroupData,
  fis,
}) => {
  const { t } = useTranslation();
  const [checkedFis, setCheckedFis] = useState<FiType[]>([]);
  const onChangeWrapper = (
    key: keyof ReturnReportPrintObjectType,
    checked: FiType[]
  ) => {
    setCheckedFis(checked);
    onChange(key, checked && checked.length > 0 ? checked[0]?.id : undefined);
  };
  return (
    <FormControl>
      <StyledRadioContainer
        aria-labelledby="demo-radio-buttons-group-label"
        name="radio-buttons-group"
        value={selectedFiRadio}
        onChange={handleFiRadioChange}
        data-testid={"fi-chooser-container"}
      >
        <StyledInlineContainer>
          <FormControlLabel
            value="fiType"
            control={<Radio data-testid={"fi-type-radio"} />}
            label={t("fiType")}
            style={{ width: 85, marginLeft: 10 }}
            data-testid={"fi-type-label"}
          />
          {selectedFiRadio === "fiType" && (
            <StyledFiContainer style={{ marginRight: 22 }}>
              <FiTypeSelect
                enableSelectAll
                size={FieldSize.SMALL}
                onChange={(item, items) => {
                  if (item.id === 0) {
                    const ids = items.map((item) => item.id);
                    onChange("fiTypeIds", ids);
                  } else {
                    onChange("fiTypeIds", [item.id]);
                  }
                }}
                onClear={() => onClear("fiTypeIds")}
              />
            </StyledFiContainer>
          )}
        </StyledInlineContainer>
        <StyledInlineContainer>
          <FormControlLabel
            value="fi"
            control={<Radio data-testid={"fi-radio"} />}
            label={t("fi")}
            style={{ width: 85, marginLeft: 10 }}
            data-testid={"fi-label"}
          />
          {selectedFiRadio === "fi" && (
            <StyledFiContainer style={{ marginRight: "22px" }}>
              <FIChooserSelect
                onChange={(checked) => onChangeWrapper("fiIds", checked)}
                checkedRows={checkedFis}
                singleSelect={true}
                data={fis}
              />
            </StyledFiContainer>
          )}
        </StyledInlineContainer>
        <StyledInlineContainer>
          <FormControlLabel
            value="fiGroup"
            control={<Radio data-testid={"fi-group-radio"} />}
            label={t("fiGroup")}
            style={{ width: 85, marginLeft: 10 }}
            data-testid={"fi-group-label"}
          />
          {selectedFiRadio === "fiGroup" && (
            <StyledFiContainer style={{ marginRight: 22 }}>
              <CustomAutoComplete
                disabled={false}
                label={t("fiGroup")}
                data={fiGroupData}
                displayFieldName={"code"}
                displayFieldFunction={(item) => {
                  return `${item.code} / ${item.name}`;
                }}
                valueFieldName={"id"}
                onChange={(item) => {
                  onChange("fiGroupId", item?.id);
                }}
                virtualized={true}
                onClear={() => {
                  onClear("fiGroupId");
                }}
              />
            </StyledFiContainer>
          )}
        </StyledInlineContainer>
      </StyledRadioContainer>
    </FormControl>
  );
};

export default React.memo(RTPrintFiChooser);
