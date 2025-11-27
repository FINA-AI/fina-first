import { Box, Grid } from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import ExtensionIcon from "@mui/icons-material/Extension";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import DateRangeIcon from "@mui/icons-material/DateRange";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { FieldType } from "../../../util/FiUtil";
import { useTranslation } from "react-i18next";
import FiInput from "../../../Common/FiInput";
import React, { ReactElement } from "react";
import { CountryDataTypes } from "../../../../../types/common.type";
import { FiDataType } from "../../../../../types/fi.type";
import { SwiftCodeIcon } from "../../../../../api/ui/icons/SwiftCodeIcon";
import { IdCodeIcon } from "../../../../../api/ui/icons/IdCodeIcon";

interface FiMainInfoProps {
  fi: FiDataType;
  editMode: boolean;
  onValueChange: (value: any, field: string, isValid?: boolean) => void;
  countries: CountryDataTypes[];
}

const FiMainInfo: React.FC<FiMainInfoProps> = ({
  fi,
  editMode,
  onValueChange,
  countries,
}): ReactElement => {
  const { t } = useTranslation();

  const reorganizationData = [
    {
      label: t("MERGER"),
      value: "MERGER",
    },
    {
      label: t("ACQUISITION"),
      value: "ACQUISITION",
    },
    {
      label: t("DIVISION"),
      value: "DIVISION",
    },
    {
      label: t("SPINOFF"),
      value: "SPINOFF",
    },
  ];

  const getFiRegion = (): number | undefined => {
    return countries.find((item) => item.id === fi.regionId)?.id;
  };

  return (
    <Box display={"flex"} width={"100%"} flexDirection={"column"}>
      <Grid container>
        <Grid item p={"4px"} xs={3}>
          <FiInput
            title={t("catalogCode")}
            name={"code"}
            value={fi.code}
            icon={<CodeIcon />}
            editMode={editMode}
            onValueChange={onValueChange}
            readOnly
            width={"100%"}
          />
        </Grid>
        <Grid item p={"4px"} xs={3}>
          <FiInput
            title={t("shortName")}
            name={"shortNameString"}
            value={fi.shortNameString}
            icon={<ExtensionIcon />}
            editMode={editMode}
            onValueChange={onValueChange}
            width={"100%"}
          />
        </Grid>
        <Grid item p={"4px"} xs={3}>
          <FiInput
            title={t("identificationCode")}
            name={"identificationCode"}
            value={fi.identificationCode}
            icon={<IdCodeIcon />}
            editMode={editMode}
            onValueChange={onValueChange}
            width={"100%"}
          />
        </Grid>
        <Grid item p={"4px"} xs={3}>
          <FiInput
            title={t("swiftCode")}
            name={"swiftCode"}
            value={fi.swiftCode}
            icon={<SwiftCodeIcon />}
            editMode={editMode}
            onValueChange={onValueChange}
            width={"100%"}
            pattern={/^$|^[\p{L}\p{N}]+$/u}
          />
        </Grid>
        <Grid item p={"4px"} xs={3}>
          <FiInput
            title={t("reorganization")}
            name={"reorganization"}
            value={fi.reorganization}
            icon={<TrackChangesIcon />}
            editMode={editMode}
            inputTypeProp={{
              inputType: FieldType.LIST,
              listData: reorganizationData,
            }}
            onValueChange={onValueChange}
            width={"100%"}
          />
        </Grid>
        <Grid item p={"4px"} xs={3}>
          <FiInput
            title={t("registrationDate")}
            name={"registrationDate"}
            value={fi.registrationDate}
            icon={<DateRangeIcon />}
            editMode={editMode}
            inputTypeProp={{ inputType: FieldType.DATE }}
            onValueChange={onValueChange}
            width={"100%"}
          />
        </Grid>
        <Grid item p={"4px"} xs={3}>
          <FiInput
            title={t("closeDate")}
            name={"closeDate"}
            value={fi.closeDate}
            icon={<DateRangeIcon />}
            editMode={editMode}
            inputTypeProp={{ inputType: FieldType.DATE }}
            onValueChange={onValueChange}
            width={"100%"}
          />
        </Grid>
        <Grid item p={"4px"} xs={3}>
          <FiInput
            title={t("region")}
            name={"regionId"}
            value={getFiRegion()}
            icon={<LocationOnIcon />}
            editMode={editMode}
            onValueChange={(value, name, isValid) =>
              onValueChange(Number(value), name, isValid)
            }
            inputTypeProp={{
              inputType: FieldType.LIST,
              listData: countries.map((e) => ({
                label: e.name,
                value: e.id,
              })),
            }}
            width={"100%"}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default FiMainInfo;
