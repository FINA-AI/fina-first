import React, { useEffect, useState } from "react";
import Wizard from "../../../../Wizard/Wizard";
import ClosableModal from "../../../../common/Modal/ClosableModal";
import FiConfigurationCreateBreanchInfo from "./FiConfigurationCreateBreanchInfo";
import FiConfigurationStepCreator from "../../Common/FiConfigurationStepCreator";
import { getFiObjectConfigFieldsByType } from "../../../../../api/services/fi/fiConfigurationObjectService";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import {
  addBranchType,
  editBranchType,
} from "../../../../../api/services/fi/fiBranchTypeService";
import useErrorWindow from "../../../../../hoc/ErrorWindow/useErrorWindow";
import { BranchTypes } from "../../../../../types/fi.type";

const titlePrefix = "Create Branch Type: ";

const initialStepItem: StepItemType = {
  index: 1,
  isSelected: true,
  label: "Step 1",
  stepIndexLabel: 1,
};

const initialBranchInfoItem: BranchInfoItemType = {
  code: "",
  name: "",
  isError: {},
};

interface FiConfigurationCreateBranchContainerProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  afterSubmitSuccess?: (data: any, type: "add" | "edit") => void;
  editBranchTypeItem?: BranchTypes | null;
}

interface BranchInfoItemType {
  id?: number;
  code: string;
  name: string;
  nameStrId?: string | number;
  isError: Record<string, boolean>;
}

export interface StepItemType {
  index: number;
  isSelected: boolean;
  label: string;
  stepIndexLabel: number;
}

export interface ColumnType {
  key: string;
  type: string;
  headerName: string;
  index: number;
  id: string;
  isSelected?: boolean;
  stepperIndex?: number;
  sequence?: number;
}

const FiConfigurationCreateBranchContainer: React.FC<
  FiConfigurationCreateBranchContainerProps
