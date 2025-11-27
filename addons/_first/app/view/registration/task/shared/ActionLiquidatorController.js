Ext.define('first.view.registration.task.shared.ActionLiquidatorController', {
    extend: 'first.view.registration.FiProfileDetailsController',

    alias: 'controller.actionLiquidatorController',

    init: function () {
        let me = this,
            childType = this.getViewModel().get('fiAction.fina_fiCancellationLiquidatorNodeType');

        if (childType) {

            this.getViewModel().set('detail', {
                properties: {
                    'fina:folderConfigChildType': childType
                }
            });

            Ext.Ajax.request({
                url: first.config.Config.remoteRestUrl + 'ecm/dictionary/classes/' + childType.replace(':', '_') + '/properties',
                method: 'GET',
                callback: function (options, success, response) {
                    let metaDada = JSON.parse(response.responseText),
                        hiddenProperties = first.view.registration.MetadataUtil.filterAndSortMetaData(childType, metaDada),
                        questions = first.view.registration.MetadataUtil.getQuestions(childType, metaDada),
                        singleLineItems = first.view.registration.MetadataUtil.getSingleLineItemGroup(childType, metaDada);

                    metaDada.find(function (meta) {
                        return meta.name.endsWith('fiAuthorizedPersonPosition');
                    }).protectedValue = true;

                    me.getViewModel().set('metaDada', metaDada);
                    me.getViewModel().set('hiddenProperties', hiddenProperties);
                    me.getViewModel().set('questions', questions);
                    me.getViewModel().set('singleLineItems', singleLineItems);
                }
            });

            let fiAction = this.getViewModel().get('fiAction'),
                theFi = this.getViewModel().get('theFi'),
                currentUser = first.config.Config.conf.properties.currentUser.id,
                controllerStatus = fiAction['fina_fiRegistryActionControlStatus'],
                editor = theFi['fina_fiRegistryLastEditorId'],
                taskRedactor = currentUser === editor;

            me.getViewModel().set('isRedactor', taskRedactor);
            me.getViewModel().set('review', controllerStatus === 'REVIEW');
            me.getViewModel().set('actionStep', me.getViewModel().get('fiAction').fina_fiRegistryActionStep);
        }
    },

    load: function () {
        if (this.getViewModel().get('fiAction.fina_fiCancellationLiquidatorNodeType')) {
            let me = this,
                actionId = this.getViewModel().get('fiAction').id,
                store = this.getView().getStore();

            store.proxy.setUrl(first.config.Config.remoteRestUrl + 'ecm/fi/action/liquidators/' + actionId);
            store.load({
                callback: function (records) {
                    me.bindLiquidationDocumentGenerationStatus(records);
                }
            });

            this.getView().on('edit', function (editor, e) {
                if (e.record.dirty) {
                    if (!first.util.FiProfileUtil.canUserAmend(me.getViewModel())) {
                        e.record.reject();
                        return;
                    }
                    me.updateDocumentsProperties(store, e.record);
                }
            });
        } else {
            this.getViewModel().set('isAllLiquidatorReportCardGenerated', true);
        }
    },

    insertActionLiquidatorNode: function (properties) {
        let me = this,
            actionId = this.getViewModel().get('fiAction').id,
            store = this.getView().getStore(),
            jsonData = {
                name: null,
                nodeType: 'fina:fiActionLiquidator',
                properties: properties,
                aspectNames: null,
                relativePath: 'Liquidators'
            };

        this.getView().mask(i18n.pleaseWait);
        Ext.Ajax.request({
            method: 'POST',
            url: first.config.Config.remoteRestUrl + 'ecm/node/' + actionId + '/children',
            jsonData: jsonData,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            success: function (response) {
                store.load();
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

    updateDocumentsProperties: function (store, record) {
        let theFi = this.getViewModel().get('theFi'),
            currentUser = first.config.Config.conf.properties.currentUser.id,
            editor = theFi['fina_fiRegistryLastEditorId'],
            taskRedactor = currentUser === editor;
        //if redactor is not editor not update document
        if (!first.util.FiProfileUtil.canUserAmend(this.getViewModel())) {
            return;
        }

        let liquidatorReportCardDocumentId = record.get('fina_fiActionLiquidatorReportCardDocumentReferenceId');
        if (liquidatorReportCardDocumentId) {
            let documentNumber = record.get('fina_fiActionLiquidatorReportCardDocumentNumber'),
                documentDate = record.get('fina_fiActionLiquidatorReportCardDocumentDate'),
                jsonData = {
                    properties: {
                        'fina:fiDocumentNumber': documentNumber,
                        'fina:fiDocumentDate': documentDate
                    }
                };
            this.updateDocument(store, record, liquidatorReportCardDocumentId, jsonData);
        }

        let liquidatorLetterDocumentId = record.get('fina_fiActionLiquidatorLetterDocumentReferenceId');
        if (liquidatorLetterDocumentId) {
            let documentNumber = record.get('fina_fiActionLiquidatorLetterDocumentNumber'),
                documentDate = record.get('fina_fiActionLiquidatorLetterDocumentDate'),
                jsonData = {
                    properties: {
                        'fina:fiDocumentNumber': documentNumber,
                        'fina:fiDocumentDate': documentDate
                    }
                };
            this.updateDocument(store, record, liquidatorLetterDocumentId, jsonData);
        }
    },

    updateDocument: function (store, record, documentId, jsonData) {
        let me = this;
        me.getView().mask(i18n.pleaseWait);
        Ext.Ajax.request({
            method: 'PUT',
            url: first.config.Config.remoteRestUrl + 'ecm/node/' + documentId,
            jsonData: jsonData,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            success: function (response) {
                record.commit();
                me.bindLiquidationDocumentGenerationStatus(store.getData().items);
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

    bindLiquidationDocumentGenerationStatus: function (records) {
        let isAllLiquidationReportCardGenerated = !(!records || records.length === 0);
        Ext.each(records, function (record) {
            let properties = record.get('properties'),
                liquidationReportCardDocument = properties['fina:fiLiquidatorReportCardDocument'];

            if (!liquidationReportCardDocument) {
                isAllLiquidationReportCardGenerated = false;
                return;
            }

            if (!record.get('fina_fiActionLiquidatorReportCardDocumentNumber') || !record.get('fina_fiActionLiquidatorReportCardDocumentDate')) {
                isAllLiquidationReportCardGenerated = false;
                return;
            }
        });

        this.getViewModel().set('isAllLiquidatorReportCardGenerated', isAllLiquidationReportCardGenerated);
    },

    onViewClick: function (view, recIndex, cellIndex, item, e, record) {
        let fiProfileController = this.getViewModel().get('fiProfileController');
        fiProfileController.setActiveTabAndSelectRecord('Authorized_Persons', record.get('fina_fiActionLiquidatorReferenceId'));
    },

    onAddLiquidatorClick: function () {
        let me = this,
            position = this.getViewModel().get('fiAction').fina_fiCancellationLiquidatorPositionNodeName,
            nodeType = this.getViewModel().get('fiAction').fina_fiCancellationLiquidatorNodeType;

        this.getViewModel().set('nodeType', nodeType);

        let submitSuccessCallback = function (resultObject) {
                if (resultObject.get(position) === 'liquidator') {
                    let properties = {
                        'fina:fiActionLiquidatorReferenceId': resultObject.id,
                        'fina:fiActionLiquidatorType': 'ADDED',
                        'fina:fiActionLiquidatorFirstName': resultObject.get('fina:fiPersonFirstName'),
                        'fina:fiActionLiquidatorLastName': resultObject.get('fina:fiPersonLastName'),
                        'fina:fiActionLiquidatorIdentificationNumber': resultObject.get('fina:fiPersonPersonalNumber')
                    };
                    me.insertActionLiquidatorNode(properties);
                }
            },
            authorizedPersonsStore = this.getViewModel().get('fiProfileController').getTabItemStore('Authorized_Persons');

        let authorizedPersonModel = {};
        authorizedPersonModel[position.replace(':', '_')] = 'liquidator';
        this.addOrEdit(authorizedPersonModel, null, null, authorizedPersonsStore, submitSuccessCallback);
    },

    onDeleteClick: function (view, recIndex, cellIndex, item, e, record) {
        let me = this,
            nodeId = record.id,
            authorizedPersonId = record.get('fina_fiPerson').id,
            store = this.getView().getStore();

        this.deleteNode(authorizedPersonId);
        this.deleteNode(nodeId, function (nodeId) {
            let record = store.findRecord('id', nodeId);
            store.remove(record);
            me.bindLiquidationDocumentGenerationStatus(store.records);
        });
    },

    deleteNode: function (nodeId, successCallback) {
        let me = this;
        me.getView().mask(i18n.pleaseWait);
        Ext.Ajax.request({
            url: first.config.Config.remoteRestUrl + 'ecm/node/' + nodeId,
            method: 'DELETE',
            success: function (response) {
                if (successCallback) {
                    successCallback(nodeId);
                }
            },
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            },
            callback: function () {
                me.getView().unmask();
            }
        });
    },

    onDownloadLiquidatorReportCardClick: function (grid, row, col, btn, event, record) {
        let liquidatorReportCardId = record.get('fina_fiActionLiquidatorReportCardReferenceId');
        this.downloadDocument(liquidatorReportCardId);
    },

    onDownloadLiquidatorLetterClick: function (grid, row, col, btn, event, record) {
        let liquidatorLetterId = record.get('fina_fiActionLiquidatorLetterReferenceId');
        this.downloadDocument(liquidatorLetterId);
    },

    downloadDocument: function (nodeId) {
        if (nodeId) {
            window.open(first.config.Config.remoteRestUrl + 'ecm/node/' + nodeId + '/content?attachment=true');
        }
    },

    onUploadLiquidatorReportCardClick: function (grid, row, col, btn, event, record) {
        let liquidatorReportCardId = record.get('fina_fiActionLiquidatorReportCardReferenceId');
        this.uploadDocument(liquidatorReportCardId);
    },

    onUploadLiquidatorLetterClick: function (grid, row, col, btn, event, record) {
        let liquidatorLetterId = record.get('fina_fiActionLiquidatorLetterReferenceId');
        this.uploadDocument(liquidatorLetterId);
    },

    uploadDocument: function (nodeId) {
        if (nodeId) {
            let window = Ext.create({xtype: 'fileUpdateWindow'});
            window.getViewModel().set('nodeId', nodeId);
            window.show();
        }
    },

    onGenerateLiquidatorReportCardClick: function (grid, row, col, btn, event, record) {
        let documentNumber = record.get('fina_fiActionLiquidatorReportCardDocumentNumber') ? record.get('fina_fiActionLiquidatorReportCardDocumentNumber') : null,
            documentDate = record.get('fina_fiActionLiquidatorReportCardDocumentDate') ? record.get('fina_fiActionLiquidatorReportCardDocumentDate') : null;

        this.generateDocument(documentNumber, documentDate, 'REPORT_CARD_LIQUIDATOR', record.get('fina_fiActionLiquidatorReferenceId'), record);
    },

    onGenerateLiquidatorLetterClick: function (grid, row, col, btn, event, record) {
        let documentNumber = record.get('fina_fiActionLiquidatorLetterDocumentNumber') ? record.get('fina_fiActionLiquidatorLetterDocumentNumber') : null,
            documentDate = record.get('fina_fiActionLiquidatorLetterDocumentDate') ? record.get('fina_fiActionLiquidatorLetterDocumentDate') : null;

        this.generateDocument(documentNumber, documentDate, 'LETTER_LIQUIDATOR', record.get('fina_fiActionLiquidatorReferenceId'), record);
    },

    generateDocument: function (documentNumber, documentDate, documentType, nodeId, record) {
        let me = this,
            vm = this.getViewModel();

        me.getView().mask(i18n.pleaseWait);

        if (documentDate) {
            let date = new Date(documentDate);
            documentDate = Ext.Date.format(date, 'Y-m-d');
        }

        let success = function (response) {
            let result = JSON.parse(response.responseText);
            me.updateChangeNode(record, result.id, documentType);
        };
        let failure = function (response, message) {
            first.util.ErrorHandlerUtil.showDocumentError(response, message);
        };
        let callback = function () {
            me.getView().unmask();

        };

        first.util.DocumentGenerateUtil.generateDocument(vm, documentType, documentNumber, documentDate, nodeId, success, failure, callback);
    },

    updateChangeNode: function (record, documentId, documentType) {
        let me = this,
            properties = record.get('properties');

        if (documentType === 'REPORT_CARD_LIQUIDATOR') {
            properties['fina:fiActionLiquidatorReportCardReferenceId'] = documentId
        } else if (documentType === 'LETTER_LIQUIDATOR') {
            properties['fina:fiActionLiquidatorLetterReferenceId'] = documentId
        }

        delete properties['fina:fiPerson'];
        delete properties['fina:fiLiquidatorReportCardDocument'];
        delete properties['fina:fiLiquidatorLetterDocument'];

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

    isGenerateLiquidatorReportCardDisabled: function (view, rowIndex, colindex, item, record) {
        return !this.getViewModel().get('isRegistryActionEditor') || this.getViewModel().get('inReview') || this.getViewModel().get('fiAction').fina_fiRegistryActionStep === 4;
    },

    isGenerateLiquidatorLetterDisabled: function (view, rowIndex, colindex, item, record) {
        return !this.getViewModel().get('isRegistryActionEditor') || this.getViewModel().get('inReview') || this.getViewModel().get('fiAction').fina_fiRegistryActionStep !== 4;
    },

    isUploadLiquidatorReportCardDisabled: function (view, rowIndex, colindex, item, record) {
        return !(record.get('fina_fiLiquidatorReportCardDocument')) || !this.getViewModel().get('isRegistryActionEditor') || this.getViewModel().get('inReview') || this.getViewModel().get('fiAction').fina_fiRegistryActionStep === 4;
    },

    isUploadLiquidatorLetterDisabled: function (view, rowIndex, colindex, item, record) {
        return !(record.get('fina_fiLiquidatorLetterDocument')) || !this.getViewModel().get('isRegistryActionEditor') || this.getViewModel().get('inReview') || this.getViewModel().get('fiAction').fina_fiRegistryActionStep !== 4;
    },

    isDeleteLiquidatorDisabled: function (view, rowIndex, colIndex, item, record) {
        return !this.getViewModel().get('isRegistryActionEditor') || this.getViewModel().get('inReview') || this.getViewModel().get('fiAction').fina_fiRegistryActionStep === 4;
    },

    afterRender: function () {
        this.load();

        let tbar = this.lookupReference('actionLiquidatorTbar');
        if (tbar) {
            let isVisible = (this.getViewModel().get('isRegistryActionEditor') && !this.getViewModel().get('inReview') && this.getViewModel().get('fiAction').fina_fiRegistryActionStep !== 4);
            tbar.setVisible(isVisible);
        }
    }

});