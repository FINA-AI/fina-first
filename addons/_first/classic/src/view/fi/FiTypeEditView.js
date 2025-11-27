Ext.define('first.view.fi.FiTypeEditView', {
    extend: 'Ext.window.Window',

    xtype: 'fiTypeEditView',

    requires: [
        'Ext.button.Button',
        'Ext.form.Panel',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Tag',
        'Ext.form.field.Text',
        'Ext.layout.container.VBox',
        'Ext.toolbar.Fill',
        'first.store.common.processDefinition.ProcessDefinitionStore',
        'first.store.fi.BranchTypeStore',
        'first.view.fi.FiTypeEditController'
    ],

    controller: 'fiTypeEditController',

    width: 500,
    resizable: false,
    modal: true,
    buttonAlign: 'center',

    config: {
        store: {
            type: 'ecmProcessDefinitionStore',
            storeId: 'ecmProcessDefinitionStore',
            autoLoad: true,
            pageSize: 25
        }
    },

    applyStore: function (store) {
        return store && Ext.Factory.store(store);
    },

    items: [{
        xtype: 'form',
        reference: 'fiTypeEditForm',
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        defaults: {
            padding: 5,
            allowBlank: false
        },
        items: [{
            xtype: 'textfield',
            fieldLabel: i18n.fiTypeCode,
            bind: {
                value: '{fiType.code}'
            }
        }, {
            xtype: 'textfield',
            fieldLabel: i18n.fiTypeDescription,
            bind: {
                value: '{fiType.description}'
            }
        }, {
            xtype: 'tagfield',
            fieldLabel: i18n.fiTypeBranchTypes,
            store: {
                type: 'branchTypeStore'
            },
            valueField: 'name',
            displayField: 'displayName',
            queryMode: 'local',
            filterPickList: true,
            bind: {
                value: '{fiType.branchTypes}'
            }
        }, {
            xtype: 'combobox',
            store: 'ecmProcessDefinitionStore',
            valueField: 'key',
            displayField: 'description',
            queryMode: 'local',
            forceSelection: true,
            fieldLabel: i18n.registrationWorkflow,
            bind: {
                value: '{fiType.registrationWorkflowKey}'
            }
        }, {
            xtype: 'combobox',
            store: 'ecmProcessDefinitionStore',
            valueField: 'key',
            displayField: 'description',
            queryMode: 'local',
            forceSelection: true,
            fieldLabel: i18n.changeWorkflow,
            bind: {
                value: '{fiType.changeWorkflowKey}'
            }
        }, {
            xtype: 'combobox',
            store: 'ecmProcessDefinitionStore',
            valueField: 'key',
            displayField: 'description',
            queryMode: 'local',
            forceSelection: true,
            fieldLabel: i18n.disableWorkflow,
            bind: {
                value: '{fiType.disableWorkflowKey}'
            }
        }, {
            xtype: 'combobox',
            store: 'ecmProcessDefinitionStore',
            valueField: 'key',
            displayField: 'description',
            queryMode: 'local',
            forceSelection: true,
            fieldLabel: i18n.branchChangeWorkflow,
            bind: {
                value: '{fiType.branchChangeWorkflowKey}'
            }
        }, {
            xtype: 'combobox',
            store: 'ecmProcessDefinitionStore',
            valueField: 'key',
            displayField: 'description',
            queryMode: 'local',
            forceSelection: true,
            fieldLabel: i18n.branchEditWorkflow,
            bind: {
                value: '{fiType.branchEditWorkflowKey}'
            }
        }, {
            xtype: 'combobox',
            store: 'ecmProcessDefinitionStore',
            valueField: 'key',
            displayField: 'description',
            queryMode: 'local',
            forceSelection: true,
            fieldLabel: i18n.documentWithdrawalWorkflow,
            bind: {
                value: '{fiType.documentWithdrawalWorkflowKey}'
            }
        }],
        bbar: {
            items: ['->', {
                xtype: 'button',
                reference: 'saveButton',
                text: i18n.save,
                handler: 'onSaveFiTypeBtnClick',
                formBind: true
            }, {
                xtype: 'button',
                reference: 'cancelButton',
                text: i18n.cancel,
                handler: 'onCancelFiTypeBtnClick'
            }]
        }
    }]
});