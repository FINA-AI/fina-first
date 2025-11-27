import React, { useEffect, useState } from "react";
import { Box } from "@mui/system";
import { Divider, styled } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import { useTranslation } from "react-i18next";

import TextButton from "../../../../../common/Button/TextButton";
import DatePicker from "../../../../../common/Field/DatePicker";
import { getFormattedDateValue } from "../../../../../../util/appUtil";
import useConfig from "../../../../../../hoc/config/useConfig";
import FILicenseBankingOperationItemComments from "./FILicenseBankingOperationItemComments";
import FILicenseBankOperationSubItems from "./FILicenseBankOperationSubItems";
import StatusToggleButton from "../../../../Common/StatusToggleButton";
import { PERMISSIONS } from "../../../../../../api/permissions";
import {
  BankingOperationsDataType,
  LicensesDataType,
} from "../../../../../../types/fi.type";

interface FILicenseBankOperationItemProps {
  operationItem: BankingOperationsDataType;
  status: boolean;
  operationDate: number;
  operations: any[];
  onSaveOperations: (operation: any) => void;
  deleteBankingOperationCommentFunc: (id: number) => void;
  saveBankingOperationCommentFunc: (
    comment: any,
    operationId: number
  ) => Promise<any>;
  onCancelBankOperation: () => void;
  generalEditMode: boolean;
  setGeneralEditMode: (val: boolean) => void;
  licenseDetails: LicensesDataType;
}

const StyledRoot = styled(Box)(({ theme }) => ({
  marginTop: "12px",
  padding: "12px 0px",
  backgroundColor: theme.palette.mode === "light" ? "#F9F9F9" : "#344258",
}));

const StyledRestrictiveBox = styled(Box)({
  marginLeft: "8px",
  backgroundColor: "#FFF4E5",
  borderRadius: "2px",
  width: "66px",
  padding: "4px 8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 400,
  lineHeight: "10px",
  fontSize: "10px",
  color: "#FF8D00",
  textTransform: "capitalize",
});

const StyledCurrencyText = styled(Box)<{
  active?: boolean;
}>(({ active, theme }) => ({
  fontSize: "10px",
  fontWeight: 400,
  lineHeight: "123%",
  color: active ? theme.palette.primary.main : "#8695B1",
}));

const StyledNationalText = styled(Box)<{
  active?: boolean;
}>(({ active, theme }) => ({
  color: active ? theme.palette.primary.main : "#8695B1",
}));

const StyledForeignText = styled(Box)<{
  active?: boolean;
}>(({ active, theme }) => ({
  color: active ? theme.palette.primary.main : "#8695B1",
}));

const StyledViewModeStatus = styled(Box, {
  shouldForwardProp: (prop) => prop !== "active",
})<{
  active: boolean;
}>(({ active, theme }) => ({
  padding: "4px 12px",
  fontWeight: 500,
  fontSize: "12px",
  lineHeight: "16px",
  borderRadius: "2px",
  color: active
    ? theme.palette.mode === "light"
      ? "#289E20"
      : "#ABEFC6"
    : theme.palette.mode === "light"
    ? "#FF4128"
    : "#912018",
  backgroundColor: active
    ? theme.palette.mode === "light"
      ? "#E9F5E9"
      : "#067647"
    : theme.palette.mode === "light"
    ? "rgba(104, 122, 158, 0.1)"
    : "#FDA29B",
}));

const StyledEditIcon = styled(EditIcon)(({ theme }) => ({
  color: theme.palette.mode === "light" ? "#AEB8CB" : "#5D789A",
  cursor: "pointer",
  width: "14px",
  height: "14px",
}));

const StyledBankOperationHead = styled(Box)(({ theme }: any) => ({
  color: theme.palette.textColor,
  fontWeight: 500,
  fontSize: "13px",
  lineHeight: "20px",
}));

const StyledOperationItemDateContainer = styled(Box)({
  maxWidth: "170px",
  color: "#8695B1",
  fontWeight: 400,
  fontSize: "11px",
  lineHeight: "145%",
  float: "right",
  marginTop: "10px",
  "& .MuiOutlinedInput-input": {
    color: "#2C3644",
    fontWeight: 500,
    fontSize: "11px",
    lineHeight: "145%",
    textTransform: "capitalize",
  },
  "& .MuiSvgIcon-root": {
    width: "20px",
    height: "20px",
  },
});

const StyledOperationItemDate = styled(Box)({
  marginTop: "8px",
  float: "right",
  color: "#8695B1",
  fontWeight: 400,
  fontSize: "11px",
  lineHeight: "145%",
});

