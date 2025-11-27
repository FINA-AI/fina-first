Ext.define('first.view.registration.task.cancellation.CancellationDecreeCardLiquidatorController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cancellationDecreeCardLiquidatorController',

    init: function () {
        this.getViewModel().set('isDecreeGenerated', false);
    },

    onReportCardDownloadClick: function () {
        let existingReportCard = this.getViewModel().get('existingReportCard');
        if (existingReportCard) {
            window.open(first.config.Config.remoteRestUrl + 'ecm/node/' + existingReportCard.id + '/content?attachment=true');
        }
    },

    onFinishRegistrationClick: function () {
        if (!this.getViewModel().get('isDecreeGenerated')) {
            Ext.toast(i18n.generateDocumentsWarning);
        } else {
            let me = this,
                headOfficeDocumentNumber = me.getViewModel().get('decreeDocumentNumber'),
                headOfficeDocumentDate = me.getViewModel().get('decreeDocumentDate'),
                approveTask = [{
                    name: "fwf_fiRegistrationReviewOutcome",
                    type: "d:text",
                    value: "Approve",
                    scope: "local"
                }],
                finishTask = [{
                    name: "fwf_fiRegistrationAcceptedRejectedTaskNumberOfOrder",
                    type: "d:text",
                    value: headOfficeDocumentNumber,
                    scope: "local"
                }, {
                    name: "fwf_fiRegistrationAcceptedRejectedTaskDateOfOrder",
                    type: "d:date",
                    value: headOfficeDocumentDate,
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

    },

});
