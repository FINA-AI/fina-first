Ext.define('first.view.registration.task.change.ChangeGapCardController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.changeGapCard',

    requires: [
        'first.config.Config',
        'first.util.DocumentGenerateUtil',
        'first.util.ErrorHandlerUtil',
        'first.util.WorkflowHelper',
        'first.view.registration.MetadataUtil'
    ],


    listen: {
        controller: {
            '*': {
                sanctionedPeopleChecklistUpdate: 'getSanctionedPeopleChecklistModifiedStatus',
                reloadGapsGrid: 'reloadGapsGrid'
            }
        }
    },


    init: function () {
        let me = this;
        let gapType = 'fina:fiGap';

        this.getSanctionedPeopleChecklistModifiedStatus(this.getViewModel().get('theFi').fina_fiRegistryLastActionId);

        me.getViewModel().set('FiGapCardController', this);
        me.getViewModel().set('noGapPresented', true);

        this.updateGapCorrectionDeadlineDate();

        Ext.Ajax.request({
            url: first.config.Config.remoteRestUrl + 'ecm/dictionary/classes/' + gapType.replace(':', '_') + '/properties',
            method: 'GET',
            callback: function (options, success, response) {
                let metaDada = JSON.parse(response.responseText),
                    hiddenProperties = first.view.registration.MetadataUtil.filterAndSortMetaData(gapType, metaDada);

                me.getViewModel().set('gapMetaDada', metaDada);
                me.getViewModel().set('gapHiddenProperties', hiddenProperties);
            }
        });


        let store = me.lookupReference('gapGridView').getStore();
        store.on({
            'beforesync': function () {
                me.updateGapLetterStatusChanged();
                me.checkRefuseSelected(store);
            },
            'load': function (store, records) {
                me.checkRefuseSelected(store);
                me.getViewModel().set('noGapPresented', records.length === 0);
            }
        })
    },

    afterRender: function () {
        this.load();
    },

    onShow: function () {
        let store = this.lookupReference('gapGridView').getStore();
        if (store.getCount() === 0) {
            this.onSyncFromQuestionnaires();
        }
    },

    loadDocuments: function () {
        let me = this,
            theFi = me.getViewModel().get('theFi'),
            lastProcessId = theFi.fina_fiRegistryLastProcessId,
            actionId = theFi['fina_fiRegistryLastActionId'],
            isRefusalSelected = this.getViewModel().get('isRefusalSelected'),
            documentType = isRefusalSelected ? 'REFUSAL_LETTER' : 'GAP_LETTER';

        if (this.getViewModel().get('isRefusalSelected')) {
            documentType = this.getViewModel().get('fiAction')['fina_fiChangeFormType'] === 'managementPersonal' ? 'REFUSAL_LETTER' : 'DECREE_CARD_REFUSAL';
        }

        this.getViewModel().set('gapLetter', ''); // To avoid problems in binding
        this.getViewModel().set('refusalDecree', '');

        let controllerStatus = this.getViewModel().get('fiAction')['fina_fiRegistryActionControlStatus'];
        if (isRefusalSelected && controllerStatus === 'ACCEPTED') {
            this.loadRefusalDecree(lastProcessId, actionId);
        }

        Ext.Ajax.request({
            method: 'GET',
            url: first.config.Config.remoteRestUrl + 'ecm/fi/document/' + lastProcessId + '/' + documentType + "/" + actionId,
            success: function (response) {
                let result = JSON.parse(response.responseText);
                if (result && result.length > 0) {
                    me.bindLetterData(result[0]);
                }
            },
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            }
        });
    },

    loadRefusalDecree: function (lastProcessId, actionId) {
        this.getView().mask(i18n.loading);
        let vm = this.getViewModel(),
            me = this,
            documentType = this.getViewModel().get('fiAction')['fina_fiChangeFormType'] === 'managementPersonal' ? 'REFUSAL_LETTER' : 'DECREE_CARD_REFUSAL';

        Ext.Ajax.request({
            method: 'GET',
            url: first.config.Config.remoteRestUrl + 'ecm/fi/document/' + lastProcessId + '/' + documentType + '/' + actionId,
            success: function (response) {
                let result = JSON.parse(response.responseText);
                if (result && result.length > 0) {
                    vm.set('refusalDecree', result[0]);
                    if (result[0]) {
                        vm.set('refusalDecree.documentNumber', result[0].properties['fina:fiDocumentNumber']);
                        vm.set('refusalDecree.documentDate', result[0].properties['fina:fiDocumentDate'] ? new Date(result[0].properties['fina:fiDocumentDate']) : null);
                    }
                    vm.set('isRefusalDecreeGenerated', result[0] !== null && result[0] !== undefined);
                } else {
                    vm.set('isRefusalDecreeGenerated', false);
                }
                me.getView().unmask();
            },
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
                me.getView().unmask();
            }
        });
    },

    reloadGapsGrid: function (srcActionId, viewTypes) {
        if (this.getViewModel().get('theFi')['fina_fiRegistryLastActionId'] === srcActionId && viewTypes.includes(this.getView().xtype)) {
            this.load();
        }
    },

    load: function () {
        let me = this;
        let theFi = this.getViewModel().get('theFi');
        let actionId = theFi['fina_fiRegistryLastActionId'];
        let store = this.lookupReference('gapGridView').getStore();
        store.proxy.setUrl(first.config.Config.remoteRestUrl + 'ecm/node/' + actionId + '/children?relativePath=Gaps&orderBy=createdAt desc');
        store.load({
            callback: function () {
                me.loadDocuments();
            }
        });
    },

    onAddClick: function () {
        this.addOrEdit({});
    },

    onRemoveClick: function (view, recIndex, cellIndex, item, e, record) {
        let me = this;
        let store = this.lookupReference('gapGridView').getStore();
        let storeUrl = store.proxy.getUrl();
        Ext.MessageBox.confirm(i18n.confirm, i18n.removeConfirmQuestion, function (btn) {
            if (btn === 'yes') {
                store.proxy.setUrl(first.config.Config.remoteRestUrl + 'ecm/node/');
                me.getView().mask(i18n.pleaseWait);
                store.remove(record);
                store.sync({
                    callback: function () {
                        store.proxy.setUrl(storeUrl);
                        me.getView().unmask();
                        me.load();
                    }
                });
            }
        });
    },

    onEditClick: function (view, recIndex, cellIndex, item, e, record) {
        let metaDada = this.getViewModel().get('metaDada');

        let data = {};
        Ext.Object.each(record.data.properties, function (key, val) {
            data[key.replace(':', '_')] = val;
        });

        this.addOrEdit(data, record);
    },

    addOrEdit: function (model, record) {
        let me = this;
        let store = me.lookupReference('gapGridView').getStore();
        me.getViewModel().set('store', store);
        me.getViewModel().set('model', model);
        me.getViewModel().set('record', record);
        me.getViewModel().set('relativePath', 'Gaps');
        let window = Ext.create({
            xtype: 'createGapWindow',
            viewModel: {
                data: me.getViewModel().data
            }
        });

        window.show();
    },

    onSyncFromQuestionnaires: function () {
        let me = this;
        let theFi = me.getViewModel().get('theFi');
        let actionId = theFi['fina_fiRegistryLastActionId'];
        let store = me.lookupReference('gapGridView').getStore();
        me.getView().mask(i18n.pleaseWait);

        Ext.Ajax.request({
            method: 'GET',
            url: first.config.Config.remoteRestUrl + 'ecm/fi/gaps/sync/' + theFi.id + '/' + actionId,
            callback: function () {
                store.load();
                me.getView().unmask();
            }
        })
    },

    onGenerateGapLetterClick: function () {
        this.generateGapLetterDocument();
    },

    generateGapLetterDocument: function (callback) {
        let me = this,
            vm = this.getViewModel();

        me.getView().mask(i18n.pleaseWait);
        let documentType = this.getViewModel().get('isRefusalSelected') ? 'REFUSAL_LETTER' : 'GAP_LETTER';
        if (this.getViewModel().get('isRefusalSelected')) {
            documentType = vm.get('fiAction')['fina_fiChangeFormType'] === 'managementPersonal' ? 'REFUSAL_LETTER' : 'DECREE_CARD_REFUSAL';
        }

        this.getHeadOffice(vm.get('theFi').id, function (headOffice) {
                let success = function (response) {
                    if (response.responseText) {
                        let result = JSON.parse(response.responseText);
                        me.getViewModel().set('existingGapCard', result);
                        me.bindLetterData(result);
                    }
                };
                let failure = function (response) {
                    first.util.ErrorHandlerUtil.showErrorWindow(response);
                };
                let generateCallback = function () {
                    me.getView().unmask();
                    if (callback) {
                        callback();
                    }
                };

                first.util.DocumentGenerateUtil.generateDocument(vm, documentType, null, null, headOffice.id, success, failure, generateCallback);
            },
            function () {
                first.util.ErrorHandlerUtil.showErrorWindow(null, i18n.noHeadOfficesSpecifiedWarning);
                me.getView().unmask();
            });
    },

    getTime: function (date) {
        return Ext.Date.format(new Date(date - 0), first.config.Config.timeFormat);
    },

    bindLetterData: function (result) {
        let me = this;
        result.creationTime = i18n.reportCardCreatedAt + " : " + me.getTime(result.createdAt);
        result.modificationTime = i18n.reportCardModifiedAt + " : " + me.getTime(result.modifiedAt);
        let correctionDeadline = this.getViewModel().get('fiAction.fina_fiRegistryActionGapCorrectionDeadline');
        result.correctionDeadline = correctionDeadline ? Ext.Date.format(new Date(correctionDeadline), 'Y-m-d') : null;
        result.correctionDeadlineDays = this.getViewModel().get('fiAction.fina_fiRegistryActionNumDaysToCorrectGaps');
        result.letterNumber = (result.properties['fina:fiDocumentNumber'] ? result.properties['fina:fiDocumentNumber'] : '');
        result.letterDate = (result.properties['fina:fiDocumentDate'] ? Ext.Date.format(new Date(result.properties['fina:fiDocumentDate']), 'Y-m-d') : null);
        let fiDocumentIsLastVersion = result.properties['fina:fiDocumentIsLastVersion'];
        result.isLatestVersion = fiDocumentIsLastVersion;
        result.status = fiDocumentIsLastVersion ? i18n.gapLetterIsLastVersion : i18n.gapLetterIsNotLastVersion;
        me.getViewModel().set('gapLetter', result);
        me.getViewModel().set('gapInfo', result);
    },

    onSanctionedPeopleChecklistReviewClick: function () {
        let me = this;
        //me.getViewModel().set('isDisabled', me.getViewModel().get('fiAction')['fina_fiRegistryActionIsSentToController']);

        let window = Ext.create({
            xtype: 'sanctionedPeopleChecklistWindow',
            viewModel: {
                data: me.getViewModel().data
            }
        });

        window.show();
    },

    showNext: function () {
        let me = this;
        let data = this.getViewModel().get('fiAction');

        if (data['fina_fiRegistryActionAuthor'] === first.config.Config.conf.properties.currentUser.id) {
            let tmpStep = data.fina_fiRegistryActionPreviousStep;
            data.fina_fiRegistryActionPreviousStep = data.fina_fiRegistryActionStep;
            data.fina_fiRegistryActionStep = tmpStep;

            me.getView().mask(i18n.pleaseWait);
            me.getViewModel().get('fiProfileTaskController').updateActionTask(data.id, data,
                function (action, that) {
                    me.getViewModel().set('fiAction', action);
                    that.setActivateTab(action.fina_fiRegistryActionStep);
                },
                null,
                function () {
                    me.getView().unmask();
                });
        } else {
            me.getViewModel().get('fiProfileTaskController').setActivateTab(data.fina_fiRegistryActionPreviousStep);
        }
    },


    onSendGapToControllerClick: function () {
        let me = this;
        let workflowVariables = me.getViewModel().get('workflowVariables');
        let fi = me.getViewModel().get('theFi');
        let fiAction = this.getView().up().getViewModel().get('fiAction');
        let inspectorGroupId = workflowVariables['wf_inspectorGroupId'];
        me.getView().mask(i18n.pleaseWait);

        let callback = function (o, success, response) {
            if (success) {
                fiAction.fina_fiRegistryActionControlStatus = 'REVIEW';
                fiAction.fina_fiRegistryActionStepController = '0';
                fiAction.fina_fiRegistryActionRedactingStatus = 'DECLINED';
                fiAction.fina_fiRegistryActionIsSentToController = true;

                me.getViewModel().get('fiProfileTaskController').updateActionTask(fiAction.id, fiAction, null, null, function (options, success, fiAction) {
                    if (success) {
                        me.getViewModel().set('fiAction', fiAction);
                        me.getViewModel().getParent().set('fiAction', fiAction);
                        me.getView().unmask();
                        Ext.toast(i18n.successfullySentToController);
                        me.lookupReference('gapGridView').getStore().load();
                    } else {
                        console.log('FiAction state can\'t be set!');
                    }
                    me.getViewModel().get('fiProfileTaskController').initRedactorAndController();
                });
            } else {
                me.getView().unmask();
            }
        };

        if (fi['fina_fiRegistryLastInspectorId'] && fi['fina_fiRegistryLastInspectorId'].length > 0) {
            callback(null, true, null);
        } else {
            new first.util.WorkflowHelper().sendToInspector(me.getView(), fi.id, inspectorGroupId, callback, me.getViewModel());
        }


    },

    getSanctionedPeopleChecklistModifiedStatus: function (srcActionId) {
        let vm = this.getViewModel(),
            fi = vm.get('theFi'),
            actionId = fi['fina_fiRegistryLastActionId'];

        if (actionId === srcActionId) {
            this.fireViewEvent('validateSanctionedPeopleChecklistModifiedStatusCall', fi.id, srcActionId, function (isSanctionedPeopleChecklistUpdated) {
                vm.set('isSanctionedPeopleChecklistUpdated', isSanctionedPeopleChecklistUpdated);
            }, function (response) {
                console.log(response);
                Ext.toast(i18n.registryDataValidationProgressError, i18n.error);
            });
        }
    },

    isDisabled: function (view, rowIndex, colIndex, item, record) {
        return record.get('fina_fiGapObject') === "Questionnaire" || !this.getViewModel().get('editMode') || this.getViewModel().get('isAccepted');
    },

    isDisabledRemoveBtn: function () {
        return !this.getViewModel().get('editMode') || this.getViewModel().get('isAccepted');
    },

    onGap: function () {
        let me = this;
        let data = this.getViewModel().get('fiAction');

        data.fina_fiRegistryActionStepController = '4';
        data.fina_fiRegistryActionRedactingStatus = 'DECLINED';

        me.getView().mask(i18n.pleaseWait);
        me.getViewModel().get('fiProfileTaskController').updateActionTask(data.id, data,
            function (action, that) {
                me.getViewModel().set('fiAction', action);
                me.getViewModel().getParent().set('fiAction', action);
                that.setActivateTab(action.fina_fiRegistryActionStepController);
            },
            null,
            function () {
                me.getView().unmask();
            }
        );
    },

    onApprove: function () {
        let me = this;
        let data = this.getViewModel().get('fiAction');

        data.fina_fiRegistryActionControlStatus = 'ACCEPTED';
        data.fina_fiRegistryActionPreviousStep = data.fina_fiRegistryActionStep;
        data.fina_fiRegistryActionStep = '0';

        me.getView().mask(i18n.pleaseWait);


        me.getViewModel().get('fiProfileTaskController').updateActionTask(data.id, data,
            function (action, that) {
                me.getViewModel().set('fiAction', action);
                me.getViewModel().getParent().set('fiAction', action);
            },
            null,
            function () {
                me.getView().unmask();
            }
        );
    },

    onRefuseRegistration: function () {
        let me = this;
        let refusalDecree = this.getViewModel().get('refusalDecree'),
            theFi = me.getViewModel().get('theFi');

        let rejectTask = [{
            name: "fwf_fiRegistrationReviewOutcome",
            type: "d:text",
            value: "Reject",
            scope: "local"
        }];

        let finishTask = [
            {
                name: "fwf_fiRegistrationAcceptedRejectedTaskNumberOfOrder",
                type: "d:text",
                value: refusalDecree.documentNumber,
                scope: "local"
            },
            {
                name: "fwf_fiRegistrationAcceptedRejectedTaskDateOfOrder",
                type: "d:date",
                value: refusalDecree.documentDate,
                scope: "local"
            }
        ];

        //TODO check
        let finishBody = {
            preFinishVariables: rejectTask,
            finishVariables: finishTask,
            newProcessName: null,
        };

        let view = me.getView();
        view.mask(i18n.pleaseWait);
        Ext.Ajax.request({
            method: 'POST',
            url: first.config.Config.remoteRestUrl + 'ecm/fi/' + theFi.id + '/revert/action',
            success: function () {
                me.getViewModel().get('fiProfileTaskController').finishFiTask(me.getViewModel().get('theFi').id, finishBody, function () {
                }, function () {
                    view.unmask();
                })
            }
        });

        Ext.Ajax.request({
            method: 'PUT',
            url: first.config.Config.remoteRestUrl + 'ecm/node/' + refusalDecree.id,
            jsonData: {
                id: refusalDecree.id,
                properties: {
                    'fina:fiDocumentNumber': refusalDecree.letterNumber
                }
            },
            success: function () {
                let vw = me.getViewModel().get('workflowVariables');
                vw.bpm_outcome = "Reject";
                me.getViewModel().set('workflowVariables', vw);
            }
        });
    },

    onMoveProcessToGappedState: function () {
        let me = this;
        let theFi = this.getViewModel().get('theFi');

        let data = this.getViewModel().get('fiAction');

        me.getView().mask(i18n.pleaseWait);


        if (data['fina_fiRegistryActionAuthor'] === first.config.Config.conf.properties.currentUser.id) {
            data.fina_fiRegistryActionStep = '7';
            data.fina_fiRegistryActionControlStatus = 'NONE';
            me.getView().mask(i18n.pleaseWait);
            me.getViewModel().get('fiProfileTaskController').updateActionTask(data.id, data,
                function (action, that) {
                    that.getView().mask(i18n.pleaseWait);
                    me.getViewModel().set('fiAction', action);
                    that.setActivateTab(action.fina_fiRegistryActionStep);
                    me.getViewModel().set('fiRegistryStatus', 'IN_PROGRESS');
                    me.getViewModel().set('fiAction', data);
                    theFi['fina:fiRegistryStatus'] = 'IN_PROGRESS';
                    me.getViewModel().set('theFi', theFi);
                    me.fireEvent('onActionTaskStepChange', me.getViewModel().get('theFi').id);
                    me.changeRegistryAndControllerStatus("GAP", function (response) {
                        Ext.Ajax.request({
                            method: 'POST',
                            url: first.config.Config.remoteRestUrl + 'ecm/notification/' + me.getViewModel().get('fiAction').id +
                                '?fiRegistryId=' + me.getViewModel().get('theFi').id + '&userLogin=' + first.config.Config.conf.properties.currentUser.id + '&isPausedOnGap=true',

                            success: function (response) {
                                me.getView().unmask();
                                me.fireEvent('refreshProfileView', me.getViewModel().get('theFi').id)
                            }
                        });
                    });
                },
                null,
                function () {
                    me.getView().unmask();
                });

        }
        me.updateGapLetter();
    },

    updateGapLetter: function () {
        let me = this;
        let gapLetter = this.getViewModel().get('gapLetter'),
            fiAction = this.getViewModel().get('fiAction');
        me.getView().mask(i18n.pleaseWait);
        Ext.Ajax.request({
            method: 'PUT',
            url: first.config.Config.remoteRestUrl + 'ecm/node/' + gapLetter.id,
            jsonData: {
                id: gapLetter.id,
                properties: {
                    'fina:fiDocumentNumber': gapLetter.letterNumber,
                    'fina:fiDocumentCorrectionDeadline': fiAction.fina_fiRegistryActionGapCorrectionDeadline,
                    'fina:fiDocumentCorrectionDeadlineDays': fiAction.fina_fiRegistryActionNumDaysToCorrectGaps,
                    'fina:fiDocumentDate': gapLetter.letterDate
                }
            },
            success: function () {

            },
            callback: function (response) {
                let result = response.jsonData;
                if (response) {
                    me.bindLetterData(result);
                }
                me.getView().unmask();
            }
        });
    },

    updateGapCorrectionDeadlineDate: function () {
        let vm = this.getViewModel(),
            fiAction = vm.get('fiAction');

        if (!fiAction.fina_fiRegistryActionGapCorrectionDeadline && fiAction.fina_fiRegistryActionNumDaysToCorrectGaps) {
            let date = new Date();
            date.setDate(date.getDate() + fiAction.fina_fiRegistryActionNumDaysToCorrectGaps);
            fiAction.fina_fiRegistryActionGapCorrectionDeadline = date;
        } else if (fiAction.fina_fiRegistryActionGapCorrectionDeadline) {
            fiAction.fina_fiRegistryActionGapCorrectionDeadline = Ext.Date.format(new Date(fiAction.fina_fiRegistryActionGapCorrectionDeadline), 'Y-m-d');
        }
    },

    onGapCorrectionDeadlineDateSelect: function (dateField, newValue) {
        if (newValue) {
            let now = new Date();
            const timeDiff = newValue - now;
            if (timeDiff > 0) {
                let numDays = Math.ceil(timeDiff / 86400000); // 1d = 86400000ms;
                this.getViewModel().get('fiAction').fina_fiRegistryActionNumDaysToCorrectGaps = numDays;
                let gapLetter = this.getViewModel().get('gapLetter');
                if (gapLetter) {
                    gapLetter.properties['fina:fiDocumentCorrectionDeadline'] = newValue;
                    gapLetter.properties['fina:fiDocumentCorrectionDeadlineDays'] = numDays;
                }
            }
        }
    },

    changeRegistryAndControllerStatus: function (registryStatus, callback) {
        let me = this,
            theFi = me.getViewModel().get('theFi');
        Ext.Ajax.request({
            method: 'PUT',
            url: first.config.Config.remoteRestUrl + 'ecm/node/' + theFi.id,
            jsonData: {
                properties: {
                    'fina:fiRegistryStatus': registryStatus
                }
            },
            success: function (response) {
                callback(response);
            }
        });
    },


    updateGapLetterStatusChanged: function () {
        let gapLetter = this.getViewModel().get('gapLetter');
        if (gapLetter) {
            gapLetter.isLatestVersion = false;
            gapLetter.status = i18n.gapLetterIsNotLastVersion;
            this.getViewModel().set('gapLetter', gapLetter);
            this.getViewModel().set('gapInfo', gapLetter);
        }
    },

    onDownloadGapLetterClick: function () {
        let gapLetter = this.getViewModel().get('gapLetter');
        if (gapLetter) {
            window.open(first.config.Config.remoteRestUrl + 'ecm/node/' + gapLetter.id + '/content?attachment=true');
        }
    },

    checkRefuseSelected: function (store) {
        let refusalIndex = store.findBy(function (record) {
            return record.data.properties['fina:fiGapObject'] === 'Refuse';
        });
        this.getViewModel().set('isRefusalSelected', refusalIndex >= 0);
        this.getViewModel().set('finishButtonText', (refusalIndex >= 0 ? i18n.registrationRefusal : i18n.makeGap));
        this.getViewModel().set('isGapsCreated', store.data.length > 0);
    },

    onUploadGapLetterClick: function () {
        let gapLetter = this.getViewModel().get('gapLetter');
        if (gapLetter) {
            let window = Ext.create({xtype: 'fileUpdateWindow'});
            window.getViewModel().set('nodeId', gapLetter.id);
            window.show();
        }
    },

    updateRefusalDecreeDetails() {
        let viewModel = this.getViewModel();
        let decreeDocument = viewModel.get('refusalDecree');
        if (decreeDocument) {
            let documentNumber = viewModel.get('refusalDecree.documentNumber');
            let documentDate = viewModel.get('refusalDecree.documentDate');
            if (documentDate) {
                let date = new Date(viewModel.get('refusalDecree.documentDate'));
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

    onGenerateRefusalDecreeButtonClick: function () {
        let me = this,
            vm = this.getViewModel(),
            documentNumber = me.getViewModel().get('refusalDecree.documentNumber') || null;

        let documentDate = null;
        if (me.getViewModel().get('refusalDecree.documentDate')) {
            let date = new Date(me.getViewModel().get('refusalDecree.documentDate'));
            documentDate = Ext.Date.format(date, 'Y-m-d');
        }

        me.getView().mask(i18n.pleaseWait);

        let success = function (response) {
            let doc = JSON.parse(response.responseText);
            doc.documentNumber = doc.properties['fina:fiDocumentNumber'];
            doc.documentDate = doc.properties['fina:fiDocumentDate'] ? Ext.Date.format(new Date(doc.properties['fina:fiDocumentDate']), 'Y-m-d') : null;

            me.getViewModel().set('refusalDecree', doc);
            me.getViewModel().set('isRefusalDecreeGenerated', true);
        };

        let failure = function (response, message) {
            first.util.ErrorHandlerUtil.showDocumentError(response, message);
        };

        let generateCallback = function () {
            me.getView().unmask();
        };

        var documentType = vm.get('fiAction')['fina_fiChangeFormType'] === 'managementPersonal' ? 'REFUSAL_LETTER' : 'DECREE_CARD_REFUSAL';

        this.getHeadOffice(vm.get('theFi').id, function (headOffice) {
                first.util.DocumentGenerateUtil.generateDocument(vm, documentType, documentNumber, documentDate, headOffice.id, success, failure, generateCallback);
            },
            function () {
                first.util.ErrorHandlerUtil.showErrorWindow(null, i18n.noHeadOfficesSpecifiedWarning);
                me.getView().unmask();
                return;
            });
    },

    getHeadOffice: function (fiRegistryId, success, failure) {
        Ext.Ajax.request({
            method: 'GET',
            url: first.config.Config.remoteRestUrl + 'ecm/fi/' + fiRegistryId + '/headOffice',
            success(response) {
                let headOffice = JSON.parse(response.responseText);
                if (success) {
                    success(headOffice)
                }
            },
            failure() {
                if (failure) {
                    failure();
                }
            }
        });
    },

    onRefusalDecreeCardDownloadClick: function () {
        let existingDecreeDocument = this.getViewModel().get('refusalDecree');
        if (existingDecreeDocument) {
            window.open(first.config.Config.remoteRestUrl + 'ecm/node/' + existingDecreeDocument.id + '/content?attachment=true');
        }
    },

    onRefusalDecreeCardUploadClick: function () {
        let existingDecreeDocument = this.getViewModel().get('refusalDecree');
        if (existingDecreeDocument) {
            let window = Ext.create({xtype: 'fileUpdateWindow'});
            window.getViewModel().set('nodeId', existingDecreeDocument.id);
            window.show();
        }
    }

});
