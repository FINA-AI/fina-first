Ext.define('first.view.registration.task.change.ChangeEditInfoDecreeCardController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.changeEditInfoDecreeController',

    requires: [
        'first.config.Config',
        'first.util.DocumentGenerateUtil',
        'first.util.ErrorHandlerUtil',
        'first.view.registration.MetadataUtil',
    ],

    init: function () {
        let me = this,
            theFi = this.getViewModel().get('theFi'),
            fiAction = this.getViewModel().get('fiAction'),
            decreeFiAction = {
                fina_fiRegistryActionControlStatusI18n: i18n[fiAction['fina_fiRegistryActionControlStatus']]
            };
        me.getViewModel().set('decreeFiAction', decreeFiAction);

        if (!me.getViewModel().get('isFormInitialized')) {
            me.initForm(theFi.nodeType);
        } else {
            me.fireEvent('getFiCall', theFi.id, function (obj) {
                me.getViewModel().set('theFi', obj);
            })
        }

        if (me.getViewModel().get('fiAction.fina_fiRegistryActionChangeGenerateDecreeForAllBranches')) {
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
        }

        me.loadDecreeDocument();
        me.loadLetterToTheRepresentative();
        me.bind();
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

    loadDecreeDocument: function (callback) {
        let me = this,
            theFi = me.getViewModel().get('theFi'),
            fiActionId = me.getViewModel().get('fiAction').id,
            fiRegistryId = theFi.id;

        Ext.Ajax.request({
            method: 'GET',
            url: first.config.Config.remoteRestUrl + 'ecm/fi/branch/decrees/' + fiRegistryId + '?fiRegistryActionId=' + fiActionId,
            success: function (response) {
                let data = JSON.parse(response.responseText);
                if (data && data.list) {
                    let headOffice = data.list.filter(item => item.properties && item.properties['fina:fiRegistryBranchType'] === 'HEAD_OFFICE')[0];
                    me.getViewModel().set('headOfficeBranch', headOffice);

                    let document = headOffice.properties['document'];
                    if (document && document.properties["fina:fiDocumentActionId"] === fiActionId) {
                        me.getViewModel().set({
                            decreeDocument: headOffice.properties['document'],
                            decreeDocumentNumber: headOffice.properties['fina:fiDocumentNumber'],
                            decreeDocumentDate: document.properties['fina:fiDocumentDate'] ? new Date(document.properties['fina:fiDocumentDate']) : null,
                            decreeDocumentValid: headOffice.properties['fina:fiDocumentNumber'] != null && headOffice.properties['fina:fiDocumentNumber'] && headOffice.properties['fina:fiDocumentNumber'].length > 0
                        });
                    } else {
                        me.getViewModel().set({
                            decreeDocumentValid: false
                        });
                    }
                }
            },
            failure: function (response) {
                me.getView().unmask();
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            },
            callback: callback
        });
    },

    initForm: function (dataType) {
        let me = this;
        Ext.suspendLayouts();

        Ext.Ajax.request({
            url: first.config.Config.remoteRestUrl + 'ecm/dictionary/classes/' + dataType.replace(':', '_') + '/properties',
            method: 'GET',
            callback: function (options, success, response) {

                let metaDada = JSON.parse(response.responseText),
                    hiddenProperties = first.view.registration.MetadataUtil.filterAndSortMetaData(dataType, metaDada),
                    view = me.lookupReference('generalInfoForm'),
                    editableProps = first.view.registration.MetadataUtil.getGeneralInfoEditableProperties(dataType, metaDada),
                    editablePropNames = [];
                Ext.each(editableProps, function (prop) {
                    editablePropNames.push(prop.name);
                });
                editablePropNames = (!!editablePropNames && editablePropNames.length > 0) ? editablePropNames : ['fina:fiRegistryLegalFormType', 'fina:fiRegistryName'];

                Ext.each(metaDada, function (i) {
                    if (hiddenProperties.indexOf(i.name) < 0 && editablePropNames.includes(i.name)) {
                        let bindName = i.name.replace(':', '_');

                        let generatedFormItem = first.view.registration.MetadataUtil.getFormItemXType(i, bindName, me.getViewModel());

                        generatedFormItem.labelWidth = 200;
                        generatedFormItem.bind = {
                            value: '{theFi.' + bindName + '}',
                            readOnly: true,
                        };
                        // generatedFormItem.disabled = true;

                        view.add(generatedFormItem);
                    }
                });

                me.getViewModel().set('isFormInitialized', true);
                Ext.resumeLayouts(true);
            }
        });
    },

    onReportCardDownloadClick: function () {
        let existingReportCard = this.getViewModel().get('existingReportCard');
        if (existingReportCard) {
            window.open(first.config.Config.remoteRestUrl + 'ecm/node/' + existingReportCard.id + '/content?attachment=true');
        }
    },

    onFinishRegistrationClick: function () {
        let me = this,
            headOfficeDocumentNumber = me.getViewModel().get('decreeDocument').properties['fina:fiDocumentNumber'],
            headOfficeDocumentDate = me.getViewModel().get('decreeDocument').properties['fina:fiDocumentDate'],
            approveTask = [{
                name: "fwf_fiRegistrationReviewOutcome",
                type: "d:text",
                value: "Approve",
                scope: "local"
            }],
            finishTask = [
                {
                    name: "fwf_fiRegistrationAcceptedRejectedTaskNumberOfOrder",
                    type: "d:text",
                    value: headOfficeDocumentNumber,
                    scope: "local"
                },
                {
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
            Ext.toast(i18n.changeFinishedSuccessfully, i18n.information);
        }, function () {
            me.getView().unmask();
        })
    },

    onGenerateDecreeButtonClick: function () {
        this.generateDecreeDocument(null);
    },

    generateDecreeDocument: function (callback) {
        let me = this,
            vm = this.getViewModel(),
            documentNumber = me.getViewModel().get('decreeDocumentNumber') || null;

        let documentDate = null;
        if (me.getViewModel().get('decreeDocumentDate')) {
            let date = new Date(me.getViewModel().get('decreeDocumentDate'));
            documentDate = Ext.Date.format(date, 'Y-m-d');
        }

        me.getView().mask(i18n.pleaseWait);

        let success = function (response) {
            let doc = JSON.parse(response.responseText);

            me.getViewModel().set('decreeDocument', doc);
            me.getViewModel().set('decreeDocumentValid', true);
            me.generateLetterToTheRepresentative();
        };
        let failure = function (response, message) {
            first.util.ErrorHandlerUtil.showDocumentError(response, message);
        };
        let generateCallback = function () {
            me.getView().unmask();
            if (callback) {
                callback();
            }

        };

        if (!vm.get('headOfficeBranch')) {
            Ext.toast(null, i18n.noHeadOfficesSpecifiedWarning);
            return;
        }

        first.util.DocumentGenerateUtil.generateDocument(vm, 'DECREE', documentNumber, documentDate, vm.get('headOfficeBranch').id, success, failure, generateCallback);
    },

    updateDecreeDocumentDetails: function () {
        let viewModel = this.getViewModel();
        let decreeDocument = viewModel.get('decreeDocument');
        if (decreeDocument) {
            let documentNumber = viewModel.get('decreeDocumentNumber');
            let documentDate = null;
            if (viewModel.get('decreeDocumentDate')) {
                let date = new Date(viewModel.get('decreeDocumentDate'));
                documentDate = Ext.Date.format(date, 'Y-m-d');
            }
            let jsonData = {
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

    onDecreeCardDownloadClick: function () {
        let existingDecreeDocument = this.getViewModel().get('decreeDocument');
        if (existingDecreeDocument) {
            window.open(first.config.Config.remoteRestUrl + 'ecm/node/' + existingDecreeDocument.id + '/content?attachment=true');
        }
    },

    onDecreeCardUploadClick: function () {
        let existingDecreeDocument = this.getViewModel().get('decreeDocument');
        if (existingDecreeDocument) {
            let window = Ext.create({xtype: 'fileUpdateWindow'});
            window.getViewModel().set('nodeId', existingDecreeDocument.id);
            window.show();
        }
    },

    loadLetterToTheRepresentative: function () {
        let me = this,
            theFi = this.getViewModel().get('theFi'),
            lastProcessId = theFi['fina_fiRegistryLastProcessId'],
            actionId = theFi['fina_fiRegistryLastActionId'];

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

    isUploadDecreeDocumentDisabled: function (view, rowIndex, colIndex, item, record) {
        let vm = this.getViewModel();
        return !record.get('properties')['document'] || vm.get('inReview') || !vm.get('isRegistryActionEditor');
    },

    onDownloadDecreeDocumentCLick: function (grid, row, col, btn, event, record) {
        let properties = record.get('properties');
        if (properties && properties['document']) {
            window.open(first.config.Config.remoteRestUrl + 'ecm/node/' + properties['document'].id + '/content?attachment=true');
        }
    },

    afterDecreeGridRender: function () {
        this.loadDecreeGrid();
    },

    loadDecreeGrid: function () {
        let me = this,
            view = this.lookupReference('decreeBranchGridView'),
            theFi = this.getViewModel().get('theFi'),
            store = view.getStore();

        store.proxy.setUrl(first.config.Config.remoteRestUrl + 'ecm/fi/branch/decrees/' + theFi.id+'?filterActive=true');

        store.load({
            callback: function (records) {
                me.bindDecreeGenerationStatus(records);
            }
        });
    },

    onGenerateDecreeClick: function (grid, row, col, btn, event, record) {
        console.log('asd')
        console.log(record)
        let me = this,
            vm = this.getViewModel(),
            documentNumber = record.get('fina_fiDocumentNumber') ? record.get('fina_fiDocumentNumber') : null,
            documentDate = record.get('fina_fiDocumentDate') ? record.get('fina_fiDocumentDate') : null;

        me.getView().mask(i18n.pleaseWait);

        if (documentDate) {
            let date = new Date(documentDate);
            documentDate = Ext.Date.format(date, 'Y-m-d');
        }

        let success = function (response) {
            record.commit();
            me.loadDecreeGrid();
        }, failure = function (response, message) {
            first.util.ErrorHandlerUtil.showDocumentError(response, message);
        }, callback = function () {
            me.getView().unmask();
        };

        first.util.DocumentGenerateUtil.generateDocument(vm, 'DECREE', documentNumber, documentDate, record.id, success, failure, callback);
    },

    beforeDecreeGridCellEdit: function (obj, editor) {
        return !!editor.record.get('document');
    },

    onUploadDecreeDocumentCLick: function (grid, row, col, btn, event, record) {
        let properties = record.get('properties');
        if (properties && properties['document']) {
            let window = Ext.create({xtype: 'fileUpdateWindow'});
            window.getViewModel().set('nodeId', properties['document'].id);
            window.show();
        }
    },

    onGenerateDocumentsButtonClick: function () {
        let me = this,
            vm = this.getViewModel();

        me.getView().mask(i18n.pleaseWait);
        let success = function (response) {
            me.loadDecreeGrid();
            me.generateLetterToTheRepresentative();
        }, failure = function (response, message) {
            first.util.ErrorHandlerUtil.showDocumentError(response, message);
        }, callback = function () {
            me.getView().unmask();
        };

        Ext.Ajax.request({
            method: 'POST',
            jsonData: first.util.DocumentGenerateUtil.getParameterObject(vm, 'DECREE', null, null, null, false, true),
            url: first.config.Config.remoteRestUrl + 'ecm/fi/document/generate',
            success: success,
            failure: failure,
            callback: callback
        });

        // first.util.DocumentGenerateUtil.generateDocument(vm, 'DECREE', null, null, null, success, failure, callback);

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

            if (!decreeDocument) {
                isGeneratedAllDecree = false;
            }

            if (!record.get('fina_fiDocumentNumber') || !record.get('fina_fiDocumentDate')) {
                isGeneratedAllDecree = false;
            }


            if (record.get('properties')['fina:fiRegistryBranchType'] === 'HEAD_OFFICE') {
                me.getViewModel().set({
                    decreeDocument: record.get('properties')['document'],
                    decreeDocumentNumber: record.get('fina_fiDocumentNumber'),
                    decreeDocumentDate: record.get('fina_fiDocumentDate')
                });
            }

        });

        this.getViewModel().set('decreeDocumentValid', isGeneratedAllDecree);
    }

});
