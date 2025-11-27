Ext.define('first.view.registration.task.documentWithdrawal.DocumentWithdrawalDecreeController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.documentWithdrawalDecree',

    init: function () {
        let me = this,
            theFi = this.getViewModel().get('theFi'),
            fiAction = this.getViewModel().get('fiAction'),
            decreeFiAction = {
                fina_fiRegistryActionControlStatusI18n: i18n[fiAction['fina_fiRegistryActionControlStatus']]
            };
        me.getViewModel().set('decreeFiAction', decreeFiAction);

        if (!me.getViewModel().get('isFormInitialized')) {
        } else {
            me.fireEvent('getFiCall', theFi.id, function (obj) {
                me.getViewModel().set('theFi', obj);
            })
        }

        me.loadDecreeDocument();
        me.loadLetterToTheRepresentative();
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

    onReportCardDownloadClick: function () {
        let existingReportCard = this.getViewModel().get('existingReportCard');
        if (existingReportCard) {
            window.open(first.config.Config.remoteRestUrl + 'ecm/node/' + existingReportCard.id + '/content?attachment=true');
        }
    },

    onFinishRegistrationClick: function () {
        let me = this;

        let headOfficeDocumentNumber = me.getViewModel().get('decreeDocument').properties['fina:fiDocumentNumber'];
        let headOfficeDocumentDate = me.getViewModel().get('decreeDocument').properties['fina:fiDocumentDate'];
        let approveTask = [{
            name: "fwf_fiRegistrationReviewOutcome",
            type: "d:text",
            value: "Approve",
            scope: "local"
        }];
        let finishTask = [
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
            Ext.toast('სათავო ფილიალი არ არსებობს', 'შეცდომა');
            return;
        }

        first.util.DocumentGenerateUtil.generateDocument(vm, 'DECREE_CARD_DOCUMENT_WITHDRAWAL', documentNumber, documentDate, vm.get('headOfficeBranch').id, success, failure, generateCallback);
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

    loadLetterToTheRepresentative: function(){
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
