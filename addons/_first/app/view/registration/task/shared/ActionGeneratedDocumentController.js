Ext.define('first.view.registration.task.shared.ActionGeneratedDocumentController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.actionGeneratedDocumentController',

    init: function () {
        let me = this;
        this.getView().on('edit', function (editor, e) {
            if (e.record.dirty) {
                //if redactor is not editor not update document
                if (!first.util.FiProfileUtil.canUserAmend(me.getViewModel())) {
                    e.record.reject();
                    return;
                }
                me.updateDocument(e.record);
            }
        });

        let theFi = this.getViewModel().get('theFi'),
            currentUser = first.config.Config.conf.properties.currentUser.id,
            editor = theFi['fina_fiRegistryLastEditorId'],
            isEditor = currentUser === editor;

        me.getViewModel().set('isEditor', isEditor);
    },

    load: function () {
        let store = this.getView().getStore(),
            fiAction = this.getViewModel().get('fiAction');

        if (fiAction && fiAction.fina_fiRegistryActionType === 'CANCELLATION' && fiAction.fina_fiCancellationIsLiquidatorRequired) {
            let me = this,
                documentsFolderId = fiAction.fina_fiRegistryActionDocumentsFolderId;
            store.proxy.setUrl(first.config.Config.remoteRestUrl + 'ecm/node/' + documentsFolderId + '/children/full?relativePath=Liquidation Generated Documents');
            store.load({
                callback: function (records) {
                    me.bindDecreeDocument(records);
                }
            });
        }
    },

    bindDecreeDocument: function (records) {
        let me = this;
        Ext.each(records, function (record) {
            me.setDecreeDocumentData(record);
        });
    },

    setDecreeDocumentData: function (record) {
        let decreeDocumentNumber = null,
            decreeDocumentDate = null,
            isDecreeGenerated = false;

        let properties = record.get('properties'),
            docType = properties['fina:fiDocumentType'];

        if (docType === 'DECREE') {
            decreeDocumentNumber = record.get('fina_fiDocumentNumber');
            decreeDocumentDate = record.get('fina_fiDocumentDate');
            if (decreeDocumentNumber && decreeDocumentDate) {
                isDecreeGenerated = true;
            }

            this.getViewModel().set('isDecreeGenerated', isDecreeGenerated);
            this.getViewModel().set('decreeDocumentNumber', decreeDocumentNumber);
            this.getViewModel().set('decreeDocumentDate', decreeDocumentDate);
        }
    },

    updateDocument: function (record) {
        let me = this;
        me.getView().mask(i18n.pleaseWait);

        let documentNumber = record.get('fina_fiDocumentNumber'),
            documentDate = record.get('fina_fiDocumentDate'),
            jsonData = {
                properties: {
                    'fina:fiDocumentNumber': documentNumber,
                    'fina:fiDocumentDate': documentDate
                }
            };

        Ext.Ajax.request({
            method: 'PUT',
            url: first.config.Config.remoteRestUrl + 'ecm/node/' + record.id,
            jsonData: jsonData,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            success: function (response) {
                record.commit();
                me.setDecreeDocumentData(record);
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
    },

    onGenerateActionDocumentClick: function (grid, row, col, btn, event, record) {
        let documentNumber = record.get('fina_fiDocumentNumber') ? record.get('fina_fiDocumentNumber') : null,
            documentDate = record.get('fina_fiDocumentDate') ? record.get('fina_fiDocumentDate') : null;

        this.generateDocument(documentNumber, documentDate, record.get('fina_fiDocumentType'), record.get('fina_fiBranchId'));
    },

    generateDocument: function (documentNumber, documentDate, documentType, nodeId) {
        let me = this,
            vm = this.getViewModel();

        me.getView().mask(i18n.pleaseWait);

        if (documentDate) {
            let date = new Date(documentDate);
            documentDate = Ext.Date.format(date, 'Y-m-d');
        }

        let success = function (response) {
            me.getView().getStore().load({
                callback: function (records) {
                    me.bindDecreeDocument(records);
                }
            });
        };
        let failure = function (response, message) {
            first.util.ErrorHandlerUtil.showDocumentError(response, message);
        };
        let callback = function () {
            me.getView().unmask();
        };

        first.util.DocumentGenerateUtil.generateDocument(vm, documentType, documentNumber, documentDate, nodeId, success, failure, callback);
    },

    onDownloadActionDocumentClick: function (grid, row, col, btn, event, record) {
        window.open(first.config.Config.remoteRestUrl + 'ecm/node/' + record.id + '/content?attachment=true');
    },

    isGenerateActionDocumentDisabled: function (view, rowIndex, colindex, item, record) {
        return !this.getViewModel().get('isRegistryActionEditor') || this.getViewModel().get('inReview') || this.getViewModel().get('fiAction').fina_fiRegistryActionStep !== 4;
    },

    isUploadActionDocumentDisabled: function (view, rowIndex, colindex, item, record) {
        return !(record.get('cm_author')) || !this.getViewModel().get('isRegistryActionEditor') || this.getViewModel().get('inReview') || this.getViewModel().get('fiAction').fina_fiRegistryActionStep !== 4;
    },

    onUploadActionDocumentClick: function (grid, row, col, btn, event, record) {
        let window = Ext.create({xtype: 'fileUpdateWindow'});
        window.getViewModel().set('nodeId', record.id);
        window.show();
    },

    afterRender: function () {
        this.load();
    }

});