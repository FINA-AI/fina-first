Ext.define('first.view.registration.task.change.ChangeApprovalLetterAndChangesCardController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.changeApprovalLetterAndChangesCard',

    init: function () {
        let vm = this.getViewModel(),
            status = vm.get('fiAction.fina_fiRegistryActionControlStatus');
        vm.set('controllerStatusI18n', i18n[status]);
    },

    onFinishChangeClick: function () {
        let existingApprovalLetter = this.getViewModel().get('existingApprovalLetter');
        let updatedProperties = {
            'fina:fiDocumentNumber': this.getViewModel().get('existingApprovalLetter.documentNumber'),
            'fina:fiDocumentDate': this.getViewModel().get('existingApprovalLetter.documentDate')
        };
        let me = this;

        Ext.Ajax.request({
            method: 'PUT',
            url: first.config.Config.remoteRestUrl + 'ecm/node/' + existingApprovalLetter.id,
            jsonData: {
                id: existingApprovalLetter.id,
                properties: updatedProperties
            },
            callback: function (data, success, response) {
                let approvalCardNumber = me.getViewModel().get('existingApprovalLetter.documentNumber');
                let approveTask = [{
                    name: "fwf_fiRegistrationReviewOutcome",
                    type: "d:text",
                    value: "Approve",
                    scope: "local"
                }];
                let finishTask = [{
                    name: "fwf_fiRegistrationAcceptedRejectedTaskNumberOfOrder",
                    type: "d:text",
                    value: approvalCardNumber,
                    scope: "local"
                }];

                let finishBody = {
                    preFinishVariables: approveTask,
                    finishVariables: finishTask,
                    newProcessName: null,
                }

                me.getView().mask(i18n.pleaseWait);
                me.getViewModel().get('fiProfileTaskController').finishFiTask(me.getViewModel().get('theFi').id, finishBody, function () {
                    Ext.toast(i18n.changeFinishedSuccessfully, i18n.information);
                }, function () {
                    me.getView().unmask();
                })
            }
        });
    },

    onConfirmationLetterDownloadClick: function () {
        let existingApprovalLetter = this.getViewModel().get('existingApprovalLetter');
        if (existingApprovalLetter) {
            window.open(first.config.Config.remoteRestUrl + 'ecm/node/' + existingApprovalLetter.id + '/content?attachment=true');
        }
    },
});
