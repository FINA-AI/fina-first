Ext.define('first.view.registration.task.ReportCardController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.reportCardController',

    requires: [
        'first.config.Config',
        'first.util.DocumentGenerateUtil',
        'first.util.ErrorHandlerUtil',
        'first.util.WorkflowHelper'
    ],

    init: function () {
        this.initExistingReportCard();
    },

    initExistingReportCard: function (fnSuccess) {
        let theFi = this.getViewModel().get('theFi'),
            lastProcessId = theFi.fina_fiRegistryLastProcessId,
            actionId = theFi['fina_fiRegistryLastActionId'];

        this.getViewModel().set('existingReportCard', {});

        let me = this;
        Ext.Ajax.request({
            method: 'GET',
            url: first.config.Config.remoteRestUrl + 'ecm/fi/document/' + lastProcessId + '/REPORT_CARD/' + actionId,
            success: function (response) {
                let result = JSON.parse(response.responseText);
                if (result && result.length > 0) {
                    let existingReportCard = result[0];
                    existingReportCard.infoText = me.getReportCardInfoText(result[0]);
                    me.getViewModel().set('reportCardNeedsRegeneration', false);
                    me.getViewModel().set('existingReportCard', existingReportCard);

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

    onReportCardGenerationClick: function () {
        let me = this,
            vm = this.getViewModel(),
            lastProcessId = vm.get('theFi').fina_fiRegistryLastProcessId,
            fiRegistryId = vm.get('theFi').id,
            fiRegistryActionType = vm.get('theFi').fina_fiActionType;

        this.fireEvent('validateFiRegistryCall', fiRegistryId, function () {
            me.generateReportCard(fiRegistryId, lastProcessId, fiRegistryActionType);
        }, function () {
            Ext.toast(i18n.pleaseRegenerateReportCard, i18n.error);
            vm.set('reportCardNeedsRegeneration', true);
            me.getView().unmask();
        }, function (response) {
            me.getView().unmask();
            console.log(response);
            Ext.toast(i18n.registryDataValidationProgressError, i18n.error);
        });

    },

    generateReportCard: function (fiRegistryId, lastProcessId, fiRegistryActionType) {
        let me = this,
            vm = this.getViewModel();

        me.getView().mask(i18n.pleaseWait);

        let success = function (response) {
            let result = JSON.parse(response.responseText);
            result.infoText = me.getReportCardInfoText(result);

            me.getViewModel().set('existingReportCard', result);
            me.getViewModel().set('reportCardNeedsRegeneration', false);
            // me.addProcessItem(lastProcessId, result.id);
            me.getView().unmask();
        };
        let failure = function (response, message) {
            first.util.ErrorHandlerUtil.showDocumentError(response, message);
        };
        let callback = function () {
            me.getView().unmask();

        };

        first.util.DocumentGenerateUtil.generateDocument(vm, 'REPORT_CARD', null, null, null, success, failure, callback);
    },

    onReportCardDownloadClick: function () {
        let existingReportCard = this.getViewModel().get('existingReportCard');
        if (existingReportCard) {
            window.open(first.config.Config.remoteRestUrl + 'ecm/node/' + existingReportCard.id + '/content?attachment=true');
        }
    },

    onReportCardUploadClick: function () {
        this.getView().mask(i18n.pleaseWait);
        let me = this;
        this.initExistingReportCard(function (existingReportCard) {
            me.getView().unmask();
            if (existingReportCard) {
                let window = Ext.create({xtype: 'fileUpdateWindow'});
                window.getViewModel().set('nodeId', existingReportCard.id);
                window.show();
            } else {
                Ext.toast(i18n.reportCardNotExists, i18n.error);
            }
        });
    },

    addProcessItem: function (processId, documentId) {
        let processItems = [{
            id: documentId
        }];

        Ext.Ajax.request({
            method: 'POST',
            url: first.config.Config.remoteRestUrl + 'ecm/workflow/processes/' + processId + '/items',
            jsonData: processItems,
            success: function (response) {
                console.log(JSON.parse(response.responseText));

            },
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            }
        });
    },

    getReportCardInfoText: function (reportCard) {
        let createdAt = Ext.Date.format(new Date(reportCard.createdAt - 0), first.config.Config.timeFormat);
        let modifiedAt = Ext.Date.format(new Date(reportCard.modifiedAt - 0), first.config.Config.timeFormat);
        let fiDocumentIsLastVersion = reportCard.properties['fina:fiDocumentIsLastVersion'];

        return Ext.String.format('{0}: {1} | {2}: {3}  {4}', i18n.reportCardCreatedAt, createdAt, i18n.reportCardModifiedAt, modifiedAt, fiDocumentIsLastVersion ? "" : "|" + i18n.reportCardIsNotLastVersion);
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
                fiAction.fina_fiRegistryActionStepController = '3';
                fiAction.fina_fiRegistryActionRedactingStatus = 'ACCEPTED';
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
                });
                me.getViewModel().get('fiProfileTaskController').initRedactorAndController();

            } else {
                me.getView().unmask();
            }
        };

        this.fireEvent('validateFiRegistryCall', fi.id, function () {
            if (fi['fina_fiRegistryLastInspectorId'] && fi['fina_fiRegistryLastInspectorId'].length > 0) {
                callback(null, true, null);
            } else {
                new first.util.WorkflowHelper().sendToInspector(me.getView(), fi.id, inspectorGroupId, callback, vm);
            }
        }, function () {
            Ext.toast(i18n.pleaseRegenerateReportCard, i18n.error);
            vm.set('reportCardNeedsRegeneration', true);
            me.getView().unmask();
        }, function () {
            me.getView().unmask();
        });
    },

    showPrevious: function (btn) {
        let me = this;
        let data = this.getViewModel().get('fiAction');

        if (data['fina_fiRegistryActionAuthor'] === first.config.Config.conf.properties.currentUser.id) {
            data.fina_fiRegistryActionStep = '1';

            me.getView().mask(i18n.pleaseWait);
            me.getViewModel().get('fiProfileTaskController').updateActionTask(data.id, data,
                function (action, that) {
                    me.getViewModel().set('fiAction', action);
                    that.setActivateTab(action.fina_fiRegistryActionStep);
                },
                null,
                function () {
                    me.getView().unmask();
                });
        } else {
            me.getViewModel().get('fiProfileTaskController').setActivateTab(1);
        }
    },


});
