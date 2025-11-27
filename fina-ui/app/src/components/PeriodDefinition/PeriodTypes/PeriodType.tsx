import { Grid } from "@mui/material";
import ReturnTypeCard from "../../ReturnTypes/ReturnTypeCard";
import React, { useState } from "react";
import CrudFormModal from "../../common/Modal/CrudFormModal";
import { PeriodType as PeriodTypes } from "../../../types/period.type";
import { PERMISSIONS } from "../../../api/permissions";

interface PeriodTypeProps {
  data: PeriodTypes[];
  addNewModalOpen: boolean;
  setAddNewModalOpen: (isOpen: boolean) => void;
  savePeriodTypes: (val: PeriodTypes) => void;
  periodTypeDeleteHandler: (id: number) => void;
}

const PeriodType: React.FC<PeriodTypeProps> = ({
  data,
  addNewModalOpen,
  setAddNewModalOpen,
  savePeriodTypes,
  periodTypeDeleteHandler,
}) => {
  const [editItem, setEditItem] = useState<PeriodTypes>({} as PeriodTypes);

  const modalCancelHandler = () => {
    setAddNewModalOpen(false);
    setEditItem({} as PeriodTypes);
  };

  const onSaveFunction = () => {
    if (editItem) {
      savePeriodTypes(editItem);
      setAddNewModalOpen(false);
      setEditItem({} as PeriodTypes);
    }
  };

  const codeEditFunc = (val: string) => {
    setEditItem({ ...editItem, code: val });
  };

  const descEditFunc = (val: string) => {
    setEditItem({ ...editItem, name: val });
  };

  const calendarTypeEditFunc = (val: string) => {
    setEditItem({ ...editItem, periodType: val });
  };

  const disabledSave = () => {
    const { code, name, periodType } = editItem || {};
    return (
      !code ||
      !name ||
      !periodType ||
      code.trim() !== code ||
      name?.trim() !== name
    );
  };

  return (
    <>
      <Grid
        container
        sx={{ overflow: "auto", padding: "4px 8px 70px 8px" }}
        data-testid={"period-type-grid"}
      >
        {data?.map((item, index) => {
          return (
            <ReturnTypeCard
              item={item}
              key={index}
              setEditItem={setEditItem}
              setAddNewModalOpen={setAddNewModalOpen}
              deleteItemHandler={periodTypeDeleteHandler}
              deleteFormAdditionalText={"periodType"}
              deletePermission={PERMISSIONS.PERIODS_DELETE}
              amendPermission={PERMISSIONS.PERIODS_AMEND}
            />
          );
        })}
      </Grid>
      <CrudFormModal
        onCancelClickFunction={modalCancelHandler}
        configuration={[
          {
            value: editItem?.code,
            type: "text",
            label: "code",
            onChangeFunction: codeEditFunc,
            key: "code",
          },
          {
            value: editItem?.name,
            type: "text",
            label: "description",
            onChangeFunction: descEditFunc,
            key: "description",
          },
          {
            value: editItem?.periodType,
            type: "list",
            label: "calendarType",
            listData: [
              { label: "Daily", value: "DAILY" },
              { label: "Weekly", value: "WEEKLY" },
              { label: "Ten Day", value: "TEN_DAY" },
              { label: "Monthly", value: "MONTHLY" },
              { label: "Quarterly", value: "QUARTERLY" },
              { label: "Semiannual", value: "SEMIANNUAL" },
              { label: "Annual", value: "ANNUAL" },
              { label: "Any", value: "ANY" },
            ],
            onChangeFunction: calendarTypeEditFunc,
            key: "calendar-type-input",
          },
        ]}
        disableSave={disabledSave}
        title={"createPeriodType"}
        onSaveClickFunction={onSaveFunction}
        isModalOpen={addNewModalOpen}
      />
    </>
  );
};

export default PeriodType;
