import { Grid } from "@mui/material";
import React, { useState } from "react";
import CrudFormModal from "../common/Modal/CrudFormModal";
import ReturnTypeCard from "../ReturnTypes/ReturnTypeCard";
import { PERMISSIONS } from "../../api/permissions";
import { ReturnVersion as IReturnVersion } from "../../types/importManager.type";

interface ReturnVersionProps {
  data?: IReturnVersion[];
  addNewModalOpen: boolean;
  setAddNewModalOpen: (value: boolean) => void;
  saveReturnVersions: (versions: IReturnVersion | null) => void;
  returnVersionsDeleteHandler(returnTypeId: number): void;
}

const ReturnVersion: React.FC<ReturnVersionProps> = ({
  data,
  addNewModalOpen,
  setAddNewModalOpen,
  saveReturnVersions,
  returnVersionsDeleteHandler,
}) => {
  const [editItem, setEditItem] = useState<IReturnVersion | null>(null);

  const modalCancelHandler = () => {
    setAddNewModalOpen(false);
    setEditItem(null);
  };

  const onSaveFunction = () => {
    saveReturnVersions(editItem);
    setAddNewModalOpen(false);
    setEditItem(null);
  };

  const codeEditFunc = (val: string) => {
    setEditItem({ ...editItem, code: val?.trim() } as IReturnVersion);
  };

  const descEditFunc = (val: string) => {
    setEditItem({ ...editItem, name: val?.trim() } as IReturnVersion);
  };

  const disabledSave = () => {
    const { code, name } = editItem || {};
    return !code || !name;
  };

  return (
    <>
      <Grid container style={{ overflow: "auto", paddingBottom: "70px" }}>
        {data?.map((item, index) => {
          return (
            <ReturnTypeCard
              item={item}
              key={index}
              setEditItem={setEditItem}
              setAddNewModalOpen={setAddNewModalOpen}
              deleteItemHandler={returnVersionsDeleteHandler}
              deleteFormAdditionalText={"returnVersion"}
              deletePermission={PERMISSIONS.RETURN_VERSION_DELETE}
              amendPermission={PERMISSIONS.RETURN_VERSION_AMEND}
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
        title={"createReturnVersion"}
        onSaveClickFunction={onSaveFunction}
        isModalOpen={addNewModalOpen}
        disableSave={disabledSave}
      />
    </>
  );
};

export default ReturnVersion;
