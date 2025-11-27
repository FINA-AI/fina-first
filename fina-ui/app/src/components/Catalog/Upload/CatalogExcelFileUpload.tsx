import FileUploadWindow from "../../FileUploadV2/Single/FileUploadWindow";
import { useTranslation } from "react-i18next";
import React from "react";

const FILE_NAME_PATTER = "^.*\\.(xlsx|XLSX)$";

interface CatalogExcelFileUploadProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  importStage: string;
  importWarnings: any;
  handleClose: VoidFunction;
  onFileUpload(formData: FormData, file: any): void;
}

const CatalogExcelFileUpload: React.FC<CatalogExcelFileUploadProps> = ({
  isOpen,
  setIsOpen,
  onFileUpload,
  importStage,
  importWarnings,
  handleClose,
}) => {
  const { t } = useTranslation();

  return (
    <FileUploadWindow
      open={isOpen}
      setOpen={setIsOpen}
      uploadFile={onFileUpload}
      config={{
        fileNamePatterns: [FILE_NAME_PATTER],
        acceptFormats: null,
      }}
      importStage={importStage}
      importWarnings={importWarnings}
      handleCloseExternal={handleClose}
      infoTextPart1={t("catalogImportInfoPart1")}
      infoTextPart2={t("catalogImportInfoPart2")}
    />
  );
};

export default CatalogExcelFileUpload;
