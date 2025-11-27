Ext.define('first.view.registration.FiActionsGapView', {
    extend: 'Ext.grid.Panel',

    xtype: 'fiActionsGap',

    requires: [
        'Ext.grid.column.Action',
        'Ext.grid.column.RowNumberer',
        'Ext.layout.container.HBox',
        'Ext.toolbar.Paging',
        'Ext.util.Format',
        'first.store.registration.FiActionsGapStore',
        'first.view.registration.FiActionsGapController',
        'first.view.registration.FiActionsGapModel'
    ],

    controller: 'fiActionsGap',

    viewModel: 'fiActionsGap',

    layout: {
        type: 'fit'
    },

    columnLines: true,

    store: {
        type: 'fiActionsGap'
    },

    emptyText: i18n.fiRegistryGapsEmpty + ' ...',

    columns: {
        defaults: {
            flex: 1
        },
        items: [{
            flex: 0,
            xtype: 'rownumberer'
        }, {
            flex: 0,
            menuDisabled: true,
            sortable: false,
            hideable: false,
            resizable: false,
            xtype: 'actioncolumn',
            align: 'center',
            items: [{
                iconCls: 'x-fa fa-eye',
                tooltip: i18n.details,
                handler: 'onViewDetailsActionClick',
            }]
        }, {
            flex: 0,
            menuDisabled: true,
            sortable: false,
            hideable: false,
            resizable: false,
            xtype: 'actioncolumn',
            align: 'center',
            items: [{
                iconCls: 'x-fa fa-reply-all',
                tooltip: i18n.fiRegistryGapsRestoreTask,
                handler: 'onRestoreTaskActionClick',
                isDisabled: 'isRestoreGapTaskActionDisabled'
            }]
        }, {
            dataIndex: 'fina_fiRegistryGapDetailObjectType',
            text: i18n.fiRegistryGapsGridColumnTaskType,
            renderer: function (content, cell, record) {
                return i18n[content] ? i18n[content] : content;
            }
        }, {
            dataIndex: 'fina_fiRegistryGapDetailCorrectionDate',
            text: i18n.fiRegistryGapsGridColumnCorrectionDate,
            renderer: Ext.util.Format.dateRenderer(first.config.Config.dateFormat)
        }, {
            dataIndex: 'fina_fiRegistryGapDetailCorrectionDays',
            text: i18n.fiRegistryGapsGridColumnCorrectionDay
        }, {
            dataIndex: 'fina_fiRegistryGapDetailCorrectionLetterNumber',
            text: i18n.fiRegistryGapsGridColumnCorrectionLetterNumber
        }, {
            text: i18n.createdAt,
            dataIndex: 'createdAt',
            renderer: Ext.util.Format.dateRenderer(first.config.Config.timeFormat)
        }, {
            flex: 0,
            menuDisabled: true,
            sortable: false,
            hideable: false,
            resizable: false,
            xtype: 'actioncolumn',
            align: 'center',
            items: [{
                iconCls: 'x-fa fa-trash',
                handler: 'onDeleteGapDetailObjectClick'
            }]
        },]
    },


    bbar: {
        xtype: 'pagingtoolbar',
        layout: {
            type: 'hbox',
            pack: 'center'
        }
    }

});