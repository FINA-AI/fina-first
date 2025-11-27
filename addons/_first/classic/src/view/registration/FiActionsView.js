Ext.define('first.view.registration.FiActionsView', {
    extend: 'Ext.grid.Panel',

    xtype: 'fiActionsEcm',

    requires: [
        'Ext.button.Button',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.form.field.Text',
        'Ext.grid.column.Action',
        'Ext.grid.column.Date',
        'Ext.grid.column.RowNumberer',
        'Ext.layout.container.HBox',
        'Ext.toolbar.Paging',
        'Ext.util.Format',
        'Ext.ux.layout.ResponsiveColumn',
        'first.store.registration.FiActions',
        'first.view.registration.FiActionsController',
        'first.view.registration.FiActionsModel'
    ],

    controller: 'fiActionsEcm',

    viewModel: {
        type: 'fiActions'
    },

    store: {
        type: 'actionsStoreEcm',
    },

    loadMask: true,
    columnLines: true,

    emptyText: i18n.fiActionsNotAvailable,

    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        defaults: {
            flex: 1,
            xtype: 'textfield',
        },
        items: [{
            emptyText: i18n.actionsFilterByName,
            bind: {
                value: '{filter.name}',
            }
        }, {
            xtype: 'combo',
            emptyText: i18n.actionsFilterByActionType,
            displayField: 'type',
            valueField: 'value',
            bind: {
                value: '{filter.type}',
            },
            store: {
                data: [
                    {type: i18n.REGISTRATION, value: 'REGISTRATION'},
                    {type: i18n.CHANGE, value: 'CHANGE'},
                    {type: i18n.CANCELLATION, value: 'CANCELLATION'},
                    {type: i18n.BRANCHES_CHANGE, value: 'BRANCHES_CHANGE'},
                    {type: i18n.BRANCHES_EDIT, value: 'BRANCHES_EDIT'},
                ]
            }
        }, {
            emptyText: i18n.actionsFilterByAuthor,
            bind: {
                value: '{filter.author}',
            }
        }, {
            xtype: 'datefield',
            format: first.config.Config.dateFormat,
            emptyText: i18n.actionsFilterByCreationDateFrom,
            bind: {
                value: '{filter.dateFrom}',
            },
        }, {
            xtype: 'datefield',
            format: first.config.Config.dateFormat,
            emptyText: i18n.actionsFilterByCreationDateTo,
            bind: {
                value: '{filter.dateTo}',
            },
        }, {
            xtype: 'button',
            iconCls: 'x-fa fa-broom',
            tooltip: i18n.clear,
            flex: 0,
            handler: 'clearFilters'
        }, {
            xtype: 'button',
            iconCls: 'x-fa fa-filter',
            tooltip: i18n.actionsFilter,
            flex: 0,
            handler: 'filterButtonClick'
        }]
    }],

    columns: [{
        flex: 0,
        xtype: 'rownumberer'
    }, {
        xtype: 'actioncolumn',
        width: 65,
        sortable: false,
        resizable: false,
        items: [{
            iconCls: 'x-fa fa-cog icon-margin',
            tooltip: i18n.taskGridActionViewProcess,
            handler: 'onViewProcessClick'
        }, {
            iconCls: 'x-fa fa-eye icon-margin',
            tooltip: i18n.details,
            handler: 'onViewDetailsClick',
        }]
    }, {
        text: i18n.fiActionName,
        flex: 1,
        dataIndex: 'name'
    }, {
        text: i18n.fiActionActionType,
        flex: 1,
        dataIndex: 'type',
        renderer: 'actionTypeRenderer',
    }, {
        text: i18n.fiActionAuthor,
        flex: 1,
        dataIndex: 'author'
    }, {
        text: i18n.taskItemGridCreatedAt,
        flex: 1,
        dataIndex: 'createdAt',
        renderer: Ext.util.Format.dateRenderer(first.config.Config.timeFormat),
    }, {
        text: i18n.statementNumber,
        flex: 1,
        dataIndex: 'taskNumber',
    }, {
        text: i18n.statementDate,
        flex: 1,
        dataIndex: 'taskReceiptDate',
        renderer: Ext.util.Format.dateRenderer(first.config.Config.dateFormat),
    }],


    bbar: {
        xtype: 'pagingtoolbar',
        layout: {
            type: 'hbox',
            pack: 'center'
        }
    }
});
