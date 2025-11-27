export const constructErrorLogTxt = (data, config, t) => {
  const importedFileDataError = data.importedFileDataError;
  const translationDataError = data.importedFileTranslationDataError;

  const hasImportedNodeCodes =
    importedFileDataError?.importedNodeCodes.length > 0;
  const hasCodesNotFound = importedFileDataError?.codesNotFound.length > 0;
  const renamedNodes = importedFileDataError?.renamedNodes;
  const importedCodesToFix = importedFileDataError?.importedCodesToFix;
  const exceptioMessage = translationDataError?.exceptioMessage;

  const formattedImportedNodeCodes = hasImportedNodeCodes
    ? importedFileDataError.importedNodeCodes
        .map((item) => ` ${item}`)
        .join("\n")
    : "";

  const formattedCodesNotFound = hasCodesNotFound
    ? Object.entries(importedFileDataError.codesNotFound)
        .map(([code, newCode]) => ` ${code} -> ${newCode}`)
        .join("\n")
    : "";

  const formattedRenamedNodes = renamedNodes
    ? Object.entries(renamedNodes)
        .map(([code, newCode]) => ` ${code} -> ${newCode}`)
        .join("\n")
    : "";

  const formattedImportedCodesToFix = importedCodesToFix
    ? importedCodesToFix.map((item) => ` ${item}`).join("\n")
    : "";

  const errorMessages = translationDataError?.message
    ? `************ ${t("errormessage")} **************\n${
        translationDataError.message
      }`
    : "";

  const nonExistingLanguageCodes =
    translationDataError?.nonExistingLanguageCodes?.join("\n") || "";
  const nonExistingNodes =
    translationDataError?.nonExistingNodes?.join("\n") || "";
  const localizedMessage =
    translationDataError?.exception?.localizedMessage.length > 0
      ? translationDataError.exception.localizedMessage
      : "";

  const errorLogMessage = `
      ${t("user")}: ${config.userName}
      ${t("timestamp")}: ${new Date().toLocaleString()}
  
      ************ ${t("message")} **************
  
      ${
        hasImportedNodeCodes
          ? `${t("importedNodeCodes")}\n${formattedImportedNodeCodes}`
          : ""
      }

  
  
      ************ ${t("issue")} **************
          
       ${exceptioMessage ? `${exceptioMessage}` : ""}
      ${
        hasCodesNotFound
          ? `${t("codesNotFound")}\n${formattedCodesNotFound}`
          : ""
      }

      ${renamedNodes ? `${t("renamedNodes")}\n${formattedRenamedNodes}` : ""}
      
      ${
        importedCodesToFix
          ? `${t("importedCodesToFix")}\n${formattedImportedCodesToFix}`
          : ""
      }
      
      ${errorMessages ? `${t("errormessage")}\n${errorMessages}` : ""}
      
  
      ${
        translationDataError?.nonExistingLanguageCodes.length > 0
          ? `${t("nonExistingLanguageCodes")}: ${nonExistingLanguageCodes}\n${t(
              "nonExistingNodes"
            )}: ${nonExistingNodes}\n${localizedMessage}`
          : ""
      }
    `;

  return errorLogMessage;
};
