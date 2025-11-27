Ext.define('first.view.task.TaskItemView', {
    extend: 'Ext.grid.Panel',

    requires: [
        'Ext.grid.column.Action',
        'Ext.grid.column.RowNumberer',
        'Ext.util.Format',
        'Ext.window.Toast',
        'first.store.task.TaskItemStore',
        'first.view.task.TaskItemViewController'
    ],

    controller: 'taskItemViewController',

    columnLines: true,

    bind: {
        selection: '{selectedTaskItem}'
    },

    tbar: {
        cls:'firstFiRegistryTbar',
        bind: {
            hidden: '{hideToolbar}'
        },
        items: [{
            text: i18n.add,
            iconCls: 'x-fa fa-plus-circle',
            handler: 'onAddTaskItemClick'
        }, {
            text: i18n.remove,
            iconCls: 'x-fa fa-minus-circle',
            disabled: true,
            bind: {
                disabled: '{!selectedTaskItem}'
            },
            handler: 'onRemoveTaskItemClick'
        }]
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
            text: i18n.taskItemGridName,
            dataIndex: 'name'
        }, {
            text: i18n.taskItemGridCreatedBy,
            dataIndex: 'createdBy'
        }, {
            text: i18n.taskItemGridCreatedAt,
            dataIndex: 'createdAt',
            renderer: Ext.util.Format.dateRenderer(first.config.Config.timeFormat)
        }, {
            text: i18n.taskItemGridModifiedBy,
            dataIndex: 'modifiedBy'
        }, {
            text: i18n.taskItemGridModifiedAt,
            dataIndex: 'modifiedAt',
            renderer: Ext.util.Format.dateRenderer(first.config.Config.timeFormat)
        }, {
            menuDisabled: true,
            sortable: false,
            hideable: false,
            resizable: false,
            xtype: 'actioncolumn',
            items: [{
                iconCls: 'x-fa fa-cloud-download-alt',
                tooltip: i18n.download,
                handler: 'onDownloadItemActionClick'
            }]
        }]
    }
});
