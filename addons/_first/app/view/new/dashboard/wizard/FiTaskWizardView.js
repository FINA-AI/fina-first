Ext.define('first.view.new.dashboard.wizard.FiTaskWizardView', {
    extend: 'Ext.window.Window',

    xtype: 'fiTaskWizard',

    requires: [
        'first.store.common.RegionalStructureStore',
        'first.store.fi.FiTypeStore',
        'first.view.new.dashboard.wizard.FiTaskWizardController',
        'first.view.new.dashboard.wizard.FiTaskWizardModel'
    ],

    controller: 'fiTaskWizard',

    layout: 'fit',

    width: '50%',

    height: '55%',

    modal: true,

    iconCls: 'x-fa fa-cog',

    bind: {
        title: '{title}'
    },

    bbar: {
        items: [{
            xtype: 'tbtext',
            bind: {
                html: '<b style="font-size: 10px; color: red">{validationMessage}</b>'
            }
        }, '->', {
            text: '&laquo; ' + i18n.dashboardFiProcessWizardPrevious,
            cls: 'finaSecondaryBtn',
            handler: 'showPrevious',
            disabled: true,
            bind: {
                disabled: '{isPreviousButtonDisabled}'
            }
        }, {
            text: i18n.dashboardFiProcessWizardNext + ' &raquo;',
            cls: 'finaPrimaryBtn',
            handler: 'showNext',
            bind: {
                disabled: '{isNextButtonDisabled}'
            }
        }]
    },

    items: [{
        layout: 'card',
        reference: 'fiProcessWizardCard',
        defaults: {
            xtype: 'form',
            bodyPadding: 20,
            scrollable: true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                allowBlank: false,
                labelAlign: 'top'
            }
        },
        items: [{
            reference: 'fi-process-card-0',
            items: [{
                html: '',
                bind: {
                    html: '{firstCardInfoText}'
                }
            }, {
                xtype: 'textfield',
                fieldLabel: i18n.dashboardWizardTasksEdocNumber + ' <b style="color: red;">*</b>',
                bind: {
                    value: '{task.variable.fwf_fiStartTaskBaseTaskNumber}'
                }
            }, {
                xtype: 'datefield',
                format: first.config.Config.dateFormat,
                fieldLabel: i18n.dashboardWizardTasksEdocDate + ' <b style="color: red;">*</b>',
                bind: {
                    value: '{task.variable.fwf_fiStartTaskBaseTaskReceiptDate}'
                }
            }, {
                xtype: 'textfield',
                fieldLabel: i18n.dashboardFiProcessWizardIdentity + ' <b style="color: red;">*</b>',
                regex: /^(?=(?:.{9}|.{11})$)[a-zA-Z0-9]*$/,
                regexText: i18n.invalidIdentificationNumber,
                bind: {
                    value: '{task.variable.fwf_fiStartTaskBaseFiIdentity}'
                }
            }]
        }, {
            reference: 'fiRegistrationProcessCard',
            items: [{
                xtype: 'textfield',
                fieldLabel: i18n.dashboardFiProcessWizardIdentity + ' <b style="color: red;">*</b>',
                disabled: true,
                bind: {
                    value: '{task.variable.fwf_fiStartTaskBaseFiIdentity}'
                }
            }, {
                xtype: 'combo',
                reference: 'fiTypeCombo',
                fieldLabel: i18n.dashboardFiProcessWizardFiType + ' <b style="color: red;">*</b>',
                labelAlign: 'top',
                store: {
                    type: 'fiTypeStore'
                },
                valueField: 'code',
                displayField: 'code',
                queryMode: 'local',
                forceSelection: true,
                listConfig: {
                    itemTpl: [
                        '<div data-qtip="{code}: {description}">{code} - {description}</div>'
                    ]
                },
                emptyText: i18n.fiActionFiType,
                bind: {
                    value: '{fiTypeCode}'
                }
            }, {
                xtype: 'textfield',
                fieldLabel: i18n.dashboardWizardTasksEdocNumber + ' <b style="color: red;">*</b>',
                bind: {
                    value: '{task.variable.fwf_fiStartTaskBaseTaskNumber}'
                }
            }, {
                xtype: 'datefield',
                format: first.config.Config.dateFormat,
                fieldLabel: i18n.dashboardWizardTasksEdocDate + ' <b style="color: red;">*</b>',
                bind: {
                    value: '{task.variable.fwf_fiStartTaskBaseTaskReceiptDate}'
                }
            }, {
                xtype: 'textfield',
                allowBlank: true,
                fieldLabel: i18n.dashboardWizardTasksFiRegistrationRegistrationNumber,
                bind: {
                    value: '{task.variable.fwf_fiStartTaskBaseFiCode}'
                }
            }, {
                reference: 'legalFormTypeCombo',
                xtype: 'combobox',
                fieldLabel: i18n.dashboardWizardTasksFiRegistrationLegalForm + ' <b style="color: red;">*</b>',
                store: {
                    data: []
                },
                valueField: 'value',
                displayField: 'text',
                queryMode: 'local',
                forceSelection: true,
                bind: {
                    value: '{task.variable.fwf_fiRegLegalFormType}'
                }
            }, {
                xtype: 'textfield',
                fieldLabel: i18n.dashboardWizardTasksFiRegistrationLegalName + ' <b style="color: red;">*</b>',
                bind: {
                    value: '{task.variable.fwf_fiRegFiName}'
                }
            }, {
                reference: 'legalAddressRegionCombo',
                xtype: 'combobox',
                fieldLabel: i18n.dashboardWizardTasksFiRegistrationLegalAddressRegion + ' <b style="color: red;">*</b>',
                valueField: 'id',
                displayField: 'fina_regionalStructureRegionName',
                queryMode: 'local',
                forceSelection: true,
                filterPickList: true,
                listeners: {
                    change: 'legalAddressRegionComboChangeListener'
                },
                bind: {
                    value: '{task.variable.fwf_fiRegRegistryAddressRegion}'
                }
            }, {
                reference: 'legalAddressCityCombo',
                xtype: 'combobox',
                fieldLabel: i18n.dashboardWizardTasksFiRegistrationLegalAddressCity + ' <b style="color: red;">*</b>',
                store: {
                    type: 'regionalStructureStore',
                },
                valueField: 'id',
                displayField: 'fina_regionalStructureCityName',
                queryMode: 'local',
                forceSelection: true,
                filterPickList: true,
                bind: {
                    value: '{task.variable.fwf_fiRegRegistryAddressCity}'
                }
            }, {
                xtype: 'textfield',
                fieldLabel: i18n.dashboardWizardTasksFiRegistrationLegalAddress + ' <b style="color: red;">*</b>',
                bind: {
                    value: '{task.variable.fina_legalAddressAddress}'
                }
            }, {
                xtype: 'combobox',
                fieldLabel: i18n.dashboardWizardTasksFiRegistrationFactualAddressSame + ' <b style="color: red;">*</b>',
                store: {
                    data: [{
                        value: true,
                        text: i18n.yes
                    }, {
                        value: false,
                        text: i18n.no
                    }]
                },
                valueField: 'value',
                displayField: 'text',
                queryMode: 'local',
                forceSelection: true,
                listeners: {
                    change: 'factualAddressSameComboChangeListener'
                },
                bind: {
                    value: '{task.variable.fwf_fiRegFiIsAddressSame}'
                }
            }, {
                reference: 'factualAddressRegionCombo',
                xtype: 'combobox',
                fieldLabel: i18n.dashboardWizardTasksFiRegistrationFactualAddressRegion + ' <b style="color: red;">*</b>',
                valueField: 'id',
                displayField: 'fina_regionalStructureRegionName',
                queryMode: 'local',
                forceSelection: true,
                filterPickList: true,
                listeners: {
                    change: 'factualAddressAddressRegionComboChangeListener'
                },
                bind: {
                    value: '{task.variable.fwf_fiRegRegistryFactualAddressRegion}',
                    hidden: '{task.variable.fwf_fiRegFiIsAddressSame}'
                }
            }, {
                reference: 'factualAddressCityCombo',
                xtype: 'combobox',
                fieldLabel: i18n.dashboardWizardTasksFiRegistrationFactualAddressCity + ' <b style="color: red;">*</b>',
                hidden: true,
                store: {
                    type: 'regionalStructureStore',
                },
                valueField: 'id',
                displayField: 'fina_regionalStructureCityName',
                queryMode: 'local',
                forceSelection: true,
                filterPickList: true,
                bind: {
                    value: '{task.variable.fwf_fiRegRegistryFactualAddressCity}',
                    hidden: '{task.variable.fwf_fiRegFiIsAddressSame}'
                }
            }, {
                reference: 'factualAddressAddress',
                xtype: 'textfield',
                fieldLabel: i18n.dashboardWizardTasksFiRegistrationFactualAddress + ' <b style="color: red;">*</b>',
                hidden: true,
                bind: {
                    value: '{task.variable.fwf_fiRegFiFactualAddress}',
                    hidden: '{task.variable.fwf_fiRegFiIsAddressSame}'
                }
            }]
        }, {
            reference: 'fiChangeProcessCard',
            items: [{
                reference: 'changeFiCombo',
                xtype: 'combobox',
                fieldLabel: i18n.dashboardWizardTasksNonBankingOrganization + ' <b style="color: red;">*</b>',
                store: {
                    data: []
                },
                valueField: 'value',
                displayField: 'text',
                queryMode: 'local',
                forceSelection: true,
                listeners: {
                    change: 'fiChangeProcessFiComboChangeListener'
                },
                bind: {
                    value: '{task.variable.fwf_fiStartTaskBaseFiCode}'
                }
            }, {
                xtype: 'textfield',
                fieldLabel: i18n.dashboardWizardTasksRegistrationNumber + ' <b style="color: red;">*</b>',
                disabled: true,
                bind: {
                    value: '{task.variable.fwf_fiStartTaskBaseFiCode}'
                }
            }, {
                xtype: 'textfield',
                fieldLabel: i18n.dashboardFiProcessWizardIdentity + ' <b style="color: red;">*</b>',
                disabled: true,
                bind: {
                    value: '{task.variable.fwf_fiStartTaskBaseFiIdentity}'
                }
            }, {
                xtype: 'textfield',
                fieldLabel: i18n.dashboardWizardTasksEdocNumber + ' <b style="color: red;">*</b>',
                bind: {
                    value: '{task.variable.fwf_fiStartTaskBaseTaskNumber}'
                }
            }, {
                xtype: 'datefield',
                format: first.config.Config.dateFormat,
                fieldLabel: i18n.dashboardWizardTasksEdocDate + ' <b style="color: red;">*</b>',
                bind: {
                    value: '{task.variable.fwf_fiStartTaskBaseTaskReceiptDate}'
                }
            }, {
                reference: 'changeProcessFiChangeTypeCombo',
                xtype: 'combobox',
                fieldLabel: i18n.dashboardWizardTasksFiChangeType + ' <b style="color: red;">*</b>',
                store: {
                    data: []
                },
                valueField: 'value',
                displayField: 'text',
                queryMode: 'local',
                forceSelection: true,
                disabled: true,
                bind: {
                    value: '{fiChangeProcessChangeFormType}'
                }
            }]
        }, {
            reference: 'fiDisableProcessCard',
            items: [{
                xtype: 'combobox',
                fieldLabel: i18n.dashboardWizardTasksFiDisableTypeTitle + ' <b style="color: red;">*</b>',
                store: {
                    data: [{
                        value: 'DISABLE_BRANCH',
                        text: i18n.dashboardWizardTasksFiDisableTypeBranch
                    }, {
                        value: 'DISABLE_FI',
                        text: i18n.dashboardWizardTasksFiDisableTypeFi
                    }]
                },
                valueField: 'value',
                displayField: 'text',
                queryMode: 'local',
                forceSelection: true,
                listeners: {
                    change: 'fiDisableProcessTypeComboChangeListener'
                },
                bind: {
                    value: '{fiDisableProcessType}'
                }
            }, {
                reference: 'disableFiCombo',
                xtype: 'combobox',
                fieldLabel: i18n.dashboardWizardTasksNonBankingOrganization + ' <b style="color: red;">*</b>',
                store: {
                    data: []
                },
                valueField: 'value',
                displayField: 'text',
                queryMode: 'local',
                forceSelection: true,
                listeners: {
                    change: 'fiDisableProcessFiComboChangeListener'
                },
                bind: {
                    value: '{task.variable.fwf_fiStartTaskBaseFiCode}'
                }
            }, {
                xtype: 'textfield',
                fieldLabel: i18n.dashboardWizardTasksRegistrationNumber + ' <b style="color: red;">*</b>',
                disabled: true,
                bind: {
                    value: '{task.variable.fwf_fiStartTaskBaseFiCode}'
                }
            }, {
                xtype: 'textfield',
                fieldLabel: i18n.dashboardFiProcessWizardIdentity + ' <b style="color: red;">*</b>',
                disabled: true,
                bind: {
                    value: '{task.variable.fwf_fiStartTaskBaseFiIdentity}'
                }
            }, {
                xtype: 'textfield',
                fieldLabel: i18n.dashboardWizardTasksEdocNumber + ' <b style="color: red;">*</b>',
                bind: {
                    value: '{task.variable.fwf_fiStartTaskBaseTaskNumber}'
                }
            }, {
                xtype: 'datefield',
                format: first.config.Config.dateFormat,
                fieldLabel: i18n.dashboardWizardTasksEdocDate + ' <b style="color: red;">*</b>',
                bind: {
                    value: '{task.variable.fwf_fiStartTaskBaseTaskReceiptDate}'
                }
            }, {
                reference: 'fiDisableProcessDisableReasonCombo',
                xtype: 'combobox',
                fieldLabel: i18n.dashboardWizardTasksFiDisableReason + ' <b style="color: red;">*</b>',
                store: {
                    data: []
                },
                valueField: 'value',
                displayField: 'text',
                queryMode: 'local',
                forceSelection: true,
                disabled: true,
                bind: {
                    value: '{fiDisableProcessDisableReason}'
                }
            }]
        }]
    }]
});