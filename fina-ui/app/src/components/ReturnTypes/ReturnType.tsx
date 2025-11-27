import { Grid } from "@mui/material";
import ReturnTypeCard from "./ReturnTypeCard";
import React, { useState } from "react";
import CrudFormModal from "../common/Modal/CrudFormModal";
import { PERMISSIONS } from "../../api/permissions";
import { ReturnType as IReturnType } from "../../types/returnDefinition.type";

interface ReturnTypeProps {
  data: IReturnType[];
  isAddNew: boolean;
  setIsAddNew: (value: boolean) => void;
  returnTypeDeleteHandler(returnTypeId: number): void;
  saveReturnTypes(data: IReturnType): void;
}

const ReturnType: React.FC<ReturnTypeProps> = ({
  data,
  isAddNew,
  setIsAddNew,
  saveReturnTypes,
  returnTypeDeleteHandler,
}) => {
  const [editItem, setEditItem] = useState<IReturnType | null>(null);

  const modalCancelHandler = () => {
    setIsAddNew(false);
    setEditItem(null);
  };

  const onSaveFunction = () => {
    saveReturnTypes({ ...editItem, editable: true } as IReturnType);
    setIsAddNew(false);
    setEditItem(null);
  };

  const codeEditFunc = (val: string) => {
    setEditItem({ ...editItem, code: val.trim() } as IReturnType);
  };

  const descEditFunc = (val: string) => {
    setEditItem({ ...editItem, name: val.trim() } as IReturnType);
  };

  const disabledSave = () => {
    const { code, name } = editItem || {};
    return !code || !name;
  };

  return (
    <>
      <Grid container style={{ overflow: "auto", paddingBottom: "70px" }}>
        {data.map((item, index) => {
          return (
            <ReturnTypeCard
              item={item}
              key={index}
              setEditItem={setEditItem}
              setAddNewModalOpen={setIsAddNew}
              deleteItemHandler={returnTypeDeleteHandler}
              deleteFormAdditionalText={"returnType"}
              deletePermission={PERMISSIONS.FINA_RETURNS_DELETE}
              amendPermission={PERMISSIONS.FINA_RETURNS_AMEND}
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
          },
          {
            value: editItem?.name,
            type: "text",
            label: "description",
            onChangeFunction: descEditFunc,
          },
        ]}
        title={"createReturnType"}
        onSaveClickFunction={onSaveFunction}
        isModalOpen={isAddNew}
        disableSave={disabledSave}
      />
    </>
  );
};

export default ReturnType;
