Ext.define('first.view.registration.task.change.ChangeReportCardController', {
    extend: 'first.view.registration.task.ReportCardController',

    alias: 'controller.changeReportCard',

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
        }, function () {
            me.getView().unmask();
            Ext.toast(i18n.registryDataValidationProgressError, i18n.error);
        });
    },

    onDownloadReportCardClick: function () {
        let existingReportCard = this.getViewModel().get('existingReportCard');
        if (existingReportCard) {
            window.open(first.config.Config.remoteRestUrl + 'ecm/node/' + existingReportCard.id + '/content?attachment=true');
        }
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
                fiAction.fina_fiRegistryActionStepController = '5';
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
                    me.getViewModel().get('fiProfileTaskController').initRedactorAndController();
                });
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

    }

});
