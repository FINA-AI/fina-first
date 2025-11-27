Ext.define('first.view.fi.FiTypeView', {
    extend: 'Ext.grid.Panel',

    xtype: 'fiTypeView',

    requires: [
        'Ext.grid.column.RowNumberer',
        'Ext.layout.container.HBox',
        'Ext.toolbar.Paging',
        'first.store.fi.FiTypeStore',
        'first.view.fi.FiTypeController'
    ],

    controller: 'fiTypeController',

    loadMask: true,

    columnLines: true,

    store: {
        type: 'fiTypeStore'
    },

    bind: {
        selection: '{selectedFiType}'
    },

    tbar: {
        cls:'firstFiRegistryTbar',
        items: [{
            text: i18n.add,
            cls: 'finaPrimaryBtn',
            iconCls: 'x-fa fa-plus-circle',
            handler: 'onAddFiTypeClick'
        }, {
            text: i18n.edit,
            cls: 'finaSecondaryBtn',
            iconCls: 'x-fa fa-edit',
            disabled: true,
            handler: 'onEditFiTypeClick',
            bind: {
                disabled: '{!selectedFiType}'
            }
        }, {
            text: i18n.delete,
            cls: 'finaSecondaryBtn',
            iconCls: 'x-fa fa-minus-circle',
            handler: 'onDeleteFiTypeClick',
            disabled: true,
            bind: {
                disabled: '{!selectedFiType}'
            }
        }],
        bind: {
            hidden: '{!hasConfigAmendPermission}'
        }
    },

    columns: {
        defaults: {
            align: 'left',
            flex: 1
        },
        items: [{
            flex: 0,
            xtype: 'rownumberer'
        }, {
            text: i18n.fiTypeCode,
            dataIndex: 'code'
        }, {
            text: i18n.fiTypeDescription,
            dataIndex: 'description'
        }, {
            text: i18n.registrationWorkflow,
            dataIndex: 'registrationWorkflowKey'
        }, {
            text: i18n.changeWorkflow,
            dataIndex: 'changeWorkflowKey'
        }, {
            text: i18n.disableWorkflow,
            dataIndex: 'disableWorkflowKey'
        }, {
            text: i18n.branchChangeWorkflow,
            dataIndex: 'branchChangeWorkflowKey'
        }, {
            text: i18n.branchEditWorkflow,
            dataIndex: 'branchEditWorkflowKey'
        },  {
            text: i18n.documentWithdrawalWorkflow,
            dataIndex: 'documentWithdrawalWorkflowKey'
        }]
    },

    bbar: {
        xtype: 'pagingtoolbar',
        layout: {
            type: 'hbox',
            pack: 'center'
        }
    }
});
