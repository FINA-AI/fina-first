import { useTranslation } from "react-i18next";
import { Box } from "@mui/system";
import DetailItem from "./DetailItem";
import EditIconMui from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import TextButton from "../Button/TextButton";
import {
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
} from "@mui/icons-material";
import React, { FC, useEffect, useState } from "react";
import ConfirmModal from "../Modal/ConfirmModal";
import { useSnackbar } from "notistack";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import useConfig from "../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../api/permissions";
import { styled } from "@mui/material/styles";
import { CancelIcon } from "../../../api/ui/icons/CancelIcon";
import { SaveIcon } from "../../../api/ui/icons/SaveIcon";

export const FORM_STATE = {
  EDIT: "EDIT",
  VIEW: "VIEW",
  ADD: "ADD",
};

interface DetailFormProps {
  title: string;
  name: string;
  formState: string;
  setFormState: (formState: string) => void;
  data: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  formItems: FormItemProps[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isEditValid: boolean;
  islastFieldComment?: boolean;
  mainRowItemNumber?: number;
  expandedRow?: boolean;
  countryData?: any;
  isCancelModalOpen: boolean;
  setIsCancelModalOpen: (isOpen: boolean) => void;
  isValid?: (data: any) => boolean;
  textMaxWidth?: number;
  onModeChange?: (isEditMode: boolean) => void;
  hideActionButtons?: boolean;
  onValueChangeExternal?: (data: any) => void;
}

export interface FormItemProps {
  name: string;
  dataIndex: string;
  displayFieldName?: string;
  secondaryDisplayFieldName?: string;
  secondaryDisplayFieldLabel?: string;
  hidden?: boolean;
  type: string;
  gridItem?: number;
  listData?: any;
  required?: boolean;
  key?: string;
  value?: any;
  renderCell?: (data: any) => any;
  size?: string;
  data?: any;
}

const StyledRoot = styled(Box)<{
  disabled: boolean;
}>(({ theme, disabled }) => ({
  marginTop: "8px",
  padding: "12px 0",
  borderTop: (theme as any).palette.borderColor,
  borderBottom: (theme as any).palette.borderColor,
  backgroundColor: theme.palette.mode === "light" ? "inherit" : "#344258",
  opacity: disabled ? 0.6 : 1,
}));

const StyledHeader = styled(Box)<{
  dataLength: number;
  formState: string;
}>(({ dataLength, formState }) => ({
  marginRight: 20,
  marginLeft: 0,
  marginBottom: formState === FORM_STATE.VIEW && dataLength === 0 ? 0 : 12,
}));

const StyledTitle = styled(Box)(({ theme }: any) => ({
  color: theme.palette.textColor,
  fontWeight: 600,
  fontSize: 13,
  lineHeight: "20px",
  marginLeft: 20,
}));

const StyledSplitter = styled("span")(() => ({
  borderLeft: "1px solid #687A9E",
  height: 14,
}));

const commonIconStyles = (theme: any, disabled: boolean) => ({
  ...theme.smallIcon,
  color: theme.palette.primary.main,
  cursor: "pointer",
  opacity: disabled ? 0.6 : 1,
});

const StyledEditIconMui = styled(EditIconMui)<{
  disabled: boolean;
}>(({ theme, disabled }) => ({
  ...commonIconStyles(theme, disabled),
}));

const StyledAddIcon = styled(AddIcon)<{
  disabled: boolean;
}>(({ theme, disabled }) => ({
  ...commonIconStyles(theme, disabled),
  marginLeft: 20,
}));

const StyledKeyboardArrowUpRounded = styled(KeyboardArrowUpRounded)(
  ({ theme }: any) => ({
    ...theme.smallIcon,
  })
);

const StyledKeyboardArrowDownRounded = styled(KeyboardArrowDownRounded)(
  ({ theme }: any) => ({
    ...theme.smallIcon,
  })
);

const StyledSeeMoreWrapper = styled(Box)(() => ({
  marginTop: 10,
  height: 18,
}));

const DetailForm: FC<DetailFormProps> = ({
  title,
  name,
  formState,
  setFormState,
  data,
  onSave,
  onCancel,
  formItems,
  isOpen,
  setIsOpen,
  isEditValid,
  islastFieldComment = false,
  mainRowItemNumber,
  expandedRow = false,
  countryData,
  isCancelModalOpen,
  setIsCancelModalOpen,
  isValid,
  textMaxWidth,
  onModeChange,
  hideActionButtons = false,
  onValueChangeExternal,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { openErrorWindow } = useErrorWindow();
  const { hasPermission } = useConfig();

  const [itemData, setItemData] = useState<any[]>([]);

  const [expanded, setExpanded] = useState(expandedRow);
  const [showButtonLoading, setShowButtonLoading] = useState(false);

  useEffect(() => {
    setItemData(data.map((item: any) => ({ ...item })));
  }, [data]);

  const constructObject = () => {
    let obj: any = {};
    for (const o of formItems) {
      obj[o.dataIndex] = undefined;
    }
    return obj;
  };

  const onAdd = () => {
    if (onModeChange) {
      onModeChange(true);
    }
    if (formState === FORM_STATE.VIEW) {
      setFormState(FORM_STATE.ADD);
    }
    if (!expanded) {
      setExpanded(true);
    }
    const dataObject: any = constructObject();
    setItemData([dataObject, ...itemData]);
  };

  const onEdit = () => {
    if (onModeChange) {
      onModeChange(true);
    }
    if (formState === FORM_STATE.VIEW) {
      setFormState(FORM_STATE.EDIT);
    }
    if (!expanded) {
      setExpanded(true);
    }
  };

  const cancel = () => {
    if (onModeChange) {
      onModeChange(false);
    }
    setFormState(FORM_STATE.VIEW);
    setItemData(data);
    onCancel();
  };

  const handleCancel = () => {
    setIsCancelModalOpen(false);
    cancel();
  };

  const onRequiredFieldValidation = (item: any, key: string, value: any) => {
    if (!item["errors"]) {
      item["errors"] = {};
    }
    item["errors"][key] = !Boolean(value);
  };

  const onValueChange = (
    value: any,
    name: string,
    index: number,
    required?: boolean
  ) => {
    if (typeof value === "object") {
      let tmp = [...itemData];
      tmp[index][name] = value;
      if (required) {
        onRequiredFieldValidation(itemData[index], name, value);
      }
      setItemData(tmp);
    } else {
      itemData[index][name] = value;
      if (required) {
        onRequiredFieldValidation(itemData[index], name, value);
      }
    }
    if (onValueChangeExternal) {
      onValueChangeExternal(itemData);
    }
  };

  const removeItem = (index: number) => {
    let tmp = [...itemData];
    tmp.splice(index, 1);
    setItemData(tmp);
  };

  const handleConfirm = async () => {
    setShowButtonLoading(true);
    try {
      await onSave(itemData);
      setShowButtonLoading(false);
    } catch (e) {
      setShowButtonLoading(false);
      openErrorWindow(e, t("error"), true);
    }
  };

  return (
    <StyledRoot
      data-testid={`${name}-detailForm`}
      mt={1}
      disabled={formState === FORM_STATE.VIEW && !isEditValid}
    >
      <StyledHeader
        display={"flex"}
        dataLength={data.length}
        formState={formState}
        justifyContent={"space-between"}
        ml={2}
        mr={2}
        data-testid={"header"}
      >
        <StyledTitle>{title}</StyledTitle>
        {formState !== FORM_STATE.VIEW && !hideActionButtons ? (
          <Box display={"flex"} alignItems={"center"}>
            <TextButton
              data-testid={"cancelBtn"}
              color={"secondary"}
              style={{
                fontSize: 12,
                fontWeight: 500,
                lineHeight: "16px",
              }}
              onClick={() => {
                setIsCancelModalOpen(true);
              }}
            >
              {t("cancel")}
            </TextButton>
            <StyledSplitter />
            <TextButton
              data-testid={"saveBtn"}
              style={{
                fontSize: 12,
                fontWeight: 500,
                lineHeight: "16px",
                maxWidth: "100px",
              }}
              onClick={() => {
                if (isValid) {
                  isValid(itemData)
                    ? enqueueSnackbar(t("requiredFieldsAreEmpty"), {
                        variant: "error",
                      })
                    : setIsOpen(true);
                } else {
                  setIsOpen(true);
                }
              }}
              endIcon={<CheckIcon sx={{ width: "12px", height: "12px" }} />}
            >
              {t("save")}
            </TextButton>
          </Box>
        ) : (
          <Box display={"flex"} alignItems={"center"}>
            {hasPermission(PERMISSIONS.FI_AMEND) &&
              itemData.length > 0 &&
              !hideActionButtons && (
                <StyledEditIconMui
                  disabled={!isEditValid}
                  onClick={isEditValid ? onEdit : undefined}
                />
              )}
            {hasPermission(PERMISSIONS.FI_AMEND) && (
              <StyledAddIcon
                disabled={!isEditValid}
                onClick={isEditValid ? onAdd : undefined}
              />
            )}
          </Box>
        )}
      </StyledHeader>
      <DetailItem
        formState={formState}
        formItems={formItems}
        data={itemData}
        onValueChange={onValueChange}
        removeItem={removeItem}
        isOpen={expanded}
        islastFieldComment={islastFieldComment}
        mainRowItemNumber={mainRowItemNumber}
        countryData={countryData}
        textMaxWidth={textMaxWidth}
      />
      {itemData.length !== 0 &&
        (itemData.length > 1 ||
          formItems.filter((f) => !f.hidden).length > 4) && (
          <StyledSeeMoreWrapper ml={2}>
            <TextButton
              onClick={() => setExpanded(!expanded)}
              endIcon={
                expanded ? (
                  <StyledKeyboardArrowUpRounded />
                ) : (
                  <StyledKeyboardArrowDownRounded />
                )
              }
              data-testid={`${name}-see-more`}
            >
              {expanded ? t("seeLess") : t("seeMore")}
            </TextButton>
          </StyledSeeMoreWrapper>
        )}
      {isCancelModalOpen && (
        <ConfirmModal
          isOpen={isCancelModalOpen}
          setIsOpen={setIsCancelModalOpen}
          onConfirm={handleCancel}
          confirmBtnTitle={t("confirm")}
          headerText={t("cancel")}
          additionalBodyText={t("changes")}
          bodyText={t("cancelBodyText")}
          icon={<CancelIcon />}
        />
      )}
      {isOpen && (
        <>
          <ConfirmModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            onConfirm={handleConfirm}
            confirmBtnTitle={t("save")}
            headerText={t("saveHeaderText")}
            additionalBodyText={t("changes")}
            bodyText={t("saveBodyText")}
            icon={<SaveIcon />}
            loading={showButtonLoading}
          />
        </>
      )}
    </StyledRoot>
  );
};

export default DetailForm;
