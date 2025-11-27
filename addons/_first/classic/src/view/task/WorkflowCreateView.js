Ext.define('first.view.task.WorkflowCreateView', {
    extend: 'Ext.panel.Panel',

    xtype: 'workflowCreate',

    requires: [
        'Ext.form.FieldSet',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.layout.container.Column',
        'Ext.layout.container.Fit',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'Ext.resizer.Splitter',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Separator',
        'Ext.util.History',
        'WindowUtil',
        'first.util.WorkflowHelper',
        'first.view.task.WorkflowCreateViewController',
        'first.view.task.WorkflowCreateViewModel'
    ],

    controller: 'workflowCreateViewController',

    layout: {
        type: 'fit'
    },

    tbar: {
        cls: 'firstFiRegistryTbar',
        items: [{
            handler: function () {
                Ext.History.back();
            },
            iconCls: 'x-fa fa-arrow-left',
            cls: 'firstSystemButtons'
        }, {
            handler: function () {
                Ext.History.forward();
            },
            iconCls: 'x-fa fa-arrow-right',
            cls: 'firstSystemButtons'
        }, '-', {
            text: i18n.workflowStartProcess,
            cls: 'finaPrimaryBtn',
            iconCls: 'x-fa fa-cog',
            handler: 'onSubmitCreateNewTaskFormClick'
        }, {
            text: i18n.workflowDetailsViewProcessDiagram,
            cls: 'finaSecondaryBtn',
            iconCls: 'x-fa fa-file-image',
            handler: 'onViewProcessDiagramClick'
        }],
        bind: {
            hidden: '{isWindow}'
        }
    },

    bbar: {
        hidden: true,
        style: 'background-color:#f2efef',
        items: ['->', {
            text: i18n.cancel,
            iconCls: 'x-fa fa-times',
            handler: 'onCancelCreateNewTaskWindowClick',
            cls: 'finaSecondaryBtn'
        }, {
            text: i18n.workflowStartProcess,
            iconCls: 'x-fa fa-play',
            handler: 'onSubmitCreateNewTaskFormClick',
            cls: 'finaPrimaryBtn'
        }],
        bind: {
            hidden: '{!isWindow}'
        }
    },

    items: [{
        xtype: 'form',
        reference: 'workflowCreateNewForm',
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        items: [{
            flex: 2,
            reference: 'workflowCreateNewPanel',
            title: i18n.inputData,
            collapsible: true,
            scrollable: true,
            xtype: 'panel',
            layout: 'column',
            defaults: {
                columnWidth: 0.5,
                bodyPadding: 15,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                defaults: {
                    labelAlign: 'left',
                    labelWidth: first.util.WorkflowHelper.getLabelWidth(),
                    xtype: 'textfield'
                }
            },
            items: []
        }, {
            xtype: 'splitter',
            collapseTarget: 'prev'
        }, {
            flex: 1.5,
            layout: 'fit',
            reference: 'workflowCreateNewTabBarPanel'
        }],
        bind: {
            hidden: '{isWindow}'
        }
    }, {
        xtype: 'form',
        reference: 'workflowCreateNewFormWindow',
        hidden: true,
        scrollable: true,
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        defaults: {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                xtype: 'textfield',
                labelAlign: 'left',
                labelWidth: first.util.WorkflowHelper.getLabelWidth(),
                margin: '10 20'
            }
        },
        items: [],
        bind: {
            hidden: '{!isWindow}'
        }
    }]

});
