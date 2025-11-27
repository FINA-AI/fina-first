Ext.define('first.util.DocumentGenerateUtil', {

    requires: [
        'first.config.Config'
    ],

    statics: {

        getParameterObject: function (vm, documentType, documentNumber, documentDate, branchId, keepExistingDocumentType, filterActiveBranches) {
            let theFi = vm.get('theFi'),
                lastProcessId = theFi.fina_fiRegistryLastProcessId,
                fiRegistryId = theFi.id,
                actionId = theFi['fina_fiRegistryLastActionId'],
                actionType = theFi['fina_fiActionType'],
                fiTypeCode = theFi['fina_fiRegistryFiTypeCode'];

            return {
                fiRegistryId: fiRegistryId,
                fiActionId: actionId,
                processId: lastProcessId,
                actionType: actionType,
                documentType: documentType,
                documentNumber: documentNumber,
                documentDate: documentDate,
                fiTypeCode: fiTypeCode,
                branchId: branchId,
                keepExistingDocumentType: !!keepExistingDocumentType,
                filterActiveBranches: filterActiveBranches
            }
        },

        generateDocument: function (vm, documentType, documentNumber, documentDate, branchId, success, failure, callback, keepExistingDocumentType) {
            Ext.Ajax.request({
                method: 'POST',
                jsonData: first.util.DocumentGenerateUtil.getParameterObject(vm, documentType, documentNumber, documentDate, branchId, keepExistingDocumentType),
                url: first.config.Config.remoteRestUrl + 'ecm/fi/document/generate',
                success: success,
                failure: failure,
                callback: callback
            });
        }
    }
});