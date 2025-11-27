Ext.define('first.view.new.dashboard.wizard.FiTaskWizardController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fiTaskWizard',

    requires: [
        'first.config.Config',
        'first.store.registration.FiRegistry',
        'first.util.ErrorHandlerUtil',
        'first.util.WorkflowHelper',
        'first.view.registration.FiRegistrationValidator'
    ],

    /**
     * Called when the view is created
     */
    init: function () {

        let me = this,
            title = '',
            firstCardInfoText = '',
            fiProcessType = this.getViewModel().get('processType');

        me.setWindowHeight(fiProcessType)

        switch (fiProcessType) {
            case 'FI_REGISTRATION':
                title = i18n.dashboardWizardTasksFiRegistrationTitle;
                firstCardInfoText = i18n.dashboardWizardTasksFiRegistrationFirstCardInfoText;

                me.getViewModel().set('task.variable.fwf_fiRegFiIsAddressSame', true);

                // legal address combo
                let legalAddressRegionCombo = this.lookupReference('legalAddressRegionCombo');
                legalAddressRegionCombo.setStore({
                    type: 'regionalStructureStore',
                    autoLoad: true,
                    enableKeyEvents: true,
                    proxy: {
                        url: first.config.Config.remoteRestUrl + 'ecm/node/-root-/children' + '?relativePath=' + first.config.Config.conf.properties.regionalStructureFolderPath + "&orderBy=createdAt"
                    }
                });

                // factualaddress combo
                let factualAddressRegionCombo = this.lookupReference('factualAddressRegionCombo');
                factualAddressRegionCombo.setStore({
                    type: 'regionalStructureStore',
                    autoLoad: true,
                    enableKeyEvents: true,
                    proxy: {
                        url: first.config.Config.remoteRestUrl + 'ecm/node/-root-/children' + '?relativePath=' + first.config.Config.conf.properties.regionalStructureFolderPath + "&orderBy=createdAt"
                    }
                });
                break;
            case 'FI_CHANGE':
                title = i18n.dashboardWizardTasksFiChangeTitle;
                firstCardInfoText = i18n.dashboardWizardTasksFiChangeFirstCardInfoText;
                break;
            case 'FI_DISABLE':
                title = i18n.dashboardWizardTasksFiDisableTitle;
                firstCardInfoText = i18n.dashboardWizardTasksFiDisableFirstCardInfoText;
                break;
            default:
                break;
        }

        me.getViewModel().set('title', title);
        me.getViewModel().set('firstCardInfoText', '<h2>' + firstCardInfoText + '</h2>');
    },

    showNext: function () {
        this.doCardNavigation(1);
    },

    showPrevious: function (btn) {
        this.doCardNavigation(-1);
    },

    doCardNavigation: function (incr) {
        let me = this,
            fiProcessType = me.getViewModel().get('processType'),
            view = me.getView(),
            cardView = me.lookupReference('fiProcessWizardCard'),
            l = cardView.getLayout();

        view.mask(i18n.pleaseWait);

        me.setValidationMessage(null);

        if (incr === 1 && l.activeItem.reference !== 'fi-process-card-0') { // last step
            me.startTask();
        } else if (incr === 1) { // first card
            let identityIdentificationCallback = function (initNextStep, errorMessage) {
                if (initNextStep) {
                    let nextActiveItemIndex = -1;
                    switch (fiProcessType) {
                        case 'FI_REGISTRATION':
                            nextActiveItemIndex = 1;
                            break;
                        case 'FI_CHANGE':
                            nextActiveItemIndex = 2;
                            break;
                        case 'FI_DISABLE':
                            nextActiveItemIndex = 3;
                            break;
                        default:
                            break;
                    }

                    if (nextActiveItemIndex > 0) {
                        me.getViewModel().set('isPreviousButtonDisabled', false);
                        me.getViewModel().set('isNextButtonDisabled', false);

                        l.setActiveItem(nextActiveItemIndex);
                    }
                } else {
                    me.setValidationMessage(errorMessage);
                }
                view.unmask();
            };

            let firstCardValidationCallback = function (isValid, errorMessage) {
                if (isValid) {
                    let identity = me.getViewModel().get('task.variable.fwf_fiStartTaskBaseFiIdentity'),
                        fiTypeCombo = me.lookupReference('fiTypeCombo').getStore();

                    me.checkFiByIdentity(identity, fiProcessType, fiTypeCombo, identityIdentificationCallback,);
                } else {
                    me.setValidationMessage(errorMessage);
                    view.unmask();
                }
            }

            me.isFirstCardValid(l.activeItem, firstCardValidationCallback);

        } else {
            me.getViewModel().set('isPreviousButtonDisabled', true);
            me.getViewModel().set('isNextButtonDisabled', false);

            l.setActiveItem(0);

            view.unmask();
        }
    },

    isFirstCardValid: function (activeForm, validationCallback) {
        if (!activeForm.isValid()) {
            validationCallback(false, i18n.formIsNotValid);
        } else {
            let identity = this.getViewModel().get('task.variable.fwf_fiStartTaskBaseFiIdentity');
            if (!identity || !(identity.length === 9 || identity.length === 11)) {
                validationCallback(false, i18n.dashboardFiProcessWizardValidationInvalidIdentity);
                return;
            }

            validationCallback(true, null);
        }
    },

    fiDisableProcessTypeComboChangeListener: function (cmp, newValue, oldValue) {
        let me = this,
            disableReasonCombo = me.lookupReference('fiDisableProcessDisableReasonCombo'),
            isDisableBranch = (newValue === 'DISABLE_BRANCH');

        if (isDisableBranch) {
            me.getViewModel().set('fiDisableProcessDisableReason', null);
        }

        disableReasonCombo.allowBlank = isDisableBranch;
        disableReasonCombo.setDisabled(isDisableBranch);
    },

    fiChangeProcessFiComboChangeListener: function (cmp, newValue, oldValue) {
        let me = this,
            fChangerProcessFiChangeTypeCombo = me.lookupReference('changeProcessFiChangeTypeCombo'),
            changeTypeStoreData = [{
                value: 'ADD_BRANCH',
                text: i18n.addBranch
            }, {
                value: 'managementPersonal',
                text: i18n.managementPersonal
            }, {
                value: 'organizationalForm',
                text: i18n.organizationalForm
            }, {
                value: 'legalAddress',
                text: i18n.legalAddress
            }];

        fChangerProcessFiChangeTypeCombo.setDisabled(true);

        if (cmp.getSelectedRecord()) {
            let fiTypeCode = cmp.getSelectedRecord().get('fiTypeCode');
            switch (fiTypeCode) {
                case 'LE':
                case 'FEX':
                    changeTypeStoreData.unshift({
                        value: 'EDIT_BRANCH',
                        text: i18n.editBranch
                    });
                    break;
            }

            fChangerProcessFiChangeTypeCombo.setDisabled(false);
        }

        fChangerProcessFiChangeTypeCombo.getStore().setData(changeTypeStoreData);

    },

    fiDisableProcessFiComboChangeListener: function (cmp, newValue, oldValue) {
        let me = this,
            fiDisableProcessDisableReasonCombo = me.lookupReference('fiDisableProcessDisableReasonCombo'),
            disableReasonStoreData = [];

        fiDisableProcessDisableReasonCombo.setDisabled(true);

        if (cmp.getSelectedRecord()) {
            let fiTypeCode = cmp.getSelectedRecord().get('fiTypeCode');
            switch (fiTypeCode) {
                case 'FEX':
                    disableReasonStoreData = [{
                        value: 'basedOnApplication',
                        text: i18n.basedOnApplication
                    }, {
                        value: 'basedOnCheckup',
                        text: i18n.basedOnCheckup
                    }, {
                        value: 'PREVENT_REGISTRATION_2_YEARS',
                        text: i18n.PREVENT_REGISTRATION_2_YEARS
                    }, {
                        value: 'other',
                        text: i18n.other
                    }];
                    break;
                case 'MFO':
                case 'CRU':
                case 'LE':
                    disableReasonStoreData = [{
                        value: 'basedOnApplication',
                        text: i18n.basedOnApplication
                    }, {
                        value: 'basedOnCheckup',
                        text: i18n.basedOnCheckup
                    }, {
                        value: 'other',
                        text: i18n.other
                    }];
                    break;
            }

            if (me.getViewModel().get('fiDisableProcessType') === 'DISABLE_FI') {
                fiDisableProcessDisableReasonCombo.setDisabled(false);
            }
        }

        fiDisableProcessDisableReasonCombo.getStore().setData(disableReasonStoreData);

    },

    legalAddressRegionComboChangeListener: function (cmp, newValue, oldValue) {
        let cityCmp = this.lookupReference('legalAddressCityCombo'),
            store = cityCmp.getStore();

        if (newValue !== null && oldValue !== null && newValue !== oldValue) {
            cityCmp.clearValue()
        }
        if (cmp.getSelection()) {
            store.getProxy().url = first.config.Config.remoteRestUrl + 'ecm/node/' + cmp.getSelection().id + '/children';
            store.load(function (records) {
                if (store.getCount() === 1) {
                    cityCmp.select(records[0])
                }
            })
        } else {
            store.clearData()
        }
    },

    factualAddressSameComboChangeListener: function (cmp, newValue, oldValue) {
        this.getView().mask(i18n.pleaseWait);

        let factualRegion = this.lookupReference('factualAddressRegionCombo'),
            factualCity = this.lookupReference('factualAddressCityCombo'),
            factualAddress = this.lookupReference('factualAddressAddress');

        factualRegion.allowBlank = newValue;
        factualCity.allowBlank = newValue;
        factualAddress.allowBlank = newValue;

        this.getView().unmask();
    },

    factualAddressAddressRegionComboChangeListener: function (cmp, newValue, oldValue) {
        let cityCmp = this.lookupReference('factualAddressCityCombo'),
            store = cityCmp.getStore();

        if (newValue !== null && oldValue !== null && newValue !== oldValue) {
            cityCmp.clearValue()
        }
        if (cmp.getSelection()) {
            store.getProxy().url = first.config.Config.remoteRestUrl + 'ecm/node/' + cmp.getSelection().id + '/children';
            store.load(function (records) {
                if (store.getCount() === 1) {
                    cityCmp.select(records[0])
                }
            })
        } else {
            store.clearData()
        }
    },

    setValidationMessage: function (validationMessage) {
        this.getViewModel().set('validationMessage', validationMessage ? '* ' + validationMessage : null);
    },

    checkFiByIdentity: function (identity, fiProcessType, fiTypeComboStore, callback) {
        let me = this,
            fiRegistryStore = Ext.create('first.store.registration.FiRegistry');
        fiRegistryStore.proxy.setHeaders({'Accept-Language': '*'});
        fiRegistryStore.proxy.setExtraParam('filter', JSON.stringify({
            identity: identity
        }));

        fiTypeComboStore.clearFilter();

        switch (fiProcessType) {
            case 'FI_REGISTRATION':

                fiRegistryStore.load(function (records) {

                    // detect individual entrepreneur
                    let isIndividualEntrepreneur = (identity.length === 11),
                        legalFormTypeCombo = me.lookupReference('legalFormTypeCombo');
                    me.getViewModel().set('task.variable.fwf_fiRegLegalFormType', isIndividualEntrepreneur ? 'individualEntrepreneur' : null);
                    legalFormTypeCombo.setDisabled(isIndividualEntrepreneur);

                    if (isIndividualEntrepreneur) {
                        legalFormTypeCombo.getStore().setData([{
                            value: 'individualEntrepreneur',
                            text: i18n.individualEntrepreneur
                        }]);
                    } else {
                        legalFormTypeCombo.getStore().setData([{
                            value: 'ltd',
                            text: i18n.ltd
                        }, {
                            value: 'joinsStockCompany',
                            text: i18n.joinsStockCompany
                        }, {
                            value: 'solidaritySociety',
                            text: i18n.solidaritySociety
                        }, {
                            value: 'commandantSociety',
                            text: i18n.commandantSociety
                        }, {
                            value: 'cooperative',
                            text: i18n.cooperative
                        }]);
                    }

                    if (fiRegistryStore.getCount() > 0) {
                        Ext.Msg.confirm(i18n.warning, Ext.String.format(i18n.fiCopyMessageWarning, records[0].get('code')), function (button) {
                            if (button === 'yes') {
                                me.initExistedFiData(records[0]);
                            } else {
                                me.getView().unmask();
                            }
                        });

                        let excludeFiTypeCodes = first.view.registration.FiRegistrationValidator.getFiRegistrationExcludeTypesByExistingRecords(records);

                        if (fiTypeComboStore.getCount() === excludeFiTypeCodes.length) {
                            callback(false, i18n.dashboardFiProcessWizardValidationRegistrationIsNotPermitted);
                        } else {
                            fiTypeComboStore.filterBy(function (rec, id) {
                                return !Ext.Array.contains(excludeFiTypeCodes, rec.get('code'));
                            });

                            let isFiTypeStoreEmpty = (fiTypeComboStore.getCount() === 0);
                            callback(!isFiTypeStoreEmpty, isFiTypeStoreEmpty ? i18n.dashboardFiProcessWizardValidationRegistrationIsNotPermitted : null);
                        }
                    } else {
                        callback(true, null);
                    }
                });
                break;
            case 'FI_DISABLE':
            case 'FI_CHANGE':

                fiRegistryStore.load(function (records) {

                    let storeCount = fiRegistryStore.getCount();
                    if (storeCount === 0) {
                        callback(false, i18n.dashboardFiProcessWizardValidationFiWithIdentityDoesNotExist);
                    } else {
                        let fiComboStoreData = [];
                        Ext.each(records, function (record) {
                            let fiRegistryStatus = record.get('status'),
                                fiRegistryActionType = record.get('actionType'),
                                isNotFiRegistryAvailableForProcess = !me.isUserPermitToStartProcess();

                            if (!isNotFiRegistryAvailableForProcess) {

                                if (fiRegistryStatus === 'IN_PROGRESS' || fiRegistryStatus === 'GAP') {
                                    isNotFiRegistryAvailableForProcess = true;
                                }

                                if (!isNotFiRegistryAvailableForProcess) {
                                    switch (fiRegistryActionType) {
                                        case 'REGISTRATION':
                                            isNotFiRegistryAvailableForProcess = fiRegistryStatus !== 'ACCEPTED';
                                            break;
                                        case 'CANCELLATION':
                                            isNotFiRegistryAvailableForProcess = fiRegistryStatus === 'ACCEPTED';
                                            break;
                                    }
                                }
                            }

                            if (!isNotFiRegistryAvailableForProcess) {
                                fiComboStoreData.push({
                                    fiRegistryId: record.id,
                                    fiTypeCode: record.get('fiTypeCode'),
                                    value: record.get('code'),
                                    text: i18n[record.get('legalFormType')] + ' ' + record.get('name') + ' | ' + record.get('code') + ' | ' + record.get('legalAddressRegion') + ',' + record.get('legalAddressCity') + ',' + record.get('legalAddress')
                                });
                            }
                        });

                        if (fiComboStoreData.length > 0) {
                            let fiCombo = me.lookupReference(fiProcessType === 'FI_CHANGE' ? 'changeFiCombo' : 'disableFiCombo');
                            fiCombo.getStore().setData(fiComboStoreData);

                            callback(true, null);
                        } else {
                            callback(false, (storeCount === 1 ? i18n.dashboardFiProcessWizardValidationHasInProgressTask : i18n.dashboardFiProcessWizardValidationHaveInProgressTask));
                        }
                    }
                });

                break;
            default:
                break;
        }
    },

    startTask: function () {
        let me = this,
            fiProcessType = me.getViewModel().get('processType');

        me.getView().mask(i18n.pleaseWait);

        let formReference = null,
            workflowKey = null,
            fiTypeStore = me.lookupReference('fiTypeCombo').getStore(),
            variables = me.getViewModel().get('task.variable');

        switch (fiProcessType) {
            case 'FI_REGISTRATION': {
                formReference = 'fiRegistrationProcessCard';

                let fiTypeCode = me.getViewModel().get('fiTypeCode');
                if (fiTypeCode) {
                    let selectedFiType = fiTypeStore.findRecord('code', fiTypeCode);
                    workflowKey = selectedFiType.get('registrationWorkflowKey');
                }
                break;
            }
            case 'FI_CHANGE': {
                formReference = 'fiChangeProcessCard';

                let fiCombo = me.lookupReference('changeFiCombo'),
                    selectedFi = fiCombo.getSelectedRecord();

                if (selectedFi) {
                    let fiTypeCode = selectedFi.get('fiTypeCode'),
                        changeFormType = me.getViewModel().get('fiChangeProcessChangeFormType'),
                        selectedFiType = fiTypeStore.findRecord('code', fiTypeCode);

                    if (changeFormType === 'ADD_BRANCH') {
                        delete variables.nbgwf_fiChangeCRUFormType;
                        delete variables.nbgwf_fiChangeFormType;
                        delete variables.nbgwf_fiChangeFexFormType;

                        workflowKey = selectedFiType.get('branchChangeWorkflowKey');
                    } else if (changeFormType === 'EDIT_BRANCH') {
                        delete variables.nbgwf_fiChangeCRUFormType;
                        delete variables.nbgwf_fiChangeFormType;
                        delete variables.nbgwf_fiChangeFexFormType;

                        workflowKey = selectedFiType.get('branchEditWorkflowKey');
                    } else {
                        switch (fiTypeCode) {
                            case 'FEX':
                                delete variables.nbgwf_fiChangeCRUFormType;
                                delete variables.nbgwf_fiChangeFormType;

                                variables.nbgwf_fiChangeFexFormType = changeFormType;
                                break;
                            case 'CRU':
                                delete variables.nbgwf_fiChangeFexFormType;
                                delete variables.nbgwf_fiChangeFormType;

                                variables.nbgwf_fiChangeCRUFormType = changeFormType;
                                break;
                            case 'LE':
                            case 'MFO':
                                delete variables.nbgwf_fiChangeFexFormType;
                                delete variables.nbgwf_fiChangeCRUFormType;

                                variables.nbgwf_fiChangeFormType = changeFormType;
                                break;
                        }

                        workflowKey = selectedFiType.get('changeWorkflowKey');
                    }
                }

                break;
            }
            case 'FI_DISABLE': {

                formReference = 'fiDisableProcessCard';

                let fiCombo = me.lookupReference('disableFiCombo'),
                    selectedFi = fiCombo.getSelectedRecord();

                if (selectedFi) {

                    let fiTypeCode = selectedFi.get('fiTypeCode'),
                        disableReason = me.getViewModel().get('fiDisableProcessDisableReason'),
                        selectedFiType = fiTypeStore.findRecord('code', fiTypeCode);


                    if (me.getViewModel().get('fiDisableProcessType') === 'DISABLE_BRANCH') {
                        delete variables.nbgwf_fiCancellationMFOReason;
                        delete variables.nbgwf_fiCancellationCRUReason;
                        delete variables.nbgwf_fiCancellationReason;
                        delete variables.nbgwf_fiCancellationFEXReason;

                        workflowKey = selectedFiType.get('branchChangeWorkflowKey');
                    } else {
                        switch (fiTypeCode) {
                            case 'FEX':
                                delete variables.nbgwf_fiCancellationMFOReason;
                                delete variables.nbgwf_fiCancellationCRUReason;
                                delete variables.nbgwf_fiCancellationReason;

                                variables.nbgwf_fiCancellationFEXReason = disableReason;
                                break;
                            case 'CRU':
                                delete variables.nbgwf_fiCancellationFEXReason;
                                delete variables.nbgwf_fiCancellationMFOReason;
                                delete variables.nbgwf_fiCancellationReason;

                                variables.nbgwf_fiCancellationCRUReason = disableReason;
                                break;
                            case 'LE':
                                delete variables.nbgwf_fiCancellationFEXReason;
                                delete variables.nbgwf_fiCancellationMFOReason;
                                delete variables.nbgwf_fiCancellationCRUReason;

                                variables.nbgwf_fiCancellationReason = disableReason;
                                break;
                            case 'MFO':
                                delete variables.nbgwf_fiCancellationFEXReason;
                                delete variables.nbgwf_fiCancellationCRUReason;
                                delete variables.nbgwf_fiCancellationReason;

                                variables.nbgwf_fiCancellationMFOReason = disableReason;
                                break;
                        }

                        workflowKey = selectedFiType.get('disableWorkflowKey');
                    }
                }
                break;
            }
        }

        let form = me.lookupReference(formReference);
        if (!form.isValid()) {
            me.setValidationMessage(i18n.formIsNotValid);
            me.getView().unmask();
        } else {
            me.setValidationMessage(null);

            let jsonData = {
                variables: variables,
                items: null
            };

            me.createWorkflow(workflowKey, jsonData);
        }
    },

    createWorkflow: function (processDefinitionKey, jsonData) {
        let me = this;

        Ext.Ajax.request({
            method: 'POST',
            url: first.config.Config.remoteRestUrl + 'ecm/workflow/create/' + processDefinitionKey,
            jsonData: jsonData,
            success: function (response) {
                let store = Ext.getStore('taskStore');
                if (store) {
                    store.reload();
                }

                me.fireEvent('reloadFiRegistryStore');

                let res = JSON.parse(response.responseText),
                    fiRegistryId = null;

                if (res.processVariables) {
                    fiRegistryId = res.processVariables.find(function (variable) {
                        return Ext.Array.contains(first.util.WorkflowHelper.getDataTypeFiRegistries(), variable.type);
                    });
                }

                if (fiRegistryId) {
                    fiRegistryId = fiRegistryId.value.replace('workspace://SpacesStore/', '');
                    let initialTabReference = first.util.WorkflowHelper.getInitialTabReference(res.processVariables);
                    me.fireEvent('openFiProfileAndRefreshView', me.getView(), (fiRegistryId + '/' + initialTabReference), fiRegistryId);
                } else {
                    me.fireEvent('destroyCallerAndOpenTab', me.getView(), 'taskView');
                }
            },
            failure: function (response) {
                me.displaySubmissionFailedMessage(response, function (btn, text) {
                    me.getViewModel().set('task.variable.fwf_metaInformationIgnoreWarnings', true);
                    if (btn === 'yes') {
                        me.getView().mask(i18n.pleaseWait);
                        this.createWorkflow(processDefinitionKey, jsonData);
                    }
                });
            },
            callback: function () {
                if (me.getView()) {
                    me.getView().unmask();
                }
            }
        });
    },

    displaySubmissionFailedMessage: function (response, warningFunction) {
        let errorMessage = i18n.operationFailed,
            isWarning = false;
        try {
            let error = response.responseText;
            if (error) {
                isWarning = error.startsWith("Warning");
                errorMessage += ('<br>' + first.util.WorkflowHelper.getExceptionI18nMessage(error));
            }
        } catch (e) {
            console.log(e);
        } finally {
            !isWarning ? first.util.ErrorHandlerUtil.showErrorWindow(null, errorMessage, null) : Ext.MessageBox.confirm(i18n.warning, errorMessage, warningFunction, this);
        }
    },

    isUserPermitToStartProcess: function (get) {
        return first.config.Config.conf.properties.currentUser.editor
            || first.config.Config.conf.properties.currentUser.superAdmin
            || first.config.Config.conf.properties.currentUser.capabilities.admin;
    },

    setWindowHeight: function (fiProcessType) {
        let height;
        switch (fiProcessType) {
            case 'FI_REGISTRATION':
                height = 725;
                break;
            case 'FI_CHANGE':
                height = 455
                break;
            case 'FI_DISABLE':
                height = 505;
                break;
            default:
                height = this.getView().height;
                break;
        }

        height = height >= Ext.getBody().getViewSize().height ? Ext.getBody().getViewSize().height - 120 : height;

        this.getView().setHeight(height);
    },

    initExistedFiData: function (record) {
        let me = this,
            task = me.getViewModel().get('task');

        task.variable.fwf_fiRegCopyDataFromFi = record.get('id');
        task.variable.fwf_fiRegLegalFormType = record.get('legalFormType');
        task.variable.fwf_fiRegFiName = record.get('name');
        task.variable.fina_legalAddressAddress = record.get('legalAddress');

        me.bindRegionalStructureData('/region/' + record.get('legalAddressRegion'), function (response) {
            me.getViewModel()
                .set('task.variable.fwf_fiRegRegistryAddressRegion', JSON.parse(response.responseText).id);
        });
        me.bindRegionalStructureData('/city/' + record.get('legalAddressCity'), function (response) {
            me.getViewModel()
                .set('task.variable.fwf_fiRegRegistryAddressCity', JSON.parse(response.responseText).id);
        });

        me.getViewModel().set('task', task)
    },

    bindRegionalStructureData: function (region, success) {
        Ext.Ajax.request({
            url: first.config.Config.remoteRestUrl + 'ecm/fi/regionalStructure' + region,
            method: 'GET',
            success: success,
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            }
        });
    }

});