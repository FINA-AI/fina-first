import { Box } from "@mui/system";
import DatePicker from "../Field/DatePicker";
import Select from "../Field/Select";
import NumberField from "../Field/NumberField";
import TextField from "../Field/TextField";
import { Grid, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { FORM_STATE, FormItemProps } from "./DetailForm";
import { copyToClipboard, getFormattedDateValue } from "../../../util/appUtil";
import useConfig from "../../../hoc/config/useConfig";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CustomAutoComplete from "../Field/CustomAutoComplete";
import React, { FC, useEffect, useState } from "react";
import { loadFirstLevel } from "../../../api/services/regionService";
import PercentageField from "../Field/PercentageField";
import FiLegalPersonSelect from "../../FI/Main/Detail/LegalPerson/Select/FiLegalPersonSelect";
import FiPersonSelect from "../../FI/Main/Detail/Person/Select/FiPersonSelect";
import { useTranslation } from "react-i18next";
import { CountryDataTypes } from "../../../types/common.type";
import { styled } from "@mui/material/styles";

export const ITEM_TYPE = {
  STRING: "STRING",
  NUMBER: "NUMBER",
  DATE: "DATE",
  LIST: "LIST",
  COUNTRIES: "COUNTRIES",
  COMPANIES: "COMPANIES",
  PERCENTAGE: "PERCENTAGE",
  AUTOCOMPLETE: "AUTOCOMPLETE",
  OBJECT: "OBJECT",
  PERSONSELECT: "PERSONSELECT",
};

interface DetailItemProps {
  data: any;
  formItems: FormItemProps[];
  formState: string;
  onValueChange: (
    value: any,
    name: string,
    index: number,
    required?: boolean
  ) => void;
  removeItem: (index: number) => void;
  isOpen: boolean;
  islastFieldComment: boolean;
  mainRowItemNumber?: number;
  countryData?: CountryDataTypes[];
  textMaxWidth?: number;
}

interface CommonDataTypes {
  id: number;
}

const StyledItemBottom = styled(Grid, {
  shouldForwardProp: (prop: string) => prop !== "isLastFieldComment",
})<{
  isLastFieldComment: boolean;
}>(({ theme, isLastFieldComment }) => ({
  borderBottom: `1px dashed ${
    theme.palette.mode === "light" ? "#EAEBF0" : "#3C4D68"
  }`,
  "& .MuiGrid-root:last-child": {
    minWidth: isLastFieldComment ? "100%" : "",
    "& .MuiTextField-root:last-child": {
      "& .MuiInputBase-inputMultiline": {
        height: isLastFieldComment ? "100px !important" : "",
        overflow: "auto !important",
      },
    },
  },
}));

const StyledDeleteIcon = styled(DeleteIcon)(({ theme }: any) => ({
  color: theme.palette.mode === "light" ? "#AEB8CB" : "#5D789A",
  "&:hover": {
    color: "#FF4128",
  },
  ...theme.defaultIcon,
  marginTop: 10,
  marginRight: 20,
  cursor: "pointer",
}));

const StyledPlaceholder = styled(Box)(() => ({
  width: 45,
}));

const StyledViewName = styled(Box)(({ theme }) => ({
  fontSize: 11,
  color: theme.palette.mode === "light" ? "#596D89" : "#ABBACE",
  fontWeight: 500,
  lineHeight: "12px",
  marginBottom: 2,
}));

const StyledViewValue = styled(Box)(({ theme }: any) => ({
  display: "flex",
  alignItems: "center",
  fontSize: 12,
  lineHeight: "20px",
  fontWeight: 400,
  color: theme.palette.textColor,
  height: "26px",
  width: "150px",
}));

const StyledTextValue = styled("span")<{
  textMaxWidth?: number;
}>(({ textMaxWidth, theme }) => ({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  maxWidth: textMaxWidth ? textMaxWidth : "",
  display: "flex",
  "& .MuiButtonBase-root": {
    margin: "0px",
    padding: "0px",
    marginRight: "5px",
  },
  [theme.breakpoints.down("md")]: {
    width: "80%",
  },
  [theme.breakpoints.down("sm")]: {
    width: "70%",
  },
}));

const StyledIconSpan = styled("span")(() => ({
  cursor: "pointer",
  "& .MuiSvgIcon-root": { display: "block !important" },
}));

const StyledContentCopyIcon = styled(ContentCopyIcon)(() => ({
  visibility: "hidden",
  cursor: "pointer",
  fontSize: 16,
  color: "rgba(24 41 57 / 0.4)",
  marginLeft: "auto",
  float: "right",
}));

const StyledText = styled(Typography)(() => ({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  maxWidth: "150px",
}));

const StyledItem = styled(Box)(() => ({
  "&:hover": {
    ".copy-icon": {
      visibility: "visible",
    },
  },
}));

const DetailItem: FC<DetailItemProps> = ({
  data,
  formItems,
  formState,
  onValueChange,
  removeItem,
  isOpen,
  islastFieldComment,
  mainRowItemNumber,
  countryData,
  textMaxWidth,
}) => {
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();
  const [countries, setCountries] = useState<CountryDataTypes[]>([]);

  useEffect(() => {
    if (!countryData) {
      if (formItems) {
        for (let f of formItems) {
          if (f.type === ITEM_TYPE.COUNTRIES && countries.length === 0) {
            fetchCountries();
            break;
          }
        }
      }
    } else {
      setCountries(countryData);
    }
  }, []);

  const fetchCountries = async () => {
    let resp = await loadFirstLevel();
    setCountries(resp.data);
  };

  const isFieldDisabled = (data: CommonDataTypes) => {
    return formState === FORM_STATE.ADD && data.id > 0;
  };

  const isLegalPersonDisabled = (data: CommonDataTypes) => {
    return (
      formState === FORM_STATE.EDIT ||
      (formState === FORM_STATE.ADD && data.id > 0)
    );
  };

  const isDeleteDisabled = (data: CommonDataTypes) => {
    return (
      formState === FORM_STATE.VIEW ||
      (formState === FORM_STATE.ADD && data.id > 0)
    );
  };

  const getViewValue = (data: any[], form: any) => {
    switch (form.type) {
      case ITEM_TYPE.STRING:
      case ITEM_TYPE.NUMBER:
        return data[form.dataIndex];
      case ITEM_TYPE.PERCENTAGE:
        return data[form.dataIndex] ? data[form.dataIndex] + "%" : "";
      case ITEM_TYPE.DATE:
        return getFormattedDateValue(data[form.dataIndex], getDateFormat(true));
      case ITEM_TYPE.LIST:
        let elem = form.listData.find(
          (e: FormItemProps) => e.value === data[form.dataIndex]
        );
        return elem ? elem.label : "";
      case ITEM_TYPE.AUTOCOMPLETE:
        return data[form.dataIndex] ? data[form.dataIndex] : "";
      case ITEM_TYPE.COUNTRIES:
        return data[form.dataIndex] ? data[form.dataIndex].name : "";
      case ITEM_TYPE.COMPANIES:
        return data[form.dataIndex] ? data[form.dataIndex].name : "";
      case ITEM_TYPE.OBJECT:
        return data[form.dataIndex] ? data[form.dataIndex][form.key] : "";
      default:
        return "";
    }
  };

  const getData = () => {
    if (isOpen) {
      return data;
    } else {
      return data[0] ? [data[0]] : [];
    }
  };

  const onCopy = (value: any) => {
    copyToClipboard(value);
  };

  const Item: FC<{
    form?: FormItemProps;
    data: any;
    index: number;
  }> = ({ form, data, index }): any => {
    if (formState === FORM_STATE.VIEW && form) {
      let textValue = getViewValue(data, form);
      return (
        <StyledItem data-testid={"item-" + index}>
          <StyledViewName>{form.name}</StyledViewName>
          <StyledViewValue>
            <StyledTextValue textMaxWidth={textMaxWidth}>
              {form.renderCell && (
                <StyledIconSpan>{form.renderCell(data)}</StyledIconSpan>
              )}
              <StyledText>{textValue}</StyledText>
            </StyledTextValue>
            <span style={{ marginLeft: "8px" }}>
              {textValue && form.type !== ITEM_TYPE.DATE && (
                <StyledContentCopyIcon
                  className="copy-icon"
                  onClick={() => onCopy(getViewValue(data, form))}
                />
              )}
            </span>
          </StyledViewValue>
        </StyledItem>
      );
    }

    if (form) {
      switch (form.type) {
        case ITEM_TYPE.STRING:
          return (
            <TextField
              size={"default"}
              isDisabled={isFieldDisabled(data)}
              label={form.name}
              value={data[form.dataIndex]}
              fieldName={form.dataIndex}
              multiline={islastFieldComment && form.name === "Comment"}
              onChange={(value: string) => {
                if (onValueChange) {
                  onValueChange(value, form.dataIndex, index, form.required);
                }
              }}
              required={form.required}
              isError={data.errors && data.errors[form.dataIndex]}
            />
          );
        case ITEM_TYPE.NUMBER:
          return (
            <NumberField
              size={"default"}
              isDisabled={isFieldDisabled(data)}
              label={form.dataIndex}
              value={data[form.dataIndex]}
              fieldName={form.dataIndex}
              format={"#"}
              onChange={(value) => {
                if (onValueChange) {
                  onValueChange(value, form.dataIndex, index);
                }
              }}
            />
          );
        case ITEM_TYPE.PERCENTAGE:
          return (
            <PercentageField
              size={"default"}
              isDisabled={isFieldDisabled(data)}
              label={form.name}
              value={data[form.dataIndex]}
              fieldName={form.dataIndex}
              format={"#.###"}
              onChange={(value) => {
                if (onValueChange) {
                  onValueChange(value, form.dataIndex, index);
                }
              }}
              required={form.required}
              isError={data.errors && data.errors[form.dataIndex]}
            />
          );
        case ITEM_TYPE.DATE:
          return (
            <DatePicker
              size={"default"}
              isDisabled={isFieldDisabled(data)}
              label={form.name}
              value={data[form.dataIndex]}
              onChange={(value) => {
                if (onValueChange) {
                  onValueChange(
                    value ? new Date(value).getTime().toString() : null,
                    form.dataIndex,
                    index
                  );
                }
              }}
              data-testid={form.dataIndex}
            />
          );
        case ITEM_TYPE.LIST:
          return (
            <Select
              data-testid={form.dataIndex}
              size={"default"}
              disabled={isFieldDisabled(data)}
              label={form.name}
              data={form.listData}
              value={data[form.dataIndex]}
              onChange={(value) => {
                if (onValueChange) {
                  onValueChange(value, form.dataIndex, index);
                }
              }}
            />
          );
        case ITEM_TYPE.AUTOCOMPLETE:
          return (
            <CustomAutoComplete
              data-testid={form.dataIndex}
              size={"default"}
              disabled={isFieldDisabled(data)}
              label={form.name}
              data={form.listData}
              displayFieldName={form.displayFieldName}
              valueFieldName={"id"}
              secondaryDisplayFieldName={t(
                form.secondaryDisplayFieldName
                  ? form.secondaryDisplayFieldName
                  : ""
              )}
              selectedItem={data[form.dataIndex]}
              onChange={(value) => {
                if (onValueChange) {
                  onValueChange(value, form.dataIndex, index);
                }
              }}
              secondaryDisplayFieldLabel={t(
                form.secondaryDisplayFieldLabel
                  ? form.secondaryDisplayFieldLabel
                  : ""
              )}
              isError={data.errors && data.errors[form.dataIndex]}
            />
          );
        case ITEM_TYPE.PERSONSELECT:
          return (
            <FiPersonSelect
              fieldName={"name"}
              label={form.name}
              data={form.listData}
              selectedItem={data[form.dataIndex]}
              disabled={isFieldDisabled(data)}
              onChange={(value) => {
                if (onValueChange) {
                  onValueChange(value, form.dataIndex, index);
                }
              }}
              addOption={true}
              size={form.size ?? "small"}
              countryData={countryData}
            />
          );
        case ITEM_TYPE.COUNTRIES:
          return (
            <CustomAutoComplete
              data-testid={form.dataIndex}
              disabled={isFieldDisabled(data)}
              label={form.name}
              data={countries}
              displayFieldName={"name"}
              valueFieldName={"id"}
              selectedItem={data[form.dataIndex]}
              onChange={(value) => {
                if (onValueChange) {
                  onValueChange(value, form.dataIndex, index);
                }
              }}
              size={"default"}
              isError={data.errors && data.errors[form.dataIndex]}
            />
          );
        case ITEM_TYPE.COMPANIES:
          return (
            <FiLegalPersonSelect
              fieldName={"name"}
              label={form.name}
              data={form.data}
              selectedItem={data[form.dataIndex]}
              disabled={isLegalPersonDisabled(data)}
              onChange={(value) => {
                if (onValueChange) {
                  onValueChange(value, form.dataIndex, index);
                }
              }}
              addOption={true}
              submitSuccess={(value) => {
                if (onValueChange) {
                  onValueChange(value, form.dataIndex, index);
                }
              }}
              size={"default"}
              isError={data.errors && data.errors[form.dataIndex]}
            />
          );
      }
    }
  };

  const getFirstNonHiddenItem = () => {
    for (let i = 0; i < formItems.length; i++) {
      if (!formItems[i].hidden) {
        return { item: formItems[i], index: i };
      }
    }
  };

  const renderItem = (d: any, index: number) => {
    let firstNonHiddenItem = getFirstNonHiddenItem();
    let gridSize = () => {
      if (firstNonHiddenItem) {
        if (firstNonHiddenItem.item.gridItem) {
          return firstNonHiddenItem.item.gridItem;
        }
      } else {
        return 3;
      }
    };
    if (isOpen) {
      if (Object.keys(formItems).length > 4) {
        return (
          <Grid container pb={"4px"}>
            <Grid item xs={gridSize()}>
              <Grid container>
                <Grid
                  item
                  xs={12}
                  p={"4px"}
                  ml={formState !== FORM_STATE.VIEW ? "4px" : "0px"}
                >
                  <Item
                    form={firstNonHiddenItem && firstNonHiddenItem.item}
                    data={d}
                    index={index}
                  />
                </Grid>
              </Grid>
            </Grid>
            <StyledItemBottom
              isLastFieldComment={islastFieldComment}
              item
              xs={
                firstNonHiddenItem
                  ? firstNonHiddenItem.item.gridItem
                    ? 12 - firstNonHiddenItem.item.gridItem
                    : 9
                  : 9
              }
            >
              <Grid container>
                {formItems.map((f, secondIndex) => {
                  if (firstNonHiddenItem)
                    if (secondIndex > firstNonHiddenItem.index && !f.hidden) {
                      return (
                        <Grid
                          item
                          xs={
                            firstNonHiddenItem.item.gridItem
                              ? 12 - firstNonHiddenItem.item.gridItem
                              : 4
                          }
                          p={"4px"}
                          mb={"8px"}
                          key={secondIndex}
                        >
                          <Item form={f} data={d} index={index} />
                        </Grid>
                      );
                    }
                })}
              </Grid>
            </StyledItemBottom>
          </Grid>
        );
      }
    }

    return (
      <Grid container key={index}>
        {formItems
          .filter((f) => !f.hidden)
          .map((f, secondIndex) => {
            if (
              secondIndex < (mainRowItemNumber ? mainRowItemNumber : 4) &&
              !f.hidden
            ) {
              return (
                <Grid
                  item
                  xs={f.gridItem ? f.gridItem : 3}
                  p={"4px"}
                  key={secondIndex}
                >
                  <Item form={f} data={d} index={index} />
                </Grid>
              );
            }
          })}
      </Grid>
    );
  };

  return (
    <Box>
      {getData().map((d: any, index: number) => (
        <Box
          display={"flex"}
          key={index}
          style={{ marginLeft: formState === FORM_STATE.VIEW ? 16 : 0 }}
          data-testid={"item-" + index}
        >
          {renderItem(d, index)}
          {!isDeleteDisabled(d) ? (
            <StyledDeleteIcon
              onClick={() => removeItem(index)}
              data-testid={"delete-button"}
            />
          ) : (
            <StyledPlaceholder />
          )}
        </Box>
      ))}
    </Box>
  );
};

export default React.memo(DetailItem, (prevProps, nextProps) => {
  return (
    prevProps.data === nextProps.data &&
    prevProps.formState === nextProps.formState &&
    prevProps.isOpen === nextProps.isOpen &&
    prevProps.islastFieldComment === nextProps.islastFieldComment
  );
});
