import React, { useEffect, useState } from "react";
import Wizard from "../../../../Wizard/Wizard";
import ClosableModal from "../../../../common/Modal/ClosableModal";
import FiConfigurationCreateManagementInfo from "./FiConfigurationCreateManagementInfo";
import FiConfigurationStepCreator from "../../Common/FiConfigurationStepCreator";
import { getFiObjectConfigFieldsByType } from "../../../../../api/services/fi/fiConfigurationObjectService";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import useErrorWindow from "../../../../../hoc/ErrorWindow/useErrorWindow";
import {
  addManagementType,
  editManagementType,
} from "../../../../../api/services/fi/fiManagementTypeService";
import { BranchTypes } from "../../../../../types/fi.type";

const titlePrefix = "Create Management Type: ";

const initialStepItem = {
  index: 1,
  isSelected: true,
  label: "Step 1",
  stepIndexLabel: 1,
};

export interface ManagementInfoItemType {
  code: string;
  name: string;
  nameStrId?: number;
  version: number;
  isError: Record<string, any>;
  id: number;
}

const initialManagementInfoItem = {
  code: "",
  name: "",
  version: 0,
  isError: {},
};

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  afterSubmitSuccess?: (data: BranchTypes, type: "add" | "edit") => void;
  editManagementTypeItem?: BranchTypes | null;
}

