import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PrimaryBtn from "../../../../common/Button/PrimaryBtn";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TreeGrid from "../../../../common/TreeGrid/TreeGrid";
import OtherShareCreateForm from "./OtherShareCreateForm";
import DeleteForm from "../../../../common/Delete/DeleteForm";
import ActionBtn from "../../../../common/Button/ActionBtn";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MainGridSkeleton from "../../../Skeleton/GridSkeleton/MainGridSkeleton";
import { FilterTypes } from "../../../../../util/appUtil";
import { styled, useTheme } from "@mui/material/styles";
import InfoModal from "../../../../common/Modal/InfoModal";
import { CheckListIcon } from "../../../../../api/ui/icons/CheckListIcon";
import useConfig from "../../../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../../../api/permissions";
import {
  columnFilterConfigType,
  TreeGridColumnType,
  TreeGridStateType,
} from "../../../../../types/common.type";
import { OtherSharesDataType } from "../../../../../types/fi.type";
import { LegalPersonDataType } from "../../../../../types/legalPerson.type";

const StyledRoot = styled(Box)(({ theme }: any) => ({
  height: "100%",
  borderRadius: "4px",
  display: "flex",
  flexDirection: "column",
  background: theme.palette.paperBackground,
}));

const StyledHeader = styled(Box)(({ theme }: any) => ({
  display: "flex",
  justifyContent: "flex-end",
  padding: theme.toolbar.padding,
  borderBottom: theme.palette.borderColor,
}));

interface OtherSharePageProps {
  treeState: TreeGridStateType;
  setTreeState: React.Dispatch<React.SetStateAction<TreeGridStateType>>;
  columns: TreeGridColumnType[];
  loading: boolean;
  data: OtherSharesDataType[];
  legalPersons: LegalPersonDataType[];
  saveShare: (data: any) => void;
  deleteShare: (row: { isEdit: boolean; data: OtherSharesDataType }) => void;
  updateShareFunction: (data: any) => void;
  initOtherShares: (filterData?: columnFilterConfigType) => void;
  setIsPercentageModalOpen: (open: boolean) => void;
  isPercentageModalOpen: boolean;
}

