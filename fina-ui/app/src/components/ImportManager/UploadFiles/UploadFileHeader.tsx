import PrimaryBtn from "../../common/Button/PrimaryBtn";
import React, { FC, useState } from "react";
import { Box } from "@mui/system";
import ToolbarIcon from "../../common/Icons/ToolbarIcon";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { useTranslation } from "react-i18next";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import { UploadFileType } from "../../../types/uploadFile.type";
import DeleteForm from "../../common/Delete/DeleteForm";
import { BASE_REST_URL, getLanguage } from "../../../util/appUtil";
import { GridColumnType } from "../../../types/common.type";
import TableCustomizationButton from "../../common/Button/TableCustomizationButton";
import { UPLOAD_FILES_TABLE_KEY } from "../../../api/TableCustomizationKeys";
import LoopIcon from "@mui/icons-material/Loop";
import { Tooltip } from "@mui/material";

interface UploadFileHeaderProps {
  setIsUploadFileModalOpen: (isOpen: boolean) => void;
  onUploadFileDelete: (fileId: number[]) => void;
  checkedItems: UploadFileType[];
  setCheckedItems: React.Dispatch<React.SetStateAction<any>>;
  setColumns: React.Dispatch<React.SetStateAction<GridColumnType[]>>;
  columns: GridColumnType[];
  onRefresh: () => void;
}

const UploadFileHeader: FC<UploadFileHeaderProps> = ({
  setIsUploadFileModalOpen,
  onUploadFileDelete,
  checkedItems,
  setCheckedItems,
  columns,
  setColumns,
  onRefresh,
}) => {
  const { t } = useTranslation();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const downloadUploadFiles = () => {
    if (checkedItems.length > 0) {
      if (checkedItems.length > 1) {
        let selectedFiles =
          checkedItems.map((item) => `fileIds=${item?.id}`).join("&") ?? "";
        window.open(
          BASE_REST_URL +
            `/uploadFile/files?${selectedFiles}&langCode=${getLanguage()}`
        );
      } else {
        window.open(
          BASE_REST_URL +
            `/uploadFile/file?fileId=${
              checkedItems[0].id
            }&langCode=${getLanguage()}`
        );
      }
      setColumns(columns);
    }
  };

  return (
    <Box display={"flex"} justifyContent={"space-between"} width={"100%"}>
      <Box display={"flex"} gap={"8px"}>
        <PrimaryBtn
          onClick={() => {
            setIsUploadFileModalOpen(true);
          }}
          endIcon={<FileUploadRoundedIcon />}
        >
          {t("upload")}
        </PrimaryBtn>
        <span>
          <TableCustomizationButton
            columns={columns}
            setColumns={setColumns}
            isDefault={false}
            hasColumnFreeze={true}
            tableKey={UPLOAD_FILES_TABLE_KEY}
          />
        </span>

        <ToolbarIcon
          disabled={checkedItems?.length !== 1}
          onClickFunction={() => {
            downloadUploadFiles();
          }}
          Icon={<DownloadRoundedIcon />}
        />
        <ToolbarIcon
          disabled={
            checkedItems.length === 0 ||
            checkedItems.filter((item) => item.status === "23").length > 0
          }
          onClickFunction={() => {
            setIsDeleteConfirmOpen(true);
          }}
          Icon={<DeleteRoundedIcon />}
        />
        <Tooltip title={t("refresh")}>
          <ToolbarIcon
            onClickFunction={() => onRefresh()}
            Icon={<LoopIcon />}
            isSquare={true}
            disabled={false}
          />
        </Tooltip>
      </Box>
      {isDeleteConfirmOpen && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={t(
            `${checkedItems && checkedItems.length > 1 ? "files" : "file"}`
          )}
          isDeleteModalOpen={isDeleteConfirmOpen}
          setIsDeleteModalOpen={setIsDeleteConfirmOpen}
          onDelete={() => {
            onUploadFileDelete(
              checkedItems.map((item) => {
                return item.id;
              })
            );
            setIsDeleteConfirmOpen(false);
            setCheckedItems([]);
          }}
          showConfirm={false}
        />
      )}
    </Box>
  );
};

export default UploadFileHeader;
