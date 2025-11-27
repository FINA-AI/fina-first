Ext.define('first.view.registration.task.documentWithdrawal.DocumentWithdrawalReportController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.documentWithdrawalReport',

    requires: [
        'first.config.Config',
        'first.util.DocumentGenerateUtil',
        'first.util.ErrorHandlerUtil',
        'first.util.WorkflowHelper'
    ],

    init: function () {
        let me = this;
        me.initExistingReportCard();

        if (me.getViewModel().get('isRegistryActionEditor') && me.getViewModel().get('fiAction')['fina_fiRegistryActionControlStatus'] !== 'REVIEW') {
            me.getViewModel().get('fiAction')['fina_fiRegistryActionEditorComment'] = '';
        }
    },

    initExistingReportCard: function (fnSuccess) {
        let theFi = this.getViewModel().get('theFi'),
            lastProcessId = theFi.fina_fiRegistryLastProcessId,
            actionId = theFi['fina_fiRegistryLastActionId'];

        this.getViewModel().set('existingWithdrawalReportCard', {});

        let me = this;
        Ext.Ajax.request({
            method: 'GET',
            url: first.config.Config.remoteRestUrl + 'ecm/fi/document/' + lastProcessId + '/REPORT_CARD_DOCUMENT_WITHDRAWAL/' + actionId,
            success: function (response) {
                let result = JSON.parse(response.responseText);
                if (result && result.length > 0) {
                    let existingReportCard = result[0];
                    existingReportCard.infoText = me.getReportCardInfoText(result[0]);
                    me.getViewModel().set('existingWithdrawalReportCardNeedsRegeneration', false);
                    me.getViewModel().set('existingWithdrawalReportCard', existingReportCard);

                    if (fnSuccess) {
                        fnSuccess(existingReportCard);
                    }
                }
            },
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
                me.getView().unmask();
            }
        });
    },

    onSendToInspectorClick: function (button) {
        let me = this,
            vm = this.getViewModel(),
            workflowVariables = vm.get('workflowVariables'),
            fi = vm.get('theFi'),
            fiAction = this.getView().up().getViewModel().get('fiAction'),
            inspectorGroupId = workflowVariables['wf_inspectorGroupId'];

        me.getView().mask(i18n.pleaseWait);

        let callback = function (o, success, response) {
            if (success) {
                fiAction.fina_fiRegistryActionControlStatus = 'REVIEW';
                fiAction.fina_fiRegistryActionPreviousStep = fiAction.fina_fiRegistryActionStep;
                fiAction.fina_fiRegistryActionStepController = '2';
                fiAction.fina_fiRegistryActionIsSentToController = true;

                me.getViewModel().get('fiProfileTaskController').updateActionTask(fiAction.id, fiAction, null, null, function (options, success, fiAction) {
                    if (success) {
                        vm.set('fiAction', fiAction);
                        vm.getParent().set('fiAction', fiAction);
                        button.disable();
                        me.getView().unmask();
                    } else {
                        console.log('FiAction state can\'t be set!');
                    }
                    if (!fi['fina_fiRegistryLastInspectorId']) {
                        me.getViewModel().get('fiProfileTaskController').initRedactorAndController();
                    }
                });
            } else {
                me.getView().unmask();
            }
        };

        if (fi['fina_fiRegistryLastInspectorId'] && fi['fina_fiRegistryLastInspectorId'].length > 0) {
            callback(null, true, null);
        } else {
            new first.util.WorkflowHelper().sendToInspector(me.getView(), fi.id, inspectorGroupId, callback, vm);
        }
    },

    onReportCardGenerationClick: function () {
        let me = this,
            vm = this.getViewModel(),
            lastProcessId = vm.get('theFi').fina_fiRegistryLastProcessId,
            fiRegistryId = vm.get('theFi').id,
            fiRegistryActionType = vm.get('theFi').fina_fiActionType;

        me.generateReportCard(fiRegistryId, lastProcessId, fiRegistryActionType);
    },

    onReportCardDownloadClick: function () {
        let existingWithdrawalReportCard = this.getViewModel().get('existingWithdrawalReportCard');
        if (existingWithdrawalReportCard) {
            window.open(first.config.Config.remoteRestUrl + 'ecm/node/' + existingWithdrawalReportCard.id + '/content?attachment=true');
        }
    },

    onReportCardUploadClick: function () {
        let existingWithdrawalReportCard = this.getViewModel().get('existingWithdrawalReportCard');
        if (existingWithdrawalReportCard) {
            let window = Ext.create({xtype: 'fileUpdateWindow'});
            window.getViewModel().set('nodeId', existingWithdrawalReportCard.id);
            window.show();
        }
    },

    generateReportCard: function (fiRegistryId, lastProcessId, fiRegistryActionType) {
        let me = this,
            vm = this.getViewModel();

        me.getView().mask(i18n.pleaseWait);

        let success = function (response) {
            let result = JSON.parse(response.responseText);
            result.infoText = me.getReportCardInfoText(result);

            me.getViewModel().set('existingWithdrawalReportCard', result);
            me.getViewModel().set('existingWithdrawalReportCardNeedsRegeneration', false);
            // me.addProcessItem(lastProcessId, result.id);
            me.getView().unmask();
        };
        let failure = function (response, message) {
            first.util.ErrorHandlerUtil.showDocumentError(response, message);
        };
        let callback = function () {
            me.getView().unmask();

        };

        first.util.DocumentGenerateUtil.generateDocument(vm, 'REPORT_CARD_DOCUMENT_WITHDRAWAL', null, null, null, success, failure, callback);
    },

    getReportCardInfoText: function (reportCard) {
        let createdAt = Ext.Date.format(new Date(reportCard.createdAt - 0), first.config.Config.timeFormat);
        let modifiedAt = Ext.Date.format(new Date(reportCard.modifiedAt - 0), first.config.Config.timeFormat);
        let fiDocumentIsLastVersion = reportCard.properties['fina:fiDocumentIsLastVersion'];

        return Ext.String.format('{0}: {1} | {2}: {3}  {4}', i18n.reportCardCreatedAt, createdAt, i18n.reportCardModifiedAt, modifiedAt, fiDocumentIsLastVersion ? "" : "|" + i18n.reportCardIsNotLastVersion);
    },

});