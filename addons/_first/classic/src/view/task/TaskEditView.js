Ext.define('first.view.task.TaskEditView', {
    extend: 'Ext.panel.Panel',

    xtype: 'taskEdit',

    requires: [
        'Ext.form.FieldSet',
        'Ext.form.field.Text',
        'Ext.layout.container.VBox',
        'Ext.toolbar.Fill',
        'first.view.task.TaskEditViewModel',
        'first.view.task.TaskEditViewController'
    ],

    controller: 'taskEditViewController',

    bind: {
        title: '{title}'
    },

    layout: {
        type: 'fit'
    },

    tbar: {
        cls:'firstFiRegistryTbar',
        items: [{
            iconCls: 'x-fa fa-arrow-left',
            cls:'firstSystemButtons',
            handler: function () {
                Ext.History.back();
            }
        }, {
            iconCls: 'x-fa fa-arrow-right',
            cls:'firstSystemButtons',
            handler: function () {
                Ext.History.forward();
            }
        }, '|', {
            text: i18n.save,
            iconCls: 'x-fa fa-save',
            cls: 'finaSecondaryBtn',
            hidden: true,
            disabled: true,
            handler: 'onSaveTaskClickHandler',
            bind: {
                hidden: '{!editable}',
                disabled: '{taskReassignInfo.isTaskReassignProgress}'
            }
        }, {
            text: i18n.submit,
            iconCls: 'x-fa fa-arrow-circle-up',
            cls: 'finaPrimaryBtn',
            hidden: true,
            disabled: true,
            handler: 'onSubmitTaskClickHandler',
            bind: {
                hidden: '{!editable}',
                disabled: '{taskReassignInfo.isTaskReassignProgress}'
            }
        }, {
            text: i18n.workflowDetailsViewProcessDiagram,
            iconCls: 'x-fa fa-file-image',
            cls: 'finaSecondaryBtn',
            handler: 'onViewProcessDiagramClick'
        }, {
            text: i18n.taskGridActionViewProcess,
            iconCls: 'x-fa fa-cog',
            cls: 'finaSecondaryBtn',
            handler: 'onViewProcessClick'
        }, {
            text: i18n.fiRegistry,
            iconCls: 'x-fa fa-building',
            cls: 'finaSecondaryBtn',
            hidden: true,
            bind: {
                hidden: '{!isFiRegistryAvailable}'
            },
            handler: 'onViewFiRegistryClick'
        }, '->', {
            text: i18n.reassign,
            iconCls: 'x-fa fa-share-square',
            cls: 'finaSecondaryBtn',
            hidden: true,
            disabled: true,
            handler: 'onReassignTaskClickHandler',
            bind: {
                hidden: '{!taskReassignInfo.isTaskReassignable || !editable}',
                disabled: '{taskReassignInfo.isTaskReassignProgress}'
            }
        }, {
            xtype: 'combobox',
            store: {
                type: 'ecmUsersStore'
            },
            emptyText: i18n.taskEditSelectUserEmpty + '...',
            allowBlank: false,
            valueField: 'id',
            displayField: 'displayName',
            queryMode: 'local',
            forceSelection: true,
            filterPickList: true,
            listConfig: {
                itemTpl: [
                    '<div data-qtip="{description}">{displayName}</div>'
                ]
            },
            hidden: true,
            bind: {
                hidden: '{!taskReassignInfo.isTaskReassignProgress}',
                value: '{taskReassignInfo.taskReassignUser}'
            }
        }, {
            text: i18n.cancel,
            iconCls: 'x-fa fa-times',
            cls: 'finaSecondaryBtn',
            handler: 'onReassignTaskCancelClickHandler',
            hidden: true,
            bind: {
                hidden: '{!taskReassignInfo.isTaskReassignProgress}'
            }
        }, {
            text: i18n.assign,
            iconCls: 'x-fa fa-check-circle',
            cls: 'finaPrimaryBtn',
            hidden: true,
            disabled: true,
            handler: 'onReassignTaskSubmitClickHandler',
            bind: {
                hidden: '{!taskReassignInfo.isTaskReassignProgress}',
                disabled: '{!taskReassignInfo.taskReassignUser}'
            }
        }]
    },

    items: [{
        xtype: 'form',
        reference: 'taskEditForm',
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        items: [{
            flex: 2,
            reference: 'taskEditPanel',
            title: i18n.inputData,
            collapsible: true,
            scrollable: true,
            xtype: 'panel',
            layout: 'column',
            hidden: true,
            defaults: {
                columnWidth: 0.5,
                bodyPadding: 15,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                defaults: {
                    labelAlign: 'left',
                    labelWidth: first.util.WorkflowHelper.getLabelWidth()
                }
            },
            items: [],
            bind: {
                hidden: '{!taskEditPanelVisible}'
            }
        }, {
            xtype: 'splitter',
            hidden: true,
            collapseTarget: 'prev',
            bind: {
                hidden: '{!taskEditPanelVisible}'
            }
        }, {
            flex: 1.5,
            layout: 'fit',
            reference: 'taskEditTabBarPanel'
        }]
    }]

});