> = ({ isOpen, setIsOpen, afterSubmitSuccess, editBranchTypeItem }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const steps = [
    t("fiConfigurationBranchStep1Title"),
    t("fiConfigurationBranchStep2Title"),
  ];
  const [height, setHeight] = useState(215);
  const [branchInfoItem, setBranchInfoItem] = useState({
    ...initialBranchInfoItem,
  });
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [title, setTitle] = useState(titlePrefix + steps[0]);
  const [stepItems, setStepItems] = useState<StepItemType[]>([
    { ...initialStepItem },
  ]);
  const [selectors, setSelectors] = useState<any>([]);

  const { openErrorWindow } = useErrorWindow();

  const onSubmit = () => {
    if (!branchInfoItem.code.trim()) {
      enqueueSnackbar(t("codeCanNotBeEmpty"), { variant: "error" });
      return;
    }
    if (!branchInfoItem.name.trim()) {
      enqueueSnackbar(t("nameCanNotBeEmpty"), { variant: "error" });
      return;
    }

    const selectedColumns = columns
      .filter((column) => column.isSelected)
      .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));

    const indexes: number[] = [];
    selectedColumns.forEach((column) => {
      if (
        column.stepperIndex !== undefined &&
        !indexes.includes(column.stepperIndex)
      ) {
        indexes.push(column.stepperIndex);
      }
    });

    const getStepAtStepperIndex = (stepperIndex: number) => {
      let result: any = [];
      const stepColumns = selectedColumns.filter(
        (column) => column.stepperIndex === stepperIndex
      );
      stepColumns.forEach((stepColumn) => {
        result.push({
          index: stepColumn.index,
          key: stepColumn.key,
          type: stepColumn.type,
        });
      });
      return result;
    };

    const getStepLabelAtStepperIndex = (stepperIndex: number) => {
      return stepItems.find((si) => si.index === stepperIndex)?.label || "";
    };

    const fiTypeSteps = indexes.sort().map((i, index) => ({
      index: index + 1,
      name: getStepLabelAtStepperIndex(i),
      columns: getStepAtStepperIndex(i),
    }));

    let fiBranchTypeModel: any = {
      code: branchInfoItem.code,
      name: branchInfoItem.name,
      steps: fiTypeSteps,
    };

    if (stepItems.length > fiBranchTypeModel.steps.length) {
      enqueueSnackbar(t("stepShouldNotBeEmpty"), {
        variant: "warning",
      });
    } else {
      if (isFiBranchTypeModelValid(fiBranchTypeModel)) {
        if (branchInfoItem.id && branchInfoItem.id > 0) {
          fiBranchTypeModel.id = branchInfoItem.id;
          editFiBranchType(fiBranchTypeModel);
        } else {
          fiBranchTypeModel.id = 0;
          addFiBranchType(fiBranchTypeModel);
        }
      } else {
        enqueueSnackbar(t("codeFieldIsNotProvided"), {
          variant: "error",
        });
      }
    }
  };

  const isFiBranchTypeModelValid = (fiBranchTypeModel: any): boolean => {
    const isValidString = (value: string) => value && value.trim().length > 0;

    if (!isValidString(fiBranchTypeModel.code)) return false;
    if (!fiBranchTypeModel.steps?.length) return false;

    let hasCode = false;
    let hasRegion = false;

    for (let step of fiBranchTypeModel.steps) {
      if (!step.columns?.length) return false;
      for (let col of step.columns) {
        if (col.key === "code") hasCode = true;
        if (col.key === "regionModel") hasRegion = true;
        if (hasCode && hasRegion) return true;
      }
    }

    return false;
  };

  const addFiBranchType = (fiBranchTypeMode: any) => {
    addBranchType(fiBranchTypeMode)
      .then((res) => {
        onCancel();
        enqueueSnackbar(t("fiConfigurationBranchTypeCreateSuccess"), {
          variant: "success",
        });
        if (afterSubmitSuccess) {
          afterSubmitSuccess(res.data, "add");
        }
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const editFiBranchType = (fiBranchTypeMode: any) => {
    editBranchType(fiBranchTypeMode)
      .then((res) => {
        onCancel();
        enqueueSnackbar(t("fiConfigurationBranchTypeEditSuccess"), {
          variant: "success",
        });
        if (afterSubmitSuccess) {
          afterSubmitSuccess(res.data, "edit");
        }
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const onCancel = () => {
    setIsOpen(false);
    setSelectors([]);
    setColumns([]);
    initColumns();
    setBranchInfoItem({ ...initialBranchInfoItem });
    setStepItems([{ ...initialStepItem }]);
    setHeight(215);
  };

  const onChange = (_prev: number, next: number) => {
    setTitle(titlePrefix + (next === 1 ? steps[1] : steps[0]));
    setHeight(next === 1 ? 610 : 215);
  };

  const initColumns = (editBranchTypeItem?: any) => {
    const getSelected = (key: any) => {
      if (editBranchTypeItem && editBranchTypeItem.steps) {
        for (let step of editBranchTypeItem.steps) {
          if (step.columns) {
            const selectedColumn = step.columns.filter(
              (sc: any) => sc.key === key
            );
            if (selectedColumn && selectedColumn.length === 1) {
              return {
                isSelected: true,
                stepperIndex: step.index,
              };
            }
          }
        }
      }
      return {
        isSelected: false,
      };
    };

    getFiObjectConfigFieldsByType("BRANCH")
      .then((res) => {
        const data = res.data;
        const branchColumns: any = [];
        Object.keys(data).forEach((key, index) => {
          //get sorted col sequenc
          let selected = getSelected(key);
          let sequence = 0;
          if (selected && editBranchTypeItem?.steps) {
            for (let step of editBranchTypeItem.steps) {
              const selectedColumnIndex = step.columns.findIndex(
                (sc: any) => sc.key === key
              );

              if (selectedColumnIndex >= 0) {
                sequence = selectedColumnIndex;
                break;
              }
            }
          }

          branchColumns.push({
            ...selected,
            key,
            sequence: sequence,
            id: key,
            type: data[key],
            headerName: t("branchField" + key),
            index,
          });
        });
        setColumns(branchColumns);
      })
      .catch((error) => {
        enqueueSnackbar(error, { variant: "error" });
      });
  };

  useEffect(() => {
    initColumns(editBranchTypeItem);

    if (editBranchTypeItem) {
      setBranchInfoItem({
        id: editBranchTypeItem.id,
        code: editBranchTypeItem.code,
        name: editBranchTypeItem.name,
        nameStrId: editBranchTypeItem.nameStrId,
        isError: {},
      });

      const editItemSteps: StepItemType[] =
        editBranchTypeItem.steps?.map((ebi, index) => ({
          index: ebi.index,
          isSelected: index === 0,
          label: ebi.name,
          stepIndexLabel: ebi.index,
        })) ?? [];

      setStepItems(editItemSteps);
    }
  }, [editBranchTypeItem]);

  return (
    <ClosableModal
      onClose={onCancel}
      open={isOpen}
      width={785}
      height={height}
      includeHeader={false}
      disableBackdropClick={true}
    >
      <Wizard
        steps={steps}
        onCancel={onCancel}
        onSubmit={onSubmit}
        onNext={onChange}
        onBack={onChange}
        isSubmitDisabled={false}
        hideStepper={true}
        title={title}
      >
        <FiConfigurationCreateBreanchInfo
          branchInfoItem={branchInfoItem}
          setBranchInfoItem={setBranchInfoItem}
        />
        <FiConfigurationStepCreator
          columns={columns}
          stepItems={stepItems}
          setStepItems={setStepItems}
          selectors={selectors}
          setSelectors={setSelectors}
          isEdit={!!editBranchTypeItem}
        />
      </Wizard>
    </ClosableModal>
  );
};

export default FiConfigurationCreateBranchContainer;
