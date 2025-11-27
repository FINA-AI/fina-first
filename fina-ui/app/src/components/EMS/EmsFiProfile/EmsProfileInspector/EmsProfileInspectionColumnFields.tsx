import React from "react";
import { InspectionColumnData } from "../../../../types/inspection.type";
import { Grid } from "@mui/material";
import TextField from "../../../common/Field/TextField";
import NumberField from "../../../common/Field/NumberField";
import DatePicker from "../../../common/Field/DatePicker";
import Select from "../../../common/Field/Select";
import Box from "@mui/material/Box";
import { getLanguage } from "../../../../util/appUtil";
import { useTheme } from "@mui/material/styles";

interface EmsProfileInspectionColumnFieldsProps {
  inspectionColumns: InspectionColumnData[] | null;
  inspectionColumnsDataRef: React.MutableRefObject<{ [key: string]: any }[]>;
  isViewMode: boolean;
}

const EmsProfileInspectionColumnFields: React.FC<
  EmsProfileInspectionColumnFieldsProps
> = ({ inspectionColumns, inspectionColumnsDataRef, isViewMode }) => {
  const langCode = getLanguage();
  const theme = useTheme();
  const onChange = (key: string, value: any, index: number) => {
    inspectionColumnsDataRef.current[index - 1] = { [key]: value };
  };

  const getFields = (item: InspectionColumnData, index: number) => {
    let value = inspectionColumnsDataRef.current[index - 1]["column" + index];
    switch (item.type) {
      case "TEXT":
        return (
          <TextField
            onChange={(value: string) =>
              onChange("column" + index, value, index)
            }
            value={value}
            label={item.names[langCode]}
            size={"small"}
            isDisabled={isViewMode}
            fieldName={item.names[langCode]}
          />
        );
      case "NUMERIC":
        return (
          <NumberField
            onChange={(value) => onChange("column" + index, value, index)}
            value={value}
            label={item.names[langCode]}
            size={"small"}
            isDisabled={isViewMode}
            fieldName={item.names[langCode]}
          />
        );
      case "DATETIME":
        return (
          <DatePicker
            onChange={(value: any) => {
              let date = value ? value.getTime() : "";
              onChange("column" + index, date, index);
            }}
            value={value ? value : null}
            size={"small"}
            label={item.names[langCode]}
            isDisabled={isViewMode}
            data-testid={item.names[langCode]}
          />
        );
      case "LIST":
        return (
          <Select
            size={"small"}
            onChange={(value: string) =>
              onChange("column" + index, value, index)
            }
            value={value}
            data={[
              ...(item.listValues?.map((listItem) => {
                return { label: listItem, value: listItem };
              }) || []),
            ]}
            label={item.names[langCode]}
            disabled={isViewMode}
            data-testid={item.names[langCode]}
          />
        );
      default:
        return (
          <TextField
            onChange={(value: string) =>
              onChange("column" + index, value, index)
            }
            value={value}
            label={item.names[langCode]}
            size={"small"}
            isDisabled={isViewMode}
            fieldName={item.names[langCode]}
          />
        );
    }
  };

  return (
    <Box
      style={{
        borderTop: `1px solid ${
          theme.palette.mode === "dark" ? "#8d9299" : "#EAEBF0"
        }`,
      }}
      data-testid={"inspection-column-fields"}
    >
      {inspectionColumns &&
        inspectionColumns
          .sort((a: InspectionColumnData, b: InspectionColumnData) => {
            const columnIdA = a?.columnId || 0;
            const columnIdB = b?.columnId || 0;

            return columnIdA - columnIdB;
          })
          .map((item: InspectionColumnData, index: number) => {
            return (
              <Grid item key={index} style={{ marginTop: "16px" }}>
                {getFields(item, index + 1)}
              </Grid>
            );
          })}
    </Box>
  );
};

export default EmsProfileInspectionColumnFields;