const OtherSharePage: React.FC<OtherSharePageProps> = ({
  treeState,
  setTreeState,
  columns = [],
  loading,
  data = [],
  legalPersons = [],
  saveShare,
  deleteShare,
  updateShareFunction,
  initOtherShares,
  setIsPercentageModalOpen,
  isPercentageModalOpen,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { hasPermission } = useConfig();
  const hasAmendPermission = hasPermission(PERMISSIONS.FI_AMEND);
  const hasDeletePermission = hasPermission(PERMISSIONS.FI_DELETE);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<{
    isEdit: boolean;
    data: OtherSharesDataType | null;
  }>({
    isEdit: false,
    data: null,
  });
  const [filteredData, setFilteredData] = useState<OtherSharesDataType[]>([]);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const saveSelectedRow = (row: OtherSharesDataType) => {
    if (row.company) {
      setSelectedRow({ isEdit: true, data: row });
    } else {
      setSelectedRow({
        isEdit: true,
        data: {
          ...row,
          company: data.find((item) => item.id === row.parentId)?.company!,
        },
      });
    }
  };

  let actionButtons = (row: OtherSharesDataType, index: number) => {
    return (
      <>
        {hasAmendPermission &&
          row.level === 0 &&
          row.children &&
          row.children.length > 0 && (
            <ActionBtn
              onClick={() => {
                setSelectedRow({ isEdit: false, data: row });
                setAddModalOpen(true);
              }}
              children={<AddIcon />}
              rowIndex={index}
              buttonName={"add"}
            />
          )}
        {row.level === 0 && row.children && row.children.length === 0 && (
          <>
            {hasAmendPermission && (
              <>
                <ActionBtn
                  onClick={() => {
                    setSelectedRow({ isEdit: false, data: row });
                    setAddModalOpen(true);
                  }}
                  children={<AddIcon />}
                  rowIndex={index}
                  buttonName={"add"}
                />
                <ActionBtn
                  onClick={() => {
                    saveSelectedRow(row);
                    setAddModalOpen(true);
                  }}
                  children={<EditIcon />}
                  rowIndex={index}
                  buttonName={"edit"}
                />
              </>
            )}
            {hasDeletePermission && (
              <ActionBtn
                onClick={() => {
                  saveSelectedRow(row);
                  setIsDeleteConfirmOpen(true);
                }}
                children={<DeleteIcon />}
                color={"#FF735A"}
                rowIndex={index}
                buttonName={"delete"}
              />
            )}
          </>
        )}
        {hasAmendPermission && row.id > 0 && !row.company && (
          <ActionBtn
            onClick={() => {
              saveSelectedRow(row);
              setAddModalOpen(true);
            }}
            children={<EditIcon />}
            rowIndex={index}
            buttonName={"edit"}
          />
        )}
        {hasDeletePermission && row.id >= 0 && !row.company && (
          <ActionBtn
            onClick={() => {
              saveSelectedRow(row);
              setIsDeleteConfirmOpen(true);
            }}
            children={<DeleteIcon />}
            color={"#FF735A"}
            rowIndex={index}
            buttonName={"delete"}
          />
        )}
      </>
    );
  };

  const getRowCellValue = (cellName: string, row: any) => {
    let splitCellNames = cellName.split(".");
    for (let cell of splitCellNames) {
      if (row) {
        row = row[cell];
      }
    }

    return row;
  };

  const orderRowByHeader = (
    cellName: string,
    arrowDirection: "up" | "down"
  ) => {
    let i = arrowDirection === "up" ? 1 : -1;
    let sortedParenRows = [
      ...filteredData
        .sort((a, b) =>
          getRowCellValue(cellName, a) < getRowCellValue(cellName, b)
            ? i * 1
            : i * -1
        )
        .map((row) => {
          return {
            ...row,
            children: [
              ...row.children.sort((a, b) =>
                getRowCellValue(cellName, a) < getRowCellValue(cellName, b)
                  ? i * 1
                  : i * -1
              ),
            ],
          };
        }),
    ];
    setFilteredData(sortedParenRows);
  };

  const filterOnChangeFunction = (obj: any[]) => {
    let filter: any = {};
    for (let o of obj) {
      switch (o.type) {
        case FilterTypes.date:
          if (o.start) {
            filter[o.name + "From"] = o.start;
          }
          if (o.end) {
            filter[o.name + "To"] = o.end;
          }
          break;
        case FilterTypes.country:
          filter[o?.name] = o.value.id;
          break;
        default:
          filter[o.name] = o.value;
          break;
      }
    }
    if (obj) {
      initOtherShares(filter);
    }
  };

  return (
    <StyledRoot>
      {hasAmendPermission && (
        <StyledHeader>
          <PrimaryBtn
            height={32}
            onClick={() => {
              setAddModalOpen(true);
              setSelectedRow({ isEdit: false, data: null });
            }}
            endIcon={<AddIcon />}
            data-testid={"create-button"}
          >
            {t("addNew")}
          </PrimaryBtn>
        </StyledHeader>
      )}
      <Box
        sx={{
          height: "100%",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <MainGridSkeleton columns={columns} paddingLeft={"15px"} />
        ) : (
          <TreeGrid
            treeState={treeState}
            setTreeState={setTreeState}
            fetchFunction={() => {
              return filteredData;
            }}
            data={filteredData}
            columns={columns}
            idName={"id"}
            parentIdName={"parentId"}
            rootId={0}
            hideHeader={false}
            hideCheckBox={true}
            loading={loading}
            headerFontWeight={500}
            childrenColor={theme.palette.secondary.light}
            parentIconExpand={false}
            actionButtons={actionButtons}
            orderRowByHeader={orderRowByHeader}
            filterOnChangeFunction={filterOnChangeFunction}
          />
        )}
      </Box>
      {addModalOpen && (
        <OtherShareCreateForm
          open={addModalOpen}
          handClose={() => {
            setAddModalOpen(false);
          }}
          handleSave={saveShare}
          title={t("addShare")}
          legalPersons={legalPersons}
          selectedRow={selectedRow}
          isEdit={selectedRow.isEdit}
          updateShareFunction={updateShareFunction}
        />
      )}
      {isDeleteConfirmOpen && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={t("otherShare")}
          isDeleteModalOpen={isDeleteConfirmOpen}
          setIsDeleteModalOpen={setIsDeleteConfirmOpen}
          onDelete={() => {
            setIsDeleteConfirmOpen(false);
            deleteShare(
              selectedRow as {
                isEdit: boolean;
                data: OtherSharesDataType;
              }
            );
          }}
          showConfirm={false}
        />
      )}
      {isPercentageModalOpen && (
        <InfoModal
          bodyText={t("shareSumErrorMessage")}
          icon={<CheckListIcon />}
          onOkButtonClick={() => {
            setIsPercentageModalOpen(false);
          }}
          isOpen={isPercentageModalOpen}
          setIsOpen={setIsPercentageModalOpen}
        />
      )}
    </StyledRoot>
  );
};

export default OtherSharePage;
