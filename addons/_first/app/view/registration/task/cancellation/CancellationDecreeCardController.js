Ext.define('first.view.registration.task.cancellation.CancellationDecreeCardController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cancellationDecreeCardController',

    requires: [
        'first.config.Config',
        'first.util.DocumentGenerateUtil',
        'first.util.ErrorHandlerUtil'
    ],

    init: function () {
        let me = this,
            fiAction = this.getViewModel().get('fiAction'),
            decreeFiAction = {
                fina_fiRegistryActionControlStatusI18n: i18n[fiAction['fina_fiRegistryActionControlStatus']]
            },
            gridView = me.lookupReference('cancellationDecreeBranchGridView'),
            store = gridView.getStore();

        me.getViewModel().set('decreeFiAction', decreeFiAction);

        store.on({
            scope: me,
            load: 'checkBranchDecreesStatus'
        });

        gridView.on('edit', function (editor, e) {
            if (e.record.dirty) {
                if (!first.util.FiProfileUtil.canUserAmend(me.getViewModel())) {
                    e.record.reject();
                    return;
                }
                me.updateDecreeDocument(store, e.record);
            }
        });

        me.loadLetterToTheRepresentative();
        me.bind();
    },

    updateDecreeDocument: function (store, record) {
        let decreeDocument = record.get('document');
        if (decreeDocument) {
            let documentNumber = record.get('fina_fiDocumentNumber'),
                documentDate = record.get('fina_fiDocumentDate'),
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
                url: first.config.Config.remoteRestUrl + 'ecm/node/' + decreeDocument.id,
                jsonData: jsonData,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                success: function (response) {
                    record.commit();
                    me.checkBranchDecreesStatus(store, store.getData().items);
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

    bind: function () {
        let fiAction = this.getViewModel().get('fiAction'),
            theFi = this.getViewModel().get('theFi'),
            currentUser = first.config.Config.conf.properties.currentUser.id,
            controllerStatus = fiAction['fina_fiRegistryActionControlStatus'],
            controller = theFi['fina_fiRegistryLastInspectorId'],
            taskRedactor = controllerStatus != "REVIEW" && currentUser == controller;

        this.getViewModel().set('taskRedactor', taskRedactor);
    },

    onReportCardDownloadClick: function () {
        let existingReportCard = this.getViewModel().get('existingReportCard');
        if (existingReportCard) {
            window.open(first.config.Config.remoteRestUrl + 'ecm/node/' + existingReportCard.id + '/content?attachment=true');
        }
    },

    onGenerateDocumentsButtonClick: function () {
        let me = this,
            vm = this.getViewModel();

        me.getView().mask(i18n.pleaseWait);

        let success = function (response) {
            me.load();
            me.generateLetterToTheRepresentative();
        };
        let failure = function (response, message) {
            first.util.ErrorHandlerUtil.showDocumentError(response, message);
        };
        let callback = function () {
            me.getView().unmask();

        };

        first.util.DocumentGenerateUtil.generateDocument(vm, 'DECREE', null, null, null, success, failure, callback);
    },

    onGenerateClick: function (grid, row, col, btn, event, record) {
        let me = this,
            documentNumber = record.get('fina_fiDocumentNumber') ? record.get('fina_fiDocumentNumber') : '',
            documentDate = record.get('fina_fiDocumentDate') ? record.get('fina_fiDocumentDate') : null,
            vm = this.getViewModel();

        if (documentDate) {
            let date = new Date(documentDate);
            documentDate = Ext.Date.format(date, 'Y-m-d');
        }

        let theFi = this.getViewModel().get('theFi'),
            lastProcessId = theFi.fina_fiRegistryLastProcessId,
            fiRegistryId = theFi.id,
            actionId = theFi['fina_fiRegistryLastActionId'],
            postJson = {
                id: record.id,
                properties: record.get('properties')
            };

        me.getView().mask(i18n.pleaseWait);


        let failure = function (response) {
            first.util.ErrorHandlerUtil.showErrorWindow(response);
        };
        let callback = function () {
            me.getView().unmask();

        };

        let documentType;
        switch (record.get('fina_fiRegistryBranchStatus')) {
            case 'GAP':
                documentType = 'GAP_LETTER';
                break;
            case 'DECLINED':
                documentType = 'REFUSAL_LETTER';
                break;
            default:
                documentType = 'DECREE';
                break;
        }

        let success = function (response) {
            record.commit();
            me.load();

            if(documentType === "DECREE_CARD_REFUSAL") {
                me.generateLetterToTheRepresentative();
            } else if (documentType === "DECREE") {
                me.generateLetterToTheRepresentative();
            }
        };

        first.util.DocumentGenerateUtil.generateDocument(vm, documentType, documentNumber, documentDate, record.id, success, failure, callback);
    },

    onViewDecreeDocumentCLick: function (grid, row, col, btn, event, record) {
        this.showDocument({
            id: record.get('properties')['document'].id,
            name: record.get('properties')['document'].name
        });
    },

    showDocument: function (document) {
        if (document) {
            Ext.create('first.view.registration.FiProfileDocumentationEditView', {
                viewModel: {
                    data: {
                        fileId: document.id,
                        fileName: document.name,
                        isReadonly: false
                    }
                },
                buttons: null
            }).show();
        }
    },

    checkBranchDecreesStatus: function (store, records) {
        let valid = true,
            me = this;

        Ext.each(records, function (record) {
            if (record.get('properties')['fina_status'] === 'ACTIVE' && (!record.get('properties')['document'] || !record.get('fina_fiDocumentNumber') || !record.get('fina_fiDocumentDate'))) {
                valid = false;
            }
            if (record.get('properties')['fina:fiRegistryBranchType'] === 'HEAD_OFFICE') {
                me.getViewModel().set('headOfficeDecreeDocument', record.get('properties')['document']);
                me.getViewModel().set('headOfficeDecreeDocument.fina_fiDocumentNumber', record.get('fina_fiDocumentNumber'));
                me.getViewModel().set('headOfficeDecreeDocument.fina_fiDocumentDate', record.get('fina_fiDocumentDate'));
            }
        });
        this.getViewModel().set('decree', {isGeneratedAll: valid});
    },

    afterGridRender: function () {
        this.load();
    },

    load: function () {
        let view = this.lookupReference('cancellationDecreeBranchGridView'),
            theFi = this.getViewModel().get('theFi'),
            store = view.getStore();

        store.proxy.setUrl(first.config.Config.remoteRestUrl + 'ecm/fi/branch/decrees/' + theFi.id);
        store.addFilter(function (item) {
            return item.get('fina_status') === 'ACTIVE';
        });
        store.load();
    },

    onFinishRegistrationClick: function () {
        if (!this.getViewModel().get('decree.isGeneratedAll')) {
            Ext.toast(i18n.generateDocumentsWarning);
        } else {
            let me = this,
                headOfficeDocumentNumber = me.getViewModel().get('headOfficeDecreeDocument.fina_fiDocumentNumber'),
                headOfficeDocumentDate = me.getViewModel().get('headOfficeDecreeDocument.fina_fiDocumentDate'),
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
                Ext.toast(i18n.cancellationProcessFinishedSuccessfully, i18n.information);
            }, function () {
                me.getView().unmask();
            })
        }

    },


    beforeCellEdit: function (obj, editor) {
        return !!editor.record.get('document');
    },

    loadLetterToTheRepresentative: function () {
        let theFi = this.getViewModel().get('theFi'),
            lastProcessId = theFi['fina_fiRegistryLastProcessId'],
            actionId = theFi['fina_fiRegistryLastActionId'],
            me = this;

        Ext.Ajax.request({
            method: 'GET',
            url: first.config.Config.remoteRestUrl + 'ecm/fi/document/' + lastProcessId + '/LETTER_TO_THE_REPRESENTATIVE/' + actionId,
            success: function (response) {
                let result = JSON.parse(response.responseText);
                if (result && result.length > 0) {
                    let letterToTheRepresentative = result[0];
                    me.getViewModel().set('existingLetterToTheRepresentative', letterToTheRepresentative);
                }
            },
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
                me.getView().unmask();
            }
        });
    },

    onLetterToTheRepresentativeDownloadClick: function () {
        let existingLetterToTheRepresentative = this.getViewModel().get('existingLetterToTheRepresentative');
        if (existingLetterToTheRepresentative) {
            window.open(first.config.Config.remoteRestUrl + 'ecm/node/' + existingLetterToTheRepresentative.id + '/content?attachment=true');
        }
    },

    generateLetterToTheRepresentative() {
        let me = this;
        let vm = this.getViewModel();

        first.util.DocumentGenerateUtil.generateDocument(vm, 'LETTER_TO_THE_REPRESENTATIVE', null, null, null,
            function (response) {
                let result = JSON.parse(response.responseText);
                vm.set('existingLetterToTheRepresentative', result);
            }, function (response, message) {
                first.util.ErrorHandlerUtil.showDocumentError(response, message);
            }, null);
    },

    onDownloadDecreeDocumentCLick: function (grid, row, col, btn, event, record) {
        let properties = record.get('properties');
        if (properties && properties['document']) {
            window.open(first.config.Config.remoteRestUrl + 'ecm/node/' + properties['document'].id + '/content?attachment=true');
        }
    },

    onUploadDecreeDocumentCLick: function (grid, row, col, btn, event, record) {
        let properties = record.get('properties');
        if (properties && properties['document']) {
            let window = Ext.create({xtype: 'fileUpdateWindow'});
            window.getViewModel().set('nodeId', properties['document'].id);
            window.show();
        }
    },

    isUploadDecreeDocumentDisabled: function (view, rowIndex, colIndex, item, record) {
        let vm = this.getViewModel();
        return !record.get('properties')['document'] || vm.get('inReview') || !vm.get('isRegistryActionEditor');
    },

});
