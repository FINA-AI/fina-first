Ext.define('first.view.registration.task.DecreeCardController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.decreeController',

    init: function () {
        let me = this,
            fiAction = this.getViewModel().get('fiAction'),
            decreeFiAction = {
                fina_fiRegistryActionControlStatus: fiAction['fina_fiRegistryActionControlStatus'],
                fina_fiRegistryActionControlStatusI18n: i18n[fiAction['fina_fiRegistryActionControlStatus']]
            };
        me.getViewModel().set('decreeFiAction', decreeFiAction);

        let gridView = me.lookupReference('decreeBranchGridView'),
            store = gridView.getStore();

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
        me.bind()
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
                    me.bindDecreeGenerationStatus(store.getData().items);
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

    bindDecreeGenerationStatus: function (records) {
        let me = this, isGeneratedAllDecree = true;
        Ext.each(records, function (record) {
            let decreeDocument = record.get('document');

            if (!decreeDocument && record.get('fina_fiRegistryBranchStatus') !== "GAP") {
                isGeneratedAllDecree = false;
            }

            if ((!record.get('fina_fiDocumentNumber') || !record.get('fina_fiDocumentDate')) && record.get('fina_fiRegistryBranchStatus') !== "GAP") {
                isGeneratedAllDecree = false;
            }

            if (record.get('properties')['fina:fiRegistryBranchType'] === 'HEAD_OFFICE') {
                me.getViewModel().set('headOfficeDecreeDocument', record.get('properties')['document']);
                me.getViewModel().set('headOfficeDecreeDocument.fina_fiDocumentNumber', record.get('fina_fiDocumentNumber'));
                me.getViewModel().set('headOfficeDecreeDocument.fina_fiDocumentDate', record.get('fina_fiDocumentDate'));
            }

            if (record.get('fina_fiRegistryBranchStatus') === 'GAP') {
                me.getViewModel().set('mustStartBranchesChangeWorkflow', true);
            }
        });

        this.getViewModel().set('decree', {isGeneratedAll: isGeneratedAllDecree});
    },

    bind: function () {
        let me = this,
            fiAction = this.getViewModel().get('fiAction'),
            theFi = this.getViewModel().get('theFi'),
            currentUser = first.config.Config.conf.properties.currentUser.id,
            controllerStatus = fiAction['fina_fiRegistryActionControlStatus'],
            controller = theFi['fina_fiRegistryLastInspectorId'],
            taskRedactor = controllerStatus != "REVIEW" && currentUser == controller;

        this.getViewModel().set('taskRedactor', taskRedactor);
    },

    afterGridRender: function () {
        this.load();
    },

    load: function () {
        let me = this,
            view = this.lookupReference('decreeBranchGridView'),
            theFi = this.getViewModel().get('theFi'),
            store = view.getStore(),
            workflowVariables = this.getViewModel().get('workflowVariables');

        store.proxy.setUrl(first.config.Config.remoteRestUrl + 'ecm/fi/branch/decrees/' + theFi.id +
            (workflowVariables && workflowVariables['wf_doNotGenerateDecreeOnBranches'] ? "?headOfficeOnly=true" : ""));
        store.load({
            callback: function (records) {
                me.bindDecreeGenerationStatus(records);
            }
        });
    },


    bindDecreeData: function (result) {
        let me = this;
        if (result && result.length > 0) {
            result.forEach(function (doc) {
                doc.documentNumber = doc.properties['fina:fiDocumentNumber'];
                if (doc.name.indexOf('FI_') === 0) {
                    doc.infoText = me.getDecreeDocumentInfoText(doc);
                    me.getViewModel().set('decree', doc);
                }
            })
        }
    },

    onReportCardDownloadClick: function () {
        let existingReportCard = this.getViewModel().get('existingReportCard');
        if (existingReportCard) {
            window.open(first.config.Config.remoteRestUrl + 'ecm/node/' + existingReportCard.id + '/content?attachment=true');
        }
    },

    getDecreeDocumentInfoText: function (document) {
        let createdAt = Ext.Date.format(new Date(document.createdAt - 0), first.config.Config.timeFormat);
        let modifiedAt = Ext.Date.format(new Date(document.modifiedAt - 0), first.config.Config.timeFormat);
        let fiDocumentIsLastVersion = document.properties['fina:fiDocumentIsLastVersion'];

        return Ext.String.format('{0}: {1} | {2}: {3} | {4}', i18n.reportCardCreatedAt, createdAt, i18n.reportCardModifiedAt, modifiedAt, fiDocumentIsLastVersion ? i18n.gapLetterIsLastVersion : i18n.gapLetterIsNotLastVersion);
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

        let workflowVariables = this.getViewModel().get('workflowVariables'),
            store = this.lookupReference('decreeBranchGridView').getStore();

        first.util.DocumentGenerateUtil.generateDocument(vm, 'DECREE', null, null,
            (workflowVariables && workflowVariables['wf_doNotGenerateDecreeOnBranches'] ? store.getAt(0).get('id') : null), success, failure, callback);

    },

    onFinishRegistrationClick: function () {
        let me = this,
            viewModel = me.getViewModel();
        if (!viewModel.get('decree.isGeneratedAll')) {
            Ext.toast(i18n.generateDocumentsWarning);
        } else {
            let headOfficeDocumentNumber = me.getViewModel().get('headOfficeDecreeDocument.fina_fiDocumentNumber'),
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

            if (me.getViewModel().get('theFi.fina_fiActionType') === 'REGISTRATION') {
                let fiRegistryBinder = me.getViewModel().get('theFi.fina_fiRegistryBinder');
                finishTask.push({
                    name: "fwf_fiRegistrationAcceptedRejectedTaskBinder",
                    type: "d:text",
                    value: fiRegistryBinder ? fiRegistryBinder : null,
                    scope: "local"
                })
            }

            let newProcessName = me.getViewModel().get('mustStartBranchesChangeWorkflow') ? 'branchChangeWorkflowKey' : null;

            let finishBody = {
                preFinishVariables: approveTask,
                finishVariables: finishTask,
                newProcessName: newProcessName,
            };

            me.getView().mask(i18n.pleaseWait);
            me.getViewModel().get('fiProfileTaskController').finishFiTask(me.getViewModel().get('theFi').id, finishBody, function () {
                Ext.toast(i18n.registrationFinishedSuccessfully, i18n.information);
            }, function () {
                me.getView().unmask();
            })
        }
    },

    onSanctionedPeopleChecklistReviewClick: function () {
        let me = this;
        let window = Ext.create({
            xtype: 'sanctionedPeopleChecklistWindow',
            viewModel: {
                data: me.getViewModel().data
            }
        });
        window.show();
    },

    onGenerateClick: function (grid, row, col, btn, event, record) {
        let me = this,
            vm = this.getViewModel(),
            documentNumber = record.get('fina_fiDocumentNumber') ? record.get('fina_fiDocumentNumber') : null,
            documentDate = record.get('fina_fiDocumentDate') ? record.get('fina_fiDocumentDate') : null;

        me.getView().mask(i18n.pleaseWait);

        if (documentDate) {
            let date = new Date(documentDate);
            documentDate = Ext.Date.format(date, 'Y-m-d');
        }

        let failure = function (response, message) {
            first.util.ErrorHandlerUtil.showDocumentError(response, message);
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
                documentType = 'DECREE_CARD_REFUSAL';
                break;
            default:
                documentType = 'DECREE';
                break;
        }

        let success = function (response) {
            record.commit();
            me.load();

            if (documentType === "DECREE_CARD_REFUSAL") {
                me.generateLetterToTheRepresentative();
            } else if (documentType === "DECREE") {
                me.generateLetterToTheRepresentative();
            }
        };

        first.util.DocumentGenerateUtil.generateDocument(vm, documentType, documentNumber, documentDate, record.id, success, failure, callback);
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
    }

});
