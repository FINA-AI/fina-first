import { Box } from "@mui/material";
import { BankingOperationIcon } from "../../../../../../api/ui/icons/BankingOperationIcon";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FILicenseBankOperationItem from "./FILicenseBankOperationItem";
import { styled } from "@mui/material/styles";
import {
  BankingOperationsDataType,
  LicensesDataType,
} from "../../../../../../types/fi.type";

const StyledOperationIconContainer = styled(Box)(({ theme }) => ({
  width: "23px",
  height: "23px",
  backgroundColor: theme.palette.primary.main,
  borderRadius: "47px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const StyledOperationHeaderText = styled("span")(({ theme }: any) => ({
  color: theme.palette.textColor,
  fontWeight: 600,
  fontSize: "14px",
  lineHeight: "21px",
  marginLeft: "8px",
}));

interface FILicenseItemBankingOperationProps {
  licenseDetails: LicensesDataType;
  onSaveFunction: (data: LicensesDataType) => void;
  saveBankingOperationCommentFunc: (
    comment: any,
    operationId: number
  ) => Promise<any>;
  deleteBankingOperationCommentFunc: (commentId: number) => void;
  generalEditMode: boolean;
  setGeneralEditMode: (val: boolean) => void;
}

const FILicenseItemBankingOperation: React.FC<
  FILicenseItemBankingOperationProps
> = ({
  licenseDetails,
  onSaveFunction,
  saveBankingOperationCommentFunc,
  deleteBankingOperationCommentFunc,
  generalEditMode,
  setGeneralEditMode,
}) => {
  const { t } = useTranslation();
  const [bankingOperations, setBankingOperations] = useState<
    BankingOperationsDataType[]
  >([]);
  const [operations, setOperations] = useState<any[]>([]);
  const [originalOperations, setOriginalOperations] = useState<any[]>([]);

  useEffect(() => {
    if (licenseDetails) {
      if (licenseDetails.allBankingOperations) {
        setBankingOperations([...licenseDetails.allBankingOperations]);
      }
      if (licenseDetails.operations) {
        setOperations([...licenseDetails.operations]);
        setOriginalOperations([...licenseDetails.operations]);
      }
    }
  }, [licenseDetails]);

  const onCancelBankOperation = () => {
    setOperations([...originalOperations]);
  };

  const onSaveOperations = (operation: any) => {
    let result = {
      ...licenseDetails,
      operations:
        operation.id !== 0
          ? operations.map((op) => {
              return op.id === operation.id ? operation : op;
            })
          : [...operations, operation],
    };

    onSaveFunction(result);
  };

  const operationStatus = (item: BankingOperationsDataType) => {
    let res = operations.find(
      (opItem) => opItem.bankingOperation.id === item.id
    )?.active;

    return !!res;
  };

  const operationDate = (item: any) => {
    return operations.find((opItem) => opItem.bankingOperation.id === item.id)
      ?.changeDate;
  };

  if (bankingOperations.length === 0) return null;

  return (
    <Box data-testid={"fi-license-banking-operation"}>
      <Box margin={"20px 18px 12px 18px"}>
        <Box display={"flex"} width={"100%"}>
          <StyledOperationIconContainer display={"flex"}>
            <BankingOperationIcon />
          </StyledOperationIconContainer>
          <StyledOperationHeaderText>
            {t("bankingOperations")}
          </StyledOperationHeaderText>
        </Box>
      </Box>
      {bankingOperations.map((operationItem, index) => {
        return (
          <Box key={index} data-testid={"operation-item-" + index}>
            <FILicenseBankOperationItem
              licenseDetails={licenseDetails}
              key={index}
              operationItem={operationItem}
              status={operationStatus(operationItem)}
              operationDate={operationDate(operationItem)}
              onSaveOperations={(op) => onSaveOperations(op)}
              operations={operations}
              deleteBankingOperationCommentFunc={
                deleteBankingOperationCommentFunc
              }
              saveBankingOperationCommentFunc={saveBankingOperationCommentFunc}
              onCancelBankOperation={onCancelBankOperation}
              generalEditMode={generalEditMode}
              setGeneralEditMode={setGeneralEditMode}
            />
          </Box>
        );
      })}
    </Box>
  );
};

export default FILicenseItemBankingOperation;
