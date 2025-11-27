Ext.define('first.view.registration.task.cancellation.CancellationGeneralCardController', {
    extend: 'first.view.registration.task.ReportCardController',

    alias: 'controller.cancellationGeneralCard',

    onGap: function () {
        let me = this;
        let action = this.getViewModel().get('fiAction');

        if (action['fina_fiRegistryActionAuthor'] === first.config.Config.conf.properties.currentUser.id) {
            action.fina_fiRegistryActionPreviousStep = action.fina_fiRegistryActionStep;
            action.fina_fiRegistryActionStep = '0';

            me.getView().mask(i18n.pleaseWait);
            me.getViewModel().get('fiProfileTaskController').updateActionTask(action.id, action,
                function (action, that) {
                    me.getViewModel().set('fiAction', action);
                    that.setActivateTab(action.fina_fiRegistryActionStep);
                },
                null,
                function () {
                    me.getView().unmask();
                });
        } else {
            me.getViewModel().get('fiProfileTaskController').setActivateTab(0);
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

        this.fireEvent('validateFiRegistryCall', fi.id, function (result) {
            let callback = function (o, success, response) {
                if (success) {
                    fiAction.fina_fiRegistryActionControlStatus = 'REVIEW';
                    fiAction.fina_fiRegistryActionPreviousStep = fiAction.fina_fiRegistryActionStep;
                    fiAction.fina_fiRegistryActionStepController = '2';
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

            if (fi['fina_fiRegistryLastInspectorId'] && fi['fina_fiRegistryLastInspectorId'].length > 0) {
                callback(null, true, null);
            } else {
                new first.util.WorkflowHelper().sendToInspector(me.getView(), fi.id, inspectorGroupId, callback, vm);
            }

        }, function () {
            Ext.toast(i18n.nodeQuestionnairesAreNotFullyFilled, i18n.information)
            me.getView().unmask();
        }, function (response) {
            me.getView().unmask();
            first.util.ErrorHandlerUtil.showErrorWindow(response);
        });

    },


    isEmpty: function (obj) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
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
        let existingReportCard = this.getViewModel().get('existingReportCard');
        if (existingReportCard) {
            window.open(first.config.Config.remoteRestUrl + 'ecm/node/' + existingReportCard.id + '/content?attachment=true');
        }
    },

    onReportCardUploadClick: function () {
        let existingReportCard = this.getViewModel().get('existingReportCard');
        if (existingReportCard) {
            let window = Ext.create({xtype: 'fileUpdateWindow'});
            window.getViewModel().set('nodeId', existingReportCard.id);
            window.show();
        }
    }

});
