Ext.define('first.view.registration.task.shared.CardHeaderController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cardHeaderController',

    init: function () {
        let fiAction = this.getViewModel().get('fiAction'),
            headerData = {},
            me = this;

        let info = i18n.statementNumber + ' : ' + fiAction['fina_fiRegistryActionTaskNumber'] + ' / ' + i18n.statementDate + ' : ' + me.getFormattedDate(fiAction['fina_fiRegistryActionTaskReceiptDate']);

        switch (fiAction['fina_fiRegistryActionType']) {
            case "CHANGE": {
                let label;
                switch (fiAction['fina_fiChangeFormType']) {
                    case 'managementPersonal':
                        label = i18n.changesCardInfoTitle;
                        break;
                    case 'legalAddress':
                        label = i18n.changesLegalAddressCardTitle;
                        break;
                    default:
                        label = i18n.changesCardInfoEditTitle;


                }
                headerData = {
                    info: info,
                    label: label
                };
                break;
            }
            case "CANCELLATION": {
                headerData = {
                    info: info,
                    label: i18n.cancellationType + ' - ' + i18n[fiAction['fina_fiCancellationReason']]
                };
                break;
            }
            case "BRANCHES_CHANGE": {
                headerData = {
                    info: info,
                    label: i18n.branchesChangeHeaderTitle
                };
                break;
            }
            case "BRANCHES_EDIT": {
                headerData = {
                    info: info,
                    label: i18n.branchesEditHeaderTitle
                };
                break;
            }
        }

        this.getViewModel().set('headerData', headerData);
    },

    getFormattedDate: function (value) {
        return value ? Ext.Date.format(new Date(value), first.config.Config.dateFormat) : value
    }

});