const FiConfigurationCreateManagementContainer: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  afterSubmitSuccess,
  editManagementTypeItem,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const steps = [
    t("fiConfigurationManagementStep1Title"),
    t("fiConfigurationManagementStep2Title"),
  ];
  const [height, setHeight] = useState(215);
  const [managementInfoItem, setManagementInfoItem] =
    useState<ManagementInfoItemType>({
      code: "",
      name: "",
      nameStrId: undefined,
      version: 0,
      isError: {},
      id: 0,
    });
  const [columns, setColumns] = useState<any[]>([]);
  const [title, setTitle] = useState(titlePrefix + steps[0]);
  const [stepItems, setStepItems] = useState([{ ...initialStepItem }]);
  const [selectors, setSelectors] = useState([]);

  const { openErrorWindow } = useErrorWindow();

  const onSubmit = () => {
    if (!managementInfoItem.code.trim()) {
      enqueueSnackbar(t("codeCanNotBeEmpty"), { variant: "error" });
      return;
    }
    if (!managementInfoItem.name.trim()) {
      enqueueSnackbar(t("nameCanNotBeEmpty"), { variant: "error" });
      return;
    }

    const selectedColumns = columns
      .filter((column) => column.isSelected)
      .sort((a, b) => a.sequence - b.sequence);

    const indexes: number[] = [];
    selectedColumns.forEach((column) => {
      indexes.indexOf(column.stepperIndex) < 0 &&
        indexes.push(column.stepperIndex);
    });

    const getStepAtStepperIndex = (stepperIndex: number) => {
      return selectedColumns
        .filter((column) => column.stepperIndex === stepperIndex)
        .map((stepColumn) => ({
          index: stepColumn.index,
          key: stepColumn.key,
          type: stepColumn.type,
        }));
    };

    const getStepLabelAtStepperIndex = (stepperIndex: number) => {
      return stepItems.find((si) => si.index === stepperIndex)?.label || "";
    };

    const fiTypeSteps = indexes.sort().map((i, index) => ({
      index: index + 1,
      name: getStepLabelAtStepperIndex(i),
      columns: getStepAtStepperIndex(i),
    }));

    let fiManagementTypeModel: any = {
      code: managementInfoItem.code,
      name: managementInfoItem.name,
      steps: fiTypeSteps,
      version: managementInfoItem.version,
    };

    if (stepItems.length > fiManagementTypeModel.steps.length) {
      enqueueSnackbar(t("stepShouldNotBeEmpty"), {
        variant: "warning",
      });
    } else {
      if (isFiManagementTypeModelValid(fiManagementTypeModel)) {
        if (managementInfoItem.id && managementInfoItem.id > 0) {
          fiManagementTypeModel.id = managementInfoItem.id;
          editFiManagementType(fiManagementTypeModel);
        } else {
          fiManagementTypeModel.id = 0;
          addFiManagementType(fiManagementTypeModel);
        }
      } else {
        enqueueSnackbar(t("fiPersonIsNotProvided"), {
          variant: "error",
        });
      }
    }
  };
  const isFiManagementTypeModelValid = (fiManagementTypeModel: BranchTypes) => {
    const isValidString = (value: string) => {
      return value && value.trim().length > 0;
    };

    if (
      !isValidString(fiManagementTypeModel.code) ||
      !isValidString(fiManagementTypeModel.name)
    ) {
      return false;
    }

    if (
      !fiManagementTypeModel.steps ||
      fiManagementTypeModel.steps.length === 0
    ) {
      return false;
    }

    for (let i of fiManagementTypeModel.steps) {
      if (!i.columns || i.columns.length === 0) return false;
      for (let col of i.columns) {
        if (col.key === "person") return true;
      }
    }
    return false;
  };

  const addFiManagementType = (fiManagementTypeMode: BranchTypes) => {
    addManagementType(fiManagementTypeMode)
      .then((res) => {
        onCancel();
        enqueueSnackbar(t("fiConfigurationManagementTypeCreateSuccess"), {
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

  const editFiManagementType = (fiManagementTypeMode: BranchTypes) => {
    editManagementType(fiManagementTypeMode)
      .then((res) => {
        onCancel();
        enqueueSnackbar(t("fiConfigurationManagementTypeEditSuccess"), {
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
    setManagementInfoItem({
      id: 0,
      nameStrId: 0,
      ...initialManagementInfoItem,
    });
    setStepItems([{ ...initialStepItem }]);
    setHeight(215);
  };

  const onChange = (prev: number, next: number) => {
    setTitle(titlePrefix + (next === 1 ? steps[1] : steps[0]));
    setHeight(next === 1 ? 610 : 215);
  };

  const initColumns = (editManagementTypeItem?: BranchTypes) => {
    const getSelected = (key: string) => {
      if (editManagementTypeItem && editManagementTypeItem.steps) {
        if (editManagementTypeItem.steps.length === 0) {
        } else {
          for (let step of editManagementTypeItem.steps) {
            if (step.columns) {
              const selectedColumn = step.columns.filter(
                (sc) => sc.key === key
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
      }
      return {
        isSelected: false,
      };
    };

    getFiObjectConfigFieldsByType("MANAGEMENT")
      .then((res) => {
        const data = res.data;
        const managementColumns: any[] = [];
        Object.keys(data).forEach((key, index) => {
          //get sorted col sequenc
          let selected = getSelected(key);
          let sequence = 0;
          if (selected && editManagementTypeItem?.steps) {
            for (let step of editManagementTypeItem.steps) {
              const selectedColumnIndex = step.columns.findIndex(
                (sc) => sc.key === key
              );

              if (selectedColumnIndex >= 0) {
                sequence = selectedColumnIndex;
                break;
              }
            }
          }

          managementColumns.push({
            ...selected,
            key,
            sequence: sequence,
            id: key,
            type: data[key],
            headerName: t("managementField" + key),
            index,
          });
        });
        setColumns(managementColumns);
      })
      .catch((error) => enqueueSnackbar(error, { variant: "error" }));
  };

  useEffect(() => {
    initColumns(editManagementTypeItem || undefined);

    if (editManagementTypeItem) {
      setManagementInfoItem({
        id: editManagementTypeItem.id ?? 0,
        code: editManagementTypeItem.code,
        name: editManagementTypeItem.name,
        nameStrId: editManagementTypeItem.nameStrId,
        version: editManagementTypeItem.version ?? 0,
        isError: {},
      });

      if (
        editManagementTypeItem.steps &&
        editManagementTypeItem.steps.length > 0
      ) {
        const editItemSteps = editManagementTypeItem.steps.map(
          (ebi, index) => ({
            index: ebi.index,
            isSelected: index === 0,
            label: ebi.name,
            stepIndexLabel: ebi.index,
          })
        );
        setStepItems(editItemSteps);
      }
    }
  }, [editManagementTypeItem]);

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
        hideStepper={true}
        title={title}
        isNextStepValid={Boolean(
          managementInfoItem.code.trim() && managementInfoItem.name.trim()
        )}
      >
        <FiConfigurationCreateManagementInfo
          managementInfoItem={managementInfoItem}
          setManagementInfoItem={setManagementInfoItem}
        />
        <FiConfigurationStepCreator
          columns={columns}
          stepItems={stepItems}
          setStepItems={setStepItems}
          selectors={selectors}
          setSelectors={setSelectors}
          isEdit={!!editManagementTypeItem}
        />
      </Wizard>
    </ClosableModal>
  );
};

export default FiConfigurationCreateManagementContainer;
