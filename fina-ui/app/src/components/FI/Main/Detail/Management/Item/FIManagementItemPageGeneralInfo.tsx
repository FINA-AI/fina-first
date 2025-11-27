import Grid from "@mui/material/Grid";
import WorkIcon from "@mui/icons-material/Work";
import { FieldType } from "../../../../util/FiUtil";
import { useTranslation } from "react-i18next";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MailIcon from "@mui/icons-material/Mail";
import CallIcon from "@mui/icons-material/Call";
import DateRangeIcon from "@mui/icons-material/DateRange";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import { Box } from "@mui/system";
import DetailForm, {
  FORM_STATE,
} from "../../../../../common/Detail/DetailForm";
import React, { useEffect, useMemo, useState } from "react";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import SensorWindowIcon from "@mui/icons-material/SensorWindow";
import FiInput from "../../../../Common/FiInput";
import { useSnackbar } from "notistack";
import { styled } from "@mui/material/styles";
import {
  BranchColumnType,
  FiManagementType,
  ManagementDataType,
} from "../../../../../../types/fi.type";
import { OriginalCommitteeDataType } from "../../../../../../containers/FI/Main/Management/FIManagementItemContainer";

const StyledDetailsBox = styled(Box)({
  overflowY: "auto",
});

const StyledComiteteDetails = styled(Box, {
  shouldForwardProp: (prop) => prop !== "generalInfoEditOpen",
})<{
  generalInfoEditOpen: boolean;
}>(({ theme, generalInfoEditOpen }: any) => ({
  borderTop: theme.palette.borderColor,
  overflowY: "auto",
  opacity: "1",
  "& .MuiSvgIcon-root": {
    cursor: !generalInfoEditOpen ? "" : "pointer",
  },
}));

interface FIManagementItemPageGeneralInfoProps {
  editMode: boolean;
  fiManagementType: FiManagementType;
  managementItem: ManagementDataType;
  activeEditBtn: {
    mainInfoEditDisabled: boolean;
    comiteteInfoEditDisabled: boolean;
  };
  setActiveEditBtn: React.Dispatch<
    React.SetStateAction<{
      mainInfoEditDisabled: boolean;
      comiteteInfoEditDisabled: boolean;
    }>
  >;
  regions: Region[];
  setNewManagementGeneralInfo: React.Dispatch<
    React.SetStateAction<ManagementDataType>
  >;
  comiteteFormState: string;
  setComiteteFormState: React.Dispatch<React.SetStateAction<string>>;
  comiteteOpen: boolean;
  setComiteteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  shareFormItems: any[];
  recommendationFormItems: any[];
  educationFormItems: any[];
  criminalRecordFormItems: any[];
  positionsFormItems: any[];
  comiteteFormItems: any[];
  setHasStatus: React.Dispatch<React.SetStateAction<boolean>>;
  newManagementGeneralInfo: ManagementDataType;
  generalSaveFunction: (data?: ManagementDataType) => Promise<void> | void;
  onCancel: () => void;
  onSave: () => void;
  originalCommitteeList: OriginalCommitteeDataType[];
  setOriginalCommitteetList: React.Dispatch<
    React.SetStateAction<OriginalCommitteeDataType[]>
  >;
}

interface Region {
  label: string;
  value: number | boolean;
}

const FIManagementItemPageGeneralInfo: React.FC<
  FIManagementItemPageGeneralInfoProps
