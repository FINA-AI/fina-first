import React, { Fragment, useEffect, useState } from "react";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import TextButton from "../../../../../common/Button/TextButton";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import {
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
} from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Grid } from "@mui/material";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import FILegalPersonItemBeneficiaryFields from "./FILegalPersonItemBeneficiaryFields";
import { useSnackbar } from "notistack";
import ConfirmModal from "../../../../../common/Modal/ConfirmModal";
import { SaveIcon } from "../../../../../../api/ui/icons/SaveIcon";
import LegalPersonLinkButton from "../../../../../common/Button/LegalPersonLinkButton";
import PhysicalPersonLinkButton from "../../../../../common/Button/PhysicalPersonLinkButton";
import useConfig from "../../../../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../../../../api/permissions";
import { copyToClipboard } from "../../../../../../util/appUtil";
import { styled } from "@mui/material/styles";
import { LegalPersonDataType } from "../../../../../../types/legalPerson.type";
import { BeneficiariesDataType } from "../../../../../../types/fi.type";
import { PhysicalPersonDataType } from "../../../../../../types/physicalPerson.type";
import { CancelIcon } from "../../../../../../api/ui/icons/CancelIcon";

export const FORM_STATE = {
  EDIT: "EDIT",
  VIEW: "VIEW",
  ADD: "ADD",
};

const commonIconStyles = (theme: any) => ({
  color: theme.palette.primary.main,
  cursor: "pointer",
  ...theme.smallIcon,
});

const StyledEditIcon = styled(EditIcon)(({ theme }) => ({
  ...commonIconStyles(theme),
}));

const StyledAddIcon = styled(AddIcon)(({ theme }) => ({
  ...commonIconStyles(theme),
  marginLeft: "20px",
}));

const StyledCopyIcon = styled(FileCopyOutlinedIcon)({
  visibility: "hidden",
  cursor: "pointer",
  fontSize: 16,
  color: "rgba(24 41 57 / 0.4)",
  marginLeft: "auto",
  float: "right",
});

const StyledDeleteIcon = styled(DeleteIcon)(({ theme }: any) => ({
  color: "#AEB8CB",
  "&:hover": {
    color: "#FF4128",
  },
  marginTop: 15,
  marginRight: 20,
  cursor: "pointer",
  ...theme.defaultIcon,
}));

const StyledRoot = styled(Box)(({ theme }: any) => ({
  margin: "4px 0",
  padding: "8px 0",
  borderTop: theme.palette.borderColor,
  borderBottom: theme.palette.borderColor,
  backgroundColor: theme.palette.mode === "light" ? "inherit" : "#344258",
}));

const StyledTitle = styled(Box)(({ theme }: any) => ({
  fontSize: 13,
  color: theme.palette.textColor,
  fontWeight: 600,
  lineHeight: "20px",
  marginLeft: 20,
}));

const StyledHeader = styled(Box)({
  height: "31px",
  alignItems: "center",
});

const StyledItem = styled(Box)({
  "&:hover": {
    "& #copyIcon": {
      visibility: "visible",
    },
  },
});

const StyledViewName = styled(Box)(({ theme }: any) => ({
  fontSize: 11,
  color: theme.palette.secondaryTextColor,
  fontWeight: 500,
  lineHeight: "12px",
  marginBottom: 8,
}));

const StyledViewValue = styled(Box)({
  height: 18,
  display: "flex",
  alignItems: "center",
  "& .MuiIconButton-root": {
    marginLeft: "3px",
  },
  fontSize: 12,
  lineHeight: "20px",
  fontWeight: 400,
});

const StyledTextValue = styled("span")({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  display: "flex",
  maxWidth: "300px",
  "& .MuiButtonBase-root": {
    margin: "0px",
    padding: "0px",
    marginRight: "5px",
  },
});

const StyledArrowUpIcon = styled(KeyboardArrowUpRounded)(({ theme }: any) => ({
  ...theme.smallIcon,
}));

const StyledArrowDownIcon = styled(KeyboardArrowDownRounded)(
  ({ theme }: any) => ({
    ...theme.smallIcon,
  })
);

interface FILegalPersonItemBeneficiaryProps {
  currentLegalPerson: LegalPersonDataType;
  physicalPerson: PhysicalPersonDataType[];
  legalPersons: LegalPersonDataType[];
  beneficiarySaveFunction: (data: BeneficiariesDataType[]) => void;
  submitSuccess?: (data: LegalPersonDataType) => void;
  openLegalPersonPage?: boolean;
  getAllFIPhysicalPersons?: () => void;
  isEditValid?: boolean;
  onModeChange?: (value: boolean) => void;
}

