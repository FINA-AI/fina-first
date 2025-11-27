Ext.define('first.view.registration.task.branchChange.BranchChangeRefusalCardController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.branchChangeRefusalCard',

    init: function () {
        this.callParent();
        this.load();
    },

    load: function () {
        let me = this,
            theFi = this.getViewModel().get('theFi'),
            actionId = theFi['fina_fiRegistryLastActionId'],
            grid = this.lookupReference('branchChangesGridViewFinal'),
            store = grid.getStore();

        store.proxy.setUrl(first.config.Config.remoteRestUrl + 'ecm/fi/branchChanges/' + actionId + '?relativePath=Performed Changes');
        store.load({
            callback: function (records) {
                me.bindRefusalLetterGenerationStatus(records);
            }
        });

        grid.on('edit', function (editor, e) {
            if (e.record.dirty) {
                if (!first.util.FiProfileUtil.canUserAmend(me.getViewModel())) {
                    e.record.reject();
                    return;
                }
                me.updateRefusalLetterDocument(store, e.record);
            }
        });
    },

    updateRefusalLetterDocument: function (store, record) {
        let refusalLetterDocument = record.get('properties')['fina:fiBranchRefusalLetterDocument'];
        if (refusalLetterDocument) {
            let documentNumber = record.get('fina_refusalLetterDocumentNumber'),
                documentDate = record.get('fina_refusalLetterDocumentDate'),
                jsonData = {
                    properties: {
                        'fina:fiDocumentNumber': documentNumber,
                        'fina:fiDocumentDate': documentDate
                    }
                };

            let me = this;
            me.getView().mask(i18n.pleaseWait);
            Ext.Ajax.request({
                method: 'PUT',
                url: first.config.Config.remoteRestUrl + 'ecm/node/' + refusalLetterDocument.id,
                jsonData: jsonData,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                success: function (response) {
                    record.commit();
                    me.bindRefusalLetterGenerationStatus(store.getData().items);
                },
                failure: function (response) {
                    first.util.ErrorHandlerUtil.showErrorWindow(response);
                },
                callback: function () {
                    if (me.getView()) {
                        me.getView().unmask();
                    }
                }
            });

        }
    },

    bindRefusalLetterGenerationStatus: function (records) {
        let isAllRefusalLetterGenerated = true;
        Ext.each(records, function (record) {
            let properties = record.get('properties'),
                refusalLetterDocument = properties['fina:fiBranchRefusalLetterDocument'];

            if (!refusalLetterDocument) {
                isAllRefusalLetterGenerated = false;
                return;
            }

            if (!record.get('fina_refusalLetterDocumentNumber') || !record.get('fina_refusalLetterDocumentDate')) {
                isAllRefusalLetterGenerated = false;
                return;
            }
        });

        this.getViewModel().set('isAllRefusalLetterGenerated', isAllRefusalLetterGenerated);
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

    onDownloadRefusalLetterClick: function (grid, row, col, btn, event, record) {
        let properties = record.get('properties');
        if (properties && properties['fina:fiBranchRefusalLetterDocument']) {
            this.downloadDocument(properties['fina:fiBranchRefusalLetterDocument'].id);
        }
    },

    downloadDocument: function (documentId) {
        if (documentId) {
            window.open(first.config.Config.remoteRestUrl + 'ecm/node/' + documentId + '/content?attachment=true');
        }
    },

    onGenerateRefusalLetterClick: function (grid, row, col, btn, event, record) {
        let me = this,
            vm = this.getViewModel(),
            theFi = vm.get('theFi'),
            documentNumber = record.get('fina_refusalLetterDocumentNumber') ? record.get('fina_refusalLetterDocumentNumber') : null,
            documentDate = record.get('fina_refusalLetterDocumentDate') ? record.get('fina_refusalLetterDocumentDate') : null;

        me.getView().mask(i18n.pleaseWait);

        if (documentDate) {
            let date = new Date(documentDate);
            documentDate = Ext.Date.format(date, 'Y-m-d');
        }

        let success = function (response) {
            let result = JSON.parse(response.responseText);
            me.updateChangeNode(record, result.id);
        }, failure = function (response, message) {
            first.util.ErrorHandlerUtil.showDocumentError(response, message);

        }, callback = function () {
            me.getView().unmask();
        };

        let documentType;
        if (theFi['fina_fiRegistryHasRefusalDocuments']) {
            documentType = 'DECREE_CARD_REFUSAL'
        } else {
            documentType = 'REFUSAL_LETTER';
        }

        first.util.DocumentGenerateUtil.generateDocument(vm, documentType, documentNumber, documentDate, record.get('fina_fiRegistryBranch').id, success, failure, callback);
    },

    updateChangeNode: function (record, documentId) {
        let me = this,
            properties = record.get('properties');
        properties['fina:finaBranchRefusalLetterDocumentReferenceId'] = documentId;
        delete properties['fina:fiRegistryBranch'];
        delete properties['fina:fiDocument'];
        delete properties['fina:fiBranchRefusalLetterDocument'];

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


    onRefuseChangeBranchClick: function () {
        let me = this,
            fiRegistryLegalActNumber = this.getViewModel().get('theFi')['fina_fiRegistryLegalActNumber'],
            approveTask = [{
                name: "fwf_fiRegistrationReviewOutcome",
                type: "d:text",
                value: "Reject",
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

    beforeCellEdit: function (obj, editor, x, z) {
        let properties = editor.record.get('properties'),
            enableResult = (properties && properties['fina:fiBranchRefusalLetterDocument'] && properties['fina:fiBranchRefusalLetterDocument'].id);

        if (enableResult && this.getViewModel().get('isRegistryActionEditor')) {
            return true;
        }

        return false;
    },

    isGenerateRefusalLetterDisabled: function (view, rowIndex, colindex, item, record) {
        return !this.getViewModel().get('isRegistryActionEditor');
    },

    onViewClick: function (view, recIndex, cellIndex, item, e, record) {
        let tabName = 'Branches',
            fiProfileController = this.getViewModel().get('fiProfileController');

        fiProfileController.setActiveTabAndSelectRecord(tabName, record.get('fina_fiBranchesChangeReferenceId'));
    },

    isUploadRefusalLetterDisabled: function (view, rowIndex, colindex, item, record) {
        let properties = record.get('properties');
        return !(properties && properties['fina:fiBranchRefusalLetterDocument'] && properties['fina:fiBranchRefusalLetterDocument'].id) || !this.getViewModel().get('isRegistryActionEditor');
    },

    onUploadRefusalLetterClick: function (grid, row, col, btn, event, record) {
        let properties = record.get('properties');
        if (properties && properties['fina:fiBranchRefusalLetterDocument']) {
            let window = Ext.create({xtype: 'fileUpdateWindow'});
            window.getViewModel().set('nodeId', properties['fina:fiBranchRefusalLetterDocument'].id);
            window.show();
        }
    },

});