> = ({
  editMode,
  fiManagementType,
  managementItem,
  activeEditBtn,
  setActiveEditBtn,
  regions,
  setNewManagementGeneralInfo,
  comiteteFormState,
  setComiteteFormState,
  comiteteOpen,
  setComiteteOpen,
  shareFormItems,
  recommendationFormItems,
  educationFormItems,
  criminalRecordFormItems,
  positionsFormItems,
  comiteteFormItems,
  setHasStatus,
  newManagementGeneralInfo,
  generalSaveFunction,
  onCancel,
  onSave,
  originalCommitteeList,
  setOriginalCommitteetList,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [comiteteInfo, setComiteteInfo] = useState<OriginalCommitteeDataType[]>(
    []
  );
  const [openOtherShare, setOpenOtherShare] = useState(false);
  const [openEducation, setOpenEduation] = useState(false);
  const [openRecommender, setOpenRecommender] = useState(false);
  const [openCriminalRecord, setOpenCriminalRecord] = useState(false);
  const [openCompany, setOpenCompany] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  useEffect(() => {
    if (managementItem && managementItem.committeeList) {
      setComiteteInfo([...managementItem.committeeList]);
      setNewManagementGeneralInfo(managementItem);
    }
  }, [managementItem]);

  const changeGeneralInfo = (key: string, value: any) => {
    if (!newManagementGeneralInfo) return;
    let changedInfo = { ...newManagementGeneralInfo };
    // @ts-expect-error
    changedInfo[key] = value;
    setNewManagementGeneralInfo(changedInfo);
  };
  useEffect(() => {
    if (comiteteOpen) {
      setActiveEditBtn({
        mainInfoEditDisabled: true,
        comiteteInfoEditDisabled: false,
      });
    }
  }, [comiteteOpen]);

  const createManagentFieldByStep = (step: any) => {
    return step.columns?.map((item: BranchColumnType, index: number) =>
      generateManagementField(item, index)
    );
  };

  const generateManagementField = (item: BranchColumnType, index: number) => {
    if (item.key === "disable") {
      setHasStatus(true);
    }

    let type;
    switch (item.type) {
      case "date":
      case "Date":
        type = FieldType.DATE;
        break;
      case "long":
      case "int":
      case "Long":
      case "Integer":
        type = FieldType.NUMBER;
        break;
      case "boolean":
      case "Boolean":
      case "Region":
      case "RegionMetaModel":
      case "FiPerson":
      case "PersonMetaModel":
        type = FieldType.LIST;
        break;
      default:
        type = FieldType.STRING;
        break;
    }

    const value = managementItem ? (managementItem as any)[item.key] : "";
    let data: Region[] = [];

    if (item.type === "Region" || item.type === "RegionMetaModel") {
      data = regions ?? [];
    }
    if (item.type === "boolean" || item.type === "Boolean") {
      data = [
        {
          label: t("yes"),
          value: true,
        },
        {
          label: t("no"),
          value: false,
        },
      ];
    }

    if (item.key === "dependencyStatus") {
      data = [
        {
          label: t("dependent"),
          value: true,
        },
        {
          label: t("independent"),
          value: false,
        },
      ];
    }

    if (item.key !== "person" && item.key !== "disable") {
      return (
        <Grid item xs={12} md={6} lg={4} key={index}>
          <div key={index} style={{ padding: "4px" }}>
            <FiInput
              key={index}
              title={t("managementField" + item.key)}
              name={item.key}
              value={value}
              icon={getInputIcon(item.key)}
              onValueChange={(value) => changeGeneralInfo(item.key, value)}
              editMode={editMode}
              inputTypeProp={{ inputType: type, listData: data }}
              width={"100%"}
            />
          </div>
        </Grid>
      );
    }
  };

  const getInputIcon = (key: string) => {
    switch (key) {
      case "address":
        return <LocationOnIcon />;
      case "appointmentDate":
        return <DateRangeIcon />;
      case "commentId1String":
        return <QuestionAnswerIcon />;
      case "dateOfApproval":
        return <DateRangeIcon />;
      case "dependencyStatus":
        return <LocationSearchingIcon />;
      case "mail":
        return <MailIcon />;
      case "phone":
        return <CallIcon />;
      case "firstName":
      case "lastName":
        return <PermIdentityIcon />;
      case "portfolio":
        return <SensorWindowIcon />;
      default:
        return <WorkIcon />;
    }
  };

  const onComiteteCancelFunction = () => {
    onCancel();
    if (managementItem && managementItem.committeeList) {
      setComiteteInfo(JSON.parse(JSON.stringify(originalCommitteeList)));
      setComiteteOpen(false);
      setActiveEditBtn({
        mainInfoEditDisabled: false,
        comiteteInfoEditDisabled: false,
      });
      setComiteteFormState(FORM_STATE.VIEW);
    }
  };

  const onComiteteSaveFunction = async (committeData: any[]) => {
    let isAllFieldValid = true;
    committeData.forEach((item) => {
      if (!item["errors"]) {
        item["errors"] = {};
      }
      if (!item.name) {
        isAllFieldValid = false;
        item["errors"]["name"] = true;
      } else {
        item["errors"]["name"] = false;
      }

      if (!item.position) {
        isAllFieldValid = false;
        item["errors"]["position"] = true;
      } else {
        item["errors"]["position"] = false;
      }
    });

    if (isAllFieldValid) {
      let data = { ...managementItem };
      data.committeeList = committeData;
      setOriginalCommitteetList(data.committeeList);
      await generalSaveFunction(data);
      setComiteteFormState(FORM_STATE.VIEW);
      onSave();
    } else {
      enqueueSnackbar(t("requiredFieldsAreEmpty"), { variant: "error" });
      setComiteteInfo(committeData);
    }

    setComiteteOpen(false);
  };

  const getCompaniesMemo = useMemo(() => {
    if (managementItem && managementItem.person) {
      let data =
        managementItem.person.positions.length !== 0
          ? managementItem.person.positions
          : [];
      return (
        <Grid item xs={12}>
          <StyledDetailsBox>
            <DetailForm
              title={t("positionInOtherCompanies")}
              name={"positionInOtherCompanies"}
              formItems={positionsFormItems}
              data={data}
              formState={FORM_STATE.VIEW}
              setFormState={() => {}}
              onCancel={() => {}}
              onSave={() => {}}
              isOpen={openCompany}
              setIsOpen={setOpenCompany}
              isEditValid={false}
              isCancelModalOpen={isCancelModalOpen}
              setIsCancelModalOpen={setIsCancelModalOpen}
            />
          </StyledDetailsBox>
        </Grid>
      );
    }
  }, [managementItem, openCompany]);

  const getCriminalRecordMemo = useMemo(() => {
    if (managementItem && managementItem.person) {
      let data =
        managementItem.person.criminalRecords.length !== 0
          ? managementItem.person.criminalRecords
          : [];
      return (
        <Grid item xs={12}>
          <StyledDetailsBox>
            <DetailForm
              title={t("criminalRecord")}
              name={"criminalRecord"}
              formItems={criminalRecordFormItems}
              data={data}
              formState={FORM_STATE.VIEW}
              setFormState={() => {}}
              onCancel={() => {}}
              onSave={() => {}}
              isOpen={openCriminalRecord}
              setIsOpen={setOpenCriminalRecord}
              isEditValid={false}
              isCancelModalOpen={isCancelModalOpen}
              setIsCancelModalOpen={setIsCancelModalOpen}
            />
          </StyledDetailsBox>
        </Grid>
      );
    }
  }, [managementItem, openCriminalRecord]);

  const getRecommenderMemo = useMemo(() => {
    if (managementItem && managementItem.person) {
      let data =
        managementItem.person.recommendations.length !== 0
          ? managementItem.person.recommendations
          : [];
      return (
        <Grid item xs={12}>
          <StyledDetailsBox>
            <DetailForm
              title={t("recommendation")}
              name={"recommendation"}
              formItems={recommendationFormItems}
              data={data}
              formState={FORM_STATE.VIEW}
              setFormState={() => {}}
              onCancel={() => {}}
              onSave={() => {}}
              isOpen={openRecommender}
              setIsOpen={setOpenRecommender}
              isEditValid={false}
              isCancelModalOpen={isCancelModalOpen}
              setIsCancelModalOpen={setIsCancelModalOpen}
            />
          </StyledDetailsBox>
        </Grid>
      );
    }
  }, [managementItem, openRecommender]);

  const getEducationMemo = useMemo(() => {
    if (managementItem && managementItem.person) {
      let data =
        managementItem.person.education.length !== 0
          ? managementItem.person.education
          : [];
      return (
        <Grid item xs={12}>
          <StyledDetailsBox>
            <DetailForm
              title={t("education")}
              name={"education"}
              formItems={educationFormItems}
              data={data}
              formState={FORM_STATE.VIEW}
              setFormState={() => {}}
              onCancel={() => {}}
              onSave={() => {}}
              isOpen={openEducation}
              setIsOpen={setOpenEduation}
              isEditValid={false}
              isCancelModalOpen={isCancelModalOpen}
              setIsCancelModalOpen={setIsCancelModalOpen}
            />
          </StyledDetailsBox>
        </Grid>
      );
    }
  }, [managementItem, openEducation]);

  const getOtherSharesMemo = useMemo(() => {
    if (managementItem && managementItem.person) {
      let data =
        managementItem.person.shares.length !== 0
          ? managementItem.person.shares
          : [];
      return (
        <Grid item xs={12}>
          <StyledDetailsBox>
            <DetailForm
              title={t("otherShares")}
              name={"otherShares"}
              formItems={shareFormItems}
              data={data}
              formState={FORM_STATE.VIEW}
              setFormState={() => {}}
              onCancel={() => {}}
              onSave={() => {}}
              isOpen={openOtherShare}
              setIsOpen={setOpenOtherShare}
              isEditValid={false}
              isCancelModalOpen={isCancelModalOpen}
              setIsCancelModalOpen={setIsCancelModalOpen}
            />
          </StyledDetailsBox>
        </Grid>
      );
    }
  }, [managementItem, openOtherShare]);

  return (
    <Grid
      container
      sx={{
        maxHeight: "100%",
        overflow: "auto",
        borderRadius: "8px !important",
      }}
    >
      <Grid container p={"8px 12px"}>
        {fiManagementType &&
          fiManagementType.steps &&
          fiManagementType.steps.map((item) => createManagentFieldByStep(item))}
      </Grid>

      {managementItem && managementItem.person && (
        <Grid item xs={12}>
          <StyledComiteteDetails
            generalInfoEditOpen={activeEditBtn.mainInfoEditDisabled}
          >
            <DetailForm
              title={t("comitets")}
              name={"commitees"}
              formItems={comiteteFormItems}
              data={comiteteInfo}
              formState={comiteteFormState}
              setFormState={setComiteteFormState}
              onCancel={onComiteteCancelFunction}
              onSave={onComiteteSaveFunction}
              isOpen={comiteteOpen}
              setIsOpen={setComiteteOpen}
              isEditValid={!activeEditBtn.comiteteInfoEditDisabled}
              islastFieldComment={true}
              expandedRow={comiteteFormState === FORM_STATE.ADD}
              isCancelModalOpen={isCancelModalOpen}
              setIsCancelModalOpen={setIsCancelModalOpen}
            />
          </StyledComiteteDetails>
        </Grid>
      )}

      <Box width={"100%"} sx={{ opacity: "0.6 !important" }}>
        {getOtherSharesMemo}
        {getEducationMemo}
        {getRecommenderMemo}
        {getCriminalRecordMemo}
        {getCompaniesMemo}
      </Box>
    </Grid>
  );
};

export default FIManagementItemPageGeneralInfo;
