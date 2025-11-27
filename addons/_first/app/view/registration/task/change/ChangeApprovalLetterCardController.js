Ext.define('first.view.registration.task.change.ChangeApprovalLetterCardController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.changeApprovalLetterCard',

    requires: [
        'first.config.Config',
        'first.util.DocumentGenerateUtil',
        'first.util.ErrorHandlerUtil',
        'first.util.WorkflowHelper',
        'first.view.registration.MetadataUtil'
    ],

    init: function () {
        let me = this,
            theFi = me.getViewModel().get('theFi'),
            lastProcessId = theFi.fina_fiRegistryLastProcessId,
            actionId = theFi['fina_fiRegistryLastActionId'];

        this.getViewModel().set('existingApprovalLetter', {});
        
        if (me.getViewModel().get('isRegistryActionEditor') && me.getViewModel().get('fiAction')['fina_fiRegistryActionControlStatus'] !== 'REVIEW') {
            me.getViewModel().get('fiAction')['fina_fiRegistryActionEditorComment'] = '';
        }

        Ext.Ajax.request({
            method: 'GET',
            url: first.config.Config.remoteRestUrl + 'ecm/fi/document/' + lastProcessId + '/CONFIRMATION_LETTER/' + actionId,
            success: function (response) {
                let result = JSON.parse(response.responseText);
                if (result && result.length > 0) {
                    let existingApprovalLetter = result[0];
                    existingApprovalLetter.infoText = me.getApprovalLetterInfoText(result[0]);
                    existingApprovalLetter.documentNumber = existingApprovalLetter.properties['fina:fiDocumentNumber'];
                    existingApprovalLetter.documentDate = existingApprovalLetter.properties['fina:fiDocumentDate'];
                    me.getViewModel().set('existingApprovalLetter', existingApprovalLetter);
                }
            },
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            }
        });
    },

    getApprovalLetterInfoText: function (approvalLetter) {
        let createdAt = Ext.Date.format(new Date(approvalLetter.createdAt - 0), first.config.Config.timeFormat);
        let createdBy = (approvalLetter.createdByUser ? approvalLetter.createdByUser.displayName : approvalLetter.createdBy.displayName);
        createdBy = first.view.registration.MetadataUtil.removeNonameFromName(createdBy);
        let modifiedAt = Ext.Date.format(new Date(approvalLetter.modifiedAt - 0), first.config.Config.timeFormat);
        let modifiedBy = (approvalLetter.modifiedByUser ? approvalLetter.modifiedByUser.displayName : approvalLetter.modifiedBy.displayName);
        modifiedBy = first.view.registration.MetadataUtil.removeNonameFromName(modifiedBy);

        return Ext.String.format('{0}: {1} ({2}) | {3}: {4} ({5})', i18n.approvalLetterCreatedAt, createdAt, createdBy, i18n.approvalLetterModifiedAt, modifiedAt, modifiedBy);
    },

    onConfirmationLetterDownloadClick: function () {
        let existingApprovalLetter = this.getViewModel().get('existingApprovalLetter');
        if (existingApprovalLetter) {
            window.open(first.config.Config.remoteRestUrl + 'ecm/node/' + existingApprovalLetter.id + '/content?attachment=true');
        }
    },

    onConfirmationLetterUploadClick: function () {
        let existingApprovalLetter = this.getViewModel().get('existingApprovalLetter');
        if (existingApprovalLetter) {
            let window = Ext.create({xtype: 'fileUpdateWindow'});
            window.getViewModel().set('nodeId', existingApprovalLetter.id);
            window.show();
        }
    },

    onApprovalLetterGenerationClick: function () {
        let me = this,
            vm = this.getViewModel();

        me.getView().mask(i18n.pleaseWait);

        let success = function (response) {
            let result = JSON.parse(response.responseText);
            result.infoText = me.getApprovalLetterInfoText(result);

            me.getViewModel().set('existingApprovalLetter', result);
            // me.addProcessItem(lastProcessId, result.id);
        };
        let failure = function (response, message) {
            first.util.ErrorHandlerUtil.showDocumentError(response, message);
        };
        let callback = function () {
            me.getView().unmask();
        };

        first.util.DocumentGenerateUtil.generateDocument(vm, 'CONFIRMATION_LETTER', null, null, null, success, failure, callback);

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

    onSanctionedPeopleCheck: function () {
        let me = this;
        let fiAction = this.getViewModel().get('fiAction');

        fiAction.fina_fiRegistryActionPreviousStep = fiAction.fina_fiRegistryActionStep;
        fiAction.fina_fiRegistryActionStep = '2';

        me.getView().mask(i18n.pleaseWait);
        me.getViewModel().get('fiProfileTaskController').updateActionTask(fiAction.id, fiAction,
            function (action, that) {
                me.getViewModel().set('fiAction', action);
                that.setActivateTab(action.fina_fiRegistryActionStep);
            },
            null,
            function () {
                me.getView().unmask();
            });
    },

    onSendToController: function (button) {

        let me = this,
            vm = this.getViewModel(),
            workflowVariables = vm.get('workflowVariables'),
            fi = vm.get('theFi'),
            fiAction = this.getView().up().getViewModel().get('fiAction'),
            inspectorGroupId = workflowVariables['wf_inspectorGroupId'];

        let callback = function (o, success, response) {
            if (success) {
                fiAction.fina_fiRegistryActionControlStatus = 'REVIEW';
                fiAction.fina_fiRegistryActionRedactingStatus = 'ACCEPTED';
                fiAction.fina_fiRegistryActionStepController = '5';
                fiAction.fina_fiRegistryActionPreviousStep = fiAction.fina_fiRegistryActionStep;
                fiAction.fina_fiRegistryActionStep = '3';
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

        me.getView().mask(i18n.pleaseWait);
        this.fireEvent('validateFiRegistryCall', fi.id, function (result) {
            let invalidQuestionnaireFolders = result['fina:fiRegistryValidationResultQuestionnaireInvalidFolders'],
                isQuestionnairesFullyFilled = !invalidQuestionnaireFolders || !(Object.keys(invalidQuestionnaireFolders).length > 0);

            if (!isQuestionnairesFullyFilled) {
                Ext.toast(i18n.nodeQuestionnairesAreNotFullyFilled, i18n.information);
                me.getView().unmask();
            } else if (fi['fina_fiRegistryLastInspectorId'] && fi['fina_fiRegistryLastInspectorId'].length > 0) {
                callback(null, true, null);
            } else {
                new first.util.WorkflowHelper().sendToInspector(me.getView(), fi.id, inspectorGroupId, callback, vm);
            }
        }, function () {
            Ext.toast(i18n.pleaseRegenerateCardsAndLetters, i18n.error);
            me.getView().unmask();
        }, function () {
            me.getView().unmask();
        });

    }

});
