Ext.define('first.view.registration.task.branchChange.BranchChangeDecreeCardController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.branchChangeDecreeCard',

    requires: [
        'first.config.Config',
        'first.util.DocumentGenerateUtil',
        'first.util.ErrorHandlerUtil'
    ],

    init: function () {
        this.callParent();
        this.load();
        let fiAction = this.getViewModel().get('fiAction');
        this.getViewModel().set('branchesCorrection', {
            deadline: new Date(fiAction.fina_fiRegistryActionGapCorrectionDeadline),
            deadlineDays: fiAction.fina_fiRegistryActionNumDaysToCorrectGaps
        });
        this.getViewModel().set('sendToControllerEnable', !!fiAction['fina_fiSendToControllerEnable']);
        this.loadLetterToTheRepresentative();
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
                me.bindDecreeGenerationStatus(records);
            }
        });

        grid.on('edit', function (editor, e) {
            if (e.record.dirty) {
                if (!first.util.FiProfileUtil.canUserAmend(me.getViewModel())) {
                    e.record.reject();
                    return;
                }
                me.updateDecreeDocument(store, e.record);
            }
        });
    },

    updateDecreeDocument: function (store, record) {
        let document = record.get('properties')['fina:fiBranchesChangeFinalStatus'] !== 'GAP' ?
            record.get('properties')['fina:fiBranchDecreeDocument'] : record.get('properties')['fina:fiDocument'];

        if (document) {
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
                url: first.config.Config.remoteRestUrl + 'ecm/node/' + document.id,
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
        let isGeneratedAllDecree = true,
            isGapSelected = false,
            sendToControllerEnabled = this.getViewModel().get('sendToControllerEnable');
        Ext.each(records, function (record) {
            let properties = record.get('properties'),
                branchChangeFinalStatus = record.get('fina_fiBranchesChangeFinalStatus'),
                document = branchChangeFinalStatus !== 'GAP' ? properties['fina:fiBranchDecreeDocument'] : properties['fina:fiDocument'];

            if (branchChangeFinalStatus === 'GAP') {
                isGapSelected = true;
            }

            //If sending to controller is not necessary, decree need not be generated for accepted changes
            if (!sendToControllerEnabled && (branchChangeFinalStatus !== 'GAP')) {
                return;
            }

            if (!document) {
                isGeneratedAllDecree = false;
                return;
            }

            if (!record.get('fina_fiDocumentNumber') || (branchChangeFinalStatus !== 'GAP' && !record.get('fina_fiDocumentDate'))) {
                isGeneratedAllDecree = false;
            }
        });

        this.getViewModel().set('isAllDecreeGenerated', isGeneratedAllDecree);
        this.getViewModel().set('isGapSelected', isGapSelected);
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

    onDownloadDocumentClick: function (grid, row, col, btn, event, record) {
        let properties = record.get('properties');
        if (properties && properties['fina:fiDocument']) {
            this.downloadDocument(properties['fina:fiDocument'].id);
        }
    },

    onDownloadDecreeCardClick: function (grid, row, col, btn, event, record) {
        let properties = record.get('properties'),
            branchChangeStatus = properties['fina:fiBranchesChangeFinalStatus'],
            document = (branchChangeStatus === 'GAP') ? properties['fina:fiDocument'] : properties['fina:fiBranchDecreeDocument'];

        if (properties && document) {
            this.downloadDocument(document.id);
        }
    },

    downloadDocument: function (documentId) {
        if (documentId) {
            window.open(first.config.Config.remoteRestUrl + 'ecm/node/' + documentId + '/content?attachment=true');
        }
    },

    onGenerateDocumentClick: function (grid, row, col, btn, event, record) {
        let recordFinalStatus = record.get('fina_fiBranchesChangeFinalStatus');
        switch (recordFinalStatus) {
            case 'ACCEPTED':
            case 'DECLINED':
                this.onGenerateDecreeCardClick(record);
                break;
            case 'GAP':
                this.onGenerateGapLetterClick(record);
                break;
            default:
                break;
        }
    },

    onGenerateDecreeCardClick: function (record) {
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
        if (record.get('fina_fiBranchesChangeFinalStatus') === 'DECLINED') {
            if (vm.get('theFi')['fina_fiRegistryHasRefusalDocuments']) {
                documentType = 'DECREE_CARD_REFUSAL';
            } else {
                documentType = 'REFUSAL_LETTER';
            }
        } else {
            documentType = 'DECREE';
        }

        let success = function (response) {
            let result = JSON.parse(response.responseText);
            me.updateChangeNode(record, result.id);

            if(documentType === "DECREE_CARD_REFUSAL") {
                me.generateLetterToTheRepresentative();
            } else if (documentType === "DECREE") {
                me.generateLetterToTheRepresentative();
            }
        };

        first.util.DocumentGenerateUtil.generateDocument(vm, documentType, documentNumber, documentDate, record.get('fina_fiBranchesChangeReferenceId'), success, failure, callback);
    },

    onGenerateGapLetterClick: function (record) {
        let me = this,
            vm = this.getViewModel(),
            documentNumber = record.get('fina_fiDocumentNumber');

        if (!record.get('fina_fiBranchesChangeFinalStatus')) {
            Ext.toast("ფილიალის სტატუსის შეყვანა აუცილებელია", "შეცდომა");
            return;
        }

        me.getView().mask(i18n.pleaseWait);

        let documentType = 'GAP_LETTER';

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

        first.util.DocumentGenerateUtil.generateDocument(vm, documentType, documentNumber, null, record.get('fina_fiBranchesChangeReferenceId'), success, failure, callback, true);

    },

    updateChangeNode: function (record, documentId) {
        let me = this,
            properties = record.get('properties');
        if (properties['fina:fiBranchesChangeFinalStatus'] === 'GAP') {
            properties['fina:fiBranchesChangeDocumentReferenceId'] = documentId;
        } else {
            properties['fina:finaBranchDecreeDocumentReferenceId'] = documentId;
        }

        delete properties['fina:fiRegistryBranch'];
        delete properties['fina:fiDocument'];
        delete properties['fina:fiBranchDecreeDocument'];

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

    onFinishChangeBranchClick: function () {
        let me = this,
            vm = this.getViewModel(),
            grid = this.lookupReference("branchChangesGridViewFinal"),
            gaps = [];

        grid.getStore().each(function (item) {
            if (item.get('fina_fiBranchesChangeFinalStatus') === 'GAP') {
                gaps.push(item);
            }
        });

        if (gaps.length > 0) {
            let deadline = vm.get('branchesCorrection')['deadline'].toISOString(),
                deadlineDays = vm.get('branchesCorrection')['deadlineDays'];

            me.getView().mask(i18n.pleaseWait);
            Ext.Ajax.request({
                method: 'POST',
                url: first.config.Config.remoteRestUrl + 'ecm/fi/branchChanges/' + vm.get('fiAction').id
                    + '/finish?relativePath=Performed Changes&gapCorrectionDeadline=' + deadline
                    + "&gapCorrectionDeadlineDays=" + deadlineDays,
                success: function (response) {
                    let data = vm.get('fiAction');
                    data.fina_fiRegistryActionStep = '6';
                    data.fina_fiRegistryActionGapCorrectionDeadline = deadline;
                    data.fina_fiRegistryActionNumDaysToCorrectGaps = deadlineDays;

                    vm.get('fiProfileTaskController').updateActionTask(data.id, data,
                        function (action, that) {
                            vm.set('fiAction', action);
                            me.updateFiRegistryStatus(vm.get('theFi').id, 'GAP', function (response) {
                                vm.set('theFi.fina_fiRegistryStatus', response['properties']['fina:fiRegistryStatus']);
                                me.fireEvent('refreshProfileView', vm.get('theFi').id);
                            });
                        },
                        null,
                        function () {
                            me.getView().unmask();
                        });
                },
                failure: function (response, message) {
                    me.getView().unmask();
                    first.util.ErrorHandlerUtil.showDocumentError(response, message);
                }
            });
        } else {
            this.endBranchChangeProcess();
        }
    },

    updateFiRegistryStatus: function (id, status, successCallback) {
        Ext.Ajax.request({
            method: 'PUT',
            url: first.config.Config.remoteRestUrl + 'ecm/fi/' + id,
            jsonData: {
                'fina:fiRegistryStatus': status
            },
            success: function (response) {
                if (successCallback) {
                    successCallback(JSON.parse(response.responseText));
                }
            },
            failure(response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            }
        })
    },

    endBranchChangeProcess: function () {
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
        };

        this.getView().mask(i18n.pleaseWait);
        me.getViewModel().get('fiProfileTaskController').finishFiTask(me.getViewModel().get('theFi').id, finishBody, function () {
            Ext.toast(i18n.branchChangeProcessFinishSuccess, i18n.information);
        }, function () {
            me.getView().unmask();
        })

    },

    isDecreeGridReportCardDisabled: function (view, rowIndex, colindex, item, record) {
        let properties = record.get('properties');
        return !properties || !properties['fina:fiDocument'];
    },

    isGenerateDecreeCardDisabled: function (view, rowIndex, colindex, item, record) {
        let vm = this.getViewModel();

        if (!vm.get('isRegistryActionEditor')) {
            return true;
        }

        let fiAction = vm.get('fiAction'),
            branchChangeFinalStatus = record.get('fina_fiBranchesChangeFinalStatus');

        return !fiAction['fina_fiSendToControllerEnable'] && (branchChangeFinalStatus !== "GAP");
    },

    onViewClick: function (view, recIndex, cellIndex, item, e, record) {
        let tabName = 'Branches',
            fiProfileController = this.getViewModel().get('fiProfileController');

        fiProfileController.setActiveTabAndSelectRecord(tabName, record.get('fina_fiBranchesChangeReferenceId'));
    },

    isUploadDecreeCardDisabled: function (view, rowIndex, colindex, item, record) {
        let properties = record.get('properties');
        let branchChangeStatus = properties['fina:fiBranchesChangeFinalStatus'],
            document = (branchChangeStatus === 'GAP') ? properties['fina:fiDocument'] : properties['fina:fiBranchDecreeDocument'];

        return !(properties && document && document.id) || !this.getViewModel().get('isRegistryActionEditor');
    },

    onUploadDecreeCardClick: function (grid, row, col, btn, event, record) {
        let properties = record.get('properties'),
            branchChangeStatus = properties['fina:fiBranchesChangeFinalStatus'],
            document = (branchChangeStatus === 'GAP') ? properties['fina:fiDocument'] : properties['fina:fiBranchDecreeDocument'];

        if (properties && document) {
            let window = Ext.create({xtype: 'fileUpdateWindow'});
            window.getViewModel().set('nodeId', document.id);
            window.show();
        }
    },

    beforeCellEdit: function (obj, editor) {
        let properties = editor.record.get('properties'),
            enableResult = false;

        if (properties) {
            let document = properties['fina:fiBranchesChangeFinalStatus'] === 'GAP' ? properties['fina:fiDocument'] : properties['fina:fiBranchDecreeDocument'];
            enableResult = document && document.id;
        }

        if (enableResult && this.getViewModel().get('isRegistryActionEditor')) {
            return true;
        }

        return false;
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

    onGapCorrectionDeadlineSelect: function (dateField, newValue) {
        if (newValue) {
            let now = new Date();
            const timeDiff = newValue - now;
            if (timeDiff > 0) {
                let numDays = Math.ceil(timeDiff / 86400000); // 1d = 86400000ms;
                this.getViewModel().set('branchesCorrection.deadlineDays', numDays);
            }
        }
    }

});
