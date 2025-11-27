import { Box } from "@mui/system";
import TextField from "../../../common/Field/TextField";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Select from "../../../common/Field/Select";
import { getReturnDefinitions } from "../../../../api/services/returnsService";
import PrimaryBtn from "../../../common/Button/PrimaryBtn";
import PackageDragAndDrop from "./PackageDragAndDrop";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { styled } from "@mui/material/styles";
import {
  OSTPackage,
  PackageReturnDefinitionType,
} from "../../../../types/tools.type";
import {
  ReturnDefinitionType,
  ReturnType,
} from "../../../../types/returnDefinition.type";
import { FiTypeDataType } from "../../../../types/fi.type";

interface PackageModalProps {
  selectedItem: OSTPackage;
  setIsEditModalOpen?: (value: boolean) => void;
  returnTypes?: ReturnType[];
  fiTypes?: FiTypeDataType[];

  onPackageSave(item: Partial<OSTPackage>): void;
}

const StyledTextField = styled(Box)({
  padding: "4px",
});

const StyledFooter = styled(Box)(({ theme }: any) => ({
  display: "flex",
  padding: 10,
  justifyContent: "flex-end",
  ...theme.modalFooter,
}));

const PackageModal: React.FC<PackageModalProps> = ({
  onPackageSave,
  selectedItem,
  returnTypes,
  fiTypes,
}) => {
  const { t } = useTranslation();
  const [returnDefinitions, setReturnDefinitions] = useState([]);
  const [filteredReturnDefinitions, setFilteredReturnDefinitions] = useState<
    PackageReturnDefinitionType[]
  >([]);
  const [displayColumns, setDisplayColumns] = useState<
    PackageReturnDefinitionType[]
  >([]);
  const [data, setData] = useState<Partial<OSTPackage>>();

  useEffect(() => {
    if (selectedItem && selectedItem?.id) {
      setData(selectedItem);
      setDisplayColumns(
        selectedItem.returnDefinitions
          .map((element, index) => {
            return {
              ...element,
              dndId: "destination-" + element.id,
              isSelected: true,
              sequence: index,
              index: index,
              headerName: element.name,
            };
          })
          .sort((a: any, b: any) => a.isSelected - b.isSelected)
      );
    }
    initReturnDefinitions();
  }, []);

  const initReturnDefinitions = async () => {
    const res = await getReturnDefinitions("FILTER_RETURN_TYPE_ID");
    if (returnDefinitions.length <= 0) {
      setReturnDefinitions(res.data);
    }

    changeItemFunction(res.data);
  };

  const isSaveDisabled = (): boolean => {
    if (!data) return true;

    const hasCode = !!data.code;
    const hasFiTypes = Array.isArray(data.fiTypes) && data.fiTypes.length > 0;
    const hasReturnDefinitions = displayColumns.length > 0;

    return !(hasCode && hasFiTypes && hasReturnDefinitions);
  };

  const changeItemFunction = (data: ReturnDefinitionType[]) => {
    let fiData: any[] = [
      ...data
        .map((element, index: number) => {
          return {
            ...element,
            dndId: "destination-" + element.id,
            isSelected: selectedItem.id
              ? selectedItem.returnDefinitions.find(
                  (item) => item.id === element.id
                )
              : false,
            sequence: index,
            index: index,
            headerName: element.name,
          };
        })
        .sort((a: any, b: any) => a.isSelected - b.isSelected),
    ];
    setFilteredReturnDefinitions([...fiData]);
  };

  const GetDragAndDrop = useMemo(() => {
    return (
      <PackageDragAndDrop
        filteredReturnDefinitions={filteredReturnDefinitions}
        setFilteredReturnDefinitions={setFilteredReturnDefinitions}
        displayColumns={displayColumns}
        setDisplayColumns={setDisplayColumns}
      />
    );
  }, [filteredReturnDefinitions, displayColumns]);

  return (
    <>
      <Box padding={"8px 16px"}>
        <StyledTextField>
          <TextField
            value={data?.code}
            onChange={(val: string) => {
              setData({ ...data, code: val });
            }}
            label={t("packageCode")}
            fieldName={"packageCode"}
          />
        </StyledTextField>
        <StyledTextField>
          <TextField
            value={data?.note}
            onChange={(val: string) => {
              setData({ ...data, note: val });
            }}
            label={t("packageNote")}
            fieldName={"packageNote"}
          />
        </StyledTextField>
        <StyledTextField>
          <Select
            value={data?.fiTypes?.[0]?.id ?? ""}
            onChange={(id) => {
              setData({
                ...data,
                fiTypes:
                  fiTypes?.filter((item) => item.id.toString() == id) ?? [],
              });
            }}
            label={t("fiType")}
            data={
              fiTypes?.map((item) => {
                return { label: item.code, value: item.id };
              }) ?? ([] as any)
            }
            data-testid={"fiType-select"}
          />
        </StyledTextField>
        <StyledTextField>
          <Select
            onChange={() => {
              initReturnDefinitions();
            }}
            label={t("returnType")}
            data={
              returnTypes?.map((item) => {
                return { label: item.code, value: item.id };
              }) ?? []
            }
            data-testid={"returnType-select"}
          />
        </StyledTextField>

        {GetDragAndDrop}
      </Box>
      <StyledFooter>
        <Box>
          <PrimaryBtn
            onClick={() => {
              let tmp: Partial<OSTPackage> = {
                ...data,
                returnDefinitions: displayColumns,
                hasFiTypes: true,
                hasReturnDefinitions: true,
              };
              setData(tmp);
              onPackageSave(tmp);
            }}
            backgroundColor={"#289E20"}
            endIcon={<CheckRoundedIcon />}
            disabled={isSaveDisabled()}
            data-testid={"save-button"}
          >
            {t("save")}
          </PrimaryBtn>
        </Box>
      </StyledFooter>
    </>
  );
};

export default PackageModal;
