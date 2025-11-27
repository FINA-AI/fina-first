Ext.define('first.view.registration.task.branchChange.BranchChangeGeneralCardController', {
    extend: 'first.view.registration.task.cancellation.CancellationGeneralCardController',

    alias: 'controller.branchChangeGeneralCard',

    requires: [
        'first.config.Config',
        'first.util.DocumentGenerateUtil',
        'first.util.ErrorHandlerUtil',
        'first.util.WorkflowHelper'
    ],


    listen: {
        controller: {
            '*': {
                changesListUpdated: 'onChangesListUpdated'
            }
        }
    },

    init: function () {
        this.callParent();
        this.load();
    },

    load: function () {
        let me = this;
        let theFi = this.getViewModel().get('theFi');
        let actionId = theFi['fina_fiRegistryLastActionId'];
        let grid = this.lookupReference('branchChangesGridView'),
            store = grid.getStore();
        store.proxy.setUrl(first.config.Config.remoteRestUrl + 'ecm/fi/branchChanges/' + actionId + '?relativePath=Performed Changes');
        store.load({
            callback: function (records) {
                me.bindSendToControllerButton(records);
            }
        });
    },

    bindSendToControllerButton: function (records) {
        let me = this,
            fiAction = this.getViewModel().get('fiAction');
        let enableFinish = true;
        if (me.getViewModel().get('inReview')) {
            me.getViewModel().set('isGeneratedBranchDocuments', false);
        } else {
            let sendToControllerButtonDisable = false;
            if (records && records.length) {
                Ext.each(records, function (rec) {
                    let disabled = !fiAction['fina_fiSendToControllerEnable'] && rec.get('fina_fiBranchesChangeStatus') === 'CANCELED';
                    enableFinish &= disabled;
                    rec.set('disable', disabled, {dirty: false});

                    if (rec.get('fina_fiDocument') && (fiAction['fina_fiSendToControllerEnable'] || rec.get('fina_fiBranchesChangeFinalStatus') !== 'GAP')) {
                        sendToControllerButtonDisable = true;
                        me.getViewModel().set('isGeneratedBranchDocuments', !sendToControllerButtonDisable);
                    }
                });
                me.getViewModel().set('isGeneratedBranchDocuments', sendToControllerButtonDisable);
            } else {
                me.getViewModel().set('isGeneratedBranchDocuments', false);
            }
        }

        if (!fiAction['fina_fiSendToControllerEnable']) {
            me.getViewModel().set('sendToControllerEnable', !Boolean(enableFinish) && !me.getViewModel().get('isAccepted'));
            me.getViewModel().set('isGeneratedBranchDocuments', records.length > 0)
        } else {
            me.getViewModel().set('sendToControllerEnable', true);
        }

    },

    branchNameRenderer: function (content, cell, record) {
        let branch = record.get('properties')['fina:fiRegistryBranch'];
        let uniqueProperties = ['fina:fiRegistryBranchType', 'fina:fiRegistryBranchAddressRegion', 'fina:fiRegistryBranchAddressCity', 'fina:fiRegistryBranchAddress'];
        return !branch ? '' : this.getRenderString(uniqueProperties, branch['properties']);
    },

    getRenderString: function (array, properties) {
        let result = '';
        for (let i in array) {
            let value = properties[array[i]];
            if (value) {
                result += i18n[value] ? i18n[value] : value;
                if (i !== array.length - 1) {
                    result += ', ';
                }
            }
        }

        return result;
    },

    onGenerateClick: function (grid, row, col, btn, event, record) {
        let me = this,
            vm = this.getViewModel(),
            theFi = this.getViewModel().get('theFi'),
            documentNumber = record.get('fina_fiDocumentNumber');


        if (!record.get('fina_fiBranchesChangeFinalStatus')) {
            Ext.toast("ფილიალის სტატუსის შეყვანა აუცილებელია", "შეცდომა");
            return;
        }

        me.getView().mask(i18n.pleaseWait);

        let documentType;
        switch (record.get('fina_fiBranchesChangeFinalStatus')) {
            case 'GAP':
                documentType = 'GAP_LETTER';
                break;
            case 'DECLINED':
                documentType = 'REPORT_CARD_REFUSAL';
                break;
            default:
                documentType = record.get('fina_fiBranchesChangeStatus') === 'CANCELED' ? 'CANCELED_BRANCH_REPORT_CARD' : 'REPORT_CARD';
                break;
        }
        let success = function (response) {
            let result = JSON.parse(response.responseText);
            me.updateChangeNode(record, result.id);
        };
        let failure = function (response, message) {
            first.util.ErrorHandlerUtil.showDocumentError(response, message);
        };
        let callback = function () {
            me.getView().unmask();
        };

        first.util.DocumentGenerateUtil.generateDocument(vm, documentType, documentNumber ? documentNumber : null, null, record.get('fina_fiBranchesChangeReferenceId'), success, failure, callback, true);

    },

    updateChangeNode: function (record, documentId) {
        let me = this,
            properties = record.get('properties');
        properties['fina:fiBranchesChangeDocumentReferenceId'] = documentId;
        properties['fina:fiBranchesChangeFinalStatus'] = record.get('fina_fiBranchesChangeFinalStatus');
        properties['fina:fiBranchesChangeFinalStatusNote'] = record.get('fina_fiBranchesChangeFinalStatusNote');
        delete properties['fina:fiRegistryBranch'];
        delete properties['fina:fiDocument'];

        let nodeBodyUpdate = {
            name: record.get('name'),
            properties: properties
        };
        me.getView().mask(i18n.pleaseWait);

        Ext.Ajax.request({
            method: 'PUT',
            url: Ext.String.format(first.config.Config.remoteRestUrl + 'ecm/node/{0}', record.id),
            jsonData: nodeBodyUpdate,
            success: function (response) {
                me.load();
                me.getView().unmask();
            },
            failure: function (response, message) {
                me.getView().unmask();
                first.util.ErrorHandlerUtil.showDocumentError(response, message);
            }
        });
    },

    onChangesListUpdated: function (srcActionId) {
        let vm = this.getViewModel(),
            fi = vm.get('theFi'),
            actionId = fi['fina_fiRegistryLastActionId'];
        if (actionId === srcActionId) {
            this.load();
        }
    },

    onDownloadDocumentClick: function (grid, row, col, btn, event, record) {
        let properties = record.get('properties');
        if (properties && properties['fina:fiDocument']) {
            window.open(first.config.Config.remoteRestUrl + 'ecm/node/' + properties['fina:fiDocument'].id + '/content?attachment=true');
        }
    },

    onViewClick: function (view, recIndex, cellIndex, item, e, record) {
        let tabName = 'Branches';

        let fiProfileController = this.getViewModel().get('fiProfileController');
        fiProfileController.setActiveTabAndSelectRecord(tabName, record.get('fina_fiBranchesChangeReferenceId'), 'onEditBranchClick');
    },

    onDocumentUploadClick: function (grid, row, col, btn, event, record) {
        let properties = record.get('properties');
        if (properties && properties['fina:fiDocument']) {
            let window = Ext.create({xtype: 'fileUpdateWindow'});
            window.getViewModel().set('nodeId', properties['fina:fiDocument'].id);
            window.show();
        }
    },

    isUploadDocumentDisabled: function (view, rowIndex, colIndex, item, record) {
        let properties = record.get('properties');
        return !(properties && properties['fina:fiDocument'] && properties['fina:fiDocument'].id) || !this.getViewModel().get('isController');
    },

    onCellEditClick: function (editor, e) {
        let record = e.record,
            me = this;
        if (e.record.dirty && e.field === 'fina_fiBranchesChangeFinalStatusNote') {
            me.getView().mask(i18n.pleaseWait);

            let nodeBodyupdate = {
                name: record.get('name'),
                properties: {'fina:fiBranchesChangeFinalStatusNote': record.get('fina_fiBranchesChangeFinalStatusNote')}
            };

            Ext.Ajax.request({
                method: 'PUT',
                url: first.config.Config.remoteRestUrl + "ecm/node/" + record.id,
                jsonData: nodeBodyupdate,
                success: function (response) {
                    record.commit();
                },
                failure: function (response) {
                    first.util.ErrorHandlerUtil.showErrorWindow(response);
                },
                callback: function () {
                    me.getView().unmask();
                }
            });

        }
    },

    finalStatusChange: function (obj, newVal) {
        let record = obj.getWidgetRecord();
        let me = this;

        let nodeBodyupdate = {
            name: record.get('name'),
            properties: {'fina:fiBranchesChangeFinalStatus': newVal}
        };

        Ext.Ajax.request({
            method: 'PUT',
            url: first.config.Config.remoteRestUrl + "ecm/node/" + record.id,
            jsonData: nodeBodyupdate,
            success: function (response) {
                record.commit();
                me.getViewModel().get('fiProfileController').refreshTabItemGrid('Branches');
            },
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            },
            callback: function () {
                me.getView().unmask();
            }
        });
    },

    onFinishChangeBranchClick: function () {
        let me = this,
            theFi = me.getViewModel().get('theFi');
        this.fireEvent('validateFiRegistryCall', theFi.id, function () {
            me.finishChange();
        }, function () {
            Ext.toast(i18n.registryDataValidationProgressError, i18n.error);
        }, function () {
            me.getView().unmask();
        });
    },

    finishChange: function () {
        let me = this,
            fiRegistryLegalActNumber = this.getViewModel().get('theFi')['fina_fiRegistryLegalActNumber'],
            approveTask = [{
                name: "fwf_fiRegistrationReviewOutcome",
                type: "d:text",
                value: "Approve",
                scope: "local"
            }],
            finishTask = [{
                name: "fwf_fiRegistrationAcceptedRejectedTaskNumberOfOrder",
                type: "d:text",
                value: fiRegistryLegalActNumber,
                scope: "local"
            }];

        let finishBody = {
            preFinishVariables: approveTask,
            finishVariables: finishTask,
            newProcessName: null,
        }

        me.getView().mask(i18n.pleaseWait);
        me.getViewModel().get('fiProfileTaskController').finishFiTask(me.getViewModel().get('theFi').id, finishBody, function () {
            Ext.toast(i18n.branchChangeProcessFinishSuccess, i18n.information);
        }, function () {
            me.getView().unmask();
        })
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
                    me.load();
                });
            } else {
                me.getView().unmask();
            }
        };

        this.fireEvent('validateFiRegistryCall', fi.id, function (result) {
            let invalidQuestionnaireFolders = result['fina:fiRegistryValidationResultQuestionnaireInvalidFolders'],
                isQuestionnairesFullyFilled = !invalidQuestionnaireFolders || !(Object.keys(invalidQuestionnaireFolders).length > 0);

            if (fi['fina_fiRegistryLastInspectorId'] && fi['fina_fiRegistryLastInspectorId'].length > 0) {
                callback(null, true, null);
            } else {
                new first.util.WorkflowHelper().sendToInspector(me.getView(), fi.id, inspectorGroupId, callback, vm);
            }
        }, function () {
            Ext.toast(i18n.pleaseRegenerateCardsAndLetters, i18n.error);
            vm.set('isGeneratedBranchDocuments', false);
            me.getView().unmask();
        }, function () {
            me.getView().unmask();
        });

    }

});
