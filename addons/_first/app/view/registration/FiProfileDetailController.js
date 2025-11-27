Ext.define('first.view.registration.FiProfileDetailController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.fiProfileDetailEcm',

    requires: [
        'first.config.Config',
        'first.util.ErrorHandlerUtil'
    ],

    required: [],

    init: function () {
        let view = this.getView();

        view.setMaxHeight(Ext.getBody().getViewSize().height);

        view.setWidth(Ext.getBody().getViewSize().width - 120);

        if (view.height < Ext.getBody().getViewSize().height) {
            view.height = null;
        } else {
            view.setHeight(Ext.getBody().getViewSize().height - 120);
        }

    },

    onCancelButtonClick: function () {
        this.getView().destroy();
    },

    onSubmitButtonClick: function () {
        let me = this,
            formItems = this.lookupReference('formItems'),
            theFi = this.getViewModel().get('theFi'),
            detailName = this.getViewModel().get('detail').name,
            validationFunction = this.getViewModel().get('validationFunction'),
            submitSuccessCallback = this.getViewModel().get('submitSuccessCallback'),
            customValidatorFunctions = this.getViewModel().get('customValidatorFunctions');

        if (this.lookupReference('questionGrid').getStore().getData().items.findIndex(function (d) {
            return d.data.question === undefined
        }) !== -1) {
            formItems.isValid();
            Ext.toast(i18n.formQuestionIsNotValid, i18n.warning);
            return;
        }

        if (formItems.isValid()) {
            if (!this.validateCustomValidatorFunctions(customValidatorFunctions)) {
                return;
            }

            let model = this.getViewModel().get('model'),
                record = this.getViewModel().get('record'),
                store = this.getViewModel().get('store'),
                edit = this.getViewModel().get('edit'),
                isTree = this.getViewModel().get('isTree'),
                selectedNode = this.getViewModel().get('selectedNode');

            me.getView().mask(i18n.pleaseWait);

            if (validationFunction) {
                let isValid = validationFunction(formItems, me.getView());
                if (!isValid) {
                    me.getView().unmask();
                    return;
                }
            }

            let data = {};
            Ext.Object.each(model, function (key, val) {
                data[key.replace('_', ':')] = val;
            });

            data['fina:isNodePropertiesSet'] = true;

            if (theFi['fina_fiRegistryStatus'] !== 'IN_PROGRESS' && first.config.Config.conf.properties.currentUser.superAdmin && data['fina:status'] !== 'CANCELED') {
                data['fina:finalStatus'] = 'ACTIVE';
            }

            delete data.id;

            switch (detailName) {
                case 'Beneficiaries':
                case 'Authorized Persons':
                case 'Branches':
                case 'Complex Structures':
                    data['fina:fiRegistryActionId'] = theFi['fina_fiRegistryLastActionId'];
                    if (!edit) {
                        data['fina:fiParentRegistryActionId'] = theFi['fina_fiRegistryLastActionId'];
                    }
                    break;
            }

            if (edit) {
                if (record) {
                    record.set(data);
                    record.dirty = true;
                }
            } else {
                store.proxy.extraParams = store.proxy.extraParams ? store.proxy.extraParams : {};
                if (isTree) {
                    delete store.proxy.extraParams['parentId'];

                    if (selectedNode) {
                        store.proxy.extraParams.parentId = selectedNode.get('id');
                        store.getById(selectedNode.get('id')).eachChild(function (n) {
                            if (n && n.phantom && n.get('id') != 'root') {
                                store.getById(selectedNode.get('id')).removeChild(n);
                            }
                        });
                        store.getById(selectedNode.get('id')).appendChild(data);
                    } else {
                        store.getRoot().appendChild(data);
                    }
                } else {
                    store.insert(0, data);
                }
            }

            store.proxy.extraParams.nodeType = me.getViewModel().get('nodeType');

            store.sync({
                failure: function (response) {
                    store.rejectChanges();
                    me.getView().unmask();
                    me.detectFailureType(response, store);
                },
                success: function (batch, opts) {

                    if (me.getViewModel().get('model.fina_ignoreWarnings') && edit && record) {
                        record.set('fina:ignoreWarnings', false);
                    } else if (me.getViewModel().get('model.fina_ignoreWarnings')) {
                        store.first().set('fina:ignoreWarnings', false);
                    }

                    if (model.extraQuestionnaireUpdated || model.extraQuestionnaireNew || model.extraQuestionnaireRemoved) {
                        store.reload();
                    }

                    if (submitSuccessCallback) {
                        submitSuccessCallback(opts.operations.create[0]);
                    }
                    store.load();
                    me.fireEvent('reloadQuestionnaireGrid', theFi.id);
                    me.fireEvent('refreshBeneficiaryGridEvent', theFi.id);
                    me.fireEvent('onAfterSubmitFiRegistryDetailCall', me.getView(), me.getViewModel().get('theFi'),
                        me.getViewModel().get('fiRegistryLastActionId'), detailName === "Branches" ? me.displayBranchesWarning : null);
                }
            });
        } else {
            Ext.toast(i18n.formIsNotValid, i18n.warning);
        }
    },

    displayBranchesWarning: function (validationResults) {
        if (!validationResults["fina:fiRegistryValidationResultBranchesHeadOfficeExists"]) {
            Ext.toast(i18n.noHeadOfficesSpecifiedWarning, i18n.information);
        } else if (!validationResults["fina:fiRegistryValidationResultBranchesHasSingleHeadOffice"]) {
            Ext.toast(i18n.moreThanOneHeadOfficeWarning, i18n.information);
        }
    },

    detectFailureType: function (response, store) {
        try {
            let briefSummery = response.exceptions[0].getError().response.responseJson.message,
                finaTypeExceptionIdentifier = "net.fina.first.alfresco.FinaTypeException: ",
                warningPrefix = finaTypeExceptionIdentifier + 'Warning';
            if (briefSummery && briefSummery.includes(warningPrefix)) {
                let warningMessage = briefSummery.substr(briefSummery.lastIndexOf(finaTypeExceptionIdentifier) + finaTypeExceptionIdentifier.length);
                warningMessage = warningMessage.substr(0, warningMessage.lastIndexOf("(workspace")).split(';');
                if (warningMessage.length > 1 && i18n[warningMessage[0]]) {
                    let i18nMessage = i18n[warningMessage[0]];
                    warningMessage.shift();
                    warningMessage.unshift(i18nMessage);
                    warningMessage = Ext.String.format.apply(this, warningMessage);
                }

                Ext.MessageBox.confirm(i18n.warning, warningMessage, function (btn, text) {
                    this.getViewModel().set('model.fina_ignoreWarnings', (btn === 'yes'));
                    if (btn === 'yes') {
                        this.onSubmitButtonClick();
                    }
                }, this)
            } else {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            }
        } catch (e) {
            first.util.ErrorHandlerUtil.showErrorWindow(response);
        }
    },

    validateCustomValidatorFunctions: function (validators) {
        let valid = true;
        if (validators) {
            validators.forEach(function (v) {
                valid &= v();
            });
        }
        return valid;
    },

    onResize: function () {
        this.lookupReference('leftColumn').updateLayout();
        this.lookupReference('rightColumn').updateLayout();
    }

});