const FILicenseBankOperationItem: React.FC<FILicenseBankOperationItemProps> = ({
  operationItem,
  status,
  operationDate,
  operations,
  onSaveOperations,
  deleteBankingOperationCommentFunc,
  saveBankingOperationCommentFunc,
  onCancelBankOperation,
  generalEditMode,
  setGeneralEditMode,
  licenseDetails,
}) => {
  const { t } = useTranslation();
  const { getDateFormat, hasPermission } = useConfig();

  const [hideOperationEdit, setHideOperationEdit] = useState(false);
  const [bankOperationEdit, setBankOperationEdit] = useState(false);
  const [operationStatus, setOperationStatus] = useState<boolean>(status);
  const [date, setDate] = useState<number>(operationDate);

  useEffect(() => {
    setOperationStatus(status);
  }, [status]);

  useEffect(() => {
    setDate(operationDate);
  }, [operationDate]);

  const onEditClick = () => {
    setBankOperationEdit(true);
    setGeneralEditMode(true);
  };

  const onCancelEdit = () => {
    setOperationStatus(status);
    setDate(operationDate);
    setBankOperationEdit(false);
    onCancelBankOperation();
    setGeneralEditMode(false);
  };

  const onSave = () => {
    let operation = operations.find(
      (opItem) => opItem.bankingOperation.id === operationItem.id
    );

    if (operation) {
      operation.active = operationStatus;
      operation.changeDate = date!;
    } else {
      operation = {
        id: 0,
        bankingOperation: operationItem,
        comments: [],
        active: operationStatus,
        changeDate: date!,
      };
    }
    onSaveOperations(operation);
    setBankOperationEdit(false);
  };

  return (
    <StyledRoot>
      <Box padding="0px 20px" display={"flex"} flexDirection={"column"}>
        <Box
          display={"flex"}
          alignItems={"center"}
          style={{ marginRight: "20px" }}
          justifyContent={"space-between"}
          data-testid={"header"}
        >
          <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
            {bankOperationEdit ? (
              <StatusToggleButton
                status={operationStatus}
                onChange={(value) => setOperationStatus(value)}
              />
            ) : (
              <StyledViewModeStatus
                active={operationStatus}
                data-testid={"status-label"}
              >
                {operationStatus ? t("active") : t("inactive")}
              </StyledViewModeStatus>
            )}
            {operationItem.restrictive && (
              <>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ background: "rgba(24 41 57 / 0.4)" }}
                />
                <StyledRestrictiveBox>{t("restrictive")}</StyledRestrictiveBox>
              </>
            )}
          </Box>
          {hasPermission(PERMISSIONS.FI_AMEND) &&
            !bankOperationEdit &&
            !hideOperationEdit &&
            !generalEditMode && (
              <StyledEditIcon
                style={{
                  opacity: bankOperationEdit ? 0.6 : 1,
                  cursor: bankOperationEdit ? "default" : "",
                }}
                onClick={() => onEditClick()}
                data-testid={"edit-icon"}
              />
            )}
          {bankOperationEdit && (
            <Box>
              <TextButton
                color={"secondary"}
                onClick={onCancelEdit}
                data-testid={"cancel-button"}
              >
                {t("cancel")}
              </TextButton>
              <span style={{ borderLeft: "1px solid #687A9E", height: 14 }}>
                &nbsp;
              </span>
              <TextButton
                onClick={onSave}
                endIcon={<CheckIcon sx={{ width: "12px", height: "12px" }} />}
                data-testid={"save-button"}
              >
                {t("save")} &nbsp;
              </TextButton>
            </Box>
          )}
        </Box>
        <StyledBankOperationHead
          display={"flex"}
          justifyContent={"space-between"}
          marginTop={"12px"}
        >
          <Box paddingRight={"8px"} style={{ lineBreak: "anywhere" }}>
            {operationItem.description}
          </Box>
          <Box minWidth={"fit-content"}>
            <Box display={"flex"}>
              <StyledCurrencyText>
                <StyledNationalText active={operationItem.nationalCurrency}>
                  {t("nationalCurrency")}
                </StyledNationalText>
                <StyledForeignText active={operationItem.foreignCurrency}>
                  {t("foreignCurrency")}
                </StyledForeignText>
              </StyledCurrencyText>
            </Box>
          </Box>
        </StyledBankOperationHead>
        <Box display={"flex"} justifyContent={"flex-end"} marginRight={"100px"}>
          {operationStatus && bankOperationEdit && (
            <StyledOperationItemDateContainer>
              <DatePicker
                value={date}
                size={"small"}
                onChange={(value) => setDate(value.getTime())}
                data-testid={"date"}
              />
            </StyledOperationItemDateContainer>
          )}
          {!bankOperationEdit && operationStatus && (
            <StyledOperationItemDate>
              {getFormattedDateValue(date, getDateFormat(true))}
            </StyledOperationItemDate>
          )}
        </Box>
        <FILicenseBankingOperationItemComments
          licenseDetails={licenseDetails}
          bankOperationEdit={bankOperationEdit}
          setHideOperationEdit={setHideOperationEdit}
          operations={operations}
          deleteBankingOperationCommentFunc={deleteBankingOperationCommentFunc}
          saveBankingOperationCommentFunc={saveBankingOperationCommentFunc}
          parentId={operationItem.id}
          operationId={
            operations.find(
              (opItem) => opItem.bankingOperation.id === operationItem.id
            )?.id
          }
          date={date}
          status={operationStatus}
          generalEditMode={generalEditMode}
          setGeneralEditMode={setGeneralEditMode}
        />
        {operationItem.children && (
          <Box display={"flex"} flexDirection={"column"}>
            {operationItem.children.map((item, index) => (
              <Box
                key={index}
                display={"flex"}
                width={"100%"}
                flexDirection={"column"}
                data-testid={"sub-item-" + index}
              >
                <FILicenseBankOperationSubItems
                  key={index}
                  subItem={item}
                  bankOperationEditMode={bankOperationEdit}
                  bankOperationStatus={operationStatus}
                  operations={operations}
                  subItemIndex={index}
                  generalEditMode={generalEditMode}
                  setGeneralEditMode={setGeneralEditMode}
                  deleteBankingOperationCommentFunc={
                    deleteBankingOperationCommentFunc
                  }
                  saveBankingOperationCommentFunc={
                    saveBankingOperationCommentFunc
                  }
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </StyledRoot>
  );
};

export default FILicenseBankOperationItem;
