Ext.define('first.view.task.TaskView', {
    extend: 'Ext.grid.Panel',

    xtype: 'taskView',

    requires: [
        'Ext.button.Segmented',
        'Ext.grid.column.Action',
        'Ext.grid.column.RowNumberer',
        'Ext.grid.feature.Grouping',
        'Ext.layout.container.HBox',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Paging',
        'Ext.toolbar.Separator',
        'Ext.toolbar.Spacer',
        'Ext.util.Format',
        'Ext.util.History',
        'first.store.common.EcmGroupStore',
        'first.store.common.EcmUsersStore',
        'first.store.fi.FiTypeStore',
        'first.store.task.TaskStore',
        'first.view.task.TaskViewController',
        'first.view.task.TaskViewModel'
    ],

    controller: 'taskViewController',

    viewModel: 'taskViewModel',

    title: i18n.tasks,

    loadMask: true,

    columnLines: true,

    store: {
        type: 'taskStore'
    },

    bind: {
        selection: '{selectedTask}'
    },

    tbar: {
        cls: 'firstFiRegistryTbar',
        items: [{
            handler: function () {
                Ext.History.back();
            },
            iconCls: 'x-fa fa-arrow-left',
            cls: 'firstSystemButtons',
            hidden: true,
            bind: {
                hidden: '{nonClosableViewId ===  "taskView"}'
            }
        }, {
            handler: function () {
                Ext.History.forward();
            },
            iconCls: 'x-fa fa-arrow-right',
            cls: 'firstSystemButtons',
            hidden: true,
            bind: {
                hidden: '{nonClosableViewId ===  "taskView"}'
            }
        }, {
            xtype: 'tbseparator',
            hidden: true,
            bind: {
                hidden: '{nonClosableViewId ===  "taskView"}'
            }
        }, {
            xtype: 'segmentedbutton',
            allowMultiple: true,
            items: [{
                text: i18n.taskFilterAssignedToMe,
                iconCls: 'x-fa fa-user',
                pressed: true,
                key: 'assigned_to_me',
                handler: 'onFilterTaskButtonClick'
            }, {
                text: i18n.taskFilterActive,
                iconCls: 'x-fa fa-calendar-check',
                pressed: true,
                key: 'active',
                handler: 'onFilterTaskButtonClick'
            }, {
                text: i18n.taskFilterCompleted,
                iconCls: 'x-fa fa-calendar-minus',
                pressed: true,
                key: 'completed',
                handler: 'onFilterTaskButtonClick'
            }]
        }, '->', {
            text: i18n.taskStartNewProcess,
            iconCls: 'x-fa fa-cog',
            disabled: true,
            menu: {
                reference: 'startNewTaskMenu',
                items: []
            },
            listeners: {
                afterrender: 'onAfterStartNewTaskButtonRender'
            }
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
            menuDisabled: true,
            sortable: false,
            hideable: false,
            resizable: false,
            xtype: 'actioncolumn',
            width: 130,
            items: [{
                iconCls: 'x-fa fa-edit',
                tooltip: i18n.taskGridActionEdit,
                handler: 'editTaskActionClickHandler',
                isDisabled: function (view, rowIndex, colIndex, item, record) {
                    return record.get('state') === 'completed';
                }
            }, '', {
                iconCls: 'x-fa fa-eye',
                tooltip: i18n.taskGridActionView,
                handler: 'viewTaskActionClickHandler'
            }, '', {
                iconCls: 'x-fa fa-cog',
                tooltip: i18n.taskGridActionViewProcess,
                handler: 'viewWorkflowActionClickHandler',
                isDisabled: function (view, rowIndex, colIndex, item, record) {
                    return record.get('isWorkflowDetailsViewDisabled');
                }
            }, '', {
                iconCls: 'x-fa fa-building',
                tooltip: i18n.fiRegistry,
                handler: 'openFiRegistry',
                isDisabled: function (view, rowIndex, colIndex, item, record) {
                    return !record.get('fiRegistryId');
                }
            }]
        }, {
            text: i18n.taskGridColumnStatus,
            dataIndex: 'state',
            renderer: 'renderStateColumn',
            sortable: false
        }, {
            flex: 3,
            text: i18n.taskGridColumnName,
            dataIndex: 'description',
            renderer: function (value) {
                return i18n[value] || value;
            }
        }, {
            flex: 2,
            text: i18n.taskGridColumnAssignee,
            dataIndex: 'assignee'
        }, {
            text: i18n.taskGridColumnStarted,
            dataIndex: 'startedAt',
            renderer: Ext.util.Format.dateRenderer(first.config.Config.timeFormat)
        }, {
            text: i18n.taskGridColumnEnded,
            dataIndex: 'endedAt',
            renderer: Ext.util.Format.dateRenderer(first.config.Config.timeFormat)
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
