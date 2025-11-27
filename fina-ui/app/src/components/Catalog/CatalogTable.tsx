import React, { useState } from "react";
import GridTable from "../common/Grid/GridTable";
import { useHistory } from "react-router-dom";
import CatalogCreateWizard from "./Create/CatalogCreateWizard";
import withLoading from "../../hoc/withLoading";
import ActionBtn from "../common/Button/ActionBtn";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useConfig from "../../hoc/config/useConfig";
import { PERMISSIONS } from "../../api/permissions";
import {
  Catalog,
  CatalogCreateGeneral,
  CatalogCreateMeta,
  CatalogCreateStructureRow,
} from "../../types/catalog.type";
import { GridColumnType } from "../../types/common.type";

interface CatalogTableProps {
  catalogs: Catalog[];
  setCatalogs: React.Dispatch<React.SetStateAction<Catalog[]>>;
  getCatalog: (catalog: Catalog) => void;
  columns: GridColumnType[];
  openDeleteModal: VoidFunction;
  setActiveRow: (row: Catalog) => void;
  skeletonLoading: boolean;
  editCatalog(
    newCatalog: FormData,
    successCallback: VoidFunction,
    errorCallback: (error: any) => void
  ): void;
}

const CatalogTable: React.FC<CatalogTableProps> = ({
  catalogs,
  setCatalogs,
  getCatalog,
  editCatalog,
  columns,
  openDeleteModal,
  setActiveRow,
  skeletonLoading,
}) => {
  const history = useHistory();
  const [isCatalogCreateWindowOpen, setIsCatalogCreateWindowOpen] =
    useState(false);
  const [rows, setRows] = useState<CatalogCreateStructureRow[]>();
  const [newGeneralInfo, setNewGeneralInfo] = useState<Catalog>();
  const [editMetaInfo, setEditMetaInfo] = useState<CatalogCreateMeta>();
  const [generalInfo, setGeneralInfo] = useState<CatalogCreateGeneral>();
  const { hasPermission } = useConfig();

  const rowEditFunction = (row: Catalog) => {
    let idx = 0;
    const newRows = row.catalogColumns.map((row) => {
      return {
        id: row.id,
        type: row.dataType,
        nameStrId: row.nameStrId,
        itemIdx: idx++,
        name: row.name,
        key: row.key,
        sequence: row.sequence,
        format: row.dataFormat,
        required: row.isRequired,
      };
    });

    const newMetaInfo: CatalogCreateMeta = {
      replacesCatalog: row?.ancestorCatalogInfo,
      validTill: row?.validTo,
      legislativeDocument: {
        fileName: row?.legislativeDocumentName,
        id: row?.legislativeDocumentId,
      },
      formData: null,
      file: { file: { name: row?.attachmentName } as any },
      format: columns.find((column) => column.field === "validTo")?.format,
    };
    const getGeneralInfo = {
      code: row.code,
      name: row.name,
      abbreviation: row.abbreviation,
      number: row.referenceNumber,
      source: row.source,
      isError: {
        code: false,
        name: false,
        abbreviation: false,
        number: false,
        source: false,
      },
    };

    setNewGeneralInfo(row);
    setRows(newRows);
    setEditMetaInfo(newMetaInfo);
    setGeneralInfo(getGeneralInfo);
    setIsCatalogCreateWindowOpen(true);
  };

  const onSubmit = (
    generalInfoItem: CatalogCreateGeneral,
    metaInfo: CatalogCreateMeta,
    structureRows: CatalogCreateStructureRow[],
    onSuccess: VoidFunction,
    onError: VoidFunction
  ) => {
    const newRows = structureRows.map((row) => {
      return {
        id: row.id,
        dataType: row.type,
        nameStrId: row.nameStrId,
        itemIdx: row.itemIdx,
        name: row.name,
        key: row.key,
        sequence: row.sequence,
        dataFormat: row.format,
        isRequired: row.required,
      };
    });

    const newItem: any = newGeneralInfo;
    newItem.catalogColumns = newRows;
    newItem.name = generalInfoItem.name;
    newItem.abbreviation = generalInfoItem.abbreviation;
    newItem.referenceNumber = generalInfoItem.number;
    newItem.source = generalInfoItem.source;
    newItem.ancestorCatalogInfo = metaInfo?.replacesCatalog;
    if (metaInfo?.validTill && typeof metaInfo?.validTill === "object") {
      newItem.validTo = metaInfo?.validTill?.getTime();
    } else {
      newItem.validTo = metaInfo?.validTill;
    }
    newItem.legislativeDocumentId = metaInfo?.legislativeDocument.id;
    newItem.legislativeDocumentName = metaInfo?.legislativeDocument?.fileName;
    newItem.legislativeDocument = metaInfo?.legislativeDocument;
    newItem.attachmentName = metaInfo?.file?.file?.name;
    let formData = new FormData();

    formData.append(
      "catalog",
      new Blob([JSON.stringify(newItem)], {
        type: "application/json",
      })
    );

    formData.append("attachment", metaInfo?.file?.file ?? "");
    editCatalog(formData, onSuccess, onError);
  };

  const rowDeleteFunction = (row: Catalog) => {
    setActiveRow(row);
    openDeleteModal();
  };

  const rowOnClick = (
    row: Catalog,
    deselect: boolean,
    selectedRows: Catalog[],
    isKeyboardShortcuKeyClicked: boolean
  ) => {
    if (!isKeyboardShortcuKeyClicked) {
      history.push("catalog/item/" + row.id);
      getCatalog(row);
    }
  };

  let actionButtons = (row: Catalog, index: number) => {
    return (
      <>
        {hasPermission(PERMISSIONS.CATALOG_AMEND) && (
          <ActionBtn
            onClick={() => rowEditFunction(row)}
            children={<EditIcon />}
            rowIndex={index}
            buttonName={"edit"}
          />
        )}

        {hasPermission(PERMISSIONS.CATALOG_DELETE) && (
          <ActionBtn
            onClick={() => rowDeleteFunction(row)}
            children={<DeleteIcon />}
            color={"#FF735A"}
            rowIndex={index}
            buttonName={"delete"}
          />
        )}
      </>
    );
  };

  return (
    <>
      <GridTable
        columns={columns}
        rows={catalogs}
        setRows={setCatalogs}
        rowOnClick={rowOnClick}
        loading={skeletonLoading}
        actionButtons={actionButtons}
      />
      {isCatalogCreateWindowOpen && (
        <CatalogCreateWizard
          isOpen={isCatalogCreateWindowOpen}
          setIsOpen={setIsCatalogCreateWindowOpen}
          onSave={onSubmit}
          isEdit={true}
          rowsToEdit={rows}
          editMetaInfo={editMetaInfo}
          generalInfo={generalInfo}
        />
      )}
    </>
  );
};

export default React.memo(withLoading(CatalogTable));