const FILegalPersonItemBeneficiary: React.FC<
  FILegalPersonItemBeneficiaryProps
> = ({
  currentLegalPerson,
  physicalPerson = [],
  legalPersons = [],
  beneficiarySaveFunction,
  submitSuccess,
  getAllFIPhysicalPersons,
  isEditValid,
  onModeChange,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();
  const [formState, setFormState] = useState(FORM_STATE.VIEW);
  const [data, setData] = useState<BeneficiariesDataType[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setFormState(FORM_STATE.VIEW);
    if (currentLegalPerson?.beneficiaries) {
      setData([...currentLegalPerson.beneficiaries]);
    }
  }, [currentLegalPerson]);

  const onCancelFunction = () => {
    setFormState(FORM_STATE.VIEW);
    setData([...currentLegalPerson.beneficiaries]);
    if (onModeChange) {
      onModeChange(false);
    }
  };
  const handelCancellation = () => {
    setIsCancelModalOpen(false);
    onCancelFunction();
  };

  const onSaveFunction = () => {
    let newArray = data.map((item: BeneficiariesDataType) => {
      if (item.physicalPerson !== null) {
        return item;
      } else {
        let newFinalBeneficiary = item.finalBeneficiaries.filter(
          (el) => el.person !== null
        );
        let res = { ...item };
        res.finalBeneficiaries = newFinalBeneficiary;
        return res;
      }
    });

    let isAllFieldValid = true;
    newArray.forEach((item: any) => {
      if (!item["errors"]) {
        item["errors"] = {};
      }

      if (item.share === "0" || !item.share) {
        isAllFieldValid = false;
        item["errors"]["share"] = true;
      } else {
        item["errors"]["share"] = false;
      }

      if (!(item.legalPerson || item.physicalPerson)) {
        item["errors"]["legalPerson"] = true;
        item["errors"]["physicalPerson"] = true;
        item["errors"]["legalStatus"] = true;
        isAllFieldValid = false;
      } else {
        item["errors"]["legalStatus"] = false;
      }
    });
    newArray = newArray.map((item: BeneficiariesDataType) => {
      return {
        ...item,
        finalBeneficiaries: item.finalBeneficiaries.filter(
          (beneficiary: BeneficiariesDataType) => beneficiary.person?.id
        ),
      };
    });
    if (isAllFieldValid) {
      setFormState(FORM_STATE.VIEW);
      beneficiarySaveFunction(newArray);
      if (onModeChange) {
        onModeChange(false);
      }
    } else {
      data.forEach((item: BeneficiariesDataType, index: number) => {
        item["errors"] = newArray[index]["errors"];
      });
      enqueueSnackbar(t("requiredFieldsAreEmpty"), {
        variant: "error",
      });
    }

    setConfirmModal(false);
  };

  const getData = () => {
    if (isOpen) {
      return data;
    } else {
      return data[0] ? [data[0]] : [];
    }
  };

  const isDeleteDisabled = (data: BeneficiariesDataType) => {
    return (
      formState === FORM_STATE.VIEW ||
      (formState === FORM_STATE.ADD && data.id > 0)
    );
  };

  const removeItem = (index: number) => {
    let tmp = [...data];
    tmp.splice(index, 1);
    setData(tmp);
  };

  const onCopy = (value: string) => {
    copyToClipboard(value);
  };

  const getNewEmptyBeneficiaryObj = (): BeneficiariesDataType => {
    return {
      id: 0,
      share: 0,
      nominal: 0,
      active: false,
      creationDate: Date.now(),
      finalBeneficiaries: [],
      legalPerson: undefined,
      physicalPerson: undefined,
      newRow: true,
    } as BeneficiariesDataType & { newRow: boolean };
  };

  const onAdd = () => {
    if (onModeChange) {
      onModeChange(true);
    }
    if (formState === FORM_STATE.VIEW) {
      setFormState(FORM_STATE.ADD);
    }
    if (!isOpen) {
      setIsOpen(true);
    }
    setData([getNewEmptyBeneficiaryObj(), ...data]);
  };

  const getValueFromPersonByCaseName = (
    data: BeneficiariesDataType,
    name: string
  ) => {
    return data?.legalPerson
      ? (data.legalPerson as any)?.[name]
      : (data.physicalPerson as any)?.[name];
  };

  const getItem = (d: BeneficiariesDataType, name: string) => {
    if (name !== "finalBenefitiaryName") {
      let itemValue: string = "";
      let titleValue;
      switch (name) {
        case "status":
          itemValue = d.legalPerson ? t("legalPerson") : t("physicalperson");
          titleValue = t("fiLegalStatus");
          break;
        case "name":
          itemValue = getValueFromPersonByCaseName(d, "name");
          titleValue = t("name");
          break;
        case "id":
          itemValue = getValueFromPersonByCaseName(d, "identificationNumber");
          titleValue = t("personCreateId");
          break;
        case "share":
          itemValue = d.share + "%";
          titleValue = t("share");
          break;
        default:
          break;
      }
      return (
        <Grid
          item
          xs={4}
          padding={"10px 10px 0 0"}
          maxWidth={"100% !important"}
        >
          <StyledItem>
            <StyledViewName>{titleValue}</StyledViewName>
            <StyledViewValue>
              <StyledTextValue>
                {name === "name" && (
                  <>
                    {d.legalPerson ? (
                      <LegalPersonLinkButton id={d.legalPerson.id} />
                    ) : d.physicalPerson ? (
                      <PhysicalPersonLinkButton id={d.physicalPerson.id} />
                    ) : null}
                  </>
                )}

                {itemValue}
              </StyledTextValue>
              <span
                style={{
                  marginLeft: "8px",
                  float: undefined,
                }}
              >
                {itemValue && (
                  <StyledCopyIcon
                    id={"copyIcon"}
                    onClick={() => onCopy(itemValue)}
                  />
                )}
              </span>
            </StyledViewValue>
          </StyledItem>
        </Grid>
      );
    } else {
      return d.finalBeneficiaries.map((finalBeneficiaryItem, index) => {
        return (
          finalBeneficiaryItem.person && (
            <Fragment key={index}>
              <Grid
                item
                xs={4}
                style={{ marginTop: "8px" }}
                padding={"10px 10px 0 0"}
              >
                <StyledItem>
                  <StyledViewName>{t("beneficiaryName")}</StyledViewName>
                  <StyledViewValue>
                    <StyledTextValue>
                      <PhysicalPersonLinkButton
                        id={finalBeneficiaryItem.person.id}
                      />
                      {finalBeneficiaryItem.person.name}
                    </StyledTextValue>
                    <span
                      style={{
                        marginLeft: "8px",
                        float: undefined,
                      }}
                    >
                      {finalBeneficiaryItem.person?.name && (
                        <StyledCopyIcon
                          id={"copyIcon"}
                          onClick={() =>
                            onCopy(finalBeneficiaryItem.person?.name!)
                          }
                        />
                      )}
                    </span>
                  </StyledViewValue>
                </StyledItem>
              </Grid>
              <Grid
                item
                xs={4}
                style={{ marginTop: "8px" }}
                padding={"10px 10px 0 0"}
              >
                <StyledItem>
                  <StyledViewName>{t("personCreateId")}</StyledViewName>
                  <StyledViewValue>
                    <StyledTextValue>
                      {finalBeneficiaryItem.person.identificationNumber}
                    </StyledTextValue>
                    {finalBeneficiaryItem.person?.identificationNumber && (
                      <StyledCopyIcon
                        id={"copyIcon"}
                        onClick={() =>
                          onCopy(
                            finalBeneficiaryItem.person?.identificationNumber!
                          )
                        }
                      />
                    )}
                  </StyledViewValue>
                </StyledItem>
              </Grid>
              <Grid item xs={4} p={1} />
            </Fragment>
          )
        );
      });
    }
  };

  const renderItems = (d: BeneficiariesDataType, index: number) => {
    if (formState === FORM_STATE.VIEW) {
      return (
        <Grid container key={index}>
          <Grid item xs={3}>
            <Grid container width={"100%"}>
              {getItem(d, "status")}
            </Grid>
          </Grid>
          <Grid item xs={9}>
            <Grid container width={"100%"}>
              {getItem(d, "name")}
              {getItem(d, "id")}
              {getItem(d, "share")}
              {d.legalPerson && <>{getItem(d, "finalBenefitiaryName")}</>}
            </Grid>
          </Grid>
        </Grid>
      );
    } else {
      return (
        <Grid container key={index} marginBottom={"24px"}>
          <FILegalPersonItemBeneficiaryFields
            item={d}
            data={data}
            index={index}
            formState={formState}
            setData={setData}
            physicalPerson={physicalPerson}
            legalPersons={legalPersons}
            submitSuccess={submitSuccess}
            getAllFIPhysicalPersons={getAllFIPhysicalPersons}
          />
        </Grid>
      );
    }
  };

  return (
    <StyledRoot
      mt={1}
      sx={{
        opacity:
          formState !== FORM_STATE.VIEW ? 1 : !isEditValid ? 0.6 : undefined,
      }}
    >
      <StyledHeader
        display={"flex"}
        justifyContent={"space-between"}
        width={"100%"}
      >
        <StyledTitle>{t("beneficiaries")}</StyledTitle>
        {formState !== FORM_STATE.VIEW ? (
          <Box
            display={"flex"}
            alignItems={"center"}
            style={{ marginRight: "20px" }}
          >
            <TextButton
              color={"secondary"}
              style={{
                fontSize: 12,
                fontWeight: 500,
                lineHeight: "16px",
              }}
              onClick={() => setIsCancelModalOpen(true)}
            >
              {t("cancel")}
            </TextButton>
            <span
              style={{
                borderLeft: "1px solid #687A9E",
                height: "14px",
              }}
            >
              &nbsp;
            </span>
            <TextButton
              style={{
                fontSize: 12,
                fontWeight: 500,
                lineHeight: "16px",
              }}
              onClick={() => {
                onModeChange && onModeChange(true);
                setConfirmModal(true);
              }}
              endIcon={<CheckIcon sx={{ width: "12px", height: "12px" }} />}
            >
              {t("save")}
            </TextButton>
          </Box>
        ) : (
          <Box
            display={"flex"}
            alignItems={"center"}
            style={{ marginRight: "20px" }}
          >
            {hasPermission(PERMISSIONS.FI_AMEND) && data && data.length > 0 && (
              <StyledEditIcon
                sx={{ opacity: !isEditValid ? 0.6 : 1 }}
                onClick={() => {
                  if (isEditValid) {
                    onModeChange && onModeChange(true);
                    setFormState(FORM_STATE.EDIT);
                  }
                }}
              />
            )}

            {hasPermission(PERMISSIONS.FI_AMEND) && (
              <StyledAddIcon
                sx={{ opacity: !isEditValid ? 0.6 : 1 }}
                onClick={() => isEditValid && onAdd()}
              />
            )}
          </Box>
        )}
      </StyledHeader>
      <Box>
        {getData().map((d, index) => (
          <Box
            display={"flex"}
            key={index}
            style={{
              marginLeft: formState === FORM_STATE.VIEW ? 20 : undefined,
            }}
          >
            {renderItems(d, index)}
            {!isDeleteDisabled(d) ? (
              <StyledDeleteIcon onClick={() => removeItem(index)} />
            ) : (
              <Box width={"46px"} />
            )}
          </Box>
        ))}
      </Box>
      {data && data.length > 0 && (
        <Box ml={2}>
          <TextButton
            onClick={() => setIsOpen(!isOpen)}
            endIcon={isOpen ? <StyledArrowUpIcon /> : <StyledArrowDownIcon />}
          >
            {isOpen ? t("seeLess") : t("seeMore")}
          </TextButton>
        </Box>
      )}
      {isCancelModalOpen && (
        <ConfirmModal
          isOpen={isCancelModalOpen}
          setIsOpen={setIsCancelModalOpen}
          onConfirm={handelCancellation}
          confirmBtnTitle={t("confirm")}
          headerText={t("cancel")}
          additionalBodyText={t("changes")}
          bodyText={t("cancelBodyText")}
          icon={<CancelIcon />}
        />
      )}
      {confirmModal && (
        <ConfirmModal
          isOpen={confirmModal}
          setIsOpen={setConfirmModal}
          onConfirm={onSaveFunction}
          confirmBtnTitle={t("save")}
          headerText={t("saveHeaderText")}
          additionalBodyText={t("changes")}
          bodyText={t("saveBodyText")}
          icon={<SaveIcon />}
        />
      )}
    </StyledRoot>
  );
};

export default FILegalPersonItemBeneficiary;
