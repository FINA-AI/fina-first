import FileDecryptionPage from "../../../components/Tools/FileDecryption/FileDecryptionPage";
import { decrypt } from "../../../api/services/toolsService";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import { useTranslation } from "react-i18next";

const FileDecryptionContainer = () => {
  const { openErrorWindow } = useErrorWindow();

  const { t } = useTranslation();
  const decryptFileHandler = (
    data: FormData,
    isLegacyCertificateMode: boolean
  ) => {
    decrypt(data, isLegacyCertificateMode)
      .then((res) => {
        const blob = new Blob([res.data]);
        let headerContent = res.headers["content-disposition"];
        const startIndex = headerContent.indexOf('"') + 1;
        const endIndex = headerContent.lastIndexOf('"');
        const fileName = decodeURI(
          headerContent.substring(startIndex, endIndex)
        );
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link?.parentNode?.removeChild(link);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  return <FileDecryptionPage decryptFileHandler={decryptFileHandler} />;
};
export default FileDecryptionContainer;
